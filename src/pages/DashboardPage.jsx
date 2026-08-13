import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarProdutos } from '../lib/produtosApi'
import { contarClientes } from '../lib/clientesApi'
import { listarUltimasMovimentacoes } from '../lib/movimentacoesApi'

function formatarData(dataIso) {
  return new Date(dataIso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function DashboardPage() {
  const [produtos, setProdutos] = useState([])
  const [totalClientes, setTotalClientes] = useState(0)
  const [ultimasMovimentacoes, setUltimasMovimentacoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregar() {
      setCarregando(true)
      setErro('')
      try {
        const [dadosProdutos, dadosTotalClientes, dadosMovimentacoes] = await Promise.all([
          listarProdutos(),
          contarClientes(),
          listarUltimasMovimentacoes(8),
        ])
        setProdutos(dadosProdutos)
        setTotalClientes(dadosTotalClientes)
        setUltimasMovimentacoes(dadosMovimentacoes)
      } catch (e) {
        setErro('Não foi possível carregar os dados do dashboard. Verifique a conexão com o Supabase.')
        console.error(e)
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

  const produtosEstoqueBaixo = produtos.filter((p) => p.quantidade < p.estoque_minimo)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="text-sm text-slate-500">Visão geral do estoque e das vendas.</p>

      {carregando && (
        <p className="mt-8 text-center text-sm text-slate-500">Carregando...</p>
      )}

      {!carregando && erro && (
        <div className="mt-8 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {erro}
        </div>
      )}

      {!carregando && !erro && (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Produtos cadastrados</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{produtos.length}</p>
            </div>
            <div
              className={`rounded-lg border p-5 shadow-sm ${
                produtosEstoqueBaixo.length > 0
                  ? 'border-red-300 bg-red-50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <p className={produtosEstoqueBaixo.length > 0 ? 'text-sm text-red-700' : 'text-sm text-slate-500'}>
                Estoque abaixo do mínimo
              </p>
              <p
                className={`mt-1 text-3xl font-bold ${
                  produtosEstoqueBaixo.length > 0 ? 'text-red-700' : 'text-slate-900'
                }`}
              >
                {produtosEstoqueBaixo.length}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Clientes cadastrados</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{totalClientes}</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Estoque baixo</h2>

              {produtosEstoqueBaixo.length === 0 ? (
                <p className="mt-4 text-sm text-slate-400">
                  Nenhum produto abaixo do estoque mínimo.
                </p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {produtosEstoqueBaixo.map((produto) => (
                    <li key={produto.id}>
                      <Link
                        to={`/produtos/${produto.id}/editar`}
                        className="flex items-center justify-between gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 transition-colors hover:bg-red-100"
                      >
                        <span className="text-sm font-medium text-slate-800">{produto.nome}</span>
                        <span className="shrink-0 text-sm font-semibold text-red-700">
                          {produto.quantidade} / mín. {produto.estoque_minimo}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Últimas movimentações</h2>

              {ultimasMovimentacoes.length === 0 ? (
                <p className="mt-4 text-sm text-slate-400">Nenhuma movimentação registrada ainda.</p>
              ) : (
                <ul className="mt-4 divide-y divide-slate-100">
                  {ultimasMovimentacoes.map((mov) => (
                    <li key={mov.id} className="py-3">
                      <div className="flex items-center justify-between gap-3">
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
                              {mov.produto?.nome ?? 'Produto removido'}
                            </p>
                            <p className="text-xs text-slate-400">
                              {mov.quantidade} unidade{mov.quantidade === 1 ? '' : 's'}
                              {mov.venda?.cliente?.nome ? ` — ${mov.venda.cliente.nome}` : ''}
                            </p>
                          </div>
                        </div>
                        <span className="shrink-0 text-xs text-slate-400">
                          {formatarData(mov.created_at)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  )
}
