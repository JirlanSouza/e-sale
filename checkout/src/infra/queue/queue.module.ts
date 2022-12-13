import { Module } from "@nestjs/common";
import { ClientProxy, ClientsModule, Transport } from "@nestjs/microservices";
import { OrderPlacedQueue } from "src/application/adapter/OrderPlacedQueue";
import { PlaceOrderQueue } from "src/application/adapter/PlaceOrderQueue";
import { GetItemGatway } from "src/application/gatway/GetItemGatway";
import { Checkout } from "src/application/usecases/Chekout";
import { RepositoryFactory } from "src/domain/factory/RepositoryFactory";
import { InMemoryRepositoryFactory } from "../factory/InMemoryRepositoryFactory";
import { InMemorygetItemGatway } from "../gatway/InMemoryGetItemGatway";
import { InMemoryOrderPlacedQueueAdapter } from "./adapter/InMemoryQueueAdapter";
import { OrderPlacedRmqQueueAdapter } from "./adapter/OrderPlacedRmqQueueAdapter";
import { PlaceOrderRmqQueueAdapter } from "./adapter/PlaceOrderRmqQueueAdapter";
import { CheckoutQueueController } from "./controller/checkoutQueue.controller";

@Module({
    imports: [
        ClientsModule.register([
            {
                transport: Transport.RMQ,
                name: QueueModule.placeOrderQueueClientProxy,
                options: {
                    urls: ["amqp://localhost"],
                    queue: "placeOrder",
                },
            },
        ]),
        ClientsModule.register([
            {
                transport: Transport.RMQ,
                name: QueueModule.orderPlaceQueueClientProxy,
                options: {
                    urls: ["amqp://localhost"],
                    queue: "orderPlaced",
                },
            },
        ]),
    ],
    controllers: [CheckoutQueueController],
    providers: [
        InMemoryOrderPlacedQueueAdapter,
        {
            provide: PlaceOrderQueue,
            inject: [QueueModule.placeOrderQueueClientProxy],
            useFactory: (clientproxy: ClientProxy) =>
                new PlaceOrderRmqQueueAdapter(clientproxy),
        },
        {
            provide: OrderPlacedQueue,
            inject: [QueueModule.orderPlaceQueueClientProxy],
            useFactory: (clientproxy: ClientProxy) =>
                new OrderPlacedRmqQueueAdapter(clientproxy),
        },
        {
            provide: RepositoryFactory,
            useClass: InMemoryRepositoryFactory,
        },
        {
            provide: GetItemGatway,
            useClass: InMemorygetItemGatway,
        },
        {
            provide: Checkout,
            inject: [RepositoryFactory, GetItemGatway, OrderPlacedQueue],
            useFactory: (
                repositoryFactory: RepositoryFactory,
                getItemGatway: GetItemGatway,
                orderPlacedQueue: OrderPlacedQueue,
            ) => {
                return new Checkout(
                    repositoryFactory,
                    getItemGatway,
                    orderPlacedQueue,
                );
            },
        },
    ],
    exports: [PlaceOrderQueue, OrderPlacedQueue],
})
export class QueueModule {
    static orderPlaceQueueClientProxy = Symbol("OrderPlaceQueueClientProxy");
    static placeOrderQueueClientProxy = Symbol("PlaceOrderQueueClientProxy");
}
