import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarVendas } from '../lib/vendasApi'

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

export default function VendasPage() {
  const [vendas, setVendas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregar() {
      setCarregando(true)
      setErro('')
      try {
        const dados = await listarVendas()
        setVendas(dados)
      } catch (e) {
        setErro('Não foi possível carregar as vendas. Verifique a conexão com o Supabase.')
        console.error(e)
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vendas</h1>
          <p className="text-sm text-slate-500">
            {vendas.length} venda{vendas.length === 1 ? '' : 's'} registrada
            {vendas.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link
          to="/vendas/nova"
          className="inline-flex justify-center rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"
        >
          + Nova venda
        </Link>
      </div>

      {carregando && <p className="mt-8 text-center text-sm text-slate-500">Carregando vendas...</p>}

      {!carregando && erro && (
        <div className="mt-8 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {erro}
        </div>
      )}

      {!carregando && !erro && vendas.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-slate-500">Nenhuma venda registrada ainda.</p>
          <Link
            to="/vendas/nova"
            className="mt-3 inline-block text-sm font-medium text-violet-600 hover:text-violet-700"
          >
            Registrar a primeira venda
          </Link>
        </div>
      )}

      {!carregando && !erro && vendas.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <ul className="divide-y divide-slate-100">
            {vendas.map((venda) => (
              <li key={venda.id}>
                <Link
                  to={`/vendas/${venda.id}`}
                  className="flex flex-col gap-1 px-4 py-4 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {venda.cliente?.nome ?? 'Venda avulsa (sem cliente)'}
                    </p>
                    <p className="text-sm text-slate-500">{formatarData(venda.created_at)}</p>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">
                    {formatarMoeda(venda.total)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
