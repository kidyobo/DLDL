import { Global as G } from 'System/global'
import { TabSubForm } from 'System/uilib/TabForm'
import { UIPathData } from 'System/data/UIPathData'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { List, ListItem } from 'System/uilib/List'
import { IconItem } from 'System/uilib/IconItem'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { UIUtils } from 'System/utils/UIUtils'
import { TipFrom } from 'System/tip/view/TipsView'
import { VipData } from 'System/data/VipData'
import { DropPlanData } from 'System/data/DropPlanData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { UnitCtrlType, EnumProductID } from 'System/constants/GameEnum'
import { VipView, VipTab } from 'System/vip/VipView'
import { FirstRechargeView } from 'System/activity/view/FirstRechargeView'
import { DataFormatter } from 'System/utils/DataFormatter'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { UIRoleAvatar } from 'System/unit/avatar/UIRoleAvatar'
import { ThingData } from 'System/data/thing/ThingData'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'

export class VipRewardView extends CommonForm {
    private level: number;
    static readonly MaxRewardNum: number = 4;
    static readonly imageCount: number = 3;


    private mask: UnityEngine.GameObject;
    private rewardRoot: UnityEngine.GameObject;
    private iconItem_Normal: UnityEngine.GameObject;
    private imgRoot: UnityEngine.GameObject;



    private dropThings: GameConfig.DropConfigM[] = [];
    private iconItems: IconItem[] = [];

    constructor() {
        super(0);
    }

    layer(): UILayer {
        //return UILayer.MessageBox;
        return UILayer.Pay;
    }
    protected resPath(): string {
        return UIPathData.VipRewardView;
    }

    open(level: number) {
        this.level = level;
        super.open();
    }
    protected initElements(): void {
        this.rewardRoot = this.elems.getElement("rewards");
        this.mask = this.elems.getElement("mask");
        this.iconItem_Normal = this.elems.getElement('itemIcon_Normal');
        this.imgRoot = this.elems.getElement("imgRoot");


    }
    protected initListeners(): void {
        this.addClickListener(this.mask, this.onCLickMask);

    }
    protected onOpen() {
        for (let i = 0; i < VipRewardView.imageCount; i++) {
            let img = ElemFinder.findObject(this.imgRoot, i.toString());
            if (i == this.level - 1) {
                img.SetActive(true);
            } else {
                img.SetActive(false);
            }
        }
        for (let i = 0; i < VipRewardView.MaxRewardNum; i++) {
            let iconItem = new IconItem();
            let iconRoot = ElemFinder.findObject(this.rewardRoot, i.toString());
            iconItem.setUsualIconByPrefab(this.iconItem_Normal, iconRoot);
            iconItem.setTipFrom(TipFrom.normal);
            this.iconItems.push(iconItem);
        }
        this.getRewardDatas();
        this.update(this.dropThings[this.level], this.level);
    }

    update(data: GameConfig.DropConfigM, level: number) {

        for (let i = 0; i < VipRewardView.MaxRewardNum; i++) {
            let dropThing = data.m_astDropThing[i];
            if (dropThing != null) {
                this.iconItems[i].updateByDropThingCfg(dropThing);
            } else {
                this.iconItems[i].updateById(0);
            }
            this.iconItems[i].updateIcon();
        }
    }

    private getRewardDatas() {

        this.dropThings.length = 0;
        let datas = G.DataMgr.vipData.getVipParaMaps(KeyWord.VIP_PARA_DAY_LOGIN_GIFT);
        datas.sort(this.sortVipData);
        for (let i = 0; i < datas.length; i++) {
            let dropId = datas[i].m_aiValue[0];
            if (dropId > 0) {
                let config: GameConfig.DropConfigM = DropPlanData.getDropPlanConfig(dropId);
                this.dropThings.push(config);
            }
        }
    }

    private sortVipData(a: GameConfig.VIPParameterConfigM, b: GameConfig.VIPParameterConfigM) {
        return a.m_ucPriType - b.m_ucPriType;
    }

    private onCLickMask() {
        this.close();
    }

}