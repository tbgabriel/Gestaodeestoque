export default function ConfirmDialog({
  aberto,
  titulo,
  mensagem,
  textoConfirmar = 'Confirmar',
  confirmando,
  aoConfirmar,
  aoCancelar,
}) {
  if (!aberto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-slate-900">{titulo}</h2>
        <p className="mt-2 text-sm text-slate-600">{mensagem}</p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <button
            type="button"
            onClick={aoCancelar}
            disabled={confirmando}
            className="min-h-11 rounded-lg px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={aoConfirmar}
            disabled={confirmando}
            className="min-h-11 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {confirmando ? 'Excluindo...' : textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  )
}
