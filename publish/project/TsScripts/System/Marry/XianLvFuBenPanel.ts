import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { PinstanceIDUtil } from 'System/utils/PinstanceIDUtil'
import { TeamFbView, TeamFbListBaseItem } from 'System/teamFb/TeamFbView'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { IconItem } from 'System/uilib/IconItem'
import { Color } from 'System/utils/ColorUtil'
import { PinstanceData } from 'System/data/PinstanceData'
import { SxtItemData } from 'System/data/vo/SxtItemData'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { TipFrom } from 'System/tip/view/TipsView'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { MessageBoxConst } from 'System/tip/TipManager'
import { ConfirmCheck } from 'System/tip/TipManager'
import { UIUtils } from 'System/utils/UIUtils'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { DropPlanData } from 'System/data/DropPlanData'
import { EnumPinstanceRule } from 'System/constants/GameEnum'
import { EnumMarriage } from 'System/constants/GameEnum'

export class XianLvFuBenPanel extends TeamFbView {


    private leftTimesText: UnityEngine.UI.Text;
    private _coupleItemData: SxtItemData;
    private rewardList: List;
    private icons: IconItem[] = [];
    private iconItemNormal: UnityEngine.GameObject;

    constructor() {
        super(KeyWord.BAR_FUNCTION_XIANYUAN);
    }

    protected resPath(): string {
        return UIPathData.XianLvFuBenView;
    }

    protected initElements() {
        super.initElements();
        this.leftTimesText = this.elems.getText('challengeTimesText');
        this.rewardList = this.elems.getUIList('rewardList');
        
        this._coupleItemData = new SxtItemData();
        this._coupleItemData.config = PinstanceData.getConfigByID(this.getPinstanceIDs()[0]);
        this._coupleItemData.diffConfig = PinstanceData.getDiffBonusData(this.getPinstanceIDs()[0], 1);
        let dropConfig: GameConfig.DropConfigM = DropPlanData.getDropPlanConfig(EnumPinstanceRule.COUPLE_DROP_ID);
        this.rewardList.Count = dropConfig.m_ucDropThingNumber;
        for (let i = 0; i < dropConfig.m_ucDropThingNumber; i++) {
            let dropThing = dropConfig.m_astDropThing[i];
            let iconItem = this.icons[i];
            if (null == iconItem) {
                this.icons.push(iconItem = new IconItem());
                let iconRoot = this.rewardList.GetItem(i).gameObject;
                iconItem.setUsuallyIcon(iconRoot);
                iconItem.setTipFrom(TipFrom.normal);
            }
            iconItem.updateByDropThingCfg(dropThing);
            iconItem.updateIcon();
        } 
    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.elems.getElement('mask'), this.close);
        this.addClickListener(this.elems.getElement('btn_close'), this.close);
    }

    protected updatePinstanceList() {
        //剩余次数
        let leftStr: string = '';
        let color: string = '';
        let config: GameConfig.PinstanceConfigM = this._coupleItemData.config;
        let finishTime: number = 0;
        if (config.m_ucEnterTimes > 0) {
            let listPinHomeRsp: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(config.m_iPinstanceID) as Protocol.ListPinHomeRsp;
            if (listPinHomeRsp != null) {
                finishTime = listPinHomeRsp.m_uiIsDayFinish & 2 ? 1 : 0;
            }
            let totalTimes: number = G.DataMgr.systemData.getPinstanceTotalTimes(config);
            color = finishTime >= totalTimes ? Color.RED : Color.GREEN;
            leftStr = TextFieldUtil.getColorText(uts.format('{0}/{1}', finishTime, totalTimes), color);
        }
        else {
            color = Color.GREEN;
            leftStr = TextFieldUtil.getColorText(uts.format('{1}', finishTime, '无限'), color);
        }
        this.leftTimesText.text = TextFieldUtil.getColorText(uts.format('挑战次数：{0}', leftStr), Color.DEFAULT_WHITE);
        this._updateSelectedPinstance();
    }

    protected getPinstanceCfgByIdx(index: number): GameConfig.PinstanceConfigM {
        return this._coupleItemData.config;
    }

    protected newListItemCtrl(): TeamFbListBaseItem {
        return null;
    }

    protected getPinstanceIDs(): number[] {
        return PinstanceIDUtil.FuQiFuBenIDs;
    }

    protected getPinstanceIdx(id: number): number {
        for (let i = 0; i < PinstanceIDUtil.FuQiFuBenIDs.length; i++) {
            if (PinstanceIDUtil.FuQiFuBenIDs[i] == id) {
                return i;
            }
        }
        return -1;
    }

    protected canPlay(index: number): boolean {
        let cfg = this.getPinstanceCfgByIdx(index);
        return G.DataMgr.heroData.level >= cfg.m_iLevelLow;
    }


}