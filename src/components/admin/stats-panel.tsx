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
import {
  type RowOf,
  useAdminTable,
  useRowSelection,
} from "@/hooks/use-admin-crud";

type StatRow = RowOf<"stats">;

export function StatsPanel() {
  const { list, save, remove, removeMany, reorder } = useAdminTable("stats");
  const selection = useRowSelection(list.data);
  const [editing, setEditing] = useState<StatRow | "new" | null>(null);
  const row = editing === "new" ? null : editing;

  const submit = (fd: FormData) => {
    save.mutate(
      {
        id: row?.id,
        values: {
          value: Number(fd.get("value")),
          suffix: String(fd.get("suffix") ?? "").trim() || null,
          label: String(fd.get("label") ?? "").trim(),
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
          <Plus /> Add stat
        </Button>
      </div>
      <SortableTable
        items={list.data}
        onReorder={(rows) => reorder.mutate(rows)}
        selected={selection.selected}
        onSelectedChange={selection.setSelected}
        head={
          <>
            <TableHead>Value</TableHead>
            <TableHead>Label</TableHead>
            <TableHead className="w-24" />
          </>
        }
        renderRow={(stat) => (
          <>
            <TableCell className="font-mono">
              {stat.value.toLocaleString()}
              {stat.suffix}
            </TableCell>
            <TableCell>{stat.label}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Edit ${stat.label}`}
                onClick={() => setEditing(stat)}
              >
                <Pencil className="size-4" />
              </Button>
              <DeleteIconButton
                entity={stat.label}
                onConfirm={() => remove.mutate(stat.id)}
              />
            </TableCell>
          </>
        )}
      />

      <EntityDrawer
        key={row?.id ?? "new"}
        title={row ? "Edit stat" : "Add stat"}
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        onSubmit={submit}
        saving={save.isPending}
      >
        <FormField label="Value" htmlFor="stat-value">
          <Input
            id="stat-value"
            name="value"
            type="number"
            required
            defaultValue={row?.value ?? ""}
          />
        </FormField>
        <FormField label="Suffix (optional)" htmlFor="stat-suffix">
          <Input
            id="stat-suffix"
            name="suffix"
            placeholder="+, k, yrs…"
            defaultValue={row?.suffix ?? ""}
          />
        </FormField>
        <FormField label="Label" htmlFor="stat-label">
          <Input
            id="stat-label"
            name="label"
            required
            defaultValue={row?.label ?? ""}
          />
        </FormField>
      </EntityDrawer>
    </div>
  );
}
