"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

import { FormField } from "@/components/admin/crud-scaffold";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getBrowserClient } from "@/lib/supabase/client";

export function SettingsPanel() {
  const queryClient = useQueryClient();

  const settings = useQuery({
    queryKey: ["admin", "site_settings"],
    queryFn: async () => {
      const { data, error } = await getBrowserClient()
        .from("site_settings")
        .select("*")
        .eq("id", 1)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async (resumeFileId: string) => {
      const { error } = await getBrowserClient()
        .from("site_settings")
        .update({
          resume_file_id: resumeFileId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "site_settings"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio-content"] });
      toast.success("Saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (settings.isPending) return <Skeleton className="h-24 w-full" />;
  if (settings.isError)
    return <p className="text-destructive">{settings.error.message}</p>;

  return (
    <form
      className="grid max-w-xl gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        save.mutate(String(fd.get("resume_file_id") ?? "").trim());
      }}
    >
      <FormField label="Resume Google Drive file id" htmlFor="resume-file-id">
        <Input
          id="resume-file-id"
          name="resume_file_id"
          required
          className="font-mono"
          defaultValue={settings.data.resume_file_id}
        />
      </FormField>
      <p className="text-xs text-muted-foreground">
        The id from the Drive share link:
        drive.google.com/file/d/<b>&lt;id&gt;</b>/view
      </p>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save"}
        </Button>
        <a
          href={`https://drive.google.com/file/d/${settings.data.resume_file_id}/view`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Preview on Drive <ArrowUpRight className="size-3.5" />
        </a>
      </div>
    </form>
  );
}
