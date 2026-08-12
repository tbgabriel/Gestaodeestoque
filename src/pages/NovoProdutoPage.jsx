import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import ProdutoForm from '../components/ProdutoForm'
import { criarProduto } from '../lib/produtosApi'

export default function NovoProdutoPage() {
  const [salvando, setSalvando] = useState(false)
  const navegar = useNavigate()

  async function lidarComSalvar(dadosProduto) {
    setSalvando(true)
    try {
      await criarProduto(dadosProduto)
      toast.success('Produto cadastrado com sucesso.')
      navegar('/')
    } catch (e) {
      toast.error('Erro ao cadastrar o produto.')
      console.error(e)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
      <Link to="/" className="text-sm text-slate-500 hover:text-slate-700">
        ← Voltar para produtos
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Novo produto</h1>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <ProdutoForm aoSalvar={lidarComSalvar} salvando={salvando} textoBotao="Cadastrar produto" />
      </div>
    </div>
  )
}
