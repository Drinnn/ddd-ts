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
    const item1 = new OrderItem("1", "Item1", 12, "P1", 2);

    const order1 = new Order("123", "1234", [item1]);

    expect(order1.total()).toBe(24);

    const item2 = new OrderItem("2", "Item2", 30, "P2", 2);

    const order2 = new Order("123", "1234", [item1, item2]);

    expect(order2.total()).toBe(84);
  });

  it("should throw error if the order item quantity is less than or equal 0", () => {
    const item = new OrderItem("1", "Item1", 12, "P1", 0);

    expect(() => {
      new Order("123", "1234", [item]);
    }).toThrowError("Item quantity should be greater than 0");

    const item2 = new OrderItem("2", "Item2", 12, "P1", -10);

    expect(() => {
      new Order("123", "1234", [item2]);
    }).toThrowError("Item quantity should be greater than 0");
  });
});
