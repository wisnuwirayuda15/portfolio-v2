"use client";

import { Pencil, Plus } from "lucide-react";
import { useState } from "react";

import {
  BulkDeleteButton,
  DeleteIconButton,
  EntityDrawer,
  FormField,
} from "@/components/admin/crud-scaffold";
import { SortableTable } from "@/components/admin/sortable-table";
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

type TechStackRow = RowOf<"tech_stacks">;

export function TechStacksPanel() {
  const { list, save, remove, removeMany, reorder } =
    useAdminTable("tech_stacks");
  const selection = useRowSelection(list.data);
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
        <Button size="sm" onClick={() => setEditing("new")}>
          <Plus /> Add category
        </Button>
      </div>
      <SortableTable
        items={list.data}
        onReorder={(rows) => reorder.mutate(rows)}
        selected={selection.selected}
        onSelectedChange={selection.setSelected}
        head={
          <>
            <TableHead className="w-32">Category</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead className="w-24" />
          </>
        }
        renderRow={(group) => (
          <>
            <TableCell className="font-medium">{group.category}</TableCell>
            <TableCell className="max-w-72 truncate text-muted-foreground">
              {group.skills.join(", ")}
            </TableCell>
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
          </>
        )}
      />

      <EntityDrawer
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
      </EntityDrawer>
    </div>
  );
}
