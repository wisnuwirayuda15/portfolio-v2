"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/** Social icon input: upload an .svg (FileReader.readAsDataURL natively
 * yields data:image/svg+xml;base64,...) or paste the data-URI directly.
 * Rendered via <img>, which also neutralizes any scripts in a pasted SVG. */
export function SvgIconField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const valid = value.startsWith("data:image/svg+xml");

  const readFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-3">
        {valid ? (
          <img
            src={value}
            alt="Icon preview"
            className="size-9 shrink-0 rounded-md border border-border p-1.5"
          />
        ) : (
          <div className="size-9 shrink-0 rounded-md border border-dashed border-border" />
        )}
        <Input type="file" accept=".svg,image/svg+xml" onChange={readFile} />
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value.trim())}
        placeholder="data:image/svg+xml;base64,…"
        rows={3}
        className="font-mono text-xs"
      />
      <p className="text-xs text-muted-foreground">
        Upload an .svg file or paste a base64 data-URI. Use a literal fill
        color — currentColor doesn't apply inside &lt;img&gt;.
      </p>
    </div>
  );
}
