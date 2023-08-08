import * as React from "react";
import { interp } from "./util";

//================================================================================

// rectangle with center point
interface RecProps {
  cx: number;
  cy: number;
  rx: number;
  ry?: number;
  style?: React.CSSProperties;
  className?: string;
}
export let Rec = ({ cx, cy, rx, ry, style, className }: RecProps) => {
  if (ry === undefined) {
    ry = rx;
  }
  return (
    <rect
      x={cx - rx}
      y={cy - ry}
      width={rx * 2}
      height={ry * 2}
      style={style}
      className={className}
    />
  );
};

//================================================================================

// rotate around a given center point
// positive angle in degrees is clockwise
interface RotateProps {
  cx: number;
  cy: number;
  angle: number;
}
export let Rotate = (props: React.PropsWithChildren<RotateProps>) => {
  let { cx, cy, angle } = props;
  let transformString = [
    `translate(${cx} ${cy})`,
    `rotate(${angle})`,
    `translate(${-cx} ${-cy})`
  ].join(" ");
  return <g transform={transformString}>{props.children}</g>;
};

//================================================================================

let pointsToSvgPathString = (
  points: number[][],
  closed: "closed" | "open"
): string => {
  let result = [];
  let ii = 0;
  for (let [x, y] of points) {
    if (ii === 0) {
      result.push(`M ${x} ${y}`);
    } else {
      result.push(`L ${x} ${y}`);
    }
    ii += 1;
  }
  if (closed === "closed") {
    result.push("Z");
  }
  return result.join(" ");
};

interface PieProps {
  // a pie slice or annular ring, as a polygon.
  // inner radius is optional and defaults to 0
  // for a traditional pie slice shape.
  // angles are in degrees.
  // 0 is up, positive is clockwise.
  // if angle1 is 0 and angle2 is 360, this makes a hollow ring.
  cx: number;
  cy: number;
  angle1: number;
  angle2: number;
  rMin?: number; // inner rad
  rMax: number;
  style?: React.CSSProperties;
  className?: string;
}
export let Pie = ({
  cx,
  cy,
  angle1,
  angle2,
  rMin,
  rMax,
  style,
  className
}: PieProps) => {
  angle1 += 180;
  angle2 += 180;

  rMin = rMin === undefined ? 0 : rMin;
  let outerPoints: number[][] = [];
  let innerPoints: number[][] = [];

  if (angle2 - angle1 > 360) {
    angle1 += 360;
  }
  while (angle2 < angle1) {
    angle2 += 360;
  }

  let pointEveryNDegrees = 3;
  let n =
    Math.max(1, Math.ceil(Math.abs(angle1 - angle2) / pointEveryNDegrees)) + 1;
  for (let ii = 0; ii < n; ii++) {
    let tt = ii / (n - 1);
    let angle = interp(angle1, angle2, tt);
    let x = Math.sin((angle * Math.PI) / 180);
    let y = -Math.cos((angle * Math.PI) / 180);
    outerPoints.push([cx + x * rMax, cy + y * rMax]);
    innerPoints.push([cx + x * rMin, cy + y * rMin]);
  }
  let points: number[][];
  let pathString = "";
  if (angle1 === 0 && angle2 === 360) {
    // hollow ring
    innerPoints.reverse();
    pathString =
      pointsToSvgPathString(outerPoints, "closed") +
      pointsToSvgPathString(innerPoints, "closed");
  } else {
    if (rMin === 0) {
      // pointy pie slice
      points = outerPoints;
      points.push([cx, cy]);
    } else {
      // pie slice outer ring shape
      innerPoints.reverse();
      points = outerPoints.concat(innerPoints);
    }
    pathString = pointsToSvgPathString(points, "closed");
  }

  //let pointsString = points.map(([x, y]) => `${x}, ${y}`).join(' ');
  return <path className={className} style={style} d={pathString} />;
};
