"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import { toast } from "sonner";

import { getBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/database.types";

// ponytail: erase supabase's per-table generics once — they can't follow a
// dynamic table name. RLS + DB constraints validate the payload regardless.
const db = () => getBrowserClient() as unknown as SupabaseClient;

export type CrudTable =
  | "stats"
  | "projects"
  | "tech_stacks"
  | "experience"
  | "socials";

export type RowOf<T extends CrudTable> =
  Database["public"]["Tables"][T]["Row"];

/** List + save + delete for one admin-managed table. Plain useQuery (never
 * suspense) so nothing fetches during SSR; mutations invalidate both the
 * admin list and the public content query. */
export function useAdminTable<T extends CrudTable>(table: T) {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", table] });
    queryClient.invalidateQueries({ queryKey: ["portfolio-content"] });
  };

  const list = useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await db()
        .from(table)
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as RowOf<T>[];
    },
  });

  const save = useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id?: string;
      values: Record<string, unknown>;
    }) => {
      const { error } = id
        ? await db().from(table).update(values).eq("id", id)
        : await db().from(table).insert(values);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db().from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  /** Persist a drag-reorder: sort_order = array index. Optimistic — the
   * list snaps to the new order immediately, refetches on failure. */
  const reorder = useMutation({
    mutationFn: async (ordered: RowOf<T>[]) => {
      const results = await Promise.all(
        ordered.map((row, i) =>
          db().from(table).update({ sort_order: i }).eq("id", row.id),
        ),
      );
      const failed = results.find((r) => r.error);
      if (failed?.error) throw failed.error;
    },
    onMutate: (ordered) => {
      queryClient.setQueryData(
        ["admin", table],
        ordered.map((row, i) => ({ ...row, sort_order: i })),
      );
    },
    onSuccess: invalidate,
    onError: (e: Error) => {
      toast.error(e.message);
      queryClient.invalidateQueries({ queryKey: ["admin", table] });
    },
  });

  return { list, save, remove, reorder };
}
