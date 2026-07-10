import { createServerClient } from "@supabase/ssr";
import { getCookies, setCookie } from "@tanstack/react-start/server";
import type { Database } from "./database.types";

/** Cookie-aware client for server functions — sees the admin session during SSR. */
export function getSupabaseServerClient() {
	return createServerClient<Database>(
		import.meta.env.VITE_SUPABASE_URL,
		import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
		{
			cookies: {
				getAll() {
					return Object.entries(getCookies()).map(([name, value]) => ({
						name,
						value,
					}));
				},
				setAll(cookiesToSet) {
					for (const { name, value, options } of cookiesToSet) {
						setCookie(name, value, options);
					}
				},
			},
		},
	);
}
