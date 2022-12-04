import { Item } from "./Item";

export class FreightCalculator {
    static MIN_FREIGHT = 10;
    static DEFAULT_DISTANCE = 1000;

    static calculate(item: Item) {
        const freight =
            this.DEFAULT_DISTANCE *
            item.getVolume() *
            (item.getDensity() / 100);

        if (freight > 0 && freight < FreightCalculator.MIN_FREIGHT) {
            return FreightCalculator.MIN_FREIGHT;
        }

        return freight;
    }
}
