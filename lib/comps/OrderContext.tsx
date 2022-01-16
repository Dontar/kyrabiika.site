import { createContext, PropsWithChildren, ReactNode, useContext, useState } from "react";
import { MenuItem, Order, OrderItem, OrderProgress, User } from "../db/DbTypes";

function useOrderState() {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [progress, setProgress] = useState<OrderProgress>();
  const [user, setUser] = useState<User>({} as User);
  return {
    items, date, progress, user,
    setItems, setDate, setProgress, setUser,
    addItem(item: MenuItem, count: number) {
      const orderItem = items.find(i => i.item == item);
      if (orderItem) {
        orderItem.count += count;
        setItems([...items]);
      } else {
        setItems([...items, { item, count }]);
      }
    },
    delItem(item: OrderItem) {
      // if (item.count > 1) {
      //   item.count -= 1;
      //   setItems([...items]);
      // } else {
        const idx = items.findIndex(i => i.item.name == item.item.name);
        items.splice(idx, 1);
        setItems([...items]);
      // }
    },
    get orderPrice(): number {
      return this.items.reduce((a, i) => (a += i.count, a), 0);
    },
    get hasItems(): boolean {
      return this.items.length > 0;
    },
    get deliveryTax(): number {
      return 2.0;
    },
    get finalOrderPrice(): number {
      return this.orderPrice + this.deliveryTax;
    }
  };
}

export type OrderState = Order & ReturnType<typeof useOrderState>;

const Order = createContext<OrderState>({} as unknown as OrderState);

export function useOrderContext() {
  return useContext(Order);
}

export function OrderContext({ children }: PropsWithChildren<ReactNode>) {
  const order = useOrderState();
  return (<Order.Provider value={order}>{children}</Order.Provider>);
}
