import Address from "./address";
import Customer from "./customer";

describe("Customer unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      new Customer("", "John");
    }).toThrowError("ID is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      new Customer("123", "");
    }).toThrowError("Name is required");
  });

  it("should throw error when trying to change for empty name", () => {
    const customer = new Customer("123", "John");

    expect(() => {
      customer.changeName("");
    }).toThrowError("Name is required");
  });

  it("should change name", () => {
    const customer = new Customer("123", "John");

    customer.changeName("Doe");

    expect(customer.name).toBe("Doe");
  });

  it("should throw error when trying to activate customer without address", () => {
    const customer = new Customer("123", "John");
    expect(() => {
      customer.activate();
    }).toThrow("Address is mandatory to activate a Customer");
  });

  it("should activate customer", () => {
    const customer = new Customer("123", "John");
    const address = new Address("Lalau St", 123, "5555-666", "Lalauland");
    customer.address = address;

    customer.activate();

    expect(customer.isActive()).toBe(true);
  });

  it("should deactivate customer", () => {
    const customer = new Customer("123", "John");
    const address = new Address("Lalau St", 123, "5555-666", "Lalauland");
    customer.address = address;

    customer.activate();
    customer.deactivate();

    expect(customer.isActive()).toBe(false);
  });

  it("should start with 0 reward points", () => {
    const customer = new Customer("123", "John");

    expect(customer.rewardPoints).toBe(0);
  });

  it("should add reward points", () => {
    const customer = new Customer("123", "John");

    customer.increaseRewardPoints(10);

    expect(customer.rewardPoints).toBe(10);
  });
});
