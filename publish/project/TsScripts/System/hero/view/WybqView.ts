import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { WybqData } from 'System/data/WybqData'
import { Macros } from 'System/protocol/Macros'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { ElemFinder } from 'System/uilib/UiUtility'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { KeyWord } from 'System/constants/KeyWord'
import { List, ListItem } from 'System/uilib/List'
import { RegExpUtil } from 'System/utils/RegExpUtil'

//左侧类型
 class TypeItem extends ListItemCtrl {

    private txtName: UnityEngine.UI.Text;
    private txtZl: UnityEngine.UI.Text;
    private bar: UnityEngine.RectTransform;
    private txtState: UnityEngine.UI.Text;
    setComponents(go: UnityEngine.GameObject) {
        this.txtName = ElemFinder.findText(go, "txtName");
        this.txtZl = ElemFinder.findText(go, "progressBar/txtZl");
        this.bar = ElemFinder.findRectTransform(go, "progressBar/bar");
        this.txtState = ElemFinder.findText(go, "txtState");
    }
    update(vo: Protocol.WYBQOneTypeValue) {
        var config: GameConfig.WYBQConfigM = WybqData.getStaticsConfig(vo.m_iID, G.DataMgr.heroData.level);
        if (!config)
            return;
        // 战力数值    
        this.txtName.text = KeyWord.getDesc(KeyWord.GROUP_STRONG_TYPE, vo.m_iID);
        this.txtZl.text = vo.m_iValue.toString();
        // 进度显示     
        let progressNum: number = vo.m_iValue / config.m_iTop;
        if (progressNum > 1) {
            progressNum = 1;
            this.txtState.text ="深不可测";
        } else if (progressNum > 0 && progressNum<1) {
            this.txtState.text="急需提升";
        }
        var lastGrade: number = 0;
        for (var i: number = 0; i < config.m_iGrade.length; i++) {
            if (vo.m_iValue > config.m_iGrade[i].m_iValue) {
                lastGrade = i;
            }
            else {
                break;
            }
        }
        Game.Tools.SetLocalScale(this.bar, progressNum, 1, 1);
    }
}

//右侧途径
 class MethodItem extends ListItemCtrl {
    private lastIconId: number;
    private txtDes: UnityEngine.UI.Text;
    private btnGo: UnityEngine.GameObject;
    private icon: UnityEngine.UI.RawImage;
    private data: GameConfig.WYBQTuJingConfigM;

    setComponents(go: UnityEngine.GameObject) {
        this.txtDes = ElemFinder.findText(go, "txtDes");
        this.btnGo = ElemFinder.findObject(go, "btnGo");
        this.icon = ElemFinder.findRawImage(go, "icon");
        Game.UIClickListener.Get(this.btnGo).onClick = delegate(this, this.onClickBtnGo);
    }

    update(vo: GameConfig.WYBQTuJingConfigM) {
        this.data = vo;
        this.txtDes.text = RegExpUtil.xlsDesc2Html(vo.m_szMiaoshu);
        // 在这里键入Item更新渲染的代码
        if (this.lastIconId != vo.m_iIcon) {
            this.lastIconId = vo.m_iIcon;
            G.ResourceMgr.loadImage(this.icon, uts.format('images/wybqicon/{0}.png', vo.m_iIcon));
        }
    }

    private onClickBtnGo() {
        let vo = this.data;
        if (G.ActionHandler.executeFunction(vo.m_iFunctionName, 0,vo.m_iSubClass, vo.m_iOtherValue)) {
            G.Uimgr.closeForm(WybqView);
        } 
    }
}


/**
 * 我要变强对话框。
 *
 */
export class WybqView extends CommonForm {
    /**战斗力统计列表*/
    private m_staticsList: Protocol.WYBQOneTypeValue[];

    /**战斗力提升途径列表*/
    private m_methodList: GameConfig.WYBQTuJingConfigM[];

    /**战斗力数值*/
    private txtZdl: UnityEngine.UI.Text;

    private mask: UnityEngine.GameObject;
    private btnClose: UnityEngine.GameObject;

    private curSelected: number = -1;

    private listTitle: List;
    private listTujing: List;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.WybqView;
    }


    protected initElements(): void {
        this.txtZdl = this.elems.getText("txtZdl"); 
        this.mask = this.elems.getElement("mask");
        this.btnClose = this.elems.getElement("btnClose");
        this.listTitle = this.elems.getUIList("listTitle");
        this.listTujing = this.elems.getUIList("listTujing");
    }

    protected initListeners(): void {
        this.addClickListener(this.mask, this.onCLickMask);
        this.addClickListener(this.btnClose, this.onCLickMask);
        this.addListClickListener(this.listTitle, this.onClickItem);
    }

    protected onOpen() {
      
        this.processOpenParamS2();
    }

    protected onClose() {

    }

    private onCLickMask() {
        this.close();
    }

    private onClickItem(index: number) {
        this.curSelected = index;
        this._onStaticsSelectChange();
    }

    private _onStaticsSelectChange(): void {
        let selectData: Protocol.WYBQOneTypeValue = this.m_staticsList[this.curSelected];
        if (selectData != null) {
            // 获取该类型战力对应的提升途径
            let methodListData: GameConfig.WYBQTuJingConfigM[] = WybqData.getMethodListData(selectData.m_iID);
            this.m_methodList = methodListData;
            this.listTujing.Count = this.m_methodList.length;
            for (let i = 0; i < this.listTujing.Count; i++) {
                let item = this.listTujing.GetItem(i);
                let methodItem = new MethodItem()
                methodItem.setComponents(item.gameObject);
                methodItem.update(this.m_methodList[i]);
            }
        }
    }

    onHeroDataChange(): void {
        let fightVal: number = G.DataMgr.heroData.getProperty(Macros.EUAI_FIGHT);
        this.txtZdl.text = fightVal.toString();
        // 拉取最新的战力数据
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getWybqRequest());
    }


    updateData(data: Protocol.WYBQOneTypeValue[]): void {
        this.m_staticsList = [];
        //此处移除真迹
        for (let i = 0; i < data.length; i++) {
            if (data[i].m_iID == KeyWord.STRONG_HERO_YY) {
                continue;
            }
            this.m_staticsList.push(data[i]);
        }

        let len = this.m_staticsList.length;
        this.listTitle.Count = len;
        for (let i = 0; i < this.listTitle.Count; i++) {
            let item = this.listTitle.GetItem(i);
            let typeItem = new TypeItem();
            typeItem.setComponents(item.gameObject);
            typeItem.update(this.m_staticsList[i]);
        }

        // 如果起初没有数据选择，则默认选择一个
        if (data.length > 0 && this.curSelected < 0) {
            this.curSelected = 0;
            this.listTitle.Selected = 0;
            this._onStaticsSelectChange();
        }
    }

    ///////////////////////////////////////// 面板打开 /////////////////////////////////////////

    private processOpenParamS2(): void {

        if (this.m_staticsList != null) {
            this.curSelected = 0;
            this._onStaticsSelectChange();
        }

        let fightVal: number = G.DataMgr.heroData.getProperty(Macros.EUAI_FIGHT);
        this.txtZdl.text = fightVal.toString();

        // 拉取最新的战力数据
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getWybqRequest());
    }
}
