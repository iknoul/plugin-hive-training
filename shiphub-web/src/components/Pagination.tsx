import { useEffect, useState } from "react";
import type { Pagination } from "../http/order-apis";

type PaginationProps = Readonly<{
    count: number;
    pagination: Pagination;
    limit: number;
    loading: boolean;
    handlePageChange: (page:number)=> void;
    handleLimitChange: (limit:number)=> void
}>


export function Pagination({
    count,
    pagination, 
    limit,
    loading,
    handleLimitChange, 
    handlePageChange}:PaginationProps) 
{
    const [page, setPage] = useState<number>(1)
    
    const handleLimitChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        const limitValue = Number(e.target.value);

        if(limitValue > 100 || limitValue < 1) {
            return
        }
        handleLimitChange(limitValue);
        handlePageChange(1);
    };

    const handlePageChangeEvent = (incr: number) => {
        setPage(prev =>
            Math.max(
                1,
                Math.min(pagination.totalPages || 1, prev + incr)
            )
        );
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            handlePageChange(page)
        }, 400);
        

        return () => clearTimeout(timer);
    }, [page]);

    return (
        <div className='pagination'>
            {!loading && <>
            <div className="page">
                <button 
                    disabled={pagination.page <= 1}
                    className='page-action-icon'
                    onClick={()=>handlePageChangeEvent(-1)}
                >
                    &lt;
                </button>
                <span>{`page ${pagination.page}`}</span>
                <button 
                    disabled={pagination.page >= pagination.totalPages}
                    className='page-action-icon'
                    onClick={()=>handlePageChangeEvent(1)}
                >
                    &gt;
                </button>
            </div>
            <div className='item-counts'>
                <p>{`showing ${count}/${pagination.total}, total pages: ${pagination.totalPages}`}</p>
                <span className='limit'>
                    <label htmlFor="limit">limit</label>
                    <input type='number' 
                        max={40} 
                        min={1} 
                        step={1} 
                        onChange={handleLimitChangeEvent}
                        value={limit}
                    />
                </span>
            </div>
            </>
            }

        </div>
    )
}