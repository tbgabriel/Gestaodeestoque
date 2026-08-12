create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  telefone text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_clientes_nome on clientes (nome);
