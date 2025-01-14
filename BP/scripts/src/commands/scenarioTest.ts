import { system, Vector3 } from "@minecraft/server";
import { Utils } from "../utils/Utilities";
import { Command } from "../managers/CommandManager";
import { Server } from "../../src/index";

// test command
// ex) !scenariotest
export class ScenarioTestCommand extends Command {
    execute(sender, args: string[]) {

        const sc = Server.scenarios.addScenario("test", sender.name);
        {
            const a = Server.anchors.createAnchor(sender.location);
            const b = Server.anchors.createAnchor(Vector3.add({ x: 5, y: 2, z: 0 }, sender.location));
            sc.addAnchor(a);
            sc.addAnchor(b);
        }

        Utils.broadcast(`scenariotest ${sender.name}.`);
    }
}
