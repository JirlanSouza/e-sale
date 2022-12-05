import { DistanceCalculator } from "src/freight/domain/services/DistanceCalculator";
import { Coordinate } from "src/freight/domain/valueObject/Coordinate";

describe("DistanceCalculator", () => {
    test("Should be able calculate the distance between two cordinates", () => {
        const from = new Coordinate(-22.9129, -43.2003);
        const to = new Coordinate(-27.5945, -48.5477);
        const distance = DistanceCalculator.calculate(from, to);
        expect(distance).toBe(748.2217780081631);
    });

    test("Should be able calculate the distance with 0 value between equals cordinates", () => {
        const from = new Coordinate(-22.9129, -43.2003);
        const to = new Coordinate(-22.9129, -43.2003);
        const distance = DistanceCalculator.calculate(from, to);
        expect(distance).toBe(0);
    });
});
