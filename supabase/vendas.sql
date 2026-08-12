-- Vendas e itens de venda
create table if not exists vendas (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references clientes (id) on delete set null,
  total numeric(10, 2) not null default 0,
  observacao text,
  created_at timestamptz not null default now()
);

create table if not exists venda_itens (
  id uuid primary key default gen_random_uuid(),
  venda_id uuid not null references vendas (id) on delete cascade,
  produto_id uuid not null references produtos (id) on delete restrict,
  quantidade integer not null check (quantidade > 0),
  preco_unitario numeric(10, 2) not null,
  subtotal numeric(10, 2) generated always as (quantidade * preco_unitario) stored
);

create index if not exists idx_vendas_cliente_id on vendas (cliente_id);
create index if not exists idx_venda_itens_venda_id on venda_itens (venda_id);
create index if not exists idx_venda_itens_produto_id on venda_itens (produto_id);

-- Liga cada baixa de estoque à venda que a originou (em vez de um texto solto em "observacao")
alter table movimentacoes_estoque
  add column if not exists venda_id uuid references vendas (id) on delete set null;

-- Função que cria a venda, os itens, dá baixa no estoque e registra o histórico,
-- tudo em uma única transação atômica.
create or replace function registrar_venda(
  p_cliente_id uuid,
  p_itens jsonb,
  p_observacao text default null
)
returns vendas
language plpgsql
as $$
declare
  v_venda vendas;
  v_item jsonb;
  v_total numeric(10, 2) := 0;
  v_produto_id uuid;
  v_quantidade integer;
  v_preco numeric(10, 2);
begin
  if p_itens is null or jsonb_array_length(p_itens) = 0 then
    raise exception 'A venda precisa ter pelo menos um item';
  end if;

  insert into vendas (cliente_id, observacao, total)
  values (p_cliente_id, p_observacao, 0)
  returning * into v_venda;

  for v_item in select * from jsonb_array_elements(p_itens)
  loop
    v_produto_id := (v_item ->> 'produto_id')::uuid;
    v_quantidade := (v_item ->> 'quantidade')::integer;
    v_preco := (v_item ->> 'preco_unitario')::numeric;

    if not exists (select 1 from produtos where id = v_produto_id) then
      raise exception 'Produto % não encontrado', v_produto_id;
    end if;

    if v_quantidade is null or v_quantidade <= 0 then
      raise exception 'Quantidade inválida para o produto %', v_produto_id;
    end if;

    insert into venda_itens (venda_id, produto_id, quantidade, preco_unitario)
    values (v_venda.id, v_produto_id, v_quantidade, coalesce(v_preco, 0));

    update produtos
    set quantidade = quantidade - v_quantidade
    where id = v_produto_id;

    insert into movimentacoes_estoque (produto_id, tipo, quantidade, observacao, venda_id)
    values (v_produto_id, 'saida', v_quantidade, 'Venda', v_venda.id);

    v_total := v_total + (v_quantidade * coalesce(v_preco, 0));
  end loop;

  update vendas set total = v_total where id = v_venda.id returning * into v_venda;

  return v_venda;
end;
$$;

grant execute on function registrar_venda(uuid, jsonb, text) to anon, authenticated;
