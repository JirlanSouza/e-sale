import { StockEntry } from "../entity/StockEntry";

export class CalculateStock {
    static calculate(stockEntries: StockEntry[]) {
        let total = 0;

        for (const stockEntry of stockEntries) {
            if (stockEntry.type === "in") {
                total += stockEntry.quantity;
            } else {
                total -= +stockEntry.quantity;
            }
        }
        return total;
    }
}
