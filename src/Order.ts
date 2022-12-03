import { Cpf } from "./Cpf";
import { OrderItem } from "./OrderItem";

export class Order {
    cpf: Cpf;
    orderItens: OrderItem[] = [];
    constructor(cpf: string) {
        this.cpf = new Cpf(cpf);
    }

    addItem(item: OrderItem) {
        this.orderItens.push(item);
    }
}
