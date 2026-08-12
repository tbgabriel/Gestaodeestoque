import { supabase } from './supabaseClient'

export async function listarClientes() {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('nome', { ascending: true })

  if (error) throw error
  return data
}

export async function contarClientes() {
  const { count, error } = await supabase
    .from('clientes')
    .select('*', { count: 'exact', head: true })

  if (error) throw error
  return count
}

export async function buscarCliente(id) {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function criarCliente(cliente) {
  const { data, error } = await supabase
    .from('clientes')
    .insert(cliente)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function atualizarCliente(id, cliente) {
  const { data, error } = await supabase
    .from('clientes')
    .update(cliente)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function excluirCliente(id) {
  const { error } = await supabase.from('clientes').delete().eq('id', id)
  if (error) throw error
}
