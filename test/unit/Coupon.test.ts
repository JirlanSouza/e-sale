import { Coupon } from "src/domain/entity/Coupon";

describe("Coupon", () => {
    test("Should be able create coupon", () => {
        const coupon = new Coupon("VALE10", 10);
        expect(coupon.calculateDiscount(100)).toBe(10);
    });

    test("Should not be able create coupon with negative percentage", () => {
        expect(() => new Coupon("VALE10", -10)).toThrow(
            new Error("Invalid coupon percentage"),
        );
    });
});
