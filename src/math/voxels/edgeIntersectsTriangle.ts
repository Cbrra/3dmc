import type { Vector3 } from "../vectors";

const EPSILON = 1e-9;

/**
 * Möller-Trumbore algorithm
 */
export default (edgeStart: Vector3, edgeEnd: Vector3, v0: Vector3, v1: Vector3, v2: Vector3): boolean => {
    const edge1 = { x: v1[0] - v0[0], y: v1[1] - v0[1], z: v1[2] - v0[2] };
    const edge2 = { x: v2[0] - v0[0], y: v2[1] - v0[1], z: v2[2] - v0[2] };

    const h = {
        x: edgeEnd[1] * edge2.z - edgeEnd[2] * edge2.y,
        y: edgeEnd[2] * edge2.x - edgeEnd[0] * edge2.z,
        z: edgeEnd[0] * edge2.y - edgeEnd[1] * edge2.x
    };

    const a = edge1.x * h.x + edge1.y * h.y + edge1.z * h.z;
    if(a > -EPSILON && a < EPSILON) return false;

    const f = 1 / a;
    const s = {
        x: edgeStart[0] - v0[0],
        y: edgeStart[1] - v0[1],
        z: edgeStart[2] - v0[2]
    };

    const u = f * (s.x * h.x + s.y * h.y + s.z * h.z);
    if(u < 0.0 || u > 1.0) return false;

    const q = {
        x: s.y * edge1.z - s.z * edge1.y,
        y: s.z * edge1.x - s.x * edge1.z,
        z: s.x * edge1.y - s.y * edge1.x
    };

    const v = f * (edgeEnd[0] * q.x + edgeEnd[1] * q.y + edgeEnd[2] * q.z);
    if(v < 0.0 || u + v > 1.0) return false;

    const t = f * (edge2.x * q.x + edge2.y * q.y + edge2.z * q.z);
    return t > EPSILON;
};