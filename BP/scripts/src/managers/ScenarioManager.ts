import { Utils } from "../utils/Utilities";
import { Scenario } from "../features/Scenario";

export class ScenarioManager {
    public data: { [key: string]: Scenario } = {}
    constructor() { }
    addScenario: (name: string, author: string) => Scenario;
    test() {
        Utils.broadcast(`${JSON.stringify(this.data, null, 1)}`);
    };

}

// add Scenario
ScenarioManager.prototype.addScenario = function (name: string, author: string): Scenario {
    const sc = new Scenario();
    sc.author = author;
    this.data[name] = sc;
    return this.data[name];
};

export const scenarioManager = new ScenarioManager();