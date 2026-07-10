import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

let client: SupabaseClient<Database> | null | undefined;

/** Stateless client for public content reads — no session, no localStorage,
 * safe both during SSR and in the browser. Returns null when Supabase env
 * vars are absent so callers can fall back to static data. */
export function getContentClient() {
	if (client === undefined) {
		const url = import.meta.env.VITE_SUPABASE_URL;
		const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
		client =
			url && key
				? createClient<Database>(url, key, {
						auth: { persistSession: false, autoRefreshToken: false },
					})
				: null;
	}
	return client;
}
