import { Link } from 'react-router-dom'

function formatarMoeda(valor) {
  if (valor === null || valor === undefined) return '—'
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function ProdutoCard({ produto, aoExcluir, aoMovimentar }) {
  const estoqueBaixo = produto.quantidade < produto.estoque_minimo

  return (
    <div
      className={`rounded-xl border bg-white p-5 shadow-sm transition-colors ${
        estoqueBaixo ? 'border-red-300 bg-red-50' : 'border-slate-200'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900 leading-snug">{produto.nome}</h3>
        {produto.eh_kit && (
          <span className="shrink-0 rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700">
            KIT
          </span>
        )}
      </div>

      {produto.categoria && (
        <p className="mt-1 text-sm text-slate-500">{produto.categoria}</p>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-slate-400">Custo</p>
          <p className="font-medium text-slate-700">{formatarMoeda(produto.preco_custo)}</p>
        </div>
        <div>
          <p className="text-slate-400">Venda</p>
          <p className="font-medium text-slate-700">{formatarMoeda(produto.preco_venda)}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <p
            className={`text-sm font-semibold ${
              estoqueBaixo ? 'text-red-600' : 'text-slate-700'
            }`}
          >
            {produto.quantidade} em estoque
          </p>
          <p className="text-xs text-slate-400">Mínimo: {produto.estoque_minimo}</p>
        </div>
        {estoqueBaixo && (
          <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
            Estoque baixo
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={() => aoMovimentar(produto)}
          className="rounded-lg border border-violet-300 px-2 py-1.5 text-xs sm:text-sm font-medium text-violet-700 hover:bg-violet-50"
        >
          Movimentar
        </button>
        <Link
          to={`/produtos/${produto.id}/editar`}
          className="rounded-lg border border-slate-300 px-2 py-1.5 text-center text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Editar
        </Link>
        <button
          type="button"
          onClick={() => aoExcluir(produto)}
          className="rounded-lg border border-red-300 px-2 py-1.5 text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Excluir
        </button>
      </div>
    </div>
  )
}
