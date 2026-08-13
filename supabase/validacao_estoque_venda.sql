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
  v_produto produtos;
  v_componente record;
  v_necessario integer;
begin
  if p_itens is null or jsonb_array_length(p_itens) = 0 then
    raise exception 'A venda precisa ter pelo menos um item';
  end if;

  -- Fase 1: valida o estoque de TODOS os itens (e, no caso de kits, de cada
  -- componente) antes de gravar qualquer coisa. "for update" trava as linhas
  -- já nesta fase para evitar que outra venda simultânea mude o estoque
  -- entre a validação e a baixa de fato.
  for v_item in select * from jsonb_array_elements(p_itens)
  loop
    v_produto_id := (v_item ->> 'produto_id')::uuid;
    v_quantidade := (v_item ->> 'quantidade')::integer;

    select * into v_produto from produtos where id = v_produto_id for update;
    if not found then
      raise exception 'Produto % não encontrado', v_produto_id;
    end if;

    if v_quantidade is null or v_quantidade <= 0 then
      raise exception 'Quantidade inválida para o produto "%"', v_produto.nome;
    end if;

    if v_produto.eh_kit then
      if v_produto.quantidade < v_quantidade then
        raise exception 'Estoque insuficiente para o kit "%". Disponível: %, solicitado: %.',
          v_produto.nome, v_produto.quantidade, v_quantidade;
      end if;

      for v_componente in
        select p.nome, p.quantidade, ki.quantidade as quantidade_por_kit
        from kit_itens ki
        join produtos p on p.id = ki.produto_id
        where ki.kit_id = v_produto.id
        for update of p
      loop
        v_necessario := v_componente.quantidade_por_kit * v_quantidade;
        if v_componente.quantidade < v_necessario then
          raise exception 'Estoque insuficiente para "%" (componente do kit "%"). Disponível: %, necessário: %.',
            v_componente.nome, v_produto.nome, v_componente.quantidade, v_necessario;
        end if;
      end loop;
    else
      if v_produto.quantidade < v_quantidade then
        raise exception 'Estoque insuficiente para "%". Disponível: %, solicitado: %.',
          v_produto.nome, v_produto.quantidade, v_quantidade;
      end if;
    end if;
  end loop;

  -- Fase 2: validação passou para todos os itens, agora grava a venda de fato
  insert into vendas (cliente_id, observacao, total)
  values (p_cliente_id, p_observacao, 0)
  returning * into v_venda;

  for v_item in select * from jsonb_array_elements(p_itens)
  loop
    v_produto_id := (v_item ->> 'produto_id')::uuid;
    v_quantidade := (v_item ->> 'quantidade')::integer;
    v_preco := (v_item ->> 'preco_unitario')::numeric;

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
