// Periodically provides its descendents with the current date.

import React from "react";

import { UpdateNowContext } from "./update-now-context";

export default function UpdateNow({ frequency /*milliseconds*/, children }) {
  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    let updateInterval = setInterval(() => {
      setNow(new Date());
    }, frequency);

    return () => clearInterval(updateInterval);
  }, [frequency]);

  return (
    <>
      <UpdateNowContext.Provider value={now}>
        {children}
      </UpdateNowContext.Provider>
    </>
  );
}
