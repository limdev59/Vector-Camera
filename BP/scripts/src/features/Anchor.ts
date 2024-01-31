import { Vector, Vector3, Entity, Player, world, system } from "@minecraft/server";

export class Anchor {
    static idcnt: number = 0;

    id: number;

    location: Vector3;
    entity: Entity;

    constructor() {
        this.id = ++Anchor.idcnt;
        this.location = { x: 0, y: 0, z: 0 };
        system.run(() => { this.entity = world.getDimension("overworld").spawnEntity("vc:anchor", this.location) })
    }

    move: (newLocation: Vector3) => Anchor;
    moveTo: (target: Anchor | Entity | Player | Vector3 | { x: number; y: number; z: number }) => Anchor;
}

Anchor.prototype.move = function (newLocation: Vector3): Anchor {
    this.location = newLocation;
    system.run(() => this.entity.teleport(newLocation));
    return this;
};

Anchor.prototype.moveTo = function (target: Anchor | Entity | Player | Vector3 | { x: number; y: number; z: number }): Anchor {
    try {
        if (target instanceof Anchor) {
            this.location = target.location;
            system.run(() => this.entity.teleport(target.location));
        } else if ('location' in target && target.location instanceof Vector) {
            this.location = target.location;
            system.run(() => this.entity.teleport(target.location));
        }
    }
    catch (e) {
        console.error("Invalid target for moveTo.\n(Target type: Anchor, Entity, Player, 'location' property of type Vector3)");
    }
    return this;
};





