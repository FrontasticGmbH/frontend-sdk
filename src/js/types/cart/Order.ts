import { Cart } from './Cart';

export interface Order extends Cart {
  orderId?: string;
  orderVersion?: string;
  orderState?: string;
  createdAt?: Date;
}
