import { writeFileSync, mkdirSync, cpSync } from "node:fs";
import { join } from "node:path";
import type { Vector3 } from "@/math/vectors";
import generateCommands from "./generateCommands";
import config from "@/../config.json";

/**
 * If longer, some instructions seams to be silently ignored by Minecraft.
 */
const MAX_MCFUNCTION_LINE_COUNT = (1 << 15) - 1;

export class MinecraftConverter {
    /**
     * Zone surrounding the players
     * No blocks will be placed here
     */
    public static readonly safeZones = [
        [-1, -1, -1], [0, -1, -1], [1, -1, -1],
        [1, -1, 0], [1, -1, 1], [0, -1, 1],
        [-1, -1, 1], [-1, -1, 0], [0, -1, 0],
        //
        [-1, 0, -1], [0, 0, -1], [1, 0, -1],
        [1, 0, 0], [1, 0, 1], [0, 0, 1],
        [-1, 0, 1], [-1, 0, 0], [0, 0, 0],
        //
        [-1, 1, -1], [0, 1, -1], [1, 1, -1],
        [1, 1, 0], [1, 1, 1], [0, 1, 1],
        [-1, 1, 1], [-1, 1, 0], [0, 1, 0],
        //
        [-1, 2, -1], [0, 2, -1], [1, 2, -1],
        [1, 2, 0], [1, 2, 1], [0, 2, 1],
        [-1, 2, 1], [-1, 2, 0], [0, 2, 0],
    ];

    public static convert(coordinates: Vector3[]): void {
        const filtered = coordinates.filter(c => {
            for(const zone of MinecraftConverter.safeZones) {
                if(c[0] === zone[0] && c[1] === zone[1] && c[2] === zone[2]) {
                    return false;
                }
            }

            return true;
        });

        const commands = generateCommands(filtered);
        
        if(commands.length === 0) {
            console.error("No commands generated.");
            return;
        }

        console.log(`The 3d model will need ${commands.length} commands to be generated in-game (${filtered.length} blocks)`);

        const fileCount = Math.ceil(commands.length / MAX_MCFUNCTION_LINE_COUNT);
        const parentPath = "./3dmc/data/3dmc/function";

        const tickCommands = [
            "execute if score @p timer matches 1.. run scoreboard players add @p timer 1"
        ];

        mkdirSync(join(parentPath, "f"));

        for(let i = 0; i < fileCount; i++) {
            const block = commands.slice(MAX_MCFUNCTION_LINE_COUNT * i, MAX_MCFUNCTION_LINE_COUNT * (i + 1));
            writeFileSync(join(parentPath, "f", `${i}.mcfunction`), block.join("\n"));

            tickCommands.push(`execute if score @p timer matches ${tickCommands.length * 5} run function 3dmc:f/${i}`);
            tickCommands.push(`execute if score @p timer matches ${tickCommands.length * 5} run say Placing chunk ${i + 1}/${fileCount} - DO NOT MOVE`);
        }

        tickCommands.push(`execute if score @p timer matches ${tickCommands.length * 5} run scoreboard players set @p timer -1`);
        writeFileSync(join(parentPath, "tick.mcfunction"), tickCommands.join("\n"));

        console.log(`Datapack files created in the 3dmc folder!`);

        if(config.datapacksFolderPath) {
            const path = join(config.datapacksFolderPath, "3dmc");

            console.log(`Copying datapack folder into ${path}...`);

            cpSync("./3dmc", path, { recursive: true });

            console.log("Datapack copied. Use /reload to update the datapack in-game.");
        }
    }
}