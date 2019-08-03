import { KeyWord } from "System/constants/KeyWord";
import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { TipFrom } from "System/tip/view/TipsView";
import { FixedList } from "System/uilib/FixedList";
import { IconItem } from "System/uilib/IconItem";
import { List } from "System/uilib/List";
import { TabSubForm } from "System/uilib/TabForm";
import { ElemFinder } from "System/uilib/UiUtility";
import { Color } from "System/utils/ColorUtil";
import { DataFormatter } from "System/utils/DataFormatter";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { UIUtils } from "System/utils/UIUtils";
import { VipView, VipTab } from "System/vip/VipView";
import { BtnGroupCtrl } from "../main/BtnGroupCtrl";
import { GameObjectGetSet } from "../uilib/CommonForm";


export class TouZiJiHuaItem {

    private icon: UnityEngine.GameObject;
    private iconItems: IconItem[] = [];
    private btnGet: UnityEngine.GameObject;
    private flagCanGet: UnityEngine.GameObject;

    private data: GameConfig.SevenDayFundCfgM;

    private obj: UnityEngine.GameObject;

    private txtType: UnityEngine.UI.Text;
    private txtGet: UnityEngine.UI.Text;

    private prefab: UnityEngine.GameObject;
    private list: List;
    private flagAlready: GameObjectGetSet;

    setCommponents(go: UnityEngine.GameObject, prefab: UnityEngine.GameObject) {
        this.obj = go;
        this.prefab = prefab;
        this.icon = ElemFinder.findObject(go, "icon");
        this.btnGet = ElemFinder.findObject(go, "btnGet");
        Game.UIClickListener.Get(this.btnGet).onClick = delegate(this, this.onBtnGetClick);
        this.txtGet = ElemFinder.findText(this.btnGet, "txtGet");
        this.flagCanGet = ElemFinder.findObject(go, "flagCanGet");

        this.txtType = ElemFinder.findText(go, "txtType");

        this.list = ElemFinder.getUIList(ElemFinder.findObject(go, "list"));
        this.flagAlready = new GameObjectGetSet(ElemFinder.findObject(go, "flagAlready"));
    }

    update(data: GameConfig.SevenDayFundCfgM) {
        this.data = data;
        this.list.Count = data.m_stItemList.length;

        for (let i = 0; i < this.list.Count; i++) {
            if (this.iconItems[i] == null) {
                let item = this.list.GetItem(i).transform.Find("icon");
                this.iconItems[i] = new IconItem();
                this.iconItems[i].setUsualIconByPrefab(this.prefab, item.gameObject);
                this.iconItems[i].setTipFrom(TipFrom.normal);
            }
            this.iconItems[i].updateById(data.m_stItemList[i].m_iID, data.m_stItemList[i].m_iCount);
            this.iconItems[i].updateIcon();
        }

        let str = "";
        if (data.m_ucFundType == KeyWord.SEVEN_DAY_FUND_TYPE_1) {
            str = "击杀{0}只魂骨boss";
        } else {
            str = "等级达到{0}级";
        }
        this.txtType.text = uts.format(str, TextFieldUtil.getColorText(data.m_iCondition.toString(), Color.GOLD));;

        this.updataBtnStatus();
    }

