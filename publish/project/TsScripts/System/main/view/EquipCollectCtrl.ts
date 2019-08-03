import { Global as G } from 'System/global'
import { UiElements } from 'System/uilib/UiElements'
import { ElemFinder } from 'System/uilib/UiUtility'
import { Macros } from 'System/protocol/Macros'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { KeyWord } from 'System/constants/KeyWord'
import { ThingData } from 'System/data/thing/ThingData'
import { EquipUtils } from 'System/utils/EquipUtils'
import { HunGuCollectPanel } from 'System/hunli/HunGuCollectPanel';

export class EquipCollectCtrl {

    private readonly maxEquipCount: number = 6;

    private iconRoot: UnityEngine.GameObject;

    private equipCollectEffect: UnityEngine.GameObject;

    private imgEquipType: UnityEngine.UI.Image;
    private txtName: UnityEngine.UI.Text;

    private textProgress: UnityEngine.UI.Text;

    private btnTrigger: UnityEngine.GameObject;
    private isOpen: boolean = true;
    private openTimer: number = 10000;
    //private pointEquipClose: UnityEngine.GameObject;
    //private pointEquipOpen: UnityEngine.GameObject;


    setView(uiElems: UiElements) {
        this.iconRoot = uiElems.getElement("iconRoot");
        this.equipCollectEffect = uiElems.getElement("equipCollectEffect");

        this.imgEquipType = uiElems.getImage("imgEquipType");
        this.txtName = uiElems.getText("txtName");

        this.textProgress = uiElems.getText('textProgress');


        this.btnTrigger = uiElems.getElement("btnTrigger");
        //this.pointEquipClose = uiElems.getElement("pointEquipClose");
        //this.pointEquipOpen = uiElems.getElement("pointEquipOpen");


        Game.UIClickListener.Get(this.btnTrigger).onClick = delegate(this, this.onClickEquip)
        //this.openIconTween();

    }

    updateEquipCollectProgress() {
        //套装属性的显示
        let data = G.DataMgr.equipStrengthenData.equipSuitInfo;
        if (data) {
            let stage = data.m_ucStage > 0 ? data.m_ucStage : 1;
            if (data.m_ucNum == HunGuCollectPanel.MaxCollectHunGuCount) {
                stage = stage + 1;
                stage = stage > HunGuCollectPanel.YearsCount ? HunGuCollectPanel.YearsCount : stage;
            }
            let numComplete = G.DataMgr.hunliData.getHunGuCollectCount(ThingData.getGodEquipCfgs(stage));
            numComplete = numComplete > HunGuCollectPanel.MaxCollectHunGuCount ? HunGuCollectPanel.MaxCollectHunGuCount : numComplete;
            this.txtName.text = KeyWord.getDesc(KeyWord.GROUP_HUNGU_DROP_LEVEL, stage);
            this.textProgress.text = numComplete + '/' + this.maxEquipCount;
            //this.onClickEquip();
        } else {
            this.txtName.text = KeyWord.getDesc(KeyWord.GROUP_HUNGU_DROP_LEVEL, 1);
            this.textProgress.text = 0 + '/' + this.maxEquipCount;
        }

    }




    /**点击图标 */
    private onClickEquip() {
        ////关闭状态 打开
        //if (!this.isOpen)
        //    this.openIconTween();
        ////开启状态 无
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION);
    }

    //private openIconTween() {
    //    Tween.TweenPosition.Begin(this.btnEquipBg.transform.parent.gameObject, 0.2, this.pointEquipOpen.transform.position, true);
    //    this.isOpen = true;
    //    new Game.Timer("openEquipIconTimer", this.openTimer, 1, delegate(this, this.closeIconTween));
    //}

    //private closeIconTween() {
    //    if (this.isOpen) {
    //        let tween = Tween.TweenPosition.Begin(this.btnEquipBg.transform.parent.gameObject, 0.2, this.pointEquipClose.transform.position, true);
    //        tween.onFinished = delegate(this, this.closeEnd);
    //    }
    //}

    //private closeEnd() {
    //    this.isOpen = false;
    //}
}