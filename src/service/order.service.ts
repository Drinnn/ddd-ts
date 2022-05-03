import { v4 as uuid } from "uuid";
import Customer from "../entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/order-item";

export default class OrderService {
  static totalForOrders(orders: Order[]): number {
    return orders.reduce((acc, item) => acc + item.total(), 0);
  }

  static placeOrder(customer: Customer, items: OrderItem[]): Order {
    const order = new Order(uuid(), customer.id, items);

    customer.increaseRewardPoints(order.total() / 2);

    return order;
  }
}
