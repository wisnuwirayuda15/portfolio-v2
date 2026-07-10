import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "./server";

/** Server-verified session check (auth.getUser validates the JWT against
 * Supabase — never trust getSession on the server). */
export const getUserFn = createServerFn({ method: "GET" }).handler(
	async () => {
		const supabase = getSupabaseServerClient();
		const { data } = await supabase.auth.getUser();
		return data.user ? { email: data.user.email ?? "" } : null;
	},
);
