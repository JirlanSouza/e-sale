import { Order } from "src/domain/entity/Order";
import { CouponRepository } from "src/domain/repositoty/CouponRepository";
import { ItemRepository } from "src/domain/repositoty/ItemRepository";
import { OrderRepository } from "src/domain/repositoty/OrderRepository";

export class Checkout {
    constructor(
        private readonly itemRepository: ItemRepository,
        private readonly couponRepository: CouponRepository,
        private readonly orderRepository: OrderRepository,
    ) {}

    async execute(input: CheckoutInput): Promise<void> {
        const order = new Order(input.cpf);

        for (const inputItem of input.items) {
            const item = await this.itemRepository.getItem(inputItem.idItem);
            order.addItem(item, inputItem.quantity);
        }

        if (input.coupon) {
            const coupon = await this.couponRepository.getCoupon(input.coupon);
            order.addCoupon(coupon);
        }

        await this.orderRepository.saveOrder(order);
    }
}

type CheckoutInput = {
    cpf: string;
    items: {
        idItem: string;
        quantity: number;
    }[];
    coupon?: string;
};
