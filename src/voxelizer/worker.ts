import { parentPort, workerData } from "node:worker_threads";
import type { Triangle } from "@/models/3d";
import Voxelizer from "./Voxelizer";

const { triangles, scale } = workerData as { triangles: Triangle[]; scale: number; };

const voxelizer = new Voxelizer();
voxelizer.voxelize(triangles, scale);

parentPort?.postMessage(Array.from(voxelizer.voxels));