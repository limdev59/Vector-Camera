// Core.ts
import { system, world } from "@minecraft/server";
import AnchorManager from "../Manager/AnchorManager";
import ScenarioManager from "../Manager/ScenarioManager";
import EventManager from "../Manager/EventManager";
import CommandHandler from "../Handler/CommandHandler";
import UIManager from "../Manager/UIManager";

class Core {
    private static _instance: Core;
    private initialized: boolean = false;

    // 매니저 및 핸들러 인스턴스들
    private anchorManager: AnchorManager;
    private scenarioManager: ScenarioManager;
    private eventManager: EventManager;
    private commandHandler: CommandHandler;
    private uiManager: UIManager;

    private constructor() {
        this.Init();
    }

    public static Instance(): Core {
        if (!Core._instance) {
            Core._instance = new Core();
        }
        return Core._instance;
    }

    private Init(): void {
        // 매니저 및 핸들러 초기화
        this.anchorManager = AnchorManager.Instance();
        this.scenarioManager = ScenarioManager.Instance();
        this.eventManager = EventManager.Instance();
        this.commandHandler = CommandHandler.Instance();
        this.uiManager = UIManager.Instance();

        // 초기화 작업 수행
        this.initialized = true;

        // 매 틱마다 Update 호출
        system.runInterval(() => this.Update(), 1);
    }

    private Update(): void {
        if (!this.initialized) return;

        // 앵커 매니저 업데이트 호출
        this.anchorManager.Update();

        // 진행 상황을 관리하는 작업 수행

        // 추가적인 업데이트 로직을 여기에 추가할 수 있음
    }

    private log(message: string): void {
        console.log(`[Core] ${message}`);
    }
}

export default Core;
