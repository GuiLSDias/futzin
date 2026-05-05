-- ══════════════════════════════════════════════════════════════════════════════
-- PELADA APP — Migration inicial
-- Execute este arquivo no SQL Editor do Supabase:
-- Dashboard → SQL Editor → New query → cole e execute
-- ══════════════════════════════════════════════════════════════════════════════

-- Habilita extensão para geração de UUIDs
create extension if not exists "uuid-ossp";


-- ─────────────────────────────────────────────
-- TABELA: users (perfil público dos usuários)
-- Espelha auth.users do Supabase Auth
-- ─────────────────────────────────────────────
create table public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null,
  email       text not null unique,
  avatar_url  text,
  position    text check (position in ('goleiro','zagueiro','lateral','volante','meia','atacante')),
  created_at  timestamptz not null default now()
);

-- Cria o perfil automaticamente quando um usuário se registra
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ─────────────────────────────────────────────
-- TABELA: groups (turmas/grupos de pelada)
-- ─────────────────────────────────────────────
create table public.groups (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  description text,
  created_by  uuid not null references public.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- Índice para buscar grupos criados por um usuário
create index idx_groups_created_by on public.groups(created_by);


-- ─────────────────────────────────────────────
-- TABELA: group_members (membros de cada grupo)
-- ─────────────────────────────────────────────
create table public.group_members (
  id         uuid primary key default uuid_generate_v4(),
  group_id   uuid not null references public.groups(id) on delete cascade,
  user_id    uuid not null references public.users(id) on delete cascade,
  role       text not null default 'member' check (role in ('admin', 'member')),
  joined_at  timestamptz not null default now(),
  unique (group_id, user_id)
);

create index idx_group_members_group_id on public.group_members(group_id);
create index idx_group_members_user_id  on public.group_members(user_id);

-- Quando um grupo é criado, o criador entra automaticamente como admin
create or replace function public.handle_new_group()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.group_members (group_id, user_id, role)
  values (new.id, new.created_by, 'admin');
  return new;
end;
$$;

create trigger on_group_created
  after insert on public.groups
  for each row execute procedure public.handle_new_group();


-- ─────────────────────────────────────────────
-- TABELA: matches (peladas)
-- ─────────────────────────────────────────────
create table public.matches (
  id               uuid primary key default uuid_generate_v4(),
  group_id         uuid not null references public.groups(id) on delete cascade,
  date             date not null,
  time             time not null,
  location         text not null,
  players_per_team int  not null default 5 check (players_per_team between 2 and 11),
  status           text not null default 'agendada'
                   check (status in ('agendada','em_andamento','finalizada','cancelada')),
  created_at       timestamptz not null default now()
);

create index idx_matches_group_id on public.matches(group_id);
create index idx_matches_date     on public.matches(date);


-- ─────────────────────────────────────────────
-- TABELA: match_confirmations (presença na pelada)
-- ─────────────────────────────────────────────
create table public.match_confirmations (
  id           uuid primary key default uuid_generate_v4(),
  match_id     uuid not null references public.matches(id) on delete cascade,
  user_id      uuid not null references public.users(id) on delete cascade,
  status       text not null check (status in ('confirmado','recusado','talvez')),
  responded_at timestamptz not null default now(),
  unique (match_id, user_id)
);

create index idx_match_confirmations_match_id on public.match_confirmations(match_id);
create index idx_match_confirmations_user_id  on public.match_confirmations(user_id);


-- ─────────────────────────────────────────────
-- TABELA: teams (times sorteados)
-- ─────────────────────────────────────────────
create table public.teams (
  id       uuid primary key default uuid_generate_v4(),
  match_id uuid not null references public.matches(id) on delete cascade,
  name     text not null,
  score    int  not null default 0 check (score >= 0)
);

create index idx_teams_match_id on public.teams(match_id);


-- ─────────────────────────────────────────────
-- TABELA: team_players (jogadores de cada time)
-- ─────────────────────────────────────────────
create table public.team_players (
  id      uuid primary key default uuid_generate_v4(),
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  unique (team_id, user_id)
);

create index idx_team_players_team_id on public.team_players(team_id);


-- ─────────────────────────────────────────────
-- TABELA: match_goals (gols registrados)
-- ─────────────────────────────────────────────
create table public.match_goals (
  id         uuid primary key default uuid_generate_v4(),
  match_id   uuid not null references public.matches(id) on delete cascade,
  team_id    uuid not null references public.teams(id)  on delete cascade,
  user_id    uuid not null references public.users(id)  on delete cascade,
  scored_at  timestamptz not null default now()
);

create index idx_match_goals_match_id on public.match_goals(match_id);
create index idx_match_goals_user_id  on public.match_goals(user_id);


-- ─────────────────────────────────────────────
-- TABELA: match_payments (controle do racha)
-- ─────────────────────────────────────────────
create table public.match_payments (
  id       uuid primary key default uuid_generate_v4(),
  match_id uuid    not null references public.matches(id) on delete cascade,
  user_id  uuid    not null references public.users(id)   on delete cascade,
  amount   numeric(10,2) not null check (amount >= 0),
  paid     boolean not null default false,
  paid_at  timestamptz,
  unique (match_id, user_id)
);

create index idx_match_payments_match_id on public.match_payments(match_id);


-- ══════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- Garante que cada usuário só veja e edite os próprios dados
-- ══════════════════════════════════════════════════════════════════════════════

alter table public.users            enable row level security;
alter table public.groups           enable row level security;
alter table public.group_members    enable row level security;
alter table public.matches          enable row level security;
alter table public.match_confirmations enable row level security;
alter table public.teams            enable row level security;
alter table public.team_players     enable row level security;
alter table public.match_goals      enable row level security;
alter table public.match_payments   enable row level security;


-- ─── Políticas: users ────────────────────────────────────────────────────────
create policy "Usuários podem ver todos os perfis"
  on public.users for select using (true);

create policy "Usuário pode editar o próprio perfil"
  on public.users for update using (auth.uid() = id);


-- ─── Políticas: groups ───────────────────────────────────────────────────────
create policy "Membros podem ver o grupo"
  on public.groups for select using (
    exists (
      select 1 from public.group_members
      where group_id = groups.id and user_id = auth.uid()
    )
  );

create policy "Usuário autenticado pode criar grupo"
  on public.groups for insert with check (auth.uid() = created_by);

create policy "Admin pode editar o grupo"
  on public.groups for update using (
    exists (
      select 1 from public.group_members
      where group_id = groups.id and user_id = auth.uid() and role = 'admin'
    )
  );

create policy "Admin pode excluir o grupo"
  on public.groups for delete using (
    exists (
      select 1 from public.group_members
      where group_id = groups.id and user_id = auth.uid() and role = 'admin'
    )
  );


-- ─── Políticas: group_members ────────────────────────────────────────────────
create policy "Membros podem ver outros membros do grupo"
  on public.group_members for select using (
    exists (
      select 1 from public.group_members gm
      where gm.group_id = group_members.group_id and gm.user_id = auth.uid()
    )
  );

create policy "Admin pode adicionar membros"
  on public.group_members for insert with check (
    exists (
      select 1 from public.group_members
      where group_id = group_members.group_id and user_id = auth.uid() and role = 'admin'
    )
  );

create policy "Admin pode remover membros"
  on public.group_members for delete using (
    exists (
      select 1 from public.group_members gm
      where gm.group_id = group_members.group_id and gm.user_id = auth.uid() and gm.role = 'admin'
    )
  );


-- ─── Políticas: matches ──────────────────────────────────────────────────────
create policy "Membros do grupo podem ver peladas"
  on public.matches for select using (
    exists (
      select 1 from public.group_members
      where group_id = matches.group_id and user_id = auth.uid()
    )
  );

create policy "Admin do grupo pode criar pelada"
  on public.matches for insert with check (
    exists (
      select 1 from public.group_members
      where group_id = matches.group_id and user_id = auth.uid() and role = 'admin'
    )
  );

create policy "Admin do grupo pode editar pelada"
  on public.matches for update using (
    exists (
      select 1 from public.group_members
      where group_id = matches.group_id and user_id = auth.uid() and role = 'admin'
    )
  );

create policy "Admin do grupo pode excluir pelada"
  on public.matches for delete using (
    exists (
      select 1 from public.group_members
      where group_id = matches.group_id and user_id = auth.uid() and role = 'admin'
    )
  );


-- ─── Políticas: match_confirmations ──────────────────────────────────────────
create policy "Membros do grupo podem ver confirmações"
  on public.match_confirmations for select using (
    exists (
      select 1 from public.matches m
      join public.group_members gm on gm.group_id = m.group_id
      where m.id = match_confirmations.match_id and gm.user_id = auth.uid()
    )
  );

create policy "Usuário confirma a própria presença"
  on public.match_confirmations for insert with check (auth.uid() = user_id);

create policy "Usuário atualiza a própria confirmação"
  on public.match_confirmations for update using (auth.uid() = user_id);


-- ─── Políticas: teams ────────────────────────────────────────────────────────
create policy "Membros do grupo podem ver times"
  on public.teams for select using (
    exists (
      select 1 from public.matches m
      join public.group_members gm on gm.group_id = m.group_id
      where m.id = teams.match_id and gm.user_id = auth.uid()
    )
  );

create policy "Admin pode criar times"
  on public.teams for insert with check (
    exists (
      select 1 from public.matches m
      join public.group_members gm on gm.group_id = m.group_id
      where m.id = teams.match_id and gm.user_id = auth.uid() and gm.role = 'admin'
    )
  );

create policy "Admin pode editar placar"
  on public.teams for update using (
    exists (
      select 1 from public.matches m
      join public.group_members gm on gm.group_id = m.group_id
      where m.id = teams.match_id and gm.user_id = auth.uid() and gm.role = 'admin'
    )
  );

create policy "Admin pode excluir times"
  on public.teams for delete using (
    exists (
      select 1 from public.matches m
      join public.group_members gm on gm.group_id = m.group_id
      where m.id = teams.match_id and gm.user_id = auth.uid() and gm.role = 'admin'
    )
  );


-- ─── Políticas: team_players ─────────────────────────────────────────────────
create policy "Membros do grupo podem ver jogadores dos times"
  on public.team_players for select using (
    exists (
      select 1 from public.teams t
      join public.matches m on m.id = t.match_id
      join public.group_members gm on gm.group_id = m.group_id
      where t.id = team_players.team_id and gm.user_id = auth.uid()
    )
  );

create policy "Admin pode inserir jogadores nos times"
  on public.team_players for insert with check (
    exists (
      select 1 from public.teams t
      join public.matches m on m.id = t.match_id
      join public.group_members gm on gm.group_id = m.group_id
      where t.id = team_players.team_id and gm.user_id = auth.uid() and gm.role = 'admin'
    )
  );

create policy "Admin pode remover jogadores dos times"
  on public.team_players for delete using (
    exists (
      select 1 from public.teams t
      join public.matches m on m.id = t.match_id
      join public.group_members gm on gm.group_id = m.group_id
      where t.id = team_players.team_id and gm.user_id = auth.uid() and gm.role = 'admin'
    )
  );


-- ─── Políticas: match_goals ──────────────────────────────────────────────────
create policy "Membros do grupo podem ver gols"
  on public.match_goals for select using (
    exists (
      select 1 from public.matches m
      join public.group_members gm on gm.group_id = m.group_id
      where m.id = match_goals.match_id and gm.user_id = auth.uid()
    )
  );

create policy "Admin pode registrar gols"
  on public.match_goals for insert with check (
    exists (
      select 1 from public.matches m
      join public.group_members gm on gm.group_id = m.group_id
      where m.id = match_goals.match_id and gm.user_id = auth.uid() and gm.role = 'admin'
    )
  );

create policy "Admin pode remover gols"
  on public.match_goals for delete using (
    exists (
      select 1 from public.matches m
      join public.group_members gm on gm.group_id = m.group_id
      where m.id = match_goals.match_id and gm.user_id = auth.uid() and gm.role = 'admin'
    )
  );


-- ─── Políticas: match_payments ───────────────────────────────────────────────
create policy "Membros do grupo podem ver pagamentos"
  on public.match_payments for select using (
    exists (
      select 1 from public.matches m
      join public.group_members gm on gm.group_id = m.group_id
      where m.id = match_payments.match_id and gm.user_id = auth.uid()
    )
  );

create policy "Admin pode criar cobranças"
  on public.match_payments for insert with check (
    exists (
      select 1 from public.matches m
      join public.group_members gm on gm.group_id = m.group_id
      where m.id = match_payments.match_id and gm.user_id = auth.uid() and gm.role = 'admin'
    )
  );

create policy "Admin pode marcar pagamento"
  on public.match_payments for update using (
    exists (
      select 1 from public.matches m
      join public.group_members gm on gm.group_id = m.group_id
      where m.id = match_payments.match_id and gm.user_id = auth.uid() and gm.role = 'admin'
    )
  );