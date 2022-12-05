import { Item } from "src/catalog/domain/entity/Item";
import { Dimension } from "src/catalog/domain/valueObject/Dimension";

import { FreightCalculator } from "src/freight/domain/services/FregheitCalculator";

describe("FreightCalculator", () => {
    test("Should be able calculate freight", () => {
        const item = new Item(
            "1",
            "Gitarra",
            1000,
            new Dimension(100, 30, 10, 3),
        );
        const freight = FreightCalculator.calculate(item);
        expect(freight).toBe(30);
    });

    test("Should be able to calculate the minimal freight", () => {
        const item = new Item(
            "1",
            "Gitarra",
            1000,
            new Dimension(1, 1, 1, 0.6),
        );
        const freight = FreightCalculator.calculate(item);
        expect(freight).toBe(10);
    });

    test("Should be able calculate freight with distance", () => {
        const item = new Item(
            "1",
            "Gitarra",
            1000,
            new Dimension(100, 30, 10, 3),
        );
        const distance = 748.2217780081631;
        const freight = FreightCalculator.calculate(item, distance);
        expect(freight).toBe(22.446653340244893);
    });
});
