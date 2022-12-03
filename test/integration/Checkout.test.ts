import { Checkout } from "src/application/usecases/Chekout";
import { Coupon } from "src/domain/entity/Coupon";
import { Item } from "src/domain/entity/Item";
import { CouponRepository } from "src/domain/repositoty/CouponRepository";
import { ItemRepository } from "src/domain/repositoty/ItemRepository";
import { OrderRepository } from "src/domain/repositoty/OrderRepository";
import { InMemoryCouponRepository } from "src/infra/repository/inMemory/InMemoryCouponRepository";
import { InMemoryItemRepository } from "src/infra/repository/inMemory/InMemoryItemRepository";
import { InMemoryOrderRepository } from "src/infra/repository/inMemory/InMemoryOrderRepository";

describe("Checkout", () => {
    let checkout: Checkout;
    let itemRepository: ItemRepository;
    let couponRepository: CouponRepository;
    let orderRepository: OrderRepository;

    beforeEach(() => {
        itemRepository = new InMemoryItemRepository();
        couponRepository = new InMemoryCouponRepository();
        orderRepository = new InMemoryOrderRepository();
        checkout = new Checkout(
            itemRepository,
            couponRepository,
            orderRepository,
        );
    });

    test("Must place an order", async () => {
        itemRepository.saveItem(new Item("1", "Guitarra", 1000));
        itemRepository.saveItem(new Item("2", "Amplificador", 5000));
        itemRepository.saveItem(new Item("3", "Cabo", 100));

        const input = {
            cpf: "259.556.978-37",
            items: [
                {
                    idItem: "1",
                    quantity: 1,
                },
                {
                    idItem: "2",
                    quantity: 1,
                },
                {
                    idItem: "3",
                    quantity: 1,
                },
            ],
        };

        await checkout.execute(input);
        const orders = await orderRepository.getOrdersByCpf(input.cpf);
        expect(orders).toHaveLength(1);
        expect(orders[0].getTotal()).toBe(6100);
    });

    test("Must place an order  with discount", async () => {
        couponRepository.saveCoupon(new Coupon("VALE10", 10));
        itemRepository.saveItem(new Item("1", "Guitarra", 1000));
        itemRepository.saveItem(new Item("2", "Amplificador", 5000));
        itemRepository.saveItem(new Item("3", "Cabo", 100));

        const input = {
            cpf: "259.556.978-37",
            items: [
                {
                    idItem: "1",
                    quantity: 1,
                },
                {
                    idItem: "2",
                    quantity: 1,
                },
                {
                    idItem: "3",
                    quantity: 1,
                },
            ],
            coupon: "VALE10",
        };

        await checkout.execute(input);
        const orders = await orderRepository.getOrdersByCpf(input.cpf);
        expect(orders).toHaveLength(1);
        expect(orders[0].getTotal()).toBe(5490);
    });
});
