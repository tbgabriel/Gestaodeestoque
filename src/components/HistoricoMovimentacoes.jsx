import { useEffect, useState } from 'react'
import { listarMovimentacoes } from '../lib/movimentacoesApi'

function formatarData(dataIso) {
  return new Date(dataIso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function HistoricoMovimentacoes({ produtoId }) {
  const [movimentacoes, setMovimentacoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregar() {
      setCarregando(true)
      setErro('')
      try {
        const dados = await listarMovimentacoes(produtoId)
        setMovimentacoes(dados)
      } catch (e) {
        setErro('Não foi possível carregar o histórico de movimentações.')
        console.error(e)
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [produtoId])

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Histórico de movimentações</h2>
      <p className="mt-1 text-sm text-slate-500">Últimas 20 entradas e saídas deste produto.</p>

      {carregando && <p className="mt-4 text-sm text-slate-500">Carregando...</p>}

      {!carregando && erro && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {erro}
        </div>
      )}

      {!carregando && !erro && movimentacoes.length === 0 && (
        <p className="mt-4 text-sm text-slate-400">Nenhuma movimentação registrada ainda.</p>
      )}

      {!carregando && !erro && movimentacoes.length > 0 && (
        <ul className="mt-4 divide-y divide-slate-100">
          {movimentacoes.map((mov) => (
            <li key={mov.id} className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-center gap-3">
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    mov.tipo === 'entrada'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {mov.tipo === 'entrada' ? '↑ Entrada' : '↓ Saída'}
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {mov.quantidade} unidade{mov.quantidade === 1 ? '' : 's'}
                  </p>
                  {mov.observacao && (
                    <p className="text-xs text-slate-400">{mov.observacao}</p>
                  )}
                </div>
              </div>
              <span className="shrink-0 text-xs text-slate-400">{formatarData(mov.created_at)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
