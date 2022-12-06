import { ZipcodeRepository } from "src/domain/repository/ZipcodeRepository";
import { DistanceCalculator } from "src/domain/services/DistanceCalculator";
import { FreightCalculator } from "src/domain/services/FregheitCalculator";

export class SimulateFreight {
    constructor(private readonly zipcodeRepository: ZipcodeRepository) {}

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

        for (const item of input.items) {
            const itemFreight =
                FreightCalculator.calculate(
                    item.volume,
                    item.density,
                    distance,
                ) * item.quantity;
            freight += itemFreight;
        }

        return {
            freight,
        };
    }
}

type SimulateFreightInput = {
    items: {
        volume: number;
        density: number;
        quantity: number;
    }[];
    from?: string;
    to?: string;
};

type SimulateFreightOutput = {
    freight: number;
};
