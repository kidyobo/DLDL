import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { DataFormatter } from 'System/utils/DataFormatter'
import { HfhdData } from 'System/mergeActivity/HfhdData'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { SlotMachine } from 'System/uilib/SlotMachine'
import { ScrollSlot } from 'System/uilib/ScrollSlot'


class HFRecordItem {

    private bg1: UnityEngine.GameObject;
    private bg2: UnityEngine.GameObject;
    private txtName: UnityEngine.UI.Text;
    private txtGet: UnityEngine.UI.Text;

    setComponent(go: UnityEngine.GameObject) {
        this.bg1 = ElemFinder.findObject(go, "bg1");
        this.bg2 = ElemFinder.findObject(go, "bg2");
        this.txtName = ElemFinder.findText(go, "txtName");
        this.txtGet = ElemFinder.findText(go, "txtGet");
    }

    update(data: Protocol.HFZCMRecord, index: number) {
        this.txtName.text = data.m_szName;
        this.txtGet.text = data.m_iValue + "钻石";
        this.bg1.SetActive(index % 2 == 0);
        this.bg2.SetActive(index % 2 == 1);
    }

}



//合服招财猫
export class MergeZCMPanel extends TabSubForm {

    private readonly MaxNumCount = 5;
    /**领奖位*/
    private readonly BitMaps: number[] = [0, 1, 3, 7];


    private rankList: List;
    private txtTime: UnityEngine.UI.Text;
    private txtCost: UnityEngine.UI.Text;
    private txtNextCondition: UnityEngine.UI.Text;
    private btnStart: UnityEngine.GameObject;

    private curConfig: GameConfig.HFZhaoCaiMaoCfgM;
    private hFRecordItems: HFRecordItem[] = [];
    private numAtals: Game.UGUIAltas;
    private scroll: UnityEngine.GameObject;
    private items: UnityEngine.GameObject[] = [];

    /**转动次数*/
    private runCount: number = 0;
    /**是否正在播动画*/
    private isPlaying: boolean = false;
    /**是否可以停止*/
    private canStop: boolean = false;

    private curNum: number = 0;

    private scrollNums: ScrollSlot[] = [];
    private isFirstSendMsg: boolean = true;



    constructor() {
        super(KeyWord.OTHER_FUNCTION_HFHD_ZHAOCAIMAO);

    }

    protected resPath(): string {
        return UIPathData.MergeZCMPanel;
    }

    protected initElements() {
        this.rankList = this.elems.getUIList("rankList");
        this.txtTime = this.elems.getText("txtTime");
        this.txtCost = this.elems.getText("txtCost");
        this.txtNextCondition = this.elems.getText("txtNextCondition");
        this.btnStart = this.elems.getElement("btnStart");

        this.numAtals = this.elems.getElement("numAtals").GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        //5位数图片显示
        this.scroll = this.elems.getElement("scroll");
        for (let i = 0; i < this.MaxNumCount; i++) {
            let item = ElemFinder.findObject(this.scroll, "item" + i);
            this.items.push(item);
            this.scrollNums[i] = new ScrollSlot();
            this.scrollNums[i].setCommponent(item, this.numAtals);
        }

    }

    protected initListeners() {
        this.addClickListener(this.btnStart, this.onClickStartScroll);
    }

    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHfhdRequest(Macros.HFHD_ZCM_OPEN_PANNEL));
    }

    protected onClose() {
        for (let i = 0; i < this.MaxNumCount; i++) {
            this.scrollNums[i].stopScroll();
        }
    }


    updatePanel(getMoney: number): void {
        let hfData = G.DataMgr.hfhdData;
        let bit = hfData.hfzcmInfo.m_ucGetBitMap;
        // uts.log("  bit   " + bit + "   hfData.hfzcmInfo    " + hfData.hfzcmInfo.m_uiAccCharge);
        let tipStr = "";
        if (bit == 7) {
            UIUtils.setButtonClickAble(this.btnStart, false);
            tipStr = "今日招财次数已满,明日可继续招财";
            this.txtNextCondition.text = "";
        } else {
            this.curConfig = G.DataMgr.hfhdData.getHFZCMCfgs(HfhdData.BitMaps.indexOf(bit) + 1);
            tipStr += uts.format("花费{0}钻石", TextFieldUtil.getColorText(this.curConfig.m_iCondition2 + "", Color.GREEN));
            tipStr += uts.format("，可立即获得{0}-{1}钻石", TextFieldUtil.getColorText(this.curConfig.m_iMin + "", Color.GREEN),
                TextFieldUtil.getColorText(this.curConfig.m_iMax + "", Color.GREEN)
            );

            //  uts.log(" bit   " + bit + " this.BitMaps.indexOf(bit)   " + this.BitMaps.indexOf(bit) + "   this.curConfig   " + this.curConfig.m_iCondition1);

            let need = (this.curConfig.m_iCondition1 - hfData.hfzcmInfo.m_uiAccCharge);
            if (this.curConfig != null) {
                if (need > 0) {
                    this.txtNextCondition.text = "今日再充值" + TextFieldUtil.getColorText(need + "钻石", Color.GREEN) + "即可再次招猫";
                } else {
                    this.txtNextCondition.text = "";
                }
            } else {
                this.txtNextCondition.text = "";
            }
            UIUtils.setButtonClickAble(this.btnStart, need <= 0 && G.DataMgr.heroData.gold >= this.curConfig.m_iCondition2);
        }

        this.txtCost.text = tipStr;

        this.rankList.Count = hfData.hfzcmInfo.m_ucCount;
        for (let i = 0; i < this.rankList.Count; i++) {
            if (this.hFRecordItems[i] == null) {
                let item = this.rankList.GetItem(i);
                this.hFRecordItems[i] = new HFRecordItem();
                this.hFRecordItems[i].setComponent(item.gameObject);
            }
            this.hFRecordItems[i].update(hfData.hfzcmInfo.m_stRecordList[i], i);
        }

        if (getMoney > 0) {
            this.tryScrollNum1(getMoney);
        }
    }


    private onClickStartScroll() {
        this.isFirstSendMsg = true;
        UIUtils.setButtonClickAble(this.btnStart, false);
        for (let i = 0; i < this.MaxNumCount; i++) {
            this.scrollNums[i].startScroll(delegate(this, this.sendScroll));
        }
    }


    private tryScrollNum1(getMoney: number) {
        let targetNums = this.getAllNum(getMoney);
        for (let i = 0; i < this.MaxNumCount; i++) {
            this.scrollNums[i].scrollTo(targetNums[i]);
        }
        //  UIUtils.setButtonClickAble(this.btnStart, true);
    }

    private sendScroll(): void {
        if (this.isFirstSendMsg) {
            //发协议
            this.isFirstSendMsg = false;
            if (this.curConfig != null)
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getHfhdRequest(Macros.HFHD_ZCM_GET_REWARD, this.curConfig.m_iID));
        }
    }




    private getAllNum(num: number) {
        let nums: number[] = [];
        let wan = Math.floor(num / 10000);
        let qian = Math.floor((num % 10000) / 1000);
        let bai = Math.floor((num % 1000) / 100);
        let shi = Math.floor((num % 100) / 10);
        let ge = Math.floor((num % 10));
        uts.log("   万    " + wan + "   千    " + qian + "    百   " + bai + "  十   " + shi + "  个  " + ge);
        nums.push(wan);
        nums.push(qian);
        nums.push(bai);
        nums.push(shi);
        nums.push(ge);
        return nums;
    }

}