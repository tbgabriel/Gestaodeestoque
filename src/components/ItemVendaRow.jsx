function formatarMoeda(valor) {
  return (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function ItemVendaRow({ item, produtos, aoAtualizar, aoRemover }) {
  const subtotal = (Number(item.quantidade) || 0) * (Number(item.preco_unitario) || 0)

  const produtoSelecionado = produtos.find((p) => p.id === item.produto_id)
  const precoTabela = produtoSelecionado?.preco_venda
  const precoAlterado =
    produtoSelecionado != null &&
    precoTabela != null &&
    Number(item.preco_unitario) !== Number(precoTabela)

  function lidarComTrocaProduto(produtoId) {
    const produto = produtos.find((p) => p.id === produtoId)
    aoAtualizar({
      ...item,
      produto_id: produtoId,
      preco_unitario: produto?.preco_venda ?? 0,
    })
  }

  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-2">
        <div className="sm:flex-1">
          <label className="block text-xs font-medium text-slate-500 mb-1">Produto</label>
          <select
            value={item.produto_id}
            onChange={(e) => lidarComTrocaProduto(e.target.value)}
            className="min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="">Selecione...</option>
            {produtos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} {p.eh_kit ? '(kit)' : ''} — estoque: {p.quantidade}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2">
          <div className="sm:w-24">
            <label className="block text-xs font-medium text-slate-500 mb-1">Qtd.</label>
            <input
              type="number"
              min="1"
              step="1"
              value={item.quantidade}
              onChange={(e) => aoAtualizar({ ...item, quantidade: e.target.value })}
              className="min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          <div className="sm:w-32">
            <label className="flex flex-wrap items-center gap-1 text-xs font-medium text-slate-500 mb-1">
              Preço unit. (R$)
              {precoAlterado && (
                <span
                  title={`Preço de tabela: ${formatarMoeda(precoTabela)}`}
                  className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-600"
                >
                  ✎ alterado
                </span>
              )}
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={item.preco_unitario}
              onChange={(e) => aoAtualizar({ ...item, preco_unitario: e.target.value })}
              className={`min-h-11 w-full rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                precoAlterado ? 'border-amber-400 bg-amber-50' : 'border-slate-300'
              }`}
            />
          </div>
        </div>

        <div className="sm:w-28 sm:pb-2.5">
          <span className="text-sm text-slate-600">
            <span className="font-medium text-xs text-slate-500 sm:hidden">Subtotal: </span>
            {formatarMoeda(subtotal)}
          </span>
        </div>

        <button
          type="button"
          onClick={aoRemover}
          className="min-h-11 w-full rounded-lg border border-red-300 px-3 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 sm:w-auto"
        >
          Remover
        </button>
      </div>
    </div>
  )
}
