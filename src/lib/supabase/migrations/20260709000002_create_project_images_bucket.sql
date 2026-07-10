-- Backup of migration `create_project_images_bucket` applied to project omgywqbxxvcfshpoxerh (2026-07-09).
-- Public storage bucket for project card images.
-- NOTE: these storage.objects policies were replaced by 20260709000004_harden_rls_policies.sql.

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

create policy "public read project images" on storage.objects
	for select using (bucket_id = 'project-images');
create policy "admin insert project images" on storage.objects
	for insert to authenticated with check (bucket_id = 'project-images');
create policy "admin update project images" on storage.objects
	for update to authenticated using (bucket_id = 'project-images');
create policy "admin delete project images" on storage.objects
	for delete to authenticated using (bucket_id = 'project-images');
