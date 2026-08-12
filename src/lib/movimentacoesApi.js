import { supabase } from './supabaseClient'

export async function registrarMovimentacao({ produto_id, tipo, quantidade, observacao }) {
  const { data, error } = await supabase.rpc('registrar_movimentacao_estoque', {
    p_produto_id: produto_id,
    p_tipo: tipo,
    p_quantidade: quantidade,
    p_observacao: observacao?.trim() || null,
  })

  if (error) throw error
  return data
}

export async function listarMovimentacoes(produtoId) {
  const { data, error } = await supabase
    .from('movimentacoes_estoque')
    .select('*')
    .eq('produto_id', produtoId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw error
  return data
}
