"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBrowserClient } from "@/lib/supabase/client";

const BUCKET = "project-images";

/** Project image input: uploads to the public Supabase Storage bucket and
 * reports the resulting public URL. */
export function ImageUploadField({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "png";
      const path = `${crypto.randomUUID()}.${ext}`;
      const client = getBrowserClient();
      const { error } = await client.storage.from(BUCKET).upload(path, file);
      if (error) throw error;
      onChange(client.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="grid gap-2">
      {value && (
        <div className="flex items-center gap-3">
          <img
            src={value}
            alt="Project thumbnail"
            className="h-16 w-24 rounded-md border border-border object-cover"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange(null)}
          >
            Remove
          </Button>
        </div>
      )}
      <Input
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
      {uploading && (
        <p className="text-xs text-muted-foreground">Uploading…</p>
      )}
    </div>
  );
}
