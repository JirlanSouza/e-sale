import { Channel, connect, Connection } from "amqplib";
import { Queue } from "./Queue";

export class RabbitmqQueue implements Queue {
    private constructor(
        private connection: Connection,
        private channel: Channel,
    ) {}

    static async connect(url: string) {
        const connection = await connect(url);
        const channel = await connection.createChannel();
        return new RabbitmqQueue(connection, channel);
    }

    async consume(queueName: string, callback: Function) {
        await this.channel.assertQueue(queueName, { durable: true });
        this.channel.consume(queueName, (msg) => callback(msg));
    }
}
