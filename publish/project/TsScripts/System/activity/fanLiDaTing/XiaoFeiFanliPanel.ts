import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { ElemFinder } from 'System/uilib/UiUtility'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { DropPlanData } from "System/data/DropPlanData"
import { List } from "System/uilib/List"
import { Color } from "System/utils/ColorUtil"
import { TextFieldUtil } from "System/utils/TextFieldUtil"
import { ProtocolUtil } from "System/protocol/ProtocolUtil"
import { MathUtil } from "System/utils/MathUtil"
import { IconItem } from "System/uilib/IconItem"
import { TipFrom } from 'System/tip/view/TipsView'
import { DataFormatter } from "System/utils/DataFormatter"
import { UIUtils } from 'System/utils/UIUtils'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { PayView } from 'System/pay/PayView'
import { MallView } from 'System/business/view/MallView'

class XiaoFeiFanLiItem extends ListItemCtrl {

    private textCount: UnityEngine.UI.Text;
    private bt_get: UnityEngine.GameObject;
    private labelBtGet: UnityEngine.UI.Text;
    private bt_go: UnityEngine.GameObject;
    private rewardList: List;
    private icons: IconItem[] = [];
    private cfg: GameConfig.KFXFLBCfgM;
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

    update(cfg: GameConfig.KFXFLBCfgM) {
        this.cfg = cfg;
        this.textCount.text = uts.format("{0}钻石", cfg.m_uiRechargeLimit);
        let labelStr: string;
        let btnEnable: boolean = false;
        let data = G.DataMgr.kaifuActData.xfflInfo;
        if (data) {
            let isGet: boolean = MathUtil.checkPosIsReach(cfg.m_ucLevel, data.m_ucGet);
            let canGet: boolean = data.m_iConsume >= cfg.m_uiRechargeLimit;
            btnEnable = canGet && !isGet;
            if (canGet) {
                if (isGet) {
                    this.updataBtnStatus(false, true);
                }
                else {
                    this.updataBtnStatus(false, false);
                }
            }
            else {
                this.updataBtnStatus(true);
            }
        }
        else {
            this.updataBtnStatus(true);
        }
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
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.KFXFLB_GET, this.cfg.m_ucLevel));
    }

    private onItemClickGo() {
        G.Uimgr.createForm<MallView>(MallView).open();
    }

    private updataBtnStatus(isGo: boolean, hasGet: boolean = true) {
        this.bt_go.SetActive(isGo);
        this.bt_get.SetActive(!isGo);
        this.labelBtGet.text = hasGet ? "已领取" : "可领取";
        UIUtils.setButtonClickAble(this.bt_get, !hasGet);
    }

}

/**
 * 消费返利
 */
export class XiaoFeiFanliPanel extends TabSubForm {
    /**开服与循环分割时间14*/
    private readonly actMacDay = 14;

    private rewardList: List;
    private leftTime: UnityEngine.UI.Text;
    private rechargeCount: UnityEngine.UI.Text;

    private items: XiaoFeiFanLiItem[] = [];

    constructor() {
        super(KeyWord.OTHER_FUNCTION_XIAOFEIFANLI);
    }

    protected resPath(): string {
        return UIPathData.XiaoFeiFanLiPanel;
    }

    protected initElements() {
        this.rewardList = this.elems.getUIList("rewardList");
        this.leftTime = this.elems.getText("leftTime");
        this.rechargeCount = this.elems.getText("rechargeCount");
    }

    protected initListeners() {
    }

    protected onOpen() {

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.KFXFLB_OPEN));

        let leftTime = G.SyncTime.getServerZeroLeftTime() * 1000;
        this.addTimer("1", leftTime, 1, this.onOpen, 1000, this.onUpdateTime, true);


       // this.updateView();
      

    }

    protected onClose() {
    }

    public updateView(): void {
        let configs = G.DataMgr.kaifuActData.getCurXFFConfigs();
        //let itemCnt = 0;
        //let cfgs: GameConfig.KFSCLBCfgM[];
        //if (ljczInfo) {
        //    cfgs = G.DataMgr.leiJiRechargeData.getKfljRechargeCfgArr(KeyWord.GIFT_TYPE_LC, ljczInfo.m_iType, ljczInfo.m_iDay);
        //    itemCnt = cfgs.length;
        //}
        this.rewardList.Count = configs.length;
        let oldItemCnt = this.items.length;
        for (let i = 0; i < this.rewardList.Count; i++) {
            let item: XiaoFeiFanLiItem;
            if (i < oldItemCnt) {
                item = this.items[i];
            } else {
                this.items.push(item = new XiaoFeiFanLiItem())
                item.setComponents(this.rewardList.GetItem(i).gameObject);
            }
            item.update(configs[i]);
        }


        this.rechargeCount.text = "今日累计消费：" + TextFieldUtil.getColorText(G.DataMgr.kaifuActData.xfflInfo.m_iConsume + "钻石", Color.GREEN);
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