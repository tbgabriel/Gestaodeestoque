import { useState } from 'react'

const valoresIniciaisPadrao = {
  nome: '',
  categoria: '',
  preco_custo: '',
  preco_venda: '',
  quantidade: 0,
  estoque_minimo: 0,
  eh_kit: false,
}

export default function ProdutoForm({
  valoresIniciais = valoresIniciaisPadrao,
  aoSalvar,
  salvando,
  textoBotao = 'Salvar produto',
}) {
  const [form, setForm] = useState(() => {
    const mesclado = { ...valoresIniciaisPadrao, ...valoresIniciais }
    // Campos vindos do Supabase podem chegar como null (ex: categoria/preço não preenchidos).
    // Inputs controlados não podem receber null, então normalizamos aqui.
    return {
      ...mesclado,
      categoria: mesclado.categoria ?? '',
      preco_custo: mesclado.preco_custo ?? '',
      preco_venda: mesclado.preco_venda ?? '',
      quantidade: mesclado.quantidade ?? 0,
      estoque_minimo: mesclado.estoque_minimo ?? 0,
    }
  })
  const [erro, setErro] = useState('')

  function atualizarCampo(campo, valor) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  function lidarComSubmit(evento) {
    evento.preventDefault()

    if (!form.nome.trim()) {
      setErro('O nome do produto é obrigatório.')
      return
    }

    setErro('')

    aoSalvar({
      nome: form.nome.trim(),
      categoria: form.categoria.trim() || null,
      preco_custo: form.preco_custo === '' ? null : Number(form.preco_custo),
      preco_venda: form.preco_venda === '' ? null : Number(form.preco_venda),
      quantidade: Number(form.quantidade) || 0,
      estoque_minimo: Number(form.estoque_minimo) || 0,
      eh_kit: form.eh_kit,
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
          Nome do produto *
        </label>
        <input
          id="nome"
          type="text"
          value={form.nome}
          onChange={(e) => atualizarCampo('nome', e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          placeholder="Ex: Shampoo Profissional 1L"
        />
      </div>

      <div>
        <label htmlFor="categoria" className="block text-sm font-medium text-slate-700 mb-1">
          Categoria
        </label>
        <input
          id="categoria"
          type="text"
          value={form.categoria ?? ''}
          onChange={(e) => atualizarCampo('categoria', e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          placeholder="Ex: Shampoo, Coloração, Ferramentas..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="preco_custo" className="block text-sm font-medium text-slate-700 mb-1">
            Preço de custo (R$)
          </label>
          <input
            id="preco_custo"
            type="number"
            min="0"
            step="0.01"
            value={form.preco_custo}
            onChange={(e) => atualizarCampo('preco_custo', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="0,00"
          />
        </div>
        <div>
          <label htmlFor="preco_venda" className="block text-sm font-medium text-slate-700 mb-1">
            Preço de venda (R$)
          </label>
          <input
            id="preco_venda"
            type="number"
            min="0"
            step="0.01"
            value={form.preco_venda}
            onChange={(e) => atualizarCampo('preco_venda', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            placeholder="0,00"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="quantidade" className="block text-sm font-medium text-slate-700 mb-1">
            Quantidade em estoque
          </label>
          <input
            id="quantidade"
            type="number"
            min="0"
            step="1"
            value={form.quantidade}
            onChange={(e) => atualizarCampo('quantidade', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
        <div>
          <label htmlFor="estoque_minimo" className="block text-sm font-medium text-slate-700 mb-1">
            Estoque mínimo
          </label>
          <input
            id="estoque_minimo"
            type="number"
            min="0"
            step="1"
            value={form.estoque_minimo}
            onChange={(e) => atualizarCampo('estoque_minimo', e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="eh_kit"
          type="checkbox"
          checked={form.eh_kit}
          onChange={(e) => atualizarCampo('eh_kit', e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
        />
        <label htmlFor="eh_kit" className="text-sm font-medium text-slate-700">
          Este produto é um kit?
        </label>
      </div>

      <button
        type="submit"
        disabled={salvando}
        className="w-full sm:w-auto inline-flex justify-center rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {salvando ? 'Salvando...' : textoBotao}
      </button>
    </form>
  )
}
