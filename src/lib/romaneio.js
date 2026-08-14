export const NOME_LOJA = 'Estoque JP'

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

export function gerarTextoRomaneio(venda) {
  const linhas = []

  linhas.push(`*${NOME_LOJA}*`)
  linhas.push('Romaneio de venda')
  linhas.push('')
  linhas.push(`Data: ${formatarData(venda.created_at)}`)
  linhas.push(`Cliente: ${venda.cliente?.nome ?? 'Venda avulsa'}`)
  linhas.push('')
  linhas.push('*Itens:*')

  for (const item of venda.itens) {
    const nomeItem = item.produto?.nome ?? 'Produto'
    const sufixoKit = item.produto?.eh_kit ? ' (kit)' : ''
    linhas.push(
      `${item.quantidade}x ${nomeItem}${sufixoKit} — ${formatarMoeda(item.preco_unitario)} = ${formatarMoeda(item.subtotal)}`
    )
  }

  linhas.push('')
  linhas.push(`*Total: ${formatarMoeda(venda.total)}*`)

  return linhas.join('\n')
}
