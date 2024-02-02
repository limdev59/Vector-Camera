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
    private anchors: Anchor[] = [];
    loc: number[][] = [];
    dh: number[][] = [];

    author: string;
    constructor() {
    }
    addAnchor: (anchor: Anchor) => void;
    removeAnchor: (anchor: Anchor) => void;
    insertAnchor: (anchor: Anchor, idx: number) => void;
    replaceAnchor: (prevAnchor: Anchor, newAnchor: Anchor) => void;

    getSchedule() {
        const an = this.anchors[this.anchors.length - 1];
        this.loc.push([+an.location.x.toFixed(3), +an.location.y.toFixed(3), +an.location.z.toFixed(3)]);
    }

    getVelocity() {
        let px = this.loc;
        let res = px.map((point, i) => {
            const prev = (i - 1 + px.length) % px.length, next = (i + 1) % px.length;
            return [+((px[next][0] - px[prev][0]) / 2).toFixed(3), +((px[next][1] - px[prev][1]) / 2).toFixed(3), +((px[next][2] - px[prev][2]) / 2).toFixed(3)];
        });
        this.dh = res;
    }
}

// add anchor
Scenario.prototype.addAnchor = function (anchor: Anchor): void {
    this.anchors.push(anchor);
    this.getSchedule();
    this.getVelocity();
}
// remove anchor
Scenario.prototype.removeAnchor = function (anchor: Anchor): void {
    const index = this.anchors.indexOf(anchor);
    if (index !== -1) {
        this.anchors.splice(index, 1)
        //
    };
}
// insert anchor
Scenario.prototype.insertAnchor = function (anchor: Anchor, idx: number): void {
    this.anchors.splice(idx, 0, anchor);
}
// replace anchor
Scenario.prototype.replaceAnchor = function (prevAnchor: Anchor, newAnchor: Anchor): void {
    const index = this.anchors.indexOf(prevAnchor);
    if (index !== -1) this.anchors[index] = newAnchor;
}






