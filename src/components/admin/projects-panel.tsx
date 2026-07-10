"use client";

import { Pencil, Plus } from "lucide-react";
import { useState } from "react";

import {
  DeleteIconButton,
  EntityDialog,
  FormField,
} from "@/components/admin/crud-scaffold";
import { ImageUploadField } from "@/components/admin/image-upload-field";
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

type ProjectRow = RowOf<"projects">;

export function ProjectsPanel() {
  const { list, save, remove } = useAdminTable("projects");
  const [editing, setEditing] = useState<ProjectRow | "new" | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const row = editing === "new" ? null : editing;

  const openEditor = (target: ProjectRow | "new") => {
    setImageUrl(target === "new" ? null : target.image_url);
    setEditing(target);
  };

  const submit = (fd: FormData) => {
    save.mutate(
      {
        id: row?.id,
        values: {
          title: String(fd.get("title") ?? "").trim(),
          blurb: String(fd.get("blurb") ?? "").trim(),
          role: String(fd.get("role") ?? "").trim(),
          year: String(fd.get("year") ?? "").trim(),
          stack: String(fd.get("stack") ?? "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          href: String(fd.get("href") ?? "").trim() || null,
          featured: fd.get("featured") === "on",
          image_url: imageUrl,
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
        <Button size="sm" onClick={() => openEditor("new")}>
          <Plus /> Add project
        </Button>
      </div>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="w-20">Year</TableHead>
            <TableHead className="w-24">Featured</TableHead>
            <TableHead className="w-20">Order</TableHead>
            <TableHead className="w-24" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.data.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="max-w-56 truncate font-medium">
                {project.title}
              </TableCell>
              <TableCell>{project.year}</TableCell>
              <TableCell>
                {project.featured && <Badge>Featured</Badge>}
              </TableCell>
              <TableCell>{project.sort_order}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Edit ${project.title}`}
                  onClick={() => openEditor(project)}
                >
                  <Pencil className="size-4" />
                </Button>
                <DeleteIconButton
                  entity={project.title}
                  onConfirm={() => remove.mutate(project.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EntityDialog
        key={row?.id ?? "new"}
        title={row ? "Edit project" : "Add project"}
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        onSubmit={submit}
        saving={save.isPending}
      >
        <FormField label="Title" htmlFor="project-title">
          <Input
            id="project-title"
            name="title"
            required
            defaultValue={row?.title ?? ""}
          />
        </FormField>
        <FormField label="Blurb" htmlFor="project-blurb">
          <Textarea
            id="project-blurb"
            name="blurb"
            rows={3}
            defaultValue={row?.blurb ?? ""}
          />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Role" htmlFor="project-role">
            <Input
              id="project-role"
              name="role"
              defaultValue={row?.role ?? ""}
            />
          </FormField>
          <FormField label="Year" htmlFor="project-year">
            <Input
              id="project-year"
              name="year"
              defaultValue={row?.year ?? ""}
            />
          </FormField>
        </div>
        <FormField label="Stack (comma-separated)" htmlFor="project-stack">
          <Input
            id="project-stack"
            name="stack"
            placeholder="React.js, TypeScript"
            defaultValue={row?.stack.join(", ") ?? ""}
          />
        </FormField>
        <FormField label="Link (optional)" htmlFor="project-href">
          <Input
            id="project-href"
            name="href"
            type="url"
            placeholder="https://…"
            defaultValue={row?.href ?? ""}
          />
        </FormField>
        <FormField label="Image">
          <ImageUploadField value={imageUrl} onChange={setImageUrl} />
        </FormField>
        <div className="grid grid-cols-2 items-end gap-4">
          <FormField label="Sort order" htmlFor="project-sort">
            <Input
              id="project-sort"
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
            Featured
          </label>
        </div>
      </EntityDialog>
    </div>
  );
}
