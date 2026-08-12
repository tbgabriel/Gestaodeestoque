-- Habilita a geração de UUIDs (já vem habilitado por padrão em projetos novos do Supabase,
-- mas não custa garantir)
create extension if not exists "pgcrypto";

-- Tabela de produtos
create table if not exists produtos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  categoria text,
  preco_custo numeric(10, 2),
  preco_venda numeric(10, 2),
  quantidade integer not null default 0,
  estoque_minimo integer not null default 0,
  eh_kit boolean not null default false,
  created_at timestamptz not null default now()
);

-- Tabela de itens que compõem um kit (usada mais pra frente)
create table if not exists kit_itens (
  id uuid primary key default gen_random_uuid(),
  kit_id uuid not null references produtos (id) on delete cascade,
  produto_id uuid not null references produtos (id) on delete restrict,
  quantidade integer not null default 1,
  unique (kit_id, produto_id)
);

-- Índices para acelerar buscas comuns
create index if not exists idx_kit_itens_kit_id on kit_itens (kit_id);
create index if not exists idx_kit_itens_produto_id on kit_itens (produto_id);
