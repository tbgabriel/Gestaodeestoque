import { Fragment, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarItensDoKit } from '../lib/kitItensApi'

function formatarMoeda(valor) {
  if (valor === null || valor === undefined) return '—'
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function IconeLapis() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  )
}

function IconeLixeira() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  )
}

function IconeMovimentar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M17 3v12" />
      <path d="M13 11l4 4 4-4" />
      <path d="M7 21V9" />
      <path d="M3 13l4-4 4 4" />
    </svg>
  )
}

function IconeChevron({ expandido }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${expandido ? 'rotate-90' : ''}`}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

const colunas = [
  { chave: 'nome', label: 'Produto' },
  { chave: 'categoria', label: 'Categoria' },
  { chave: 'quantidade', label: 'Estoque' },
  { chave: 'estoque_minimo', label: 'Mínimo' },
  { chave: 'preco_venda', label: 'Preço venda' },
]

export default function ProdutosTable({ produtos, aoExcluir, aoMovimentar }) {
  const [ordenarPor, setOrdenarPor] = useState('nome')
  const [direcao, setDirecao] = useState('asc')
  const [expandidos, setExpandidos] = useState(new Set())
  const [itensPorKit, setItensPorKit] = useState({})

  function alternarOrdenacao(chave) {
    if (chave === ordenarPor) {
      setDirecao((atual) => (atual === 'asc' ? 'desc' : 'asc'))
    } else {
      setOrdenarPor(chave)
      setDirecao('asc')
    }
  }

  const produtosOrdenados = useMemo(() => {
    const copia = [...produtos]
    copia.sort((a, b) => {
      let valorA = a[ordenarPor]
      let valorB = b[ordenarPor]

      if (typeof valorA !== 'number') {
        valorA = (valorA ?? '').toString().toLowerCase()
        valorB = (valorB ?? '').toString().toLowerCase()
        const comparacao = valorA.localeCompare(valorB)
        return direcao === 'asc' ? comparacao : -comparacao
      }

      valorA = valorA ?? 0
      valorB = valorB ?? 0
      const comparacao = valorA - valorB
      return direcao === 'asc' ? comparacao : -comparacao
    })
    return copia
  }, [produtos, ordenarPor, direcao])

  async function alternarExpandir(produto) {
    const id = produto.id
    setExpandidos((atual) => {
      const novo = new Set(atual)
      if (novo.has(id)) {
        novo.delete(id)
      } else {
        novo.add(id)
      }
      return novo
    })

    if (!itensPorKit[id]) {
      setItensPorKit((atual) => ({ ...atual, [id]: { carregando: true } }))
      try {
        const itens = await listarItensDoKit(id)
        setItensPorKit((atual) => ({ ...atual, [id]: { itens } }))
      } catch (e) {
        setItensPorKit((atual) => ({ ...atual, [id]: { erro: true } }))
        console.error(e)
      }
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-100 text-sm">
        <thead>
          <tr>
            {colunas.map((coluna) => (
              <th
                key={coluna.chave}
                onClick={() => alternarOrdenacao(coluna.chave)}
                className="sticky top-0 z-10 select-none whitespace-nowrap bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 cursor-pointer transition-colors hover:text-slate-700"
              >
                <span className="inline-flex items-center gap-1">
                  {coluna.label}
                  {ordenarPor === coluna.chave && <span>{direcao === 'asc' ? '▲' : '▼'}</span>}
                </span>
              </th>
            ))}
            <th className="sticky top-0 z-10 whitespace-nowrap bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Tipo
            </th>
            <th className="sticky top-0 z-10 whitespace-nowrap bg-slate-50 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {produtosOrdenados.map((produto) => {
            const estoqueBaixo = produto.quantidade < produto.estoque_minimo
            const expandido = expandidos.has(produto.id)
            const dadosKit = itensPorKit[produto.id]

            return (
              <Fragment key={produto.id}>
                <tr
                  onClick={produto.eh_kit ? () => alternarExpandir(produto) : undefined}
                  className={`transition-colors hover:bg-slate-50 ${
                    produto.eh_kit ? 'cursor-pointer' : ''
                  } ${estoqueBaixo ? 'bg-red-50' : ''}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {produto.eh_kit ? (
                        <IconeChevron expandido={expandido} />
                      ) : (
                        <span className="inline-block h-4 w-4 shrink-0" />
                      )}
                      <span className="font-medium text-slate-900">{produto.nome}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{produto.categoria || '—'}</td>
                  <td
                    className={`px-4 py-3 font-medium ${
                      estoqueBaixo ? 'text-red-700' : 'text-slate-700'
                    }`}
                  >
                    {produto.quantidade}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{produto.estoque_minimo}</td>
                  <td className="px-4 py-3 text-slate-700">{formatarMoeda(produto.preco_venda)}</td>
                  <td className="px-4 py-3">
                    {produto.eh_kit && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                        Kit
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title="Movimentar estoque"
                        onClick={() => aoMovimentar(produto)}
                        className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-amber-50 hover:text-amber-600"
                      >
                        <IconeMovimentar />
                      </button>
                      <Link
                        to={`/produtos/${produto.id}/editar`}
                        title="Editar"
                        className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                      >
                        <IconeLapis />
                      </Link>
                      <button
                        type="button"
                        title="Excluir"
                        onClick={() => aoExcluir(produto)}
                        className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <IconeLixeira />
                      </button>
                    </div>
                  </td>
                </tr>

                {produto.eh_kit && expandido && (
                  <tr>
                    <td colSpan={7} className="bg-slate-50 px-4 py-3">
                      {dadosKit?.carregando && (
                        <p className="text-xs text-slate-400">Carregando itens do kit...</p>
                      )}
                      {dadosKit?.erro && (
                        <p className="text-xs text-red-600">Não foi possível carregar os itens deste kit.</p>
                      )}
                      {dadosKit?.itens && dadosKit.itens.length === 0 && (
                        <p className="text-xs text-slate-400">Este kit ainda não tem itens vinculados.</p>
                      )}
                      {dadosKit?.itens && dadosKit.itens.length > 0 && (
                        <ul className="space-y-1">
                          {dadosKit.itens.map((item) => (
                            <li key={item.id} className="flex items-center gap-2 text-xs text-slate-600">
                              <span className="inline-block h-1 w-1 rounded-full bg-slate-400" />
                              <span className="font-medium text-slate-700">{item.quantidade}×</span>
                              <span>{item.produto.nome}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
