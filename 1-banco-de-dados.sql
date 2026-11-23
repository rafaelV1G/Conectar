-- =====================================================================
-- CONECTA SERVIÇOS - banco de dados (Supabase)
-- Cole este arquivo inteiro no SQL Editor do Supabase e clique em RUN.
-- Pode rodar de novo sem problema (ele recria as regras).
-- =====================================================================

-- 1) TABELAS -----------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null check (char_length(nome) between 2 and 60),
  zap text not null check (char_length(zap) between 10 and 13),
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.categorias (
  slug text primary key check (char_length(slug) between 1 and 40),
  ordem bigint generated always as identity,
  nome text not null check (char_length(nome) between 2 and 40),
  emoji text not null default '🛠️' check (char_length(emoji) <= 8),
  criado_por uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.anuncios (
  id uuid primary key default gen_random_uuid(),
  titulo text not null check (char_length(titulo) between 2 and 80),
  categoria text not null references public.categorias(slug) on delete cascade,
  preco text not null check (char_length(preco) <= 20),
  whatsapp text not null check (char_length(whatsapp) between 10 and 15),
  descricao text not null default '' check (char_length(descricao) <= 300),
  foto text not null default '' check (char_length(foto) <= 400000),
  cidade text not null default '' check (char_length(cidade) <= 60),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index if not exists anuncios_categoria_idx on public.anuncios(categoria);

-- 2) FUNÇÃO "É ADMINISTRADOR?" ------------------------------------------
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- 3) SEGURANÇA (quem pode o quê) ---------------------------------------
alter table public.profiles   enable row level security;
alter table public.categorias enable row level security;
alter table public.anuncios   enable row level security;

drop policy if exists "ver o proprio perfil (admin ve todos)" on public.profiles;
create policy "ver o proprio perfil (admin ve todos)" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());

drop policy if exists "criar o proprio perfil" on public.profiles;
create policy "criar o proprio perfil" on public.profiles for insert to authenticated with check (id = auth.uid() and is_admin = false);

drop policy if exists "todos veem categorias" on public.categorias;
create policy "todos veem categorias" on public.categorias for select to anon, authenticated using (true);

drop policy if exists "logado cria categoria" on public.categorias;
create policy "logado cria categoria" on public.categorias for insert to authenticated with check (criado_por = auth.uid());

drop policy if exists "dono ou admin exclui categoria" on public.categorias;
create policy "dono ou admin exclui categoria" on public.categorias for delete to authenticated using (criado_por = auth.uid() or public.is_admin());

drop policy if exists "todos veem anuncios" on public.anuncios;
create policy "todos veem anuncios" on public.anuncios for select to anon, authenticated using (true);

drop policy if exists "logado cria anuncio" on public.anuncios;
create policy "logado cria anuncio" on public.anuncios for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "dono ou admin exclui anuncio" on public.anuncios;
create policy "dono ou admin exclui anuncio" on public.anuncios for delete to authenticated using (user_id = auth.uid() or public.is_admin());

-- 4) CATEGORIAS INICIAIS ------------------------------------------------
insert into public.categorias (slug, nome, emoji) values
  ('jardim', 'Jardinagem e Limpeza', '🌿'),
  ('ar', 'Ar Condicionado', '❄️'),
  ('reparo', 'Pequenos Reparos', '🔧'),
  ('pintura', 'Pintura', '🖌️'),
  ('eletrica', 'Elétrica', '⚡'),
  ('encanamento', 'Encanamento', '🚰'),
  ('instalacao', 'Instalações e Manutenções', '🏠')
on conflict (slug) do nothing;

-- PRONTO. Próximo passo: ver o arquivo 2-tornar-administrador.sql
