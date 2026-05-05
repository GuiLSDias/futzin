-- Seed data for testing
-- Insert sample data here
-- ══════════════════════════════════════════════════════════════════════════════
-- SEED — Dados de teste para desenvolvimento
-- ATENÇÃO: Execute apenas em ambiente de desenvolvimento
-- ══════════════════════════════════════════════════════════════════════════════

-- Insere usuários na tabela auth.users (necessário por causa da FK)
-- O trigger on_auth_user_created cria o perfil em public.users automaticamente
insert into auth.users (
  id, instance_id, aud, role, email,
  encrypted_password, email_confirmed_at,
  created_at, updated_at,
  raw_user_meta_data,
  confirmation_token, recovery_token,
  email_change_token_new, email_change
)
values
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'joao@teste.com',    '$2a$10$placeholder', now(), now(), now(), '{"full_name":"João Silva"}',    '', '', '', ''),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'pedro@teste.com',   '$2a$10$placeholder', now(), now(), now(), '{"full_name":"Pedro Santos"}',  '', '', '', ''),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'lucas@teste.com',   '$2a$10$placeholder', now(), now(), now(), '{"full_name":"Lucas Oliveira"}', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'felipe@teste.com',  '$2a$10$placeholder', now(), now(), now(), '{"full_name":"Felipe Costa"}',  '', '', '', ''),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'carlos@teste.com',  '$2a$10$placeholder', now(), now(), now(), '{"full_name":"Carlos Souza"}',  '', '', '', ''),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'bruno@teste.com',   '$2a$10$placeholder', now(), now(), now(), '{"full_name":"Bruno Lima"}',    '', '', '', ''),
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'rafael@teste.com',  '$2a$10$placeholder', now(), now(), now(), '{"full_name":"Rafael Mendes"}', '', '', '', ''),
  ('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'andre@teste.com',   '$2a$10$placeholder', now(), now(), now(), '{"full_name":"André Ferreira"}','', '', '', ''),
  ('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'diego@teste.com',   '$2a$10$placeholder', now(), now(), now(), '{"full_name":"Diego Rocha"}',   '', '', '', ''),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'marcos@teste.com',  '$2a$10$placeholder', now(), now(), now(), '{"full_name":"Marcos Alves"}',  '', '', '', '')
on conflict (id) do nothing;

-- Atualiza as posições (o trigger já criou os perfis, agora só complementa)
update public.users set position = 'goleiro'  where id = '00000000-0000-0000-0000-000000000001';
update public.users set position = 'zagueiro' where id = '00000000-0000-0000-0000-000000000002';
update public.users set position = 'lateral'  where id = '00000000-0000-0000-0000-000000000003';
update public.users set position = 'volante'  where id = '00000000-0000-0000-0000-000000000004';
update public.users set position = 'meia'     where id = '00000000-0000-0000-0000-000000000005';
update public.users set position = 'atacante' where id = '00000000-0000-0000-0000-000000000006';
update public.users set position = 'atacante' where id = '00000000-0000-0000-0000-000000000007';
update public.users set position = 'meia'     where id = '00000000-0000-0000-0000-000000000008';
update public.users set position = 'zagueiro' where id = '00000000-0000-0000-0000-000000000009';
update public.users set position = 'lateral'  where id = '00000000-0000-0000-0000-000000000010';

-- Grupo de teste
insert into public.groups (id, name, description, created_by) values
  ('10000000-0000-0000-0000-000000000001', 'Pelada da Galera', 'Todo sábado às 8h no campo do bairro',
   '00000000-0000-0000-0000-000000000001')
on conflict (id) do nothing;

-- Membros do grupo (João já entrou como admin pelo trigger)
insert into public.group_members (group_id, user_id, role) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'member'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'member'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'member'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', 'member'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', 'member'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000007', 'member'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000008', 'member'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000009', 'member'),
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'member')
on conflict (group_id, user_id) do nothing;

-- Pelada de teste
insert into public.matches (id, group_id, date, time, location, players_per_team, status) values
  ('20000000-0000-0000-0000-000000000001',
   '10000000-0000-0000-0000-000000000001',
   current_date + interval '7 days',
   '08:00',
   'Campo do Bairro São João',
   5,
   'agendada')
on conflict (id) do nothing;

-- Confirmações de presença
insert into public.match_confirmations (match_id, user_id, status) values
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'confirmado'),
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'confirmado'),
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'confirmado'),
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'confirmado'),
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000005', 'confirmado'),
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000006', 'talvez'),
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000007', 'recusado')
on conflict (match_id, user_id) do nothing;