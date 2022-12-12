import { Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { QueueAdapter } from "src/application/adapter/Queue";

export class RmqQueueAdapter implements QueueAdapter {
    constructor(private readonly clientProxy: ClientProxy) {}

    async publish(topic: string, payload: any): Promise<void> {
        this.clientProxy.emit(topic, payload);
        Logger.log(
            `Publesh the new event in topic: ${topic}`,
            RmqQueueAdapter.name,
        );
    }
}
