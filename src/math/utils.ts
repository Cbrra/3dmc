import type { Vector3 } from "./vectors";

export const lerp3d = (start: Vector3, end: Vector3, t: number): Vector3 => {
    t = Math.max(0, Math.min(1, t));

    return [
        start[0] + t * (end[0] - start[0]),
        start[1] + t * (end[1] - start[1]),
        start[2] + t * (end[2] - start[2])
    ];
};

export const intervalsIntersect = (minA: number, maxA: number, minB: number, maxB: number): boolean => {
    return minA <= maxB && minB <= maxA;
};