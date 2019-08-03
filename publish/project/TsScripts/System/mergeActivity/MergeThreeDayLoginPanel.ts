import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { DataFormatter } from 'System/utils/DataFormatter'
import { HfhdData } from 'System/mergeActivity/HfhdData'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { MergePanelBase, MergeRewardBase } from 'System/mergeActivity/MergePanelBase'


class MergeSignItem extends MergeRewardBase {

    private mergeTime: number = 0;
    private config: GameConfig.HFSevenSignActCfgM;

    setComponent(go: UnityEngine.GameObject, count: number) {
        super.setComponent(go, count);

        Game.UIClickListener.Get(this.btnGetReward).onClick = delegate(this, this.onClickGetReward);
    }

    update(config: GameConfig.HFSevenSignActCfgM) {
        this.titleImg1.SetActive(true);
        this.mergeTime = G.SyncTime.getDateAfterMergeServer();
        this.config = config;
        for (let i = 0; i < config.m_uiItemCount; i++) {
            this.iconItems[i].updateById(config.m_stItemList[i].m_uiItemID, config.m_stItemList[i].m_uiItemCount);
            this.iconItems[i].updateIcon();
        }
        let qtdl = G.DataMgr.hfhdData.qtdl;
        let btnStatus = (1 << (config.m_iID - 1) & qtdl.m_iSignFlag) > 0;
        if (btnStatus) {
            this.txtBtn.text = "已领取";
            UIUtils.setButtonClickAble(this.btnGetReward, false);
             
        } else {
            if (this.mergeTime == config.m_iID && this.mergeTime != 4) {
                this.txtBtn.text = "可领取";
                UIUtils.setButtonClickAble(this.btnGetReward, true);
            }
            else if (config.m_iID == 4 && qtdl.m_iSignFlag == 7) {
                this.txtBtn.text = "可领取";
                UIUtils.setButtonClickAble(this.btnGetReward, true);
            }
            else {
                this.txtBtn.text = "未达成";
                UIUtils.setButtonClickAble(this.btnGetReward, false);
            }
        }

        if (config.m_iID != 4) {
            this.txtCondition.text = "第" + config.m_iID + "天签到";
        } else {
            this.txtCondition.text = "连续3天签到";
        }
        
    }

    dispose() {
        super.dispose();
    }

    private onClickGetReward() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHfhdRequest(Macros.HFHD_GET_QTDL_REWARD, this.config.m_iID));
    }

}


//合服3天登陆
export class MergeThreeDayLoginPanel extends MergePanelBase {

    private items: MergeSignItem[] = [];
    private mergeRewardItems: MergeSignItem[] = [];

    constructor() {
        super(KeyWord.OTHER_FUNCTION_HFHD_3DAYSIGN);
    }

    protected resPath(): string {
        return UIPathData.MergeRewardView;
    }

    protected initElements() {
        super.initElements();
    }

    protected initListeners() {
        super.initListeners();
    }

    protected onOpen() {
        super.onOpen();
        this.type1.SetActive(true);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHfhdRequest(Macros.HFHD_QTDL_OPEN_PANEL));
    }

    protected onClose() {

    }

    updatePanel(): void {

        let hfhdData = G.DataMgr.hfhdData;
        let cfgs: GameConfig.HFSevenSignActCfgM[] = hfhdData.getHFSevenSignActCfgs();

        this.list.Count = cfgs.length;
        for (let i = 0; i < this.list.Count; i++) {
            if (this.mergeRewardItems[i] == null) {
                let item = this.list.GetItem(i);
                this.mergeRewardItems[i] = new MergeSignItem();
                this.mergeRewardItems[i].setComponent(item.gameObject, cfgs[i].m_uiItemCount);
            }
            this.mergeRewardItems[i].update(cfgs[i]);
        }

    }


}