import { Item } from "./Item";

export class OrderItem {
    constructor(
        readonly idItem: Item,
        readonly price: number,
        readonly quantity: number,
    ) {}
}
