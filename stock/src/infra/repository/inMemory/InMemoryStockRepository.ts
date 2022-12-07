import { StockEntry } from "src/domain/entity/StockEntry";
import { StockRepository } from "src/domain/repository/StockRepository";

export class InMemoryStockRepository implements StockRepository {
    private stockEntries: StockEntry[];

    constructor() {
        this.stockEntries = [];
    }

    async saveStockEntry(stockEntry: StockEntry) {
        this.stockEntries.push(stockEntry);
    }

    async getStockEntriesByIdItem(idItem: string): Promise<StockEntry[]> {
        return this.stockEntries.filter(
            (stockEntry) => stockEntry.idItem === idItem,
        );
    }
}
