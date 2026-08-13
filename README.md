# Estoque JP

Sistema de controle de estoque e clientes pra uma revenda de produtos de salão profissionais — feito pra tirar o negócio do caderno de uma vez por todas.

## O problema

Meu padrasto revende produtos de salão profissional (shampoo, coloração, essas coisas) e até pouco tempo atrás controlava tudo... num caderno mesmo. Estoque, cliente, o que vendeu, quanto sobrou — tudo escrito à mão. Funcionava até certo ponto, mas era difícil saber rápido o que tava acabando, fácil perder o controle de quem comprou o quê, e não existia histórico nenhum organizado.

Construí esse sistema pra resolver esse problema de verdade — e de quebra, usei como projeto de portfólio pra praticar desenvolvimento junto com o Claude Code, montando tudo do zero (banco de dados, autenticação, interface) numa stack moderna.

## O que o sistema faz

- Cadastro e controle de produtos, com estoque e alerta visual quando algo tá abaixo do mínimo
- Produtos do tipo "kit" — ao vender um kit, o sistema desconta automaticamente o estoque de cada item que compõe ele
- Cadastro de clientes
- Registro de vendas e movimentações de estoque, vinculando produto e cliente
- Validação que impede vender mais do que existe em estoque (vale pra produto normal e pros componentes de um kit)
- Dashboard com resumo geral: total de produtos, itens com estoque baixo, últimas movimentações
- Login com autenticação de verdade (Supabase Auth + Row Level Security), porque ali dentro tem dado real do negócio
- Deploy rodando na Vercel

<!-- adicionar prints/gif do sistema aqui -->

## Tecnologias

- React + Vite
- Tailwind CSS
- Supabase (banco de dados + autenticação)

6. Rode o projeto:

```bash
npm run dev
```
