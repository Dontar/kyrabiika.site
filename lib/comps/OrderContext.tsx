import { createContext, PropsWithChildren, ReactNode, useContext, useEffect, useState } from "react";
import Router from "next/router";
import useSWR from "swr";

import { LoggedInUser, MenuItem, Order, OrderItem, OrderProgress, User } from "../db/DbTypes";
import rest from "../utils/rest-client";

function useOrderState() {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [progress, setProgress] = useState<OrderProgress>();
  const { data: user, mutate: setUser } = useSWR<LoggedInUser>("/api/user", rest.get);
  return {
    items, progress, user,
    setItems, setProgress, setUser,
    addItem(item: MenuItem, count: number) {
      const orderItem = items.find(i => i.item == item);
      if (orderItem) {
        orderItem.count += count;
        setItems([...items]);
      } else {
        setItems([...items, { item, count }]);
      }
    },
    changeItemCount(item: OrderItem, count: number) {
      const orderItem = items.find(i => i.item == item.item);
      if (orderItem) {
        orderItem.count = count;
        setItems([...items]);
      }
    },

    delItem(item: OrderItem) {
      const idx = items.findIndex(i => i.item.name == item.item.name);
      items.splice(idx, 1);
      setItems([...items]);
    },
    clearOrder() {
      setItems([]);
    },
    setUserAddress(address: string, address_pos: google.maps.LatLngLiteral) {
      setUser(rest.post("/api/user", { address, address_pos }).then(({ data }) => data));
    },
    setUserPhone(phone: string) {
      setUser(rest.post("/api/user", { phone }).then(({ data }) => data));
    },
    clear() {
      setItems([]);
      setProgress(undefined);
      setUser({} as LoggedInUser);
    },
    get userName() {
      if (user && user?.firstName) {
        return `${user.firstName} ${user.lastName || ""}`;
      }
      return "Guest";
    },
    get orderPrice(): number {
      return this.items.reduce((a, i) => (a += i.count), 0);
    },
    get hasItems(): boolean {
      return this.items.length > 0;
    },
    get deliveryTax(): number {
      return this.orderPrice < 20 ? 2.0 : 0;
    },
    get finalOrderPrice(): number {
      return this.orderPrice + this.deliveryTax;
    },
    // get order(): Order {
    //   return { items, progress, user: user! as User, date: new Date() };
    // }
  };
}

export type OrderState = ReturnType<typeof useOrderState>;

const Order = createContext<OrderState>({} as unknown as OrderState);

export function useOrderContext({
  redirectTo = "",
  redirectIfFound = false,
} = {}) {
  const context = useContext(Order);
  // useEffect(() => {
  //   const user = context.user;
  //   // if no redirect needed, just return (example: already on /dashboard)
  //   // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
  //   if (!redirectTo || !user) return;

  //   if (
  //     // If redirectTo is set, redirect if the user was not found.
  //     (redirectTo && !redirectIfFound && !user?.isLoggedIn) ||
  //     // If redirectIfFound is also set, redirect if the user was found
  //     (redirectIfFound && user?.isLoggedIn)
  //   ) {
  //     if (redirectTo === "back") {
  //       Router.back();
  //     } else {
  //       Router.push(redirectTo);
  //     }
  //   }
  // }, [context.user, redirectIfFound, redirectTo]);

  return context;
}

export function OrderContext({ children }: PropsWithChildren<ReactNode>) {
  const order = useOrderState();
  return (<Order.Provider value={order}>{children}</Order.Provider>);
}
