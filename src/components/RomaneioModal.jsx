import toast from 'react-hot-toast'
import { NOME_LOJA, gerarTextoRomaneio } from '../lib/romaneio'

function formatarMoeda(valor) {
  return (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatarData(dataIso) {
  return new Date(dataIso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function RomaneioModal({ venda, aoFechar }) {
  if (!venda) return null

  const textoRomaneio = gerarTextoRomaneio(venda)
  const podeCompartilhar = typeof navigator !== 'undefined' && !!navigator.share

  async function copiarTexto() {
    try {
      await navigator.clipboard.writeText(textoRomaneio)
      toast.success('Romaneio copiado. É só colar no WhatsApp.')
    } catch (e) {
      toast.error('Não foi possível copiar o texto.')
      console.error(e)
    }
  }

  async function compartilhar() {
    try {
      await navigator.share({ text: textoRomaneio })
    } catch (e) {
      if (e?.name !== 'AbortError') {
        toast.error('Não foi possível compartilhar.')
        console.error(e)
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-lg bg-white shadow-lg">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-slate-900">Romaneio da venda</h2>
          <p className="mt-1 text-xs text-slate-500">
            Pronto para compartilhar com o cliente por WhatsApp.
          </p>

          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-center text-base font-bold text-slate-900">{NOME_LOJA}</p>
            <p className="text-center text-xs text-slate-500">Romaneio de venda</p>

            <div className="mt-3 space-y-1 border-t border-dashed border-slate-300 pt-3 text-sm">
              <p className="text-slate-700">
                <span className="text-slate-400">Data: </span>
                {formatarData(venda.created_at)}
              </p>
              <p className="text-slate-700">
                <span className="text-slate-400">Cliente: </span>
                {venda.cliente?.nome ?? 'Venda avulsa'}
              </p>
            </div>

            <ul className="mt-3 divide-y divide-dashed divide-slate-300 border-t border-dashed border-slate-300">
              {venda.itens.map((item) => (
                <li key={item.id} className="py-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-slate-800">
                      {item.produto?.nome}
                      {item.produto?.eh_kit && (
                        <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                          kit
                        </span>
                      )}
                    </p>
                    <p className="whitespace-nowrap text-sm font-semibold text-slate-700">
                      {formatarMoeda(item.subtotal)}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400">
                    {item.quantidade} × {formatarMoeda(item.preco_unitario)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex items-center justify-between border-t border-dashed border-slate-300 pt-3">
              <span className="text-sm font-semibold text-slate-600">Total</span>
              <span className="text-lg font-bold text-slate-900">{formatarMoeda(venda.total)}</span>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            {podeCompartilhar && (
              <button
                type="button"
                onClick={compartilhar}
                className="min-h-11 rounded-lg bg-amber-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
              >
                Compartilhar
              </button>
            )}
            <button
              type="button"
              onClick={copiarTexto}
              className={`min-h-11 rounded-lg px-4 text-sm font-semibold transition-colors ${
                podeCompartilhar
                  ? 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
            >
              Copiar texto
            </button>
            <button
              type="button"
              onClick={aoFechar}
              className="min-h-11 rounded-lg px-4 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
