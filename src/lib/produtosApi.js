import { supabase } from './supabaseClient'

export async function listarProdutos() {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .order('nome', { ascending: true })

  if (error) throw error
  return data
}

export async function buscarProduto(id) {
  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function criarProduto(produto) {
  const { data, error } = await supabase
    .from('produtos')
    .insert(produto)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function atualizarProduto(id, produto) {
  const { data, error } = await supabase
    .from('produtos')
    .update(produto)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function excluirProduto(id) {
  const { error } = await supabase.from('produtos').delete().eq('id', id)
  if (error) throw error
}
