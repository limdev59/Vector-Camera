import { EasingType, Player, system, Vector3, world } from "@minecraft/server";
import { Utils } from "../utils/Utilities";
import { Command } from "../managers/CommandManager";
import { Server } from "../../src/index";
import { thirdOrderSpline } from "../utils/CubicSplineInterpolation";
import { CamOptions } from "../features/Scenario";

// test anchor
// ex) !anchor add ScenarioName
//     !anchor add ScenarioName 0 0 0
//     !anchor remove ScenarioName 1
//     
export class AnchorCommand extends Command {
    execute(sender, args: string[]) {
        if (!(sender instanceof Player)) return;
        if (args[0] == "add") {
            if (!Server.scenarios.data[args[1]]) return;
            if (args[2]) {
                const an = Server.anchors.createAnchor({ x: +(+args[2]).toFixed(3), y: +(+args[3]).toFixed(3), z: +(+args[4]).toFixed(3) });
                Server.scenarios.data[`${args[1]}`].addAnchor(an)
            } else {
                const an = Server.anchors.createAnchor(sender.location);
                Server.scenarios.data[`${args[1]}`].addAnchor(an);
            }

        } else if (args[0] == "remove") {
            if (!Server.scenarios.data[args[1]]) return;
            Server.scenarios.data[`${args[1]}`].anchors.forEach((a) => {
                if (a.id == +args[2]) {
                    Server.anchors.deleteAnchor(a);
                }
            });
        } else if (args[0] == "move") {
            if (!Server.scenarios.data[args[1]]) return;
            Server.scenarios.data[`${args[1]}`].anchors.forEach((a) => {
                if (a.id == +args[2]) {
                    a.move({ x: +(+args[3]).toFixed(3), y: +(+args[4]).toFixed(3), z: +(+args[5]).toFixed(3) })
                }
            });
        }
    }
}
// !scenario add ScenarioName
export class ScenarioCommand extends Command {
    execute(sender, args: string[]) {
        if (!(sender instanceof Player)) return;
        if (args[0] == "add") {
            if (args[1]) {
                Server.scenarios.addScenario(`${args[1]}`, sender.name);
                Utils.broadcast(`${JSON.stringify(Server.scenarios.data[`${args[1]}`])}`);
            }
        }
    }
}
// !play ScenarioName
export class PlayCommand extends Command {
    execute(sender, args: string[]) {
        if (!(sender instanceof Player)) return;
        if (args[0]) {
            const sc = Server.scenarios.data[args[0]];
            Utils.execute(`effect @e[type=vc:anchor] invisibility 1000 1 true`);
            Utils.execute(`effect @a invisibility 10000 1 true`);
            const vec = Server.scenarios.data[args[0]].loc[0];
            Utils.execute(`tp @a[name="${sender.name}"] ${vec[0]} ${vec[1]} ${vec[2]}`);
            let t = 0;
            const intervalId: number = system.runInterval(() => {
                if (t < 200) {
                    ++t;
                    const nP: Array<number> = thirdOrderSpline(t * 0.005, sc.loc);
                    let nP2: Array<number> = null;
                    if (t % (+args[2]) === 0) {
                        nP2 = thirdOrderSpline((t + 1) * 0.005, sc.loc);
                    }
                    sender.camera.setCamera(
                        "minecraft:free",
                        new CamOptions(
                            { x: +nP[0].toFixed(3), y: +nP[1].toFixed(3), z: +nP[2].toFixed(3) },
                            +args[1],
                            EasingType.Linear,
                            nP2 ? { x: +nP2[0].toFixed(3), y: +nP2[1].toFixed(3), z: +nP2[2].toFixed(3) } : null
                        )
                    );
                } else {
                    Utils.execute(`camera @a clear`);
                    Utils.execute(`effect @e[type=vc:anchor] clear`);
                    Utils.execute(`effect @a clear`);
                    system.clearRun(intervalId);
                }
            }, 1);
        }
    }
}
