import { NavLink, Outlet } from 'react-router-dom'

const linkBase =
  'rounded-lg px-3 py-2 text-sm font-medium transition-colors'

export default function Layout() {
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
        </nav>
      </header>
      <Outlet />
    </div>
  )
}
