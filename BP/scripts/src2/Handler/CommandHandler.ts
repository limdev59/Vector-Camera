import { world, Player, Entity, system, Vector3 } from "@minecraft/server";
import { Util } from "../Util/Util";
import AnchorManager from "../Manager/AnchorManager";
import ScenarioManager from "../Manager/ScenarioManager";
import { Anchor } from "../Object/Anchor";

import "../lib/dist/gl-matrix";

class CommandHandler {
    private static _instance: CommandHandler;

    private constructor() { }

    public static Instance(): CommandHandler {
        if (!CommandHandler._instance) {
            CommandHandler._instance = new CommandHandler();
        }
        return CommandHandler._instance;
    }

    public handle(sender: Player, command: string): void {
        if (sender.isOp()) {
            this.executeCommand(sender, command);
        } else {
            Util.tell(`You need permission`, sender.name);
            world.getPlayers().forEach((pl) => {
                if (pl.isOp()) {
                    Util.tell(`${sender.name} requested permission`, pl.name);
                }
            });
        }
    }

    private executeCommand(sender: Player, command: string): void {
        const args = command.split(" ");
        const baseCommand = args[0].toLowerCase();

        switch (baseCommand) {
            case "test":
                this.test(sender);
                break;
            case "test2":
                this.test2(sender);
                break;
            case "test3":
                //this.test3(sender);
                break;
            case "test4":
                this.test4(sender);
                break;
            case "selectanchor":
                this.handleSelectAnchor(sender);
                break;
            // 다른 명령어 처리 로직 추가 가능
            default:
                sender.sendMessage(`Unknown command: ${command}`);
                break;
        }
    }

    private handleSelectAnchor(player: Player): void {
        const anchorManager = AnchorManager.Instance();
        const closestAnchor = anchorManager.findAnchorInSight(player);

        if (closestAnchor) {
            player.sendMessage(`조준점 기준 가장 가까운 앵커 ID: ${closestAnchor.id}`);
            // 선택된 앵커에 대한 추가 로직 구현 가능
        } else {
            player.sendMessage("조준점 내에 앵커를 찾을 수 없습니다.");
        }
    }

    private test(player: Player): void {
        const scenarioManager = ScenarioManager.Instance();
        const selectedScenario = scenarioManager.getSelectedScenario(player);

        selectedScenario.anchors.forEach(anc => {
            const anchor = AnchorManager.Instance().getAnchor(anc.id);
            if (anchor) {
                try {
                    let variant = anchor.entity.getProperty("vc:select") as number;
                    player.sendMessage(`${variant}`);
                    system.run(() => {
                        anchor.entity.setProperty("vc:select", variant == 2 ? 1 : 2);
                    });
                } catch (e) {
                    player.sendMessage(`${e}`);

                }
            }
        });
    }

    private test2(player: Player): void {
        const scenarioManager = ScenarioManager.Instance();
        world.setDynamicProperty("vc:data", JSON.stringify(scenarioManager));
        //player.sendMessage(`${JSON.stringify(scenarioManager, null, 2)}`);
        //player.sendMessage(`${JSON.stringify(Array.from(scenarioManager.selectedScenarios), null, 2)}`);
    }

    // private test3(player: Player): void {
    //     // 플레이어 위치 가져오기
    //     const pP = player.location;
    //     const px: number = pP.x; // 타입을 number로 지정
    //     const py: number = pP.y;
    //     const pz: number = pP.z;

    //     // 초기 위치를 vec3 형식으로 변환
    //     const positionVec = glMatrix.vec3.fromValues(px, py, pz);

    //     // 변환 행렬 생성
    //     const transformMatrix = glMatrix.mat4.create();
    //     glMatrix.mat4.translate(transformMatrix, transformMatrix, [5, 0, 0]); // x축으로 5 단위 이동

    //     // 새로운 위치 계산
    //     const nP = glMatrix.vec3.create();
    //     glMatrix.vec3.transformMat4(nP, positionVec, transformMatrix);

    //     // 새로운 위치로 플레이어를 이동
    //     system.run(() => {
    //         player.teleport({
    //             x: nP[0], // 배열 인덱스로 접근
    //             y: nP[1],
    //             z: nP[2],
    //         }, null);
    //     });

    //     // 결과 출력
    //     player.sendMessage(`Original Position: (${pP.x}, ${pP.y}, ${pP.z})`);
    //     player.sendMessage(`New Position: (${nP[0]}, ${nP[1]}, ${nP[2]})`);
    // }

    // 커맨드 /test4
    private test4(player: Player): void {
        this.visualizeScenarioPath("vc:scenario_trail", 0.0);
    }
    public visualizeScenarioPath(particleType: string = "minecraft:flame", tension: number = 0.5): void {
        system.run(() => {
            const di = world.getDimension("overworld");

            const loc1 = { x: -1, y: -1, z: -1 };
            const loc2 = { x: 1, y: -1, z: -1 };
            const loc3 = { x: 0, y: 0, z: 0 };
            const loc4 = { x: -1, y: 1, z: 1 };
            const loc5 = { x: 1, y: 1, z: 1 };
            const ent1 = di.spawnEntity("vc:anchor", loc1);
            const ent2 = di.spawnEntity("vc:anchor", loc2);
            const ent3 = di.spawnEntity("vc:anchor", loc3);
            const ent4 = di.spawnEntity("vc:anchor", loc4);
            const ent5 = di.spawnEntity("vc:anchor", loc5);
            const anchors: Anchor[] = [
                new Anchor(1, loc1, { x: 0, y: 0 }, ent1, di),
                new Anchor(2, loc2, { x: 0, y: 0 }, ent2, di),
                new Anchor(3, loc3, { x: 0, y: 0 }, ent3, di),
                new Anchor(4, loc4, { x: 0, y: 0 }, ent4, di),
                new Anchor(5, loc5, { x: 0, y: 0 }, ent5, di)
            ]

            for (let i = 0; i < anchors.length - 1; i++) {
                const p0: Vector3 = i > 0 ? anchors[i - 1].position : anchors[i].position;
                const p1: Vector3 = anchors[i].position;
                const p2: Vector3 = anchors[i + 1].position;
                const p3: Vector3 = i < anchors.length - 2 ? anchors[i + 2].position : anchors[i + 1].position;
                this.spawnParticleCurve(p0, p1, p2, p3, particleType, tension);
            }
        })

    }

    private spawnParticleCurve(p0: Vector3, p1: Vector3, p2: Vector3, p3: Vector3, particleType: string, tension: number): void {
        const steps = 50;
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const pos = this.cardinalSpline(p0, p1, p2, p3, t, tension);
            system.run(() => {
                world.getDimension("overworld").spawnParticle(particleType, pos);
            });//, i * 2);
        }
    }
    private cardinalSpline(p0: Vector3, p1: Vector3, p2: Vector3, p3: Vector3, t: number, tension: number): Vector3 {
        const t2 = t * t;
        const t3 = t2 * t;
        const s = (1 - tension) / 2;

        const b1 = -s * t3 + 2 * s * t2 - s * t;
        const b2 = (2 - s) * t3 + (s - 3) * t2 + 1;
        const b3 = (s - 2) * t3 + (3 - 2 * s) * t2 + s * t;
        const b4 = s * t3 - s * t2;

        return {
            x: p0.x * b1 + p1.x * b2 + p2.x * b3 + p3.x * b4,
            y: p0.y * b1 + p1.y * b2 + p2.y * b3 + p3.y * b4,
            z: p0.z * b1 + p1.z * b2 + p2.z * b3 + p3.z * b4
        };
    }


}

export default CommandHandler;
