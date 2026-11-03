import { ORDER_STATUSES, type Order, type StatusCounts } from "../types";

type countByStatusParams = {
  orders: Order[];
};
 
export const  countByStatus = ({ orders }: countByStatusParams): StatusCounts => {

    const counts: StatusCounts = {} as StatusCounts;

    for (const status of ORDER_STATUSES) {
        counts[status] = 0;
    }

    for (const order of orders) {
        counts[order.status]++;
    }
    
    return counts;
};