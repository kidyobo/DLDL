import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { EnumMarriage } from 'System/constants/GameEnum'
import { ElemFinder } from 'System/uilib/UiUtility'
import { IconItem } from 'System/uilib/IconItem'
import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { TipFrom } from 'System/tip/view/TipsView'


export class AcceptMarryView extends CommonForm {

    private m_level: number = 0;
    private thingIds: number[] = [EnumMarriage.RING_1, EnumMarriage.RING_2, EnumMarriage.RING_3];
    private max_rewardTypes: number = 3;
    private showIds: number[] = [];
    private btn_accept: UnityEngine.GameObject;
    private btn_refuse: UnityEngine.GameObject;
    private listRoot: UnityEngine.GameObject;
    private listRewads: UnityEngine.GameObject[] = [];
    private iconItem_Normal: UnityEngine.GameObject;
    private m_type = Macros.HY_DEAL_MARRY;
    /**目标id*/
    private m_target: Protocol.RoleID;
    private roleNameText: UnityEngine.UI.Text;
    private iconItems: IconItem[] = [];

    constructor() {
        super(0);
    }

    open(level: number) {
        this.m_level = level;
        super.open();
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.AcceptMarryView;
    }

    protected initElements() {
        this.roleNameText = this.elems.getText('roleName');
        this.iconItem_Normal = this.elems.getElement('itemIcon_Normal');
        this.btn_accept = this.elems.getElement('btn_accept');
        this.btn_refuse = this.elems.getElement('btn_kaolv');
        this.listRoot = this.elems.getElement('listRewards');
        for (let i = 0; i < this.max_rewardTypes; i++) {
            let obj = ElemFinder.findObject(this.listRoot, i.toString());
            this.listRewads.push(obj);
        }
    }

    protected initListeners() {
        this.addClickListener(this.btn_accept, this.onClickbtnAcceptMarry);
        this.addClickListener(this.btn_refuse, this.onClickbtnRefuseMarry);
    }

    protected onOpen() {
        this.updateView(this.m_level);
    }


    protected onClose() {
    }

    updateView(level: number) {
        this.showIds = [];
        for (let i = 0; i < this.max_rewardTypes; i++) {
            let para: number = 1 << (i + 1);
            if (level & para) {
                this.showIds.push(this.thingIds[i]);
            }
        }
        for (let index = 0; index < this.max_rewardTypes; index++) {
            let obj = this.listRewads[index];
            if (index < this.showIds.length) {
                obj.SetActive(true);
                let iconItem: IconItem;
                if (index < this.iconItems.length) {
                    iconItem = this.iconItems[index];
                } else {
                    let iconRoot = ElemFinder.findObject(obj, 'iconRoot');
                    iconItem = new IconItem();
                    iconItem.setTipFrom(TipFrom.normal);
                    iconItem.setUsualIconByPrefab(this.iconItem_Normal, iconRoot);
                    this.iconItems.push(iconItem);
                }
                iconItem.updateById(this.showIds[index], 1);
                iconItem.updateIcon();
            } else {
                obj.SetActive(false);
            }
        }
        let teamData = G.DataMgr.teamData;
        if (teamData.memberList.length > 0) {
            this.m_target = teamData.memberList[0].m_stRoleID;
        }
        this.roleNameText.text = uts.format("{0}带着以下聘礼向您求婚了,简直诚意满满", teamData.memberList[0].m_szNickName);
    }


    private onClickbtnAcceptMarry() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMarryRequest(this.m_type, this.m_target, 1));
        this.close();
    }


    private onClickbtnRefuseMarry() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMarryRequest(this.m_type, this.m_target, 0));
        this.close();
    }


}
