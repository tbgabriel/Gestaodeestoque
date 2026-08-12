import { useState } from 'react'

export default function ModalMovimentacaoEstoque({ produto, registrando, aoRegistrar, aoCancelar }) {
  const [tipo, setTipo] = useState('entrada')
  const [quantidade, setQuantidade] = useState(1)
  const [observacao, setObservacao] = useState('')
  const [erro, setErro] = useState('')

  if (!produto) return null

  function lidarComSubmit(evento) {
    evento.preventDefault()
    const quantidadeNumero = Number(quantidade)

    if (!quantidadeNumero || quantidadeNumero <= 0) {
      setErro('Informe uma quantidade maior que zero.')
      return
    }

    setErro('')
    aoRegistrar({ produto_id: produto.id, tipo, quantidade: quantidadeNumero, observacao })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-slate-900">Movimentar estoque</h2>
        <p className="mt-1 text-sm text-slate-500">
          {produto.nome} — estoque atual: <span className="font-medium">{produto.quantidade}</span>
        </p>

        <form onSubmit={lidarComSubmit} className="mt-4 space-y-4">
          {erro && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
              {erro}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTipo('entrada')}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                tipo === 'entrada'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              ↑ Entrada
            </button>
            <button
              type="button"
              onClick={() => setTipo('saida')}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                tipo === 'saida'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              ↓ Saída
            </button>
          </div>

          <div>
            <label htmlFor="quantidade_mov" className="block text-sm font-medium text-slate-700 mb-1">
              Quantidade
            </label>
            <input
              id="quantidade_mov"
              type="number"
              min="1"
              step="1"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="observacao_mov" className="block text-sm font-medium text-slate-700 mb-1">
              Observação (opcional)
            </label>
            <input
              id="observacao_mov"
              type="text"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder={tipo === 'entrada' ? 'Ex: Compra fornecedor X' : 'Ex: Venda balcão'}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={aoCancelar}
              disabled={registrando}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={registrando}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
            >
              {registrando ? 'Registrando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
