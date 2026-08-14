import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarVendasPorMes } from '../lib/vendasApi'

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

const NOMES_MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

function anosDisponiveis() {
  const anoAtual = new Date().getFullYear()
  const anos = []
  for (let a = anoAtual; a >= anoAtual - 5; a--) anos.push(a)
  return anos
}

function nomeDoMes(ano, mes) {
  return `${NOMES_MESES[mes - 1]} de ${ano}`
}

export default function RelatorioMensalPage() {
  const agora = new Date()
  const [ano, setAno] = useState(agora.getFullYear())
  const [mes, setMes] = useState(agora.getMonth() + 1)
  const [vendas, setVendas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregar() {
      setCarregando(true)
      setErro('')
      try {
        const dados = await listarVendasPorMes(ano, mes)
        setVendas(dados)
      } catch (e) {
        setErro('Não foi possível carregar o relatório. Verifique a conexão com o Supabase.')
        console.error(e)
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [ano, mes])

  const resumo = useMemo(() => {
    const totalVendas = vendas.length
    const valorTotal = vendas.reduce((soma, v) => soma + (v.total || 0), 0)

    const quantidadePorProduto = new Map()
    for (const venda of vendas) {
      for (const item of venda.itens) {
        const chave = item.produto?.id ?? item.produto?.nome
        if (!chave) continue
        const atual = quantidadePorProduto.get(chave) ?? { nome: item.produto.nome, quantidade: 0 }
        atual.quantidade += item.quantidade
        quantidadePorProduto.set(chave, atual)
      }
    }
    let produtoMaisVendido = null
    for (const dado of quantidadePorProduto.values()) {
      if (!produtoMaisVendido || dado.quantidade > produtoMaisVendido.quantidade) {
        produtoMaisVendido = dado
      }
    }

    const valorPorCliente = new Map()
    for (const venda of vendas) {
      if (!venda.cliente) continue
      const atual = valorPorCliente.get(venda.cliente.id) ?? { nome: venda.cliente.nome, valor: 0 }
      atual.valor += venda.total || 0
      valorPorCliente.set(venda.cliente.id, atual)
    }
    let clienteQueMaisComprou = null
    for (const dado of valorPorCliente.values()) {
      if (!clienteQueMaisComprou || dado.valor > clienteQueMaisComprou.valor) {
        clienteQueMaisComprou = dado
      }
    }

    return { totalVendas, valorTotal, produtoMaisVendido, clienteQueMaisComprou }
  }, [vendas])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 print:max-w-full print:px-0 print:py-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Relatório mensal</h1>
          <p className="text-sm text-slate-500">Resumo das vendas de um mês específico.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            aria-label="Mês"
            className="min-h-11 rounded-lg border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            {NOMES_MESES.map((nome, indice) => (
              <option key={nome} value={indice + 1}>
                {nome}
              </option>
            ))}
          </select>
          <select
            value={ano}
            onChange={(e) => setAno(Number(e.target.value))}
            aria-label="Ano"
            className="min-h-11 rounded-lg border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            {anosDisponiveis().map((anoOpcao) => (
              <option key={anoOpcao} value={anoOpcao}>
                {anoOpcao}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => window.print()}
            disabled={carregando || !!erro}
            className="min-h-11 rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60"
          >
            Imprimir / Exportar PDF
          </button>
        </div>
      </div>

      <h2 className="hidden text-xl font-bold text-slate-900 print:block">
        Estoque JP — Relatório mensal de vendas
      </h2>
      <p className="hidden text-sm text-slate-600 print:block">{nomeDoMes(ano, mes)}</p>

      {carregando && <p className="mt-8 text-center text-sm text-slate-500 print:hidden">Carregando relatório...</p>}

      {!carregando && erro && (
        <div className="mt-6 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 print:hidden">
          {erro}
        </div>
      )}

      {!carregando && !erro && (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 print:mt-4 print:grid-cols-4 print:gap-2">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm print:p-3 print:shadow-none">
              <p className="text-sm text-slate-500">Vendas no mês</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{resumo.totalVendas}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm print:p-3 print:shadow-none">
              <p className="text-sm text-slate-500">Valor total vendido</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{formatarMoeda(resumo.valorTotal)}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm print:p-3 print:shadow-none">
              <p className="text-sm text-slate-500">Produto mais vendido</p>
              <p className="mt-1 truncate text-base font-bold text-slate-900">
                {resumo.produtoMaisVendido?.nome ?? '—'}
              </p>
              {resumo.produtoMaisVendido && (
                <p className="text-xs text-slate-400">{resumo.produtoMaisVendido.quantidade} un.</p>
              )}
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm print:p-3 print:shadow-none">
              <p className="text-sm text-slate-500">Cliente que mais comprou</p>
              <p className="mt-1 truncate text-base font-bold text-slate-900">
                {resumo.clienteQueMaisComprou?.nome ?? '—'}
              </p>
              {resumo.clienteQueMaisComprou && (
                <p className="text-xs text-slate-400">{formatarMoeda(resumo.clienteQueMaisComprou.valor)}</p>
              )}
            </div>
          </div>

          {vendas.length === 0 ? (
            <p className="mt-8 text-center text-sm text-slate-500">
              Nenhuma venda registrada em {nomeDoMes(ano, mes).toLowerCase()}.
            </p>
          ) : (
            <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm print:mt-4 print:shadow-none">
              <ul className="divide-y divide-slate-100">
                {vendas.map((venda) => (
                  <li key={venda.id}>
                    <Link
                      to={`/vendas/${venda.id}`}
                      className="flex flex-col gap-1 px-4 py-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-6 print:px-0 print:py-2 print:hover:bg-transparent"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 truncate">
                          {venda.cliente?.nome ?? 'Venda avulsa (sem cliente)'}
                        </p>
                        <p className="text-sm text-slate-500">
                          {formatarData(venda.created_at)} · {venda.itens.length} item
                          {venda.itens.length === 1 ? '' : 's'}
                        </p>
                      </div>
                      <p className="shrink-0 text-lg font-semibold text-slate-900">
                        {formatarMoeda(venda.total)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  )
}
