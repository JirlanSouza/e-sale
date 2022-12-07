import { StockEntry } from "src/domain/entity/StockEntry";
import { CalculateStock } from "src/domain/services/CalculateStock";

describe("CalculateStock", () => {
    test("Should be able calculate stock", () => {
        const stockEntries = [
            new StockEntry("1", "in", 10),
            new StockEntry("1", "in", 10),
            new StockEntry("1", "out", 5),
        ];

        const stock = CalculateStock.calculate(stockEntries);
        expect(stock).toBe(15);
    });
});
