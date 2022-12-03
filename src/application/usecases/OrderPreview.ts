import { CouponRepository } from "src/domain/repositoty/CouponRepository";
import { Order } from "../../domain/entity/Order";
import { ItemRepository } from "../../domain/repositoty/ItemRepository";

export class OrderPreview {
    constructor(
        private readonly itemRepository: ItemRepository,
        private readonly couponRepository: CouponRepository,
    ) {}

    async execute(input: PreviewChecoutInput): Promise<PreviewChecoutOutput> {
        const order = new Order(input.cpf);

        for (const inputItem of input.items) {
            const item = await this.itemRepository.getItem(inputItem.idItem);
            order.addItem(item, inputItem.quantity);
        }

        if (input.coupon) {
            const coupon = await this.couponRepository.getCoupon(input.coupon);
            order.addCoupon(coupon);
        }

        const total = order.getTotal();
        return { total };
    }
}

type PreviewChecoutInput = {
    cpf: string;
    items: {
        idItem: string;
        quantity: number;
    }[];
    coupon?: string;
};

type PreviewChecoutOutput = {
    total: number;
};
