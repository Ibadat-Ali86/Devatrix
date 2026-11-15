import * as React from "react";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card" className={cn("rounded-xl border border-slate-200 bg-white text-slate-900", className)} {...props} />;
}

export { Card };
