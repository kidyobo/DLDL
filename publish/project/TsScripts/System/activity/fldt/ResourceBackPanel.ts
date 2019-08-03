import { DataFormatter } from './../../utils/DataFormatter';
import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ConfirmCheck, MessageBoxConst } from 'System/tip/TipManager'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { IconItem } from 'System/uilib/IconItem'
import { FuncLimitData } from 'System/data/FuncLimitData'
import { TipFrom } from 'System/tip/view/TipsView'
import { VipView, VipTab } from 'System/vip/VipView'
import { Constants } from '../../constants/Constants';
import { FuLiDaTingView } from 'System/activity/fldt/FuLiDaTingView'
class ResourceBackItem extends ListItemCtrl {

    private itemData: Protocol.CSZYZHOneInfo;

    private rewardList: List;
    private items: IconItem[] = [];

    private nameImage: UnityEngine.UI.Text;
    private textTime: UnityEngine.UI.Text;
    private btnFree: UnityEngine.UI.Image;
    /**魂币 */
    private btnhunbi: UnityEngine.GameObject; 
    private hunbiTxt:UnityEngine.UI.Text;
    /**绑定元宝 */
    private btnBangYuan: UnityEngine.GameObject;
    private bangYuanTxt:UnityEngine.UI.Text;

    private max_rewardCount: number = 5;
    private nameAltas: Game.UGUIAltas;
    private fulidatingView: FuLiDaTingView;
    private awardName: { [index: number]: string } = null;
    private getAwardName(index: number): string {
        if (this.awardName == null) {
            this.awardName = {};
            this.awardName[1] = "剧情副本";
            this.awardName[2] = "组队副本";
            this.awardName[3] = "经验副本";
            this.awardName[4] = "装备副本";
            this.awardName[5] = "";
            this.awardName[6] = "腐毒之窟";
            this.awardName[7] = "炎魔守护";
            this.awardName[8] = "勇闯神殿";
            this.awardName[9] = "护送战车";
            this.awardName[10] = "宗门任务";
            this.awardName[11] = "日常任务";
            this.awardName[12] = "答题活动";
            this.awardName[13] = "人鱼湖畔";
            this.awardName[14] = "每日必做";
            this.awardName[15] = "多人Boss";
            this.awardName[16] = "神魔地宫";
            this.awardName[17] = "";
            this.awardName[18] = "VIP1副本";
            this.awardName[19] = "VIP2副本";
            this.awardName[20] = "VIP3副本";
            this.awardName[21] = "宝石试炼";
            this.awardName[22] = "圣柱台";
            this.awardName[23] = "神殿试炼";
            this.awardName[24] = "盾御苍穹";
            this.awardName[25] = "宝物秘境";
            this.awardName[26] = "魂币副本";
        }
        return this.awardName[index];
    }

    setComponents(go: UnityEngine.GameObject, altas: Game.UGUIAltas) {
        this.nameImage = ElemFinder.findText(go, 'txtName');
        this.textTime = ElemFinder.findText(go, 'textTime');
        this.rewardList = ElemFinder.getUIList(ElemFinder.findObject(go, 'rewardList'));
        this.btnFree = ElemFinder.findImage(go, 'btnFree');
        //绑钻
        this.btnBangYuan = ElemFinder.findObject(go, 'btnBangYuanbao');
        this.bangYuanTxt = ElemFinder.findText(go, 'btnBangYuanbao/bangYuanTxt');
        //魂币
        this.btnhunbi = ElemFinder.findObject(go, 'btnhunbi');
        this.hunbiTxt = ElemFinder.findText(go, 'btnhunbi/hunbiTxt');

        this.nameAltas = altas;
        Game.UIClickListener.Get(this.btnFree.gameObject).onClick = delegate(this, this.onClickBtnFree);
        Game.UIClickListener.Get(this.btnhunbi).onClick = delegate(this, this.onClickBtnHunBi);
        Game.UIClickListener.Get(this.btnBangYuan).onClick = delegate(this, this.onClickBtnBangYuan);
        this.rewardList.Count = this.max_rewardCount;
        for (let i = 0; i < this.max_rewardCount; i++) {
            let iconItem = new IconItem();
            iconItem.setUsuallyIcon(this.rewardList.GetItem(i).gameObject);
            iconItem.setTipFrom(TipFrom.normal);
            this.items.push(iconItem);
        }
    }

