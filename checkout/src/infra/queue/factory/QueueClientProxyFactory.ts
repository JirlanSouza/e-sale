import { ClientsModule, Transport } from "@nestjs/microservices";

export class QueueClientProxyFactory {
    static orderPlaceQueueClientProxy = Symbol("OrderPlaceQueueClientProxy");
    static placeOrderQueueClientProxy = Symbol("PlaceOrderQueueClientProxy");

    static create() {
        return ClientsModule.register([
            {
                transport: Transport.RMQ,
                name: QueueClientProxyFactory.placeOrderQueueClientProxy,
                options: {
                    urls: ["amqp://localhost"],
                    queue: "placeOrder",
                },
            },
            {
                transport: Transport.RMQ,
                name: QueueClientProxyFactory.orderPlaceQueueClientProxy,
                options: {
                    urls: ["amqp://localhost"],
                    queue: "orderPlaced",
                },
            },
        ]);
    }
}
