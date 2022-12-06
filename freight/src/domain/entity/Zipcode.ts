import { Coordinate } from "../valueObject/Coordinate";

export class Zipcode {
    constructor(
        readonly code: string,
        readonly street: string,
        readonly neighborhood: string,
        readonly cordinate: Coordinate,
    ) {}
}
