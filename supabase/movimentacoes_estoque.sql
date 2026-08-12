-- Histórico de entradas e saídas de estoque
create table if not exists movimentacoes_estoque (
  id uuid primary key default gen_random_uuid(),
  produto_id uuid not null references produtos (id) on delete cascade,
  tipo text not null check (tipo in ('entrada', 'saida')),
  quantidade integer not null check (quantidade > 0),
  observacao text,
  created_at timestamptz not null default now()
);

create index if not exists idx_movimentacoes_produto_id on movimentacoes_estoque (produto_id);

-- Função que registra a movimentação e atualiza a quantidade do produto
-- em uma única transação atômica (evita inconsistência entre as duas tabelas).
create or replace function registrar_movimentacao_estoque(
  p_produto_id uuid,
  p_tipo text,
  p_quantidade integer,
  p_observacao text default null
)
returns produtos
language plpgsql
as $$
declare
  v_produto produtos;
begin
  if p_tipo not in ('entrada', 'saida') then
    raise exception 'Tipo de movimentação inválido: %', p_tipo;
  end if;

  if p_quantidade <= 0 then
    raise exception 'A quantidade deve ser maior que zero';
  end if;

  -- Trava a linha do produto para evitar condição de corrida entre
  -- movimentações simultâneas do mesmo produto.
  perform 1 from produtos where id = p_produto_id for update;

  if not found then
    raise exception 'Produto não encontrado';
  end if;

  update produtos
  set quantidade = quantidade + case when p_tipo = 'entrada' then p_quantidade else -p_quantidade end
  where id = p_produto_id
  returning * into v_produto;

  insert into movimentacoes_estoque (produto_id, tipo, quantidade, observacao)
  values (p_produto_id, p_tipo, p_quantidade, p_observacao);

  return v_produto;
end;
$$;

grant execute on function registrar_movimentacao_estoque(uuid, text, integer, text) to anon, authenticated;
