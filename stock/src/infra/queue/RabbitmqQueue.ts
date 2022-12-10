import { Channel, connect, Connection } from "amqplib";
import { Queue } from "./Queue";

export class RabbitmqQueue implements Queue {
    private constructor(
        private connection: Connection,
        private channel: Channel,
    ) {}

    static async connect(url: string) {
        const connection = await RabbitmqQueue.getConnection(url);
        const channel = await connection.createChannel();
        return new RabbitmqQueue(connection, channel);
    }

    async consume(queueName: string, callback: Function) {
        await this.channel.assertQueue(queueName, { durable: true });
        this.channel.consume(queueName, (msg) => callback(msg));
    }

    ack(msg: any): void {
        this.channel.ack(msg);
    }

    private static async getConnection(url: string): Promise<Connection> {
        let count = 0;
        const tryConnect = async (resolve: Function, reject: Function) => {
            try {
                const connection = await connect(url);
                resolve(connection);
            } catch (err) {
                const error = err as Error;
                console.info(error.name, error.message);
                count++;
                if (count > 5) {
                    console.log("Closing application");
                    reject(err);
                }
                console.log("Coonection error: reconnecting...");
                setTimeout(() => tryConnect(resolve, reject), 1500);
            }
        };

        return new Promise(tryConnect);
    }
}
