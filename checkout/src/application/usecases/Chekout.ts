import { Order } from "src/domain/entity/Order";
import { RepositoryFactory } from "src/domain/factory/RepositoryFactory";
import { CouponRepository } from "src/domain/repositoty/CouponRepository";
import { OrderRepository } from "src/domain/repositoty/OrderRepository";
import { GetItemGatway } from "../gatway/GetItemGatway";

export class Checkout {
    private readonly couponRepository: CouponRepository;
    private readonly orderRepository: OrderRepository;

    constructor(
        repositoryFactory: RepositoryFactory,
        private readonly getItemGatway: GetItemGatway,
    ) {
        this.couponRepository = repositoryFactory.createCouponRepository();
        this.orderRepository = repositoryFactory.createOrderRepository();
    }

    async execute(input: CheckoutInput): Promise<void> {
        const nextSequence = (await this.orderRepository.count()) + 1;
        const order = new Order(input.cpf, nextSequence, input.now);

        for (const inputItem of input.items) {
            const item = await this.getItemGatway.getItem(inputItem.idItem);
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
    now?: Date;
};
