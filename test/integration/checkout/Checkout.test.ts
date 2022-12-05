import { Item } from "src/catalog/domain/entity/Item";
import { ItemRepository } from "src/catalog/domain/repository/ItemRepository";
import { Checkout } from "src/checkout/application/usecases/Chekout";
import { Coupon } from "src/checkout/domain/entity/Coupon";
import { RepositoryFactory } from "src/checkout/domain/factory/RepositoryFactory";
import { CouponRepository } from "src/checkout/domain/repositoty/CouponRepository";
import { OrderRepository } from "src/checkout/domain/repositoty/OrderRepository";
import { InMemoryRepositoryFactory } from "src/checkout/infra/factory/InMemoryRepositoryFactory";

describe("Checkout", () => {
    let checkout: Checkout;
    let repositoryFactory: RepositoryFactory;
    let itemRepository: ItemRepository;
    let couponRepository: CouponRepository;
    let orderRepository: OrderRepository;

    beforeEach(() => {
        repositoryFactory = new InMemoryRepositoryFactory();
        itemRepository = repositoryFactory.createItemRepository();
        couponRepository = repositoryFactory.createCouponRepository();
        orderRepository = repositoryFactory.createOrderRepository();
        checkout = new Checkout(repositoryFactory);
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

    test("Must not place an order  with invalid item", async () => {
        itemRepository.saveItem(new Item("1", "Guitarra", 1000));
        const input = {
            cpf: "259.556.978-37",
            items: [
                {
                    idItem: "2",
                    quantity: 1,
                },
            ],
        };

        expect(async () => await checkout.execute(input)).rejects.toThrow(
            new Error("Item not found"),
        );
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

    test("Should not be applicable discount on expired coupon", async () => {
        couponRepository.saveCoupon(
            new Coupon("VALE10", 10, new Date("2022-12-01T23:59:59.999")),
        );
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
            now: new Date("2022-12-02T23:59:59.999"),
        };

        await checkout.execute(input);
        const orders = await orderRepository.getOrdersByCpf(input.cpf);
        expect(orders).toHaveLength(1);
        expect(orders[0].getTotal()).toBe(6100);
    });

    test("Must not place an order  with invalid coupon", async () => {
        itemRepository.saveItem(new Item("1", "Guitarra", 1000));
        const input = {
            cpf: "259.556.978-37",
            items: [
                {
                    idItem: "1",
                    quantity: 1,
                },
            ],
            coupon: "VALE10",
        };

        expect(async () => await checkout.execute(input)).rejects.toThrow(
            new Error("Coupon not found"),
        );
    });

    test("Should able create order with code", async () => {
        itemRepository.saveItem(new Item("1", "Guitarra", 1000));
        const input = {
            cpf: "259.556.978-37",
            items: [
                {
                    idItem: "1",
                    quantity: 1,
                },
            ],
            now: new Date("2022-12-01T00:00:00.000"),
        };

        await checkout.execute(input);
        const orders = await orderRepository.getOrdersByCpf(input.cpf);
        expect(orders[0].code).toBe("202200000001");
    });
});
