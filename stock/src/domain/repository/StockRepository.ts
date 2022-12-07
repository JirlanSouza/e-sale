import { StockEntry } from "../entity/StockEntry";

export interface StockRepository {
    saveStockEntry(stockEntry: StockEntry): Promise<void>;
    getStockEntriesByIdItem(idItem: string): Promise<StockEntry[]>;
}
