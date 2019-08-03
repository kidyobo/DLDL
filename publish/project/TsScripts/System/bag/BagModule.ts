import { FanLiDaTingView } from "System/activity/fanLiDaTing/FanLiDaTingView";
import { FuLiDaTingView } from "System/activity/fldt/FuLiDaTingView";
import { YiYuanDuoBaoView } from "System/activity/YunYingHuoDong/YiYuanDuoBaoView";
import { BagItemData } from "System/bag/BagItemData";
import { BagView } from "System/bag/view/BagView";
import { DecomposeView } from "System/bag/view/DecomposeView";
import { FourInOneView } from "System/bag/view/FourInOneView";
import { LotteryBoxView } from "System/bag/view/LotteryBoxView";
import { EnumThingID } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { BuffData } from "System/data/BuffData";
import { HeroData } from "System/data/RoleData";
import { ThingData } from "System/data/thing/ThingData";
import { ThingItemData } from "System/data/thing/ThingItemData";
import { RewardIconItemData } from "System/data/vo/RewardIconItemData";
import { ZhufuData } from "System/data/ZhufuData";
import { DiamondUpPanel } from "System/equip/DiamondUpPanel";
import { EquipView } from "System/equip/EquipView";
import { ZhufuEquipUpColorView } from "System/equip/ZhufuEquipUpColorView";
import { EventDispatcher } from "System/EventDispatcher";
import { FaQiView } from "System/faqi/FaQiiView";
import { FaQiPanelTag } from "System/faqi/FaQiJinJiePanel";
import { Global as G } from "System/global";
import { OpenChestView } from "System/guide/OpenChestView";
import { HeroView } from "System/hero/view/HeroView";
import { TitleView } from "System/hero/view/TitleView";
import { JishouView } from "System/jishou/JishouView";
import { SellView } from "System/jishou/SellView";
import { JiuXingView } from "System/jiuxing/JiuXingView";
import { JuYuanView } from "System/juyuan/JuYuanView";
import { LingBaoOverDueView } from "System/lingbaoguoqi/LingBaoOverDueView";
import { SendFlowerView } from "System/Marry/SendFlowerView";
import { ItemMergeView } from "System/Merge/ItemMergeView";
import { PetJinJieFuncTab } from "System/pet/PetJinJiePanel";
import { PetView } from "System/pet/PetView";
import { BossView } from "System/pinstance/boss/BossView";
import { ErrorId } from "System/protocol/ErrorId";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { ShengQiView } from "System/shengqi/ShengQiView";
import { SkillView } from "System/skill/view/SkillView";
import { TanBaoExchangeView } from "System/tanbao/TanBaoExchangeView";
import { TanBaoStoreView } from "System/tanbao/TanBaoStoreView";
import { TanBaoView } from "System/tanbao/TanBaoView";
import { ShieldGodView } from 'System/shield/ShieldGodView'
import { ConfirmCheck } from "System/tip/TipManager";
import { MessageBoxConst } from "System/tip/TipManager";
import { Color } from "System/utils/ColorUtil";
import { GameIDUtil } from "System/utils/GameIDUtil";
import { PendBatchCall } from "System/utils/PendBatchCallUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { ThingIDUtil } from "System/utils/ThingIDUtil";
import { SpecialTeQuanView } from "System/vip/SpecialTeQuanView";
import { SecondChargeView } from "System/activity/view/SecondChargeView";
import { RenameView } from "System/hero/view/RenameView";
import { ChongZhiKuangHuanView } from "System/activity/newKaiFuAct/ChongZhiKuangHuanView"
import { YiYuanDuoBaoGroupType } from "System/activity/YunYingHuoDong/YiYuanDuoBaoView"
import { NewYearActView } from 'System/activity/view/NewYearActView'
import { FanXianTaoView } from 'System/equip/FanXianTaoView'
import { HunLiView } from 'System/hunli/HunLiView'
import { HunGuView } from 'System/hungu/HunGuView'
import { MallView } from 'System/business/view/MallView'
import { EnumStoreID } from 'System/constants/GameEnum'
import { JinjieView } from "System/jinjie/view/JinjieView"
import { KuaiSuShengJiView } from "System/activity/view/KuaiSuShengJiView"
import { ActHomeView } from "System/activity/actHome/ActHomeView"
import { VipView } from 'System/vip/VipView';
import { KaiFuHuoDongView } from "System/activity/kaifuhuodong/KaiFuHuoDongView"
import { RankView } from "System/rank/RankView"
import { XXDDMainView } from 'System/diandeng/XXDDMainView'
import { ExchangeView } from 'System/business/view/ExchangeView'
import { StarsTreasuryView } from "System/activity/xingdoubaoku/StarsTreasuryView";
import { StarsStoreView } from "System/activity/xingdoubaoku/StarsStoreView";
import { Constants } from 'System/constants/Constants'
import { GuildView } from "../guild/view/GuildView";
import { PinstanceHallView } from "../pinstance/hall/PinstanceHallView";
import { YuanGuJingPaiView } from 'System/pinstance/boss/YuanGuJingPaiView'
import { ShiZhuangPanel } from "../hero/view/ShiZhuangPanel";
import { SevenDayView } from 'System/activity/fldt/sevenDayLogin/SevenDayView'
import { LuckyCatView } from "../activity/luckyCat/LuckyCatView";
import { MeiRiLiBaoView } from "../activity/YunYingHuoDong/MeiRiLiBaoView";


export class BagModule extends EventDispatcher {

    private readonly guajiMaxTime = 20 * 60 * 60;

    /**背包界面点击选择的Item数据*/
    selectItemData: BagItemData = new BagItemData();

    /**背包对话框*/
    private m_bagDialog: BagView;

    /**是否已经请求仓库数据*/
    private m_hasRequestedStoreData: boolean = false;

    /**仓库数据是否非法。*/
    private m_isStoreDataInvalid: boolean = false;

    /**容器的数据管理引用*/
    private m_thingsData: ThingData;

    /**在线开背包的剩余时间，单位为秒。*/
    private m_unlockLeftTime: number = 0;

    /**是否不再提示丢弃物品。*/
    private m_noPromptDestroy: boolean;

    /**是否不再提示使用非绑定物品。*/
    private m_noPromptBind: boolean;

    /**背包开格子的回调函数。*/
    private m_unlockBagCallback: Function;

    /**场景是否初始化，临时添加*/
    public isSceneInit: boolean = false;

    /**改名卡计时时间*/
    private m_renameCd: number = 0;
    constructor() {
        super();

        this.m_thingsData = G.DataMgr.thingData;
        this.addNetListener(Macros.MsgID_ContainerChanged_Notify, this.onContainerNotify);
        //交易所
        this.addNetListener(Macros.MsgID_PPStoreQuery_Response, this.onStoreQueryResponse);
        this.addNetListener(Macros.MsgID_PPStoreBuy_Response, this.onBuyResponse);
        this.addNetListener(Macros.MsgID_PPStoreGetAllThingNum_Response, this.StoreGetAllThingNumResponse);
        //出售我的物品
        this.addNetListener(Macros.MsgID_PPStoreDispMy_Response, this.onMyStoreQueryResponse);
        this.addNetListener(Macros.MsgID_PPStoreSell_Response, this.onUpdateList);
        this.addNetListener(Macros.MsgID_PPStoreCancelMy_Response, this.onCanelResponse);
        this.addNetListener(Macros.MsgID_ItemMerge_Response, this.onItemMergeResponse);
        this.addNetListener(Macros.MsgID_OpenBox_Notify, this.onOpenBoxNotify);

        //魂骨升华
        this.addNetListener(Macros.MsgID_HunGuMerge_Response, this.onHunguMergeResponse);

    }

    ////////////////////////////////////////////////////////////数据相关////////////////////////////////////////////////////

    private onItemMergeResponse(msg: Protocol.ItemMerge_Response) {
        let itemMergeView = G.Uimgr.getForm<ItemMergeView>(ItemMergeView);
        if (itemMergeView != null) {
            itemMergeView.onItemMergeResponse();
        }
    }

    private onOpenBoxNotify(notify: Protocol.OpenBox_Notify) {
        let desc: string;
        let itemCfg = ThingData.getThingConfig(notify.m_iThingID);
        if (notify.m_iThingCount == 1) {
            desc = uts.format('您使用了{0}，获得：', TextFieldUtil.getItemText(itemCfg));
        } else {
            desc = uts.format('您使用了{0}×{1}，获得：', TextFieldUtil.getItemText(itemCfg), notify.m_iThingCount);
        }

        // 奖励列表
        let itemDatas: RewardIconItemData[] = [];
        let bagItemCnt = notify.m_stSrcThingList.m_iThingNumber;
        let notBagItemCnt = notify.m_ucTypeCount;
        let cnt = bagItemCnt + notBagItemCnt;
        for (let i = 0; i < notBagItemCnt; i++) {
            let itemInfo = notify.m_stItemList[i];
            let itemData = new RewardIconItemData();
            itemData.id = itemInfo.m_iID;
            itemData.number = itemInfo.m_iCount;
            itemDatas.push(itemData);
        }
        for (let i = 0; i < bagItemCnt; i++) {
            let itemInfo = notify.m_stSrcThingList.m_astThingObj[i].m_stInfo;
            let itemData = new RewardIconItemData();
            itemData.id = itemInfo.m_iThingID;
            itemData.number = itemInfo.m_iNumber;
            itemDatas.push(itemData);
        }

        G.Uimgr.createForm<OpenChestView>(OpenChestView).open(desc, itemDatas);
    }

    private onMyStoreQueryResponse(msg: Protocol.PPStoreDispMy_Response) {
        let jishouView = G.Uimgr.getForm<JishouView>(JishouView);
        if (jishouView != null) {
            jishouView.onMyStoreQueryResponse(msg);
        }
    }

    private onUpdateList(msg: Protocol.PPStoreSell_Response) {
        let jishouView = G.Uimgr.getForm<JishouView>(JishouView);
        if (jishouView != null) {
            jishouView.onUpdateList(msg);
        }
    }

    private onCanelResponse(msg: Protocol.PPStoreCancelMy_Response) {
        let jishouView = G.Uimgr.getForm<JishouView>(JishouView);
        if (jishouView != null) {
            jishouView.onCanelResponse(msg);
        }
    }

    private onStoreQueryResponse(msg: Protocol.PPStoreQuery_Response) {
        let jishouView = G.Uimgr.getForm<JishouView>(JishouView);
        if (jishouView != null) {
            jishouView._onStoreQueryResponse(msg);
            jishouView._onSellQueryResponse(msg);
        }

    }

    private onBuyResponse(msg: Protocol.PPStoreBuy_Response) {
        let jishouView = G.Uimgr.getForm<JishouView>(JishouView);
        if (jishouView != null) {
            jishouView._onBuyResponse(msg);
        }
    }

