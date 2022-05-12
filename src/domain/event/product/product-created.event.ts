import EventInterface from "../@shared/event.interface";

export default class ProductCreatedEvent implements EventInterface {
  dateTime: Date;
  data: any;

  constructor(data: any) {
    this.dateTime = new Date();
    this.data = data;
  }
}
