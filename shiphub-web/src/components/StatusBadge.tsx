import type {OrderStatus} from '../types.ts';

type StatusBadgeProps = Readonly<{
    status: OrderStatus
}>
export default function StatusBadge({status}: StatusBadgeProps){

    return (
        <span className='status-badge'>
            {status}
        </span>
    )

}  