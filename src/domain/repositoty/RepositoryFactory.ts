import { CouponRepository } from "./CouponRepository";
import { ItemRepository } from "./ItemRepository";
import { OrderRepository } from "./OrderRepository";

export interface RepositoryFactory {
    createOrderRepository(): OrderRepository;
    createItemRepository(): ItemRepository;
    createCouponRepository(): CouponRepository;
}