    private StoreGetAllThingNumResponse(msg: Protocol.PPStoreGetAllThingNum_Response) {
        let jishouView = G.Uimgr.getForm<JishouView>(JishouView);
        if (jishouView != null) {
            jishouView._onStoreGetAllThingNumResponse(msg);
        }
    }

    private onHunguMergeResponse(msg: Protocol.HunGuMerge_Response) {
        if (msg.m_usType == Macros.HUNGU_OP_UPCOLOR) {
            G.DataMgr.hunliData.hunguMergeData.onHunguMergeResponse(msg);
        }
        else if (msg.m_usType == Macros.HUNGU_OP_CREATE) {
            G.DataMgr.hunliData.hunguCreateData.onHunguMergeResponse(msg);
        }
    }

    /**
     * 登陆成功的响应函数。在登录成功之后拉去背包数据。
     * @param msg 登陆成功消息。
     *
     */
    onLoginSuccessfully(isFirstLogin: boolean): void {
        this.isSceneInit = true;//临时添加的

        this.getBagData();
        if (!isFirstLogin) {
            // 非第一次登陆（即切线），后台仓库数据清空，而前台可能已经拉过了数据。
            // 因此需要前台重新发送拉取仓库请求驱动后台拉取仓库数据，否则后台不会
            // 正常响应仓库操作。
            //  this._onInvalidateStoreData();
        }
    }


    /**
     * 背包/仓库数据改变
     * @param type
     */
    onContainerChange(type: number): void {
        PendBatchCall.pendBatchCall('BagModule.onContainerChange.type:' + type, 50, delegate(this, this.delayOnContainerChange, type));
    }

    private delayOnContainerChange(type: number) {
        //分解
        let dView = G.Uimgr.getForm<DecomposeView>(DecomposeView);
        if (dView != null) {
            dView.onContainerChange(type);
        }
        //背包
        let bagView = G.Uimgr.getForm<BagView>(BagView);
        if (bagView != null) {
            bagView.updataView(type);
        }
        //人物
        let heroView = G.Uimgr.getForm<HeroView>(HeroView);
        if (heroView != null) {
            heroView.onContainerChange(type);
        }
        let jinjieView = G.Uimgr.getForm<JinjieView>(JinjieView);
        if (jinjieView != null) {
            jinjieView.onContainerChange(type);
        }
        //魂力
        let hunliView = G.Uimgr.getForm<HunLiView>(HunLiView);
        if (hunliView != null) {
            hunliView.onContainerChange(type);
        }
        //魂骨
        let hunGuView = G.Uimgr.getForm<HunGuView>(HunGuView);
        if (hunGuView != null) {
            hunGuView.onContainerChange(type);
        }

        ////星环
        //let magicCubeView = G.Uimgr.getForm<MagicCubeView>(MagicCubeView);
        //if (magicCubeView != null) {
        //    magicCubeView.onContainerChange(type);
        //}
        //todoyanfei
        ////翅膀
        //let wingView = G.Uimgr.getSubFormByID<WingView>(HuoYueView, KeyWord.OTHER_FUNCTION_YYQH);
        //if (wingView != null) {
        //    wingView.onContainerChange();
        //}
        //合成
        let itemMergeView = G.Uimgr.getForm<ItemMergeView>(ItemMergeView);
        if (itemMergeView != null) {
            itemMergeView.onContainerChange(type);
        }
        //宝物
        let faqiView = G.Uimgr.getForm<FaQiView>(FaQiView);
        if (faqiView != null) {
            faqiView.onContainerChange(type);
        }
        //强化
        let equipView = G.Uimgr.getForm<EquipView>(EquipView);
        if (equipView != null) {
            equipView.updateView(type);
        }
        //圣光
        let jiuXingView = G.Uimgr.getSubFormByID<JiuXingView>(HeroView, KeyWord.BAR_FUNCTION_JIUXING);;
        if (jiuXingView != null) {
            jiuXingView.onContainerChange(type);
        }
        //探宝
        let starsStore = G.Uimgr.getForm<StarsStoreView>(StarsStoreView);
        if (starsStore != null) {
            starsStore.onStarsStoreChange(type);
        }
        //探宝
        let tanBaoStoreView = G.Uimgr.getForm<TanBaoStoreView>(TanBaoStoreView);
        if (tanBaoStoreView != null) {
            tanBaoStoreView.onTgbjStoreChange(type);
        }
        // 守护神
        let shieldGodView = G.Uimgr.getForm<ShieldGodView>(ShieldGodView);
        if (shieldGodView) {
            shieldGodView.onContainerChange(type);
        }
        //交易所
        let jishouView = G.Uimgr.getForm<JishouView>(JishouView);
        if (jishouView != null) {
            jishouView.updataSellView(type);
        }
        // 伙伴
        let petView = G.Uimgr.getForm<PetView>(PetView);
        if (petView != null) {
            petView.onContainerChange(type);
        }
        //转生
        let rebirthView = G.Uimgr.getForm<HunLiView>(HunLiView);
        if (rebirthView != null) {

        }
        //称号
        let titleView = G.Uimgr.getForm<TitleView>(TitleView);
        if (titleView != null) {
            titleView.onContainerChange(type);
        }
        //装备进阶符
        let zhufuColor = G.Uimgr.getForm<ZhufuEquipUpColorView>(ZhufuEquipUpColorView);
        if (zhufuColor != null) {
            zhufuColor.onContainerChange(type);
        }
        // 地宫boss
        let bossView = G.Uimgr.getForm<BossView>(BossView);
        if (bossView != null) {
            bossView.onContainerChange(type);
        }
        ////宝石升级
        //let diamondUpPanel = G.Uimgr.getForm<DiamondUpPanel>(DiamondUpPanel);
        //if (diamondUpPanel != null) {
        //    diamondUpPanel.onContainerChange(type);
        //}
        //主界面功能预告
        //G.ViewCacher.mainView.newFunctionTrailerCtrl.onChangeBagThingData(type);
        G.GuideMgr.tipMarkCtrl.onContainerChange(type);
        //主界面神装收集
        //G.ViewCacher.mainView.onContainerChange(type);
        //一元夺宝
        let yiYuanDuoBaoView = G.Uimgr.getForm<YiYuanDuoBaoView>(YiYuanDuoBaoView);
        if (yiYuanDuoBaoView != null) {
            yiYuanDuoBaoView.onContainerChange(type);
        }
        // 次充奖励
        let secondChargeView = G.Uimgr.getForm<SecondChargeView>(SecondChargeView);
        if (secondChargeView) {
            secondChargeView.updateView();
        }
        //送花
        let sendFlowerView = G.Uimgr.getForm<SendFlowerView>(SendFlowerView);
        if (sendFlowerView != null) {
            sendFlowerView.onBagModuleChange(type);
        }

        //充值狂欢
        let chongZhiKuangHuanView = G.Uimgr.getForm<ChongZhiKuangHuanView>(ChongZhiKuangHuanView);
        if (chongZhiKuangHuanView != null) {
            chongZhiKuangHuanView.onContainerChange(type);
        }

        //星斗宝库
        let stars = G.Uimgr.getForm<StarsTreasuryView>(StarsTreasuryView);
        if (stars != null && stars.isOpened) {
            stars.onContainerChange();
        }

        //兑换
        let exchange = G.Uimgr.getForm<ExchangeView>(ExchangeView);
        if (exchange != null && exchange.isOpened) {
            exchange.onContainerChange();
        }



        //type == Macros.CONTAINER_TYPE_ROLE_BAG
        G.NoticeCtrl.onContainerChange(type);
        G.ActBtnCtrl.update(false);
        G.MainBtnCtrl.update(false);
        G.ViewCacher.mainView.updateEquipCollectProgress();
    }

    /**
    * money变化
    */
    onCurrencyChange(id: number): void {
        let bagView = G.Uimgr.getForm<BagView>(BagView);
        if (bagView != null) {
            bagView.updataMoney();
        }
        let heroView = G.Uimgr.getForm<HeroView>(HeroView);
        if (heroView != null) {
            heroView.onMoneyChange();
        }
        let jiuXingView = G.Uimgr.getSubFormByID<JiuXingView>(HeroView, KeyWord.BAR_FUNCTION_JIUXING);
        if (jiuXingView != null) {
            jiuXingView.onMoneyChange();
        }
        let tanBaoExchangeView = G.Uimgr.getForm<TanBaoExchangeView>(TanBaoExchangeView);
        if (tanBaoExchangeView != null) {
            tanBaoExchangeView._onUpdateMoneyShow();
        }
        let jishouView = G.Uimgr.getForm<JishouView>(JishouView);
        if (jishouView != null) {
            jishouView.updataMoney();
            jishouView.onMoneyChange();
        }
        //G.ViewCacher.mainView.newFunctionTrailerCtrl.updateView();
        //神力
        let juYuanView = G.Uimgr.getForm<JuYuanView>(JuYuanView);
        if (juYuanView != null) {
            juYuanView.onMoneyChange(id);
        }
        let equipView = G.Uimgr.getForm<EquipView>(EquipView);
        if (equipView != null) {
            equipView.onMoneyChange(id);
        }

        let exchangeView = G.Uimgr.getForm<ExchangeView>(ExchangeView);
        if (exchangeView != null) {
            exchangeView.onUpdateMoney();
        }

        let mallView = G.Uimgr.getForm<MallView>(MallView);
        if (mallView != null) {
            mallView.onUpdateMoney();
        }

        let temMergeView = G.Uimgr.getForm<ItemMergeView>(ItemMergeView);
        if (temMergeView != null) {
            temMergeView.onUpdateMoney();
        }

        let actHomeView = G.Uimgr.getForm<ActHomeView>(ActHomeView);
        if (actHomeView != null) {
            actHomeView.onUpdateMoney();
        }

        let vipView = G.Uimgr.getForm<VipView>(VipView);
        if (vipView != null) {
            vipView.onUpdateMoney();
        }

        let sevenDayView = G.Uimgr.getForm<SevenDayView>(SevenDayView);
        if (sevenDayView != null) {
            sevenDayView.onUpdateMoney();
        }

        let bossView = G.Uimgr.getForm<BossView>(BossView);
        if (bossView != null) {
            bossView.onMoneyChange(id);
        }
        let jinjieView = G.Uimgr.getForm<JinjieView>(JinjieView);
        if (jinjieView != null) {
            jinjieView.onMoneyChange(id);
        }
        let qifuView = G.Uimgr.getForm<KuaiSuShengJiView>(KuaiSuShengJiView);
        if (qifuView != null) {
            qifuView.updateMoney();
        }
        let hunliView = G.Uimgr.getForm<HunLiView>(HunLiView);
        if (hunliView != null) {
            hunliView.updateMoney();
        }

        let hunGuView = G.Uimgr.getForm<HunGuView>(HunGuView);
        if (hunGuView != null) {
            hunGuView.updateMoney();
        }

        let fuliView = G.Uimgr.getForm<FuLiDaTingView>(FuLiDaTingView);
        if (fuliView != null) {
            fuliView.onUpdateMoney();
        }
        let kafuView = G.Uimgr.getForm<KaiFuHuoDongView>(KaiFuHuoDongView);
        if (kafuView != null) {
            kafuView.onUpdateMoney();
        }
        let ranView = G.Uimgr.getForm<RankView>(RankView);
        if (ranView != null) {
            ranView.onMoneyChange();
        }
        let fanliView = G.Uimgr.getForm<FanLiDaTingView>(FanLiDaTingView);
        if (fanliView != null) {
            fanliView.onUpdateMoney();
        }
        let xxdd = G.Uimgr.getForm<XXDDMainView>(XXDDMainView);
        if (xxdd != null) {
            xxdd.onUpdateMoney();
        }

        let stars = G.Uimgr.getForm<StarsTreasuryView>(StarsTreasuryView);
        if (stars != null) {
            stars.onUpdateMoney();
        }

        let guildView = G.Uimgr.getForm<GuildView>(GuildView);
        if (guildView != null) {
            guildView.onMoneyChange();
        }

        let pinView = G.Uimgr.getForm<PinstanceHallView>(PinstanceHallView);
        if (pinView != null) {
            pinView.onMoneyChange();
        }

        let petView = G.Uimgr.getForm<PetView>(PetView);
        if (petView != null) {
            petView.onMoneyChange();
        }

        let yuanguView = G.Uimgr.getForm<YuanGuJingPaiView>(YuanGuJingPaiView);
        if (yuanguView != null) {
            yuanguView.onMoneyChange();
        }

        let skillview = G.Uimgr.getForm<SkillView>(SkillView);
        if (skillview != null) {
            skillview.onMoneyChange();
        }

        //招财猫
        let catView = G.Uimgr.getForm<LuckyCatView>(LuckyCatView);
        if (catView != null && catView.isOpened) {
            catView.onMoneyChange();
        }

    }

