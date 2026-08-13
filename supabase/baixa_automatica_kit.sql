-- Precisamos trocar a assinatura da função (novo parâmetro p_venda_id), então
-- removemos a versão antiga antes de recriar.
drop function if exists registrar_movimentacao_estoque(uuid, text, integer, text);

create or replace function registrar_movimentacao_estoque(
  p_produto_id uuid,
  p_tipo text,
  p_quantidade integer,
  p_observacao text default null,
  p_venda_id uuid default null
)
returns produtos
language plpgsql
as $$
declare
  v_produto produtos;
  v_item record;
begin
  if p_tipo not in ('entrada', 'saida') then
    raise exception 'Tipo de movimentação inválido: %', p_tipo;
  end if;

  if p_quantidade <= 0 then
    raise exception 'A quantidade deve ser maior que zero';
  end if;

  perform 1 from produtos where id = p_produto_id for update;
  if not found then
    raise exception 'Produto não encontrado';
  end if;

  update produtos
  set quantidade = quantidade + case when p_tipo = 'entrada' then p_quantidade else -p_quantidade end
  where id = p_produto_id
  returning * into v_produto;

  insert into movimentacoes_estoque (produto_id, tipo, quantidade, observacao, venda_id)
  values (p_produto_id, p_tipo, p_quantidade, p_observacao, p_venda_id);

  -- Se for uma saída de um kit, desconta automaticamente os componentes que fazem parte dele
  if p_tipo = 'saida' and v_produto.eh_kit then
    for v_item in
      select produto_id, quantidade as quantidade_por_kit
      from kit_itens
      where kit_id = p_produto_id
    loop
      update produtos
      set quantidade = quantidade - (v_item.quantidade_por_kit * p_quantidade)
      where id = v_item.produto_id;

      insert into movimentacoes_estoque (produto_id, tipo, quantidade, observacao, venda_id)
      values (
        v_item.produto_id,
        'saida',
        v_item.quantidade_por_kit * p_quantidade,
        'Baixa automática por saída do kit "' || v_produto.nome || '"',
        p_venda_id
      );
    end loop;
  end if;

  return v_produto;
end;
$$;

grant execute on function registrar_movimentacao_estoque(uuid, text, integer, text, uuid) to anon, authenticated;

-- registrar_venda passa a chamar registrar_movimentacao_estoque para cada item,
-- em vez de duplicar a lógica de baixa — assim a baixa automática de kits
-- funciona também para vendas, não só para movimentações manuais.
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

    perform registrar_movimentacao_estoque(v_produto_id, 'saida', v_quantidade, 'Venda', v_venda.id);

    v_total := v_total + (v_quantidade * coalesce(v_preco, 0));
  end loop;

  update vendas set total = v_total where id = v_venda.id returning * into v_venda;

  return v_venda;
end;
$$;

grant execute on function registrar_venda(uuid, jsonb, text) to anon, authenticated;
