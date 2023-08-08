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
  dominantBaseline?: string;
  fontSize?: number;
}
export let Dial = (props: DialProps) => {
  let {
    cx,
    cy,
    radMin,
    radMax,
    ticks,
    textScale,
    textAlign,
    dominantBaseline,
    fontSize
  } = props;
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

  // To curve the text, we need to compute some paths.
  const center_of_dial: [number, number] = [cx, cy - (radMin + radMax) / 2];
  // distance from the middle of the dial to the center of rotation
  const radius = radMin + (radMax - radMin) / 2;

  // We need to rotate this center to the left
  // to obtain the leftmost point of the dial
  const rotate_on_circle = (
    [x, y]: [number, number],
    angle_: number,
    [cx, cy]: [number, number]
  ) => {
    const angle = angle_ * (Math.PI / 180);
    const x_ = x - cx;
    const y_ = y - cy;

    const x_rotated = Math.cos(angle) * x_ - Math.sin(angle) * y_;
    const y_rotated = Math.cos(angle) * y_ - Math.sin(angle) * x_;

    return [x_rotated + cx, y_rotated + cy];
  };

  return (
    <>
      {ticks.map((tick) => {
        const [path_start_x, path_start_y] = rotate_on_circle(
          center_of_dial,
          -(tickAngleWidth * 0.5),
          [cx, cy]
        );
        const [path_end_x, path_end_y] = rotate_on_circle(
          center_of_dial,
          tickAngleWidth * 0.5,
          [cx, cy]
        );

        return (
          <React.Fragment key={"dial|" + radMin + "|" + tick.angle}>
            <Pie
              cx={cx}
              cy={cy}
              angle1={tick.angle}
              angle2={
                tick.angle +
                tickAngleWidth +
                0.4 /* background does not show between adjacent slices */
              }
              rMin={radMin}
              rMax={radMax}
              className={tick.className}
            />
            <Rotate cx={cx} cy={cy} angle={tick.angle + 180 + textRotExtra}>
              <defs>
                <path
                  id={`curve|${radMin}|${tick.angle}`}
                  d={`M${path_start_x},${path_start_y}
              A${radius},${radius},45,0,1,${path_end_x},${path_end_y}`}
                />
              </defs>
              <text
                className={tick.classNameText || "sFillInk"}
                fontSize={
                  fontSize
                    ? fontSize
                    : (radMax - radMin) * (textScale as number)
                }
              >
                <textPath
                  dominantBaseline={
                    dominantBaseline ? dominantBaseline : "mathematical"
                  }
                  textAnchor="middle"
                  startOffset={"50%"}
                  xlinkHref={`#curve|${radMin}|${tick.angle}`}
                >
                  {tick.text}
                </textPath>
              </text>
            </Rotate>
          </React.Fragment>
        );
      })}
    </>
  );
};
