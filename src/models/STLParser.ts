import type { Vector3 } from "@/math/vectors";
import type { Triangle } from "./3d";

export class STLParser {
    public static parseBinary(data: Buffer): Triangle[] {
        const triangles: Triangle[] = [];
        const triangleCount = data.readUInt32LE(80);
        let offset = 84;

        for(let i = 0; i < triangleCount; i++) {
            const normal: Vector3 = [
                data.readFloatLE(offset),
                data.readFloatLE(offset + 4),
                data.readFloatLE(offset + 8),
            ];
            offset += 12;

            const vertices: Vector3[] = [];
            for(let j = 0; j < 3; j++) {
                vertices.push([
                    data.readFloatLE(offset),
                    data.readFloatLE(offset + 4),
                    data.readFloatLE(offset + 8),
                ]);
                offset += 12;
            }

            triangles.push({ normal, vertices });
            offset += 2; // Skip attribute byte count
        }

        return triangles;
    }
}