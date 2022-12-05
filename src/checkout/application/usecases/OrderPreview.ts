import { CouponRepository } from "src/checkout/domain/repositoty/CouponRepository";
import { ZipcodeRepository } from "src/freight/domain/repository/ZipcodeRepository";
import { DistanceCalculator } from "src/freight/domain/services/DistanceCalculator";
import { FreightCalculator } from "src/freight/domain/services/FregheitCalculator";
import { ItemRepository } from "../../../catalog/domain/repository/ItemRepository";
import { Order } from "../../domain/entity/Order";

export class OrderPreview {
    constructor(
        private readonly itemRepository: ItemRepository,
        private readonly couponRepository: CouponRepository,
        private readonly zipcodeRepository: ZipcodeRepository,
    ) {}

    async execute(input: PreviewCheckoutInput): Promise<PreviewCheckoutOutput> {
        const order = new Order(input.cpf, 1, input.now);
        let distance: number | undefined;

        if (input.from && input.to) {
            const from = await this.zipcodeRepository.getByCode(input.from);
            const to = await this.zipcodeRepository.getByCode(input.to);
            distance = DistanceCalculator.calculate(
                from.cordinate,
                to.cordinate,
            );
        }

        for (const inputItem of input.items) {
            const item = await this.itemRepository.getItem(inputItem.idItem);
            order.addItem(item, inputItem.quantity);
            order.freight += FreightCalculator.calculate(item, distance);
        }

        if (input.coupon) {
            const coupon = await this.couponRepository.getCoupon(input.coupon);
            order.addCoupon(coupon);
        }

        const total = order.getTotal();
        return { total };
    }
}

type PreviewCheckoutInput = {
    cpf: string;
    items: {
        idItem: string;
        quantity: number;
    }[];
    coupon?: string;
    now?: Date;
    from?: string;
    to?: string;
};

type PreviewCheckoutOutput = {
    total: number;
};
