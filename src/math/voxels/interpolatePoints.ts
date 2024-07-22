import { lerp3d } from "../utils";
import type { Vector3 } from "../vectors";

export default (start: Vector3, end: Vector3, step = 0.05): Vector3[] => {
    const points: Vector3[] = [];

    const distance = Math.sqrt(
        Math.pow(end[0] - start[0], 2) +
        Math.pow(end[1] - start[1], 2) +
        Math.pow(end[2] - start[2], 2)
    );

    const stepCount = Math.ceil(distance / step);

    for(let i = 0; i <= stepCount; i++) {
        const t = i / stepCount;
        const point = lerp3d(start, end, t);

        points.push([
            Math.round(point[0]),
            Math.round(point[1]),
            Math.round(point[2])
        ]);
    }

    return points;
};