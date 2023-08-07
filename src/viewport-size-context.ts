import { createContext } from "react";

export const ViewportSizeContext = createContext({
  height: window.innerHeight,
  width: window.innerWidth
});
