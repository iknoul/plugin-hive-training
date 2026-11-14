
import type { Shipment } from '../types.ts';
import {fetchShipmentsByOrder } from '../http/order-apis.ts';
import type { Pagination as PaginationType } from '../http/order-apis.ts';
import { useEffect, useState } from 'react';
import ShipmentList from '../components/ShipmentList.tsx';
import { useParams } from 'react-router-dom';
import { AddNewShipment } from '../modals/AddNewShipment.tsx';
import { Pagination } from '../components/Pagination.tsx';


export default function OrderDetails(){

    const { id } = useParams();

    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [error, setError] = useState<string | null>('')
    const [loading, setLoading] = useState<boolean>(false)

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [debouncedPage, setDebouncedPage] = useState<number>(1)
    const [limit, setLimit] = useState<number>(20)

    const [pagination, setPagination] = useState<PaginationType>({
        page:1,
        limit: 20,
        total:1,
        totalPages:1
    })

    const handleAddNewShipmentToggle = () => {
        setIsModalOpen(prev => !prev)
    }

    const hanldeCreateShipment = (newShipment: Shipment) => {
        setShipments(prevShipments => [newShipment,...prevShipments]);
        setIsModalOpen(false);
    }

    useEffect(() => {
        if (!id) return;
        
        let cancelled = false;

        const loadShipments = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetchShipmentsByOrder({
                    id:id,
                    page: debouncedPage, 
                    limit
                });

                if (cancelled) return;

                setShipments(res.data ?? []);
                setPagination({
                    page: res.page || 1,
                    limit: res.limit || 1,
                    total: res.total || 1,
                    totalPages: res.totalPages || 1,
                })
                setError(res.error ?? null);
            } catch {
                if (cancelled) return;

                setError('Failed to load shipments');
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void loadShipments();

        return () => {
            cancelled = true;
        };
    }, [id, debouncedPage, limit]);

    return (
        <div className='order-details'>

            <div className='order-action-bar'>

                {isModalOpen && id && (
                    <AddNewShipment
                        orderId={id}
                        hanldeCreateShipment={hanldeCreateShipment}
                        handleAddNewShipmentToggle={handleAddNewShipmentToggle}
                    />
                )}

                <button className='btn btn-primary' onClick={handleAddNewShipmentToggle}>
                    <span className='btn-icon'>{isModalOpen ? '' : '+'}</span> {isModalOpen ? 'Close' : 'Add New Shipment'}
                </button>

            </div>

            {loading && <p>Loading...</p>}

            {error && <p>Something went wrong: {error}</p>}

            {!loading && !error && (
                <ShipmentList shipments={shipments}/>
            )}
 
            <Pagination 
                pagination={pagination}
                count = {error ? 0 : shipments.length ?? 0}
                limit={limit}
                loading={loading}
                handlePageChange={setDebouncedPage}
                handleLimitChange={(limit:number)=> setLimit(limit)}
            />
            
        </div>
    )    
}