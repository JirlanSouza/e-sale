import { Order } from "src/domain/entity/Order";
import { CouponRepository } from "src/domain/repositoty/CouponRepository";
import { ItemRepository } from "src/domain/repositoty/ItemRepository";
import { OrderRepository } from "src/domain/repositoty/OrderRepository";
import { RepositoryFactory } from "src/domain/repositoty/RepositoryFactory";

export class Checkout {
    private readonly itemRepository: ItemRepository;
    private readonly couponRepository: CouponRepository;
    private readonly orderRepository: OrderRepository;

    constructor(repositoryFactory: RepositoryFactory) {
        this.itemRepository = repositoryFactory.createItemRepository();
        this.couponRepository = repositoryFactory.createCouponRepository();
        this.orderRepository = repositoryFactory.createOrderRepository();
    }

    async execute(input: CheckoutInput): Promise<void> {
        const nextSequence = (await this.orderRepository.count()) + 1;
        const order = new Order(input.cpf, nextSequence, input.now);

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
    now?: Date;
};
