import { Zipcode } from "../entity/Zipcode";

export interface ZipcodeRepository {
    save(zipcode: Zipcode): Promise<void>;
    getByCode(code: string): Promise<Zipcode>;
}
