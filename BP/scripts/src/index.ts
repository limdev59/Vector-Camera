import { EasingType, Player, system, Vector3, world } from "@minecraft/server";
import { cubicHermite, dcubicHermite } from "./utils/hermite";
import { CamOptions, Scenario } from "./features/Scenario";
import { ServerManager } from "./managers/ServerManager";
import { Utils } from "./utils/Utilities";

export const Server = new ServerManager();


const sc = Server.scenarios.addScenario("tc", "Lim Develop")

Server.anchors.createAnchor({ x: 0, y: 0, z: 0 })
Server.anchors.createAnchor({ x: -1, y: -1, z: -1 })
Server.anchors.createAnchor({ x: -2, y: -3, z: -2 })
Server.anchors.createAnchor({ x: -3, y: -5, z: -3 })



for (let s of Server.anchors.data) {
    sc.addAnchor(s);
}

sc.getVelocity();
Server.scenarios.test();

world.getAllPlayers().forEach((pl) => {
    let i = 0
    system.runInterval(() => {
        if (i < 3) {
            ++i;
            let j = 0;
            system.runInterval(() => {
                if (j < 2) {
                    ++j
                    const nP = dcubicHermite(sc.loc[i], sc.dh[i], sc.loc[i + 1], sc.dh[i + 1], +(0.2 * j).toFixed(0), null).map(v => +v.toFixed(3));
                    Utils.broadcast(`${JSON.stringify(nP)}`);
                    system.run(() => pl.camera.setCamera("minecraft:free", new CamOptions({ x: +nP[0].toFixed(3), y: +nP[1].toFixed(3), z: +nP[2].toFixed(3) }, 0.3, EasingType.Linear, { x: -3, y: -5, z: -3 })));
                }
            }, 5)
        }
    }, 60);
});