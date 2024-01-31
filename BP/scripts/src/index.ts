import { EasingType, Player, system, Vector3, world } from "@minecraft/server";
import { calculateTangents, cubicHermite, dcubicHermite } from "./utils/hermite";
import { CamOptions } from "./features/Scenario";
import { ServerManager } from "./managers/ServerManager";

export const Server = new ServerManager();



let i = 0;
let arr: { position: Vector3, tangent: Vector3 }[] = [
    { position: Server.anchors.createAnchor({ x: -11, y: -60, z: 17 }).location, tangent: { x: 0, y: 0, z: 0 } },
    { position: Server.anchors.createAnchor({ x: -6, y: -59, z: 12 }).location, tangent: { x: 0, y: 0, z: 0 } },
    { position: Server.anchors.createAnchor({ x: -1, y: -58, z: 17 }).location, tangent: { x: 0, y: 0, z: 0 } },
    { position: Server.anchors.createAnchor({ x: -6, y: -57, z: 22 }).location, tangent: { x: 0, y: 0, z: 0 } }
];

const tangents = calculateTangents(arr.map(anchor => anchor.position));

for (let i = 0; i < arr.length; ++i) {
    arr[i].tangent = tangents[i];
}

system.runInterval(() => {
    world.getAllPlayers().forEach((pl) => {
        if (!pl.isSneaking) {
            if (pl instanceof Player) {
                if (i < 128) {
                    const t = (1 / 32) * i;
                    const newPosition = dcubicHermite(arr[i].position, arr[i].tangent, arr[i + 1].position, arr[i + 1].tangent, t);
                    pl.camera.setCamera("minecraft:free", new CamOptions(newPosition, 0.5, EasingType.Spring));
                    i++;
                } else if (i > 128) {
                    i = 0;
                }
            }
        }
    });
}, 100);
