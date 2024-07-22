import type { Vector3 } from "@/math/vectors";

export interface Triangle {
    normal: Vector3;
    vertices: Vector3[];
}