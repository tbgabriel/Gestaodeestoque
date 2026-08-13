import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { listarProdutos, excluirProduto } from '../lib/produtosApi'
import { registrarMovimentacao } from '../lib/movimentacoesApi'
import ProdutoCard from '../components/ProdutoCard'
import ConfirmDialog from '../components/ConfirmDialog'
import ModalMovimentacaoEstoque from '../components/ModalMovimentacaoEstoque'

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null)
  const [excluindo, setExcluindo] = useState(false)
  const [produtoParaMovimentar, setProdutoParaMovimentar] = useState(null)
  const [registrandoMovimentacao, setRegistrandoMovimentacao] = useState(false)

  useEffect(() => {
    carregarProdutos()
  }, [])

  async function carregarProdutos() {
    setCarregando(true)
    setErro('')
    try {
      const dados = await listarProdutos()
      setProdutos(dados)
    } catch (e) {
      setErro('Não foi possível carregar os produtos. Verifique a conexão com o Supabase.')
      console.error(e)
    } finally {
      setCarregando(false)
    }
  }

  async function lidarComRegistrarMovimentacao(dadosMovimentacao) {
    setRegistrandoMovimentacao(true)
    try {
      const produtoAtualizado = await registrarMovimentacao(dadosMovimentacao)
      setProdutos((atual) =>
        atual.map((p) => (p.id === produtoAtualizado.id ? produtoAtualizado : p))
      )
      toast.success(
        dadosMovimentacao.tipo === 'entrada' ? 'Entrada registrada.' : 'Saída registrada.'
      )
      setProdutoParaMovimentar(null)
    } catch (e) {
      toast.error('Erro ao registrar movimentação.')
      console.error(e)
    } finally {
      setRegistrandoMovimentacao(false)
    }
  }

  async function confirmarExclusao() {
    if (!produtoParaExcluir) return
    setExcluindo(true)
    try {
      await excluirProduto(produtoParaExcluir.id)
      setProdutos((atual) => atual.filter((p) => p.id !== produtoParaExcluir.id))
      toast.success('Produto excluído com sucesso.')
      setProdutoParaExcluir(null)
    } catch (e) {
      toast.error('Erro ao excluir o produto.')
      console.error(e)
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Produtos</h1>
          <p className="text-sm text-slate-500">
            {produtos.length} produto{produtos.length === 1 ? '' : 's'} cadastrado
            {produtos.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link
          to="/produtos/novo"
          className="inline-flex justify-center rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-700"
        >
          + Novo produto
        </Link>
      </div>

      {carregando && (
        <p className="mt-8 text-center text-sm text-slate-500">Carregando produtos...</p>
      )}

      {!carregando && erro && (
        <div className="mt-8 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {erro}
        </div>
      )}

      {!carregando && !erro && produtos.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-slate-500">Nenhum produto cadastrado ainda.</p>
          <Link
            to="/produtos/novo"
            className="mt-3 inline-block text-sm font-medium text-amber-600 transition-colors hover:text-amber-700"
          >
            Cadastrar o primeiro produto
          </Link>
        </div>
      )}

      {!carregando && !erro && produtos.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {produtos.map((produto) => (
            <ProdutoCard
              key={produto.id}
              produto={produto}
              aoExcluir={setProdutoParaExcluir}
              aoMovimentar={setProdutoParaMovimentar}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        aberto={Boolean(produtoParaExcluir)}
        titulo="Excluir produto"
        mensagem={`Tem certeza que deseja excluir "${produtoParaExcluir?.nome}"? Essa ação não pode ser desfeita.`}
        textoConfirmar="Excluir"
        confirmando={excluindo}
        aoConfirmar={confirmarExclusao}
        aoCancelar={() => setProdutoParaExcluir(null)}
      />

      {produtoParaMovimentar && (
        <ModalMovimentacaoEstoque
          produto={produtoParaMovimentar}
          registrando={registrandoMovimentacao}
          aoRegistrar={lidarComRegistrarMovimentacao}
          aoCancelar={() => setProdutoParaMovimentar(null)}
        />
      )}
    </div>
  )
}
