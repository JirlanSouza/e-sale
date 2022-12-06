import { FreightCalculator } from "src/domain/services/FregheitCalculator";

describe("FreightCalculator", () => {
    test("Should be able calculate freight", () => {
        const freight = FreightCalculator.calculate(0.03, 100);
        expect(freight).toBe(30);
    });

    test("Should be able to calculate the minimal freight", () => {
        const freight = FreightCalculator.calculate(0.03, 10);
        expect(freight).toBe(10);
    });

    test("Should be able calculate freight with distance", () => {
        const distance = 748.2217780081631;
        const freight = FreightCalculator.calculate(0.03, 100, distance);
        expect(freight).toBe(22.446653340244893);
    });
});
