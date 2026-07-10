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
import { type RowOf, useAdminTable } from "@/hooks/use-admin-crud";

type StatRow = RowOf<"stats">;

export function StatsPanel() {
  const { list, save, remove } = useAdminTable("stats");
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
          <Plus /> Add stat
        </Button>
      </div>
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Value</TableHead>
            <TableHead>Label</TableHead>
            <TableHead className="w-20">Order</TableHead>
            <TableHead className="w-24" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.data.map((stat) => (
            <TableRow key={stat.id}>
              <TableCell className="font-mono">
                {stat.value.toLocaleString()}
                {stat.suffix}
              </TableCell>
              <TableCell>{stat.label}</TableCell>
              <TableCell>{stat.sort_order}</TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <EntityDialog
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
        <FormField label="Sort order" htmlFor="stat-sort">
          <Input
            id="stat-sort"
            name="sort_order"
            type="number"
            defaultValue={row?.sort_order ?? 0}
          />
        </FormField>
      </EntityDialog>
    </div>
  );
}
