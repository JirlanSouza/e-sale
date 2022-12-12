import { Injectable, Logger } from "@nestjs/common";
import { QueueAdapter } from "src/application/adapter/Queue";

@Injectable()
export class InMemoryQueueAdapter implements QueueAdapter {
    private consumers: Map<string, Function[]>;

    constructor() {
        this.consumers = new Map();
    }

    async publish(topic: string, payload: any): Promise<void> {
        Logger.log([topic, payload], InMemoryQueueAdapter.name);
        const consumers = this.consumers.get(topic) ?? [];
        for (const consume of consumers) {
            consume(payload);
        }
    }

    async consume(topic: string, callback: Function): Promise<void> {
        Logger.log(`New consume to topic: ${topic}`, InMemoryQueueAdapter.name);
        if (this.consumers.has(topic)) {
            this.consumers.set(topic, [...this.consumers.get(topic), callback]);
            return;
        }
        this.consumers.set(topic, [callback]);
    }
}
