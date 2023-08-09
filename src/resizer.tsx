// Provides its descendents with the size of the viewport.
// Based off https://www.pluralsight.com/guides/re-render-react-component-on-window-resize

import React from "react";

import { ViewportSizeContext } from "./viewport-size-context";

export default function Resizer({ children }: { children: React.ReactNode }) {
  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth
  });

  React.useEffect(() => {
    const handleResize = () => {
       requestAnimationFrame(() => {
        setDimensions({
          height: window.innerHeight,
          width: window.innerWidth
        });
       });
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <ViewportSizeContext.Provider value={dimensions}>
        {children}
      </ViewportSizeContext.Provider>
    </>
  );
}
