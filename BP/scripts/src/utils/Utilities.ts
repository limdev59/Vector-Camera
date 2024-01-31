import { CommandResult, world } from "@minecraft/server";

export class Utils {
    static execute: (command: string, dimension?: any) => Promise<CommandResult>;
    static broadcast: (context: string, player?: string, dimension?: any) => Promise<CommandResult>;
    static tell: (context: string, player: string, dimension?: any) => Promise<CommandResult>;
}

// execute any command
Utils.execute = function (command: string, dimension?: any): Promise<CommandResult> {
    try {
        return world.getDimension(dimension ?? "minecraft:overworld").runCommandAsync(`${command}`);
    } catch (e) {
        console.log(`invalid dimension/n${e}`);
    }
};
// broadcast all any context
Utils.broadcast = function (context: string, player?: string, dimension?: any): Promise<CommandResult> {
    try {
        return world.getDimension(dimension ?? "minecraft:overworld").runCommandAsync(`tellraw ${player ? `"${player}"` : '@a'} {"rawtext":[{"text":${JSON.stringify(context)}}]}`)
    } catch (e) {
        console.log(`invalid dimension/n${e}`);
    }
};

Utils.tell = function (context: string, player: string, dimension?: any): Promise<CommandResult> {
    try {
        return world.getDimension(dimension ?? "minecraft:overworld").runCommandAsync(`tellraw "${player}" {"rawtext":[{"text":${JSON.stringify(context)}}]}`)
    } catch (e) {
        console.log(`invalid dimension/n${e}`);
    }
};