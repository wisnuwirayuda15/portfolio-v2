"use client";

import { Pencil, Plus } from "lucide-react";
import { useState } from "react";

import {
  BulkDeleteButton,
  DeleteIconButton,
  EntityDrawer,
  FormField,
} from "@/components/admin/crud-scaffold";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { SortableTable } from "@/components/admin/sortable-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableHead } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  type RowOf,
  useAdminTable,
  useRowSelection,
} from "@/hooks/use-admin-crud";

type ProjectRow = RowOf<"projects">;

export function ProjectsPanel() {
  const { list, save, remove, removeMany, reorder } =
    useAdminTable("projects");
  const selection = useRowSelection(list.data);
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
          ...(row ? {} : { sort_order: list.data?.length ?? 0 }),
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
      <div className="flex justify-end gap-2">
        <BulkDeleteButton
          count={selection.ids.length}
          pending={removeMany.isPending}
          onConfirm={() =>
            removeMany.mutate(selection.ids, { onSuccess: selection.clear })
          }
        />
        <Button size="sm" onClick={() => openEditor("new")}>
          <Plus /> Add project
        </Button>
      </div>
      <SortableTable
        items={list.data}
        onReorder={(rows) => reorder.mutate(rows)}
        selected={selection.selected}
        onSelectedChange={selection.setSelected}
        head={
          <>
            <TableHead>Title</TableHead>
            <TableHead className="hidden w-20 sm:table-cell">Year</TableHead>
            <TableHead className="hidden w-24 sm:table-cell">
              Featured
            </TableHead>
            <TableHead className="w-24" />
          </>
        }
        renderRow={(project) => (
          <>
            <TableCell className="max-w-56 truncate font-medium">
              {project.title}
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              {project.year}
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              {project.featured && <Badge>Featured</Badge>}
            </TableCell>
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
          </>
        )}
      />

      <EntityDrawer
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
        <label className="flex min-h-9 items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={row?.featured ?? false}
            className="size-4 accent-foreground"
          />
          Featured
        </label>
      </EntityDrawer>
    </div>
  );
}