    update(vo: Protocol.CSZYZHOneInfo) {
        this.itemData = vo;
        let cfg = G.DataMgr.zyzhData.getCfgById(vo.m_iID);
        if (cfg.m_iID == 2) {
            cfg.m_szName = '组队副本';
        }
        //m_uiNeedMoney 绑钻
        this.bangYuanTxt.text = this.itemData.m_uiNeedMoney.toString();
        //m_uiNeedBindMoney 魂币
        this.hunbiTxt.text = DataFormatter.cutWan(this.itemData.m_uiNeedBindMoney );
        //this.nameImage.sprite = this.nameAltas.Get(cfg.m_szName);
        this.nameImage.text = this.getAwardName(vo.m_iID);
        this.textTime.text = uts.format('离线补偿天数：{0}天', vo.m_ucDayCount);
        //for (let i = 0; i < vo.m_ucCount; i++) {
        //    if (vo.m_iID == 10&&vo.m_astThingList[0].m_uiThingCount==0) {
        //        if (i == vo.m_ucCount - 1) {
        //            this.items[i].updateById(0);
        //        } else {
        //            this.items[i].updateById(vo.m_astThingList[i + 1].m_uiThingID, vo.m_astThingList[i + 1].m_uiThingCount);
        //        }
        //    }else{
        //        this.items[i].updateById(vo.m_astThingList[i].m_uiThingID, vo.m_astThingList[i].m_uiThingCount);
        //    }
        //    this.items[i].updateIcon();
        //}


        let arr: Protocol.CSZYZHOneThing[] = [];
        for (let i = 0; i < vo.m_ucCount; i++) {
            if (vo.m_astThingList[i]) {
                if (vo.m_astThingList[i].m_uiThingCount > 0) {
                    arr.push(vo.m_astThingList[i]);
                }
            } else {
                uts.logError("资源找回数据错误:" + JSON.stringify(vo));
            }
        }
        let len = arr.length;
        for (let i = 0; i < len; i++) {
            this.items[i].updateById(arr[i].m_uiThingID, arr[i].m_uiThingCount);
            this.items[i].updateIcon();
        }
        for (let j = len; j < this.max_rewardCount; j++) {
            this.items[j].updateById(0);
            this.items[j].updateIcon();
        }

        UIUtils.setGrey(this.btnFree.gameObject, (0 != vo.m_bFreeRetrieve), false);
        this.btnFree.raycastTarget = (0 == vo.m_bFreeRetrieve);
    }

    private onClickBtnFree() {
        this.doGetBack(0);
    }

    private onClickBtnHunBi() {
        //2魂币
        this.doGetBack(2);
    }

