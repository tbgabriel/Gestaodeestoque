import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import RotaProtegida from './components/RotaProtegida'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ProdutosPage from './pages/ProdutosPage'
import NovoProdutoPage from './pages/NovoProdutoPage'
import EditarProdutoPage from './pages/EditarProdutoPage'
import ClientesPage from './pages/ClientesPage'
import NovoClientePage from './pages/NovoClientePage'
import EditarClientePage from './pages/EditarClientePage'
import VendasPage from './pages/VendasPage'
import NovaVendaPage from './pages/NovaVendaPage'
import VendaDetalhesPage from './pages/VendaDetalhesPage'
import RelatorioMensalPage from './pages/RelatorioMensalPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<RotaProtegida />}>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/produtos" element={<ProdutosPage />} />
          <Route path="/produtos/novo" element={<NovoProdutoPage />} />
          <Route path="/produtos/:id/editar" element={<EditarProdutoPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/clientes/novo" element={<NovoClientePage />} />
          <Route path="/clientes/:id/editar" element={<EditarClientePage />} />
          <Route path="/vendas" element={<VendasPage />} />
          <Route path="/vendas/nova" element={<NovaVendaPage />} />
          <Route path="/vendas/:id" element={<VendaDetalhesPage />} />
          <Route path="/relatorios/mensal" element={<RelatorioMensalPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
