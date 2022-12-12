import { Body, Controller, Inject, Post } from "@nestjs/common";
import { QueueAdapter } from "src/application/adapter/Queue";
import { PlaceOrderComand } from "src/application/comands/placeOrder";
import { PlaceOrderDto } from "../Dtos/placeOrder";

@Controller("/checkout")
export class CheckoutController {
    constructor(
        @Inject(QueueAdapter) private readonly queueAdpter: QueueAdapter,
    ) {}

    @Post()
    async placeOrder(@Body() placeOrderData: PlaceOrderDto) {
        const comand = new PlaceOrderComand(
            placeOrderData.cpf,
            placeOrderData.items,
            placeOrderData.coupon,
        );

        this.queueAdpter.publish(comand.name, comand);
    }
}
