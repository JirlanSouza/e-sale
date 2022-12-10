import { DecrementStock } from "./application/usecases/DecrementStock";
import { DecrementStockQueueController } from "./infra/queue/controllers/DecrementStock";
import { RabbitmqQueue } from "./infra/queue/RabbitmqQueue";
import { InMemoryStockRepository } from "./infra/repository/inMemory/InMemoryStockRepository";

async function init() {
    const queue = await RabbitmqQueue.connect("amqp://localhost");

    const stockRepository = new InMemoryStockRepository();
    const decrementeStock = new DecrementStock(stockRepository);
    const decrementStockQueueController = new DecrementStockQueueController(
        queue,
        decrementeStock,
    );
}
init();
