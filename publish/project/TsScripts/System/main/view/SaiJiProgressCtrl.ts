import { Global as G } from 'System/global'
import { UiElements } from 'System/uilib/UiElements'
import { ElemFinder } from 'System/uilib/UiUtility'
import { Macros } from 'System/protocol/Macros'
import { UIUtils } from 'System/utils/UIUtils'
import { KeyWord } from 'System/constants/KeyWord'
import { ThingData } from 'System/data/thing/ThingData'
import { GameObjectGetSet, TextGetSet } from "System/uilib/CommonForm";

export class SaiJiProgressCtrl {

    private txtName: TextGetSet;
    private txtProgress: TextGetSet;
    private go: GameObjectGetSet;
    
    private isOpen: boolean = true;
    private openTimer: number = 10000;


    setView(uiElems: UiElements, go: UnityEngine.GameObject) {
        this.go = new GameObjectGetSet(go);
        this.txtName = new TextGetSet(uiElems.getText("txtName"));
        this.txtProgress = new TextGetSet(uiElems.getText('txtProgress'));
        Game.UIClickListener.Get(this.go.gameObject).onClick = delegate(this, this.onClickGoto)
    }


    private updatePanel() {
        let zhufuData = G.DataMgr.zhufuData;
        let seasonID = zhufuData.getSaiJiCur();
        if (seasonID == 0)
            return;
        let cfgs = zhufuData.getSaiJiCfgs(seasonID);
        if (!cfgs)
            return;
        this.txtName.text = cfgs[0].m_szSeasonname;
        this.txtProgress.text = uts.format("{0}/{1}", zhufuData.getSaiJiProgress(), zhufuData.Season_Max_WX_Count);
    }

   

    update() {
        if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_SAIJI_WAIXIAN)) {
            this.setActive(false);
            return;
        }

        let svrDay = G.SyncTime.getDateAfterStartServer();
        if (svrDay < Macros.SAIJI_START_DAY) {
            this.setActive(false);
            return;
        }

        let zhufuData = G.DataMgr.zhufuData;
        if (zhufuData.getSaiJiProgress() >= zhufuData.Season_Max_WX_Count) {
            this.setActive(false);
            return;
        }
        this.setActive(true);
        this.updatePanel();
    }

    private setActive(enable: boolean) {
        //this.go.SetActive(enable);
        this.go.SetActive(false);
    }

    private onClickGoto() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_SAIJI_WAIXIAN);
    }

}