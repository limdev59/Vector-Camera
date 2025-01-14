	import { EasingType, Vector3 } from "@minecraft/server";
import { Anchor } from "./Anchor";

export class CamOptions {
    easeOptions: {
        easeTime: number;
        easingType: EasingType;
    };
    facingLocation: Vector3;
    location: Vector3;

    constructor(location: Vector3, easeTime?: number, easingType?: EasingType, facingLocation?: Vector3) {
        this.easeOptions = {
            easeTime: easeTime || 0.5,
            easingType: easingType || EasingType.Linear,
        };
        this.facingLocation = facingLocation || location;
        this.location = location;
    }
}

export class Scenario {
    anchors: Anchor[] = [];
    loc: number[][] = [];

    author: string;
    constructor() {
    }
    addAnchor: (anchor: Anchor) => void;
    removeAnchor: (anchor: Anchor) => void;
    insertAnchor: (anchor: Anchor, idx: number) => void;
    replaceAnchor: (prevAnchor: Anchor, newAnchor: Anchor) => void;

    getSchedule(i) {
        if (i == 0) {
            const an = this.anchors[this.anchors.length - 1];
            this.loc.push([+an.location.x.toFixed(3), +an.location.y.toFixed(3), +an.location.z.toFixed(3)]);
        } else if (i == 1) {
            this.loc = [];
            for (let an of this.anchors) {
                this.loc.push([+an.location.x.toFixed(3), +an.location.y.toFixed(3), +an.location.z.toFixed(3)]);
            }
        }
    }
}

// add anchor
Scenario.prototype.addAnchor = function (anchor: Anchor): void {
    this.anchors.push(anchor);
    this.getSchedule(0);
}
// remove anchor
Scenario.prototype.removeAnchor = function (anchor: Anchor): void {
    const index = this.anchors.indexOf(anchor);
    if (index !== -1) {
        this.anchors.splice(index, 1)
        this.getSchedule(1);
    };
}
// insert anchor
Scenario.prototype.insertAnchor = function (anchor: Anchor, idx: number): void {
    this.anchors.splice(idx, 0, anchor);
    this.getSchedule(1);
}
// replace anchor
Scenario.prototype.replaceAnchor = function (prevAnchor: Anchor, newAnchor: Anchor): void {
    const index = this.anchors.indexOf(prevAnchor);
    if (index !== -1) this.anchors[index] = newAnchor;
    this.getSchedule(1);
}






