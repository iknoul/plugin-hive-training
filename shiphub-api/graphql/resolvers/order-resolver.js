import { checkLimit } from '../../libs/graphql-limit-validatoin.js';
import { getAllOrders, updateOrder } from '../../stores/order-store.js';
import { getSellerById, getSellerItems } from '../../stores/seller-store.js';

export const orderResolvers = {
    Query: {     
        orders: async (_, {page, limit, ...rest}) => {
            checkLimit(limit)
            return await getAllOrders({filters:rest, page, limit})
        },

        shippedOrders: async (_, {page, limit, ...rest}) => {
            checkLimit(limit)
            return await getAllOrders({filters:{...rest, status: 'Shipped'}, page, limit})
        },

        seller: async (_, { id }) => {
            const {rows} = await getSellerById(id);
            return rows[0] || null
        },
    },

    Seller: {
        shippedItems: async (seller, { limit = 5 }) => {
            checkLimit(limit);  

            return await getSellerItems({
                sellerId: seller.id,
                filters: { status: 'Shipped'},
                limit
            });
        },
    },

    Mutation: {
        updateOrderStatus: async (_, { id, status }) => {
            const updatedOrder = await updateOrder(id, { status });

            if (!updatedOrder) {
                throw new Error('Order not found');
            }

            return updatedOrder;
        }
    }

};


    

