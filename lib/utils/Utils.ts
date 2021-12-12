import { Types } from "mongoose";
import { useEffect, useState } from "react";

export function classes(obj: Record<string, boolean>): string {
  return Object.entries(obj).reduce((a, [cls, val]) => {
    if (val) {
      a.push(cls);
    }
    return a;
  }, [] as string[]).join(" ");
}

export const formatter = new Intl.NumberFormat("bg-BG", { style: "currency", currency: "BGN" });

export function convert(i: any) {
  if (i instanceof Types.ObjectId) {
    return i.toString();
  }
  Object.keys(i).forEach(prop => {
    const val = i[prop];
    if (val instanceof Types.ObjectId) {
      i[prop] = val.toString();
    } else if (Array.isArray(val)) {
      i[prop] = i[prop].map(convert);
    }
  });
  return i;
}

export function useFetch<T, E = any>(fetcher: () => Promise<T | E>) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<E>();

  useEffect(() => {
    if (data === undefined) {
      fetcher().then(r => setData(r as T)).catch(e => setError(e));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { data, error, mutate: setData };
}

export function useBoolean(): [boolean, () => void] {
  const [flag, setFlag] = useState(false);
  return [flag, () => setFlag(!flag)];
}