    /**
     * 取得背包的数据
	 *
	 */
    private getBagData(): void {
        // 如果背包容量是0说明背包数据没拉到，也要重拉
        let cmd = ProtocolUtil.getOperateContainerMsg(Macros.CONTAINER_OPERATE_LIST, Macros.CONTAINER_TYPE_ROLE_BAG);
        G.ModuleMgr.netModule.sendMsg(cmd);
    }

    /**
	 * 拉取仓库的数据。
	 *
	 */
    private getStoreData(): void {
        if (!this.m_hasRequestedStoreData) {
            let cmd = ProtocolUtil.getOperateContainerMsg(Macros.CONTAINER_OPERATE_LIST, Macros.CONTAINER_TYPE_ROLE_STORE);
            G.ModuleMgr.netModule.sendMsg(cmd);
            this.m_hasRequestedStoreData = true;
        }
    }

    /**
     * 对服务器发来的背包通知的相应处理
     * @param msg
     *
     */
    private onContainerNotify(notify: Protocol.ContainerChanged_Notify): void {
        if (notify.m_ushResultID == ErrorId.EQEC_Success) {
            let list: Protocol.ContainerChangedList = notify.m_stContainerChanged;
            let reason: number = notify.m_ucChangedReason;
            // 检查物品容器操作引起的更新
            let result: boolean = this.m_thingsData.updateOnContainerNotify(this, list, reason);
            let containerType: number = list.m_astContainerChanged[0].m_stContainerID.m_ucContainerType;


            if (Macros.CONTAINER_OPERATE_LIST == reason) {
                if (!result) {
                    // 如果List背包或仓库物品失败的话，需要重置请求状态，重新拉数据
                    if (Macros.CONTAINER_TYPE_ROLE_BAG == containerType) {
                        this.getBagData();
                    }
                    else if (Macros.CONTAINER_TYPE_ROLE_STORE == containerType) {
                        this.m_hasRequestedStoreData = false;
                        this.getStoreData();
                    }
                } else {
                    if ((Macros.CONTAINER_TYPE_ROLE_BAG == containerType || Macros.CONTAINER_TYPE_ROLE_EQUIP == containerType) &&
                        this.m_thingsData.isBagDataInit && this.m_thingsData.isRoleEquipDataInit) {
                        G.GuideMgr.checkNoneWearedEquips();
                    }
                }
            }

            // 拉完背包数据后拉仓库数据
            if (Macros.CONTAINER_OPERATE_LIST == reason && Macros.CONTAINER_TYPE_ROLE_BAG == containerType && !this.m_hasRequestedStoreData) {
                this.getStoreData();
            } else if (Macros.CONTAINER_OPERATE_PER_USE_THING == reason) {
                // 预览宝箱结果
                let view = G.Uimgr.getForm<LotteryBoxView>(LotteryBoxView);
                if (null != view) {
                    view.onPreviewResult();
                }
            }
        }
    }


    ////////////////////////////////////////////////////////////数据相关////////////////////////////////////////////////////

    //private _onInvalidateStoreData(): void {
    //    if (this.m_bagDialog != null) { // 如果仓库正打开，则立即发送整理仓库请求驱动后台重拉数据
    //        this.sortStore();
    //    }
    //    else { // 否则记录非法状态，下次打开仓库时请求
    //        this.m_isStoreDataInvalid = true;
    //    }
    //}


    ///////////////////////////////////////////////// 容器操作 /////////////////////////////////////////////////

    /**
    * 整理背包。
    *
    */
    sortBag(): void {
        if (!this.isSceneInit) {
            return;
        }
        let heroData: HeroData = G.DataMgr.heroData;
        let cmd = ProtocolUtil.getOperateContainerMsg(Macros.CONTAINER_OPERATE_SORT, Macros.CONTAINER_TYPE_ROLE_BAG);
        G.ModuleMgr.netModule.sendMsg(cmd);
    }

    /**
     * 整理仓库。
     *
     */
    sortStore(): void {
        if (!this.isSceneInit) {
            return;
        }
        let cmd = ProtocolUtil.getOperateContainerMsg(Macros.CONTAINER_OPERATE_SORT, Macros.CONTAINER_TYPE_ROLE_STORE);
        G.ModuleMgr.netModule.sendMsg(cmd);
    }

    /**
	 * 交换两个物品
	 * @param sourceType
	 * @param sourceID
	 * @param source
	 * @param desType
	 * @param dstID
	 * @param desPos
	 * @param slot
	 *
	 */
    swapThing(sourceType: number, source: Protocol.ContainerThingInfo, desType: number, desPos: number = Macros.UNDEFINED_CONTAINER_POSITION): void {

        let isSwapBagStore = (sourceType == Macros.CONTAINER_TYPE_ROLE_BAG || sourceType == Macros.CONTAINER_TYPE_ROLE_STORE) &&
            (desType == Macros.CONTAINER_TYPE_ROLE_BAG || desType == Macros.CONTAINER_TYPE_ROLE_STORE)
        let cmd = ProtocolUtil.getSwapContainerMsg(sourceType, [source.m_iThingID], [source.m_usPosition], [!isSwapBagStore && GameIDUtil.isEquipmentID(source.m_iThingID) ? 1 : source.m_iNumber], desType, desPos);
        G.ModuleMgr.netModule.sendMsg(cmd);
    }

    /**
   * 脱装备
   * @param equipItemData
   */
    takeOff(equipItemData: ThingItemData): void {
        if (G.DataMgr.thingData.isBagFull) {
            G.TipMgr.addMainFloatTip('背包已满，不能卸下装备');
        }
        else if (equipItemData.config.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_WEDDINGRING) {
            G.TipMgr.addMainFloatTip('不能卸下结婚戒指');
        }
        else {
            uts.assert(equipItemData.containerID > 0);
            this.swapThing(equipItemData.containerID, equipItemData.data, Macros.CONTAINER_TYPE_ROLE_BAG, Macros.UNDEFINED_CONTAINER_POSITION);
        }
    }


