import { KeyWord } from "System/constants/KeyWord";
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { TipFrom } from "System/tip/view/TipsView";
import { IconItem } from "System/uilib/IconItem";
import { List } from "System/uilib/List";
import { ListItemCtrl } from "System/uilib/ListItemCtrl";
import { TabSubForm } from "System/uilib/TabForm";
import { ElemFinder } from "System/uilib/UiUtility";
import { Color } from "System/utils/ColorUtil";
import { DataFormatter } from "System/utils/DataFormatter";
import { MathUtil } from "System/utils/MathUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { UIUtils } from "System/utils/UIUtils";

class LeiJiChongZhiItem extends ListItemCtrl {

    private textCount: UnityEngine.UI.Text;
    private bt_get: UnityEngine.GameObject;
    private labelBtGet: UnityEngine.UI.Text;
    private bt_go: UnityEngine.GameObject;
    private rewardList: List;
    private icons: IconItem[] = [];
    private cfg: GameConfig.KFSCLBCfgM;
    /**是否可以领取*/
    private isCanGet: boolean = false;


    setComponents(go: UnityEngine.GameObject) {
        this.textCount = ElemFinder.findText(go, 'count');
        this.bt_get = ElemFinder.findObject(go, 'BT_Get');
        this.labelBtGet = ElemFinder.findText(this.bt_get, 'Text');
        this.bt_go = ElemFinder.findObject(go, 'BT_Go');
        this.rewardList = ElemFinder.getUIList(ElemFinder.findObject(go, 'rewardList'));
        Game.UIClickListener.Get(this.bt_get).onClick = delegate(this, this.onItemClickGet);
        Game.UIClickListener.Get(this.bt_go).onClick = delegate(this, this.onItemClickGo);
    }

    update(cfg: GameConfig.KFSCLBCfgM, ljczInfo: Protocol.LJCZInfo) {
        this.cfg = cfg;
        this.textCount.text = uts.format("{0}钻石", cfg.m_uiRechargeLimit);
        let labelStr: string;
        let btnEnable: boolean = false;
        if (ljczInfo) {
            let isGet: boolean = MathUtil.checkPosIsReach(cfg.m_ucLevel - 1, ljczInfo.m_usGetBitMap);
            let canGet: boolean = ljczInfo.m_uiLJZCValue >= cfg.m_uiRechargeLimit;
            btnEnable = canGet && !isGet;
            if (canGet) {
                if (isGet) {
                    //btnEnable = false;
                    //labelStr = "已领取";
                    this.updataBtnStatus(false, true);
                }
                else {
                    //btnEnable = true;
                    //this.isCanGet = true;
                    //labelStr = TextFieldUtil.getColorText("可领取", Color.TIP_GREEN_COLOR);
                    this.updataBtnStatus(false, false);
                }

            }
            else {
                //btnEnable = true;
                //labelStr = "充值领取";
                this.updataBtnStatus(true);
            }
        }
        else {
            this.updataBtnStatus(true);
        }
        //this.labelBtGet.text = labelStr;
        //UIUtils.setButtonClickAble(this.bt_get, btnEnable);
        //显示奖励物品
        let rewardTings = cfg.m_stItemList;
        this.rewardList.Count = rewardTings.length;
        let oldIconCnt = this.icons.length;
        for (let j = 0; j < rewardTings.length; j++) {
            let iconItem: IconItem;
            if (j < oldIconCnt) {
                iconItem = this.icons[j];
            } else {
                this.icons.push(iconItem = new IconItem());
                let rewardItem = this.rewardList.GetItem(j);
                iconItem.setUsuallyIcon(rewardItem.gameObject);
                iconItem.setTipFrom(TipFrom.normal);
            }
            iconItem.updateById(rewardTings[j].m_iID, rewardTings[j].m_iCount);
            iconItem.updateIcon();
        }
    }

    private onItemClickGet() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.GET_LJCZ_REWARD, this.cfg.m_ucLevel));
    }

    private onItemClickGo() {
        G.ActionHandler.go2Pay();
    }

    private updataBtnStatus(isGo: boolean, hasGet: boolean = true) {
        this.bt_go.SetActive(isGo);
        this.bt_get.SetActive(!isGo);
        this.labelBtGet.text = hasGet ? "已领取" : "可领取";
        UIUtils.setButtonClickAble(this.bt_get, !hasGet);
    }

}

/**
 * 日常累充返利
 */
export class LeiJiChongZhiView extends TabSubForm {
    private rewardList: List;
    private leftTime: UnityEngine.UI.Text;
    private rechargeCount: UnityEngine.UI.Text;

    private items: LeiJiChongZhiItem[] = [];

    constructor() {
        super(KeyWord.OTHER_FUNCTION_DAILY_LEICHONGFANLI);
    }

    protected resPath(): string {
        return UIPathData.LeiJiChongZhiView;
    }

    protected initElements() {
        this.rewardList = this.elems.getUIList("rewardList");
        this.leftTime = this.elems.getText("leftTime");
        this.rechargeCount = this.elems.getText("rechargeCount");
    }

    protected initListeners() {
    }

    protected onOpen() {
        let leftTime = G.SyncTime.getServerZeroLeftTime() * 1000;
        this.addTimer("1", leftTime, 1, this.onOpen, 1000, this.onUpdateTime, true);
        this.updateView();
    }

    protected onClose() {
    }

    public updateView(): void {
        let rechargeVal: number = 0;
        this.updateList();
        let ljczInfo: Protocol.LJCZInfo = G.DataMgr.leiJiRechargeData.ljczInfo;
        if (ljczInfo) {
            rechargeVal = ljczInfo.m_uiLJZCValue;
        }
        this.rechargeCount.text = TextFieldUtil.getColorText(G.DataMgr.langData.getLang(201, rechargeVal), Color.ORANGR_YELLOW);
    }

    private updateList(): void {
        let index: number = -1;
        let ljczInfo: Protocol.LJCZInfo = G.DataMgr.leiJiRechargeData.ljczInfo;
        let day: number = G.SyncTime.getDateAfterStartServer();

        let itemCnt = 0;
        let cfgs: GameConfig.KFSCLBCfgM[];
        if (ljczInfo) {
            cfgs = G.DataMgr.firstRechargeData.getSclbConfArrByTDL(KeyWord.GIFT_TYPE_LC, ljczInfo.m_iType, ljczInfo.m_iDay);
            itemCnt = cfgs.length;
        }
        this.rewardList.Count = itemCnt;
        let oldItemCnt = this.items.length;
        for (let i = 0; i < itemCnt; i++) {
            let item: LeiJiChongZhiItem;
            if (i < oldItemCnt) {
                item = this.items[i];
            } else {
                this.items.push(item = new LeiJiChongZhiItem())
                item.setComponents(this.rewardList.GetItem(i).gameObject);
            }
            item.update(cfgs[i], ljczInfo);
        }
    }

    private onUpdateTime(timer: Game.Timer): void {
        if (timer.LeftTime <= 0) {
            this.leftTime.text = "";
        }
        else {
            this.leftTime.text = TextFieldUtil.getColorText(G.DataMgr.langData.getLang(199, DataFormatter.second2day(timer.LeftTime / 1000)), Color.DEFAULT_WHITE);
        }
    }

}