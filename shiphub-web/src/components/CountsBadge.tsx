type CountBadgeProps = {
  label: string;
  count: number;
};
export function CountsBadge({ label, count }: Readonly<CountBadgeProps>) {
  return (
    <div className="count-badge">
      <span className="label">{label}</span>
      <span className="count">{count}</span>
    </div>
  );
}
