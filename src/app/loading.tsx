import LiquidWaveSpinner from "@/components/ui/spinner-10";

export default function Loading() {
  return (
    <div className="flex h-screen min-h-[100dvh] w-full items-center justify-center bg-background">
      <LiquidWaveSpinner size="md" />
    </div>
  );
}