    onBtnGetClick() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSevenDayFundRequest(Macros.SEVEN_DAY_FUND_GET, this.data.m_ucFundID, this.data.m_ucFundType));
    }

    private updataBtnStatus() {
        let type = this.data.m_ucFundType
        let hasTZData = G.DataMgr.activityData.getSevenDayTZDataByType(type);
        let sevenDayFundData = G.DataMgr.activityData.sevenDayFundData;
        let str: string;
        let enabled: boolean;
        this.flagCanGet.SetActive(false);
        this.flagAlready.SetActive(false);
        if (hasTZData != null) {
            //击杀boss数量>=限制条件
            if (type == KeyWord.SEVEN_DAY_FUND_TYPE_1) {
                if (sevenDayFundData.m_iBossKillNum >= this.data.m_iCondition) {
                    if ((1 << (this.data.m_ucFundID - 1) & hasTZData.m_uiGetFlag) > 0) {
                        str = uts.format("已击杀{0}只BOSS", this.data.m_iCondition);// "已领取";
                        this.flagAlready.SetActive(true);
                        enabled = true;
                    } else {
                        str = "点击领取";
                        enabled = true;
                        this.flagCanGet.SetActive(true);
                    }
                } else {
                    str = "未达成"
                    enabled = false;
                }
            } else {
                if (G.DataMgr.heroData.level >= this.data.m_iCondition) {
                    if ((1 << (this.data.m_ucFundID - 1) & hasTZData.m_uiGetFlag) > 0) {
                        if (type == KeyWord.SEVEN_DAY_FUND_TYPE_2)
                            str = uts.format("已消耗{0}钻石", this.data.m_iCondition);
                        else if (type == KeyWord.SEVEN_DAY_FUND_TYPE_3)
                            str = uts.format("战力达到{0}", this.data.m_iCondition);
                        this.flagAlready.SetActive(true);
                        enabled = true;
                    } else {
                        str = "点击领取";
                        enabled = true;
                        this.flagCanGet.SetActive(true);
                    }
                } else {
                    str = "未达成"
                    enabled = false;
                }
            }
        } else {
            str = "未达成"
            enabled = false;
        }
        this.txtGet.text = str;
        this.btnGet.SetActive(enabled);
        this.txtType.gameObject.SetActive(!enabled);
        UIUtils.setButtonClickAble(this.btnGet, enabled);
    }

}


export abstract class TouZiBasePanel extends TabSubForm {
    /**奖励的天数 7*/
    protected readonly rewardDays: number = 7;
    protected txtTime: UnityEngine.UI.Text;
    protected txtNum: UnityEngine.UI.Text;
    protected btnBuy: UnityEngine.GameObject;
    // protected effectRoot: UnityEngine.GameObject;
    protected rewardList: List;
    protected itemIcon_Normal: UnityEngine.GameObject;
    protected txtBtn: UnityEngine.UI.Text;
    protected touZiJiHuaItems: TouZiJiHuaItem[] = [];

    protected sevenDayFundData: Protocol.SevenDayFundData;
    protected rewardConfig: GameConfig.SevenDayFundCfgM[];

    private strBtn: string = "";
    private enabel: boolean = true;

    private mainTimeCheck: boolean = false;
    private _tmpDate: Date;
    private _timeNum: number;

    /**投资类型 */
    private m_type: number;

    protected tip1: UnityEngine.GameObject;
    protected tip2: UnityEngine.GameObject;
    protected tip3: UnityEngine.GameObject;

    protected initElements() {
        this.txtTime = this.elems.getText("txtTime");
        this.txtNum = this.elems.getText("txtNum");
        this.txtTime.text = "";
        this.txtBtn = this.elems.getText("txtBtn");
        this.txtNum.text = "";
        this.btnBuy = this.elems.getElement("btnBuy");
        // this.effectRoot = this.elems.getElement("effectRoot");
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");

        //属性对比
        this.rewardList = this.elems.getUIList("rewardList");
        this.rewardList.Count = this.rewardDays;
        for (let i = 0; i < this.rewardDays; i++) {
            this.touZiJiHuaItems[i] = new TouZiJiHuaItem();
            let item = this.rewardList.GetItem(i);
            this.touZiJiHuaItems[i].setCommponents(item.gameObject, this.itemIcon_Normal);
        }

        this.tip1 = this.elems.getElement("tip1");
        this.tip2 = this.elems.getElement("tip2");
        this.tip3 = this.elems.getElement("tip3");
        this.tip1.SetActive(false);
        this.tip2.SetActive(false);
        this.tip3.SetActive(false);
    }

    protected initListeners() {
        this.addClickListener(this.btnBuy, this.onClickBuy);
    }

