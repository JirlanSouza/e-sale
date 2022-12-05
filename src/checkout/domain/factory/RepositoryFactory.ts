import { ItemRepository } from "../../../catalog/domain/repository/ItemRepository";
import { CouponRepository } from "../repositoty/CouponRepository";
import { OrderRepository } from "../repositoty/OrderRepository";

export interface RepositoryFactory {
    createOrderRepository(): OrderRepository;
    createItemRepository(): ItemRepository;
    createCouponRepository(): CouponRepository;
}
