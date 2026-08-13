import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { listarProdutos } from '../lib/produtosApi'
import { listarClientes } from '../lib/clientesApi'
import { registrarVenda } from '../lib/vendasApi'
import ItemVendaRow from '../components/ItemVendaRow'

function novoItemVazio() {
  return { chave: crypto.randomUUID(), produto_id: '', quantidade: 1, preco_unitario: 0 }
}

function formatarMoeda(valor) {
  return (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function NovaVendaPage() {
  const [produtos, setProdutos] = useState([])
  const [clientes, setClientes] = useState([])
  const [carregandoDados, setCarregandoDados] = useState(true)
  const [erroCarregamento, setErroCarregamento] = useState('')

  const [clienteId, setClienteId] = useState('')
  const [observacao, setObservacao] = useState('')
  const [itens, setItens] = useState([novoItemVazio()])
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  const navegar = useNavigate()

  useEffect(() => {
    async function carregar() {
      setCarregandoDados(true)
      setErroCarregamento('')
      try {
        const [dadosProdutos, dadosClientes] = await Promise.all([
          listarProdutos(),
          listarClientes(),
        ])
        setProdutos(dadosProdutos)
        setClientes(dadosClientes)
      } catch (e) {
        setErroCarregamento('Não foi possível carregar produtos/clientes.')
        console.error(e)
      } finally {
        setCarregandoDados(false)
      }
    }
    carregar()
  }, [])

  function atualizarItem(chave, novoItem) {
    setItens((atual) => atual.map((i) => (i.chave === chave ? { ...novoItem, chave } : i)))
  }

  function removerItem(chave) {
    setItens((atual) => atual.filter((i) => i.chave !== chave))
  }

  function adicionarItem() {
    setItens((atual) => [...atual, novoItemVazio()])
  }

  const total = itens.reduce(
    (soma, item) => soma + (Number(item.quantidade) || 0) * (Number(item.preco_unitario) || 0),
    0
  )

  async function lidarComSubmit(evento) {
    evento.preventDefault()

    const itensValidos = itens.filter((i) => i.produto_id && Number(i.quantidade) > 0)

    if (itensValidos.length === 0) {
      setErro('Adicione pelo menos um item com produto e quantidade válidos.')
      return
    }

    setErro('')
    setSalvando(true)
    try {
      await registrarVenda({
        cliente_id: clienteId || null,
        observacao,
        itens: itensValidos.map((i) => ({
          produto_id: i.produto_id,
          quantidade: Number(i.quantidade),
          preco_unitario: Number(i.preco_unitario) || 0,
        })),
      })
      toast.success('Venda registrada com sucesso.')
      navegar('/vendas')
    } catch (e) {
      toast.error(e.message || 'Erro ao registrar a venda.')
      console.error(e)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link to="/vendas" className="text-sm text-slate-500 transition-colors hover:text-slate-700">
        ← Voltar para vendas
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Nova venda</h1>

      {carregandoDados && <p className="mt-6 text-sm text-slate-500">Carregando...</p>}

      {!carregandoDados && erroCarregamento && (
        <div className="mt-6 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {erroCarregamento}
        </div>
      )}

      {!carregandoDados && !erroCarregamento && (
        <form onSubmit={lidarComSubmit} className="mt-6 space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div>
              <label htmlFor="cliente" className="block text-sm font-medium text-slate-700 mb-1">
                Cliente (opcional)
              </label>
              <select
                id="cliente"
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">Venda avulsa (sem cliente)</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="observacao" className="block text-sm font-medium text-slate-700 mb-1">
                Observação (opcional)
              </label>
              <input
                id="observacao"
                type="text"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Ex: pagamento em 2x no cartão"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Itens da venda</h2>

            {erro && (
              <div className="mt-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
                {erro}
              </div>
            )}

            <div className="mt-4 space-y-3">
              {itens.map((item) => (
                <ItemVendaRow
                  key={item.chave}
                  item={item}
                  produtos={produtos}
                  aoAtualizar={(novoItem) => atualizarItem(item.chave, novoItem)}
                  aoRemover={() => removerItem(item.chave)}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={adicionarItem}
              className="mt-4 text-sm font-medium text-amber-600 transition-colors hover:text-amber-700"
            >
              + Adicionar item
            </button>

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-sm font-medium text-slate-500">Total</span>
              <span className="text-xl font-bold text-slate-900">{formatarMoeda(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={salvando}
            className="w-full sm:w-auto inline-flex justify-center rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-700 disabled:opacity-60"
          >
            {salvando ? 'Registrando...' : 'Finalizar venda'}
          </button>
        </form>
      )}
    </div>
  )
}