    private onClickBtnBangYuan(){
        //1 钻石  绑钻
        this.doGetBack(1);
    }
    private doGetBack(isFree: number) {
        //1 钻石  绑钻 2魂币
        // if (isFree == 1) {
        //     let openLevels = G.DataMgr.vipData.getPrivilegeLevels(KeyWord.VIP_PARA_HIGH_ZYZH);
        //     if (G.DataMgr.heroData.getPrivilegeState(openLevels[0]) < 0) {
        //         G.TipMgr.showConfirm(uts.format('激活{0}可使用资源找回', TextFieldUtil.getMultiVipMonthTexts(openLevels)), ConfirmCheck.noCheck, '确定|取消', delegate(this, this._onZzzhVipConfirm));
        //         return;
        //     }
        // }
        let str: string;
        if (isFree == 1) {
            ///1 钻石  绑钻
            str = uts.format('是否花费{0}，找回该活动全部经验和道具', TextFieldUtil.getGoldBindText(this.itemData.m_uiNeedMoney));
        }else if(isFree==2){
            // 2魂币
            str = uts.format('是否花费{0}，找回该活动部分经验和道具', TextFieldUtil.getTongqianText(this.itemData.m_uiNeedBindMoney));
        }
        else {
            str = '是否免费找回该活动70%的经验？';
        }
        if (ResourceBackPanel.noPromp) {
            //勾选不在提示的情况下
            this._onConfirmGetReward(MessageBoxConst.yes, ResourceBackPanel.noPromp, isFree, this.itemData.m_iID);
        }
        else {
            G.TipMgr.showConfirm(str, ConfirmCheck.withCheck, '确定|取消', delegate(this, this.onConfirmClick, isFree));
        }
    }


    private _onZzzhVipConfirm(state: MessageBoxConst, isCheckSelected: boolean) {
        if (state == MessageBoxConst.yes) {
            this.fulidatingView = G.Uimgr.getForm<FuLiDaTingView>(FuLiDaTingView);
            this.fulidatingView.close();
            G.Uimgr.createForm<VipView>(VipView).open(VipTab.ZunXiang);
        }
    }



    private onConfirmClick(state: MessageBoxConst, isCheckSelected: boolean, isFree: number) {
        this._onConfirmGetReward(state, isCheckSelected, isFree, this.itemData.m_iID);
    }

    private _onConfirmGetReward(state: MessageBoxConst, isCheckSelected: boolean, isYuanBao: number, id: number): void {
        //1 钻石 绑钻  2 魂币
        if (MessageBoxConst.yes == state) {
            ResourceBackPanel.noPromp = isCheckSelected;
            let bindYuanBao :number;  //绑钻换算(绑钻不足则消耗元宝)
            let userBindYuanBao:number;  //玩家自身绑定的元宝
            let keyString: number;
            let yuanBaoNum: number;
            if (isYuanBao == 1) {
                //绑钻
                bindYuanBao = this.itemData.m_uiNeedMoney;
                userBindYuanBao = G.DataMgr.getOwnValueByID(KeyWord.MONEY_YUANBAO_BIND_ID);
                keyString = KeyWord.MONEY_YUANBAO_BIND_ID;
                yuanBaoNum = bindYuanBao;
            }else{
                //魂币
                bindYuanBao = this.itemData.m_uiNeedBindMoney;
                userBindYuanBao = G.DataMgr.getOwnValueByID(KeyWord.MONEY_TONGQIAN_ID);
                keyString = KeyWord.MONEY_TONGQIAN_ID;
                yuanBaoNum = bindYuanBao;
            }
            if(bindYuanBao > userBindYuanBao&&isYuanBao == 1) {
                keyString = KeyWord.MONEY_YUANBAO_ID;
                yuanBaoNum = this.itemData.m_uiNeedMoney;
                G.TipMgr.showConfirm('是否花费钻石找回',ConfirmCheck.noCheck, '确定|取消',delegate(this,this.comfirm,isYuanBao,keyString,yuanBaoNum,id));
            }else{
                if (isYuanBao == 0 || 0 == G.ActionHandler.getLackNum(keyString, yuanBaoNum, true)) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTimeBoxRewardRequest(isYuanBao, id));
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTimeBoxPannelRequest());
                }
            }
        }
    }
    private comfirm(state: MessageBoxConst,isCheckSelected: boolean = true,isYuanBao: number,keyString: number,yuanBaoNum:number,id:number){
        if (state == MessageBoxConst.yes) {
            if (0 == G.ActionHandler.getLackNum(keyString, yuanBaoNum, true)) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTimeBoxRewardRequest(isYuanBao, id));
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTimeBoxPannelRequest());
            }
        }
    }
}

/**
 * 资源找回。
 */
