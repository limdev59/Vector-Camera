import { commandManager } from "../managers/CommandManager";
import { scenarioManager } from "..//managers/ScenarioManager";
import { anchorManager } from "../managers/AnchorManager"
import { CommandResult, Dimension, system, world } from "@minecraft/server";
import { MoveCommand } from "../commands/move";
import { Utils } from "../utils/Utilities";
import { playerManager } from "../managers/PlayerManager";
import { ScenarioTestCommand } from "../commands/scenarioTest";
import { CamCommand } from "../commands/cam";
import { AnchorCommand, PlayCommand, ScenarioCommand } from "../commands/anchor";

export class ServerManager {
    public anchors = anchorManager;
    public scenarios = scenarioManager;
    public commands = commandManager;
    public players = playerManager;

    constructor() {
        this.systemRun();
    }
    // main
    private systemRun() {
        // command register
        commandManager.addCommand('move', new MoveCommand());
        commandManager.addCommand('scenariotest', new ScenarioTestCommand());
        commandManager.addCommand('cam', new CamCommand());
        commandManager.addCommand('anchor', new AnchorCommand());
        commandManager.addCommand('scenario', new ScenarioCommand());
        commandManager.addCommand('play', new PlayCommand());

        // prefix
        world.beforeEvents.chatSend.subscribe((e) => {
            const message = e.message;
            if (message && message.startsWith('!')) {
                if (e.sender.isOp()) {
                    commandManager.handleCommand(e.sender, message.substring(1));
                } else {
                    Utils.tell(`you need permission`, e.sender.name);
                    this.players.data.forEach((pl) => {
                        if (pl.isOp()) Utils.tell(`${e.sender.name} requested permission`, pl.name);
                    })
                }
                e.cancel = true;
            }
        });
        world.afterEvents.playerLeave.subscribe(() => this.players.scan());
        world.afterEvents.playerJoin.subscribe(() => this.players.scan());

        // main
        const tick = () => {
            system.run(() => {

                world.getAllPlayers().forEach((pl) => {
                    if (pl.isSneaking) {

                    } else {

                    }
                });
                tick();
            })
        }
        tick();

    }
    runCommand(command: string, dimension?: Dimension["id"]): Promise<CommandResult> {
        try {
            return world.getDimension(dimension ?? "minecraft:overworld").runCommandAsync(`${command}`);
        } catch (e) {
            console.log(`invalid dimension/n${e}`);
        }
    }
}

// same Utils.execute
// ServerManager.prototype.runCommand = function 