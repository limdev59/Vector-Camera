			import { Vector3, world, Player, Dimension, system } from "@minecraft/server";
import { Anchor } from "../Object/Anchor";
import AnchorManager from "../Manager/AnchorManager";

class ScenarioManager {
    private static _instance: ScenarioManager;
    private scenarios: { id: number; name: string; description: string; dimension: Dimension; anchors: number[]; }[] = [];
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
            scenario.anchors.forEach(anchorId => {
                anchorManager.removeAnchor(anchorId);
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


    public getScenarios(): { id: number; name: string; description: string; anchors: number[] }[] {
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

    public getSelectedScenario(player: Player): { id: number; name: string; description: string; anchors: number[] } | undefined {
        console.error(`Current selectedScenarios Map: ${JSON.stringify(Array.from(this.selectedScenarios))}`);
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

    public addAnchorToScenario(scenarioId: number, location: Vector3): boolean {
        const scenario = this.scenarios.find(s => s.id === scenarioId);
        if (scenario) {
            const anchorManager = AnchorManager.Instance();
            const anchor = anchorManager.createAnchor(location, scenario.dimension);
            scenario.anchors.push(anchor.id);
            return true;
        }
        return false;
    }

    public removeAnchorFromScenario(scenarioId: number, anchorId: number): boolean {
        const scenario = this.scenarios.find(s => s.id === scenarioId);
        if (scenario) {
            const index = scenario.anchors.indexOf(anchorId);
            if (index >= 0) {
                scenario.anchors.splice(index, 1);
                const anchorManager = AnchorManager.Instance();
                return anchorManager.removeAnchor(anchorId);
            }
        }
        return false;
    }

    public listAnchorsInScenario(scenarioId: number): Anchor[] | undefined {
        const scenario = this.scenarios.find(s => s.id === scenarioId);
        if (scenario) {
            const anchorManager = AnchorManager.Instance();
            return scenario.anchors.map(id => anchorManager.getAnchor(id)).filter(anchor => anchor !== undefined) as Anchor[];
        }
        return undefined;
    }
}

export default ScenarioManager;
