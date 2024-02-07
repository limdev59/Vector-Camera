import { EasingType, MolangVariableMap, Player, system, Vector3, world } from "@minecraft/server";
import { bezierCurveinterpolate } from "./utils/BezierCurve";
import { CamOptions, Scenario } from "./features/Scenario";
import { ServerManager } from "./managers/ServerManager";
import { Utils } from "./utils/Utilities";
import { firstOrderSpline, linearSpline } from "./utils/CubicSplineInterpolation";

export const Server = new ServerManager();


function spawnConfetti(location: Vector3) {
    for (let i = 0; i < 20; i++) {
        const molang = new MolangVariableMap();

        molang.setColorRGB('variable.color', {
            red: Math.random(),
            green: Math.random(),
            blue: Math.random()
        });

        const newLocation: Vector3 = {
            x: location.x + Math.floor(Math.random() * 1) - 0.5,
            y: location.y + Math.floor(Math.random() * 1) - 0.5,
            z: location.z + Math.floor(Math.random() * 1) - 0.5,
        };
        world.getDimension("minecraft:overworld").spawnParticle('minecraft:colored_flame_particle', newLocation, molang);
    }
}

const sc = Server.scenarios.addScenario("tc", "Lim Develop")

Server.anchors.createAnchor({ x: 0, y: 0, z: 8 });
Server.anchors.createAnchor({ x: 32, y: 0, z: 0 });
Server.anchors.createAnchor({ x: 0, y: 0, z: -40 });
Server.anchors.createAnchor({ x: -32, y: 0, z: 0 });
Server.anchors.createAnchor({ x: 0, y: 0, z: 8 });




for (let s of Server.anchors.data) {
    sc.addAnchor(s);
}

sc.getVelocity();
Server.scenarios.test();
let chicken = world.getDimension("minecraft:overworld").spawnEntity("minecraft:chicken", { x: 0, y: 0, z: 0 });
world.getAllPlayers().forEach((pl) => {
    let i = 0
    for (let t = 0; t < 200; ++t) {
        const nP = bezierCurveinterpolate(t * 0.005, sc.loc);
        spawnConfetti({ x: +nP[0].toFixed(3), y: +nP[1].toFixed(3), z: +nP[2].toFixed(3) });
    }
    system.runInterval(() => {
        if (i < 3) {
            ++i;
            let t = 0;
            system.runInterval(() => {
                if (t < 200) {
                    ++t
                    const nP = bezierCurveinterpolate(t * 0.005, sc.loc);
                    system.run(() => { chicken.teleport({ x: +nP[0].toFixed(3), y: +nP[1].toFixed(3), z: +nP[2].toFixed(3) }) });
                    //system.run(() => pl.camera.setCamera("minecraft:free", new CamOptions({ x: +nP[0].toFixed(3), y: +nP[1].toFixed(3), z: +nP[2].toFixed(3) }, 1.0, EasingType.Linear, pl.location)));
                }
            }, 1)
        }
    }, 200);
});

for (let t = 0; t < 200; ++t) {
    const nP = bezierCurveinterpolate(t * 0.005, sc.loc);
    spawnConfetti({ x: +nP[0].toFixed(3), y: +nP[1].toFixed(3), z: +nP[2].toFixed(3) });
}

for (let t = 0; t < 200; ++t) {
    const nP = linearSpline(t * 0.005, sc.loc);
    spawnConfetti({ x: +nP[0].toFixed(3), y: +nP[1].toFixed(3), z: +nP[2].toFixed(3) });
}
