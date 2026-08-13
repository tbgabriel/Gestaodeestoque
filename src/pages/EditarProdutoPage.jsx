import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import ProdutoForm from '../components/ProdutoForm'
import GerenciadorItensKit from '../components/GerenciadorItensKit'
import HistoricoMovimentacoes from '../components/HistoricoMovimentacoes'
import { atualizarProduto, buscarProduto } from '../lib/produtosApi'
import { removerTodosItensDoKit } from '../lib/kitItensApi'

export default function EditarProdutoPage() {
  const { id } = useParams()
  const navegar = useNavigate()
  const [produto, setProduto] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    async function carregar() {
      setCarregando(true)
      setErro('')
      try {
        const dados = await buscarProduto(id)
        setProduto(dados)
      } catch (e) {
        setErro('Não foi possível carregar este produto.')
        console.error(e)
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [id])

  async function lidarComSalvar(dadosProduto) {
    setSalvando(true)
    try {
      const deixouDeSerKit = produto.eh_kit && !dadosProduto.eh_kit
      if (deixouDeSerKit) {
        await removerTodosItensDoKit(id)
      }

      await atualizarProduto(id, dadosProduto)

      if (deixouDeSerKit) {
        toast.success('Produto atualizado. Os itens do kit foram removidos, pois ele deixou de ser um kit.')
      } else {
        toast.success('Produto atualizado com sucesso.')
      }
      navegar('/produtos')
    } catch (e) {
      toast.error('Erro ao atualizar o produto.')
      console.error(e)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
      <Link to="/produtos" className="text-sm text-slate-500 transition-colors hover:text-slate-700">
        ← Voltar para produtos
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Editar produto</h1>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {carregando && <p className="text-sm text-slate-500">Carregando...</p>}

        {!carregando && erro && (
          <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
            {erro}
          </div>
        )}

        {!carregando && produto && (
          <ProdutoForm
            valoresIniciais={produto}
            aoSalvar={lidarComSalvar}
            salvando={salvando}
            textoBotao="Salvar alterações"
          />
        )}
      </div>

      {!carregando && produto?.eh_kit && <GerenciadorItensKit kitId={produto.id} />}

      {!carregando && produto && <HistoricoMovimentacoes produtoId={produto.id} />}
    </div>
  )
}
