import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { List, ListItem } from 'System/uilib/List'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { ResUtil } from 'System/utils/ResUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { BossView } from 'System/pinstance/boss/BossView'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { UnitStatus } from "System/utils/UnitStatus"
import { TextFieldUtil } from "System/utils/TextFieldUtil"
import { Color } from "System/utils/ColorUtil"


enum KillPanelType {
    none,
    tianmingbang,
    killOther,
    beKilled
}

class KillTipItem extends ListItemCtrl {
    private textTime: UnityEngine.UI.Text;
    private textScene: UnityEngine.UI.Text;
    private textName: UnityEngine.UI.Text;
    private txtStatus: UnityEngine.UI.Text;
    private btnFuChou: UnityEngine.GameObject;
    private bg1: UnityEngine.GameObject;
    private bg2: UnityEngine.GameObject;


    private roleId: Protocol.RoleID;
    private panelType: KillPanelType;

    setComponents(go: UnityEngine.GameObject) {
        this.textTime = ElemFinder.findText(go, 'textTime');
        this.textScene = ElemFinder.findText(go, 'textScene');
        this.textName = ElemFinder.findText(go, 'textName');
        this.txtStatus = ElemFinder.findText(go, 'btnFuChou/txtStatus');
        this.btnFuChou = ElemFinder.findObject(go, 'btnFuChou');
        this.bg1 = ElemFinder.findObject(go, 'bg1');
        this.bg2 = ElemFinder.findObject(go, 'bg2');

        Game.UIClickListener.Get(this.btnFuChou).onClick = delegate(this, this.onClickFuChou);

    }

    update(notify: Protocol.CSBeKilled_Notify, index: number, panelType: KillPanelType) {
        this.panelType = panelType;

        let killContent: string;
        let name: string;
        let scene: string;
        if (Macros.KILLED_TYPE_FST == notify.m_iType) {
            // 封神台被杀
            scene = '竞技场';
            name = notify.m_szRoleName;
            this.roleId = notify.m_stKillerID;
        }
        else if (Macros.KILLED_TYPE_KFFST == notify.m_iType) {
            // 跨服封神台被杀
            scene = '跨服竞技场';
            name = uts.format('{0}服.{1}', notify.m_shWorldID, name);
            this.roleId = notify.m_stKillerID;
        }
        else {
            scene = G.DataMgr.sceneData.getSceneName(notify.m_iSceneID);
            if (notify.m_szBeRoleName == G.DataMgr.heroData.name) {
                // 被杀
                name = notify.m_szRoleName;
                this.roleId = notify.m_stKillerID;
                this.txtStatus.text = "复仇";
            }
            else {
                // 击杀别人
                name = notify.m_szBeRoleName;
                this.txtStatus.text = "击杀";
                this.roleId = notify.m_stBeKillerID;
            }
        }

        this.bg1.SetActive(index % 2 == 0);
        this.bg2.SetActive(index % 2 == 1);


        if (this.panelType == KillPanelType.tianmingbang) {
            this.textTime.text = DataFormatter.second2mmddhhmm(notify.m_iTime);
            this.textScene.text = scene;
            this.textName.text = name;
            return;
        }

        let roleCtrl = G.UnitMgr.getRoleByUIN(this.roleId.m_uiUin);
        if (roleCtrl) {
            this.textTime.text = DataFormatter.second2mmddhhmm(notify.m_iTime);
            this.textScene.text = scene;
            this.textName.text = name;
        } else {
            this.textTime.text = TextFieldUtil.getColorText(DataFormatter.second2mmddhhmm(notify.m_iTime), Color.GREY);
            this.textScene.text = TextFieldUtil.getColorText(scene, Color.GREY);
            this.textName.text = TextFieldUtil.getColorText(name, Color.GREY);
        }

    }

    private onClickFuChou() {

        if (this.panelType == KillPanelType.tianmingbang) {
            G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_TIANMINGBANG);
            let killtipview = G.Uimgr.createForm<KillTipView>(KillTipView);
            if (killtipview != null && killtipview.isOpened)
                killtipview.close();
            return;
        }

        let roleCtrl = G.UnitMgr.getRoleByUIN(this.roleId.m_uiUin);
        if (roleCtrl) {
            if (UnitStatus.isDead(roleCtrl.Data.unitStatus)) {
                G.TipMgr.addMainFloatTip(" 玩家已经死亡！");
            } else {
                G.UnitMgr.selectUnit(roleCtrl.Data.unitID, false);
                G.UnitMgr.hero.attackAuto();
            }
        } else {
            G.TipMgr.addMainFloatTip("玩家不在视野范围内!");
        }

    }

}

