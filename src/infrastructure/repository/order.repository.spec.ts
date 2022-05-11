import { Sequelize } from "sequelize-typescript";
import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order-item";
import Product from "../../domain/entity/product";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import OrderRepository from "./order.repository";
import ProductRepository from "./product.repository";

describe("Order Repository tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer");
    const address = new Address("Street 1", 123, "12345-678", "City");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product", 100);
    await productRepository.create(product);

    const orderRepository = new OrderRepository();
    const orderItem = new OrderItem(
      "oi1",
      product.name,
      product.price,
      product.id,
      2
    );
    const order = new Order("o1", customer.id, [orderItem]);
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });
    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customerId: customer.id,
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          orderId: order.id,
          productId: orderItem.productId,
        },
      ],
    });
  });

  it("should update an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer");
    const address = new Address("Street 1", 123, "12345-678", "City");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product", 100);
    await productRepository.create(product);

    const orderRepository = new OrderRepository();
    const orderItem = new OrderItem(
      "oi1",
      product.name,
      product.price,
      product.id,
      2
    );
    const order = new Order("o1", customer.id, [orderItem]);
    await orderRepository.create(order);

    const updatedOrderItem = new OrderItem(
      "oi2",
      product.name,
      product.price,
      product.id,
      5
    );
    const newProduct = new Product("p2", "Product 2", 200);
    await productRepository.create(newProduct);
    const newOrderItem = new OrderItem(
      "oi3",
      newProduct.name,
      newProduct.price,
      newProduct.id,
      1
    );
    order.setItems([updatedOrderItem, newOrderItem]);
    await orderRepository.update(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });
    expect(orderModel.toJSON()).toStrictEqual({
      id: order.id,
      customerId: customer.id,
      total: order.total(),
      items: [
        {
          id: updatedOrderItem.id,
          name: updatedOrderItem.name,
          price: updatedOrderItem.price,
          quantity: updatedOrderItem.quantity,
          orderId: order.id,
          productId: updatedOrderItem.productId,
        },
        {
          id: newOrderItem.id,
          name: newOrderItem.name,
          price: newOrderItem.price,
          quantity: newOrderItem.quantity,
          orderId: order.id,
          productId: newOrderItem.productId,
        },
      ],
    });
  });

  it("should get an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer");
    const address = new Address("Street 1", 123, "12345-678", "City");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product", 100);
    await productRepository.create(product);

    const orderRepository = new OrderRepository();
    const orderItem = new OrderItem(
      "oi1",
      product.name,
      product.price,
      product.id,
      2
    );
    const order = new Order("o1", customer.id, [orderItem]);
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });
    const foundOrder = await orderRepository.find(order.id);

    expect(orderModel.toJSON()).toStrictEqual({
      id: foundOrder.id,
      customerId: foundOrder.customerId,
      total: foundOrder.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          orderId: order.id,
          productId: orderItem.productId,
        },
      ],
    });
  });

  it("should get all order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("c1", "Customer");
    const address = new Address("Street 1", 123, "12345-678", "City");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("p1", "Product", 100);
    await productRepository.create(product);
    const product2 = new Product("p2", "Product2", 100);
    await productRepository.create(product2);

    const orderRepository = new OrderRepository();
    const orderItem = new OrderItem(
      "oi1",
      product.name,
      product.price,
      product.id,
      2
    );
    const orderItem2 = new OrderItem(
      "oi2",
      product.name,
      product.price,
      product.id,
      4
    );
    const orderItem3 = new OrderItem(
      "oi3",
      product.name,
      product.price,
      product.id,
      4
    );
    const order = new Order("o1", customer.id, [orderItem]);
    await orderRepository.create(order);

    const order2 = new Order("o2", customer.id, [orderItem2, orderItem3]);
    await orderRepository.create(order2);

    const foundOrders = await orderRepository.findAll();

    expect(foundOrders).toHaveLength(2);
    expect(foundOrders).toContainEqual(order);
    expect(foundOrders).toContainEqual(order2);
  });
});
