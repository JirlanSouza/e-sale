import { DecrementStock } from "src/application/usecases/DecrementStock";
import { Queue } from "../Queue";

export class DecrementStockQueueController {
    constructor(
        private readonly queue: Queue,
        private readonly decrementeStock: DecrementStock,
    ) {
        queue.consume("checkoutPlaced", this.handle.bind(this));
    }

    async handle(msg: any) {
        try {
            await this.decrementeStock.execute({ items: msg.items });
            this.queue.ack(msg);
        } catch (err) {
            console.log(err);
        }
    }
}
