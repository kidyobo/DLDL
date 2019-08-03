import { Global as G } from 'System/global'
import { BatBuyView } from "System/business/view/BatBuyView";
import { UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { EnumStoreID, EnumAutoUse } from 'System/constants/GameEnum'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { ThingData } from 'System/data/thing/ThingData'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { KeyWord } from 'System/constants/KeyWord'
import { FanLiDaTingView } from 'System/activity/fanLiDaTing/FanLiDaTingView'
import { MeiRiXianGouItem } from 'System/jinjieri/JjrMrxgPanel'
import { MarketItemData } from 'System/data/vo/MarketItemData'
import { NPCSellData } from 'System/data/NPCSellData'
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { Macros } from "System/protocol/Macros";
import { KaiFuHuoDongView } from "System/activity/kaifuhuodong/KaiFuHuoDongView";

export class JinJieRiBatBuyView extends BatBuyView {
    private needDes: UnityEngine.UI.Text;
    private btnRank: UnityEngine.GameObject;
    private item: UnityEngine.GameObject;
    private btnGift: UnityEngine.GameObject;
    private btnClose2: UnityEngine.GameObject;
    private showIcon = new IconItem();
    private giftItem = new MeiRiXianGouItem();

    private readonly showMaxGiftNum: number = 3;

    //开服后第几天在返利大厅显示
    private readonly showFldtDay: number = 7;

    constructor() {
        super();
    }
    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.JinJieRiBatBuyView;
    }

    protected initElements() {
        super.initElements();
        this.needDes = this.elems.getText('needDes');
        this.btnRank = this.elems.getElement('btnRank');
        this.btnGift = this.elems.getElement('btnGift');
        this.btnClose2 = this.elems.getElement('btnClose2');
        this.item = this.elems.getElement('item');
        this.showIcon.setUsualIconByPrefab(this.itemIcon_Normal, this.elems.getElement('showIcon'));
        this.showIcon.setTipFrom(TipFrom.normal);
        this.giftItem.setComponents(this.item, this.itemIcon_Normal);
    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.btnRank, this.onClickRankBtn);
        this.addClickListener(this.btnGift, this.OnClickGiftBtn);
        this.addClickListener(this.btnClose2, this.OnClickCloseBtn);

    }

    open(id: number, number: number, storeID: EnumStoreID = 0, excID = 0, amount = 0, autoUse: EnumAutoUse = EnumAutoUse.none) {
        super.open(id, number, storeID, excID, amount, autoUse);
    }

    protected onOpen() {
        super.onOpen();
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.STAGEDAT_RANK_OPEN_PANEL));
        this.updateView();

    }

    updateView() {
        let kfhdData = G.DataMgr.kfhdData;
        let jinJieRankInfo = kfhdData.jinJieRankInfo;
        let cfg = jinJieRankInfo.m_stCfgInfo;
        let thingCfg = ThingData.getThingConfig(cfg.m_iCostItemID);

        let shareCfg = cfg.m_stOtherItem[0];
        let rewThingConfig = ThingData.getThingConfig(shareCfg.m_uiOne);
        let rewName = TextFieldUtil.getColorText(rewThingConfig.m_szName, Color.getColorById(rewThingConfig.m_ucColor));
        this.showIcon.updateById(shareCfg.m_uiOne, shareCfg.m_uiTwo);

        this.showIcon.updateIcon();
        let sysName = TextFieldUtil.getColorText(thingCfg.m_szName, Color.getColorById(thingCfg.m_ucColor));
        if (jinJieRankInfo.m_iMyRank > 0) {
            if (jinJieRankInfo.m_iMyRank == 1) {
                this.needDes.text = '当前排名：1';
            }
            else {
                this.needDes.text = uts.format('再消耗{0}个{1}可提升排名',
                    TextFieldUtil.getColorText(jinJieRankInfo.m_iNeedCost.toString(), Color.GREEN), sysName);
            }
        }
        else {
            this.needDes.text = uts.format('还差{0}个{1}可获得{2}*1',
                TextFieldUtil.getColorText(jinJieRankInfo.m_iNeedCost.toString(), Color.GREEN), sysName, rewName);
        }

        let pageData: MarketItemData[] = G.DataMgr.npcSellData.getMallLimitList();

        for (let i = 0; i < this.showMaxGiftNum; i++) {
            let data = pageData[i];
            if (i < this.showMaxGiftNum - 1) {
                if (data.sellLimitData.getRestCount() > 0) {
                    this.giftItem.update(data);
                    break;
                }
            }
            else {
                this.giftItem.update(data);
            }
        }

    }

    private onClickRankBtn() {
        this.close();
        if (G.SyncTime.getDateAfterStartServer() > this.showFldtDay) {
            G.Uimgr.createForm<FanLiDaTingView>(FanLiDaTingView).open(KeyWord.OTHER_FUNCTION_JJR_RANK_AFTER7DAY);
        }
        else {
            if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_JJR_RANK)) {
                G.Uimgr.createForm<KaiFuHuoDongView>(KaiFuHuoDongView).open(KeyWord.OTHER_FUNCTION_JJR_RANK);
            }
            else {
                uts.log('功能未开启');
            }
        }
    }

    private OnClickGiftBtn() {
        this.close();
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_JJR_MRXG, 0, 0, KeyWord.OTHER_FUNCTION_JJR_MRXG);
        // G.Uimgr.createForm<FanLiDaTingView>(FanLiDaTingView).open(KeyWord.OTHER_FUNCTION_JJR_MRXG);
    }

    private OnClickCloseBtn() {
        this.close();
    }
}
export default JinJieRiBatBuyView;