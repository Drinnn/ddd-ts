import SendEmailWhenProductIsCreatedHandler from "../product/handler/send-email-when-product-is-created";
import EventDispatcher from "./event-dispatcher";

describe("Domain Events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreated", eventHandler);

    expect(eventDispatcher.getEventHandlers["ProductCreated"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreated"].length).toBe(1);
    expect(eventDispatcher.getEventHandlers["ProductCreated"][0]).toMatchObject(
      eventHandler
    );
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreated", eventHandler);

    eventDispatcher.unregister("ProductCreated", eventHandler);

    expect(eventDispatcher.getEventHandlers["ProductCreated"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreated"].length).toBe(0);
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreated", eventHandler);

    eventDispatcher.unregisterAll();

    expect(eventDispatcher.getEventHandlers).toMatchObject({});
  });
});
