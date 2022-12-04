import { SimulateFreight } from "src/application/usecases/SimulateFreight";
import { Coordinate } from "src/domain/entity/Coordinate";
import { Dimension } from "src/domain/entity/Dimension";
import { Item } from "src/domain/entity/Item";
import { Zipcode } from "src/domain/entity/Zipcode";
import { ItemRepository } from "src/domain/repositoty/ItemRepository";
import { ZipcodeRepository } from "src/domain/repositoty/ZipcodeRepository";
import { InMemoryItemRepository } from "src/infra/repository/inMemory/InMemoryItemRepository";
import { InMemoryZipcodeRepository } from "src/infra/repository/inMemory/InMemoryZipcodeRepository";

describe("SimulateFreight", () => {
    let simulateFreight: SimulateFreight;
    let itemRepository: ItemRepository;
    let zipcodeRepository: ZipcodeRepository;

    beforeEach(() => {
        itemRepository = new InMemoryItemRepository();
        zipcodeRepository = new InMemoryZipcodeRepository();
        simulateFreight = new SimulateFreight(
            itemRepository,
            zipcodeRepository,
        );

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
        itemRepository.saveItem(
            new Item("1", "Guitarra", 1000, new Dimension(100, 30, 10, 3)),
        );
        const input = {
            items: [{ idItem: "1", quantity: 1 }],
        };

        const simulateFreightResult = await simulateFreight.execute(input);
        expect(simulateFreightResult.freight).toBe(30);
    });

    test("Should be able simulate freight with 0 value when item not exist", async () => {
        const input = {
            items: [{ idItem: "1", quantity: 1 }],
        };

        const simulateFreightResult = await simulateFreight.execute(input);
        expect(simulateFreightResult.freight).toBe(0);
    });

    test("Should be able simulate freight with distance", async () => {
        itemRepository.saveItem(
            new Item("1", "Guitarra", 1000, new Dimension(100, 30, 10, 3)),
        );
        const input = {
            items: [{ idItem: "1", quantity: 1 }],
            from: "88015600",
            to: "22060030",
        };

        const simulateFreightResult = await simulateFreight.execute(input);
        expect(simulateFreightResult.freight).toBe(22.446653340244893);
    });

    test("Should not be able simulate freight with invalid from zipcode", async () => {
        itemRepository.saveItem(
            new Item("1", "Guitarra", 1000, new Dimension(100, 30, 10, 3)),
        );
        const input = {
            items: [{ idItem: "1", quantity: 1 }],
            from: "0000000",
            to: "22060030",
        };

        expect(
            async () => await simulateFreight.execute(input),
        ).rejects.toThrow(new Error("Zipcode not found"));
    });

    test("Should not be able simulate freight with invalid to zipcode", async () => {
        itemRepository.saveItem(
            new Item("1", "Guitarra", 1000, new Dimension(100, 30, 10, 3)),
        );
        const input = {
            items: [{ idItem: "1", quantity: 1 }],
            from: "88015600",
            to: "0000000",
        };

        expect(
            async () => await simulateFreight.execute(input),
        ).rejects.toThrow(new Error("Zipcode not found"));
    });
});
