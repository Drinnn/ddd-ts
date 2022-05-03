import Order from "../entity/order";
import OrderItem from "../entity/order-item";
import OrderService from "./order.service";

describe("Order Service unit tests", () => {
  it("should get total of all orders", () => {
    const orderItem1 = new OrderItem("oi1", "Order Item 1", 100, "p1", 1);
    const orderItem2 = new OrderItem("oi2", "Order Item 2", 200, "p2", 3);
    const orderItem3 = new OrderItem("oi3", "Order Item 3", 300, "p3", 1);
    const orderItem4 = new OrderItem("oi4", "Order Item 4", 400, "p4", 2);

    const order1 = new Order("o1", "c1", [orderItem1, orderItem2]);
    const order2 = new Order("o2", "c2", [orderItem3, orderItem4]);

    const total = OrderService.totalForOrders([order1, order2]);

    expect(total).toBe(1800);
  });
});
