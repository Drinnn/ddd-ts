import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order-item";
import RepositoryInterface from "../../domain/repository/repository-interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements RepositoryInterface<Order> {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customerId: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    const sequelize = OrderModel.sequelize;

    await sequelize.transaction(async (t) => {
      await OrderItemModel.destroy({
        where: { orderId: entity.id },
        transaction: t,
      });

      const items = entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        productId: item.productId,
        quantity: item.quantity,
        orderId: entity.id,
      }));
      await OrderItemModel.bulkCreate(items, { transaction: t });

      await OrderModel.update(
        { total: entity.total() },
        { where: { id: entity.id }, transaction: t }
      );
    });
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({
      where: { id },
      include: ["items"],
    });

    const items = orderModel.items.map((item) => {
      return new OrderItem(
        item.id,
        item.name,
        item.price,
        item.productId,
        item.quantity
      );
    });
    const order = new Order(orderModel.id, orderModel.customerId, items);

    return order;
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: ["items"],
    });

    const orders: Order[] = [];

    orderModels.map((order) => {
      const items = order.items.map((item) => {
        return new OrderItem(
          item.id,
          item.name,
          item.price,
          item.productId,
          item.quantity
        );
      });

      orders.push(new Order(order.id, order.customerId, items));
    });

    return orders;
  }
}
