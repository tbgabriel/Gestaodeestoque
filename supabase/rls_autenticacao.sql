-- Ativa Row Level Security em todas as tabelas do sistema
alter table produtos enable row level security;
alter table kit_itens enable row level security;
alter table movimentacoes_estoque enable row level security;
alter table clientes enable row level security;
alter table vendas enable row level security;
alter table venda_itens enable row level security;

-- Política única: qualquer usuário autenticado (logado via Supabase Auth)
-- pode ler e escrever em todas as tabelas. Não há necessidade de regras
-- por usuário/dono, já que é um sistema interno de uma única equipe.
create policy "Usuários autenticados têm acesso total" on produtos
  for all to authenticated using (true) with check (true);

create policy "Usuários autenticados têm acesso total" on kit_itens
  for all to authenticated using (true) with check (true);

create policy "Usuários autenticados têm acesso total" on movimentacoes_estoque
  for all to authenticated using (true) with check (true);

create policy "Usuários autenticados têm acesso total" on clientes
  for all to authenticated using (true) with check (true);

create policy "Usuários autenticados têm acesso total" on vendas
  for all to authenticated using (true) with check (true);

create policy "Usuários autenticados têm acesso total" on venda_itens
  for all to authenticated using (true) with check (true);