export class ResourceBackPanel extends TabSubForm {

    static noPromp: boolean = false;

    private list: List;
    //提示信息
    private promptText: UnityEngine.UI.Text;
    private items: ResourceBackItem[] = [];
    private nameAltas: Game.UGUIAltas;
    private btnBangZhiZun: UnityEngine.GameObject;
    private fulidatingView: FuLiDaTingView;
    private btnAllHunBiBak:UnityEngine.GameObject;
    constructor() {
        super(KeyWord.OTHER_FUNCTION_ZYZH);
    }

    protected resPath(): string {
        return UIPathData.ResourceBackView;
    }

    protected initElements() {
        this.list = this.elems.getUIList('list');
        this.promptText = this.elems.getText('promptText');
        this.nameAltas = ElemFinderMySelf.findAltas(this.elems.getElement('nameAltas'));
        this.btnBangZhiZun = this.elems.getElement('btnBangZhiZun');
        this.btnAllHunBiBak = this.elems.getElement('btnAllHunBiBak');
    }

    protected initListeners() {
        this.addClickListener(this.elems.getElement('btnAllFree'), this.onClickBtnFree);
        this.addClickListener(this.btnBangZhiZun, this.onClickBtnBangAllBack);
        this.addClickListener(this.btnAllHunBiBak, this.onClickBtnHunBi);
    }

    private onClickBtnFree() {
        this.doGetAllBack(0);
    }

    private onClickBtnBangAllBack() {
        //1 绑元 钻石
        this.doGetAllBack(1);
    }
    private onClickBtnHunBi() {
        //2 魂币
        this.doGetAllBack(2);
    }
    private _onZzzhVipConfirm(state: MessageBoxConst, isCheckSelected: boolean) {
        if (state == MessageBoxConst.yes) {
            this.fulidatingView = G.Uimgr.getForm<FuLiDaTingView>(FuLiDaTingView);
            this.fulidatingView.close();
            G.Uimgr.createForm<VipView>(VipView).open(VipTab.ZunXiang);
        }
    }


    private doGetAllBack(isFree: number) {
        let zyzhData = G.DataMgr.zyzhData;
        if (null == zyzhData.data || zyzhData.data.m_ucNumber <= 0) {
            return;
        }
        // if (isFree == 1) {
        //     let openLevels = G.DataMgr.vipData.getPrivilegeLevels(KeyWord.VIP_PARA_HIGH_ZYZH);
        //     if (G.DataMgr.heroData.getPrivilegeState(openLevels[0]) < 0) {
        //         G.TipMgr.showConfirm(uts.format('激活{0}可使用资源找回', TextFieldUtil.getMultiVipMonthTexts(openLevels)), ConfirmCheck.noCheck, '确定|取消', delegate(this, this._onZzzhVipConfirm));
        //         return;
        //     }
        // }

        let str: string;
        if (isFree == 1) {
            //钻石
            str = uts.format('是否花费{0}找回全部奖励', TextFieldUtil.getGoldBindText(this.getAllCost(1)));
        }else if(isFree == 2){
            //绑元
            str = uts.format('是否花费{0}找回全部奖励', TextFieldUtil.getTongqianText(this.getAllCost(2)));
        }
        else {
            str = '是否免费找回全部活动的70%资源？';
        }
        if (ResourceBackPanel.noPromp) {
            this._onConfirmGetAllReward(MessageBoxConst.yes, ResourceBackPanel.noPromp, isFree);
        }
        else {
            G.TipMgr.showConfirm(str, ConfirmCheck.withCheck, '确定|取消', delegate(this, this.onConfirmAllClick, isFree));
        }
    }

    private onConfirmAllClick(state: MessageBoxConst, isCheckSelected: boolean, isFree: number) {
        this._onConfirmGetAllReward(state, isCheckSelected, isFree);
    }

