import type { Vector3 } from "../vectors";
import { intervalsIntersect } from "../utils";
import { getTriangleBounds, isPointInCube, type BoxBounds } from "./bounds";
import edgeIntersectsTriangle from "./edgeIntersectsTriangle";

interface Vertices {
    v0: Vector3;
    v1: Vector3;
    v2: Vector3;
}

/**
 * Check if a cube intersects with a triangle
 */
export const intersectsCubeWithTriangle = (cubeBounds: BoxBounds, triangleVertices: Vertices): boolean => {
    const { v0, v1, v2 } = triangleVertices;
    const triangleBounds = getTriangleBounds(v0, v1, v2);

    if(!intervalsIntersect(cubeBounds.min[0], cubeBounds.max[0], triangleBounds.min[0], triangleBounds.max[0]) ||
        !intervalsIntersect(cubeBounds.min[1], cubeBounds.max[1], triangleBounds.min[1], triangleBounds.max[1]) ||
        !intervalsIntersect(cubeBounds.min[2], cubeBounds.max[2], triangleBounds.min[2], triangleBounds.max[2])) {
        return false;
    }

    const cubeEdges = [
        [{ x: cubeBounds.min[0], y: cubeBounds.min[1], z: cubeBounds.min[2] }, { x: cubeBounds.max[0], y: cubeBounds.min[1], z: cubeBounds.min[2] }],
        [{ x: cubeBounds.min[0], y: cubeBounds.max[1], z: cubeBounds.min[2] }, { x: cubeBounds.max[0], y: cubeBounds.max[1], z: cubeBounds.min[2] }],
        [{ x: cubeBounds.min[0], y: cubeBounds.min[1], z: cubeBounds.max[2] }, { x: cubeBounds.max[0], y: cubeBounds.min[1], z: cubeBounds.max[2] }],
        [{ x: cubeBounds.min[0], y: cubeBounds.max[1], z: cubeBounds.max[2] }, { x: cubeBounds.max[0], y: cubeBounds.max[1], z: cubeBounds.max[2] }],
        [{ x: cubeBounds.min[0], y: cubeBounds.min[1], z: cubeBounds.min[2] }, { x: cubeBounds.min[0], y: cubeBounds.max[1], z: cubeBounds.min[2] }],
        [{ x: cubeBounds.max[0], y: cubeBounds.min[1], z: cubeBounds.min[2] }, { x: cubeBounds.max[0], y: cubeBounds.max[1], z: cubeBounds.min[2] }],
        [{ x: cubeBounds.min[0], y: cubeBounds.min[1], z: cubeBounds.max[2] }, { x: cubeBounds.min[0], y: cubeBounds.max[1], z: cubeBounds.max[2] }],
        [{ x: cubeBounds.max[0], y: cubeBounds.min[1], z: cubeBounds.max[2] }, { x: cubeBounds.max[0], y: cubeBounds.max[1], z: cubeBounds.max[2] }],
        [{ x: cubeBounds.min[0], y: cubeBounds.min[1], z: cubeBounds.min[2] }, { x: cubeBounds.min[0], y: cubeBounds.min[1], z: cubeBounds.max[2] }],
        [{ x: cubeBounds.max[0], y: cubeBounds.min[1], z: cubeBounds.min[2] }, { x: cubeBounds.max[0], y: cubeBounds.min[1], z: cubeBounds.max[2] }],
        [{ x: cubeBounds.min[0], y: cubeBounds.max[1], z: cubeBounds.min[2] }, { x: cubeBounds.min[0], y: cubeBounds.max[1], z: cubeBounds.max[2] }],
        [{ x: cubeBounds.max[0], y: cubeBounds.max[1], z: cubeBounds.min[2] }, { x: cubeBounds.max[0], y: cubeBounds.max[1], z: cubeBounds.max[2] }]
    ];

    for(let i = 0; i < cubeEdges.length; i++) {
        const edge = cubeEdges[i];
        const edgeStart: Vector3 = [edge[0].x, edge[0].y, edge[0].z];
        const edgeEnd: Vector3 = [edge[1].x, edge[1].y, edge[1].z];

        if(edgeIntersectsTriangle(edgeStart, edgeEnd, v0, v1, v2)) {
            return true;
        }
    }

    if(isPointInCube(v0, cubeBounds) ||
        isPointInCube(v1, cubeBounds) ||
        isPointInCube(v2, cubeBounds)) {
        return true;
    }

    return false;
};