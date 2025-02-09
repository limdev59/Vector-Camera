import { Vector3, Vector2, Entity, Dimension, system, world } from "@minecraft/server";
import { Util } from "../Util/Util";
export class Anchor {
    public readonly id: number;
    public readonly position: Vector3;
    public readonly rotation: Vector2;
    private _entity: Entity;
    public readonly dimension: Dimension; // 차원 정보 추가

    constructor(id: number, position: Vector3, rotation: Vector2, entity: Entity, dimension: Dimension) {
        this.id = id;
        this.position = position;
        this.rotation = rotation;
        this._entity = entity;
        this.dimension = dimension;


    }
    public Init(): void {
        this._entity.setProperty("vc:id", this.id);
        system.runTimeout(() => {
            Util.tell(`l${this._entity.getProperty("vc:id")}`, "Lim Develop");
        }, 1);
    }

    public isEntityAlive(): boolean {
        return this._entity && this._entity.isValid();
    }

    public get entity(): Entity {
        return this._entity;
    }

    public set entity(value: Entity) {
        if (!value) return;
        this._entity = value;
        this._entity.setProperty("vc:id", this.id);
    }

}
