import { KaiFuHuoDongView } from './../kaifuhuodong/KaiFuHuoDongView';
import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { ResUtil } from 'System/utils/ResUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { BossView } from 'System/pinstance/boss/BossView'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { NewYearActView } from "System/activity/view/NewYearActView";

export class ActTipView extends CommonForm {
    private readonly AutoCloseTimerKey = '1';

    private btnClose: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;
    private icon: UnityEngine.UI.Image;
    private textName: UnityEngine.UI.Text;
    private textRule: UnityEngine.UI.Text;

    private btnGo: UnityEngine.GameObject;

    private actIconAltas: Game.UGUIAltas;

    private toggle: UnityEngine.UI.ActiveToggle = null;
    static isOn: boolean = false;

    private openActId = 0;
    private openBossId = 0;
    private kaifuhuodong:KaiFuHuoDongView;

    constructor() {
        super(0);
    }
    layer(): UILayer {
        return UILayer.OnlyTip;
    }
    protected resPath(): string {
        return UIPathData.ActTipView;
    }
    protected initElements(): void {
        this.btnClose = this.elems.getElement('btnClose');

        this.icon = this.elems.getImage('icon');
        uts.assert(null != this.icon)

        this.textName = this.elems.getText('textName');
        this.textRule = this.elems.getText('textRule');

        this.btnGo = this.elems.getElement('btnGo');
        this.mask = this.elems.getElement('mask');
        this.actIconAltas = this.elems.getElement('actIconAltas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        this.toggle = this.elems.getActiveToggle('Toggle');

    }
    protected initListeners(): void {
        this.addClickListener(this.btnClose, this.onClickBtnClose);
        this.addClickListener(this.mask, this.onClickBtnClose);
        this.addClickListener(this.btnGo, this.onClickBtnGo);
    }

    protected onOpen() {
        this.kaifuhuodong = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
        this.toggle.gameObject.SetActive(false);
        //世界boss
        if (this.openActId == Macros.ACTIVITY_ID_WORLDBOSS) {
            this.textName.text = '金属之都';
            this.textRule.text = '金属之都可产出精品暗器，激活后可在战斗中施放强力暗器技能并大幅提升战力!';
            this.icon.sprite = this.actIconAltas.Get('12');
        }
        else if (this.openActId == Macros.ACTIVITY_ID_XZFM)
        {
            this.textName.text = '星斗大森林';
            this.textRule.text = '星斗大森林中有大量高级魂兽，可获得珍贵的魂骨，魂骨可大幅提升战斗力！';
            this.icon.sprite = this.actIconAltas.Get('12');
        }
        else if (this.openActId == Macros.ACTIVITY_ID_KFNS)
        {
            this.textName.text = '跨服年兽';
            this.textRule.text = '春节活动-全民打年兽开始啦！武器进阶石、装备进阶石、各种资质丹等你来拿，更有新年坐骑归属末刀，还不快来！';
            this.icon.sprite = this.actIconAltas.Get('17');
        }
         
        else if (this.openActId > 0) {
            // 这是活动弹窗
            this.showActivitySound();
            let actHomeCfg = G.DataMgr.activityData.getActHomeCfg(this.openActId);
            uts.assert(null != actHomeCfg, '这个活动没有大厅配置：' + this.openActId);
            this.textName.text = actHomeCfg.m_szName;
            this.textRule.text = RegExpUtil.xlsDesc2Html(actHomeCfg.m_szRuleDesc);
            this.icon.sprite = this.actIconAltas.Get(ResUtil.getActIconName(actHomeCfg));
            G.DataMgr.activityData.logPromp(this.openActId);
        }
        else {
            // 这是地宫boss弹窗
            this.textName.text = '国家Boss';
            this.textRule.text = '挑战国家BOSS可激活对应魂环，大幅提升战力。各位魂师请快去挑战吧！！';
            this.icon.sprite = this.actIconAltas.Get('12');
            this.toggle.gameObject.SetActive(true);
        }

        this.addTimer(this.AutoCloseTimerKey, 180000, 1, this.onAutoCloseTimer);
    }

    protected onClose() {
        this.openActId = 0;
        this.openBossId = 0;
    }


    private showActivitySound() {
        G.AudioMgr.playSound(uts.format('sound/activity/{0}.mp3', this.openActId));
    }

    private onAutoCloseTimer(timer: Game.Timer) {
        this.onClickBtnClose();
    }


    private onClickBtnGo(): void { 
        ActTipView.isOn = this.toggle.isOn;
        //世界boss
        if (this.openActId == Macros.ACTIVITY_ID_WORLDBOSS) {
            G.Uimgr.createForm<BossView>(BossView).open(KeyWord.OTHER_FUNCTION_WORLDBOSS);
        }
        else if (this.openActId == Macros.ACTIVITY_ID_XZFM)
        {
           
            G.Uimgr.createForm<BossView>(BossView).open(KeyWord.ACT_FUNCTION_XZFM);
        }
        else if (this.openActId == Macros.ACTIVITY_ID_KFNS)
        {
            G.Uimgr.createForm<NewYearActView>(NewYearActView).open(KeyWord.OTHER_FUNCTION_KUAFUHUODONGBOSS);
        }
        else if (this.openActId > 0) {
            G.ActionHandler.handleDailyAct(this.openActId);
        } else {
            G.Uimgr.createForm<BossView>(BossView).open(KeyWord.OTHER_FUNCTION_DI_BOSS);
        }
        if (this.kaifuhuodong!=null) {
            this.kaifuhuodong.close();
        }
        this.close();
    }

    open(actId: number, bossId: number) {
        this.openActId = actId;
        this.openBossId = bossId;
        super.open();
    }

    private onClickBtnClose() {
            ActTipView.isOn = this.toggle.isOn;
            this.close();
    }
}