export interface Queue {
    consume(queueName: string, callback: Function): void;
    ack(msg: any): void;
}
