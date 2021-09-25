import React, { useContext, useReducer } from "react";

interface IDataContext {
  menuItems: MenuItem[];
  user: User;
  order: Order;
}

const initialData: IDataContext = {
  menuItems: [],
  user: {} as User,
  order: {
    items: new Map()
  }
};

const dataContext = React.createContext(initialData);
const { Provider } = dataContext;

type DispatchAction = { type: keyof IDataContext; payload: IDataContext[keyof IDataContext] };

function reducer(state: typeof initialData, { type, payload }: DispatchAction) {
  return { ...state, [type]: payload };
}

export default function DataContext({ children }: React.PropsWithChildren<unknown>) {
  return (
    <Provider value={initialData}>
      {children}
    </Provider>
  );
}

function actions(data: IDataContext, dispatch: React.Dispatch<DispatchAction>) {
  return {
    async loadMenuItems() {
      if (data.menuItems.length === 0) {
        const payload = await fetch('http://localhost:3001/menu').then(res => res.json());
        dispatch({ type: "menuItems", payload });
      }
    },
    async reloadMenuItems() {
      const payload = await fetch('http://localhost:3001/menu').then(res => res.json());
      dispatch({ type: "menuItems", payload });
    },
    createMenuItemImage(item: MenuItem) {
      return `http://localhost:3001/images/${item.name}/thumb.jpg`;
    },
    addMenuItemToOrder(item: MenuItem) {
      const order = data.order;
      const items = order.items;

      if (items.has(item._id)) {
        const val = items.get(item._id)!;
        val.count += 1;
      } else {
        items.set(item._id, { item, count: 1 });
      }

      dispatch({
        type: "order", payload: {
          ...data.order,
          items
        }
      })
    },
    delMenuItemFromOrder(item: MenuItem) {
      const order = data.order;
      const items = order.items;

      if (items.has(item._id)) {
        const val = items.get(item._id)!;
        if (val.count > 1) {
          val.count -= 1;
        } else {
          items.delete(item._id);
        }
      }

      dispatch({
        type: "order", payload: {
          ...data.order,
          items
        }
      })
    }
  }
}

export function useDataContext(): [IDataContext, ReturnType<typeof actions>] {
  const context = useContext(dataContext);
  const [data, dispatch] = useReducer(reducer, context);
  return [data, actions(data, dispatch)];
}

export interface User {
  firstName: string;
  lastName: string;
  mail: string;
  phone?: string;
  address?: string;
}

export interface MenuItem {
  _id: any;
  name: string;
  category: string;
  price: number;
}

export type OrderItem = {
  item: MenuItem;
  count: number;
};

type OrderProgress =
  'Confirmed' |
  'Processing' |
  'Preparing' |
  'Delivering' |
  'Delivered'


export interface Order {
  items: Map<any, OrderItem>;
  date?: Date;
  progress?: OrderProgress;
}

export interface PromotionItem {
  item: MenuItem;
}
