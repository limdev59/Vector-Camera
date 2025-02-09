import { Vector3, Vector2, world, Player, Dimension, system } from "@minecraft/server";
import { Anchor } from "../Object/Anchor";
import AnchorManager from "../Manager/AnchorManager";

class ScenarioManager {
    private static _instance: ScenarioManager;
    private scenarios: { id: number; name: string; description: string; dimension: Dimension; anchors: Anchor[]; }[] = [];
    private nextScenarioId: number = 1;
    private selectedScenarios: Map<string, number> = new Map(); // 플레이어 이름에 따른 시나리오 선택

    private constructor() { }

    public static Instance(): ScenarioManager {
        if (!ScenarioManager._instance) {
            ScenarioManager._instance = new ScenarioManager();
            ScenarioManager._instance.Init(); // 초기화 시 Init 호출
        }
        return ScenarioManager._instance;
    }

    private Init(): void {
        // 기본 시나리오 생성
        const overworld = world.getDimension("overworld"); // 기본으로 Overworld 차원을 사용
        this.createScenario("test", "This is the default scenario.", overworld);

        // 모든 플레이어에 대해 기본 시나리오 선택
        world.getPlayers().forEach((player) => {
            this.selectScenario(player, 1); // ID가 1인 시나리오 선택
        });
    }

    private Update(): void {
        this.visualizeScenarioPath(1, "vc:scenario_trail", 0.0);
    }


    private visualizeScenarioPath(scenarioId: number, particleType: string = "minecraft:flame", tension: number = 0.0): void {
        const scenario = this.scenarios.find(s => s.id === scenarioId);
        if (!scenario || scenario.anchors.length < 2) return;

        const anchors = scenario.anchors.map(a => a.position);
        for (let i = 0; i < anchors.length - 1; i++) {
            const p0 = i > 0 ? anchors[i - 1] : anchors[i];
            const p1 = anchors[i];
            const p2 = anchors[i + 1];
            const p3 = i < anchors.length - 2 ? anchors[i + 2] : anchors[i + 1];
            this.spawnParticleCurve(p0, p1, p2, p3, particleType, tension);
        }
    }

    private spawnParticleCurve(p0: Vector3, p1: Vector3, p2: Vector3, p3: Vector3, particleType: string, tension: number): void {
        const steps = 20;
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const pos = this.cardinalSpline(p0, p1, p2, p3, t, tension);
            system.run(() => { world.getDimension("overworld").spawnParticle(particleType, pos) }
            );
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



    public createScenario(name: string, description: string, dimension: Dimension): void {
        // 이름 중복 체크
        const existingScenario = this.scenarios.find(s => s.name.toLowerCase() === name.toLowerCase());
        if (existingScenario) {
            console.error(`Scenario with name "${name}" already exists. Please choose a different name.`);
            return; // 중복된 이름이 있으면 시나리오 생성 중지
        }

        const scenario = { id: this.nextScenarioId++, name, description, dimension, anchors: [] };
        this.scenarios.push(scenario);
        console.log(`Scenario created with ID: ${scenario.id}, Name: ${scenario.name}`);
    }


    public deleteScenario(id: number): boolean {
        const index = this.scenarios.findIndex(s => s.id === id);
        if (index >= 0) {
            const scenario = this.scenarios[index];

            // 해당 시나리오에 속한 모든 앵커 제거
            const anchorManager = AnchorManager.Instance();
            scenario.anchors.forEach(anchor => {
                anchorManager.removeAnchor(anchor.id);
            });

            // 시나리오 삭제
            this.scenarios.splice(index, 1);

            // 해당 시나리오를 선택한 플레이어가 있으면 초기화
            this.selectedScenarios.forEach((scenarioId, playerName) => {
                if (scenarioId === id) {
                    this.selectedScenarios.delete(playerName);
                }
            });

            return true;
        }
        return false;
    }


    public getScenarios(): { id: number; name: string; description: string; anchors: Anchor[] }[] {
        return this.scenarios;
    }

    public selectScenario(player: Player, id: number): void {
        if (!player || !player.name) {
            return;
        }
        const playerName = player.name.trim().toLowerCase(); // 공백 제거 및 소문자 변환
        const scenario = this.scenarios.find(s => s.id === id);

        if (scenario) {
            this.selectedScenarios.set(playerName, id);
        } else {
            console.error(`Scenario with ID: ${id} does not exist.`);
        }
    }

    public getSelectedScenario(player: Player): { id: number; name: string; description: string; anchors: Anchor[] } | undefined {
        //console.error(`Current selectedScenarios Map: ${JSON.stringify(Array.from(this.selectedScenarios))}`);
        if (!player || !player.name) {
            return undefined;
        }
        const playerName = player.name.trim().toLowerCase(); // 공백 제거 및 소문자 변환
        const selectedScenarioId = this.selectedScenarios.get(playerName);

        if (selectedScenarioId !== undefined) {
            const scenario = this.scenarios.find(s => s.id === selectedScenarioId);
            if (scenario) {
                return scenario;
            } else {
                console.error(`Selected scenario ID: ${selectedScenarioId} does not exist for player: ${playerName}`);
            }
        } else {
            console.error(`No scenario selected for player: ${playerName}`);
        }

        return undefined;
    }

    public getSelectedScenarioName(player: Player): string | null {
        const scenario = this.getSelectedScenario(player);
        return scenario ? scenario.name : null;
    }

    public addAnchorToScenario(scenarioId: number, position: Vector3, rotation: Vector2): boolean {
        const scenario = this.scenarios.find(s => s.id === scenarioId);
        if (scenario) {
            const anchorManager = AnchorManager.Instance();
            const anchor = anchorManager.createAnchor(position, rotation, scenario.dimension);
            scenario.anchors.push(anchor);
            return true;
        }
        return false;
    }

    public removeAnchorFromScenario(scenarioId: number, anchorId: number): boolean {
        const scenario = this.scenarios.find(s => s.id === scenarioId);
        if (!scenario) return false; // 시나리오가 없으면 실패

        // 앵커 목록에서 해당 ID를 가진 앵커 찾기
        const index = scenario.anchors.findIndex(a => a.id === anchorId);
        if (index === -1) return false; // 앵커가 없으면 실패

        // 앵커 목록에서 제거
        scenario.anchors.splice(index, 1);

        // AnchorManager에서 제거
        const anchorManager = AnchorManager.Instance();
        return anchorManager.removeAnchor(anchorId);
    }

    public listAnchorsInScenario(scenarioId: number): Anchor[] | undefined {
        const scenario = this.scenarios.find(s => (s.id === scenarioId));
        if (scenario) {
            const anchorManager = AnchorManager.Instance();
            return scenario.anchors.map(anc => anchorManager.getAnchor(anc.id)).filter(anchor => anchor !== undefined) as Anchor[];
        }
        return undefined;
    }
}

export default ScenarioManager;
