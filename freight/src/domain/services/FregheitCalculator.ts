export class FreightCalculator {
    private static MIN_FREIGHT = 10;
    private static DEFAULT_DISTANCE = 1000;

    static calculate(
        volume: number,
        density: number,
        distance = FreightCalculator.DEFAULT_DISTANCE,
    ) {
        const freight = distance * volume * (density / 100);

        if (freight > 0 && freight < FreightCalculator.MIN_FREIGHT) {
            return FreightCalculator.MIN_FREIGHT;
        }

        return freight;
    }
}
