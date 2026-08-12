import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { listarClientes, excluirCliente } from '../lib/clientesApi'
import ConfirmDialog from '../components/ConfirmDialog'

export default function ClientesPage() {
  const [clientes, setClientes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [clienteParaExcluir, setClienteParaExcluir] = useState(null)
  const [excluindo, setExcluindo] = useState(false)

  useEffect(() => {
    carregarClientes()
  }, [])

  async function carregarClientes() {
    setCarregando(true)
    setErro('')
    try {
      const dados = await listarClientes()
      setClientes(dados)
    } catch (e) {
      setErro('Não foi possível carregar os clientes. Verifique a conexão com o Supabase.')
      console.error(e)
    } finally {
      setCarregando(false)
    }
  }

  async function confirmarExclusao() {
    if (!clienteParaExcluir) return
    setExcluindo(true)
    try {
      await excluirCliente(clienteParaExcluir.id)
      setClientes((atual) => atual.filter((c) => c.id !== clienteParaExcluir.id))
      toast.success('Cliente excluído com sucesso.')
      setClienteParaExcluir(null)
    } catch (e) {
      toast.error('Erro ao excluir o cliente.')
      console.error(e)
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
          <p className="text-sm text-slate-500">
            {clientes.length} cliente{clientes.length === 1 ? '' : 's'} cadastrado
            {clientes.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link
          to="/clientes/novo"
          className="inline-flex justify-center rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"
        >
          + Novo cliente
        </Link>
      </div>

      {carregando && (
        <p className="mt-8 text-center text-sm text-slate-500">Carregando clientes...</p>
      )}

      {!carregando && erro && (
        <div className="mt-8 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {erro}
        </div>
      )}

      {!carregando && !erro && clientes.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-slate-500">Nenhum cliente cadastrado ainda.</p>
          <Link
            to="/clientes/novo"
            className="mt-3 inline-block text-sm font-medium text-violet-600 hover:text-violet-700"
          >
            Cadastrar o primeiro cliente
          </Link>
        </div>
      )}

      {!carregando && !erro && clientes.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <ul className="divide-y divide-slate-100">
            {clientes.map((cliente) => (
              <li
                key={cliente.id}
                className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div>
                  <p className="font-medium text-slate-900">{cliente.nome}</p>
                  <p className="text-sm text-slate-500">{cliente.telefone}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/clientes/${cliente.id}/editar`}
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50 sm:flex-none"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => setClienteParaExcluir(cliente)}
                    className="flex-1 rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 sm:flex-none"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ConfirmDialog
        aberto={Boolean(clienteParaExcluir)}
        titulo="Excluir cliente"
        mensagem={`Tem certeza que deseja excluir "${clienteParaExcluir?.nome}"? Essa ação não pode ser desfeita.`}
        textoConfirmar="Excluir"
        confirmando={excluindo}
        aoConfirmar={confirmarExclusao}
        aoCancelar={() => setClienteParaExcluir(null)}
      />
    </div>
  )
}
