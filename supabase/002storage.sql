-- ══════════════════════════════════════════════════════════════════════════════
-- STORAGE — Bucket para avatares dos usuários
-- Execute no SQL Editor do Supabase após a migration principal
-- ══════════════════════════════════════════════════════════════════════════════

-- Cria o bucket de avatares (público — as imagens podem ser acessadas por URL)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2097152,   -- 2MB limite por arquivo
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Permite que qualquer pessoa veja os avatares (bucket público)
create policy "Avatares são públicos"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Usuário autenticado pode fazer upload do próprio avatar
-- Convenção de nome: {user_id}/avatar.{ext}
create policy "Usuário faz upload do próprio avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Usuário pode atualizar o próprio avatar
create policy "Usuário atualiza o próprio avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Usuário pode deletar o próprio avatar
create policy "Usuário deleta o próprio avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );