import { Zipcode } from "src/domain/entity/Zipcode";
import { ZipcodeRepository } from "src/domain/repository/ZipcodeRepository";

export class InMemoryZipcodeRepository implements ZipcodeRepository {
    private zipcodes: Zipcode[];

    constructor() {
        this.zipcodes = [];
    }

    async save(zipcode: Zipcode) {
        this.zipcodes.push(zipcode);
    }

    async getByCode(code: string): Promise<Zipcode> {
        const zipcode = this.zipcodes.find((zipcode) => zipcode.code === code);
        if (!zipcode) throw new Error("Zipcode not found");
        return zipcode;
    }
}
