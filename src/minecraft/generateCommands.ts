import type { Vector3 } from "@/math/vectors";

/**
 * Generate /setblock & /fill commands
 */
export default (coords: Vector3[]): string[] => {
    coords.sort(([x1, y1, z1], [x2, y2, z2]) => {
        if(y1 !== y2) return y1 - y2;
        if(x1 !== x2) return x1 - x2;
        return z1 - z2;
    });

    const commands: string[] = [];

    // Group coordinates by layers (y) first
    let currentLayer = coords[0][1];
    let currentGroup: Vector3[] = [];

    for(const coord of coords) {
        if(coord[1] === currentLayer) {
            currentGroup.push(coord);
        } else {
            processGroup(currentGroup, commands);
            currentGroup = [coord];
            currentLayer = coord[1];
        }
    }
    processGroup(currentGroup, commands); // Process the last group

    return commands;
};

/**
 * @param commands Mutate the array
 */
const processGroup = (group: Vector3[], commands: string[]): void => {
    group.sort(([x1, , z1], [x2, , z2]) => {
        if(x1 !== x2) return x1 - x2;
        return z1 - z2;
    });

    let start = group[0];
    let end = group[0];

    for(let i = 1; i < group.length; i++) {
        const [x, y, z] = group[i];
        if((x === end[0] + 1 && z === end[2]) || (z === end[2] + 1 && x === end[0])) {
            end = [x, y, z];
        } else {
            if(start[0] !== end[0] || start[2] !== end[2]) {
                commands.push(`execute at @p run fill ~${start[0]} ~${start[1]} ~${start[2]} ~${end[0]} ~${end[1]} ~${end[2]} stone`);
            } else {
                commands.push(`execute at @p run setblock ~${start[0]} ~${start[1]} ~${start[2]} stone`);
            }
            start = [x, y, z];
            end = [x, y, z];
        }
    }

    if(start[0] !== end[0] || start[2] !== end[2]) {
        commands.push(`execute at @p run fill ~${start[0]} ~${start[1]} ~${start[2]} ~${end[0]} ~${end[1]} ~${end[2]} stone`);
    } else {
        commands.push(`execute at @p run setblock ~${start[0]} ~${start[1]} ~${start[2]} stone`);
    }
};