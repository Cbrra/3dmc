import type { Vector3 } from "../vectors";

const cubeVertexLength = 1;

export interface BoxBounds {
    min: Vector3;
    max: Vector3;
}

export const getCubeBounds = (center: Vector3): BoxBounds => {
    const halfVertexLength = cubeVertexLength / 2;

    const min: Vector3 = [
        center[0] - halfVertexLength,
        center[1] - halfVertexLength,
        center[2] - halfVertexLength
    ];

    const max: Vector3 = [
        center[0] + halfVertexLength,
        center[1] + halfVertexLength,
        center[2] + halfVertexLength
    ];

    return { min, max };
};

export const getTriangleBounds = (v0: Vector3, v1: Vector3, v2: Vector3) => {
    const min: Vector3 = [
        Math.min(v0[0], v1[0], v2[0]),
        Math.min(v0[1], v1[1], v2[1]),
        Math.min(v0[2], v1[2], v2[2])
    ];

    const max: Vector3 = [
        Math.max(v0[0], v1[0], v2[0]),
        Math.max(v0[1], v1[1], v2[1]),
        Math.max(v0[2], v1[2], v2[2])
    ];

    return { min, max };
};

export const getPointsInBounds = (bounds: BoxBounds): Vector3[] => {
    const points: Vector3[] = [];

    for(let x = Math.floor(bounds.min[0]); x <= Math.ceil(bounds.max[0]); x++) {
        for(let y = Math.floor(bounds.min[1]); y <= Math.ceil(bounds.max[1]); y++) {
            for(let z = Math.floor(bounds.min[2]); z <= Math.ceil(bounds.max[2]); z++) {
                points.push([x, y, z]);
            }
        }
    }

    return points;
};

export const isPointInCube = (point: Vector3, cubeBounds: BoxBounds): boolean => {
    return (
        point[0] >= cubeBounds.min[0] && point[0] <= cubeBounds.max[0] &&
        point[1] >= cubeBounds.min[1] && point[1] <= cubeBounds.max[1] &&
        point[2] >= cubeBounds.min[2] && point[2] <= cubeBounds.max[2]
    );
};