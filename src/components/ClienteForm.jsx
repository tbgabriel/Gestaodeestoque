import { useState } from 'react'

const valoresIniciaisPadrao = {
  nome: '',
  telefone: '',
}

export default function ClienteForm({
  valoresIniciais = valoresIniciaisPadrao,
  aoSalvar,
  salvando,
  textoBotao = 'Salvar cliente',
}) {
  const [form, setForm] = useState(() => {
    const mesclado = { ...valoresIniciaisPadrao, ...valoresIniciais }
    return {
      nome: mesclado.nome ?? '',
      telefone: mesclado.telefone ?? '',
    }
  })
  const [erro, setErro] = useState('')

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  function lidarComSubmit(evento) {
    evento.preventDefault()

    if (!form.nome.trim()) {
      setErro('O nome do cliente é obrigatório.')
      return
    }

    if (!form.telefone.trim()) {
      setErro('O telefone do cliente é obrigatório.')
      return
    }

    setErro('')

    aoSalvar({
      nome: form.nome.trim(),
      telefone: form.telefone.trim(),
    })
  }

  return (
    <form onSubmit={lidarComSubmit} className="space-y-5">
      {erro && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          {erro}
        </div>
      )}

      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-slate-700 mb-1">
          Nome *
        </label>
        <input
          id="nome"
          type="text"
          value={form.nome}
          onChange={(e) => atualizarCampo('nome', e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          placeholder="Ex: Salão Beleza Pura"
        />
      </div>

      <div>
        <label htmlFor="telefone" className="block text-sm font-medium text-slate-700 mb-1">
          Telefone *
        </label>
        <input
          id="telefone"
          type="tel"
          value={form.telefone}
          onChange={(e) => atualizarCampo('telefone', e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          placeholder="Ex: (11) 91234-5678"
        />
      </div>

      <button
        type="submit"
        disabled={salvando}
        className="w-full sm:w-auto inline-flex justify-center rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {salvando ? 'Salvando...' : textoBotao}
      </button>
    </form>
  )
}
