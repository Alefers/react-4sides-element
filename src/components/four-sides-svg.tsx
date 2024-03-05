import { useMemo, useId } from 'react';
import type { FC } from 'react';
import { roundSvgPathCorners, SvgPathFourCoords } from '../utils';


export interface SvgGradient {
  x1: number,
  x2: number,
  y1: number,
  y2: number,
  offsetStart: number,
  offsetStop: number,
}

export interface FourSidesSvgProps {
  height: number,
  width: number,
  lineSize?: number,
  commands: SvgPathFourCoords;
  radius?: number;
  svgClassName?: string;
  pathClassName?: string;
  gradient?: SvgGradient;
  fill?: string;
  stroke?: string;
  gradientStart?: string;
  gradientStop?: string;
}

export const FourSidesSvg: FC<FourSidesSvgProps> = (
  {
    height,
    width,
    lineSize = 0,
    commands,
    radius = 10,
    svgClassName,
    pathClassName,
    gradient,
    fill,
    stroke,
    gradientStart,
    gradientStop,
  }
) => {
  const gradientId = useId();

  const path = useMemo(() =>
    roundSvgPathCorners(commands, radius)
  , [commands, radius])

  const svgObj = useMemo(() =>
    gradient
      ? {
        g: gradient,
        props: {fill: `url(#${gradientId})`},
      }
      : {
        g: null,
        props: {},
      }
  , [gradient]);

  return (
    <svg
      className={svgClassName}
      preserveAspectRatio="none"
      viewBox={`0 ${-1 * lineSize / 2} ${width} ${height + lineSize}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {svgObj.g ? (
        <linearGradient
          id={gradientId}
          x1={svgObj.g.x1}
          x2={svgObj.g.x2}
          y1={svgObj.g.y1}
          y2={svgObj.g.y2}
        >
          <stop
            className="start"
            offset={svgObj.g.offsetStart}
            stopColor={gradientStart}
          />
          <stop
            className="stop"
            offset={svgObj.g.offsetStop}
            stopColor={gradientStop}
          />
        </linearGradient>
      ) : null}
      <path
        d={path}
        className={pathClassName}
        fill={fill}
        stroke={stroke}
        {...svgObj.props}
      />
    </svg>
  );
};
