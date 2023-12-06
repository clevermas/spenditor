import { cn } from "@/lib/utils";

export function Amount({
  value,
  currency = "USD",
  className,
}: {
  value: number;
  currency?: string;
  className: any;
}) {
  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(isNaN(value) ? 0 : value);

  return <div className={cn("text-right", className)}>{amount}</div>;
}
