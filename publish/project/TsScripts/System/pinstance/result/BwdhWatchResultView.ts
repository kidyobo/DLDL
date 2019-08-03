import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIUtils } from "System/utils/UIUtils";
import { BwdhStars } from 'System/kfjdc/view/BwdhStars'
import { List, ListItem } from 'System/uilib/List'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ElemFinder } from 'System/uilib/UiUtility'
import { KfjdcData } from 'System/data/KfjdcData'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { DropPlanData } from 'System/data/DropPlanData'
import { ReliveView } from 'System/main/view/ReliveView'

class BwdhWatchRoleItem extends ListItemCtrl {

    private head: UnityEngine.UI.Image;
    private textName: UnityEngine.UI.Text;
    private flag: UnityEngine.UI.Image;

    setComponents(go: UnityEngine.GameObject) {
        this.head = go.GetComponent(UnityEngine.UI.Image.GetType()) as UnityEngine.UI.Image;
        this.textName = ElemFinder.findText(go, 'textName');
        this.flag = ElemFinder.findImage(go, 'flag');
    }

    update(uin: number, name: string, prof: number, gender: number, status: number, headAltas: Game.UGUIAltas, statusAltas: Game.UGUIAltas) {
        if (uin == 0) {
            // 轮空
            this.head.enabled = false;
            this.textName.gameObject.SetActive(false);
        } else {
            this.head.enabled = true;
            this.head.sprite = headAltas.Get(prof + '_' + gender);
            this.textName.gameObject.SetActive(true);
            this.textName.text = name;
        }

        this.flag.sprite = statusAltas.Get(status.toString());
    }
}

export class BwdhWatchResultView extends CommonForm {

    private left = new BwdhWatchRoleItem();
    private right = new BwdhWatchRoleItem();

    private hdjl: UnityEngine.GameObject;
    private list: List;
    private icons: IconItem[] = [];

    private statusAltas: Game.UGUIAltas;
    private btnExit: UnityEngine.GameObject;

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Result;
    }

    protected resPath(): string {
        return UIPathData.BwdhWatchResultView;
    }

    protected initElements() {
        this.left.setComponents(this.elems.getElement('left'));
        this.right.setComponents(this.elems.getElement('right'));

        this.hdjl = this.elems.getElement('hdjl');
        this.list = this.elems.getUIList('list');

        this.statusAltas = this.elems.getElement('statusAltas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        this.btnExit = this.elems.getElement('btnExit');
    }

    protected initListeners() {
        this.addClickListener(this.btnExit, this.onClickBtnExit);
    }

    protected onOpen() {
        // 打开前先关掉复活面板
        G.Uimgr.closeForm(ReliveView);

        let players = G.DataMgr.kfjdcData.finalPlayerData;
        let resultInfo = G.DataMgr.kfjdcData.jjtzKfjdcFinalResult;
        let winUin = resultInfo.m_stWinRoleID.m_uiUin;
        let headAltas = G.AltasManager.roleHeadAltas;
        this.left.update(players.m_stLeftRoleID.m_uiUin, players.m_szLeftName, players.m_iLeftProf, players.m_iLeftGender, winUin == players.m_stLeftRoleID.m_uiUin ? 1 : 2, headAltas, this.statusAltas);
        this.right.update(players.m_stRightRoleID.m_uiUin, players.m_szRightName, players.m_iRightProf, players.m_iRightGender, winUin == players.m_stRightRoleID.m_uiUin ? 1 : 2, headAltas, this.statusAltas);

        let dropId = 0;
        let myUin = G.DataMgr.heroData.uin;
        if (myUin == winUin) {
            dropId = resultInfo.m_iWinDropID;
        } else if (myUin == resultInfo.m_stLostRoleID.m_uiUin) {
            dropId = resultInfo.m_iLostDropID;
        }

        if (dropId > 0) {
            this.hdjl.SetActive(true);
            let dropCfg = DropPlanData.getDropPlanConfig(dropId);
            this.list.Count = dropCfg.m_ucDropThingNumber;
            let oldIconCnt = this.icons.length;
            for (let i = 0; i < dropCfg.m_ucDropThingNumber; i++) {
                let icon: IconItem;
                if (i < oldIconCnt) {
                    icon = this.icons[i];
                } else {
                    this.icons[i] = icon = new IconItem();
                    icon.setTipFrom(TipFrom.normal);
                    icon.setUsuallyIcon(this.list.GetItem(i).gameObject);
                }
                icon.updateByDropThingCfg(dropCfg.m_astDropThing[i]);
                icon.updateIcon();
            }
            this.list.SetActive(true);
        } else {
            this.hdjl.SetActive(false);
            this.list.SetActive(false);
        }
    }

    protected onClose() {
    }

    private onClickBtnExit() {
        G.ModuleMgr.pinstanceModule.onClickQuitPinstance(true);
        this.close();
    }
}