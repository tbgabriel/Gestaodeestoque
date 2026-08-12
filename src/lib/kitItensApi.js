import { supabase } from './supabaseClient'

export async function listarItensDoKit(kitId) {
  const { data, error } = await supabase
    .from('kit_itens')
    .select('id, quantidade, produto_id, produto:produto_id (id, nome, categoria)')
    .eq('kit_id', kitId)
    .order('id', { ascending: true })

  if (error) throw error
  return data
}

export async function listarProdutosDisponiveisParaKit(kitId) {
  const { data, error } = await supabase
    .from('produtos')
    .select('id, nome, categoria')
    .eq('eh_kit', false)
    .neq('id', kitId)
    .order('nome', { ascending: true })

  if (error) throw error
  return data
}

export async function adicionarItemAoKit({ kit_id, produto_id, quantidade }) {
  const { data, error } = await supabase
    .from('kit_itens')
    .insert({ kit_id, produto_id, quantidade })
    .select('id, quantidade, produto_id, produto:produto_id (id, nome, categoria)')
    .single()

  if (error) throw error
  return data
}

export async function atualizarQuantidadeItem(itemId, quantidade) {
  const { error } = await supabase
    .from('kit_itens')
    .update({ quantidade })
    .eq('id', itemId)

  if (error) throw error
}

export async function removerItemDoKit(itemId) {
  const { error } = await supabase.from('kit_itens').delete().eq('id', itemId)
  if (error) throw error
}

export async function removerTodosItensDoKit(kitId) {
  const { error } = await supabase.from('kit_itens').delete().eq('kit_id', kitId)
  if (error) throw error
}
