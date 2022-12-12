import { Injectable } from "@nestjs/common";
import { QueueAdapter } from "src/application/adapter/Queue";

@Injectable()
export class InMemoryQueueAdapter implements QueueAdapter {
    private consumers: Map<string, Function[]>;

    constructor() {
        this.consumers = new Map();
    }

    async publish(topic: string, payload: any): Promise<void> {
        const consumers = this.consumers.get(topic) ?? [];
        for (const consume of consumers) {
            consume(payload);
        }
    }

    async consume(topic: string, callback: Function): Promise<void> {
        if (this.consumers.has(topic)) {
            this.consumers.set(topic, [...this.consumers.get(topic), callback]);
            return;
        }
        this.consumers.set(topic, [callback]);
    }
}
