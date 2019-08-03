import { SiXiangData } from "System/data/SiXiangData";
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { EnumSceneResultId, SceneResultView } from "System/pinstance/result/SceneResultView";
import { Macros } from "System/protocol/Macros";
import { TipFrom } from "System/tip/view/TipsView";
import { IconItem } from "System/uilib/IconItem";
import { List } from "System/uilib/List";
import { NestedSubForm } from "System/uilib/NestedForm";
import { Color } from "System/utils/ColorUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";

export class SceneResultMultiPvPPanel extends NestedSubForm {
    private readonly AutoCloseTimerKey = '1';

    private titleSuccess: UnityEngine.GameObject;
    private titleFailed: UnityEngine.GameObject;

    private medal: UnityEngine.UI.Image;
    private medalAltas: Game.UGUIAltas;
    private textMedalLv: UnityEngine.UI.Text;

    private textStage: UnityEngine.UI.Text;
    private progress: UnityEngine.GameObject;
    private textProgress: UnityEngine.UI.Text;
    private textAdd: UnityEngine.UI.Text;
    private imgAdd: UnityEngine.GameObject;
    private imgReduce: UnityEngine.GameObject;

    private rewardList: List;
    private rewardIcons: IconItem[] = [];

    private btnExit: UnityEngine.GameObject;
    private textExitLabel: UnityEngine.UI.Text;

    private resultInfo: Protocol.MultiPVPReward;
    private type = 0;

    constructor() {
        super(EnumSceneResultId.multiPvP);
    }

    protected resPath(): string {
        return UIPathData.SceneResultMultiPvPView;
    }

    protected initElements() {
        this.titleSuccess = this.elems.getElement('titleSuccess');
        this.titleFailed = this.elems.getElement('titleFailed');

        this.medal = this.elems.getImage('medal');
        this.medalAltas = this.elems.getElement('medalAltas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        this.textMedalLv = this.elems.getText('textMedalLv');

        this.textStage = this.elems.getText('textStage');
        this.progress = this.elems.getElement('progress');
        this.textProgress = this.elems.getText('textProgress');
        this.textAdd = this.elems.getText('textAdd');
        this.imgAdd = this.elems.getElement('imgAdd');
        this.imgReduce = this.elems.getElement('imgReduce');

        this.rewardList = this.elems.getUIList('rewardList');

        this.btnExit = this.elems.getElement('btnExit');
        this.textExitLabel = this.elems.getText('textExitLabel');
    }

    protected initListeners() {
        this.addClickListener(this.btnExit, this.onBtnExitClick);
    }

    protected onOpen() {
        if (0 == this.resultInfo.m_ucResult) {
            this.titleSuccess.SetActive(false);
            this.titleFailed.SetActive(true);
        } else {
            this.titleSuccess.SetActive(true);
            this.titleFailed.SetActive(false);
        }

        let stageDesc: string;
        let medalLv = 0;
        let lv = 0;
        let score = this.resultInfo.m_iScore;
        let nextVal = score;
        if (Macros.SCENERESULT_MULTIPVP_REWARD == this.type) {
            // 跨服3v3
            let kf3v3Data = G.DataMgr.kf3v3Data;
            let config = kf3v3Data.getConfByLevel(this.resultInfo.m_iStage);
            let nextConfig = kf3v3Data.getConfByLevel(this.resultInfo.m_iStage + 1);
            stageDesc = kf3v3Data.getStageName(this.resultInfo.m_iStage);
            medalLv = config.m_iStage;
            lv = config.m_iLv;
            if (null != nextConfig) {
                nextVal = nextConfig.m_iScore;
            }
        } else {
            // 斗兽斗兽场
            let siXiangData = G.DataMgr.siXiangData;
            let config = siXiangData.getGradeCfg(this.resultInfo.m_iStage);
            let nextCfg = siXiangData.getGradeCfg(this.resultInfo.m_iStage + 1);
            stageDesc = config.m_szName;
            medalLv = Math.ceil(this.resultInfo.m_iStage / SiXiangData.StageSize);
            lv = 0;
            nextVal = config.m_iScore;
            if (nextCfg != null) {
                nextVal = nextCfg.m_iScore;
            }
        }
        // 段位名称
        this.textStage.text = stageDesc;
        this.medal.sprite = this.medalAltas.Get(medalLv.toString());
        if (lv > 0) {
            this.textMedalLv.text = lv.toString();
            this.textMedalLv.gameObject.SetActive(true);
        } else {
            this.textMedalLv.gameObject.SetActive(false);
        }
        // 进度
        this.textProgress.text = uts.format('{0}/{1}', score, nextVal);
        this.progress.transform.localScale = G.getCacheV3(nextVal > 0 ? score / nextVal : 0, 1, 1);

        if (this.resultInfo.m_iAddScore >= 0) {
            this.textAdd.text = TextFieldUtil.getColorText(uts.format('+{0}', this.resultInfo.m_iAddScore), Color.GREEN);
            this.imgAdd.SetActive(true);
            this.imgReduce.SetActive(false);
        } else {
            this.textAdd.text = TextFieldUtil.getColorText(this.resultInfo.m_iAddScore.toString(), Color.RED);
            this.imgAdd.SetActive(false);
            this.imgReduce.SetActive(true);
        }

        // 奖励
        let cnt = this.resultInfo.m_ucNum;
        let oldItemCnt = this.rewardIcons.length;
        this.rewardList.Count = cnt;
        for (let i = 0; i < cnt; i++) {
            let icon: IconItem;
            if (i < oldItemCnt) {
                icon = this.rewardIcons[i];
            } else {
                this.rewardIcons.push(icon = new IconItem);
                icon.setTipFrom(TipFrom.normal);
                icon.setUsuallyIcon(this.rewardList.GetItem(i).gameObject);
            }
            let thing = this.resultInfo.m_astThing[i];
            icon.updateById(thing.m_uiThingID, thing.m_uiThingNum);
            icon.updateIcon();
        }

        G.AudioMgr.playSound('sound/ui/uisound_16.mp3');

        this.addTimer(this.AutoCloseTimerKey, 5000, 1, this.onAutoCloseTimer);
    }

    protected onClose() {
        this.removeTimer(this.AutoCloseTimerKey);
    }

    open(result: Protocol.MultiPVPReward, type: number) {
        this.resultInfo = result;
        this.type = type;
        super.open();
    }

    ///////////////////////////////////////// 事件处理 /////////////////////////////////////////

    private onAutoCloseTimer(timer: Game.Timer) {
        this.onBtnExitClick();
    }

    private onBtnExitClick() {
        G.ModuleMgr.pinstanceModule.onClickQuitPinstance(true);
        G.Uimgr.closeForm(SceneResultView);
    }
}