import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarVendasPorCliente } from '../lib/vendasApi'

function formatarMoeda(valor) {
  return (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatarData(dataIso) {
  return new Date(dataIso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function HistoricoComprasCliente({ clienteId }) {
  const [vendas, setVendas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregar() {
      setCarregando(true)
      setErro('')
      try {
        const dados = await listarVendasPorCliente(clienteId)
        setVendas(dados)
      } catch (e) {
        setErro('Não foi possível carregar o histórico de compras.')
        console.error(e)
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [clienteId])

  const totalGasto = vendas.reduce((soma, v) => soma + (v.total || 0), 0)

  return (
    <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Histórico de compras</h2>
        {vendas.length > 0 && (
          <span className="text-sm font-medium text-slate-500">
            Total: {formatarMoeda(totalGasto)}
          </span>
        )}
      </div>

      {carregando && <p className="mt-4 text-sm text-slate-500">Carregando...</p>}

      {!carregando && erro && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {erro}
        </div>
      )}

      {!carregando && !erro && vendas.length === 0 && (
        <p className="mt-4 text-sm text-slate-400">Este cliente ainda não fez nenhuma compra.</p>
      )}

      {!carregando && !erro && vendas.length > 0 && (
        <ul className="mt-4 divide-y divide-slate-100">
          {vendas.map((venda) => (
            <li key={venda.id}>
              <Link
                to={`/vendas/${venda.id}`}
                className="flex flex-col gap-1 py-3 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 break-words">
                    {venda.itens.map((i) => i.produto.nome).join(', ')}
                  </p>
                  <p className="text-xs text-slate-400">{formatarData(venda.created_at)}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-slate-700">
                  {formatarMoeda(venda.total)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
