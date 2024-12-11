import { ref, push, serverTimestamp } from 'firebase/database';
import { getDatabase } from 'firebase/database';
import { Order, OrderStatus } from '../types';

const db = getDatabase(); 

export class NotificationService {
  static async sendOrderStatusNotification(order: Order, newStatus: OrderStatus) {
    const notificationRef = ref(db, `notifications/${order.buyerId}`);
    return push(notificationRef, {
      orderId: order.id,
      status: newStatus,
      message: `Your order #${order.id} status has been updated to ${newStatus}`,
      timestamp: serverTimestamp()
    });
  }

  static async requestDeliveryConfirmation(order: Order) {
    const confirmationRef = ref(db, `confirmations/${order.id}`);
    return push(confirmationRef, {
      orderId: order.id,
      agentId: order.agent.id,
      status: 'PENDING',
      requestedAt: serverTimestamp()
    });
  }
}
