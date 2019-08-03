import { KeyWord } from "System/constants/KeyWord";
import { DropPlanData } from "System/data/DropPlanData";
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { MergePanelBase, MergeRewardBase } from "System/mergeActivity/MergePanelBase";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { Color } from "System/utils/ColorUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { UIUtils } from "System/utils/UIUtils";



class MergeLJCZItem extends MergeRewardBase {

    private gotoPay: boolean = false;
    private ljczConfig: GameConfig.HFLJCZCfgM;

    setComponent(go: UnityEngine.GameObject, count: number) {
        super.setComponent(go, count);
        Game.UIClickListener.Get(this.btnGetReward).onClick = delegate(this, this.onClickGetReward);
        Game.UIClickListener.Get(this.btnGoto).onClick = delegate(this, this.onClickGoTO);
    }

    update(lcConfig: GameConfig.HFLJCZCfgM, config: GameConfig.DropConfigM) {
        this.titleImg2.SetActive(true);
        this.ljczConfig = lcConfig;
        for (let i = 0; i < config.m_ucDropThingNumber; i++) {
            this.iconItems[i].updateById(config.m_astDropThing[i].m_iDropID, config.m_astDropThing[i].m_uiDropNumber);
            this.iconItems[i].updateIcon();
        }
        let hfljcz = G.DataMgr.hfhdData.hfljcz;
        let btnStatus = (1 << (lcConfig.m_iID - 1) & hfljcz.m_ucGetBitMap) > 0;

        if (btnStatus) {
            this.txtBtn.text = "已领取";
            UIUtils.setButtonClickAble(this.btnGetReward, false);
            this.btnGetReward.SetActive(true);
            this.btnGoto.SetActive(false);
        } else {
            if (hfljcz.m_uiLJZCValue >= lcConfig.m_uiRechargeLimit) {
                this.txtBtn.text = "可领取";
                UIUtils.setButtonClickAble(this.btnGetReward, true);
                this.btnGetReward.SetActive(true);
                this.btnGoto.SetActive(false);
            } else {
                this.txtBtn.text = "前往达成";
                UIUtils.setButtonClickAble(this.btnGetReward, true);
                this.gotoPay = true;
                this.btnGetReward.SetActive(false);
                this.btnGoto.SetActive(true);
            }
        }

        this.txtCondition.text = lcConfig.m_uiRechargeLimit + '元宝';

    }

    dispose() {
        super.dispose();
    }

    private onClickGetReward() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHfhdRequest(Macros.HFHD_GET_LJCZ_REWARD, this.ljczConfig.m_iID));
    }


    private onClickGoTO() {
        G.ActionHandler.go2Pay();
    }
}



export class MergeThreeDayLeiChongPanel extends MergePanelBase {

    private mergeLJCZItems: MergeLJCZItem[] = [];

    constructor() {
        super(KeyWord.OTHER_FUNCTION_HFHD_3DAYLEICHONG);
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
        this.type2.SetActive(true);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHfhdRequest(Macros.HFHD_LJCZ_OPEN_PANEL));
    }

    protected onClose() {
    }


    onServerOverDay() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHfhdRequest(Macros.HFHD_LJCZ_OPEN_PANEL));
    }

    updatePanel() {
        let hfhdData = G.DataMgr.hfhdData;
        this.txtContent.text = "累计充值：" + TextFieldUtil.getColorText(hfhdData.hfljcz.m_uiLJZCValue + "钻石", Color.GREEN, 22);
        let cfgs: GameConfig.HFLJCZCfgM[] = hfhdData.getHFLJCZCCfgs();
        this.list.Count = cfgs.length;
        for (let i = 0; i < this.list.Count; i++) {
            let dropConfig = DropPlanData.getDropPlanConfig(cfgs[i].m_uiDropID);
            if (this.mergeLJCZItems[i] == null) {
                let item = this.list.GetItem(i);
                this.mergeLJCZItems[i] = new MergeLJCZItem();

                this.mergeLJCZItems[i].setComponent(item.gameObject, dropConfig.m_ucDropThingNumber);
            }
            this.mergeLJCZItems[i].update(cfgs[i], dropConfig);
        }
    }

}