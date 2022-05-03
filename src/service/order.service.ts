import Order from "../entity/order";

export default class OrderService {
  static totalForOrders(orders: Order[]): number {
    return orders.reduce((acc, item) => acc + item.total(), 0);
  }
}
