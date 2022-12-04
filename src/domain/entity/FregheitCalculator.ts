import { Item } from "./Item";

export class FreightCalculator {
    private static MIN_FREIGHT = 10;
    private static DEFAULT_DISTANCE = 1000;

    static calculate(
        item: Item,
        distance = FreightCalculator.DEFAULT_DISTANCE,
    ) {
        const freight = distance * item.getVolume() * (item.getDensity() / 100);

        if (freight > 0 && freight < FreightCalculator.MIN_FREIGHT) {
            return FreightCalculator.MIN_FREIGHT;
        }

        return freight;
    }
}
