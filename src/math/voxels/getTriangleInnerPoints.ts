import type { Vector3 } from "../vectors";
import { getCubeBounds, getTriangleBounds, getPointsInBounds } from "./bounds";
import { intersectsCubeWithTriangle } from "./intersectsCubeWithTriangle";

export default (v0: Vector3, v1: Vector3, v2: Vector3): Vector3[] => {
    const points: Vector3[] = [];
    const triangle = { v0, v1, v2 };

    const triangleBounds = getTriangleBounds(v0, v1, v2);
    const boundsPoints = getPointsInBounds(triangleBounds);

    // Loop through the points and store the points intersecting with the triangle
    for(const p of boundsPoints) {
        const cubeBounds = getCubeBounds(p);

        if(intersectsCubeWithTriangle(cubeBounds, triangle)) {
            points.push(p);
        }
    }

    return points;
};