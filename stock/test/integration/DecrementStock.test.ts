import { DecrementStock } from "src/application/usecases/DecrementStock";
import { StockRepository } from "src/domain/repository/StockRepository";
import { InMemoryStockRepository } from "src/infra/repository/inMemory/InMemoryStockRepository";

describe("DecrementStock", () => {
    let decrementStock: DecrementStock;
    let stockRepository: StockRepository;

    beforeEach(() => {
        stockRepository = new InMemoryStockRepository();
        decrementStock = new DecrementStock(stockRepository);
    });

    test("Shold be able decrement stock", async () => {
        const input = {
            items: [
                {
                    idItem: "1",
                    quantity: 5,
                },
            ],
        };

        await decrementStock.execute(input);
        const stockEntries = await stockRepository.getStockEntriesByIdItem("1");
        expect(stockEntries[0].idItem).toBe("1");
        expect(stockEntries[0].quantity).toBe(5);
    });
});
