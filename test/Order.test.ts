import { Order } from "../src/Order";
import { OrderItem } from "../src/OrderItem";

describe("Order", () => {
    test("Não deve criar um pedido com um cpf inválido", () => {
        expect(() => new Order("111.111.111-00")).toThrow(
            new Error("Cpf inválido"),
        );
    });

    test("Deve criar um pedido com 3 itens", () => {
        const order = new Order("259.556.978-37");
        order.addItem(new OrderItem(1, "Guitarra", 1000));
        order.addItem(new OrderItem(1, "Amplificador", 5000));
        order.addItem(new OrderItem(1, "Cabo", 100));
    });
});
