import { Player, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import ScenarioManager from "./ScenarioManager";

class UIManager {
    private static _instance: UIManager;

    private constructor() { }

    public static Instance(): UIManager {
        if (!UIManager._instance) {
            UIManager._instance = new UIManager();
        }
        return UIManager._instance;
    }

    async showMainForm(player: Player): Promise<void> {
        const form = new ActionFormData()
            .title("메인 폼")
            .body(`현재 선택된 시나리오: ${ScenarioManager.Instance().getSelectedScenarioName(player) || '없음'}`)
            .button("시나리오 선택", "텍스트")
            .button("시나리오 관리", "텍스트")
            .button("현재 시나리오 편집", "텍스트")
            .button("닫기", "텍스트");

        const response = await form.show(player);

        if (response.selection === 0) {
            this.showScenarioSelectionForm(player);
        } else if (response.selection === 1) {
            this.showScenarioManagementForm(player);
        } else if (response.selection === 2) {
            this.showEditScenarioForm(player);
        }
    }

    async showScenarioSelectionForm(player: Player): Promise<void> {
        const scenarios = ScenarioManager.Instance().getScenarios();

        if (scenarios.length === 0) {
            await this.showErrorMessage(player, "선택할 시나리오가 없습니다.");
            this.showMainForm(player);
            return;
        }

        const form = new ActionFormData().title("시나리오 선택 폼");
        scenarios.forEach(scenario => {
            form.button(scenario.name, "텍스트");
        });
        form.button("뒤로가기", "텍스트");

        const response = await form.show(player);
        if (response.selection < scenarios.length) {
            const selectedScenario = scenarios[response.selection];
            ScenarioManager.Instance().selectScenario(player, selectedScenario.id);
            this.showMainForm(player);
        } else {
            this.showMainForm(player);
        }
    }

    async showScenarioManagementForm(player: Player): Promise<void> {
        const form = new ActionFormData()
            .title("시나리오 관리 폼")
            .button("시나리오 등록", "텍스트")
            .button("시나리오 삭제", "텍스트")
            .button("뒤로가기", "텍스트");

        const response = await form.show(player);

        if (response.selection === 0) {
            this.showScenarioRegistrationForm(player);
        } else if (response.selection === 1) {
            this.showScenarioDeletionSelectionForm(player);
        } else {
            this.showMainForm(player);
        }
    }

    async showScenarioRegistrationForm(player: Player): Promise<void> {
        const form = new ModalFormData()
            .title("시나리오 등록 폼")
            .textField("이름", "시나리오 이름을 입력하세요")
            .textField("설명", "시나리오 설명을 입력하세요");

        const response = await form.show(player);

        if (response.canceled) {
            this.showScenarioManagementForm(player);
            return;
        }

        const name = response.formValues[0] as string;
        const description = response.formValues[1] as string;

        // 시나리오 이름이 공백인지 확인
        if (!name.trim()) {
            await this.showErrorMessage(player, "시나리오 이름은 공백일 수 없습니다.");
            this.showScenarioRegistrationForm(player);
            return;
        }

        // 시나리오 생성 시 중복 확인
        const scenarioManager = ScenarioManager.Instance();
        const existingScenario = scenarioManager.getScenarios().find(s => s.name.toLowerCase() === name.toLowerCase());
        if (existingScenario) {
            await this.showErrorMessage(player, `시나리오 이름은 중복될 수 없습니다.\n§o§7${name}가 이미 존재함 `);
            this.showScenarioRegistrationForm(player);
            return;
        }

        // 시나리오 생성
        scenarioManager.createScenario(name, description, player.dimension);
        this.showScenarioManagementForm(player);
    }

    async showScenarioDeletionSelectionForm(player: Player): Promise<void> {
        const scenarios = ScenarioManager.Instance().getScenarios();

        if (scenarios.length === 0) {
            await this.showErrorMessage(player, "삭제할 시나리오가 없습니다.");
            this.showScenarioManagementForm(player);
            return;
        }

        const form = new ActionFormData().title("삭제할 시나리오 선택");

        scenarios.forEach(scenario => {
            form.button(scenario.name, "텍스트");
        });
        form.button("뒤로가기", "텍스트");

        const response = await form.show(player);

        if (response.selection < scenarios.length) {
            const selectedScenario = scenarios[response.selection];
            this.showScenarioDeletionConfirmationForm(player, selectedScenario.id, selectedScenario.name);
        } else {
            this.showScenarioManagementForm(player);
        }
    }

    async showScenarioDeletionConfirmationForm(player: Player, scenarioId: number, scenarioName: string): Promise<void> {
        const form = new ModalFormData()
            .title("시나리오 삭제 확인")
            .textField("시나리오 이름 확인", `시나리오 이름 (${scenarioName})을 입력하세요`);

        const response = await form.show(player);

        if (response.canceled) {
            this.showScenarioManagementForm(player);
            return;
        }

        const inputName = response.formValues[0] as string;

        if (inputName !== scenarioName) {
            await this.showErrorMessage(player, "입력한 이름이 일치하지 않습니다.");
            this.showScenarioDeletionConfirmationForm(player, scenarioId, scenarioName);
            return;
        }

        ScenarioManager.Instance().deleteScenario(scenarioId);
        await this.showSuccessMessage(player, "시나리오가 성공적으로 삭제되었습니다.");
        this.showScenarioManagementForm(player);
    }

    async showEditScenarioForm(player: Player): Promise<void> {
        const selectedScenario = ScenarioManager.Instance().getSelectedScenario(player);

        if (!selectedScenario) {
            await this.showErrorMessage(player, "현재 선택된 시나리오가 없습니다.");
            this.showMainForm(player);
            return;
        }

        const form = new ActionFormData()
            .title(`편집 중인 시나리오: ${selectedScenario.name}`)
            .button("앵커 직접 추가", "텍스트")
            .button("현재 위치에 앵커 추가", "텍스트")
            .button("뒤로가기", "텍스트");

        const response = await form.show(player);

        if (response.selection === 0) {
            this.showDirectAddAnchorForm(player, selectedScenario.id);
        } else if (response.selection === 1) {
            this.addAnchorAtPlayerLocation(player, selectedScenario.id);
        } else {
            this.showMainForm(player);
        }
    }

    async showDirectAddAnchorForm(player: Player, scenarioId: number): Promise<void> {
        const form = new ModalFormData()
            .title("앵커 직접 추가")
            .textField("X 좌표", "X 좌표를 입력하세요")
            .textField("Y 좌표", "Y 좌표를 입력하세요")
            .textField("Z 좌표", "Z 좌표를 입력하세요")
            .textField("X(좌우) 각도", "X 각도를 입력하세요")
            .textField("Y(상하) 각도", "Y 각도를 입력하세요");

        const response = await form.show(player);

        if (response.canceled) {
            this.showEditScenarioForm(player);
            return;
        }

        const x = parseFloat(response.formValues[0] as string);
        const y = parseFloat(response.formValues[1] as string);
        const z = parseFloat(response.formValues[2] as string);

        const rx = parseFloat(response.formValues[3] as string);
        const ry = parseFloat(response.formValues[4] as string);

        if (isNaN(x) || isNaN(y) || isNaN(z)) {
            await this.showErrorMessage(player, "잘못된 좌표 입력입니다.");
            this.showDirectAddAnchorForm(player, scenarioId);
            return;
        }
        if (isNaN(rx) || isNaN(ry)) {
            await this.showErrorMessage(player, "잘못된 각도 입력입니다.");
            this.showDirectAddAnchorForm(player, scenarioId);
            return;
        }

        const position = { x, y, z };
        const rotation = { rx, ry };

        ScenarioManager.Instance().addAnchorToScenario(scenarioId, position, rotation);
        await this.showSuccessMessage(player, `앵커가 추가되었습니다.\nx: ${x} \ny: ${y} \nz: ${z} \nrx: ${rx} \nry: ${ry}`);
        this.showEditScenarioForm(player);
    }

    async addAnchorAtPlayerLocation(player: Player, scenarioId: number): Promise<void> {
        const position = player.location;
        const rotation = player.getRotation();
        ScenarioManager.Instance().addAnchorToScenario(scenarioId, position, rotation);

        await this.showSuccessMessage(player, `현재 위치에 앵커가 추가되었습니다.\nx: ${position.x} \ny: ${position.y} \nz: ${position.z}  \nrx: ${rotation.x} \nry: ${rotation.y}`);
        this.showEditScenarioForm(player);
    }

    private async showErrorMessage(player: Player, message: string): Promise<void> {
        const form = new ActionFormData()
            .title("오류")
            .body(message)
            .button("확인");

        await form.show(player);
    }

    private async showSuccessMessage(player: Player, message: string): Promise<void> {
        const form = new ActionFormData()
            .title("성공")
            .body(message)
            .button("확인");

        await form.show(player);
    }
}

export default UIManager;
