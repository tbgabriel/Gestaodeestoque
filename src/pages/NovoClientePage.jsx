import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import ClienteForm from '../components/ClienteForm'
import { criarCliente } from '../lib/clientesApi'

export default function NovoClientePage() {
  const [salvando, setSalvando] = useState(false)
  const navegar = useNavigate()

  async function lidarComSalvar(dadosCliente) {
    setSalvando(true)
    try {
      await criarCliente(dadosCliente)
      toast.success('Cliente cadastrado com sucesso.')
      navegar('/clientes')
    } catch (e) {
      toast.error('Erro ao cadastrar o cliente.')
      console.error(e)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
      <Link to="/clientes" className="text-sm text-slate-500 hover:text-slate-700">
        ← Voltar para clientes
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Novo cliente</h1>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <ClienteForm aoSalvar={lidarComSalvar} salvando={salvando} textoBotao="Cadastrar cliente" />
      </div>
    </div>
  )
}
