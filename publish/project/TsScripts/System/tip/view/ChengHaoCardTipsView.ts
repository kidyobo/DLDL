import { NestedForm } from 'System/uilib/NestedForm'
import { UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from "System/data/UIPathData"
import { Global as G } from 'System/global'
import { KeyWord } from "System/constants/KeyWord"
import { UnitCtrlType } from 'System/constants/GameEnum'
import { List } from 'System/uilib/List'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { RegExpUtil } from "System/utils/RegExpUtil"
import { ElemFinder } from 'System/uilib/UiUtility'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { DataFormatter } from "System/utils/DataFormatter"
import { TipFrom } from 'System/tip/view/TipsView'


class ChengHaoCardPropItem {
    private propValue: UnityEngine.UI.Text;
    setComponents(go: UnityEngine.GameObject) {
        this.propValue = ElemFinder.findText(go, "Text");
    }

    update(propName: string, propValue) {
        this.propValue.text = propName + ":" + TextFieldUtil.getColorText(propValue, Color.YELLOW);
    }
}

export class ChengHaoCardTipsView extends NestedForm {

    private tipData: GameConfig.ThingConfigM;
    private mask: UnityEngine.GameObject;
    private TextFight: UnityEngine.UI.Text;
    private modelRoot: UnityEngine.GameObject;
    private EffectiveTime: UnityEngine.UI.Text;
    private btnShow: UnityEngine.GameObject;
    private btnclose: UnityEngine.GameObject;
    private specDes: UnityEngine.UI.Text;
    private propList: List;
    private tipFrom: TipFrom;
    private thingInfo: Protocol.ContainerThingInfo;
    private ShapeCardPropItems: ChengHaoCardPropItem[] = [];
    private readonly MaxPropCount = 4;
    constructor() {
        super(0);
    }

    layer() {
        return UILayer.OnlyTip;
    }

    protected resPath(): string {
        return UIPathData.ChengHaoCardTipsView;
    }

    protected initElements() {
        this.mask = this.elems.getElement('mask');
        this.modelRoot = this.elems.getElement('modelRoot');
        this.EffectiveTime = this.elems.getText('EffectiveTime');
        this.propList = this.elems.getUIList('propList');
        this.specDes = this.elems.getText('specDes');
        this.TextFight = this.elems.getText('TextFight');
        this.btnShow = this.elems.getElement('btnShow');
        this.btnclose = this.elems.getElement('btnclose');
    }

    protected initListeners()
    {
        this.addClickListener(this.mask, this.onClickReturnBtn);
        this.addClickListener(this.btnShow, this.onClickBtnShow);
        this.addClickListener(this.btnclose, this.onClickBtnClose);
    }

    open(tipData: GameConfig.ThingConfigM,from: TipFrom, thingInfo: Protocol.ContainerThingInfo) {
        this.tipData = tipData;
        this.tipFrom = from;
        this.thingInfo = thingInfo;
        super.open();
    }

    protected onOpen() {
        this.btnShow.SetActive(this.tipFrom == TipFrom.chat);
        let data = G.DataMgr.titleData.getDataConfig(this.tipData.m_iFunctionID);
        this.TextFight.text = (FightingStrengthUtil.calStrength(data.m_stPropAtt)).toString();
        if (this.tipData.m_iFunctionValue > 0)
        {
            this.EffectiveTime.text = '有效期：' + TextFieldUtil.getColorText(DataFormatter.second2DayDoubleShort(this.tipData.m_iFunctionValue).toString(), Color.GREEN);
        }
        else
        {
            this.EffectiveTime.text = '有效期：永久';
        }
        
        this.specDes.text = RegExpUtil.xlsDesc2Html(this.tipData.m_szSpecDesc); 
        G.ResourceMgr.loadModel(this.modelRoot, UnitCtrlType.chenghao, data.m_uiImageID.toString(), this.sortingOrder, true);

        let propData = data.m_stPropAtt;

        let propCount = 0;
        propCount= propData.length > this.MaxPropCount ? this.MaxPropCount : propData.length;

        this.propList.Count = propCount;
        for (let i = 0; i < propCount; i++) {
            if (this.ShapeCardPropItems[i] == null) {
                let item = this.propList.GetItem(i).gameObject;
                this.ShapeCardPropItems[i] = new ChengHaoCardPropItem();
                this.ShapeCardPropItems[i].setComponents(item);
            }

            let propName: string = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, propData[i].m_ucPropId);
            let propValue: string = propData[i].m_ucPropValue.toString();
            this.ShapeCardPropItems[i].update(propName, propValue);
        }
    }

    private onClickBtnClose() {
        this.close();
    }

    private onClickBtnShow() {
        if (this.thingInfo == null) return;
        G.ModuleMgr.chatModule.appendItemText(this.tipData, this.thingInfo.m_stThingProperty.m_stGUID);
        this.close();
    }
    protected onClose() {
    }

    private onClickReturnBtn() {
        this.close();
    }
}