import { Item } from "../entity/Item";

export interface ItemRepository {
    saveItem(item: Item): Promise<void>;
    getItem(id: string): Promise<Item>;
    getItemsById(ids: string[]): Promise<Item[]>;
}
