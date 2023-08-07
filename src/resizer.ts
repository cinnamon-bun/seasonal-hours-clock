// Provides its descendents with the size of the viewport.
// Based off https://www.pluralsight.com/guides/re-render-react-component-on-window-resize

import React from "react";

import { ViewportSizeContext } from "./viewport-size-context";

function debounce(fn, ms) {
  let timer;

  return (_) => {
    clearTimeout(timer);
    timer = setTimeout((_) => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}

export default function Resizer({ children }) {
  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth
  });

  React.useEffect(() => {
    const handleResizeDebounced = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      });
    }, 20);

    window.addEventListener("resize", handleResizeDebounced);

    return () => window.removeEventListener("resize", handleResizeDebounced);
  }, []);

  return (
    <>
      <ViewportSizeContext.Provider value={dimensions}>
        {children}
      </ViewportSizeContext.Provider>
    </>
  );
}
