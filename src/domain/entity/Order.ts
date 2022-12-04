import { Coupon } from "./Coupon";
import { Cpf } from "./Cpf";
import { FreightCalculator } from "./FregheitCalculator";
import { Item } from "./Item";
import { OrderItem } from "./OrderItem";

export class Order {
    readonly cpf: Cpf;
    orderItens: OrderItem[] = [];
    coupon?: Coupon;
    freight = 0;

    constructor(cpf: string, readonly now?: Date) {
        this.cpf = new Cpf(cpf);
    }

    addItem(item: Item, quantity: number) {
        if (this.orderItens.some((thisItem) => thisItem.idItem === item.idItem))
            throw new Error("Duplicated item");
        this.orderItens.push(new OrderItem(item.idItem, item.price, quantity));
        this.freight += FreightCalculator.calculate(item) * quantity;
    }

    addCoupon(coupon: Coupon) {
        this.coupon = coupon;
    }

    getTotal() {
        let total = this.orderItens.reduce(
            (total, orderItem) => total + orderItem.getTotal(),
            this.freight,
        );

        if (this.coupon) {
            total -= this.coupon.calculateDiscount(total, this.now);
        }

        return total;
    }
}
