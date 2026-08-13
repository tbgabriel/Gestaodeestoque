import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import ClienteForm from '../components/ClienteForm'
import HistoricoComprasCliente from '../components/HistoricoComprasCliente'
import { atualizarCliente, buscarCliente } from '../lib/clientesApi'

export default function EditarClientePage() {
  const { id } = useParams()
  const navegar = useNavigate()
  const [cliente, setCliente] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    async function carregar() {
      setCarregando(true)
      setErro('')
      try {
        const dados = await buscarCliente(id)
        setCliente(dados)
      } catch (e) {
        setErro('Não foi possível carregar este cliente.')
        console.error(e)
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [id])

  async function lidarComSalvar(dadosCliente) {
    setSalvando(true)
    try {
      await atualizarCliente(id, dadosCliente)
      toast.success('Cliente atualizado com sucesso.')
      navegar('/clientes')
    } catch (e) {
      toast.error('Erro ao atualizar o cliente.')
      console.error(e)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
      <Link to="/clientes" className="text-sm text-slate-500 transition-colors hover:text-slate-700">
        ← Voltar para clientes
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Editar cliente</h1>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        {carregando && <p className="text-sm text-slate-500">Carregando...</p>}

        {!carregando && erro && (
          <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            {erro}
          </div>
        )}

        {!carregando && cliente && (
          <ClienteForm
            valoresIniciais={cliente}
            aoSalvar={lidarComSalvar}
            salvando={salvando}
            textoBotao="Salvar alterações"
          />
        )}
      </div>

      {!carregando && cliente && <HistoricoComprasCliente clienteId={cliente.id} />}
    </div>
  )
}
