import { Coordinate } from "../valueObject/Coordinate";

export class DistanceCalculator {
    private static MILES_TO_KM_FACTOR = 1.609344;

    static calculate(from: Coordinate, to: Coordinate) {
        if (from.lat == to.lat && from.long == to.long) return 0;

        const radlat1 = (Math.PI * from.lat) / 180;
        const radlat2 = (Math.PI * to.lat) / 180;
        const theta = from.long - to.long;
        const radtheta = (Math.PI * theta) / 180;
        let distance =
            Math.sin(radlat1) * Math.sin(radlat2) +
            Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

        if (distance > 1) distance = 1;
        distance = Math.acos(distance);
        distance = (distance * 180) / Math.PI;
        distance = distance * 60 * 1.1515;
        distance = distance * DistanceCalculator.MILES_TO_KM_FACTOR;
        return distance;
    }
}
