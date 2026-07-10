-- Backup of migration `create_portfolio_schema` applied to project omgywqbxxvcfshpoxerh (2026-07-09).
-- Tables + RLS for all admin-managed portfolio content.

create table public.site_settings (
	id smallint primary key default 1 check (id = 1),
	resume_file_id text not null,
	updated_at timestamptz not null default now()
);

create table public.stats (
	id uuid primary key default gen_random_uuid(),
	value integer not null,
	suffix text,
	label text not null,
	sort_order integer not null default 0
);

create table public.projects (
	id uuid primary key default gen_random_uuid(),
	title text not null,
	blurb text not null default '',
	role text not null default '',
	year text not null default '',
	stack text[] not null default '{}',
	featured boolean not null default false,
	image_url text,
	href text,
	sort_order integer not null default 0
);

create table public.tech_stacks (
	id uuid primary key default gen_random_uuid(),
	category text not null,
	skills text[] not null default '{}',
	sort_order integer not null default 0
);

create table public.experience (
	id uuid primary key default gen_random_uuid(),
	role text not null,
	company text not null,
	location text,
	start_date text not null,
	end_date text not null default 'Present',
	highlights text[] not null default '{}',
	featured boolean not null default false,
	sort_order integer not null default 0
);

create table public.socials (
	id uuid primary key default gen_random_uuid(),
	name text not null,
	url text not null,
	icon_svg text not null check (icon_svg like 'data:image/svg+xml%'),
	sort_order integer not null default 0
);

alter table public.site_settings enable row level security;
alter table public.stats enable row level security;
alter table public.projects enable row level security;
alter table public.tech_stacks enable row level security;
alter table public.experience enable row level security;
alter table public.socials enable row level security;

create policy "public read" on public.site_settings for select using (true);
create policy "admin write" on public.site_settings for all to authenticated using (true) with check (true);

create policy "public read" on public.stats for select using (true);
create policy "admin write" on public.stats for all to authenticated using (true) with check (true);

create policy "public read" on public.projects for select using (true);
create policy "admin write" on public.projects for all to authenticated using (true) with check (true);

create policy "public read" on public.tech_stacks for select using (true);
create policy "admin write" on public.tech_stacks for all to authenticated using (true) with check (true);

create policy "public read" on public.experience for select using (true);
create policy "admin write" on public.experience for all to authenticated using (true) with check (true);

create policy "public read" on public.socials for select using (true);
create policy "admin write" on public.socials for all to authenticated using (true) with check (true);
