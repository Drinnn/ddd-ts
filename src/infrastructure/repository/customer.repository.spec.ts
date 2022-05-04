import { Sequelize } from "sequelize-typescript";
import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import CustomerModel from "../db/sequelize/model/customer.model";
import CustomerRepository from "./customer.repository";

describe("Customer Repository tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([CustomerModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a customer", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer");
    const address = new Address("Street 1", 123, "12345-678", "City");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const customerModel = await CustomerModel.findOne({ where: { id: "1" } });

    expect(customerModel.toJSON()).toStrictEqual({
      id: "1",
      name: customer.name,
      street: customer.address.street,
      number: customer.address.number,
      zipcode: customer.address.zip,
      city: customer.address.city,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
    });
  });

  it("should update a customer", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer");
    const address = new Address("Street 1", 123, "12345-678", "City");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    customer.changeName("UpdatedCustomer");
    const newAddress = new Address(
      "Updated Street",
      321,
      "87654-321",
      "Updated City"
    );
    customer.changeAddress(newAddress);
    customer.activate();
    customer.increaseRewardPoints(20);
    await customerRepository.update(customer);

    const customerModel = await CustomerModel.findOne({ where: { id: "1" } });

    expect(customerModel.toJSON()).toStrictEqual({
      id: "1",
      name: customer.name,
      street: customer.address.street,
      number: customer.address.number,
      zipcode: customer.address.zip,
      city: customer.address.city,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
    });
  });

  it("should find a customer", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer");
    const address = new Address("Street 1", 123, "12345-678", "City");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const customerModel = await CustomerModel.findOne({ where: { id: "1" } });
    const foundCustomer = await customerRepository.find("1");

    expect(customerModel.toJSON()).toStrictEqual({
      id: "1",
      name: foundCustomer.name,
      street: foundCustomer.address.street,
      number: foundCustomer.address.number,
      zipcode: foundCustomer.address.zip,
      city: foundCustomer.address.city,
      active: foundCustomer.isActive(),
      rewardPoints: foundCustomer.rewardPoints,
    });
  });

  it("should find all customers", async () => {
    const customerRepository = new CustomerRepository();

    const customer1 = new Customer("1", "Customer 1");
    const address1 = new Address("Street 1", 123, "12345-678", "City");
    customer1.changeAddress(address1);
    customer1.activate();
    await customerRepository.create(customer1);

    const customer2 = new Customer("2", "Customer 2");
    const address2 = new Address(
      "Updated Street",
      321,
      "87654-321",
      "Updated City"
    );
    customer2.changeAddress(address2);
    customer2.increaseRewardPoints(10);
    await customerRepository.create(customer2);

    const foundCustomers = await customerRepository.findAll();

    expect(foundCustomers).toHaveLength(2);
    expect(foundCustomers).toContainEqual(customer1);
    expect(foundCustomers).toContainEqual(customer2);
  });
});
