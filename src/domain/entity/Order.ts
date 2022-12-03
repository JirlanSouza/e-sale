import { Coupon } from "./Coupon";
import { Cpf } from "./Cpf";
import { Item } from "./Item";
import { OrderItem } from "./OrderItem";

export class Order {
    cpf: Cpf;
    orderItens: OrderItem[] = [];
    coupon?: Coupon;

    constructor(cpf: string) {
        this.cpf = new Cpf(cpf);
    }

    addItem(item: Item, quantity: number) {
        this.orderItens.push(new OrderItem(item.idItem, item.price, quantity));
    }

    addCoupon(coupon: Coupon) {
        this.coupon = coupon;
    }

    getTotal() {
        let total = this.orderItens.reduce(
            (total, orderItem) => total + orderItem.getTotal(),
            0,
        );

        if (this.coupon) {
            total -= this.coupon.calculateDiscount(total);
        }

        return total;
    }
}
