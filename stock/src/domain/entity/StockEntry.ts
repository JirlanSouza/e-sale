export class StockEntry {
    constructor(
        readonly idItem: string,
        readonly type: "in" | "out",
        readonly quantity: number,
    ) {}
}
