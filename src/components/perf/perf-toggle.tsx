"use client";

import { Sparkles, Zap } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { usePerformanceMode } from "@/hooks/use-performance-mode";
import { cn } from "@/lib/utils";

interface PerfToggleProps {
  variant?: "nav" | "drawer";
}

export function PerfToggle({ variant = "nav" }: PerfToggleProps) {
  const { isLiteMode, setIsLiteMode } = usePerformanceMode();

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        variant === "drawer" && "w-full justify-between",
      )}
    >
      {isLiteMode ? (
        <Zap className="size-4 text-accent-blue" />
      ) : (
        <Sparkles className="size-4 text-primary" />
      )}
      <span className="text-sm text-muted-foreground">
        {isLiteMode ? "Lite" : "Full"}
      </span>
      <Switch
        role="switch"
        aria-checked={isLiteMode}
        aria-label="Toggle lite mode"
        checked={isLiteMode}
        onCheckedChange={setIsLiteMode}
      />
    </div>
  );
}
