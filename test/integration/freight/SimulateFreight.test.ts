import { Item } from "src/catalog/domain/entity/Item";
import { ItemRepository } from "src/catalog/domain/repository/ItemRepository";
import { Dimension } from "src/catalog/domain/valueObject/Dimension";

import { InMemoryItemRepository } from "src/catalog/infra/repository/memory/InMemoryItemRepository";
import { SimulateFreight } from "src/freight/application/usecase/SimulateFreight";
import { Zipcode } from "src/freight/domain/entity/Zipcode";
import { ZipcodeRepository } from "src/freight/domain/repository/ZipcodeRepository";
import { Coordinate } from "src/freight/domain/valueObject/Coordinate";
import { InMemoryZipcodeRepository } from "src/freight/infra/repository/memory/InMemoryZipcodeRepository";

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
