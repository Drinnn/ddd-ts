import Address from "./entity/address";
import Customer from "./entity/customer";
import Order from "./entity/order";
import OrderItem from "./entity/order-item";

let customer = new Customer("123", "Pedro Lontro");
const address = new Address("Rua dos Lalaus", 123, "16000-123", "Lalaulandia");
customer.address = address;
customer.activate();

const item1 = new OrderItem("1", "Item 1", 10);
const item2 = new OrderItem("2", "Item 2", 30);
const order = new Order("1", "123", [item1, item2]);