    protected onOpen() {
        this.sevenDayFundData = G.DataMgr.activityData.sevenDayFundData;
        // this.setVipTopPanel(false);
        //根据面板id设置投资类型
        switch (this.id) {
            case KeyWord.SEVEN_DAY_FUND_TYPE_3:
                this.m_type = KeyWord.SEVEN_DAY_FUND_TYPE_3;
                break;
            case KeyWord.SEVEN_DAY_FUND_TYPE_2:
                this.m_type = KeyWord.SEVEN_DAY_FUND_TYPE_2;
                break;
            case KeyWord.SEVEN_DAY_FUND_TYPE_1:
                this.m_type = KeyWord.SEVEN_DAY_FUND_TYPE_1;
                break;
        }
        this.rewardConfig = G.DataMgr.activityData.getSevenDayFundAllConfigs()[this.m_type];
        this.addTimer("1", 1000, 0, this.onTimer);
        this.updatePanel();
    }

    protected onClose() {
        // this.setVipTopPanel(true);
    }

    /**设置vip面板TopPanel的显示 */
    // private setVipTopPanel(isShow: boolean) {
    //     let vipView = G.Uimgr.getForm<VipView>(VipView);
    //     if (vipView != null) {
    //         vipView.setTopPanelActive(isShow);
    //     }
    // }

    updatePanel() {
        // this.rewardConfig.sort(delegate(this, this.rewardSort));
        for (let i = 0; i < this.rewardConfig.length; i++) {
            this.touZiJiHuaItems[i].update(this.rewardConfig[i]);
        }
        this.judgeOneRewardCanGet(this.m_type, this.getFirstSelectIndex());

        let hasTZData = G.DataMgr.activityData.getSevenDayTZDataByType(KeyWord.SEVEN_DAY_FUND_TYPE_1);
        if (hasTZData != null && this.m_type == KeyWord.SEVEN_DAY_FUND_TYPE_1) {
            this.txtNum.text = "当前已累计击杀：" + G.DataMgr.activityData.sevenDayFundData.m_iBossKillNum + "个";
        } else {
            this.txtNum.text = "";
        }
    }

    private rewardSort(a: GameConfig.SevenDayFundCfgM, b: GameConfig.SevenDayFundCfgM): number {
        let type = a.m_ucFundType
        let hasTZData = G.DataMgr.activityData.getSevenDayTZDataByType(type);
        if (hasTZData == null) return 1;
        let sevenDayFundData = G.DataMgr.activityData.sevenDayFundData;
        let indexA: number = -1;
        let indexB: number = -1;

        //击杀boss数量>=限制条件
        if (type == KeyWord.SEVEN_DAY_FUND_TYPE_1) {
            //a 数据 0已领取 1未达到 2可领取 
            if (sevenDayFundData.m_iBossKillNum >= a.m_iCondition) {
                if ((1 << (a.m_ucFundID - 1) & hasTZData.m_uiGetFlag) > 0) {
                    indexA = 0;
                } else {
                    indexA = 2;
                }
            } else {
                indexA = 1;
            }
            //b 数据 0已领取 1未达到 2可领取 
            if (sevenDayFundData.m_iBossKillNum >= b.m_iCondition) {
                if ((1 << (b.m_ucFundID - 1) & hasTZData.m_uiGetFlag) > 0) {
                    indexB = 0;
                } else {
                    indexB = 2;
                }
            } else {
                indexB = 1;
            }
        } else {
            if (G.DataMgr.heroData.level >= a.m_iCondition) {
                if ((1 << (a.m_ucFundID - 1) & hasTZData.m_uiGetFlag) > 0) {
                    indexA = 0;
                } else {
                    indexA = 2;
                }
            } else {
                indexA = 1;
            }

            if (G.DataMgr.heroData.level >= b.m_iCondition) {
                if ((1 << (b.m_ucFundID - 1) & hasTZData.m_uiGetFlag) > 0) {
                    indexB = 0;
                } else {
                    indexB = 2;
                }
            } else {
                indexB = 1;
            }
        }

        if (indexA == indexB) {
            return a.m_iCondition < b.m_iCondition ? -1 : 1;
        }
        else {
            return indexA < indexB ? 1 : -1;
        }
    }

