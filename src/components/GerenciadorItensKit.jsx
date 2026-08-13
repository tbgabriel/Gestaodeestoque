import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  adicionarItemAoKit,
  atualizarQuantidadeItem,
  listarItensDoKit,
  listarProdutosDisponiveisParaKit,
  removerItemDoKit,
} from '../lib/kitItensApi'

export default function GerenciadorItensKit({ kitId }) {
  const [itens, setItens] = useState([])
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const [produtoSelecionado, setProdutoSelecionado] = useState('')
  const [quantidadeNova, setQuantidadeNova] = useState(1)
  const [adicionando, setAdicionando] = useState(false)

  useEffect(() => {
    carregarDados()
  }, [kitId])

  async function carregarDados() {
    setCarregando(true)
    setErro('')
    try {
      const [itensDoKit, disponiveis] = await Promise.all([
        listarItensDoKit(kitId),
        listarProdutosDisponiveisParaKit(kitId),
      ])
      setItens(itensDoKit)
      setProdutosDisponiveis(disponiveis)
    } catch (e) {
      setErro('Não foi possível carregar os itens do kit.')
      console.error(e)
    } finally {
      setCarregando(false)
    }
  }

  async function lidarComAdicionar(evento) {
    evento.preventDefault()
    if (!produtoSelecionado) {
      toast.error('Escolha um produto para adicionar.')
      return
    }

    setAdicionando(true)
    try {
      const novoItem = await adicionarItemAoKit({
        kit_id: kitId,
        produto_id: produtoSelecionado,
        quantidade: Number(quantidadeNova) || 1,
      })
      setItens((atual) => [...atual, novoItem])
      setProdutoSelecionado('')
      setQuantidadeNova(1)
      toast.success('Item adicionado ao kit.')
    } catch (e) {
      if (e.code === '23505') {
        toast.error('Esse produto já está neste kit.')
      } else {
        toast.error('Erro ao adicionar item.')
      }
      console.error(e)
    } finally {
      setAdicionando(false)
    }
  }

  async function lidarComAtualizarQuantidade(item, novaQuantidade) {
    const quantidade = Number(novaQuantidade)
    if (!quantidade || quantidade < 1) return

    setItens((atual) =>
      atual.map((i) => (i.id === item.id ? { ...i, quantidade } : i))
    )

    try {
      await atualizarQuantidadeItem(item.id, quantidade)
    } catch (e) {
      toast.error('Erro ao atualizar quantidade.')
      console.error(e)
      carregarDados()
    }
  }

  async function lidarComRemover(item) {
    try {
      await removerItemDoKit(item.id)
      setItens((atual) => atual.filter((i) => i.id !== item.id))
      setProdutosDisponiveis((atual) =>
        [...atual, item.produto].sort((a, b) => a.nome.localeCompare(b.nome))
      )
      toast.success('Item removido do kit.')
    } catch (e) {
      toast.error('Erro ao remover item.')
      console.error(e)
    }
  }

  const produtosParaSelecionar = produtosDisponiveis.filter(
    (p) => !itens.some((i) => i.produto_id === p.id)
  )

  return (
    <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Itens deste kit</h2>
      <p className="mt-1 text-sm text-slate-500">
        Escolha quais produtos compõem este kit e em qual quantidade.
      </p>

      {carregando && <p className="mt-4 text-sm text-slate-500">Carregando itens...</p>}

      {!carregando && erro && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {erro}
        </div>
      )}

      {!carregando && !erro && (
        <>
          {itens.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">
              Nenhum item adicionado ainda.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {itens.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-2 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">{item.produto.nome}</p>
                    {item.produto.categoria && (
                      <p className="truncate text-xs text-slate-400">{item.produto.categoria}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={item.quantidade}
                      onChange={(e) => lidarComAtualizarQuantidade(item, e.target.value)}
                      className="min-h-11 w-16 rounded-lg border border-slate-300 px-2 text-center text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => lidarComRemover(item)}
                      className="min-h-11 rounded-lg border border-red-300 px-2.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <form
            onSubmit={lidarComAdicionar}
            className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-end"
          >
            <div className="flex-1">
              <label htmlFor="produto_kit" className="block text-sm font-medium text-slate-700 mb-1">
                Produto
              </label>
              <select
                id="produto_kit"
                value={produtoSelecionado}
                onChange={(e) => setProdutoSelecionado(e.target.value)}
                className="min-h-11 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">
                  {produtosParaSelecionar.length === 0
                    ? 'Nenhum produto disponível'
                    : 'Selecione um produto...'}
                </option>
                {produtosParaSelecionar.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:w-28">
              <label htmlFor="quantidade_kit" className="block text-sm font-medium text-slate-700 mb-1">
                Quantidade
              </label>
              <input
                id="quantidade_kit"
                type="number"
                min="1"
                step="1"
                value={quantidadeNova}
                onChange={(e) => setQuantidadeNova(e.target.value)}
                className="min-h-11 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              disabled={adicionando || produtosParaSelecionar.length === 0}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-amber-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {adicionando ? 'Adicionando...' : 'Adicionar'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}
