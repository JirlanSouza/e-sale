import { Item } from "./Item";

export class OrderItem {
    constructor(
        readonly idItem: string,
        readonly price: number,
        readonly quantity: number,
    ) {}

    getTotal() {
        return this.price * this.quantity;
    }
}