    private _onConfirmGetAllReward(state: MessageBoxConst, isCheckSelected: boolean, isYuanbao: number): void {
        if (MessageBoxConst.yes == state) {
            ResourceBackPanel.noPromp = isCheckSelected;
            let keyString: number;
            let yuanBaoNum: number;
            let bindYuanBao:number;
            let userBindYuanBao:number;
            if (isYuanbao == 1) {
                bindYuanBao = this.getAllCost(1);  //绑钻换算(绑钻不足则消耗元宝)
                userBindYuanBao = G.DataMgr.getOwnValueByID(KeyWord.MONEY_YUANBAO_BIND_ID);  //玩家自身绑定的元宝
                //绑钻
                keyString = KeyWord.MONEY_YUANBAO_BIND_ID;
                yuanBaoNum = bindYuanBao;
            }else{
                bindYuanBao = this.getAllCost(2);  //魂币
                userBindYuanBao = G.DataMgr.getOwnValueByID(KeyWord. MONEY_TONGQIAN_ID);  //玩家自身绑定的元宝
                //魂币
                keyString = KeyWord.MONEY_TONGQIAN_ID;
                yuanBaoNum = bindYuanBao;
            }
            if(bindYuanBao > userBindYuanBao&&isYuanbao==1){
                //绑钻不足的时候消耗钻石
                keyString = KeyWord.MONEY_YUANBAO_ID;
                yuanBaoNum = bindYuanBao / Constants.SummonBindRate;
                G.TipMgr.showConfirm('是否花费钻石找回',ConfirmCheck.noCheck, '确定|取消',delegate(this,this.comfirm,isYuanbao,keyString,yuanBaoNum,0));
            }else{
                if (isYuanbao == 0 || 0 == G.ActionHandler.getLackNum(keyString, yuanBaoNum, true)) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTimeBoxRewardRequest(isYuanbao, 0));
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTimeBoxPannelRequest());
                }
            }
        }
    }
    private comfirm(state: MessageBoxConst,isCheckSelected: boolean = true,isYuanBao: number,keyString: number,yuanBaoNum:number,id:number){
        if (state == MessageBoxConst.yes) {
            if (0 == G.ActionHandler.getLackNum(keyString, yuanBaoNum, true)) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTimeBoxRewardRequest(isYuanBao, id));
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTimeBoxPannelRequest());
            }
        }
    }
    private getAllCost(money:number): number {
        let zyzhData = G.DataMgr.zyzhData;
        let totalCost = 0;
        if (null != zyzhData.data && zyzhData.data.m_ucNumber > 0) {
            for (let itemData of zyzhData.data.m_astZYZHOneInfo) {
                if (money == 1) {
                    //钻石 绑钻
                    totalCost += itemData.m_uiNeedMoney;
                }else if(money == 2){
                    //魂币
                    totalCost += itemData.m_uiNeedBindMoney;
                }
            }
        }
        return totalCost;
    }

    protected onOpen() {
        // 拉取数据
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTimeBoxPannelRequest());
    }

    protected onClose() {
    }
 
    updateView(): void {
        let zyzhData = G.DataMgr.zyzhData;
        let cnt = 0;
        if (null != zyzhData.data) {
            cnt = zyzhData.data.m_ucNumber;
            this.promptText.text = '';
        }
        //没有得到资源找回的数据
        if (cnt == 0) {
            this.promptText.text = '当前无可找回资源';
        }
        UIUtils.setGrey(this.btnAllHunBiBak, cnt == 0);
        UIUtils.setGrey(this.btnBangZhiZun, cnt == 0);
        this.list.Count = cnt;
        let oldItemCnt = this.items.length;
        let item: ResourceBackItem;
        for (let i = 0; i < cnt; i++) {
            if (i < oldItemCnt) {
                item = this.items[i];
            } else {
                this.items.push(item = new ResourceBackItem());
                item.setComponents(this.list.GetItem(i).gameObject, this.nameAltas);
            }
            item.update(zyzhData.data.m_astZYZHOneInfo[i]);
        }
    }
}