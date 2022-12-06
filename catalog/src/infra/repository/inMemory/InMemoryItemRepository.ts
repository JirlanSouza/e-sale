import { Item } from "src/domain/entity/Item";
import { ItemRepository } from "src/domain/repository/ItemRepository";

export class InMemoryItemRepository implements ItemRepository {
    private items: Item[];

    constructor() {
        this.items = [];
    }

    async saveItem(item: Item) {
        this.items.push(item);
    }

    async getItem(id: string): Promise<Item> {
        const item = this.items.find((item) => item.idItem === id);

        if (!item) throw new Error("Item not found");
        return item;
    }

    async getItemsById(ids: string[]): Promise<Item[]> {
        return this.items.filter((item) => {
            return ids.some((id) => id === item.idItem);
        });
    }
}
