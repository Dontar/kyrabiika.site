import { createContext, PropsWithChildren, ReactNode, useContext, useEffect, useState } from "react";
import { MenuItem, SiteConfig } from "../../db/DbTypes";
import { useToggle, useFetch } from "../../utils/Utils";

function useSiteConfigState() {
  const [isModalOpen, toggleModal] = useToggle();
  const [isSaving, setSaving] = useState(false);
  const [isDirty, setDirty] = useState(false);
  const {
    data: config,
    error: configError,
    mutate: mutateConfig
  } = useFetch<SiteConfig>(
    () => fetch("/api/config").then(r => r.json())
  );
  const {
    data: items,
    mutate: mutateItems
  } = useFetch<(MenuItem & { selected: boolean })[]>(
    () => fetch("/api/menu").then(r => r.json())
  );

  const state = {
    isModalOpen,
    toggleModal,
    isSaving,
    setSaving,
    isDirty,
    setDirty,
    config,
    mutateConfig,
    // items,
    get items() {
      return items?.map(item => {
        if (item.selected === undefined) {
          const sel = config! && config.promo_items.findIndex(i => i._id === item._id) > -1;
          item.selected = sel;
        }
        return item;
      });
    },
    getSelectedItems() {
      return state.items?.filter(i => i.selected).map(i => ({ ...i, selected: undefined })) || [];
    },
    mutateItems
  };
  return state;
}

type SiteConfigState = ReturnType<typeof useSiteConfigState>;

const Context = createContext({} as unknown as SiteConfigState);

export function useSiteConfigContext() {
  return useContext(Context);
}

export function SiteConfigContext({ children }: PropsWithChildren<ReactNode>) {
  const state = useSiteConfigState();
  return (<Context.Provider value={state}>{children}</Context.Provider>);
}
