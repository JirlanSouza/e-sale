export interface QueueAdapter {
    publish(topic: string, payload: any): Promise<void>;
}

export const QueueAdapter = Symbol("QueueAdapter");
