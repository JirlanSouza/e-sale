import { SimulateFreight } from "src/application/usecases/SimulateFreight";
import { Dimension } from "src/domain/entity/Dimension";
import { Item } from "src/domain/entity/Item";
import { ItemRepository } from "src/domain/repositoty/ItemRepository";
import { InMemoryItemRepository } from "src/infra/repository/inMemory/InMemoryItemRepository";

describe("SimulateFreight", () => {
    let simulateFreight: SimulateFreight;
    let itemRepository: ItemRepository;

    beforeEach(() => {
        itemRepository = new InMemoryItemRepository();
        simulateFreight = new SimulateFreight(itemRepository);
    });

    test("Shoul be able simulate freight", async () => {
        itemRepository.saveItem(
            new Item("1", "Guitarra", 1000, new Dimension(100, 30, 10, 3)),
        );
        const input = {
            items: [{ idItem: "1", quantity: 1 }],
        };

        const simulateFreightResult = await simulateFreight.execute(input);
        expect(simulateFreightResult.freight).toBe(30);
    });

    test("Shoul be able simulate freight with 0 value when item not exist", async () => {
        const input = {
            items: [{ idItem: "1", quantity: 1 }],
        };

        const simulateFreightResult = await simulateFreight.execute(input);
        expect(simulateFreightResult.freight).toBe(0);
    });
});
