import { world, Player, system } from '@minecraft/server';

export class PlayerManager {
    public data: Player[] = []

    constructor() {
        system.run(() => this.data = world.getAllPlayers())
    }
    public scan: () => void;
    public list: () => string[];

};

PlayerManager.prototype.scan = function (): void {
    system.run(() => this.data = world.getAllPlayers())
};

PlayerManager.prototype.list = function (): string[] {
    let nameList: string[] = [];
    this.data.forEach((pl) => { nameList.push(pl.name) });
    return nameList;
};

export const playerManager = new PlayerManager();