import { Global as G } from 'System/global'
import { TabSubForm } from 'System/uilib/TabForm'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { EnumStoreID, EnumAutoUse } from "System/constants/GameEnum";
import { KeyWord } from 'System/constants/KeyWord'
import { UIUtils } from 'System/utils/UIUtils'
import { DataFormatter } from 'System/utils/DataFormatter'
import { BatBuyView } from 'System/business/view/BatBuyView'
import { DailyRechargeView } from 'System/activity/view/DailyRechargeView'
import { ZhufuData } from 'System/data/ZhufuData'
import { TabSubFormCommon } from '../../uilib/TabFormCommom';

export abstract class SpecialPriBasePanel extends TabSubFormCommon {
    public readonly JJFTickKey = 'jjf';

    /////////////////vip特殊特权加成///////////////
    protected vipTeShuObj: UnityEngine.GameObject;
    //protected specialPriEffect: UnityEngine.GameObject;
    protected specialVipPara = 0;

    protected btnJJF: UnityEngine.GameObject;
    protected textJJFTime: UnityEngine.UI.Text;

    constructor(id: number, specialVipPara: number) {
        super(id);
        this.specialVipPara = specialVipPara;
    }

    protected initElements(): void {
        //vip特权
        this.vipTeShuObj = this.elems.getElement('vipTeShuTeQuan');
        //this.specialPriEffect = ElemFinder.findObject(this.vipTeShuObj, 'effect');

        // 进阶符入口
        this.btnJJF = this.elems.getElement('btnJJF');
        this.textJJFTime = ElemFinder.findText(this.btnJJF, 'textTime');
        uts.assert(null != this.textJJFTime);
    }

    protected initListeners(): void {
        //this.addClickListener(this.vipTeShuObj, this.onClickVipTeShuObj);
        //this.addClickListener(this.btnJJF, this.onClickBtnJJF);
    }

    protected onOpen() {
        // 更新特殊特权
        //this.onSpecialPriChange();
        //this.checkJJF();
    }

    //vip战力加成相关
    onSpecialPriChange() {
        //vip特殊特权加成
        if (this.specialVipPara > 0) {
            let vipData = G.DataMgr.vipData;
            if (vipData.hasBuySpecialPri(this.specialVipPara)) {
                // 已激活
                UIUtils.setGrey(this.vipTeShuObj, false);
                this.vipTeShuObj.SetActive(true);
                //this.specialPriEffect.SetActive(true);
            } else {
                let startDay = vipData.getSpecialPriStartDay(this.specialVipPara);
                let today = G.SyncTime.getDateAfterStartServer();
                if (today >= startDay) {
                    UIUtils.setGrey(this.vipTeShuObj, true);
                    this.vipTeShuObj.SetActive(true);
                    //this.specialPriEffect.SetActive(false);
                } else {
                    this.vipTeShuObj.SetActive(false);
                }
            }
        } else {
            this.vipTeShuObj.SetActive(false);
        }
    }

    private onClickVipTeShuObj() {
        let vipData = G.DataMgr.vipData;
        if (vipData.hasBuySpecialPri(this.specialVipPara)) {
            return;
        }
        let startDay = vipData.getSpecialPriStartDay(this.specialVipPara);
        let today = G.SyncTime.getDateAfterStartServer();
        if (today > startDay) {
            let itemId = vipData.getSpecialPriItemId(this.specialVipPara);
            let items = G.DataMgr.thingData.getBagItemById(itemId, false, 1);
            if (items.length > 0) {
                let item = items[0];
                G.ModuleMgr.bagModule.useThing(item.config, item.data);
            } else {
                G.Uimgr.createForm<BatBuyView>(BatBuyView).open(itemId, 1, EnumStoreID.MALL_YUANBAO, 0, 0, EnumAutoUse.NormalUse);
            }
        } else {
            G.ActBtnCtrl.executeFunc(KeyWord.ACT_FUNCTION_SPECIAL_PRI);
        }
    }

    private checkJJF() {
        let d = G.SyncTime.getDateAfterStartServer();
        let showJJF = false;
        if (d <= 7) {
            let jjrInfo = G.DataMgr.kfhdData.JJRPanelInfo;
            if (jjrInfo && jjrInfo.m_ucType == ZhufuData.getJJRTypeByPanelKeyword(this.id) && !G.DataMgr.firstRechargeData.isNotShowMrczIcon()) {
                showJJF = true;
            }
        } 

        if (showJJF) {
            this.btnJJF.SetActive(true);
            this.textJJFTime.text = uts.format('限时直升8阶\n{0}', DataFormatter.second2hhmmss(G.SyncTime.getServerZeroLeftTime()));
            if (!this.hasTimer(this.JJFTickKey)) {
                this.addTimer(this.JJFTickKey, 1000, 0, delegate(this, this.onJJFTickTimer));
            }
        } else {
            this.btnJJF.SetActive(false);
        }
    }

    private onJJFTickTimer(timer: Game.Timer) {
        this.checkJJF();
    }

    private onClickBtnJJF() {
        G.Uimgr.createForm<DailyRechargeView>(DailyRechargeView).open(1);
    }
}