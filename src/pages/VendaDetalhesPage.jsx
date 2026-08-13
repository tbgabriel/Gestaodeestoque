import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { buscarVenda } from '../lib/vendasApi'

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

export default function VendaDetalhesPage() {
  const { id } = useParams()
  const [venda, setVenda] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregar() {
      setCarregando(true)
      setErro('')
      try {
        const dados = await buscarVenda(id)
        setVenda(dados)
      } catch (e) {
        setErro('Não foi possível carregar esta venda.')
        console.error(e)
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [id])

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link to="/vendas" className="text-sm text-slate-500 transition-colors hover:text-slate-700">
        ← Voltar para vendas
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Detalhes da venda</h1>

      {carregando && <p className="mt-6 text-sm text-slate-500">Carregando...</p>}

      {!carregando && erro && (
        <div className="mt-6 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {erro}
        </div>
      )}

      {!carregando && venda && (
        <div className="mt-6 space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-slate-400">Cliente</p>
                <p className="text-sm font-medium text-slate-800">
                  {venda.cliente?.nome ?? 'Venda avulsa (sem cliente)'}
                </p>
                {venda.cliente?.telefone && (
                  <p className="text-xs text-slate-500">{venda.cliente.telefone}</p>
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Data</p>
                <p className="text-sm font-medium text-slate-800">{formatarData(venda.created_at)}</p>
              </div>
            </div>
            {venda.observacao && (
              <div className="mt-3 border-t border-slate-100 pt-3">
                <p className="text-xs font-medium text-slate-400">Observação</p>
                <p className="text-sm text-slate-700">{venda.observacao}</p>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Itens</h2>
            <ul className="mt-4 divide-y divide-slate-100">
              {venda.itens.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.produto.nome}</p>
                    <p className="text-xs text-slate-400">
                      {item.quantidade} × {formatarMoeda(item.preco_unitario)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    {formatarMoeda(item.subtotal)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-sm font-medium text-slate-500">Total</span>
              <span className="text-xl font-bold text-slate-900">{formatarMoeda(venda.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
