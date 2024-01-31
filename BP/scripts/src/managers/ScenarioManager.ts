import { Scenario } from "../features/Scenario";

export class ScenarioManager {
    public data: { [key: Scenario["name"]]: Scenario } = {}
    constructor() { }
    addScenario: (name: string, author: string) => Scenario;

}

// add Scenario
ScenarioManager.prototype.addScenario = function (name: string, author: string): Scenario {
    const sc = new Scenario();
    sc.name = name;
    sc.author = author;
    this.data[name] = sc;
    return this.data[name];
};

export const scenarioManager = new ScenarioManager();