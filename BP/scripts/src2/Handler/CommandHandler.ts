import { world, Player, Entity, system } from "@minecraft/server";
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
                this.test3(sender);
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

        selectedScenario.anchors.forEach(anchorId => {
            const anchor = AnchorManager.Instance().getAnchor(anchorId);
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
        player.sendMessage(`${JSON.stringify(scenarioManager, null, 2)}`);
        player.sendMessage(`${JSON.stringify(Array.from(scenarioManager.selectedScenarios), null, 2)}`);
    }

    private test3(player: Player): void {
        // 플레이어 위치 가져오기
        const pP = player.location;
        const px: number = pP.x; // 타입을 number로 지정
        const py: number = pP.y;
        const pz: number = pP.z;

        // 초기 위치를 vec3 형식으로 변환
        const positionVec = glMatrix.vec3.fromValues(px, py, pz);

        // 변환 행렬 생성
        const transformMatrix = glMatrix.mat4.create();
        glMatrix.mat4.translate(transformMatrix, transformMatrix, [5, 0, 0]); // x축으로 5 단위 이동

        // 새로운 위치 계산
        const nP = glMatrix.vec3.create();
        glMatrix.vec3.transformMat4(nP, positionVec, transformMatrix);

        // 새로운 위치로 플레이어를 이동
        system.run(() => {
            player.teleport({
                x: nP[0], // 배열 인덱스로 접근
                y: nP[1],
                z: nP[2],
            }, null);
        });

        // 결과 출력
        player.sendMessage(`Original Position: (${pP.x}, ${pP.y}, ${pP.z})`);
        player.sendMessage(`New Position: (${nP[0]}, ${nP[1]}, ${nP[2]})`);
    }


}

export default CommandHandler;
