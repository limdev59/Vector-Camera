import { EasingType, MolangVariableMap, Player, system, Vector3, world } from "@minecraft/server";
import { CamOptions, Scenario } from "./features/Scenario";
import { ServerManager } from "./managers/ServerManager";
import { Utils } from "./utils/Utilities";
import { linearSpline, thirdOrderSpline } from "./utils/CubicSplineInterpolation";

export const Server = new ServerManager();


// function spawnConfetti(location: Vector33) {
//     for (let i = 0; i < 20; i++) {
//         const molang = new MolangVariableMap();

//         molang.setColorRGB('variable.color', {
//             red: Math.random(),
//             green: Math.random(),
//             blue: Math.random()
//         });

//         const newLocation: Vector33 = {
//             x: location.x + Math.floor(Math.random() * 1) - 0.5,
//             y: location.y + Math.floor(Math.random() * 1) - 0.5,
//             z: location.z + Math.floor(Math.random() * 1) - 0.5,
//         };
//         world.getDimension("minecraft:overworld").spawnParticle('minecraft:colored_flame_particle', newLocation, molang);
//     }
// }


// for (let t = 0; t < 100; ++t) {
//     const nP = linearSpline(t * 0.01, sc.loc);
//     spawnConfetti({ x: +nP[0].toFixed(3), y: +nP[1].toFixed(3), z: +nP[2].toFixed(3) });
// }