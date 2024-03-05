export type SvgPathFourCoords = [number, number, number, number, number, number, number, number]
type SvgPathPoint = [number, number]

const moveTowardsLength = (movingPoint: SvgPathPoint, targetPoint: SvgPathPoint, amount: number): SvgPathPoint => {
  const width = (targetPoint[0] - movingPoint[0]);
  const height = (targetPoint[1] - movingPoint[1]);

  const distance = Math.sqrt(width * width + height * height);

  return moveTowardsFractional(movingPoint, targetPoint, Math.min(1, amount / distance));
};

const moveTowardsFractional = (movingPoint: SvgPathPoint, targetPoint: SvgPathPoint, fraction: number): SvgPathPoint => {
  return [
    Math.floor((movingPoint[0] + (targetPoint[0] - movingPoint[0]) * fraction) * 100)/100,
    Math.floor((movingPoint[1] + (targetPoint[1] - movingPoint[1]) * fraction) * 100)/100,
  ];
};


export const roundSvgPathCorners = (dots: SvgPathFourCoords, radius: number) => {
  const exDots = [...dots, dots[0], dots[1], dots[2], dots[3]];
  const resultCommands = [];

  for (let i = 0; i < 8; i += 2) {
    const prevPoint: SvgPathPoint = [exDots[i], exDots[i + 1]];
    const curPoint: SvgPathPoint = [exDots[i + 2], exDots[i + 3]];
    const nextPoint: SvgPathPoint = [exDots[i + 4], exDots[i + 5]];

    const curveStart = moveTowardsLength(curPoint, prevPoint, radius);
    const curveEnd = moveTowardsLength(curPoint, nextPoint, radius);

    resultCommands.push(['L', curveStart[0], curveStart[1]]);

    const startControl = moveTowardsFractional(curveStart, curPoint, .5);
    const endControl = moveTowardsFractional(curPoint, curveEnd, .5);

    resultCommands.push(["C", ...startControl, ...endControl, ...curveEnd]);
  }

  resultCommands.unshift(['M', resultCommands[7][5], resultCommands[7][6]]);

  return resultCommands.reduce((str, c) => str + c.join(" ") + " ", "") + " Z";
};
