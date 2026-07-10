"use client";

import { CountUp } from "@/components/editorial/count-up";
import { MonoLabel } from "@/components/editorial/mono-label";
import { usePortfolioContent } from "@/lib/content";

export function Stats() {
  const { stats } = usePortfolioContent();
  return (
    <section
      id="stats"
      className="border-y border-border px-5 py-14 md:px-10 lg:px-16"
    >
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-2 gap-px bg-border md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-background px-2 py-4 md:px-6">
            <div className="font-heading text-4xl font-bold tracking-tight md:text-6xl">
              <CountUp value={stat.value} suffix={stat.suffix} />
            </div>
            <div className="mt-2">
              <MonoLabel>{stat.label}</MonoLabel>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
