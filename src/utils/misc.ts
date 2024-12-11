import { OrderStatus } from "../types";

export const getStatusColor = (status: OrderStatus) => {
    const colorMap = {
      [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
      [OrderStatus.IN_TRANSIT]: 'bg-blue-100 text-blue-800',
      [OrderStatus.REJECTED]: 'bg-red-100 text-red-800',
      [OrderStatus.CANCELLED]: 'bg-gray-100 text-gray-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };


  