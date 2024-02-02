import { Vector3 } from "@minecraft/server";
import { Anchor } from "../features/Anchor";

export class AnchorManager {
    data: Anchor[] = [];


    createAnchor: (location: Vector3) => Anchor;
    deleteAnchor: (anchor: Anchor) => void;
    getLocation: (id: number) => Vector3;
}

// create Anchor
AnchorManager.prototype.createAnchor = function (location: Vector3): Anchor {
    this.data.push(new Anchor().move(location));
    return this.data[this.data.length - 1];
};
// delete Anchor
AnchorManager.prototype.deleteAnchor = function (anchor: Anchor): void {
    const index = this.scenario.indexOf(anchor);
    if (index !== -1) this.scenario.splice(index, 1);
};

// 
AnchorManager.prototype.getLocation = function (id: number): Vector3 {
    try {
        return this.data.find(item => item.id === id).location;
    }
    catch (e) {
    }
};

export const anchorManager = new AnchorManager();