    /**
     * 使用装备从背包
     * @param config
     * @param thingInfo
     */
    private useEquipFromBag(config: GameConfig.ThingConfigM, thingInfo: Protocol.ContainerThingInfo): void {
        if (GameIDUtil.isPetEquipID(thingInfo.m_iThingID)) {
            // 伙伴装备-打开伙伴界面
            let petId = G.ActionHandler.getPetIdByEquipId(config.m_iID);
            G.Uimgr.createForm<PetView>(PetView).open(KeyWord.OTHER_FUNCTION_PET_JINJIE, petId);
        }
        else if (GameIDUtil.isHunguEquipID(thingInfo.m_iThingID)) {
            if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_HUNGUN, true))
                return;
            G.Uimgr.createForm<HunGuView>(HunGuView).open(KeyWord.OTHER_FUNCTION_HUNGUN);
        }
        else if (GameIDUtil.isRoleEquipID(config.m_iID)) {
            //角色装备
            if (config.m_ucBindType == KeyWord.BIND_TYPE_USE && thingInfo.m_stThingProperty.m_ucBindStatus == KeyWord.BIND_STATUS_NOBINDED) //使用绑定的话提示玩家是否继续
            {
                if (this.m_noPromptBind) {
                    this.onConfirmHandler(MessageBoxConst.yes, this.m_noPromptBind, config, thingInfo);
                }
                else {
                    G.TipMgr.showConfirm('装备将会被绑定，是否继续?', ConfirmCheck.withCheck, '确定|取消', delegate(this, this.onConfirmHandler, config, thingInfo));
                }
            }
            else {
                this.doUseRoleEquip(config, thingInfo);
            }
        }
        else if (GameIDUtil.isAvatarID(thingInfo.m_iThingID)) {
            //角色时装
            if (config.m_ucBindType == KeyWord.BIND_TYPE_USE && thingInfo.m_stThingProperty.m_ucBindStatus == KeyWord.BIND_STATUS_NOBINDED) //使用绑定的话提示玩家是否继续
            {
                if (this.m_noPromptBind) {
                    this.onConfirmHandler(MessageBoxConst.yes, this.m_noPromptBind, config, thingInfo);
                }
                else {
                    G.TipMgr.showConfirm('装备将会被绑定，是否继续?', ConfirmCheck.withCheck, '确定|取消', delegate(this, this.onConfirmHandler, config, thingInfo));
                }
            }
            else {
                this.doUseRoleEquip(config, thingInfo);
            }
        }
        //else if (GameIDUtil.isAdvanceEquipId(config.m_iID)) {
        //    //进阶界面
        //    let subType = GameIDUtil.getSubTypeByEquip(config.m_iEquipPart);
        //    G.Uimgr.createForm<JinjieView>(JinjieView).open(subType);
        //}
        else {
            let subType = GameIDUtil.getSubTypeByEquip(config.m_iEquipPart);
            if (!G.DataMgr.funcLimitData.isFuncEntranceVisible(GameIDUtil.getFuncIdBySubType(subType), true))
                return;

            if (subType == KeyWord.HERO_SUB_TYPE_ZUOQI || subType == KeyWord.HERO_SUB_TYPE_WUHUN) {
                //坐骑 神器
                G.Uimgr.createForm<JinjieView>(JinjieView).open(subType, config.m_iFunctionID);
            }
            else {
                //魔瞳 迷踪
                G.Uimgr.createForm<HeroView>(HeroView).open(subType);
            }
        }
    }

    /**
	* 使用装备（使用绑定类型的）后的确认回调处理
	* @param args
	* @param state
	*
	*/
    private onConfirmHandler(state: MessageBoxConst, isCheckSelected: boolean, thingConfig: GameConfig.ThingConfigM, thingInfo: Protocol.ContainerThingInfo): void {
        if (state != MessageBoxConst.yes) {
            return;
        }
        this.m_noPromptBind = isCheckSelected;
        this.doUseRoleEquip(thingConfig, thingInfo);
    }

    /**
	 * 使用某个具体的装备
	 * @param thingData
	 *
	 */
    private doUseRoleEquip(config: GameConfig.ThingConfigM, thingInfo: Protocol.ContainerThingInfo): void {

        let index: number = ThingData.getIndexByEquipPart(config.m_iEquipPart);
        let containerID: number = ThingData.getContainerByEquip(config.m_iID);
        //使用玩家装备
        this.swapThing(Macros.CONTAINER_TYPE_ROLE_BAG, thingInfo, containerID, index);
    }


    /**
	 * 使用容器格子的物品，可能来自背包或仓库。
	 * @param containerType 容器类型。
	 * @param itemData 物品数据。
	 *
	 */
    useThing(thingConfig: GameConfig.ThingConfigM, thingInfo: Protocol.ContainerThingInfo, useNum: number = 1, useDirectly: boolean = false, targetID: number = 0): void {
        if (useDirectly) {
            // 直接使用
            this.doUseItemThing(thingInfo, useNum, targetID);
        }
        else {
            this.useThingFromBag(thingConfig, thingInfo, useNum, Macros.UNDEFINED_CONTAINER_POSITION);
        }
    }

    private doUseItemThing(thingInfo: Protocol.ContainerThingInfo, useNum: number = 1, targetUnitID: number = -1): void {
        if (useNum <= 0) {
            useNum = 1;
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOperateContainerMsg(Macros.CONTAINER_OPERATE_USE_THING, Macros.CONTAINER_TYPE_ROLE_BAG, thingInfo.m_iThingID, //物品id
            thingInfo.m_usPosition, //物品位置
            useNum, targetUnitID));
    }


    /**
     * 使用背包中的物品。
     * @param thingData 物品的背包数据。
     * @param fromShortcut 是否来自快捷栏。
     */
    private useThingFromBag(thingConfig: GameConfig.ThingConfigM, thingInfo: Protocol.ContainerThingInfo, useNum: number = 1, destination: number = 0): void {
        if (0 == destination) {
            destination = Macros.UNDEFINED_CONTAINER_POSITION;
        }
        //先判断该物品能不能使用
        if (!G.ActionHandler.canUse(thingConfig, thingInfo, true)) {
            return;
        }
        //虽然不知道怎么回事，但是时装卡相关的走的是else
        if (GameIDUtil.isEquipmentID(thingInfo.m_iThingID) || GameIDUtil.isAvatarID(thingInfo.m_iThingID) || GameIDUtil.isHunguEquipID(thingInfo.m_iThingID)) {
            this.useEquipFromBag(thingConfig, thingInfo);
        }
        else {
            this._useItemThing(thingConfig, thingInfo, useNum, -1);
        }
    }
    private onUseZhufuId(state: MessageBoxConst, isCheckSelected: boolean, args: [GameConfig.ThingConfigM, Protocol.ContainerThingInfo]): void {
        if (MessageBoxConst.yes == state) {
            let thingConfig: GameConfig.ThingConfigM = args[0];
            let thingInfo: Protocol.ContainerThingInfo = args[1];
            this.doUseItemThing(thingInfo, 1);
            if (thingConfig.m_iFunctionID == KeyWord.HERO_SUB_TYPE_ZUOQI) {
                G.Uimgr.createForm<JinjieView>(JinjieView).open(KeyWord.HERO_SUB_TYPE_ZUOQI);
            }
            else if (thingConfig.m_iFunctionID == KeyWord.HERO_SUB_TYPE_WUHUN) {
                G.Uimgr.createForm<JinjieView>(JinjieView).open(KeyWord.HERO_SUB_TYPE_WUHUN);
            }
        }
    }

    ///////////////////////////////////////////////// 钻石开包 /////////////////////////////////////////////////

    /**
     * 背包开格子事件的响应函数。
     * @param slotNum 新开格子数量。
     * @param callback 开完格子后的回调。
     *
     */
    onUnlockBagAndDosth(extendNum: number, callback: () => void): void {
        this.extendContainerByYuanbao(Macros.CONTAINER_TYPE_ROLE_BAG, extendNum, callback);
    }

    /**
     * 扩展容器至某个格子。
     * @param extendToPos 扩展之后背包/仓库最后一个有效格子的位置。
     *
     */
    extendContainerByYuanbao(containerType: number, extendNum: number, callback: Function = null): void {
        if (!this.checkContainerDataInit(containerType, false)) {
            return;
        }
        if (defines.has('_DEBUG')) {
            uts.assert(extendNum >= 1, '扩容格子数错误！');
        }
        let capacity: number = this.getContainerCapacity(containerType);
        // 钻石解锁
        let cost: number = this.calculateCost(containerType, capacity, extendNum);
        this.m_unlockBagCallback = callback;

        //先检查绑钻够不够
        let costId = KeyWord.MONEY_YUANBAO_ID;
        let costStr: string;
        if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_BIND_ID, cost * Constants.SummonBindRate, false)) {
            // 优先使用绑钻支付
            cost = cost * Constants.SummonBindRate;
            costId = KeyWord.MONEY_YUANBAO_BIND_ID;
            costStr = TextFieldUtil.getGoldBindText(cost);
        } else {
            costStr = TextFieldUtil.getYuanBaoText(cost);
        }
        G.TipMgr.showConfirm(uts.format('是否花费{0}开启所选的{1}个格子？', costStr, extendNum), ConfirmCheck.noCheck, '确定|取消', delegate(this, this.continueExtend, containerType, extendNum, cost, costId));
    }

    private continueExtend(state: MessageBoxConst, isCheckSelected: boolean, containerType: number, extendNum: number, cost: number, costId: number): void {
        if (MessageBoxConst.yes == state && 0 == G.ActionHandler.getLackNum(costId, cost, true)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getExtendContainerMsg(containerType, extendNum));
        }
    }

    /**
     * 计算扩容所需的钻石数（单位为铜）。
     * @param from 从哪个格子开始扩容。
     * @param count 总共扩展的格子数。
     * @return 扩容所需的钻石数（单位为铜）。
     *
     */
    calculateCost(containerType: number, from: number, count: number): number {
        let addFee: number = 0;
        let startFee: number = 0;
        let onlineOpenCount: number = 0;
        let defaultCapacity: number = 0;
        if (Macros.CONTAINER_TYPE_ROLE_BAG == containerType) {
            addFee = G.DataMgr.constData.getValueById(KeyWord.BUG_GRID_FEE_ADD);
            startFee = G.DataMgr.constData.getValueById(KeyWord.BUG_GRID_FEE_START);
            defaultCapacity = BagView.DEFAULT_CAPACITY + G.DataMgr.vipData.getVipParaValue(KeyWord.VIP_PARA_OPEN_BAG, G.DataMgr.heroData.curVipLevel);
            // 已经在线开的格子数
            onlineOpenCount = G.DataMgr.thingData.onlineOpenBagCount;
        }
        else if (Macros.CONTAINER_TYPE_ROLE_STORE == containerType) {
            startFee = G.DataMgr.constData.getValueById(KeyWord.WAREHOUSE_GRID_FEE_START);
            addFee = G.DataMgr.constData.getValueById(KeyWord.WAREHOUSE_GRID_FEE_ADD);
            defaultCapacity = BagView.DEFAULT_CAPACITY_CK;
        }
        else {
            if (defines.has('_DEBUG')) {
                uts.assert(false, '容器' + containerType + '无法开格子！');
            }
        }
        return count * (startFee + ((count - 1) / 2 + from - defaultCapacity - onlineOpenCount) * addFee);
    }

    getContainerCapacity(containerType: number): number {
        if (Macros.CONTAINER_TYPE_ROLE_BAG == containerType) {
            return this.m_thingsData.bagCapacity;
        }
        else if (Macros.CONTAINER_TYPE_ROLE_STORE == containerType) {
            return this.m_thingsData.storeCapacity;
        }
        else {
            if (defines.has('_DEBUG')) {
                uts.assert(false, '容器' + containerType + '无法开格子！');
            }
        }
        return 0;
    }

    /**
     * 检查容器数据是否已经初始化。
     * @return 容器数据是否已经初始化。
     *
     */
    checkContainerDataInit(containerType: number, needPrompt: boolean): boolean {
        if (Macros.CONTAINER_TYPE_ROLE_BAG == containerType) {
            if (!this.m_thingsData.isBagDataInit) {
                if (needPrompt) {
                    G.TipMgr.addMainFloatTip('背包数据加载中，请稍侯...');
                }
                return false;
            }
        }
        else if (Macros.CONTAINER_TYPE_ROLE_STORE == containerType) {
            if (!this.m_thingsData.isStoreDataInit) {
                if (needPrompt) {
                    G.TipMgr.addMainFloatTip('仓库数据加载中，请稍侯...');
                }
                return false;
            }
        }
        return true;
    }

    private _useItemThing(thingConfig: GameConfig.ThingConfigM, thingInfo: Protocol.ContainerThingInfo, useNum: number = 1, targetUnitID: number = -1): void {
        //if (Math.floor(EnumThingID.ZBQHS / 100) == Math.floor(thingConfig.m_iID / 100)) {
        //    G.Uimgr.createForm<EquipView>(EquipView).open(KeyWord.OTHER_FUNCTION_EQUIP_ENHANCE);
        //    return;
        //}
        if (Math.floor(ThingIDUtil.JDY / 10) == Math.floor(thingConfig.m_iID / 10)) {
            // 筋斗云
            //G.TipMgr.addMainFloatTip('请点击M按钮，在M地图使用小飞鞋。');
            return;
        }
        let activityData = G.DataMgr.activityData;
        if (activityData.collectMaterialIds.indexOf(thingConfig.m_iID) >= 0) {
            // 收集兑换材料
            if (activityData.isActivityOpen(Macros.ACTIVITY_ID_COLLECT_EXCHANGE)) {
                G.Uimgr.createForm<NewYearActView>(NewYearActView).open(KeyWord.OTHER_FUNCTION_COLLECT_EXCHANGE);
            } else {
                G.TipMgr.addMainFloatTip('活动已结束');
            }
            return;
        }
        switch (thingConfig.m_ucFunctionType) {
            case KeyWord.ITEM_FUNCTION_NAMECHANGE_CARD:
                let func = G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_CHANGE_NAME);
                if (!func) break;
                let noCD = G.DataMgr.heroData.renameCd == 0;
                let cardLeftTime = G.SyncTime.getCurrentTime() / 1000 - G.DataMgr.heroData.renameCd;

                let cdLimit = (0 < cardLeftTime && cardLeftTime < 3600 * 24); //小于一天时间

                if (!noCD && cdLimit) { //有cd限制，并且有改名卡cd
                    let temp = (24 * 3600 - cardLeftTime) / 60;
                    if (temp > 60) {
                        G.TipMgr.addMainFloatTip("改名卡冷却时间：" + Math.floor(temp / 60) + "小时");
                    }
                    else {
                        G.TipMgr.addMainFloatTip("改名卡冷却时间：" + Math.floor(temp) + "分钟");
                    }
                    break;
                }


                if (G.DataMgr.teamData.hasTeam || G.DataMgr.sxtData.myTeam) {
                    G.TipMgr.addMainFloatTip("组队中，无法更改角色名");
                }
                else if (G.DataMgr.sceneData.curPinstanceID != 0) {
                    G.TipMgr.addMainFloatTip("副本中，无法更改角色名");
                }
                else if (G.DataMgr.runtime.isAllFuncLocked) {
                    G.TipMgr.addMainFloatTip("跨服中，无法更改角色名");
                }
                else {
                    G.Uimgr.createForm<RenameView>(RenameView).open();
                }


                break;
            case KeyWord.ITEM_FUNCTION_SKILL: //技能
                this._useSkillItem(thingConfig, thingInfo);
                break;

            case KeyWord.ITEM_FUNCTION_EQUIP_JEWEL: //镶嵌宝石
                //宝石
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_EQUIP_MOUNT);
                break;
            case KeyWord.ITEM_FUNCTION_BDSKILLBOOK:
                //被动技能
                let skillId = 0;
                let skillLevel = 9999;
                if (G.DataMgr.heroData.profession != KeyWord.PROFTYPE_NONE) {
                    let skillVec = G.DataMgr.skillData.getPassiveSkill();
                    for (let skillConfig of skillVec) {
                        if (skillConfig.completed) {
                            if (skillConfig.m_ushSkillLevel < skillLevel) {
                                skillId = skillConfig.m_iSkillID;
                                skillLevel = skillConfig.m_ushSkillLevel;
                            }
                        }
                        else {
                            skillId = skillConfig.m_iSkillID;
                            break;
                        }
                    }
                }
                G.Uimgr.createForm<SkillView>(SkillView).open(KeyWord.OTHER_FUNCTION_SKILL_BASIC, skillId);
                break;
            case KeyWord.ITEM_FUNCTION_FETTER_UPLEVEL:
                //羁绊技能升级
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_SKILL_JIBAN);
                break;
            case KeyWord.ITEM_FUNCTION_NQSKILLBOOK:
                //怒气技能
                skillId = 0;
                skillLevel = 9999;
                if (G.DataMgr.heroData.profession != KeyWord.PROFTYPE_NONE) {
                    let allSkills = G.DataMgr.skillData.getSkillsByProf(G.DataMgr.heroData.profession);
                    let skillVec = allSkills[KeyWord.SKILL_BRANCH_ROLE_NQ];
                    for (let skillConfig of skillVec) {
                        if (skillConfig.completed) {
                            if (skillConfig.m_ushSkillLevel < skillLevel) {
                                skillId = skillConfig.m_iSkillID;
                                skillLevel = skillConfig.m_ushSkillLevel;
                            }
                        }
                        else {
                            skillId = skillConfig.m_iSkillID;
                            break;
                        }
                    }
                }
                G.Uimgr.createForm<SkillView>(SkillView).open(KeyWord.OTHER_FUNCTION_SKILL_BASIC, skillId);
                break;

            case KeyWord.ITEM_FUNCTION_SHIELDGOD_JJD:
                // 守护神进阶丹
                G.ActionHandler.executeFunction(KeyWord.BAR_FUNCTION_SHIELDGOD, 0, 0, thingConfig.m_iFunctionID);
                break;

            case KeyWord.ITEM_FUNCTION_EQUIP_STRENG:
            case KeyWord.ITEM_FUNCTION_EQUIP_LAYERUP:
            case KeyWord.ITEM_FUNCTION_EQUIP_STRONGUPSAFE:
                if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_EQUIP_ENHANCE, true)) {
                    G.Uimgr.createForm<EquipView>(EquipView).open(KeyWord.OTHER_FUNCTION_EQUIP_ENHANCE);
                }
                break;
            case KeyWord.ITEM_FUNCTION_EQUIP_UPCOLOR:
            case KeyWord.ITEM_FUNCTION_EQUIP_FINAL:
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_EQUIP_UPLEVEL);
                break;
            case KeyWord.ITEM_FUNCTION_ZQZBJJF:
            case KeyWord.ITEM_FUNCTION_SQZBJJF:
            case KeyWord.ITEM_FUNCTION_QYSZBJJF:
            case KeyWord.ITEM_FUNCTION_FZZBJJF:
            case KeyWord.ITEM_FUNCTION_LLZBJJF:
                G.Uimgr.createForm<ItemMergeView>(ItemMergeView).open();
                break;
            //祝福系统成长丹
            case KeyWord.ITEM_FUNCTION_GROWGRUG:
                if (G.DataMgr.zhufuData.canEatCzd(thingConfig.m_iFunctionID)) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getZhufuDanRuquest(KeyWord.HERO_SUB_DRUG_TYPE_CZ, thingConfig.m_iFunctionID, useNum));
                }
                break;
            //祝福系统资质丹
            case KeyWord.ITEM_FUNCTION_ZIZHIDRUG:
                if (G.DataMgr.zhufuData.canEatZzd(thingConfig.m_iFunctionID)) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getZhufuDanRuquest(KeyWord.HERO_SUB_DRUG_TYPE_ZZ, thingConfig.m_iFunctionID, useNum));
                }
                break;
            //祝福系统进阶丹
            case KeyWord.ITEM_FUNCTION_LAYERUPDRUG:
                let funid = GameIDUtil.getFuncIdBySubType(thingConfig.m_iFunctionID);
                //控鹤擒龙改id了。。。
                if (funid != null) {
                    G.ActionHandler.executeFunction(funid);
                }
                else if (thingConfig.m_iFunctionID == KeyWord.OTHER_FUNCTION_MAGICCUBE) {
                    G.ActionHandler.executeFunction(thingConfig.m_iFunctionID);
                }
                else
                    G.Uimgr.createForm<HeroView>(HeroView).open(thingConfig.m_iFunctionID);
                break;
            case KeyWord.ITEM_FUNCTION_HUNHUAN_ZHURU:
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_HUNHUAN);
                break;
            case KeyWord.ITEM_FUNCTION_HUNGU_LEVELUP:
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_HUNGU_SLOT_LVUP);
                break;
            case KeyWord.ITEM_FUNCTION_HUNGU_STRENG:
                //魂骨强化
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_HUNGUN_STRENG);
                break;
            case KeyWord.ITEM_FUNCTION_HUNGUN_MERGE_ITEM:
                //魂骨升华
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_HUNGUN_MERGE);
                break;
            case KeyWord.ITEM_FUNCTION_HUNGU_SKILL:
                //魂骨技能
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_HUNGU_SKILL);
                break;
            case KeyWord.ITEM_FUNCTION_HUNGUN_EXCHANGE:
                //魂骨兑换
                G.Uimgr.createForm<ExchangeView>(ExchangeView).open(EnumStoreID.MALL_REPUTATION);
                break;
            case KeyWord.ITEM_FUNCTION_ZFSKILLBOOK: // 祝福系统的学习书
                if (thingConfig.m_iFunctionID == KeyWord.HERO_SUB_TYPE_TIANZHU) {
                    G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_TIANZHU);
                }
                else {
                    G.Uimgr.createForm<JinjieView>(JinjieView).open(thingConfig.m_iFunctionID);
                }
                break;
            case KeyWord.ITEM_FUNCTION_REBIRTH_JINLIANSHI:
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_ZHUANSHENG_JINGLIAN);
                break;
            case KeyWord.ITEM_FUNCTION_REBIRTH_SKILL:
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_ZHUANSHENG_JINENG);
                break;
            case KeyWord.ITEM_FUNCTION_REBIRTH:
                G.ActionHandler.executeFunction(KeyWord.BAR_FUNCTION_REBIRTH);
                break;
            case KeyWord.ITEM_FUNCTION_JIUXING_LEVELUP_TO://玄天功直升丹
            case KeyWord.ITEM_FUNCTION_HEROSUB_JINGJIEFU:
                //祝福进阶符
                let sysLv = 0;
                let sysName: string;
                if (thingConfig.m_iFunctionID == KeyWord.OTHER_FUNCTION_MAGICCUBE) {
                    let magicCubeInfo: Protocol.MagicCubeInfo = G.DataMgr.magicCubeData.magicCubeInfo;
                    if (magicCubeInfo) {
                        sysLv = magicCubeInfo.m_uiLevel;
                    }
                    sysName = '星环';
                }
                else if (thingConfig.m_iFunctionID == KeyWord.BAR_FUNCTION_JIUXING) {
                    let data = G.DataMgr.jiuXingData;
                    if (data) {
                        sysLv = data.level;
                    }
                    sysName = '玄天功';
                } else {
                    let data = G.DataMgr.zhufuData.getData(thingConfig.m_iFunctionID);
                    if (data) {
                        sysLv = data.m_ucLevel;
                    }
                    sysName = KeyWord.getDesc(KeyWord.GROUP_HERO_SUB_TYPE, thingConfig.m_iFunctionID);
                }

                if (sysLv > 0) {
                    if (sysLv >= ZhufuData.getMaxLv(thingConfig.m_iFunctionID)) {
                        G.TipMgr.addMainFloatTip('已满级，无需使用');
                    } else {
                        let crtStage = ZhufuData.getZhufuStage(sysLv, thingConfig.m_iFunctionID);
                        let bestStage = ZhufuData.getZhufuStage(thingConfig.m_iFunctionValue - 10, thingConfig.m_iFunctionID);
                        if (crtStage < bestStage) {
                            G.TipMgr.addMainFloatTip(uts.format(G.DataMgr.langData.getLang(455),
                                sysName, bestStage, TextFieldUtil.getItemText(thingConfig)));
                        }
                        else if (crtStage == bestStage) {
                            G.TipMgr.showConfirm(uts.format(G.DataMgr.langData.getLang(456), sysName, crtStage, TextFieldUtil.getItemText(thingConfig)),
                                ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onConfirmUseItem, thingInfo));
                        }
                        else {
                            let lucky = 0;
                            if (thingConfig.m_iFunctionID == KeyWord.OTHER_FUNCTION_MAGICCUBE) {
                                lucky = G.DataMgr.magicCubeData.getMagicCubeBaseConfig(thingConfig.m_iFunctionValue).m_uiLuckUp;
                            } else if (thingConfig.m_iFunctionID == KeyWord.BAR_FUNCTION_JIUXING) {
                                lucky = G.DataMgr.jiuXingData.getCfg(thingConfig.m_iFunctionValue).m_uiLuckUp;
                            } else {
                                lucky = G.DataMgr.zhufuData.getStageTotalLucky(thingConfig.m_iFunctionID, bestStage + 1);
                            }
                            lucky = Math.floor(lucky * G.DataMgr.constData.getValueById(KeyWord.PARAM_HEROSUB_JINGJIEFU_RETURN_PERCENT) / 100);
                            G.TipMgr.showConfirm(uts.format(G.DataMgr.langData.getLang(457), sysName, bestStage + 1, lucky),
                                ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onConfirmUseItem, thingInfo));
                        }
                    }
                }
                else {
                    G.TipMgr.addMainFloatTip('功能尚未开放');
                }
                break;

            case KeyWord.ITEM_FUNCTION_SUPPER_EXP:
                // 超级经验丹
                if (G.DataMgr.heroData.level < thingConfig.m_iFunctionValue) {
                    G.TipMgr.showConfirm(uts.format('推荐到{0}级再使用{1}，还要继续使用吗？', thingConfig.m_iFunctionValue, thingConfig.m_szName), ConfirmCheck.noCheck, '确定|取消', delegate(this, this.onConfirmUseItem, thingInfo, 1));
                } else {
                    this.onConfirmUseItem(MessageBoxConst.yes, false, thingInfo, 1);
                }
                break;

            case KeyWord.ITEM_FUNCTION_DAOGONGJIUXING:
                if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.BAR_FUNCTION_JIUXING, true)) {
                    G.Uimgr.createForm<HeroView>(HeroView).open(KeyWord.BAR_FUNCTION_JIUXING);
                } else {
                    G.TipMgr.addMainFloatTip('本功能尚未开启！');
                }
                break;
            //伙伴成长丹
            case KeyWord.ITEM_FUNCTION_BEAUTY_UP:
            case KeyWord.ITEM_FUNCTION_BEAUTY_ACTIVE:
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_PET_JINJIE, 0, 0, thingConfig.m_iFunctionID, PetJinJieFuncTab.jinjie);
                break;
            case KeyWord.ITEM_FUNCTION_BEAUTY_KF:
                // 功法
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_PET_JINJIE, 0, 0, thingConfig.m_iFunctionID, PetJinJieFuncTab.skill);
                break;
            case KeyWord.ITEM_FUNCTION_WUYU_JUHUN:
                // 聚神
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_PET_JINJIE, 0, 0, 0, PetJinJieFuncTab.lianShen);
                break;
            case KeyWord.ITEM_FUNCTION_BEAUTY_ZT:
                // 光印
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_PET_ZHENTU);
                break;
            case KeyWord.ITEM_FUNCTION_ITEM_GUOYUN_REFRESH:
                // 国运刷新   //todo 不知怎么验
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_GUOYUN);
                break;
            // case KeyWord.ITEM_FUNCTION_SUPPER_NEWSTAR:
            //     // 龙鳞果   //todo 不知怎么验
            //     G.ActionHandler.executeFunction(KeyWord.SUBBAR_FUNCTION_JINMAI);
            //     break;
            case KeyWord.ITEM_FUNCTION_ITEM_SEND_POS:
                // 穿云箭   //todo 不知怎么验
                if (G.DataMgr.heroData.guildId > 0) {
                    if (G.DataMgr.sceneData.curPinstanceID > 0) {
                        G.TipMgr.addMainFloatTip('副本中无法使用穿云箭。');
                    }
                    else {
                        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildCyjRequest());
                    }
                }
                else {
                    G.TipMgr.addMainFloatTip('你没有宗门，无法使用穿云箭。');
                }
                break;

            case KeyWord.ITEM_FUNCTION_YUANBO_BOX:
                // 钻石商店
                G.TipMgr.showConfirm(G.DataMgr.langData.getLang(172, thingConfig.m_iFunctionValue), ConfirmCheck.noCheck, '确定|取消', delegate(this, this._onUseItemThingConfirm, thingConfig, thingInfo));
                break;
            //落雷
            case KeyWord.ITEM_FUNCTION_HAQX_RAYL:
                G.TipMgr.addMainFloatTip('参加黑暗侵袭活动时，点击落雷按钮使用');
                break;
            //激励
            case KeyWord.ITEM_FUNCTION_HAQX_URGE:
                G.TipMgr.addMainFloatTip('参加黑暗侵袭活动时，点击激励按钮使用');
                break;
            case KeyWord.ITEM_FUNCTION_EQUIP_QHF:
            case KeyWord.ITEM_FUNCTION_ZFEQUIP_UPCOLOR:
                //装备进阶符，颜色进阶
                G.Uimgr.createForm<ZhufuEquipUpColorView>(ZhufuEquipUpColorView).open(thingConfig, thingInfo.m_usPosition);
                break;
            case KeyWord.ITEM_FUNCTION_GUILD_LINGPAI:
                //宗门令牌
                G.ActionHandler.executeFunction(KeyWord.BAR_FUNCTION_GUILD);
                break;
            case KeyWord.ITEM_FUNCTION_REVIVE:
                G.TipMgr.addMainFloatTip('角色死亡时使用复活角色！');
                break;
            case KeyWord.ITEM_FUNCTION_FABAO:
                G.ActionHandler.executeFunction(KeyWord.BAR_FUNCTION_ANQI, 0, 0, thingConfig.m_iFunctionID);
                break;
            //时装卡需要检查延时还是附魔的区别
            case KeyWord.ITEM_FUNCTION_DRESS_IMAGE:
                let dressInfo: Protocol.DressImageListInfo = G.DataMgr.heroData.dressList;
                let dressID: number = ThingData.getDressImageID(thingConfig.m_iFunctionID);
                let canUse: boolean = true;
                for (let i: number = 0; i < dressInfo.m_ucNumber; i++) {
                    if (dressInfo.m_astImageList[i].m_uiImageID == dressID && dressInfo.m_astImageList[i].m_uiTimeOut == 0) {
                        //不限时时装无法使用限时卡延时
                        if (thingConfig.m_iFunctionValue > 0) {
                            G.TipMgr.addMainFloatTip('该时装无需延时');
                            canUse = false;
                        }
                        else {
                            let tab: number = KeyWord.OTHER_FUNCTION_DRESS;
                            G.Uimgr.createForm<JinjieView>(JinjieView).open(tab, dressID);
                            canUse = false;
                        }
                    }
                }

                if (canUse) {
                    this._doUseItemThing(thingInfo, useNum);
                    let tabType = KeyWord.OTHER_FUNCTION_DRESS;
                    G.Uimgr.createForm<JinjieView>(JinjieView).open(tabType, dressID);
                }
                break;
            case KeyWord.ITEM_FUNCTION_TITLECARD:
                // 称号卡

                let title: Protocol.TitleFixOne = G.DataMgr.titleData.getSpecTitleOneInfo(thingConfig.m_iFunctionID);
                canUse = true;
                if (title != null && title.m_uiTimeOut == 0) {
                    //不限时时装无法使用限时卡延时
                    if (thingConfig.m_iFunctionValue > 0) {
                        G.TipMgr.addMainFloatTip('该称号无需延时');
                        canUse = false;
                    }
                    else {
                        let tab = KeyWord.OTHER_FUNCTION_HEROTITLE;
                        G.Uimgr.createForm<HeroView>(HeroView).open(tab, thingConfig.m_iFunctionID);
                        canUse = false;
                    }
                }
                if (canUse) {
                    this._doUseItemThing(thingInfo, useNum);
                    let tab = KeyWord.OTHER_FUNCTION_HEROTITLE;
                    G.Uimgr.createForm<HeroView>(HeroView).open(tab, thingConfig.m_iFunctionID);
                }

                break;

            case KeyWord.ITEM_FUNCTION_JINGJIEDAN:
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_JU_YUAN)
                break;
            case KeyWord.ITEM_FUNCTION_MERGE_ITEM:
                //todao 合服活动收集
                //sendEvent(EventTypes.showHfhdDislog, DialogCmd.open);
                break;
            case KeyWord.ITEM_FUNCTION_OPEN_MAGICCUBE:
                G.Uimgr.createForm<HeroView>(HeroView).open(KeyWord.OTHER_FUNCTION_MAGICCUBE);
                break;
            case KeyWord.ITEM_FUNCTION_TTHD:
                // sendEvent(EventTypes.showTtbzDislog, DialogCmd.open);
                break;
            case KeyWord.ITEM_FUNCTION_ZONGZI_EXCHANGE:
                // sendEvent(EventTypes.showDuanwuDialog, DialogCmd.open);
                break;
            case KeyWord.ITEM_FUNCTION_ROSE:
                if (G.DataMgr.heroData.mateName != '') {
                    G.Uimgr.createForm<SendFlowerView>(SendFlowerView).open(G.DataMgr.heroData.mateName, G.DataMgr.heroData.lover.m_stID);
                }
                else {
                    G.TipMgr.addMainFloatTip('可以点击角色头像赠送鲜花');
                }
                break;
            //功能类型_幻化造型
            case KeyWord.ITEM_FUNCTION_SUBIMAGE:
                // 幻化造型
                let functionID: number = thingConfig.m_iFunctionID;
                if (functionID > 0) {
                    let zhufuData: ZhufuData = G.DataMgr.zhufuData;
                    let imgConfig: GameConfig.ZhuFuImageConfigM = zhufuData.getImageConfig(zhufuData.getImageLevelID(functionID, 1));
                    if (imgConfig == null) {
                        G.TipMgr.addMainFloatTip('该幻化卡不存在！');
                    }
                    else {
                        let data: Protocol.CSHeroSubSuper = zhufuData.getData(imgConfig.m_iZhuFuID);
                        if (zhufuData.isActive(imgConfig.m_iZhuFuID, functionID)) {
                            if (zhufuData.getTimeItem(imgConfig.m_iZhuFuID, functionID).m_uiTimeOut == 0) {
                                let tab = imgConfig.m_iZhuFuID;
                                if (imgConfig.m_iZhuFuID == KeyWord.HERO_SUB_TYPE_ZUOQI || imgConfig.m_iZhuFuID == KeyWord.HERO_SUB_TYPE_WUHUN)
                                    G.Uimgr.createForm<JinjieView>(JinjieView).open(tab, functionID);
                                else
                                    G.Uimgr.createForm<HeroView>(HeroView).open(tab, functionID);
                            }
                            else {
                                //已经激活过了，直接使用道具。
                                this._doUseItemThing(thingInfo, useNum, -1);
                            }
                        }
                        else {
                            //打开对应的祝福系统
                            let tab = imgConfig.m_iZhuFuID;
                            if (imgConfig.m_iZhuFuID == KeyWord.HERO_SUB_TYPE_ZUOQI || imgConfig.m_iZhuFuID == KeyWord.HERO_SUB_TYPE_WUHUN)
                                G.Uimgr.createForm<JinjieView>(JinjieView).open(tab, functionID);
                            else if (imgConfig.m_iZhuFuID == KeyWord.HERO_SUB_TYPE_YUYI)
                                G.Uimgr.createForm<JinjieView>(JinjieView).open(KeyWord.OTHER_FUNCTION_EQUIP_WINGJINGLIAN, functionID);
                            else
                                G.Uimgr.createForm<HeroView>(HeroView).open(tab, functionID);
                        }
                    }

                }

                break;
            case KeyWord.ITEM_FUNCTION_MJ_LOTTERY:
                G.Uimgr.createForm<TanBaoView>(TanBaoView).open(thingConfig.m_iFunctionID);
                break;
            case KeyWord.ITEM_FUNCTION_RECHARGE_BOX:
                G.TipMgr.showConfirm(G.DataMgr.langData.getLang(174), ConfirmCheck.noCheck, '充值|取消', delegate(this, this._confirmRechargeBox));
                break;
            case KeyWord.ITEM_FUNCTION_CALLBOSS_CARD:
                if (G.DataMgr.sceneData.curSceneID != thingConfig.m_iFunctionValue) {
                    G.TipMgr.addMainFloatTip('不在指定场景，无法使用该道具');
                }
                else {
                    G.TipMgr.showConfirm('是否使用该物品召唤BOSS？', ConfirmCheck.noCheck, '召唤|取消', delegate(this, this._onUseItemThingConfirm));
                }
                break;
            case KeyWord.ITEM_FUNCTION_ZFEQUIP_UPCOLOR:
                //this.dispatchEvent(Events.ShowZbqhfDialog, thingConfig);
                //let upequip = G.Uimgr.createForm<EquipView>(EquipView);
                //if (upequip != null) {
                //    upequip.open(KeyWord.OTHER_FUNCTION_EQUIP_UPLEVEL);
                //}
                break;
            case KeyWord.ITEM_FUNCTION_BLOOD_UP:
            case KeyWord.ITEM_FUNCTION_CRAZYBLOOD_DRUG:
                if (G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_CRAZYBLOOD, true)) {
                    G.Uimgr.createForm<HeroView>(HeroView).open(KeyWord.OTHER_FUNCTION_CRAZYBLOOD);
                }
                break;
            case KeyWord.ITEM_FUNCTION_EQUIPSTARWASH:
                //洗炼材料
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_HUNGU_WASH);
                break;
            case KeyWord.ITEM_FUNCTION_FAQI_SUIPIAN:
            case KeyWord.ITEM_FUNCTION_FAQI_UPLEVEL:
                if (G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.BAR_FUNCTION_FAQI, true)) {
                    G.ActionHandler.executeFunction(KeyWord.BAR_FUNCTION_FAQI, 0, 0, thingConfig.m_iFunctionID, FaQiPanelTag.TAG_ENHANCE);
                }
                break;
            case KeyWord.ITEM_FUNCTION_FAQI_SKILL:
                G.ActionHandler.executeFunction(KeyWord.BAR_FUNCTION_FAQI, 0, 0, thingConfig.m_iFunctionID, FaQiPanelTag.TAG_SKILL);
                break;
            //case KeyWord.ITEM_FUNCTION_WJ_EXCHANGE:
            //    let wjtoday: number = G.SyncTime.getDateAfterStartServer();
            //    if (wjtoday > 7) {
            //        G.Uimgr.createForm<FanLiDaTingView>(FanLiDaTingView).open(FanLiDaTingTab.wuJiExchange);
            //    }
            //    else {
            //        G.TipMgr.addMainFloatTip('活动暂未开启')
            //    }
            //    break;
            //case KeyWord.ITEM_FUNCTION_TX_EXCHANGE:
            //    let txtoday: number = G.SyncTime.getDateAfterStartServer();
            //    if (txtoday > 14) {
            //        G.Uimgr.createForm<FanLiDaTingView>(FanLiDaTingView).open(FanLiDaTingTab.tianXiaExchange);
            //    }
            //    else {
            //        G.TipMgr.addMainFloatTip('活动暂未开启')
            //    }
            //    break;
            case KeyWord.ITEM_FUNCTION_SELECT_CHEST:
                // 可选择宝箱
                G.Uimgr.createForm<FourInOneView>(FourInOneView).open(thingConfig, thingInfo);
                break;

            case KeyWord.ITEM_FUNCTION_LOTTERY_BOX:
                // 开宝箱
                G.Uimgr.createForm<LotteryBoxView>(LotteryBoxView).open(thingInfo);
                break;
            case KeyWord.ITEM_FUNCTION_LQ_UP:
            case KeyWord.ITEM_FUNCTION_LQ_LUCK:
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_EQUIPLQ);
                break;
            case KeyWord.ITEM_FUNCTION_LH_ITEM:
                G.ActionHandler.executeFunction(KeyWord.BAR_FUNCTION_LIEHUN);
                break;

            case KeyWord.ITEM_FUNCTION_GUAJI_CARD:
                //挂机卡
                let leftTime = G.DataMgr.systemData.GuajiLeftTime;
                if (leftTime >= this.guajiMaxTime) {
                    G.TipMgr.addMainFloatTip("挂机时长已达到最大时长20小时");
                    return;
                } else {
                    let willLeftTime = leftTime + thingConfig.m_iFunctionValue * useNum;
                    if (willLeftTime > this.guajiMaxTime) {
                        G.TipMgr.showConfirm("使用将超出最大时长20小时，超出部分将不计入时长", ConfirmCheck.noCheck, "确认|取消", delegate(this, this.onConfirmUseItem, thingInfo, useNum));
                    } else {
                        this._doUseItemThing(thingInfo, useNum, targetUnitID);
                    }
                }
                break;
            case KeyWord.ITEM_FUNCTION_DIGONGMIYAO:
                // 地宫密钥
                G.Uimgr.createForm<BossView>(BossView).open(KeyWord.OTHER_FUNCTION_DI_BOSS);
                break;

            case KeyWord.ITEM_FUNCTION_TZSP:
                // 图纸碎片
                G.Uimgr.createForm<ItemMergeView>(ItemMergeView).open(KeyWord.MERGER_CLASS1_STRONG_ITEM);
                break;
            case KeyWord.ITEM_FUNCTION_VIP_SKILL:
                //经验副本vip体验卡
                let status1 = G.DataMgr.pinstanceData.isGuilder;
                let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_SHNS);
                if (null == info) {
                    return;
                }
                let status2 = info.m_uiCurLevel <= 10;
                //let status3 = G.DataMgr.sceneData.curPinstanceID == Macros.PINSTANCE_ID_SHNS;
                if (status1 && status2 /*&& status3*/) {
                    this._doUseItemThing(thingInfo, useNum, targetUnitID);
                }
                break;
            case KeyWord.ITEM_FUNCTION_WYSP:
                // 伙伴碎片
                G.Uimgr.createForm<PetView>(PetView).open(KeyWord.OTHER_FUNCTION_PET_SUIPIAN);
                break;
            case KeyWord.ITEM_FUNCTION_BEAUTY_AWAKE:
                let petId = G.DataMgr.petData.isAllPetCanAwaken();
                G.Uimgr.createForm<PetView>(PetView).open(KeyWord.OTHER_FUNCTION_PET_JINJIE, petId, thingConfig.m_iFunctionID);
                break;
            case KeyWord.ITEM_FUNCTION_LIANQI_JIACHENG:
                // 附魔加成卷
                if (G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_EQUIPLQ, true)) {
                    G.Uimgr.createForm<EquipView>(EquipView).open(KeyWord.OTHER_FUNCTION_EQUIPLQ);
                }
                break;
            case KeyWord.ITEM_FUNCTION_QINGLONG_JJ:
            case KeyWord.ITEM_FUNCTION_BAIHU_JJ:
            case KeyWord.ITEM_FUNCTION_ZHUQUE_JJ:
            case KeyWord.ITEM_FUNCTION_XUANWU_JJ:
            case KeyWord.ITEM_FUNCTION_QINGLONG_TP:
            case KeyWord.ITEM_FUNCTION_BAIHU_TP:
            case KeyWord.ITEM_FUNCTION_ZHUQUE_TP:
            case KeyWord.ITEM_FUNCTION_XUANWU_TP:
            case KeyWord.ITEM_FUNCTION_QINGLONG_JH:
            case KeyWord.ITEM_FUNCTION_BAIHU_JH:
            case KeyWord.ITEM_FUNCTION_ZHUQUE_JH:
            case KeyWord.ITEM_FUNCTION_XUANWU_JH:
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_SIXIANG_JINJIE, 0, 0, thingConfig.m_iFunctionID);
                break;

            case KeyWord.ITEM_FUNCTION_YIYUANDUOBAO:
                //一元夺宝卷
                let time = 1531324800000;
                if (G.SyncTime.getCurrentTime() >= time) {
                    G.TipMgr.addMainFloatTip("活动已结束！")
                    return;
                }
                if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_YIYUANDUOBAO)) {
                    G.Uimgr.createForm<YiYuanDuoBaoView>(YiYuanDuoBaoView).open(YiYuanDuoBaoGroupType.yiyuanduobaoPanel);
                } else {
                    G.TipMgr.addMainFloatTip("功能尚未开启！")
                }
                break;

            case KeyWord.ITEM_FUNCTION_FANJIETAOZHUANG:
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_FANXIAN_FANJIE);
                break;

            case KeyWord.ITEM_FUNCTION_XIANJIETAOZHUANG:
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_FANXIAN_XIANJIE);
                break;

            case KeyWord.ITEM_FUNCTION_TAOZHUANGSHENGLING:
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_FANXIAN_SHENGLING);
                break;

            case KeyWord.ITEM_FUNCTION_CHARGE_KFREBATE:
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_KUANGHUANZHEKOU);
                if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_KUANGHUANZHEKOU)) {
                    G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_KUANGHUANZHEKOU);
                } else {
                    G.TipMgr.addMainFloatTip("功能尚未开启！")
                }
                break;

            case KeyWord.ITEM_FUNCTION_BOSSHOME_TICKET:
                //BOSS之家门票
                if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_ZYCM_HOME_BOSS)) {
                    G.Uimgr.createForm<BossView>(BossView).open(KeyWord.OTHER_FUNCTION_ZYCM_HOME_BOSS, thingConfig.m_iFunctionID - 1);
                } else {
                    G.TipMgr.addMainFloatTip("功能尚未开启！")
                }
                break;
            case KeyWord.ITEM_FUNCTION_WORLDBOSS_REWARD:
                //BOSS之家门票
                if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ITEM_FUNCTION_WORLDBOSS_REWARD)) {
                    G.Uimgr.createForm<BossView>(BossView).open(KeyWord.ITEM_FUNCTION_WORLDBOSS_REWARD, thingConfig.m_iFunctionID - 1);
                } else {
                    G.TipMgr.addMainFloatTip("功能尚未开启！")
                }
                break;

            case KeyWord.ITEM_FUNCTION_WING_MATERIAL:
                ////翅膀
                //let equipList = G.DataMgr.thingData.getContainer(Macros.CONTAINER_TYPE_ROLE_EQUIP);
                //let goToKeyWord: number;
                //if (!equipList)
                //    goToKeyWord = KeyWord.OTHER_FUNCTION_MERGE_WING;

                //let wingEquip = equipList[KeyWord.EQUIP_PARTCLASS_WING - KeyWord.EQUIP_PARTCLASS_MIN];
                //if (!wingEquip)
                //    goToKeyWord = KeyWord.OTHER_FUNCTION_MERGE_WING;
                //else
                //    goToKeyWord = KeyWord.OTHER_FUNCTION_EQUIP_WINGJINGLIAN;

                //G.ActionHandler.executeFunction(goToKeyWord);
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_MERGE_WING);
                break;
            case KeyWord.ITEM_FUNCTION_SLOTLT:
                //装备炼体
                if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_EQUIP_LIANTI)) {
                    G.Uimgr.createForm<EquipView>(EquipView).open(KeyWord.OTHER_FUNCTION_EQUIP_LIANTI);
                } else {
                    G.TipMgr.addMainFloatTip("功能尚未开启！");
                }
                break;
            case KeyWord.ITEM_FUNCTION_DHCL:
                if (G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.BAR_FUNCTION_MALL)) {
                    G.Uimgr.createForm<MallView>(MallView).open(EnumStoreID.STORE_REBORN);
                } else {
                    G.TipMgr.addMainFloatTip("功能尚未开启！");
                }
                break;
            //case KeyWord.ITEM_FUNCTION_EQUIP_FINAL:
            //    // 装备终极进阶
            //    if (G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_EQUIP_UPLEVEL, true)) {
            //        uts.log(" 装备终极进阶   thingInfo " + thingInfo.m_iThingID);
            //        this._doUseItemThing(thingInfo);
            //    }
            //    break;
            case KeyWord.ITEM_FUNCTION_STAR_LOTTERY:
                if (G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.ACT_FUNCTION_STARSTREASURY)) {
                    G.Uimgr.createForm<StarsTreasuryView>(StarsTreasuryView).open();
                } else {
                    G.TipMgr.addMainFloatTip("功能尚未开启！");
                }
                break;
            case KeyWord.ITEM_FUNCTION_ITEM_SKY_LOTTERY:
                if (G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.ITEM_FUNCTION_ITEM_SKY_LOTTERY)) {
                    G.Uimgr.createForm<TanBaoView>(TanBaoView).open();
                } else {
                    G.TipMgr.addMainFloatTip("功能尚未开启！");
                }
                break;
            case KeyWord.ITEM_FUNCTION_HUNGU_FZ:
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_HUNGUN_FZ);
                break;
            case KeyWord.ITEM_FUNCTION_DRESS_STRENG:
                G.Uimgr.createForm<JinjieView>(JinjieView).open(KeyWord.OTHER_FUNCTION_DRESS);
                break;
            case KeyWord.ITEM_FUNCTION_JIUXING_LEVELUP_TO:
                G.Uimgr.createForm<JinjieView>(JinjieView).open(KeyWord.OTHER_FUNCTION_DRESS);
                break;
            case KeyWord.ITEM_FUNCTION_SAIJI_SUBIMAGE:
                G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_SAIJI_WAIXIAN, 0, 0, thingConfig.m_iFunctionID);
                break;
            default:
                if (KeyWord.ITEM_FUNCTION_SPECIAL_ITEM == thingConfig.m_ucFunctionType) {
                    // 特殊物品，检查buff
                    if (GameIDUtil.isBuffID(thingConfig.m_iFunctionID)) {
                        let useFlag: boolean = this._checkCanUseByBuff(BuffData.getBuffByID(thingConfig.m_iFunctionID), delegate(this, this._onUseItemThingConfirm, thingConfig, thingInfo, useNum, targetUnitID))
                        if (!useFlag) {
                            // 已经弹出Buff使用提示了
                            return;
                        }
                    }
                }

                this._doUseItemThing(thingInfo, useNum, targetUnitID);
                if (KeyWord.ITEM_FUNCTION_BEAUTY_TJ_CARD == thingConfig.m_ucFunctionType || KeyWord.ITEM_FUNCTION_BEAUTY_CARD == thingConfig.m_ucFunctionType) {
                    G.Uimgr.createForm<PetView>(PetView).open(KeyWord.OTHER_FUNCTION_PET_JINJIE, thingConfig.m_iFunctionID);
                }
                break;
        }
    }

    private onConfirmUseItem(state: MessageBoxConst, isCheckSelected: boolean, thingInfo: Protocol.ContainerThingInfo, useNum: number = 1, targetUnitID: number = -1): void {
        if (MessageBoxConst.yes == state) {
            this._doUseItemThing(thingInfo, useNum, targetUnitID);
        }
    }

    private _confirmRechargeBox(state: number, isCheckSelected: boolean): void {
        if (state != MessageBoxConst.yes) return;
        G.ActionHandler.go2Pay();
    }

    /**
     * 使用技能道具
     * @param thingInfo
     *
     */
    private _useSkillItem(thingConfig: GameConfig.ThingConfigM, thingInfo: Protocol.ContainerThingInfo): void {
        // 检查是否会覆盖身上的buff
        let useFlag: boolean = true;
        let buffs: GameConfig.BuffConfigM[] = G.ActionHandler.getBuffConfigByThingId(thingConfig.m_iID);
        if (null != buffs && buffs.length > 0) {
            for (let buffConfig of buffs) {
                useFlag = this._checkCanUseByBuff(buffConfig, delegate(this, this._useSkillItemCallBack, thingInfo));
                if (!useFlag) {
                    // 有Buff提示了，直接跳出循环
                    break;
                }
            }
        }
        if (useFlag) {
            this._useSkillItemCallBack(MessageBoxConst.yes, thingInfo);
        }
    }
    private _useSkillItemCallBack(state: number, thingInfo: Protocol.ContainerThingInfo, isCheckSelected: boolean = true): void {
        if (MessageBoxConst.yes != state) {
            return;
        }
        G.ModuleMgr.skillModule.onUseSkillItem(thingInfo);
    }


    private _onUseItemThingConfirm(state: MessageBoxConst, isCheckSelected: boolean, thingConfig: GameConfig.ThingConfigM, thingInfo: Protocol.ContainerThingInfo, useNum: number = 1, targetUnitID: number = -1): void {
        if (MessageBoxConst.yes != state) {
            return;
        }
        this._doUseItemThing(thingInfo, useNum, targetUnitID);
    }


    private _doUseItemThing(thingInfo: Protocol.ContainerThingInfo, useNum: number = 1, targetUnitID: number = -1): void {
        if (useNum <= 0) {
            useNum = 1;
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOperateContainerMsg(Macros.CONTAINER_OPERATE_USE_THING, Macros.CONTAINER_TYPE_ROLE_BAG, thingInfo.m_iThingID, //物品id
            thingInfo.m_usPosition, //物品位置
            useNum, targetUnitID));
    }


    private _checkCanUseByBuff(buffConfig: GameConfig.BuffConfigM, confirmCallback: (state: MessageBoxConst, isCheckSelected: boolean) => void): boolean {
        let hero = G.UnitMgr.hero;
        if (hero.buffProxy.hasBuffByID(buffConfig.m_uiBuffID, false, buffConfig.m_ucBuffLevel, 1)) {
            // 没有相同ID的buff，检查是否有相同类型的，有相同类型的
            G.TipMgr.addMainFloatTip('您已使用了更高级的同类物品');
            return false;
        }

        let prompFlag: boolean = false;
        if (hero.buffProxy.hasBuffByID(buffConfig.m_uiBuffID)) {
            // 有相同ID的buff
            if (0 == buffConfig.m_ucAddTime) {
                // 不可累积时间
                prompFlag = true;
            }
        }

        if (prompFlag) {
            G.TipMgr.showConfirm('使用该物品将覆盖身上的已有效果，是否继续？', ConfirmCheck.noCheck, '确定|取消', confirmCallback);
        }

        return !prompFlag;
    }

    /**
         * 销毁某个物品
         * @param data
         *
         */
    destoryTarget(data: BagItemData, type: number): void {
        if (type != Macros.CONTAINER_TYPE_ROLE_BAG) {
            return;
        }

        let config: GameConfig.ThingConfigM = data.thingData.config;
        if (1 == config.m_ucIsDestroy) //按需求改为直接售卖商店。
        {
            let thingInfo: Protocol.ContainerThingInfo = data.thingData.data as Protocol.ContainerThingInfo;
            if (this.m_noPromptDestroy) {
                this._continueDestoryThing(MessageBoxConst.yes, true, thingInfo);
            }
            else {
                G.TipMgr.showConfirm(uts.format('您确定要将{0}丢弃？', TextFieldUtil.getItemText(config)), ConfirmCheck.withCheck, '确定|取消', delegate(this, this._continueDestoryThing, thingInfo));
            }
        }
        else {
            //物品不可摧毁 不可售卖
            G.TipMgr.addMainFloatTip('物品不可丢弃！');
        }
    }

    private _continueDestoryThing(state: number = 0, isCheckSelected: boolean, args: any = null): void {
        if (state == MessageBoxConst.yes) {
            this.m_noPromptDestroy = isCheckSelected;
            let thingInfo: Protocol.ContainerThingInfo = args as Protocol.ContainerThingInfo;
            this.throwItem(thingInfo);
        }
    }

    /**
    * 丢弃物品。
    * @param s
    */
    throwItem(itemInfo: Protocol.ContainerThingInfo): void {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOperateContainerMsg(Macros.CONTAINER_OPERATE_DROP_THING, Macros.CONTAINER_TYPE_ROLE_BAG, itemInfo.m_iThingID, itemInfo.m_usPosition, itemInfo.m_iNumber));
    }




}