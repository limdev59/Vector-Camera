// EventManager.ts
import { world, system, Player } from "@minecraft/server";
import CommandHandler from "../Handler/CommandHandler";
import { AFTER_EVENTS, BEFORE_EVENTS } from "../constants";
import { Util } from "../Util/Util";
import UIManager from "../Manager/UIManager";
import ScenarioManager from "../Manager/ScenarioManager";

class EventManager {
    private static _instance: EventManager;

    private constructor() {
        this.Init();
    }

    public static Instance(): EventManager {
        if (!EventManager._instance) {
            EventManager._instance = new EventManager();
        }
        return EventManager._instance;
    }

    private Init(): void {
        BEFORE_EVENTS.forEach(eventName => {
            const eventHandler = (world.beforeEvents as any)[eventName];
            if (eventHandler) {
                eventHandler.subscribe((event: any) => this.handleBeforeEvent(eventName, event));
            }
        });
        AFTER_EVENTS.forEach(eventName => {
            const eventHandler = (world.afterEvents as any)[eventName];
            if (eventHandler) {
                eventHandler.subscribe((event: any) => this.handleAfterEvent(eventName, event));
            }
        });
    }

    private handleBeforeEvent(eventName: string, event: any): void {
        const methodName = `onBefore${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`;
        if (typeof (this as any)[methodName] === 'function') {
            (this as any)[methodName](event);
        } else {
            this.logEvent(eventName, event);
        }
    }

    private handleAfterEvent(eventName: string, event: any): void {
        const methodName = `onAfter${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`;
        if (typeof (this as any)[methodName] === 'function') {
            (this as any)[methodName](event);
        } else {
            this.logEvent(eventName, event);
        }
    }

    private logEvent(eventName: string, event: any): void {
        console.log(`[EventManager] ${eventName} event triggered`, event);
    }


    private onBeforeChatSend(event: any): void {
        const { message, sender, targets } = event;
        if (message && message.startsWith('!')) {
            CommandHandler.Instance().handle(sender as Player, message.substring(1));
            event.cancel = true;
        }
    }

    private onBeforePlayerBreakBlock(event: any): void {
        const { itemStack, player } = event;

        if (player && itemStack?.typeId == "minecraft:wooden_axe") {
            event.cancel = true;
            Util.tell(`${player.name} can't break blocks`, player);
            system.run(async () => {
                try {
                    await UIManager.Instance().showMainForm(player);
                } catch (error) {
                    Util.tell(`aa ${error} aa`, player);
                    console.error(`Error showing main form: ${error}`);
                }
            });
        }
    }

    private async onAfterPlayerJoin(event: any): Promise<void> {
        const { playerId, playerName } = event;

        const maxRetries = 10; // 최대 재시도 횟수
        const delay = 10; // 각 재시도 사이의 대기 시간 (틱 단위)

        let retries = 0;

        const intervalId = system.runInterval(() => {
            const player = world.getPlayers().find(p => p.name === playerName);

            if (player) {
                const scenarioManager = ScenarioManager.Instance();
                let testScenario = scenarioManager.getScenarios().find(s => s.name === "test");

                // 테스트 시나리오가 없는 경우 새로 생성
                if (!testScenario) {
                    const overworld = world.getDimension("overworld");
                    scenarioManager.createScenario("test", "This is the default scenario.", overworld);
                    testScenario = scenarioManager.getScenarios().find(s => s.name === "test");
                }

                // 테스트 시나리오 선택
                if (testScenario) {
                    scenarioManager.selectScenario(player, testScenario.id);
                    console.log(`Player ${playerName} has joined and selected the test scenario.`);
                } else {
                    console.error(`Failed to create or find the test scenario for player ${playerName}.`);
                }

                // 플레이어를 찾았으므로 인터벌을 종료합니다.
                system.clearRun(intervalId);
            } else {
                retries++;
                if (retries >= maxRetries) {
                    console.error(`Player with ID ${playerId} not found after ${maxRetries} retries.`);
                    system.clearRun(intervalId); // 최대 재시도 횟수에 도달하면 인터벌을 종료합니다.
                }
            }
        }, delay);
    }


}

export default EventManager;
