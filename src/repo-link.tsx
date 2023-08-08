import { useContext } from "react";

import { ViewportSizeContext } from "./viewport-size-context";

export default function RepoLink() {
  const { height, width } = useContext(ViewportSizeContext);

  let show_about = Math.abs(height - width) >= 150 || width >= 350;

  if (show_about) {
    return (
      <div className="github-link">
        <a href="https://github.com/sgwilym/seasonal-hours-clock">about</a>
      </div>
    );
  } else {
    return <></>;
  }
}
