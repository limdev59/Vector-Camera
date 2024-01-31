import { EasingType, Player, system, Vector } from "@minecraft/server";
import { Utils } from "../utils/Utilities";
import { Command } from "../managers/CommandManager";
import { Server } from "../../src/index";
import { Anchor } from "../../../../../Vector%20Camera/bp/scripts/src/features/Anchor";
import { CamOptions } from "../../../../../Vector%20Camera/bp/scripts/src/features/Scenario";

// test command
// ex) !cub
export class CubicCommand extends Command {
    execute(sender, args: string[]) {
        if (sender instanceof Player) {
            const sc = Server.scenarios.addScenario("cubic", sender.name);
            {
                const aa = Server.anchors.createAnchor;
                let arr: Anchor[] = [
                    aa(sender.location),
                    aa(Vector.add({ x: 5, y: 2, z: 0 }, sender.location)),
                    aa(Vector.add({ x: 10, y: 4, z: 0 }, sender.location)),
                    aa(Vector.add({ x: 0, y: 1, z: 0 }, sender.location))
                ]
                for (const an of arr) {
                    sc.addAnchor(an);
                }
                for ()
                    system.run(() => sender.camera.setCamera("minecraft:free", new CamOptions()));
            }

            Utils.broadcast(`CubicCommand ${sender.name}.`);
        }
    }
}



//삼차보간법(야매)

