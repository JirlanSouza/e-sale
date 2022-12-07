import { StockEntry } from "src/domain/entity/StockEntry";
import { StockRepository } from "src/domain/repository/StockRepository";

export class DecrementStock {
    constructor(private readonly stockRepository: StockRepository) {}

    async execute(input: DecrementStockInput): Promise<void> {
        for (const item of input.items) {
            const stockEntry = new StockEntry(
                item.idItem,
                "out",
                item.quantity,
            );
            this.stockRepository.saveStockEntry(stockEntry);
        }
    }
}

type DecrementStockInput = {
    items: { idItem: string; quantity: number }[];
};
