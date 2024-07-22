import type { Triangle } from "@/models/3d";
import type { Vector3 } from "@/math/vectors";
import interpolatePoints from "@/math/voxels/interpolatePoints";
import getTriangleInnerPoints from "@/math/voxels/getTriangleInnerPoints";

export default class Voxelizer {
    public readonly voxels: Set<string>;

    public constructor() {
        this.voxels = new Set();
    }

    public addVoxel(x: number, y: number, z: number): void {
        if(Number.isNaN(x + y + z)) return;

        const key = `${Math.floor(x)},${Math.floor(y)},${Math.floor(z)}`;
        if(!this.voxels.has(key)) {
            this.voxels.add(key);
        }
    }

    public voxelize(triangles: Triangle[], scale: number): void {
        for(let i = 0; i < triangles.length; i++) {
            this.voxelizeTriangle(triangles[i], scale);
        }
    }

    public voxelizeTriangle(triangle: Triangle, scale: number): void {
        if(triangle.vertices.length !== 3) {
            throw new Error("Invalid vertices length");
        }

        const intVertices: Vector3[] = [];

        // Vertices
        for(const vertex of triangle.vertices) {
            const x = Math.floor(vertex[0] * scale);
            const y = Math.floor(vertex[1] * scale);
            const z = Math.floor(vertex[2] * scale);
            this.addVoxel(x, y, z);
            intVertices.push([x, y, z]);
        }

        // Edges
        for(let i = 0; i < intVertices.length; i++) {
            const curr = intVertices[i];
            const next = intVertices[i + 1];
            if(!next) continue;

            const interpolated = interpolatePoints(curr, next);
            for(const p of interpolated) {
                this.addVoxel(p[0], p[1], p[2]);
            }
        }

        // Inner points
        const inPoints = getTriangleInnerPoints(intVertices[0], intVertices[1], intVertices[2]);
        for(const p of inPoints) {
            this.addVoxel(p[0], p[1], p[2]);
        }
    }
}