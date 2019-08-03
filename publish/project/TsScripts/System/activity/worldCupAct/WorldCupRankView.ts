import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { Macros } from "System/protocol/Macros"
import { UIPathData } from 'System/data/UIPathData'
import { UnitCtrlType } from 'System/constants/GameEnum'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { List } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { ProtocolUtil } from "System/protocol/ProtocolUtil"
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { ThingData } from 'System/data/thing/ThingData'
import { UIUtils } from 'System/utils/UIUtils'
import { DataFormatter } from "System/utils/DataFormatter"
import { ActivityRuleView } from "System/diandeng/ActivityRuleView"
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'


class WorldCupRankListItem extends ListItemCtrl {
    private ranking: UnityEngine.UI.Text;
    private yuanbaoNum: UnityEngine.UI.Text;
    private name: UnityEngine.UI.Text;
    private bg: UnityEngine.GameObject;
    setComponents(go:UnityEngine.GameObject) {
        this.ranking = ElemFinder.findText(go,'ranking');
        this.yuanbaoNum = ElemFinder.findText(go, 'yuanbaoNum');
        this.name = ElemFinder.findText(go, 'name');
        this.bg = ElemFinder.findObject(go,'bg');
    }

    update(ranking:number,data: Protocol.WCupOneRankInfo) {
        this.ranking.text = ranking.toString();
        this.yuanbaoNum.text = data.m_uiReward.toString();
        this.name.text = data.m_szNickName;
        this.bg.SetActive(ranking%2!=0);
    }
}


export class WorldCupRankView extends CommonForm {
    private btnClose: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;
    private TextFight: UnityEngine.UI.Text;
    private sourceDes: UnityEngine.UI.Text;
    private rankList: List;

    private rankItems: WorldCupRankListItem[] = [];
    private TitleId: number = 1127;
    private maxRankNum: number = 20;
    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.WorldCupRankView;
    }

    protected initElements() {
        this.btnClose = this.elems.getElement('btnClose');
        this.mask = this.elems.getElement('mask');
        this.rankList = this.elems.getUIList('rankList');
        this.TextFight = this.elems.getText('TextFight');
        this.sourceDes = this.elems.getText('sourceDes');
    }

    protected initListeners() {
        this.addClickListener(this.btnClose, this.onClickBtnClose);
        this.addClickListener(this.mask, this.onClickBtnClose);
    }

    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_WORLDCUP, Macros.ACTIVITY_WORLDCUP_RANK));
        let titleData = G.DataMgr.titleData.getDataConfig(this.TitleId);
        this.sourceDes.text = titleData.m_szDesc;
       
        let data = G.DataMgr.activityData.worldCupRankData;
        if (data == null) return;
        this.TextFight.text = FightingStrengthUtil.calStrength(titleData.m_stPropAtt).toString();
        let length: number = data.m_ucNum <= 20 ? data.m_ucNum : 20;
        this.rankList.Count = length;
        for (let i = 0; i < length; i++){
            let item: WorldCupRankListItem = new WorldCupRankListItem();
            item.setComponents(this.rankList.GetItem(i).gameObject);
            item.update(i+1,data.m_astWCupRankInfo[i]);
        }
    }

    private onClickBtnClose(){
        this.close();
    }
}
