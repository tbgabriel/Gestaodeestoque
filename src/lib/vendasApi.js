import { supabase } from './supabaseClient'

export async function listarVendas() {
  const { data, error } = await supabase
    .from('vendas')
    .select('id, total, observacao, created_at, cliente:cliente_id (id, nome)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function listarVendasPorCliente(clienteId) {
  const { data, error } = await supabase
    .from('vendas')
    .select('id, total, observacao, created_at, itens:venda_itens (id, quantidade, produto:produto_id (id, nome))')
    .eq('cliente_id', clienteId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function buscarVenda(id) {
  const { data, error } = await supabase
    .from('vendas')
    .select(
      'id, total, observacao, created_at, cliente:cliente_id (id, nome, telefone), itens:venda_itens (id, quantidade, preco_unitario, subtotal, produto:produto_id (id, nome))'
    )
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function registrarVenda({ cliente_id, itens, observacao }) {
  const { data, error } = await supabase.rpc('registrar_venda', {
    p_cliente_id: cliente_id || null,
    p_itens: itens.map((item) => ({
      produto_id: item.produto_id,
      quantidade: item.quantidade,
      preco_unitario: item.preco_unitario,
    })),
    p_observacao: observacao?.trim() || null,
  })

  if (error) throw error
  return data
}
