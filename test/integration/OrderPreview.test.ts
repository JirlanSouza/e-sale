import { OrderPreview } from "src/application/usecases/OrderPreview";
import { Coupon } from "src/domain/entity/Coupon";
import { Item } from "src/domain/entity/Item";
import { CouponRepository } from "src/domain/repositoty/CouponRepository";
import { ItemRepository } from "src/domain/repositoty/ItemRepository";
import { InMemoryCouponRepository } from "src/infra/repository/inMemory/InMemoryCouponRepository";
import { InMemoryItemRepository } from "src/infra/repository/inMemory/InMemoryItemRepository";

describe("OrderPreview", () => {
    let orderPreview: OrderPreview;
    let itemRepository: ItemRepository;
    let couponRepository: CouponRepository;

    beforeAll(() => {
        itemRepository = new InMemoryItemRepository();
        couponRepository = new InMemoryCouponRepository();
        orderPreview = new OrderPreview(itemRepository, couponRepository);
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
});
