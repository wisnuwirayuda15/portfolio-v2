-- Backup of migration `harden_rls_policies` applied to project omgywqbxxvcfshpoxerh (2026-07-09).
-- Replaces the permissive `using (true)` write policies from the first two
-- migrations: all writes are pinned to the single admin account, so an
-- accidentally re-enabled signup flow cannot grant write access.

drop policy "admin write" on public.site_settings;
create policy "admin write" on public.site_settings for all to authenticated
	using (auth.email() = 'wisnuwirayuda15@gmail.com')
	with check (auth.email() = 'wisnuwirayuda15@gmail.com');

drop policy "admin write" on public.stats;
create policy "admin write" on public.stats for all to authenticated
	using (auth.email() = 'wisnuwirayuda15@gmail.com')
	with check (auth.email() = 'wisnuwirayuda15@gmail.com');

drop policy "admin write" on public.projects;
create policy "admin write" on public.projects for all to authenticated
	using (auth.email() = 'wisnuwirayuda15@gmail.com')
	with check (auth.email() = 'wisnuwirayuda15@gmail.com');

drop policy "admin write" on public.tech_stacks;
create policy "admin write" on public.tech_stacks for all to authenticated
	using (auth.email() = 'wisnuwirayuda15@gmail.com')
	with check (auth.email() = 'wisnuwirayuda15@gmail.com');

drop policy "admin write" on public.experience;
create policy "admin write" on public.experience for all to authenticated
	using (auth.email() = 'wisnuwirayuda15@gmail.com')
	with check (auth.email() = 'wisnuwirayuda15@gmail.com');

drop policy "admin write" on public.socials;
create policy "admin write" on public.socials for all to authenticated
	using (auth.email() = 'wisnuwirayuda15@gmail.com')
	with check (auth.email() = 'wisnuwirayuda15@gmail.com');

-- Public buckets serve objects via public URL without RLS; the broad SELECT
-- policy only enabled listing. Scope everything to the admin instead.
drop policy "public read project images" on storage.objects;
drop policy "admin insert project images" on storage.objects;
drop policy "admin update project images" on storage.objects;
drop policy "admin delete project images" on storage.objects;

create policy "admin select project images" on storage.objects
	for select to authenticated
	using (bucket_id = 'project-images' and auth.email() = 'wisnuwirayuda15@gmail.com');
create policy "admin insert project images" on storage.objects
	for insert to authenticated
	with check (bucket_id = 'project-images' and auth.email() = 'wisnuwirayuda15@gmail.com');
create policy "admin update project images" on storage.objects
	for update to authenticated
	using (bucket_id = 'project-images' and auth.email() = 'wisnuwirayuda15@gmail.com');
create policy "admin delete project images" on storage.objects
	for delete to authenticated
	using (bucket_id = 'project-images' and auth.email() = 'wisnuwirayuda15@gmail.com');

-- Pre-existing SECURITY DEFINER helper should not be callable via the API.
revoke execute on function public.rls_auto_enable() from anon, authenticated, public;
