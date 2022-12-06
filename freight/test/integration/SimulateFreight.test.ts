import { SimulateFreight } from "src/application/usecases/CalculateFreight";
import { Zipcode } from "src/domain/entity/Zipcode";
import { ZipcodeRepository } from "src/domain/repository/ZipcodeRepository";
import { Coordinate } from "src/domain/valueObject/Coordinate";
import { InMemoryZipcodeRepository } from "src/infra/repository/inMemory/InMemoryZipcodeRepository";

describe("SimulateFreight", () => {
    let simulateFreight: SimulateFreight;
    let zipcodeRepository: ZipcodeRepository;

    beforeEach(() => {
        zipcodeRepository = new InMemoryZipcodeRepository();
        simulateFreight = new SimulateFreight(zipcodeRepository);

        zipcodeRepository.save(
            new Zipcode(
                "88015600",
                "Rua Almirante Lamego",
                "Centro",
                new Coordinate(-27.5945, -48.5477),
            ),
        );
        zipcodeRepository.save(
            new Zipcode(
                "22060030",
                "Rua Aires Saldanha",
                "Copacabana",
                new Coordinate(-22.9129, -43.2003),
            ),
        );
    });

    test("Should be able simulate freight", async () => {
        const input = {
            items: [{ volume: 0.03, density: 100, quantity: 1 }],
        };

        const simulateFreightResult = await simulateFreight.execute(input);
        expect(simulateFreightResult.freight).toBe(30);
    });

    test("Should be able simulate freight with distance", async () => {
        const input = {
            items: [{ volume: 0.03, density: 100, quantity: 1 }],
            from: "88015600",
            to: "22060030",
        };

        const simulateFreightResult = await simulateFreight.execute(input);
        expect(simulateFreightResult.freight).toBe(22.446653340244893);
    });

    test("Should not be able simulate freight with invalid from zipcode", async () => {
        const input = {
            items: [{ volume: 0.03, density: 100, quantity: 1 }],
            from: "0000000",
            to: "22060030",
        };

        expect(
            async () => await simulateFreight.execute(input),
        ).rejects.toThrow(new Error("Zipcode not found"));
    });

    test("Should not be able simulate freight with invalid to zipcode", async () => {
        const input = {
            items: [{ volume: 0.03, density: 100, quantity: 1 }],
            from: "88015600",
            to: "0000000",
        };

        expect(
            async () => await simulateFreight.execute(input),
        ).rejects.toThrow(new Error("Zipcode not found"));
    });
});
