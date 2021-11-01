import { createContext, ReactNode, useContext, useState } from "react";
import { MenuItem, Order, OrderItem, OrderProgress, User } from "./DbTypes";

function useOrderState() {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [progress, setProgress] = useState<OrderProgress>();
  const [user, setUser] = useState<User>({} as User);
  return {
    items, date, progress, user,
    setItems, setDate, setProgress, setUser,
    addItem(item: MenuItem) {
      const orderItem = items.find(i => i.item == item);
      if (orderItem) {
        orderItem.count += 1;
        setItems([...items]);
      } else {
        setItems([...items, { item, count: 1 }]);
      }
    },
    delItem(item: OrderItem) {
      if (item.count > 1) {
        item.count -= 1;
        setItems([...items]);
      } else {
        const idx = items.findIndex(i => i == item);
        setItems([...items.splice(idx, 1)]);
      }
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

const Counter = createContext<OrderState>({} as unknown as OrderState);

export function useOrderContext() {
  return useContext(Counter);
}

export function OrderContext({ children }: { children: ReactNode }) {
  const order = useOrderState();
  return (<Counter.Provider value={order}>{children}</Counter.Provider>);
}
