import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { List, ListItem } from "System/uilib/List"
import { ElemFinder } from 'System/uilib/UiUtility'
import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { CompareUtil } from 'System/utils/CompareUtil'
import { RoleAbstract } from 'System/data/vo/RoleAbstract'
import { MenuPanelType } from 'System/main/view/RoleMenuView'


class QiuYuanListItem {

    private bg1: UnityEngine.GameObject;
    private bg2: UnityEngine.GameObject;
    private manIcon: UnityEngine.GameObject;
    private womenIcon: UnityEngine.GameObject;
    private nameText: UnityEngine.UI.Text;
    private profText: UnityEngine.UI.Text;
    private fightText: UnityEngine.UI.Text;
    private selectedRoleAbstrast: RoleAbstract = new RoleAbstract();
    private isMySelf: boolean = false;

    setCommonpents(obj: ListItem) {
        this.bg1 = obj.findObject('bg1');
        this.bg2 = obj.findObject('bg2');
        this.nameText = obj.findText('nameText');
        this.profText = obj.findText('profText');
        this.fightText = obj.findText('fightText');
        this.womenIcon = obj.findObject('womenIcon');
        this.manIcon = obj.findObject('manIcon');
        obj.OnClick = delegate(this, this.onClickListItem);
    }

    update(index: number, data: Protocol.RoleInfo) {
        let info = data.m_stBaseProfile;
        let activeBg: boolean = index % 2 == 0;
        this.bg1.SetActive(activeBg);
        this.bg2.SetActive(!activeBg);
        let activeMale: boolean = info.m_cGender == KeyWord.GENDERTYPE_BOY;
        this.manIcon.SetActive(activeMale);
        this.womenIcon.SetActive(!activeMale);
        this.nameText.text = info.m_szNickName;
        this.fightText.text = data.m_stUnitInfo.m_stUnitAttribute.m_allValue[Macros.EUAI_FIGHT].toString();
        this.profText.text = KeyWord.getDesc(KeyWord.GROUP_PROFTYPE, info.m_cProfession);
        this.selectedRoleAbstrast.adaptFromRoleInfo(data);
        this.isMySelf = CompareUtil.isRoleIDEqual(G.DataMgr.heroData.roleID, data.m_stID);    
    }

    private onClickListItem() {
        if (this.isMySelf) {
            G.TipMgr.addMainFloatTip('不能对自己进行菜单操作');
            return;
        }
        if (G.DataMgr.heroData.curVipLevel < 3) {
            G.TipMgr.addMainFloatTip('达到VIP3才能查看求缘人物信息');
            return;
        }
        G.ViewCacher.roleMenuView.open(this.selectedRoleAbstrast, MenuPanelType.fromMarryQiuYuan);
    }
}


export class MarryQiuYuanRecordView extends CommonForm {

    private btn_QiuYuan: UnityEngine.GameObject;
    private list: List;
    private listItems: QiuYuanListItem[] = [];
    private isInQiuYuanList: boolean = false;
    private btn_Order: UnityEngine.GameObject;
    private listData: Protocol.RoleInfo[];

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    open() {
        super.open();
    }

    layer(): UILayer {
        return UILayer.Chat;
    }

    protected resPath(): string {
        return UIPathData.MarryQiuYuanRecordView;
    }

    protected initElements() {
        this.btn_QiuYuan = this.elems.getElement('btn_qiuYuan');
        this.list = this.elems.getUIList('list');
        this.btn_Order = this.elems.getElement('btn_order');
    }

    protected initListeners() {
        this.addClickListener(this.elems.getElement('mask'), this.close);
        this.addClickListener(this.elems.getElement('btnClose'), this.close);
        this.addClickListener(this.btn_QiuYuan, this.onClickBtnQiuYuan);
        this.addClickListener(this.btn_Order, this.onClickBtnOrder);
    }


    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMarryRequest(Macros.HY_QIUYUAN_PANEL));
    }


    protected onClose() {

    }

    private onClickBtnQiuYuan() {
        if (G.DataMgr.heroData.mateName != '') {
            G.TipMgr.addMainFloatTip("您已经结婚了,不能求缘");
            return;
        }
        if (this.listData != null && this.listData.length > Macros.MAX_HY_QIUYUAN_INFO_NUM) {
            G.TipMgr.addMainFloatTip("求缘已经达到最大人数，请稍后再来");
            return;
        }
        if (this.isInQiuYuanList) {
            G.TipMgr.addMainFloatTip("您已经在求缘列表了");
            return;
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getMarryRequest(Macros.HY_QIUYUAN_REGIST));
    }

    private onClickBtnOrder() {
        if (this.listData != null) {
            this.listData = this.listData.sort(this.sortQiuYuanListByFight);
        }
        this.updateView(this.listData, true);
    }


    updateView(data: Protocol.RoleInfo[], isSkipSortByTime: boolean = false) {
               
        if (!isSkipSortByTime) {
            data = data.sort(this.sortQiuYuanListByTime);
        }
        this.listData = data;
        this.isInQiuYuanList = false;
        this.list.Count = this.listData.length;
        for (let i = 0; i < this.listData.length; i++) {
            let item = this.getQiuYuanListItem(i, this.list.GetItem(i));
            item.update(i, this.listData[i]);
            if (CompareUtil.isRoleIDEqual(G.DataMgr.heroData.roleID, this.listData[i].m_stID)) {
                this.isInQiuYuanList = true;
            }
        }
    }


    private sortQiuYuanListByTime(a: Protocol.RoleInfo, b: Protocol.RoleInfo) {
        return a.m_uiIdentityFlag - b.m_uiIdentityFlag;
    }


    private sortQiuYuanListByFight(a: Protocol.RoleInfo, b: Protocol.RoleInfo) {
        let fightA = a.m_stUnitInfo.m_stUnitAttribute.m_allValue[Macros.EUAI_FIGHT];
        let fightB = b.m_stUnitInfo.m_stUnitAttribute.m_allValue[Macros.EUAI_FIGHT];
        return fightB - fightA;
    }



    private getQiuYuanListItem(index: number, obj: ListItem): QiuYuanListItem {
        if (index < this.listItems.length) {
            return this.listItems[index];
        } else {
            let item = new QiuYuanListItem();
            item.setCommonpents(obj);
            this.listItems.push(item);
            return item;
        }
    }


}