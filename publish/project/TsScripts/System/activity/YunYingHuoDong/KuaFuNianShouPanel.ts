
import { Global as G } from "System/global"
import { TabSubForm } from 'System/uilib/TabForm'
import { KeyWord } from 'System/constants/KeyWord'
import { UIPathData } from 'System/data/UIPathData'
import { DropPlanData } from 'System/data/DropPlanData'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { Macros } from "System/protocol/Macros"
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { NewYearActView } from 'System/activity/view/NewYearActView'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { UnitUtil } from 'System/utils/UnitUtil'
import { MonsterData } from 'System/data/MonsterData'
import { UIUtils } from 'System/utils/UIUtils'
import { DataFormatter } from "System/utils/DataFormatter"
import { ActivityRuleView } from "System/diandeng/ActivityRuleView"


export class KuaFuNianShouPanel extends TabSubForm {
    private btnGo: UnityEngine.GameObject;
    private DropIds: number[] = [60010314, 60010313];
    private time: UnityEngine.UI.Text; 
    private BossPos: UnityEngine.GameObject;
    private monsterData: GameConfig.MonsterConfigM;
    private actDes: UnityEngine.UI.Text;
    private btnRule: UnityEngine.GameObject;


    private readonly monsterId: number = 31530001;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_KUAFUHUODONGBOSS);
    }

    open() {
        super.open();
    }


    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.KuaFuNianShouPanel;
    }

    protected initElements() {

        this.btnGo = this.elems.getElement('btnGo');
        this.time = this.elems.getText('time');
        this.actDes = this.elems.getText('actDes');
        this.BossPos = this.elems.getElement('BossPos');
        this.btnRule = this.elems.getElement("btnRule");
        //this.BossPos.transform.localScale = new UnityEngine.Vector3(50, 50, 50);
        for (let i = 0; i < this.DropIds.length; i++) {
            let rewardList = this.elems.getUIList('rewardList' + (i + 1));
            let dropCfg = DropPlanData.getDropPlanConfig(this.DropIds[i]);
            let dropCnt = dropCfg.m_ucDropThingNumber;
            rewardList.Count = dropCnt;
            for (let i = 0; i < dropCfg.m_astDropThing.length; i++) {
                let iconItem = new IconItem();
                iconItem.setTipFrom(TipFrom.normal);
                iconItem.setUsuallyIcon(rewardList.GetItem(i).gameObject);
                iconItem.updateByDropThingCfg(dropCfg.m_astDropThing[i]);
                iconItem.updateIcon();
            }
        }

        this.monsterData = MonsterData.getMonsterConfig(this.monsterId);
        G.ResourceMgr.loadModel(this.BossPos, UnitUtil.getRealMonsterType(this.monsterData.m_ucModelFolder), this.monsterData.m_szModelID, this.sortingOrder, true);
    }

    protected initListeners() {
        this.addClickListener(this.btnGo, this.onClickBtnGo);
        this.addClickListener(this.btnRule, this.onClickBtnRule);
    }

    protected onOpen() {
        this.updateView();
        this.onCountDownTimer();
        this.addTimer("1", 1000, 0, this.onCountDownTimer);
    }

    updateView(): void {
       
        let status = G.DataMgr.activityData.getActivityStatus(Macros.ACTIVITY_ID_KFNS);
        if ((status.m_ucStatus == Macros.ACTIVITY_STATUS_RUNNING) && (G.DataMgr.activityData.newYearData.kfnsInfo.m_bBossAlive == 1)) {
            UIUtils.setGrey(this.btnGo, false, false);
            this.actDes.text = '活动进行中';
        }
        else {
            if (status.m_iNextTime == 0) {
                this.actDes.text = '活动已结束';
            }
            else {
                this.actDes.text = '下次活动时间： ' + TextFieldUtil.getColorText(DataFormatter.second2hhmm(status.m_iNextTime), Color.GREEN);
            }
            UIUtils.setGrey(this.btnGo, true, false);
            
        }
    }

    private onClickBtnGo() {    
        if (!G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_KFNS)) {
            G.TipMgr.addMainFloatTip('活动未开启');
            return;
        }
        else if (G.DataMgr.activityData.newYearData.kfnsInfo.m_bBossAlive == 0)
        {
            G.TipMgr.addMainFloatTip('本轮年兽已被消灭，请少侠下次准时前来');
            return;
        }
        G.ModuleMgr.kfModule.tryJoinKfAct(Macros.ACTIVITY_ID_KFNS, 0, 0);
        G.Uimgr.closeForm(NewYearActView);
    }


    private onCountDownTimer() {

        let now = Math.floor(G.SyncTime.getCurrentTime() / 1000);
        let data = G.DataMgr.activityData.newYearData.kfnsInfo;
        if (data == null)
            return;
        let time = Math.max(0, data.m_uiActEndTime - now);
        let status = G.DataMgr.activityData.getActivityStatus(Macros.ACTIVITY_ID_KFNS);
        if ((status.m_iNextTime == 0 && status.m_ucStatus != Macros.ACTIVITY_STATUS_RUNNING)||time <= 0)
        {
            this.time.text = '活动剩余时间：已结束';
            UIUtils.setButtonClickAble(this.btnGo, false);
            this.actDes.text = '活动已结束';
            
        }
        else
        {
            this.time.text = uts.format('活动剩余时间：{0}', DataFormatter.second2day(time));
        }
    }

    private onClickBtnRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(434), '玩法说明');
    }

}