"use client";

import { Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  DeleteIconButton,
  EntityDialog,
  FormField,
} from "@/components/admin/crud-scaffold";
import { SortableTable } from "@/components/admin/sortable-table";
import { SvgIconField } from "@/components/admin/svg-icon-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableHead } from "@/components/ui/table";
import { type RowOf, useAdminTable } from "@/hooks/use-admin-crud";

type SocialRow = RowOf<"socials">;

export function SocialsPanel() {
  const { list, save, remove, reorder } = useAdminTable("socials");
  const [editing, setEditing] = useState<SocialRow | "new" | null>(null);
  const [iconSvg, setIconSvg] = useState("");
  const row = editing === "new" ? null : editing;

  const openEditor = (target: SocialRow | "new") => {
    setIconSvg(target === "new" ? "" : target.icon_svg);
    setEditing(target);
  };

  const submit = (fd: FormData) => {
    if (!iconSvg.startsWith("data:image/svg+xml")) {
      toast.error("Icon must be a data:image/svg+xml data-URI.");
      return;
    }
    save.mutate(
      {
        id: row?.id,
        values: {
          name: String(fd.get("name") ?? "").trim(),
          url: String(fd.get("url") ?? "").trim(),
          icon_svg: iconSvg,
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
      <div className="flex justify-end">
        <Button size="sm" onClick={() => openEditor("new")}>
          <Plus /> Add social
        </Button>
      </div>
      <SortableTable
        items={list.data}
        onReorder={(rows) => reorder.mutate(rows)}
        head={
          <>
            <TableHead className="w-12">Icon</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>URL</TableHead>
            <TableHead className="w-24" />
          </>
        }
        renderRow={(social) => (
          <>
            <TableCell>
              <img src={social.icon_svg} alt="" className="size-5" />
            </TableCell>
            <TableCell className="font-medium">{social.name}</TableCell>
            <TableCell className="max-w-56 truncate text-muted-foreground">
              {social.url}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={`Edit ${social.name}`}
                onClick={() => openEditor(social)}
              >
                <Pencil className="size-4" />
              </Button>
              <DeleteIconButton
                entity={social.name}
                onConfirm={() => remove.mutate(social.id)}
              />
            </TableCell>
          </>
        )}
      />

      <EntityDialog
        key={row?.id ?? "new"}
        title={row ? "Edit social" : "Add social"}
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
        onSubmit={submit}
        saving={save.isPending}
      >
        <FormField label="Name" htmlFor="social-name">
          <Input
            id="social-name"
            name="name"
            required
            placeholder="GitHub"
            defaultValue={row?.name ?? ""}
          />
        </FormField>
        <FormField label="URL" htmlFor="social-url">
          <Input
            id="social-url"
            name="url"
            type="url"
            required
            placeholder="https://…"
            defaultValue={row?.url ?? ""}
          />
        </FormField>
        <FormField label="Icon (SVG)">
          <SvgIconField value={iconSvg} onChange={setIconSvg} />
        </FormField>
      </EntityDialog>
    </div>
  );
}
