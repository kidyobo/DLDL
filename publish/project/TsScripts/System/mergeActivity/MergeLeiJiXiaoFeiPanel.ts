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
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { DropPlanData } from 'System/data/DropPlanData'
import { PayView } from 'System/pay/PayView'
import { MallView } from 'System/business/view/MallView'
import { EnumStoreID } from 'System/constants/GameEnum'
import { MergePanelBase, MergeRewardBase } from 'System/mergeActivity/MergePanelBase'


class MergeLJXFItem extends MergeRewardBase {

    private gotoPay: boolean = false;
    private ljxfConfig: GameConfig.HFLJXFCfgM;

    setComponent(go: UnityEngine.GameObject, count: number) {
        super.setComponent(go, count);
        Game.UIClickListener.Get(this.btnGetReward).onClick = delegate(this, this.onClickGetReward);
        Game.UIClickListener.Get(this.btnGoto).onClick = delegate(this, this.onClickGoTo);
    }

    update(lcConfig: GameConfig.HFLJXFCfgM, config: GameConfig.DropConfigM) {
        this.titleImg3.SetActive(true);
        this.ljxfConfig = lcConfig;
        for (let i = 0; i < config.m_ucDropThingNumber; i++) {
            this.iconItems[i].updateById(config.m_astDropThing[i].m_iDropID, config.m_astDropThing[i].m_uiDropNumber);
            this.iconItems[i].updateIcon();
        }
        let hfljcz = G.DataMgr.hfhdData.hfljxf;

        let btnStatus = (1 << (lcConfig.m_iID - 1) & hfljcz.m_ucGetBitMap) > 0;

        if (btnStatus) {
            this.txtBtn.text = "已领取";
            UIUtils.setButtonClickAble(this.btnGetReward, false);
            this.btnGoto.SetActive(false);
            this.btnGetReward.SetActive(true);
        } else {
            if (hfljcz.m_uiLJXFValue >= lcConfig.m_uiConsumeLimit) {
                this.txtBtn.text = "可领取";
                UIUtils.setButtonClickAble(this.btnGetReward, true);
                this.btnGoto.SetActive(false);
                this.btnGetReward.SetActive(true);
            } else {
                this.txtBtn.text = "前往达成";
                this.gotoPay = true;
                this.btnGoto.SetActive(true);
                this.btnGetReward.SetActive(false);
            }
        }

        this.txtCondition.text = lcConfig.m_uiConsumeLimit + '元宝';

    }

    dispose() {
        super.dispose();
    }

    private onClickGetReward() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHfhdRequest(Macros.HFHD_GET_LJXF_REWARD, this.ljxfConfig.m_iID));
    }

    private onClickGoTo() {
        G.Uimgr.createForm<MallView>(MallView).open(EnumStoreID.MALL_YUANBAO);
    }
}



export class MergeLeiJiXiaoFeiPanel extends MergePanelBase {

    private mergeLJCZItems: MergeLJXFItem[] = [];

    constructor() {
        super(KeyWord.OTHER_FUNCTION_HFHD_3DAYXIAOFEI);
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
        this.type3.SetActive(true);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHfhdRequest(Macros.HFHD_LJXF_OPEN_PANEL));
    }

    protected onClose() {
    }


    updatePanel() {
        let hfhdData = G.DataMgr.hfhdData;
        this.txtContent.text = "累计消费：" + TextFieldUtil.getColorText(hfhdData.hfljxf.m_uiLJXFValue + "钻石", Color.GREEN, 22);;
        let cfgs: GameConfig.HFLJXFCfgM[] = hfhdData.getHFXFCfgs();
        this.list.Count = cfgs.length;
        for (let i = 0; i < this.list.Count; i++) {
            let dropConfig = DropPlanData.getDropPlanConfig(cfgs[i].m_uiDropID);
            if (this.mergeLJCZItems[i] == null) {
                let item = this.list.GetItem(i);
                this.mergeLJCZItems[i] = new MergeLJXFItem();

                this.mergeLJCZItems[i].setComponent(item.gameObject, dropConfig.m_ucDropThingNumber);
            }
            this.mergeLJCZItems[i].update(cfgs[i], dropConfig);
        }
    }


}