import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIUtils } from "System/utils/UIUtils";
import { List, ListItem } from 'System/uilib/List'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ElemFinder } from 'System/uilib/UiUtility'
import { KfjdcData } from 'System/data/KfjdcData'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { DropPlanData } from 'System/data/DropPlanData'
import { ReliveView } from 'System/main/view/ReliveView'

class ChallengeAgainItem extends ListItemCtrl {

    private headImg: UnityEngine.UI.Image;
    private txtName: UnityEngine.UI.Text;
    private txtWaiting: UnityEngine.UI.Text;
    private confirm: UnityEngine.GameObject
    private goOut: UnityEngine.GameObject

    setComponents(go: UnityEngine.GameObject) {
        this.headImg = ElemFinder.findImage(go, 'headImg');
        this.txtName = ElemFinder.findText(go, 'txtName');
        this.txtWaiting = ElemFinder.findText(go, 'txtWaiting');
        this.confirm = ElemFinder.findObject(go, 'confirm');
        this.goOut = ElemFinder.findObject(go, 'goOut');
    }

    update(data: Protocol.GroupPinEnterAgainOne) {
        this.headImg.sprite = G.AltasManager.roleHeadAltas.Get(uts.format('{0}_{1}', data.m_iProf, data.m_iGender));
        this.txtName.text = data.m_szName;
         //0未准备1确认2退出
        this.confirm.SetActive(data.m_iStatus == 1);
        let str: string;
        switch (data.m_iStatus) {
            case 0:
                str = "确认中...";
                this.updateTipImg(false, false);
                break 
            case 1:
                str = "";
                this.updateTipImg(true, false);
                break;
            case 2:
                str = "";
                this.updateTipImg(false, true);
                break;
        }
        this.txtWaiting.text = str;

    }

    private updateTipImg(confirmEnabel: boolean, goOutEnabel: boolean) {
        this.confirm.SetActive(confirmEnabel);
        this.goOut.SetActive(goOutEnabel);
    }

}

export class ChallengeAgainConfrimView extends CommonForm {

    private roleList: List;

    private ChallengeAgainItem: ChallengeAgainItem[] = [];

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Result;
    }

    protected resPath(): string {
        return UIPathData.ChallengeAgainConfrimView;
    }

    protected initElements() {
        this.roleList = this.elems.getUIList('roleList');
    }

    protected initListeners() {
        this.addClickListener(this.elems.getElement("mask"), this.close);
        this.addClickListener(this.elems.getElement("btnClose"), this.close);
    }

    protected onOpen() {
        this.updataPanel();
    }

    protected onClose() {

    }

    updataPanel() {
        let info = G.DataMgr.pinstanceData.groupPinEnterAgain;
        if (info) {
            this.roleList.Count = info.m_iCount;
            for (let i = 0; i < this.roleList.Count; i++) {
                if (this.ChallengeAgainItem[i] == null) {
                    let item = this.roleList.GetItem(i).gameObject;
                    this.ChallengeAgainItem[i] = new ChallengeAgainItem();
                    this.ChallengeAgainItem[i].setComponents(item);
                }
                this.ChallengeAgainItem[i].update(info.m_stList[i]);
            }
        }
    }

}