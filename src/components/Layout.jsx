import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const linkBase = 'rounded-lg px-3 py-2 text-sm font-medium transition-colors'
const linkBaseMobile =
  'flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors'

const itensNav = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/produtos', label: 'Produtos' },
  { to: '/clientes', label: 'Clientes' },
  { to: '/vendas', label: 'Vendas' },
  { to: '/relatorios/mensal', label: 'Relatório mensal' },
]

function IconeMenu() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function IconeFechar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export default function Layout() {
  const { usuario, sair } = useAuth()
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white print:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 sm:px-6">
          <span className="mr-2 font-semibold text-slate-900">Estoque JP</span>

          <nav className="hidden md:flex md:items-center md:gap-2">
            {itensNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? 'bg-amber-100 text-amber-700' : 'text-slate-600 hover:bg-slate-100'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-3 md:flex">
            {usuario?.email && (
              <span className="max-w-[14rem] truncate text-sm text-slate-500">{usuario.email}</span>
            )}
            <button
              type="button"
              onClick={sair}
              className="min-h-11 rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
            >
              Sair
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMenuAberto((atual) => !atual)}
            className="ml-auto flex h-11 w-11 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
            aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuAberto}
          >
            {menuAberto ? <IconeFechar /> : <IconeMenu />}
          </button>
        </div>

        {menuAberto && (
          <nav className="border-t border-slate-200 px-4 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {itensNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMenuAberto(false)}
                  className={({ isActive }) =>
                    `${linkBaseMobile} ${isActive ? 'bg-amber-100 text-amber-700' : 'text-slate-600 hover:bg-slate-100'}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
              {usuario?.email && (
                <span className="min-w-0 truncate text-sm text-slate-500">{usuario.email}</span>
              )}
              <button
                type="button"
                onClick={sair}
                className="min-h-11 shrink-0 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
              >
                Sair
              </button>
            </div>
          </nav>
        )}
      </header>
      <Outlet />
    </div>
  )
}
