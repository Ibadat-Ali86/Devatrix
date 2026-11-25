"use client";

import LiquidWaveSpinner from "@/components/ui/spinner-10";

type BrandLoaderProps = {
  context?: "application" | "page";
};

export default function BrandLoader({ context = "page" }: BrandLoaderProps) {
  if (context === "application") {
    return (
      <div className="flex w-full items-center justify-center py-6 bg-transparent" role="status" aria-live="polite">
        <LiquidWaveSpinner size="sm" />
      </div>
    );
  }

  return (
    <div className="flex h-screen min-h-[100dvh] w-full items-center justify-center bg-background" role="status" aria-live="polite">
      <LiquidWaveSpinner size="md" />
    </div>
  );
}
