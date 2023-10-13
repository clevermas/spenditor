export function Amount({ value }: { value: number }) {
  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

  return <div className="text-slate-700 text-right">{amount}</div>;
}
