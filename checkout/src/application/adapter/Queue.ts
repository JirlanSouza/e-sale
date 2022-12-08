export interface QueueAdapter {
    publish(destination: string, payload: any): Promise<void>;
}
