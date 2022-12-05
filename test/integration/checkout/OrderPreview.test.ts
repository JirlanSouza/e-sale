import { Item } from "src/catalog/domain/entity/Item";
import { ItemRepository } from "src/catalog/domain/repository/ItemRepository";
import { Dimension } from "src/catalog/domain/valueObject/Dimension";
import { InMemoryItemRepository } from "src/catalog/infra/repository/memory/InMemoryItemRepository";
import { OrderPreview } from "src/checkout/application/usecases/OrderPreview";
import { Coupon } from "src/checkout/domain/entity/Coupon";
import { CouponRepository } from "src/checkout/domain/repositoty/CouponRepository";
import { InMemoryCouponRepository } from "src/checkout/infra/repository/inMemory/InMemoryCouponRepository";
import { Zipcode } from "src/freight/domain/entity/Zipcode";
import { ZipcodeRepository } from "src/freight/domain/repository/ZipcodeRepository";
import { Coordinate } from "src/freight/domain/valueObject/Coordinate";
import { InMemoryZipcodeRepository } from "src/freight/infra/repository/memory/InMemoryZipcodeRepository";

describe("OrderPreview", () => {
    let orderPreview: OrderPreview;
    let itemRepository: ItemRepository;
    let couponRepository: CouponRepository;
    let zipcodeRepository: ZipcodeRepository;

    beforeEach(() => {
        itemRepository = new InMemoryItemRepository();
        couponRepository = new InMemoryCouponRepository();
        zipcodeRepository = new InMemoryZipcodeRepository();
        orderPreview = new OrderPreview(
            itemRepository,
            couponRepository,
            zipcodeRepository,
        );

        zipcodeRepository.save(
            new Zipcode(
                "88015600",
                "Rua Almirante Lamego",
                "Centro",
                new Coordinate(-27.5945, -48.5477),
            ),
        );
        zipcodeRepository.save(
            new Zipcode(
                "22060030",
                "Rua Aires Saldanha",
                "Copacabana",
                new Coordinate(-22.9129, -43.2003),
            ),
        );
    });

    test("Should be able simulate order", async () => {
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

        const orederPreviewResult = await orderPreview.execute(input);
        expect(orederPreviewResult.total).toBe(6100);
    });

    test("Should not be able simulate order  with invalid item", async () => {
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

        expect(async () => await orderPreview.execute(input)).rejects.toThrow(
            new Error("Item not found"),
        );
    });

    test("Should be able simulate order with discount", async () => {
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

        const orederPreviewResult = await orderPreview.execute(input);
        expect(orederPreviewResult.total).toBe(5490);
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

        const orederPreviewResult = await orderPreview.execute(input);
        expect(orederPreviewResult.total).toBe(6100);
    });

    test("Should not be able simulate order  with invalid coupon", async () => {
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

        expect(async () => await orderPreview.execute(input)).rejects.toThrow(
            new Error("Coupon not found"),
        );
    });

    test("Should not be able simulate order  with distance", async () => {
        itemRepository.saveItem(
            new Item("1", "Guitarra", 1000, new Dimension(100, 30, 10, 3)),
        );
        const input = {
            cpf: "259.556.978-37",
            items: [
                {
                    idItem: "1",
                    quantity: 1,
                },
            ],
            from: "88015600",
            to: "22060030",
        };

        const orederPreviewResult = await orderPreview.execute(input);
        expect(orederPreviewResult.total).toBe(1022.4466533402449);
    });
});
