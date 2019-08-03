import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { UiElements } from 'System/uilib/UiElements'
import { ElemFinder } from 'System/uilib/UiUtility'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { List, ListItem } from 'System/uilib/List'
import { ZhuRongJiTanItemData } from 'System/data/vo/ZhuRongJiTanItemData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { PinstanceIDUtil } from 'System/utils/PinstanceIDUtil'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { PinstanceData } from 'System/data/PinstanceData'
import { MonsterData } from 'System/data/MonsterData'
import { EnumMonsterID, UnitCtrlType } from 'System/constants/GameEnum'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { PinstanceHallView } from 'System/pinstance/hall/PinstanceHallView'
import { MingWenFuBenPanel } from 'System/pinstance/hall/MingWenFuBenPanel'
import { UIUtils } from 'System/utils/UIUtils'

export class MwslMagicView extends CommonForm {
    private readonly TotalNum = 6;

    private btnNumbers: UnityEngine.GameObject[] = [];

    private btnClose: UnityEngine.GameObject;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.MwslMagicView;
    }

    protected initElements() {
        let numbers = this.elems.getElement('numbers');
        for (let i = 0; i < this.TotalNum; i++) {
            let btn = ElemFinder.findObject(numbers, (i + 1).toString());
            this.btnNumbers.push(btn);
        }

        this.btnClose = this.elems.getElement('btnClose');
    }

    protected initListeners() {
        for (let i = 0; i < this.TotalNum; i++) {
            this.addClickListener(this.btnNumbers[i], delegate(this, this.onClickBtnNumber, i + 1));
        }
        
        this.addClickListener(this.btnClose, this.onClickBtnClose);
    }

    protected onOpen() {
        let mwslData = G.DataMgr.mwslData;
        let cfgs = mwslData.getLayerCfgs(mwslData.data.m_ucStage);
        let layerSize = cfgs.length;
        let curPos = mwslData.getCurPos();
        let max = layerSize - curPos;
        for (let i = 0; i < this.TotalNum; i++) {
            UIUtils.setButtonClickAble(this.btnNumbers[i], i < max);
        }
    }

    protected onClose() {

    }

    private onClickBtnNumber(num: number) {
        let mwslPanel = G.Uimgr.getSubFormByID<MingWenFuBenPanel>(PinstanceHallView, KeyWord.OTHER_FUNCTION_MWSL);
        if (mwslPanel != null) {
            mwslPanel.onSelectMagicDice(num);
        }
        this.close();
    }

    private onClickBtnClose() {
        this.close();
    }
}