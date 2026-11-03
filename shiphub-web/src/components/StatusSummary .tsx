import type { Order } from "../types.ts";
import { countByStatus } from "../libs/countByStatus.ts";
import {CountsBadge} from "./CountsBadge.tsx";

type OrderCountsContainerProps = {
  orders: Order[];
};
export function StatusSummary ({ orders }: Readonly<OrderCountsContainerProps>) {

  const count = countByStatus({orders});

  return (
    <div className="counts-container">
      {Object.entries(count).map(([status, count]) => (
        <div key={status} className="count-item">
          <CountsBadge label={status} count={count} />
        </div>
      ))}
    </div>
  );
}