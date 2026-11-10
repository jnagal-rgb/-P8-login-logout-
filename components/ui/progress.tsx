"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type ProgressProps = {
  value?: number;
  className?: string;
};

function Progress({
  value = 0,
  className,
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percentage}
    >
      <div
        className="h-full bg-primary transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export { Progress };