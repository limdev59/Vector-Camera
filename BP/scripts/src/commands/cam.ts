import { EasingType, Player, system, Vector3 } from "@minecraft/server";
import { Utils } from "../utils/Utilities";
import { Command } from "../managers/CommandManager";
import { Server } from "../../src/index";

// test command
// ex) !cam <num>
export class CamCommand extends Command {
    execute(sender, args: string[]) {
        if (sender instanceof Player) {
            system.run(() => sender.camera.setCamera("minecraft:free", {
                easeOptions: { easeTime: 0.3, easeType: EasingType.Spring }
            }));
        }
    }
}

// - cameraPreset

// example:example_free
// example:example_player_effects
// example:example_player_listener
// minecraft:free
// minecraft:third_person
// minecraft:third_person_front


// - setOptions

// easeOptions:{easeTime: number, easeType: EasingType.?}

// easeOptions:{easeTime: number, easeType: EasingType.?}
// facingEntity: Entity
// location?: Vector3

// easeOptions:{easeTime: number, easeType: EasingType.?}
// location?: Vector3

// easeOptions:{easeTime: number, easeType: EasingType.?}
// facingLocation: Vector3;
// location?: Vector3

// easeOptions:{easeTime: number, easeType: EasingType.?}
// location?: Vector3
// rotation: Vector2
