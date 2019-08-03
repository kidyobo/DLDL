import { KeyWord } from 'System/constants/KeyWord';
import { UIPathData } from 'System/data/UIPathData';
import { Global as G } from 'System/global';
import { ItemMergeItemBasePanel } from 'System/Merge/ItemMergeItemBasePanel';
import { ItemMergeMaterialPanel } from 'System/Merge/ItemMergeMaterialPanel';
import { ItemMergePetPanel } from 'System/Merge/ItemMergePetPanel';
import { WingEquipMergePanel } from 'System/Merge/WingEquipMergePanel';
import { Macros } from 'System/protocol/Macros';
import { TipMarkUtil } from "System/tipMark/TipMarkUtil";
import { UILayer } from 'System/uilib/CommonForm';
import { CurrencyTip } from 'System/uilib/CurrencyTip';
import { TabFormCommom } from '../uilib/TabFormCommom';
import { ItemMergeEquipPanel } from './ItemMergeEquipPanel';
import { HunguCreatePanel } from '../hungu/HunguCreatePanel';


export class ItemMergeView extends TabFormCommom {

    static readonly TABS1: number[] = [KeyWord.MERGER_CLASS1_PET, KeyWord.MERGER_CLASS1_EQUIP, KeyWord.MERGER_CLASS1_STRONG_ITEM, KeyWord.MERGER_CLASS1_STRONG_ITEM];
    private openTabId: number = 0;
    /**右上角的魂币显示*/
    private currencyTip: CurrencyTip;
    //战斗力显示
    private fightText: UnityEngine.UI.Text;

    constructor() {
        super(KeyWord.BAR_FUNCTION_HECHEN, ItemMergePetPanel, ItemMergeEquipPanel, ItemMergeMaterialPanel, HunguCreatePanel, WingEquipMergePanel);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.ItemMergeView;
    }
    protected initElements(): void {
        super.initElements();
        this.setTabGroupNanme(["装备", "配装", "道具", "魂骨", "灵翼"]);
        this.setTitleName("合成");
        this.setFightActive(false);

        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.getCurrencyTip());

        this.fightText = this.elems.getText("fightText");
    }
    protected initListeners(): void {
        super.initListeners();
        this.addClickListener(this.getCloseButton(), this.close);
        this.addClickListener(this.elems.getElement("mask"), this.close);

    }

    open(tab = 0) {
        this.openTabId = tab;
        super.open();
    }

    protected onOpen() {
        this.judgeFunctionHasOpen();


        let firstTip = this.updateTabAngle();

        if (this.openTabId == 0) {
            this.openTabId = firstTip;
        }

        this.switchTabFormById(this.openTabId);
        this.onUpdateMoney();
        this.fightText.text = G.DataMgr.heroData.getProperty(Macros.EUAI_FIGHT).toString();
    }

    protected onClose() {

    }

    onUpdateMoney() {
        if (this.currencyTip != null) {
            this.currencyTip.updateMoney();
        }
    }

    /**检查功能是否开启*/
    private judgeFunctionHasOpen() {
        let idLen: number = this.tabIds.length;
        for (let i: number = 0; i < idLen; i++) {
            let funId: number = this.tabIds[i];
            this.tabGroup.GetToggle(i).gameObject.SetActive(0 == funId || G.DataMgr.funcLimitData.isFuncEntranceVisible(funId));
        }
    }

    /**更新小红点显示*/
    private updateTabAngle(): number {
        let firstTip = -1;
        let len: number = this.getTabCount();
        let esData = G.DataMgr.equipStrengthenData;
        for (let i = 0; i < len; i++) {
            let form = this.getTabFormByIndex(i);
            let panelId: number = form.Id;
            let ishow: boolean = false;
            if (panelId == KeyWord.OTHER_FUNCTION_MERGE_PET
                || panelId == KeyWord.OTHER_FUNCTION_MERGE_EQUIP
                || panelId == KeyWord.OTHER_FUNCTION_MERGE_MATERIAL
            ) {
                //收集
                ishow = esData.canItemMergeByType(ItemMergeView.TABS1[i]);
            }
            else if (panelId == KeyWord.OTHER_FUNCTION_HUNGUN_CREATE) {
                ishow = TipMarkUtil.isHunguCreateShowTipMark();
            }
            else {
                ishow = TipMarkUtil.isShowWingEquipMergeTipMark();
            }

            // 显示圆点
            this.setTabTipMark(i, ishow);

            if (firstTip < 0 && ishow) {
                firstTip = panelId;
            }

        }
        return firstTip;
    }


    onContainerChange(id: number): void {
        if (id == Macros.CONTAINER_TYPE_ROLE_BAG) {
            let currentForm = this.getCurrentTab();
            if (null == currentForm || !currentForm.isOpened) {
                return;
            }
            if (currentForm.Id == KeyWord.OTHER_FUNCTION_MERGE_PET
                || currentForm.Id == KeyWord.OTHER_FUNCTION_MERGE_EQUIP
                || currentForm.Id == KeyWord.OTHER_FUNCTION_MERGE_MATERIAL
            ) {
                let view = currentForm as ItemMergeItemBasePanel;
                view.onContainerChange(id);
            }
            this.updateTabAngle();
        }
    }


    onItemMergeResponse() {
        let currentForm = this.getCurrentTab();
        if (null == currentForm || !currentForm.isOpened) {
            return;
        }
        if (currentForm.Id == KeyWord.OTHER_FUNCTION_MERGE_PET
            || currentForm.Id == KeyWord.OTHER_FUNCTION_MERGE_EQUIP
            || currentForm.Id == KeyWord.OTHER_FUNCTION_MERGE_MATERIAL
        ) {
            let view = currentForm as ItemMergeItemBasePanel;
            view.onItemMergeResponse();
        }
    }

    onRoleWingResponse(info: Protocol.RoleWingCreateRsp) {
        let panel = this.getTabFormByID(KeyWord.OTHER_FUNCTION_MERGE_WING) as WingEquipMergePanel;
        if (panel.isOpened) {
            panel.onRoleWingResponse(info);
        }
    }

}