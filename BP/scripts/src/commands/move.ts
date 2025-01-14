import { Vector3, EasingType, system } from "@minecraft/server";
import { Utils } from "../utils/Utilities";
import { Command } from "../managers/CommandManager";

// test command
// ex) !move Steve
export class MoveCommand extends Command {
    execute(sender, args: string[]) {
        system.run(() => {
            let vi = sender.getViewDirection()
            let vec = Vector3.add(
                Vector3.multiply(new Vector3(vi.x, vi.y, vi.z).normalized(), 100),
                sender.location
            )
            vec.y += 1.85

            sender.camera.setCamera("minecraft:free", {
                easeOptions: {
                    easeTime: 0.3,
                    easeType: EasingType.Linear
                },
                location: vec,
                rotation: { x: sender.getRotation().x, y: sender.getRotation().y }
            });
        })

        Utils.broadcast(`Moving player ${sender.nameTag} to a new location.`);
    }
}
