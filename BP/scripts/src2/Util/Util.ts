import { world, Player } from "@minecraft/server";

export namespace Util {
    // 유틸함수 시그니처 선언
    export function tell(message: string, playerName: string): void;
    export function tell(message: string, player: Player): void;

    // 유틸함수 구현
    export function tell(message: string, target: string | Player): void {
        if (typeof target === 'string') {
            const player = world.getPlayers().find(pl => pl.name === target);
            if (player) {
                player.sendMessage(message);
            }
        } else if (target instanceof Player) {
            target.sendMessage(message);
        }
    }
}