    private updateBtnStatus() {
        this.txtBtn.text = this.strBtn;
        UIUtils.setButtonClickAble(this.btnBuy, this.enabel);
    }

    private getFirstSelectIndex(): number {
        let hasTZData = G.DataMgr.activityData.getSevenDayTZDataByType(this.m_type);
        if (hasTZData != null) {
            for (let i = 0; i < this.rewardDays; i++) {
                //击杀boss数量>=限制条件
                if (this.m_type == KeyWord.SEVEN_DAY_FUND_TYPE_1) {
                    if (this.sevenDayFundData.m_iBossKillNum >= this.rewardConfig[i].m_iCondition && ((1 << (this.rewardConfig[i].m_ucFundID - 1) & hasTZData.m_uiGetFlag) == 0)) {
                        return i;
                    }
                } else {
                    if ((G.DataMgr.heroData.level >= this.rewardConfig[i].m_iCondition) &&
                        ((1 << (this.rewardConfig[i].m_ucFundID - 1) & hasTZData.m_uiGetFlag) == 0)
                    ) {
                        return i;
                    }
                }
            }
        }
        return 0;
    }

    /**
   * 判断一个奖励是否可以领取
   * @param type 类型
   * @param index 第几个奖励
   */
    private judgeOneRewardCanGet(type: number, index: number) {
        let hasTZData = G.DataMgr.activityData.getSevenDayTZDataByType(this.m_type);
        if (hasTZData != null) {
            this.strBtn = "已投资"
            this.enabel = false;

            this.txtTime.gameObject.SetActive(false);
            // this.effectRoot.SetActive(false);
        }
        else {
            //0表示没有购买
            if (G.SyncTime.getDateAfterStartServer() > Macros.MAX_JUHSA_ACT_DAY) {
                this.strBtn = "不可投资"
                this.enabel = false;
                this.txtTime.gameObject.SetActive(false);
                // this.effectRoot.SetActive(false);

            } else {
                this.strBtn = uts.format("投资{0}钻石", this.rewardConfig[0].m_iPrice);// "马上投资";
                this.enabel = true;
                // this.effectRoot.SetActive(true);
                this.updateTime();
                this.txtTime.gameObject.SetActive(true);
            }
        }
        this.updateBtnStatus();
    }

    private onClickBuy() {
        let hasTZData = G.DataMgr.activityData.getSevenDayTZDataByType(this.m_type);
        if (hasTZData == null) {
            if (G.DataMgr.heroData.gold >= this.rewardConfig[0].m_iPrice) {
                //钱够
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSevenDayFundRequest(Macros.SEVEN_DAY_FUND_BUY, this.m_type));
            } else {
                //钱不够
                G.ActionHandler.go2Pay();
            }
        }
    }


    private updateTime(): void {
        // 更新时间
        let startTime = G.SyncTime.m_uiServerStartTime;
        this._tmpDate = new Date();
        this._tmpDate.setTime(startTime * 1000 + Macros.MAX_JUHSA_ACT_DAY * 86400 * 1000);
        this._tmpDate.setTime(G.SyncTime.getFixedTime(this._tmpDate.getFullYear(), this._tmpDate.getMonth() + 1, this._tmpDate.getDate(), 0));
        this._timeNum = (this._tmpDate.getTime() - G.SyncTime.getCurrentTime()) / 1000;
        if (this._timeNum > 0) {
            this.mainTimeCheck = true;
        }
    }


    private onTimer(): void {
        if (this.mainTimeCheck) {
            this._timeNum--;
            if (this._timeNum > 0) {
                this.txtTime.text = TextFieldUtil.getColorText(uts.format('剩余时间：{0}', DataFormatter.second2DayDoubleShort2(this._timeNum)), Color.GREEN);
            }
            else {
                this.mainTimeCheck = false;
                this.txtTime.text = TextFieldUtil.getColorText('', Color.GREEN);
            }
        }
    }

}