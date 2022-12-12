import { Module } from "@nestjs/common";
import { ClientProxy, ClientsModule, Transport } from "@nestjs/microservices";
import { QueueAdapter } from "src/application/adapter/Queue";
import { GetItemGatway } from "src/application/gatway/GetItemGatway";
import { Checkout } from "src/application/usecases/Chekout";
import { RepositoryFactory } from "src/domain/factory/RepositoryFactory";
import { InMemoryRepositoryFactory } from "../factory/InMemoryRepositoryFactory";
import { InMemorygetItemGatway } from "../gatway/InMemoryGetItemGatway";
import { InMemoryQueueAdapter } from "./adapter/InMemoryQueueAdapter";
import { RmqQueueAdapter } from "./adapter/RmqQueueAdapter";
import { CheckoutQueueController } from "./controller/checkoutQueue.controller";

@Module({
    imports: [
        ClientsModule.register([
            {
                transport: Transport.RMQ,
                name: QueueModule.queueClientProxy,
                options: {
                    urls: ["amqp://localhost"],
                    queue: "placeOrder",
                },
            },
        ]),
    ],
    controllers: [CheckoutQueueController],
    providers: [
        InMemoryQueueAdapter,
        {
            provide: QueueAdapter,
            inject: [QueueModule.queueClientProxy],
            useFactory: (clientproxy: ClientProxy) =>
                new RmqQueueAdapter(clientproxy),
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
            inject: [RepositoryFactory, GetItemGatway, QueueAdapter],
            useFactory: (
                repositoryFactory: RepositoryFactory,
                getItemGatway: GetItemGatway,
                queueAdapter: QueueAdapter,
            ) => {
                return new Checkout(
                    repositoryFactory,
                    getItemGatway,
                    queueAdapter,
                );
            },
        },
    ],
    exports: [QueueAdapter],
})
export class QueueModule {
    static queueClientProxy = Symbol("QueueClientProxy");
}
