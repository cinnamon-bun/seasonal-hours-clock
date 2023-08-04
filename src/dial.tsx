import * as React from "react";

import { Rotate, Pie } from "./svg-utils";

//================================================================================
// MAIN

export interface Tick {
  angle: number;
  text?: string;
  className?: string;
  classNameText?: string;
}
interface DialProps {
  cx: number;
  cy: number;
  radMin: number;
  radMax: number;
  ticks: Tick[];
  textScale?: number; // default 0.6
  textAlign: "left" | "center-line" | "center-range";
}
export let Dial = (props: DialProps) => {
  let { cx, cy, radMin, radMax, ticks, textScale, textAlign } = props;
  if (textScale === undefined) {
    textScale = 0.6;
  }

  let tickAngleWidth = 360 / ticks.length;
  let textRotExtra =
    textAlign === "left"
      ? 1.5
      : textAlign === "center-line"
      ? 0
      : textAlign === "center-range"
      ? tickAngleWidth / 2
      : 0;
  return (
    <>
      {/* clock face */}
      {/*<circle cx={cx} cy={cy} r={radMax} />*/}

      {ticks.map((tick) => (
        <React.Fragment key={"dial|" + radMin + "|" + tick.angle}>
          <Pie
            cx={cx}
            cy={cy}
            angle1={tick.angle}
            angle2={
              tick.angle +
              tickAngleWidth +
              0.4 /* so that the background does not show between adjacent slices */
            }
            rMin={radMin}
            rMax={radMax}
            className={tick.className}
          />
          <Rotate cx={cx} cy={cy} angle={tick.angle + textRotExtra}>
            <text
              x={cx}
              y={cy - (radMin + radMax) / 2}
              textAnchor={textAlign === "left" ? "left" : "middle"}
              dominantBaseline="mathematical"
              fontSize={(radMax - radMin) * (textScale as number)}
              className={tick.classNameText || "sFillInk"}
            >
              {tick.text}
            </text>
          </Rotate>
        </React.Fragment>
      ))}
    </>
  );
};
