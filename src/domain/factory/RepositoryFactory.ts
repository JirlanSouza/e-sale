import { CouponRepository } from "../repositoty/CouponRepository";
import { ItemRepository } from "../repositoty/ItemRepository";
import { OrderRepository } from "../repositoty/OrderRepository";

export interface RepositoryFactory {
    createOrderRepository(): OrderRepository;
    createItemRepository(): ItemRepository;
    createCouponRepository(): CouponRepository;
}
