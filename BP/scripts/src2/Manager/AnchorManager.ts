		import { Vector3, Vector2, world, system, Dimension, Player, Entity } from "@minecraft/server";
import { Util } from "../Util/Util";
import { Anchor } from "../Object/Anchor";
import ScenarioManager from "../Manager/ScenarioManager";

class AnchorManager {
    private static _instance: AnchorManager;
    private anchors: Map<number, Anchor> = new Map();
    private nextAnchorId: number = 1;

    private constructor() { }

    public static Instance(): AnchorManager {
        if (!AnchorManager._instance) {
            AnchorManager._instance = new AnchorManager();
        }
        return AnchorManager._instance;
    }

    public createAnchor(location: Vector3, rotation: Vector2, dimension: Dimension): Anchor {
        // vc:anchor 엔티티 생성
        const entity = this.spawnAnchorEntity(location, dimension);

        // 앵커 객체 생성
        const anchor = new Anchor(this.nextAnchorId++, location, rotation, entity, dimension);
        anchor.Init();
        this.anchors.set(anchor.id, anchor);

        return anchor;
    }

    public removeAnchor(id: number): boolean {
        const anchor = this.anchors.get(id);
        if (anchor) {
            anchor.entity.addTag('d');
            this.anchors.delete(id);
            return true;
        }
        return false;
    }

    public getAnchor(id: number): Anchor | undefined {
        return this.anchors.get(id);
    }

    public getAllAnchors(): Anchor[] {
        return Array.from(this.anchors.values());
    }

    public checkAndRespawnEntity(id: number): void {
        const anchor: Anchor = this.anchors.get(id);
        if (anchor && !anchor.isEntityAlive()) {
            // 앵커 엔티티가 유효하지 않다면 다시 생성
            const newEntity = this.spawnAnchorEntity(anchor.position, anchor.dimension);

            anchor.entity = newEntity;
            system.run(() => {
                anchor.entity.setProperty("vc:id", id);
                Util.tell(`l2${anchor.entity.getProperty("vc:id")}`, "Lim Develop");
            });
        }
    }

    private spawnAnchorEntity(location: Vector3, dimension: Dimension) {
        return dimension.spawnEntity("vc:anchor", location);
    }

    public findAnchorInSight(player: Player, maxDistance: number = 100): Anchor | null {
        const scenarioManager = ScenarioManager.Instance();
        const selectedScenario = scenarioManager.getSelectedScenario(player);

        if (!selectedScenario) return null;

        let closestAnchor: Anchor | null = null;
        let closestDistance: number = Infinity;

        const playerLocation = player.location;
        const playerViewVector = this.getViewVector(player);

        selectedScenario.anchors.forEach(anc => {
            const anchor = this.anchors.get(anc.id);
            if (anchor) {
                const anchorVector = this.subtractVectors(anchor.position, playerLocation);
                const distance = this.getVectorLength(anchorVector);

                if (distance <= maxDistance) {
                    const angle = this.getAngleBetweenVectors(playerViewVector, anchorVector);

                    if (angle < Math.PI / 6) { // 30도 각도 내에 있는 앵커
                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closestAnchor = anchor;
                            Util.tell(`Anchor ID: ${anchor.id}, Angle: ${angle}, Distance: ${distance}`, player);
                        }
                    }
                }
            }
        });

        return closestAnchor;
    }

    private getViewVector(player: Player): Vector3 {
        const rotation = player.getRotation();
        const pitch = rotation.x * (Math.PI / 180);
        const yaw = rotation.y * (Math.PI / 180);

        return {
            x: -Math.sin(yaw) * Math.cos(pitch),
            y: Math.sin(pitch),
            z: Math.cos(yaw) * Math.cos(pitch),
        };
    }

    private subtractVectors(v1: Vector3, v2: Vector3): Vector3 {
        return {
            x: v1.x - v2.x,
            y: v1.y - v2.y,
            z: v1.z - v2.z,
        };
    }

    private getVectorLength(vector: Vector3): number {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
    }

    private getAngleBetweenVectors(v1: Vector3, v2: Vector3): number {
        const dotProduct = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
        const length1 = this.getVectorLength(v1);
        const length2 = this.getVectorLength(v2);

        return Math.acos(dotProduct / (length1 * length2));
    }

    public Update(): void {
        this.anchors.forEach(anchor => {
            this.checkAndRespawnEntity(anchor.id);
        });
    }
}

export default AnchorManager;
