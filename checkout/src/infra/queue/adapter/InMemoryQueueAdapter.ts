import { QueueAdapter } from "src/application/adapter/Queue";

export class InMemoryQueueAdapter implements QueueAdapter {
    private queue: Map<string, Object[]>;

    constructor() {
        this.queue = new Map();
    }

    async publish(destination: string, payload: any): Promise<void> {
        if (!this.queue.has(destination)) {
            this.queue.set(destination, [payload]);
        }
        const destinationQueue = this.queue.get(destination) as Object[];
        this.queue.set(destination, [...destinationQueue, payload]);
    }
}
