"use client";

import { Pencil, Plus } from "lucide-react";
import { useState } from "react";

import {
  DeleteIconButton,
  EntityDialog,
  FormField,
} from "@/components/admin/crud-scaffold";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { type RowOf, useAdminTable } from "@/hooks/use-admin-crud";

type JobRow = RowOf<"experience">;

export function ExperiencePanel() {
  const { list, save, remove } = useAdminTable("experience");
  const [editing, setEditing] = useState<JobRow | "new" | null>(null);
  const row = editing === "new" ? null : editing;

  const submit = (fd: FormData) => {
    save.mutate(
      {
        id: row?.id,
        values: {
          role: String(fd.get("role") ?? "").trim(),
          company: String(fd.get("company") ?? "").trim(),
          location: String(fd.get("location") ?? "").trim() || null,
          start_date: String(fd.get("start_date") ?? "").trim(),
          end_date: String(fd.get("end_date") ?? "").trim() || "Present",
          highlights: String(fd.get("highlights") ?? "")
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
          featured: fd.get("featured") === "on",
          sort_order: Number(fd.get("sort_order")),
        },
      },
      { onSuccess: () => setEditing(null) },
    );
  };

  if (list.isPending) return <Skeleton className="h-40 w-full" />;
  if (list.isError)
    return <p className="text-destructive">{list.error.message}</p>;

  return (
    <div>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setEditing("new")}>
          <Plus /> Add role
        </Button>
      </div>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="w-40">Period</TableHead>
            <TableHead className="w-20">Order</TableHead>
            <TableHead className="w-24" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.data.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="max-w-48 truncate font-medium">
                {job.role} {job.featured && <Badge>Current</Badge>}
              </TableCell>
              <TableCell className="max-w-40 truncate text-muted-foreground">
                {job.company}
              </TableCell>
              <TableCell className="font-mono text-xs">
                {job.start_date} — {job.end_date}
              </TableCell>
              <TableCell>{job.sort_order}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Edit ${job.role}`}
                  onClick={() => setEditing(job)}
                >
                  <Pencil className="size-4" />
                </Button>
                <DeleteIconButton
                  entity={job.role}
                  onConfirm={() => remove.mutate(job.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EntityDialog
        key={row?.id ?? "new"}
        title={row ? "Edit role" : "Add role"}
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        onSubmit={submit}
        saving={save.isPending}
      >
        <FormField label="Role" htmlFor="job-role">
          <Input
            id="job-role"
            name="role"
            required
            defaultValue={row?.role ?? ""}
          />
        </FormField>
        <FormField label="Company" htmlFor="job-company">
          <Input
            id="job-company"
            name="company"
            required
            defaultValue={row?.company ?? ""}
          />
        </FormField>
        <FormField label="Location (optional)" htmlFor="job-location">
          <Input
            id="job-location"
            name="location"
            defaultValue={row?.location ?? ""}
          />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Start" htmlFor="job-start">
            <Input
              id="job-start"
              name="start_date"
              required
              placeholder="Dec 2024"
              defaultValue={row?.start_date ?? ""}
            />
          </FormField>
          <FormField label="End" htmlFor="job-end">
            <Input
              id="job-end"
              name="end_date"
              placeholder="Present"
              defaultValue={row?.end_date ?? ""}
            />
          </FormField>
        </div>
        <FormField label="Highlights (one per line)" htmlFor="job-highlights">
          <Textarea
            id="job-highlights"
            name="highlights"
            rows={4}
            defaultValue={row?.highlights.join("\n") ?? ""}
          />
        </FormField>
        <div className="grid grid-cols-2 items-end gap-4">
          <FormField label="Sort order" htmlFor="job-sort">
            <Input
              id="job-sort"
              name="sort_order"
              type="number"
              defaultValue={row?.sort_order ?? 0}
            />
          </FormField>
          <label className="flex min-h-9 items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={row?.featured ?? false}
              className="size-4 accent-foreground"
            />
            Current role
          </label>
        </div>
      </EntityDialog>
    </div>
  );
}
