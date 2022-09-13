import { Money } from '../product/Money';
import { ShippingMethod } from './ShippingMethod';

export type FlattenedShippingMethod = ShippingMethod & {
  price: Money;
};
