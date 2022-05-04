import Product from "./product";

describe("Product unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => {
      new Product("", "Product 1", 100);
    }).toThrowError("ID is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => {
      new Product("123", "", 100);
    }).toThrowError("Name is required");
  });

  it("should throw error when price is less than or equal to 0", () => {
    expect(() => {
      new Product("123", "Product 1", -10);
    }).toThrowError("Price should be greater than 0");

    expect(() => {
      new Product("123", "Product 1", 0);
    }).toThrowError("Price should be greater than 0");
  });

  it("should change name", () => {
    const product = new Product("123", "Product 1", 10);
    product.changeName("Product2");

    expect(product.name).toBe("Product2");
  });

  it("should change price", () => {
    const product = new Product("123", "Product 1", 10);
    product.changePrice(20);

    expect(product.price).toBe(20);
  });
});
