import { FreightCalculator } from "src/domain/entity/FregheitCalculator";
import { ItemRepository } from "src/domain/repositoty/ItemRepository";

export class SimulateFreight {
    constructor(private readonly itemRepository: ItemRepository) {}

    async execute(input: SimulateFreightInput): Promise<SimulateFreightOutput> {
        const items = await this.itemRepository.getItemsById(
            input.items.map((item) => item.idItem),
        );

        const freight = items.reduce((freight, item) => {
            const itemFreight = FreightCalculator.calculate(item);
            return freight + itemFreight;
        }, 0);

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
};

type SimulateFreightOutput = {
    freight: number;
};
