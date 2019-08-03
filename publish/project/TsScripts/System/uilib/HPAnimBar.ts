import { Global as G } from 'System/global'
import { UiElements } from 'System/uilib/UiElements'
import { ElemFinder } from 'System/uilib/UiUtility'
import { Macros } from 'System/protocol/Macros'
import { RoleData } from 'System/data/RoleData'
import { DataFormatter } from 'System/utils/DataFormatter'

export class HPAnimBar {
    /**血条颜色阶段  黄>橙>紫>蓝>浅蓝>绿>红*/
    private COLOR_STAGE: string[] = ['monster_Blood_red', 'monster_Blood_green', 'monster_Blood_cyan',
        'monster_Blood_blue', 'monster_Blood_yellow', 'monster_Blood_purple', 'monster_Blood_Orange'];

    private MAX_STAGE: number = 7;

    private unitID: number;

    private m_totalVal: number = 0;

    private m_oldVal: number = 0;

    private m_stageNum: number = 0;
    private m_showPercent: boolean = false;

    private hpBarImg: UnityEngine.UI.Image;
    private hpBarRectTrans: UnityEngine.RectTransform;

    private bgImg: UnityEngine.UI.Image;
    private bgRectTrans: UnityEngine.RectTransform;

    private hpText: UnityEngine.UI.Text;

    private imgAltas: Game.UGUIAltas;

    setView(go: UnityEngine.GameObject) {
        this.hpBarImg = ElemFinder.findImage(go, 'hpBarImg');
        this.hpBarRectTrans = this.hpBarImg.transform as UnityEngine.RectTransform;
        this.bgImg = ElemFinder.findImage(go, 'bgImg');
        this.bgRectTrans = this.bgImg.transform as UnityEngine.RectTransform;

        this.hpText = ElemFinder.findText(go, 'hpText');
        this.imgAltas = ElemFinder.findObject(go, 'imgAltas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
    }

    reset(): void {
        this.unitID = 0;
        this.m_totalVal = 0;
        this.m_oldVal = 0;
        this.m_stageNum = 1;
    }

    setBasic(stageNum: number, showPercent: boolean) {
        if (stageNum == 0) {
            stageNum = 1;
        }
        else if (stageNum > this.MAX_STAGE) {
            stageNum = this.MAX_STAGE;
        }
        this.m_stageNum = stageNum;
        this.m_showPercent = showPercent;
    }

    /**
     * 设置参数
     * @param totalVal 总血量
     * @param currentVal 当前血量
     * @param stageNum 血条阶段数
     * @return 返回当前剩余段数
     */
    setValue(unitID: number, curValue: number, maxValue: number): number {
        this.m_totalVal = maxValue;

        let diffUnit = false;
        if (this.unitID != unitID) {
            this.m_oldVal = curValue;
            diffUnit = true;
        }

        this.unitID = unitID;

        let curStage: number = Math.ceil(curValue / (this.m_totalVal / this.m_stageNum));

        if (curStage <= 0) {
            curStage = 1;
        } else if (curStage > this.MAX_STAGE) {
            curStage = this.MAX_STAGE;
        }

        let barBmdName: string = this.COLOR_STAGE[curStage - 1];

        // 满血的时候显示黄色
        if (curStage == this.m_stageNum) {
            barBmdName = this.COLOR_STAGE[this.MAX_STAGE - 1];
        }

        let perStageVal: number = this.m_totalVal / this.m_stageNum;
        let oldWidth: number = (this.m_oldVal - (curStage - 1) * perStageVal) / perStageVal;
        let newWidth: number = (curValue - (curStage - 1) * perStageVal) / perStageVal;

        this.m_oldVal = curValue;

        this.hpBarImg.sprite = this.imgAltas.Get(barBmdName);
        let newScale = new UnityEngine.Vector3(newWidth, 1, 1);
        // this.hpBarRectTrans.localScale = newScale;
        this.hpBarImg.fillAmount = newWidth;

        if (curStage > 1) {
            this.bgImg.sprite = this.imgAltas.Get(this.COLOR_STAGE[curStage - 2]);
            this.bgImg.gameObject.SetActive(true);
        }
        else {
            this.bgImg.gameObject.SetActive(false);
        }

        if (this.m_showPercent) {
            let per: number = curValue / maxValue * 100;
            this.hpText.text = (per < 100 ? per.toFixed(1) : per) + '%';
        } else {
            this.hpText.text = DataFormatter.cutWan(curValue, 0) + '/' + DataFormatter.cutWan(maxValue, 0);
        }

        return curStage;
    }
}
