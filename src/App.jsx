import { Routes, Route } from 'react-router-dom'
import ProdutosPage from './pages/ProdutosPage'
import NovoProdutoPage from './pages/NovoProdutoPage'
import EditarProdutoPage from './pages/EditarProdutoPage'

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Routes>
        <Route path="/" element={<ProdutosPage />} />
        <Route path="/produtos/novo" element={<NovoProdutoPage />} />
        <Route path="/produtos/:id/editar" element={<EditarProdutoPage />} />
      </Routes>
    </div>
  )
}

export default App
