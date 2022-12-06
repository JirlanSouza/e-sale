import { Item } from "src/domain/entity/Item";

export interface GetItemGatway {
    getItem(id: string): Promise<Item>;
}
