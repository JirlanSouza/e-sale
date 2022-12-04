import { CouponRepository } from "src/domain/repositoty/CouponRepository";
import { ItemRepository } from "src/domain/repositoty/ItemRepository";
import { OrderRepository } from "src/domain/repositoty/OrderRepository";
import { RepositoryFactory } from "src/domain/factory/RepositoryFactory";
import { InMemoryCouponRepository } from "../repository/inMemory/InMemoryCouponRepository";
import { InMemoryItemRepository } from "../repository/inMemory/InMemoryItemRepository";
import { InMemoryOrderRepository } from "../repository/inMemory/InMemoryOrderRepository";

export class InMemoryRepositoryFactory implements RepositoryFactory {
    private itemRepository?: ItemRepository;
    private couponRepository?: CouponRepository;
    private orderRepository?: OrderRepository;

    createOrderRepository(): OrderRepository {
        if (!this.orderRepository) {
            this.orderRepository = new InMemoryOrderRepository();
        }

        return this.orderRepository;
    }
    createItemRepository(): ItemRepository {
        if (!this.itemRepository) {
            this.itemRepository = new InMemoryItemRepository();
        }

        return this.itemRepository;
    }
    createCouponRepository(): CouponRepository {
        if (!this.couponRepository) {
            this.couponRepository = new InMemoryCouponRepository();
        }

        return this.couponRepository;
    }
}
