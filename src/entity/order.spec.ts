import Order from "./order";
import OrderItem from "./order-item";

describe("Order unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      new Order("", "123", []);
    }).toThrowError("ID is required");
  });

  it("should throw error when customerId is empty", () => {
    expect(() => {
      new Order("123", "", []);
    }).toThrowError("CustomerID is required");
  });

  it("should throw error when no items were passed", () => {
    expect(() => {
      new Order("123", "1234", []);
    }).toThrowError("Items are required");
  });

  it("should calculate total", () => {
    const item1 = new OrderItem("1", "Item1", 12);

    const order1 = new Order("123", "1234", [item1]);

    expect(order1.total()).toBe(12);

    const item2 = new OrderItem("2", "Item2", 30);

    const order2 = new Order("123", "1234", [item1, item2]);

    expect(order2.total()).toBe(42);
  });
});
