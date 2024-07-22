import { Worker } from "node:worker_threads";
import { cpus } from "node:os";
import { resolve } from "node:path";
import type { Triangle } from "@/models/3d";
import type { Vector3 } from "@/math/vectors";

export const computeTriangles = async(triangles: Triangle[], scale: number): Promise<Vector3[]> => {
    const threadCount = Math.max(1, cpus().length - 1);
    const chunkSize = Math.ceil(triangles.length / threadCount);

    const workers: Worker[] = [];
    const tasks: Promise<Set<string>>[] = [];

    console.log(`Starting multi-threading with:`);
    console.log(`- ${threadCount} threads`);
    console.log(`- ${chunkSize} triangles for each thread`);
    console.log(`- ${triangles.length} total triangles`);

    for(let i = 0; i < threadCount; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, triangles.length);
        const chunk = triangles.slice(start, end);

        const worker = new Worker(resolve(__dirname, "voxelizer", "worker.js"), {
            workerData: { triangles: chunk, scale }
        });

        workers.push(worker);

        const task = new Promise<Set<string>>((resolve, reject) => {
            worker.on("message", (result: string[]) => {
                console.log(`[Workers] Thread ${i + 1} ended`);
                resolve(new Set(result));
            });
            worker.on("error", reject);
            worker.on("exit", code => {
                if(code !== 0) {
                    reject(new Error(`Worker stopped with exit code ${code}`));
                }
            });
        });

        console.log(`[Workers] Thread ${i + 1} started`);
        tasks.push(task);
    }

    const voxels: Vector3[] = [];
    const results = await Promise.all(tasks);

    console.log(`All ${threadCount} threads ended successfully`);

    for(const res of results) {
        for(const vector of res) {
            const [x, y, z] = vector.split(",").map(Number);
            voxels.push([x, y, z]);
        }
    }

    return voxels;
};