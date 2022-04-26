import useSWR from "swr";
import rest from "./rest-client";
import { Order } from "../db/DbTypes";

type OrderString<Type> = {
  [Property in keyof Type]: string;
};


export default function useCurrentUserOrders() {
  const { data, error, mutate } = useSWR<Order[] | []>("/api/order", rest.get);

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
}