export class KillTipView extends CommonForm {
    private mask: UnityEngine.GameObject;
    private btnClose: UnityEngine.GameObject;

    private textTitle: UnityEngine.UI.Text;
    private list: List;
    private items: KillTipItem[] = [];

    private btnClear: UnityEngine.GameObject;

    private openNotifies: Protocol.CSBeKilled_Notify[];

    /**这个界面的类型界面*/
    private killPanelType: KillPanelType;

    constructor() {
        super(0);
    }
    layer(): UILayer {
        return UILayer.OnlyTip;
    }
    protected resPath(): string {
        return UIPathData.KillTipView;
    }
    protected initElements(): void {
        this.mask = this.elems.getElement('mask');
        this.btnClose = this.elems.getElement('btnClose');
        this.btnClear = this.elems.getElement('btnClear');

        this.textTitle = this.elems.getText('textTitle');
        this.list = this.elems.getUIList('list');
    }
    protected initListeners(): void {
        this.addClickListener(this.mask, this.onClickBtnClose);
        this.addClickListener(this.btnClose, this.onClickBtnClose);
        this.addClickListener(this.btnClear, this.onClickBtnClear);
    }

    protected onOpen() {
        let cnt = this.openNotifies.length;
        let notify = this.openNotifies[0];
        let title: string;
        let isShow = false;
        if (Macros.KILLED_TYPE_FST == notify.m_iType) {
            // 封神台被杀
            title = uts.format('您有{0}条竞技场被击败记录', cnt);
            this.killPanelType = KillPanelType.tianmingbang;
        }
        else if (Macros.KILLED_TYPE_KFFST == notify.m_iType) {
            // 跨服封神台被杀
            title = uts.format('您有{0}条跨服竞技场被击败记录', cnt);
            this.killPanelType = KillPanelType.tianmingbang;
        }
        else {
            if (notify.m_szBeRoleName == G.DataMgr.heroData.name) {
                // 被杀
                title = uts.format('您有{0}条被击杀记录', cnt);
                this.killPanelType = KillPanelType.beKilled;
                isShow = true;
            }
            else {
                // 击杀别人
                title = uts.format('您有{0}条击杀记录', cnt);
                this.killPanelType = KillPanelType.killOther;
                isShow = true;
            }
        }
        this.textTitle.text = title;

        this.btnClear.SetActive(isShow);


        this.openNotifies.sort(delegate(this, this.sortPlayer));


        this.list.Count = cnt;
        let oldItemCnt = this.items.length;
        for (let i = 0; i < cnt; i++) {
            let item: KillTipItem;
            if (i < oldItemCnt) {
                item = this.items[i];
            } else {
                this.items.push(item = new KillTipItem());
                item.setComponents(this.list.GetItem(i).gameObject);
            }
            item.update(this.openNotifies[i], i, this.killPanelType);
        }
    }

    protected onClose() {
    }

    open(notifies: Protocol.CSBeKilled_Notify[]) {
        this.openNotifies = notifies;
        super.open();
    }

    private onClickBtnClose() {
        this.close();
    }

    private onClickBtnClear() {
        if (this.killPanelType == KillPanelType.beKilled) {
            G.DataMgr.heroData.clearKillMeRole();
            G.NoticeCtrl.checkNormalKilled();
        } else if (this.killPanelType == KillPanelType.killOther) {
            G.DataMgr.heroData.clearMyKillRole();
            G.NoticeCtrl.checkHasNormalKill();
        }
        this.close();
    }

    private sortPlayer(a: Protocol.CSBeKilled_Notify, b: Protocol.CSBeKilled_Notify) {

        let aUin = 0;
        let bUin = 0;
        if (this.killPanelType == KillPanelType.beKilled) {
            aUin = a.m_stKillerID.m_uiUin;
            bUin = b.m_stKillerID.m_uiUin;
        } else {
            aUin = a.m_stBeKillerID.m_uiUin;
            bUin = b.m_stBeKillerID.m_uiUin;
        }

        let roleCtrlA = G.UnitMgr.getRoleByUIN(aUin);
        let roleCtrlB = G.UnitMgr.getRoleByUIN(bUin);

        let statusA = 0;
        if (roleCtrlA) {
            statusA = 1;
        }

        let statusB = 0;
        if (roleCtrlB) {
            statusB = 1;
        }

        if (statusA != statusB) {
            return statusB - statusA;
        }
        return aUin - bUin;
    }
}