		import { Vector3, Entity, Dimension, system } from "@minecraft/server";
import { Util } from "../Util/Util";
export class Anchor {
    public readonly id: number;
    public readonly location: Vector3;
    public readonly entity: Entity;
    public readonly dimension: Dimension; // 차원 정보 추가

    constructor(id: number, location: Vector3, entity: Entity, dimension: Dimension) {
        this.id = id;
        this.location = location;
        this.entity = entity;
        this.dimension = dimension; // 생성자에 차원 정보 추가
        system.run(() => { 
            this.entity.setProperty("vc:id", id); 
            Util.tell(`l${this.entity.getProperty("vc:id") }`, "Mini9041");
        });

    }

    public isEntityAlive(): boolean {
        return this.entity && this.entity.isValid();
    }

    public setEntity(entity: Entity): void {
        (this.entity as any) = entity; // Entity를 업데이트
    }
}
