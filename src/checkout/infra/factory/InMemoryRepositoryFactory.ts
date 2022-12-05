import { ItemRepository } from "src/catalog/domain/repository/ItemRepository";
import { RepositoryFactory } from "src/checkout/domain/factory/RepositoryFactory";
import { CouponRepository } from "src/checkout/domain/repositoty/CouponRepository";
import { OrderRepository } from "src/checkout/domain/repositoty/OrderRepository";
import { InMemoryItemRepository } from "../../../catalog/infra/repository/inMemory/InMemoryItemRepository";
import { InMemoryCouponRepository } from "../repository/inMemory/InMemoryCouponRepository";
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
