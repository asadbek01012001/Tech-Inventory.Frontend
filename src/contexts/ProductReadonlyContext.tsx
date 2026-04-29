import { createContext, useContext } from "react";

export const ProductReadonlyContext = createContext(false);

export function useProductReadonly() {
  return useContext(ProductReadonlyContext);
}
