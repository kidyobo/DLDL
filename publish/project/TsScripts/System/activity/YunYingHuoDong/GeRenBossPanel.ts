import { Global as G } from "System/global"
import { TabSubForm } from 'System/uilib/TabForm'
import { KeyWord } from 'System/constants/KeyWord'
import { UIPathData } from 'System/data/UIPathData'
import { DropPlanData } from 'System/data/DropPlanData'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { MonsterData } from 'System/data/MonsterData'
import { UnitUtil } from 'System/utils/UnitUtil'
import { ProtocolUtil } from "System/protocol/ProtocolUtil"
import { Macros } from "System/protocol/Macros"
import { UIUtils } from 'System/utils/UIUtils'
import { NewYearActView } from 'System/activity/view/NewYearActView'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { DataFormatter } from "System/utils/DataFormatter";

export class GeRenBossPanel extends TabSubForm {
    private btnGo: UnityEngine.GameObject;
    private DropIds: number[] = [60010302, 60010303];
    private monsterData: GameConfig.MonsterConfigM;
    private BossPos: UnityEngine.GameObject;
    private enterNum: UnityEngine.UI.Text;
    private time: UnityEngine.UI.Text;

    private readonly monsterId: number = 31530002;
    private readonly pinstanceId: number = 300085;
    private readonly totleEnterNum = 5;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_GERENHUODONGBOSS);
    }

    open() {
        super.open();
    }

    protected resPath(): string {
        return UIPathData.GeRenBossPanel;
    }

    protected initElements() {
        this.BossPos = this.elems.getElement('BossPos');
        this.btnGo = this.elems.getElement('btnGo');
        this.enterNum = this.elems.getText('enterNum');
        this.time = this.elems.getText('time');
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
    }

    protected onOpen() {
        let finishNum = G.DataMgr.systemData.getFinishTime(this.pinstanceId);
        let hasEnterNum = this.totleEnterNum - finishNum;
        this.enterNum.text = '剩余次数 : ' + TextFieldUtil.getColorText(hasEnterNum.toString(), Color.GREEN);

        if (hasEnterNum <= 0)
        {
            UIUtils.setButtonClickAble(this.btnGo, false);
            this.enterNum.text = '次数用完';
        }

        this.onCountDownTimer();
        this.addTimer("1", 1000, 0, this.onCountDownTimer);
    }

    updateView(): void {
    }

    private onClickBtnGo()
    {

        if (!G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_GRBOSS)) {
            G.TipMgr.addMainFloatTip('活动未开启');
            return;
        }

        G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_GRBOSS);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getListActivityLimitRequest());
        G.Uimgr.closeForm(NewYearActView);
    }


    private onCountDownTimer() {
        let activityData = G.DataMgr.activityData;
        if (activityData.isActivityOpen(Macros.ACTIVITY_ID_GRBOSS)) {
            let status = activityData.getActivityStatus(Macros.ACTIVITY_ID_GRBOSS);
            let now = Math.floor(G.SyncTime.getCurrentTime() / 1000);
            let time = Math.max(0, status.m_iEndTime - now);
            this.time.text = uts.format('活动剩余时间：{0}', DataFormatter.second2day(time));
        } else {
            this.time.text = '活动剩余时间：已结束';
            UIUtils.setButtonClickAble(this.btnGo, false);
            this.enterNum.text = '活动已结束';

        }
    }
}