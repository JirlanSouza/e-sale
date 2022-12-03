export class Coupon {
    constructor(readonly code: string, readonly percentage: number) {
        if (percentage < 0) throw new Error("Invalid coupon percentage");
    }

    calculateDiscount(total: number) {
        return (total * this.percentage) / 100;
    }
}
