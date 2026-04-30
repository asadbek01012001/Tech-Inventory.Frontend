import { createContext, useContext } from "react";

export const ObjectFormModeContext = createContext(false);

export function useObjectFormMode() {
  return useContext(ObjectFormModeContext);
}
