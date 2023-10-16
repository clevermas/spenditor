export function Amount({
  value,
  currency = "USD",
}: {
  value: number;
  currency: string;
}) {
  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(isNaN(value) ? 0 : value);

  return <div className="text-right">{amount}</div>;
}
