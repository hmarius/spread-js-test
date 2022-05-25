import {createContext, useContext} from "react";
import XlsStore from "./xlsStore";

interface Store {
    activityStore: XlsStore;
}

export const store: Store = {
    activityStore: new XlsStore(),
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}