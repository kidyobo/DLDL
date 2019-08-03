import { Global as G } from 'System/global'
import { UiElements } from 'System/uilib/UiElements'
import { UIUtils } from 'System/utils/UIUtils'
import { ElemFinder } from 'System/uilib/UiUtility'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { GuildData } from 'System/data/GuildData'
import { DataFormatter } from 'System/utils/DataFormatter'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { GuildExplorePanel } from 'System/guild/view/GuildExplorePanel'

enum ExploreEnergyState {
    none, 
    full, 
    ing, 
}

class ExploreEnergy {

    private full: UnityEngine.GameObject;
    private ing: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.full = ElemFinder.findObject(go, 'full');
        this.ing = ElemFinder.findObject(go, 'ing');
    }

    update(state: ExploreEnergyState) {
        this.full.SetActive(ExploreEnergyState.full == state);
        this.ing.SetActive(ExploreEnergyState.ing == state);
    }
}

export abstract class GuildExploreBaseLogic {
    protected panel: GuildExplorePanel;
    protected needTick = false;

    constructor(panel: GuildExplorePanel, needTick: boolean) {
        this.panel = panel;
        this.needTick = needTick;
    }

    abstract initElements(elems: UiElements);

    abstract initListeners();

    abstract onClickBtnGo();

    abstract onCurrencyChange(id: number);

    onOpen() {
    }

    onGuildExploreChanged() {
    }

    get NeedTick(): boolean {
        return this.needTick;
    }
}