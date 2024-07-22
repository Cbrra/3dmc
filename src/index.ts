import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { STLParser } from "./models/STLParser";
import { computeTriangles } from "./computeTriangles";
import type { Vector3 } from "./math/vectors";
import { MatrixUtils } from "./math/matrices";
import { MinecraftConverter } from "./minecraft/MinecraftConverter";
import config from "@/../config.json";

const main = async() => {
    const stlFilePath = resolve("input.stl");
    if(!existsSync(stlFilePath)) {
        console.error(`No input file found! Please put your file in ${stlFilePath}.`);
        process.exit(1);
    }

    const stlData = readFileSync(stlFilePath);
    const triangles = STLParser.parseBinary(stlData);

    if(triangles.length === 0) {
        console.error("No triangles found in the stl file!");
        process.exit(1);
    }

    console.log(`Found ${triangles.length} triangles. Converting...`);
    const voxels = await computeTriangles(triangles, config.scale);

    if(config.rotation[0] !== 0 || config.rotation[1] !== 0 || config.rotation[2] !== 0) {
        MatrixUtils.applyStructureRotation(voxels, config.rotation as Vector3, [0, 0, 0]);
    }

    MinecraftConverter.convert(voxels);

    console.log("Thanks for using 3dmc! You can like the github repo if you like it.");
};

main();