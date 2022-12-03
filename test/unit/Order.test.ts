import { Coupon } from "src/domain/entity/Coupon";
import { Item } from "src/domain/entity/Item";
import { Order } from "src/domain/entity/Order";

describe("Order", () => {
    test("Should be able create a order with valid cpf", () => {
        expect(() => new Order("111.111.111-00")).toThrow(
            new Error("Cpf inválido"),
        );
    });

    test("Should be able able create a order with 3 items", () => {
        const order = new Order("259.556.978-37");
        order.addItem(new Item("1", "Guitarra", 1000), 1);
        order.addItem(new Item("2", "Amplificador", 5000), 1);
        order.addItem(new Item("3", "Cabo", 100), 1);
        const total = order.getTotal();
        expect(total).toBe(6100);
    });

    test("Should be able create a order with 3 items and 1 discount coupon", () => {
        const order = new Order("259.556.978-37");
        order.addItem(new Item("1", "Guitarra", 1000), 1);
        order.addItem(new Item("2", "Amplificador", 5000), 1);
        order.addItem(new Item("3", "Cabo", 100), 1);
        order.addCoupon(new Coupon("VALE10", 10));
        const total = order.getTotal();
        expect(total).toBe(5490);
    });
});
