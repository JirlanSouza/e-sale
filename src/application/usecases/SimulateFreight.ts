import { DistanceCalculator } from "src/domain/entity/DistanceCalculator";
import { FreightCalculator } from "src/domain/entity/FregheitCalculator";
import { ItemRepository } from "src/domain/repositoty/ItemRepository";
import { ZipcodeRepository } from "src/domain/repositoty/ZipcodeRepository";

export class SimulateFreight {
    constructor(
        private readonly itemRepository: ItemRepository,
        private readonly zipcodeRepository: ZipcodeRepository,
    ) {}

    async execute(input: SimulateFreightInput): Promise<SimulateFreightOutput> {
        let freight = 0;
        let distance: number | undefined;

        if (input.from && input.to) {
            const from = await this.zipcodeRepository.getByCode(input.from);
            const to = await this.zipcodeRepository.getByCode(input.to);
            distance = DistanceCalculator.calculate(
                from.cordinate,
                to.cordinate,
            );
        }

        const items = await this.itemRepository.getItemsById(
            input.items.map((item) => item.idItem),
        );

        for (const item of items) {
            const itemQuantity =
                input.items.find(
                    (inputItem) => inputItem.idItem === item.idItem,
                )?.quantity ?? 0;
            const itemFreight =
                FreightCalculator.calculate(item, distance) * itemQuantity;
            freight += itemFreight;
        }

        return {
            freight,
        };
    }
}

type SimulateFreightInput = {
    items: {
        idItem: string;
        quantity: number;
    }[];
    from?: string;
    to?: string;
};

type SimulateFreightOutput = {
    freight: number;
};
