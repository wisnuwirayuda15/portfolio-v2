-- Backup of migration `seed_portfolio_content` applied to project omgywqbxxvcfshpoxerh (2026-07-09).
-- Seeds all tables from the then-current src/data/resume.ts values.

insert into public.site_settings (id, resume_file_id)
values (1, '19dgdpZ56FVvNO2gTAFcp9ByzPxg59S4I');

insert into public.stats (value, suffix, label, sort_order) values
	(150000, '+', 'Active users served', 0),
	(2, ' yrs', 'Professional experience', 1),
	(5, '+', 'Production projects', 2),
	(60, '+', 'Students mentored', 3);

insert into public.projects (title, blurb, role, year, stack, featured, sort_order) values
	('Large-Scale LMS Platform', 'Front-end for a learning-management product serving 150,000+ active users — responsive, scalable interfaces with optimized rendering and asset loading for fast page loads.', 'Front-End Engineer', '2025', array['React.js','Next.js','Tailwind CSS','TypeScript'], true, 0),
	('Production Web App Suite', 'Built and maintained user-centric interfaces across multiple production releases — features, security updates, and cross-browser consistency in an agile team.', 'Front-End Engineer', '2025', array['React.js','styled-components','SQL'], false, 1),
	('Practicum Learning Materials', 'Designed and delivered hands-on web-development curricula (HTML, CSS, JS, PHP, Laravel) and reviewed 60+ students'' projects as a lab assistant.', 'Practicum Assistant', '2024', array['Laravel','PHP','JavaScript'], false, 2),
	('Your Next Project', '[Owner: replace this slot with a real project — title, blurb, stack, image in /public, and a live or case-study link.]', '—', '2026', array['Add','Your','Stack'], false, 3);

insert into public.tech_stacks (category, skills, sort_order) values
	('Frontend', array['HTML','CSS','JavaScript','React.js','Next.js','Svelte','Vue','Tailwind CSS','Bootstrap','styled-components'], 0),
	('Backend', array['Golang','PHP','Laravel','SQL'], 1),
	('Mobile', array['React Native','Flutter'], 2),
	('Tools', array['Linux','Windows'], 3);

insert into public.experience (role, company, location, start_date, end_date, highlights, featured, sort_order) values
	('Software Engineer (Front-End)', 'Coding Studio', 'Bekasi', 'Dec 2024', 'Present', array[
		'Built responsive, scalable interfaces for production apps, including an LMS serving 150,000+ users.',
		'Cut page-load times by optimizing component rendering and asset loading.',
		'Shipped features, security updates, and fixes in an agile cross-functional team.'
	], true, 0),
	('Capstone Project Practicum Assistant', 'EAD Lab, Telkom University', null, 'Mar 2024', 'May 2024', array[
		'Mentored 60+ students on Git/GitHub and version-control practice.',
		'Authored learning materials and reviewed project submissions.'
	], false, 1),
	('Web Application Development Practicum Assistant', 'EAD Lab, Telkom University', null, 'Sep 2023', 'Feb 2024', array[
		'Taught HTML, CSS, JavaScript, PHP, and Laravel to 60+ students.',
		'Built course materials and evaluated project work.'
	], false, 2),
	('Algorithm & Programming Practicum Assistant', 'Daspro Lab, Telkom University', null, 'Sep 2023', 'Feb 2024', array[
		'Taught Python to 60+ students.',
		'Authored instructional materials and graded coursework.'
	], false, 3),
	('Forensic Science Technician', 'Pusat Laboratorium Forensik Bareskrim Polri', null, 'Jun 2023', 'Aug 2023', array[
		'Assisted digital-evidence analysis using forensic tooling.'
	], false, 4),
	('Social Media Designer', 'ESD Lab, Telkom University', null, 'Sep 2021', 'Aug 2024', array[
		'Produced Instagram content in Figma and other design tools.'
	], false, 5);

-- Social icons: SVG markup encoded to base64 data-URIs by Postgres.
-- fill is a literal ink hex because currentColor cannot cascade into <img>-embedded SVGs.
insert into public.socials (name, url, icon_svg, sort_order) values
	(
		'GitHub',
		'https://github.com/wisnuwirayuda15',
		'data:image/svg+xml;base64,' || translate(encode(convert_to(
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2b2a25"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
			'UTF8'), 'base64'), E'\n', ''),
		0
	),
	(
		'LinkedIn',
		'https://www.linkedin.com/in/wisnuwirayuda/',
		'data:image/svg+xml;base64,' || translate(encode(convert_to(
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2b2a25"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
			'UTF8'), 'base64'), E'\n', ''),
		1
	);
