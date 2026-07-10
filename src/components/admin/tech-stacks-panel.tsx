"use client";

import { Pencil, Plus } from "lucide-react";
import { useState } from "react";

import {
  DeleteIconButton,
  EntityDialog,
  FormField,
} from "@/components/admin/crud-scaffold";
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

type TechStackRow = RowOf<"tech_stacks">;

export function TechStacksPanel() {
  const { list, save, remove } = useAdminTable("tech_stacks");
  const [editing, setEditing] = useState<TechStackRow | "new" | null>(null);
  const row = editing === "new" ? null : editing;

  const submit = (fd: FormData) => {
    save.mutate(
      {
        id: row?.id,
        values: {
          category: String(fd.get("category") ?? "").trim(),
          skills: String(fd.get("skills") ?? "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
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
          <Plus /> Add category
        </Button>
      </div>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead className="w-32">Category</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead className="w-20">Order</TableHead>
            <TableHead className="w-24" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.data.map((group) => (
            <TableRow key={group.id}>
              <TableCell className="font-medium">{group.category}</TableCell>
              <TableCell className="max-w-72 truncate text-muted-foreground">
                {group.skills.join(", ")}
              </TableCell>
              <TableCell>{group.sort_order}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Edit ${group.category}`}
                  onClick={() => setEditing(group)}
                >
                  <Pencil className="size-4" />
                </Button>
                <DeleteIconButton
                  entity={group.category}
                  onConfirm={() => remove.mutate(group.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EntityDialog
        key={row?.id ?? "new"}
        title={row ? "Edit category" : "Add category"}
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        onSubmit={submit}
        saving={save.isPending}
      >
        <FormField label="Category" htmlFor="stack-category">
          <Input
            id="stack-category"
            name="category"
            required
            placeholder="Frontend"
            defaultValue={row?.category ?? ""}
          />
        </FormField>
        <FormField label="Skills (comma-separated)" htmlFor="stack-skills">
          <Textarea
            id="stack-skills"
            name="skills"
            rows={3}
            required
            placeholder="HTML, CSS, JavaScript"
            defaultValue={row?.skills.join(", ") ?? ""}
          />
        </FormField>
        <FormField label="Sort order" htmlFor="stack-sort">
          <Input
            id="stack-sort"
            name="sort_order"
            type="number"
            defaultValue={row?.sort_order ?? 0}
          />
        </FormField>
      </EntityDialog>
    </div>
  );
}
