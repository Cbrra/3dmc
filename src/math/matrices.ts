import type { Vector3 } from "./vectors";

export type Matrix = number[][];

export class MatrixUtils {
    public static multiply(a: Matrix, b: Matrix): Matrix {
        const result: Matrix = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];

        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                result[i][j] = a[i][0] * b[0][j] +
                    a[i][1] * b[1][j] +
                    a[i][2] * b[2][j];
            }
        }

        return result;
    }

    public static rotateX(angle: number): Matrix {
        const c = Math.cos(angle);
        const s = Math.sin(angle);

        return [
            [1, 0, 0],
            [0, c, -s],
            [0, s, c]
        ];
    }

    public static rotateY(angle: number): Matrix {
        const c = Math.cos(angle);
        const s = Math.sin(angle);

        return [
            [c, 0, s],
            [0, 1, 0],
            [-s, 0, c]
        ];
    }

    public static rotateZ(angle: number): Matrix {
        const c = Math.cos(angle);
        const s = Math.sin(angle);

        return [
            [c, -s, 0],
            [s, c, 0],
            [0, 0, 1]
        ];
    }


    public static rotate(matrix: Matrix, vector: Vector3): Vector3 {
        const [x, y, z] = vector;
        const [m11, m12, m13] = matrix[0];
        const [m21, m22, m23] = matrix[1];
        const [m31, m32, m33] = matrix[2];

        const newX = m11 * x + m12 * y + m13 * z;
        const newY = m21 * x + m22 * y + m23 * z;
        const newZ = m31 * x + m32 * y + m33 * z;

        return [Math.round(newX), Math.round(newY), Math.round(newZ)];
    }

    public static applyStructureRotation(vectors: Vector3[], rotation: Vector3, origin: Vector3): void {
        const [rotX, rotY, rotZ] = rotation.map(angle => angle * (Math.PI / 180));
        const [originX, originY, originZ] = origin;

        const matrixX = MatrixUtils.rotateX(rotX);
        const matrixY = MatrixUtils.rotateY(rotY);
        const matrixZ = MatrixUtils.rotateZ(rotZ);

        const matrixXY = MatrixUtils.multiply(matrixX, matrixY);
        const matrixXYZ = MatrixUtils.multiply(matrixXY, matrixZ);

        // Translate vectors (relative to the origin)
        for(let i = 0; i < vectors.length; i++) {
            const translatedVector: Vector3 = [
                vectors[i][0] - originX,
                vectors[i][1] - originY,
                vectors[i][2] - originZ
            ];

            const rotatedVector = MatrixUtils.rotate(matrixXYZ, translatedVector);

            vectors[i] = [
                rotatedVector[0] + originX,
                rotatedVector[1] + originY,
                rotatedVector[2] + originZ
            ];
        }
    }
}