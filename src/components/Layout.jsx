import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const linkBase =
  'rounded-lg px-3 py-2 text-sm font-medium transition-colors'

export default function Layout() {
  const { usuario, sair } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 sm:px-6">
          <span className="mr-2 font-semibold text-slate-900">Estoque JP</span>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${linkBase} ${isActive ? 'bg-amber-100 text-amber-700' : 'text-slate-600 hover:bg-slate-100'}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/produtos"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? 'bg-amber-100 text-amber-700' : 'text-slate-600 hover:bg-slate-100'}`
            }
          >
            Produtos
          </NavLink>
          <NavLink
            to="/clientes"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? 'bg-amber-100 text-amber-700' : 'text-slate-600 hover:bg-slate-100'}`
            }
          >
            Clientes
          </NavLink>
          <NavLink
            to="/vendas"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? 'bg-amber-100 text-amber-700' : 'text-slate-600 hover:bg-slate-100'}`
            }
          >
            Vendas
          </NavLink>

          <div className="ml-auto flex items-center gap-3">
            {usuario?.email && (
              <span className="hidden text-sm text-slate-500 sm:inline">{usuario.email}</span>
            )}
            <button
              type="button"
              onClick={sair}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
            >
              Sair
            </button>
          </div>
        </nav>
      </header>
      <Outlet />
    </div>
  )
}
