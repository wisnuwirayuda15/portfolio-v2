import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

let client: SupabaseClient<Database> | undefined;

/** Cookie-backed auth client for the admin area (lazy singleton — never
 * constructed during SSR; call only from effects and event handlers). */
export function getBrowserClient() {
	if (!client) {
		client = createBrowserClient<Database>(
			import.meta.env.VITE_SUPABASE_URL,
			import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
		);
	}
	return client;
}
