import { Player } from "@minecraft/server";

export abstract class Command {
    abstract execute(sender, args: string[]): void;
}

export class CommandManager {
    private commands: { [key: string]: Command } = {};

    addCommand: (name: string, command: Command) => void;
    handleCommand: (sender: Player, message: string) => void;
}

// add command
CommandManager.prototype.addCommand = function (name: string, command: Command): void {
    this.commands[name] = command;
}
// handle Command
CommandManager.prototype.handleCommand = function (sender: Player, message: string): void {
    const parts = message.split(' ');
    const commandName = parts[0];

    if (this.commands[commandName]) {
        const command = this.commands[commandName];
        command.execute(sender, parts.slice(1));
    } else {
        sender.sendMessage(`Unknown command: ${commandName}`);
    }
}

export const commandManager = new CommandManager();