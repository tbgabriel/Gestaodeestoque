function formatarMoeda(valor) {
  return (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function ItemVendaRow({ item, produtos, aoAtualizar, aoRemover }) {
  const subtotal = (Number(item.quantidade) || 0) * (Number(item.preco_unitario) || 0)

  function lidarComTrocaProduto(produtoId) {
    const produto = produtos.find((p) => p.id === produtoId)
    aoAtualizar({
      ...item,
      produto_id: produtoId,
      preco_unitario: produto?.preco_venda ?? 0,
    })
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label className="block text-xs font-medium text-slate-500 mb-1">Produto</label>
        <select
          value={item.produto_id}
          onChange={(e) => lidarComTrocaProduto(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
        >
          <option value="">Selecione...</option>
          {produtos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome} {p.eh_kit ? '(kit)' : ''} — estoque: {p.quantidade}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:w-24">
        <label className="block text-xs font-medium text-slate-500 mb-1">Qtd.</label>
        <input
          type="number"
          min="1"
          step="1"
          value={item.quantidade}
          onChange={(e) => aoAtualizar({ ...item, quantidade: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
        />
      </div>

      <div className="sm:w-32">
        <label className="block text-xs font-medium text-slate-500 mb-1">Preço unit. (R$)</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={item.preco_unitario}
          onChange={(e) => aoAtualizar({ ...item, preco_unitario: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
        />
      </div>

      <div className="sm:w-28 text-sm text-slate-600 sm:pb-2">
        <span className="sm:hidden font-medium text-xs text-slate-500">Subtotal: </span>
        {formatarMoeda(subtotal)}
      </div>

      <button
        type="button"
        onClick={aoRemover}
        className="rounded-lg border border-red-300 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
      >
        Remover
      </button>
    </div>
  )
}
