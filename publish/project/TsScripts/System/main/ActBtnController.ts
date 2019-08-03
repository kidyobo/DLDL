import { LuckyCatCtrl } from './ctrls/LuckyCatCtrl';
import { GameIdDef } from "System/channel/GameIdDef";
import { EnumDurationType, FuncBtnState } from "System/constants/GameEnum";
import { KeyWord } from "System/constants/KeyWord";
import { ActivityData } from "System/data/ActivityData";
import { FuncLimitData } from "System/data/FuncLimitData";
import { HddtDailyActItemData } from "System/data/vo/HddtDailyActItemData";
import { Global as G } from "System/global";
import { BaseFuncIconCtrl } from "System/main/BaseFuncIconCtrl";
import { BtnGroupCtrl, BtnGroupItem } from "System/main/BtnGroupCtrl";
import { ActHomeCtrl } from "System/main/ctrls/ActHomeCtrl";
import { AfterSevenDayActCtrl } from "System/main/ctrls/AfterSevenDayActCtrl";
import { BaoXiangZhengBaCtrl } from "System/main/ctrls/BaoXiangZhengBaCtrl";
import { BigSkillShowCtrl } from "System/main/ctrls/BigSkillShowCtrl";
import { BossCtrl } from "System/main/ctrls/BossCtrl";
import { DailyRechargeCtrl } from "System/main/ctrls/DailyRechargeCtrl";
import { DaTiHuoDongCtrl } from "System/main/ctrls/DaTiHuoDongCtrl";
import { DoubleChargeCtrl } from "System/main/ctrls/DoubleChargeCtrl";
import { DownloadCtrl } from "System/main/ctrls/DownloadCtrl";
import { FanLiDaTingCtrl } from "System/main/ctrls/FanLiDaTingCtrl";
import { FuLiDaTingCtrl } from "System/main/ctrls/FuLiDaTingCtrl";
import { HuSongShuangBeiCtrl } from "System/main/ctrls/HuSongShuangBeiCtrl";
import { JiShouCtrl } from 'System/main/ctrls/JiShouCtrl';
import { JiuZhuanXingGongCtrl } from "System/main/ctrls/JiuZhuanXingGongCtrl";
import { JiXingTongTianTaCtrl } from "System/main/ctrls/JiXingTongTianTaCtrl";
import { JuBaoPenCtrl } from "System/main/ctrls/JuBaoPenCtrl";
import { KaiFuHuoDongCtrl } from "System/main/ctrls/KaiFuHuoDongCtrl";
import { KaiFuZhiZunDuoBaoCtrl } from "System/main/ctrls/KaiFuZhiZunDuoBaoCtrl";
import { KfLingDiMainCtrl } from "System/main/ctrls/KfLingDiMainCtrl";
import { KfLingDiSubCtrl } from "System/main/ctrls/KfLingDiSubCtrl";
import { KuaFu3v3Ctrl } from "System/main/ctrls/KuaFu3v3Ctrl";
import { KuaFuBossCtrl } from "System/main/ctrls/KuaFuBossCtrl";
import { KuaFuZhiZunDuoBaoCtrl } from "System/main/ctrls/KuaFuZhiZunDuoBaoCtrl";
import { KuaFuZongMenZhanCtrl } from "System/main/ctrls/KuaFuZongMenZhanCtrl";
import { KuaiSuShengJiCtrl } from "System/main/ctrls/KuaiSuShengJiCtrl";
import { LuckyWheelCtrl } from "System/main/ctrls/LuckyWheelCtrl";
import { LxflCtrl } from 'System/main/ctrls/LxflCtrl';
import { NewYearActCtrl } from "System/main/ctrls/NewYearActCtrl";
import { PaoWenQuanCtrl } from "System/main/ctrls/PaoWenQuanCtrl";
import { PayCtrl } from "System/main/ctrls/PayCtrl";
import { PinstanceHallCtrl } from "System/main/ctrls/PinstanceHallCtrl";
import { RankCtrl } from "System/main/ctrls/RankCtrl";
import { RiChangCtrl } from "System/main/ctrls/RiChangCtrl";
import { SecondChargeCtrl } from "System/main/ctrls/SecondChargeCtrl";
import { SevenGoalCtrl } from "System/main/ctrls/SevenGoalCtrl";
import { ShenMiShangDianCtrl } from "System/main/ctrls/ShenMiShangDianCtrl";
import { ShouChaoGongChengCtrl } from "System/main/ctrls/ShouChaoGongChengCtrl";
import { SiWangZhanChangCtrl } from "System/main/ctrls/SiWangZhanChangCtrl";
import { SpeicialTeQuanCtrl } from "System/main/ctrls/SpecialTeQuanCtrl";
import { TanbaoCtrl } from "System/main/ctrls/TanbaoCtrl";
import { TianJiangFushenCtrl } from "System/main/ctrls/TianJiangFuShenCtrl";
import { TouZhiCtrl } from "System/main/ctrls/TouZhiCtrl";
import { WangHouJiangXiangCtrl } from "System/main/ctrls/WangHouJiangXiangCtrl";
import { WorldBossCtrl } from "System/main/ctrls/WorldBossCtrl";
import { WorldCupActCtrl } from 'System/main/ctrls/WorldCupActCtrl';
import { XianShiTeMaiCtrl } from "System/main/ctrls/XianShiTeMaiCtrl";
import { XunBaoCtrl } from "System/main/ctrls/XunBaoCtrl";
import { XXDDCtrl } from "System/main/ctrls/XXDDCtrl";
import { YiYuanCtrl } from "System/main/ctrls/YiYuanCtrl";
import { BiWuDaHuiPreCtrl } from "System/main/ctrls/BiWuDaHuiPreCtrl";
import { BiWuDaHuiFnlCtrl } from "System/main/ctrls/BiWuDaHuiFnlCtrl";
import { YiYuanDuoBaoCtrl } from "System/main/ctrls/YiYuanDuoBaoCtrl";
import { ZhenLongQiJuCtrl } from "System/main/ctrls/ZhenLongQiJuCtrl";
import { ZhenYingZhanCtrl } from "System/main/ctrls/ZhenYingZhanCtrl";
import { ZhiZunDuoBaoCtrl } from "System/main/ctrls/ZhiZunDuoBaoCtrl";
import { ZongMenZhengBaZhanCtrl } from "System/main/ctrls/ZongMenZhengBaZhanCtrl";
import { ZuanShiTeQuanCtrl } from 'System/main/ctrls/ZuanShiTeQuanCtrl';
import { MapId } from "System/map/MapId";
import { SyncTime } from "System/net/SyncTime";
import { Macros } from "System/protocol/Macros";
import { ShenZhuangShouJiView } from 'System/szsj/ShenZhuangShouJiView';
import { GameObjectGetSet } from 'System/uilib/CommonForm';
import { List } from "System/uilib/List";
import { UiElements } from "System/uilib/UiElements";
import { DataFormatter } from "System/utils/DataFormatter";
import { Profiler } from 'System/utils/Profiler';
import { VPlusPowerCtrl } from "System/main/ctrls/VPlusPowerCtrl";
import { MohuaZhanzhengCtrl } from "System/main/ctrls/MohuaZhanzhengCtrl";
import { XianShiMiaoShaCtrl } from 'System/main/ctrls/XianShiMiaoShaCtrl'
import { WenJuanCtrl } from 'System/main/ctrls/WenJuanCtrl'
import { MergeCtrl } from 'System/main/ctrls/MergeCtrl'
import { MallCtrl } from 'System/main/ctrls/MallCtrl'
import { ConsumeRankCtrl } from 'System/main/ctrls/ConsumeRankCtrl'
import { StarsTreasuryCtrl } from 'System/main/ctrls/StarsTreasuryCtrl'
import { MeiRiLiBaoCtrl } from './ctrls/MeiRiLiBaoCtrl';
import { XHCZCtrl } from './ctrls/XHCZCtrl';
import { GameCenterCtrl } from './ctrls/GameCenterCtrl';


export class ActBtnController extends BtnGroupCtrl {
    private readonly ItemGap = 4;
    private readonly LineCnt = 4;

    /**二级菜单*/
    private subActBtns: GameObjectGetSet;
    private subActMask: GameObjectGetSet;
    private subActBg: GameObjectGetSet;

    /**二级菜单按钮列表*/
    private subList: List;

    private lists: UnityEngine.Transform[] = [];
    private subListItems: BtnGroupItem[] = [];

    /**二级菜单数据*/
    private subParentCtrl: BaseFuncIconCtrl;

    /**功能数据数组*/
    private listCtn: BaseFuncIconCtrl[][] = new Array<BaseFuncIconCtrl[]>();
    /**每一行包含的所有按钮，未经筛选*/
    private rawListCtn: BaseFuncIconCtrl[][] = [];

    private _hallItemList: { [id: number]: HddtDailyActItemData };

    //private btn7Goal: GameObjectGetSet;
    private btnYiYuan: GameObjectGetSet;
    private btnVipHuangJin: GameObjectGetSet;
    private btnXianShiTeMai: GameObjectGetSet;
    private btnCaiZHuangChouJiang: GameObjectGetSet;
    private btnWorldCup: GameObjectGetSet;
    private btnShengDian: GameObjectGetSet;
    private btnXianShiMiaoSha: GameObjectGetSet;
    /**装备收集*/
    btnEquipCollect: GameObjectGetSet;
    equipCollectObj: GameObjectGetSet;

    /**新开放的功能需要转圈特效，true表需要*/
    private newFuncEffectMap: { [id: number]: boolean } = {};
    /**第二行图标默认有转圈特效，true表已经转过*/
    private defaultEffectMap: { [id: number]: boolean } = {};

    private enabled = true;

    constructor() {
        super();
        this.initCtrl();
    }

    setView(uiElems: UiElements) {
        this.gameObject = uiElems.getElement('actBtns');

        this.effectPrefab = uiElems.getElement('actIconEffect');

        let actIconElems = uiElems.getUiElements('actBtns');
        this.initSwitcher(actIconElems);

        this.itemTemp = actIconElems.getElement('btnAct');

        for (let i = 1; i <= this.LineCnt; i++) {
            let list = actIconElems.getTransform('actLine' + i);
            this.lists.push(list);
        }

        this.subActBtns = new GameObjectGetSet(uiElems.getElement('subActBtns'));
        this.showCloseSubActBtns(false);
        let subActBtnElems = uiElems.getUiElements('subActBtns');
        this.subList = subActBtnElems.getUIList('line');
        this.subList.onClickItem = delegate(this, this.onClickSubListItem);
        this.subActMask = new GameObjectGetSet(subActBtnElems.getElement('mask'));
        this.subActBg = new GameObjectGetSet(subActBtnElems.getElement('bg'));

        //this.btn7Goal = new GameObjectGetSet(actIconElems.getElement('btn7Goal'));
        //this.addSpecialItem(KeyWord.ACT_FUNCTION_7GOAL, this.btn7Goal);

        this.btnYiYuan = new GameObjectGetSet(actIconElems.getElement('btnYiYuan'));
        this.addSpecialItem(KeyWord.ACT_FUNCTION_FIRSTCHARGE, this.btnYiYuan);
        //问卷调查
        // this.btnWenJuan = actIconElems.getElement('btnWenJuan');
        // this.addSpecialItem(KeyWord.ACT_FUNCTION_WENJUAN, this.btnWenJuan);

        this.btnVipHuangJin = new GameObjectGetSet(actIconElems.getElement('btnVipHuangJin'));
        this.addSpecialItem(KeyWord.OTHER_FUNCTION_GOLD_VIP, this.btnVipHuangJin);

        //this.btnSuBeiYuanBao = actIconElems.getElement('btnSuBeiYuanBao');
        //this.addSpecialItem(KeyWord.ACT_FUNCTION_YUANBAOFANBEI, this.btnSuBeiYuanBao);

        //this.btnChongZhiKH = actIconElems.getElement('btnChongZhiKH');
        //this.addSpecialItem(KeyWord.ACT_FUNCTION_CHONGZHIKUANGHUAN, this.btnChongZhiKH);
        // 限时特卖
        this.btnXianShiTeMai = new GameObjectGetSet(actIconElems.getElement('btnXstm'));
        this.addSpecialItem(KeyWord.ACT_FUNCTION_XIANSHITEMAI, this.btnXianShiTeMai);

        //彩装抽奖
        //this.btnCaiZHuangChouJiang = actIconElems.getElement('btnCaiZHuangChouJiang');
        //this.addSpecialItem(KeyWord.ACT_FUNCTION_XUNBAO, this.btnCaiZHuangChouJiang);


        //运营活动1
        //this.btnYunYingHuoDong1 = actIconElems.getElement("btnYunYingHuoDong1");
        //this.addSpecialItem(KeyWord.ACT_FUNCTION_YUNYINGHUODONG1, this.btnYunYingHuoDong1);


        //神装收集
        //this.equipCollectObj = uiElems.getElement("equipCollect");
        //this.addSpecialItem(KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION, this.equipCollectObj);

        //挂机打宝
        let btnBoss = new GameObjectGetSet(actIconElems.getElement("btnBoss"));
        this.addSpecialItem(KeyWord.ACT_FUNCTION_BOSS, btnBoss);

        //火热世界杯
        this.btnWorldCup = new GameObjectGetSet(actIconElems.getElement("btnWorldCup"));
        this.addSpecialItem(KeyWord.ACT_FUNCTION_WORLDCUP, this.btnWorldCup);

        //盛典活动
        this.btnShengDian = new GameObjectGetSet(actIconElems.getElement("btnShengDian"));
        this.addSpecialItem(KeyWord.ACT_FUNCTION_YUNYINGHUODONG1, this.btnShengDian);

        //限时秒杀
        this.btnXianShiMiaoSha = new GameObjectGetSet(actIconElems.getElement("btnXianShiMiaoSha"));
        this.addSpecialItem(KeyWord.ACT_FUNC_XHMS, this.btnXianShiMiaoSha);

        Game.UIClickListener.Get(this.subActMask.gameObject).onClick = delegate(this, this.onClickSubActMask);
        //Game.UIClickListener.Get(this.equipCollectObj).onClick = delegate(this, this.onClickBtnEquipCollect);
    }

    setEnabled(enabled: boolean) {
        if (this.enabled != enabled) {
            this.enabled = enabled;
            this.gameObject.SetActive(enabled);
            if (!enabled) {
                this.showCloseSubActBtns(false);
            } else {
                this.update(true);
            }
        }
    }

    onEnterScene() {
        // 进入副本自动收起
        let sceneData = G.DataMgr.sceneData;
        // 副本、个人竞技、boss地图自动收起右上角按钮栏
        if (0 == sceneData.preSceneID || MapId.needAutoCloseActBtnCtrl(sceneData.curSceneID, sceneData.curPinstanceID) != MapId.needAutoCloseActBtnCtrl(sceneData.preSceneID, sceneData.prePinstanceID)) {
            if (this.isOpened) {
                this.changeState(false, false);
                this.autoClosed = true;
            }
        } else {
            if (this.autoClosed) {
                this.changeState(true, false);
            }
        }
    }

    onFunctionUnlock(cfgs: GameConfig.NPCFunctionLimitM[]) {
        let ids = [];
        for (let cfg of cfgs) {
            ids.push(cfg.m_iName);
            this.newFuncEffectMap[cfg.m_iName] = true;
        }
    }

    onShowOtherInfo() {
        if (this.isOpened && this.listCtn[0].length > 3) {
            this.changeState(false, false);
            this.autoClosed = true;
        }
    }

    private onClickSubActMask() {
        this.showCloseSubActBtns(false);
    }

    private initCtrl() {
        this.addCtrls(
            //new GuaJiCtrl(), // 挂机
            new RiChangCtrl(), // 日常
            new DailyRechargeCtrl(),//每日首充
            new DownloadCtrl(), // 下载
            //new WeiXinGiftCtrl(),//微信礼包
            new PinstanceHallCtrl(),  // 副本大厅
            new GameCenterCtrl(), // sdk的游戏中心
            new ActHomeCtrl(),  // 活动大厅
            new BossCtrl(),  // boss
            new KuaiSuShengJiCtrl(), // 快速升级
            new FuLiDaTingCtrl(), // 福利大厅
            new FanLiDaTingCtrl(), // 返利大厅
            new KaiFuHuoDongCtrl(), // 开服活动
            new TanbaoCtrl(),//探宝
            new PayCtrl(),//充值
            new DoubleChargeCtrl(),//双倍充值
            // new TouZhiCtrl(),//投资理财
            new RankCtrl(), // 排行榜
            new TianJiangFushenCtrl(), // 天降福神
            new KuaFuZongMenZhanCtrl(), // 跨服宗门争霸
            new PaoWenQuanCtrl(), // 泡温泉
            new DaTiHuoDongCtrl(), // 答题活动
            new ZhenYingZhanCtrl(), // 阵营战
            new HuSongShuangBeiCtrl(), // 护送双倍
            new WorldBossCtrl(), // 世界boss
            new KuaFuBossCtrl(), // 跨服boss
            new KuaFu3v3Ctrl(), // 跨服3v3
            new KfLingDiMainCtrl(), // 领地主城战
            new KfLingDiSubCtrl(), // 领地卫城战
            new BaoXiangZhengBaCtrl(), // 宝箱争霸
            new ShouChaoGongChengCtrl(), // 末日终结者
            new BiWuDaHuiPreCtrl(), // 比武大会初赛
            new BiWuDaHuiFnlCtrl(), // 比武大会决赛
            new ZongMenZhengBaZhanCtrl(), // 宗门争霸战
            new JiuZhuanXingGongCtrl(), // 猎户座
            new JiXingTongTianTaCtrl(), // 星球之巅
            new ShenMiShangDianCtrl(), //神秘商店
            new LuckyWheelCtrl(),//幸运转盘
            //new XunBaoCtrl(),//寻宝
            new XXDDCtrl(),//跨服点灯|星星点灯
            // new JuBaoPenCtrl(),//聚宝盆 //合到盛典活动里
            new ZhiZunDuoBaoCtrl(),//至尊夺宝
            new KuaFuZhiZunDuoBaoCtrl(),//跨服至尊夺宝
            new KaiFuZhiZunDuoBaoCtrl(),//开服至尊夺宝
            new WangHouJiangXiangCtrl(), // 能力叛乱
            new SiWangZhanChangCtrl(),//死亡战场
            new YiYuanDuoBaoCtrl(),//一元夺宝
            new ZhenLongQiJuCtrl(), // 西洋棋
            new YiYuanCtrl(),//一元首充
            // new WenJuanCtrl(),//问卷调查
            new SecondChargeCtrl(),//次充礼包
            //new SevenGoalCtrl(), //七日目标
            new BigSkillShowCtrl(),//大招展示
            new XianShiTeMaiCtrl(), // 限时特卖
            new MergeCtrl(),//合服活动
            new SpeicialTeQuanCtrl(),//特殊特权
            new AfterSevenDayActCtrl(),//7天后的7日活动
            //new YuanBaoFanBeiCtrl(),//元宝翻倍
            //new ChongZhiKHCtrl(),//充值狂欢
            new JiShouCtrl(), //交易所
            new NewYearActCtrl(),
            new LxflCtrl(), //连续返利
            new WorldCupActCtrl(),//火热世界杯
            new ZuanShiTeQuanCtrl(),//钻石VIP
            new VPlusPowerCtrl(),//V+特权
            new MohuaZhanzhengCtrl(),//魔化战争
            new XianShiMiaoShaCtrl(),//限时秒杀
            new MallCtrl(), // 商城
            new ConsumeRankCtrl(),  //消费排行榜
            new StarsTreasuryCtrl(), // 星斗宝库
            new LuckyCatCtrl(),//招财猫
            // new MeiRiLiBaoCtrl(),//每日礼包
            new XHCZCtrl(),//循环充值
        );

        for (let i = 0; i < this.LineCnt; i++) {
            this.listCtn.push([]);
            this.rawListCtn.push([]);
        }
    }

    enableLine4(value: boolean) {
        this.lists[3].gameObject.SetActive(value);
    }

    onCfgReady() {
        let activityData = G.DataMgr.activityData;
        let funcLimitData = G.DataMgr.funcLimitData;
        for (let idKey in this.id2ctrlMap) {
            let ctrl = this.id2ctrlMap[idKey];
            let actId = activityData.getActIdByFuncId(ctrl.data.id);
            if (actId > 0) {
                let actCfg = activityData.getActivityConfig(actId);
                if (null != actCfg) {
                    ctrl.data.setDisplayName(actCfg.m_szName);
                }
            }

            let funcCfg = funcLimitData.getFuncLimitConfig(ctrl.data.id);
            if (funcCfg && funcCfg.m_ucFunctionClass == KeyWord.FUNC_LIMIT_ACT) {
                ctrl.data.subTabs = funcLimitData.getSubFuncIds(funcCfg.m_iName);
            }

            let actIconCfg = funcLimitData.getActIconCfg(ctrl.data.id);
            if (actIconCfg) {
                if (actIconCfg.m_iType != KeyWord.ICON_ORDER2) {
                    let lineIdx = this.getLineIndex(actIconCfg.m_iArea);
                    this.rawListCtn[lineIdx].push(ctrl);
                    let item = this.id2item[idKey];
                    if (null != item && item.IsSpecial) {
                        item.goTrans.SetParent(this.lists[lineIdx]);
                    }
                }
            } else {
                uts.logError('缺少图标配置：' + ctrl.data.id);
            }
        }

        // 预先对按钮进行排序
        for (let i = 0; i < this.LineCnt; i++) {
            this.rawListCtn[i].sort(delegate(this, this.sortListCtrls));
        }
    }

    checkUpdate() {
        if (!this.enabled || !this.isDirty || !G.DataMgr.questData.isQuestDataReady || !G.DataMgr.activityData.isReady) {
            return;
        }
        Profiler.push('ActBtnController');
        

        let funcLimitData: FuncLimitData = G.DataMgr.funcLimitData;

        // 因下面几个特殊按钮会参与混排，所以先确定它们显示不显示

        // 神装收集
        //let showSzsj = false;
        //if (funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION)) {
        //    showSzsj = true;
        //}
        //this.id2item[KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION].goGetSet.SetActive(showSzsj);

        //let show7goal = false;
        //// 检查7日目标按钮
        //if (this.isOpened && funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_7GOAL)) {
        //    show7goal = true;
        //}

        //// 检查一元首充按钮，当显示神装收集的时候，绝版武器会消失，所以这时候显示一元首充
        //let showYiYuan = false;
        //if (this.isOpened && showSzsj && funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_FIRSTCHARGE) &&
        //    !G.DataMgr.firstRechargeData.isNotShowFirstRechargeIcon()) {
        //    showYiYuan = true;
        //}

        // 再处理3行按钮
        for (let lineCtn of this.listCtn) {
            lineCtn.length = 0;
        }

        let hasTipMarkHide = false;
        if (this.isOpened || G.DataMgr.sceneData.curPinstanceID <= 0) {
            Profiler.push('getBarActivityList');
            let hddtItem: HddtDailyActItemData;
            this._hallItemList = {};
            let activityList: HddtDailyActItemData[] = this.getBarActivityList();

            for (let i: number = 0; i < activityList.length; i++) {
                hddtItem = activityList[i];
                this._hallItemList[hddtItem.config.m_iID] = hddtItem;
            }
            Profiler.pop();

            let currentTime = Math.round(G.SyncTime.getCurrentTime() / 1000);
            let activityData = G.DataMgr.activityData;

            Profiler.push('loop');
            for (let i = 0; i < this.LineCnt; i++) {
                let rawCtrls = this.rawListCtn[i];
                let lineCtrls = this.listCtn[i];
                for (let ctrl of rawCtrls) {
                    if (ctrl.data.needGuild && G.DataMgr.heroData.guildId <= 0) {
                        // 没有宗门
                        continue;
                    }
                    // 副本里收起按钮，常驻按钮和时段活动按钮除外，order小于0表示常驻按钮
                    let actIconCfg = funcLimitData.getActIconCfg(ctrl.data.id);
                    let add2line = this.isOpened || actIconCfg.m_iOrder < 0 || 0 != actIconCfg.m_iActIcon;
                    if (add2line) {
                        this.checkBtnState(actIconCfg, ctrl, currentTime, lineCtrls);
                    } else if (!hasTipMarkHide && i < 3) {
                        if (this.checkBtnState(actIconCfg, ctrl, currentTime, null) != FuncBtnState.Invisible && ctrl.data.tipCount > 0) {
                            hasTipMarkHide = true;
                        }
                    }
                }
            }
            Profiler.pop();
        }

        Profiler.push('doUpdateIcon');
        let showIds: number[] = [];
        let listCnt = this.listCtn.length;
        let xStart = 0;
        for (let i = 0; i < listCnt; i++) {
            let ctrls = this.listCtn[i];
            let nextPos = xStart;
            xStart = 0;
            let dirPlus = i < listCnt - 1 ? -1 : 1;
            let list = this.lists[i];
            let listHeight = (list as UnityEngine.RectTransform).sizeDelta.y;
            let cnt = ctrls.length;
            for (let i = 0; i < cnt; i++) {
                let ctrl = ctrls[i];
                showIds.push(ctrl.data.id);
                let item: BtnGroupItem = this.getItemByIdInternal(ctrl.data.id, list);
                let itemWidth = item.Width;
                let crossLine = item.Height > listHeight * 1.5;
                item.setPosXY(nextPos + 0.5 * itemWidth * dirPlus, crossLine ? -36 : 0);
                nextPos += (itemWidth + this.ItemGap) * dirPlus;
                this.doUpdateIcon(item, ctrl);
                Game.UIClickListener.Get(item.goGetSet.gameObject).onClick = delegate(this, this.onClickItem, ctrls[i]);

                if(crossLine) {
                    // 说明这个按钮占了2行
                    xStart = nextPos;
                }
            }
        }
        this.showThisItems(showIds);
        Profiler.pop();

        // 再检查二级菜单
        if (this.subActBtns.activeSelf && null != this.subParentCtrl) {
            if (FuncBtnState.Invisible != this.subParentCtrl.data.state) {
                this.checkSubBtns();
            } else {
                // 父图标已经消失了，关闭二级菜单
                this.showCloseSubActBtns(false);
            }
        }

        this.switchTipGetSet.SetActive(!this.IsOpened && hasTipMarkHide);
        this.isDirty = false;

        Profiler.pop();
    }

    private checkBtnState(actIconCfg: GameConfig.ActIconOrderM, ctrl: BaseFuncIconCtrl, currentTime: number, lineCtrls: BaseFuncIconCtrl[]): FuncBtnState {
        if (ctrl.data.needGuild && G.DataMgr.heroData.guildId <= 0) {
            // 没有宗门
            return FuncBtnState.Invisible;
        }
        //Profiler.push('ctrl ' + ctrl.data.id);
        let funcLimitData = G.DataMgr.funcLimitData;
        if (ctrl.data.id == KeyWord.ACT_FUNCTION_KFHD) {
            if (G.SyncTime.getDateAfterStartServer() <= 7) {
                if (!funcLimitData.isFuncEntranceVisible(ctrl.data.id)) {
                    // 功能不可用
                    return FuncBtnState.Invisible;
                }
            }
        }
        else {
            if (!funcLimitData.isFuncEntranceVisible(ctrl.data.id)) {
                // 功能不可用
                return FuncBtnState.Invisible;
            }
        }


        ctrl.onStatusChange();
        if (FuncBtnState.Invisible == ctrl.data.state) {
            //Profiler.pop();
            return FuncBtnState.Invisible;
        }

        if (actIconCfg.m_iActIcon) {
            // 这是时段活动图标
            let activityData = G.DataMgr.activityData;
            let actId = activityData.getActIdByFuncId(ctrl.data.id);
            let hddtItem = this._hallItemList[actId];
            if (hddtItem != null) {
                if (lineCtrls) {
                    lineCtrls.push(ctrl);
                }

                if (activityData.isActivityOpen(actId)) {
                    let actStatus = activityData.getActivityStatus(actId);
                    ctrl.data.desc = '火热进行中';
                    ctrl.data.state = FuncBtnState.Shining;
                    ctrl.data.time = actStatus.m_iEndTime - currentTime;
                } else if (hddtItem.durationType != EnumDurationType.InDuration) {
                    ctrl.data.desc = DataFormatter.second2hhmm(hddtItem.status.m_iStartTime) + '开启 ';
                }
            }
            //Profiler.pop();
            return ctrl.data.state;
        }

        if (ctrl.data.checkActivityIds && !this.checkAnyAcitivityOpen(ctrl.data.checkActivityIds)) {
            // 不是时段活动，则活动运行时才显示
            //Profiler.pop();
            return FuncBtnState.Invisible;
        }

        //是否存入
        if (actIconCfg.m_iType == KeyWord.ICON_ORDER1) {
            // 这是大图标，只要有二级图标显示就显示
            let state = FuncBtnState.Invisible;
            let tipCount = 0;
            let hasShining = false;
            let subIconIds = funcLimitData.getIconBigTypeVec(actIconCfg.m_iID);
            let subCtrls: BaseFuncIconCtrl[] = [];
            for (let subIconId of subIconIds) {
                if (funcLimitData.isFuncEntranceVisible(subIconId)) {
                    let subCtrl = this.getControllerById(subIconId);
                    if (null != subCtrl) {
                        subCtrl.onStatusChange();
                        if (FuncBtnState.Invisible != subCtrl.data.state) {
                            if (lineCtrls) {
                                subCtrls.push(subCtrl);
                            }
                            state = subCtrl.data.state;
                            tipCount += subCtrl.data.tipCount;
                            if (FuncBtnState.Shining == subCtrl.data.state) {
                                hasShining = true;
                                if (tipCount > 0) {
                                    // 已经确定有转圈、有红点，就可以跳出循环了
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            if (FuncBtnState.Invisible == state) {
                ctrl.subCtrls = null;
                //Profiler.pop();
                return FuncBtnState.Invisible;
            }

            ctrl.data.state = hasShining ? FuncBtnState.Shining : state;
            ctrl.data.tipCount = tipCount;
            ctrl.subCtrls = subCtrls;
        }
        if (lineCtrls) {
            lineCtrls.push(ctrl);
        }
        return ctrl.data.state;
    }

    private getLineIndex(area: number): number {
        let lineIndex: number = 0;
        if (area > 0) {
            lineIndex = area - 1;
        }
        return lineIndex;
    }

    private checkSubBtns() {
        let subCtrls: BaseFuncIconCtrl[];
        let cnt = 0;
        if (null != this.subParentCtrl) {
            subCtrls = this.subParentCtrl.subCtrls;
            cnt = subCtrls.length;
        }

        if (cnt > 0) {
            // 显示二级菜单
            this.subList.Count = cnt;
            let oldItemCnt = this.subListItems.length;
            for (let i = 0; i < cnt; i++) {
                let item: BtnGroupItem;
                if (i < oldItemCnt) {
                    item = this.subListItems[i];
                } else {
                    this.subListItems.push(item = new BtnGroupItem());
                    item.setComponents(new GameObjectGetSet(this.subList.GetItem(i).gameObject));
                }
                this.doUpdateIcon(item, subCtrls[i]);
            }
            let ctrlRt = this.subParentCtrl.item.goTrans as UnityEngine.RectTransform;
            let rt = this.subActBg.gameObject.GetComponent(UnityEngine.RectTransform.GetType()) as UnityEngine.RectTransform;
            rt.position = ctrlRt.position;
            let lp = rt.localPosition;
            lp.y -= (this.subParentCtrl.item.Height / 2 + 4);
            rt.localPosition = lp;

            let subSize = this.subList.Size;
            subSize.x += 12;
            subSize.y += 12;
            rt.sizeDelta = subSize;
            this.showCloseSubActBtns(true);
        } else {
            this.showCloseSubActBtns(false);
        }
    }

    private doUpdateIcon(item: BtnGroupItem, ctrl: BaseFuncIconCtrl) {
        let needEffect = false;
        if (!item.IsSpecial) {
            // 特殊按钮不需要转圈动画
            let actIconCfg: GameConfig.ActIconOrderM = G.DataMgr.funcLimitData.getActIconCfg(ctrl.data.id);
            // 第二行按钮默认就有转圈特效
            let lineIdx = this.getLineIndex(actIconCfg.m_iArea);
            needEffect = (1 == lineIdx && !this.defaultEffectMap[ctrl.data.id]);
            if (!needEffect) {
                // 检查是否新开放的功能需要转特效
                needEffect = this.isNewFuncCtrl(ctrl);
                if (!needEffect && null != ctrl.subCtrls) {
                    if (actIconCfg.m_iType == KeyWord.ICON_ORDER1) {
                        // 这是大图标，只要有二级图标显示就显示
                        for (let subCtrl of ctrl.subCtrls) {
                            if (this.isNewFuncCtrl(subCtrl)) {
                                needEffect = true;
                                break;
                            }
                        }
                    }
                }
            }
        }
        ctrl.data.systemEffect = needEffect;
        item.update(ctrl, this.effectPrefab);
    }

    private isNewFuncCtrl(ctrl: BaseFuncIconCtrl): boolean {
        let isNew = false;
        if (this.newFuncEffectMap[ctrl.data.id]) {
            isNew = true;
        } else {
            let subTabs = ctrl.data.subTabs;
            if (null != subTabs) {
                for (let subId of subTabs) {
                    if (this.newFuncEffectMap[subId]) {
                        isNew = true;
                        break;
                    }
                }
            }
        }
        return isNew;
    }

    private getBarActivityList(): HddtDailyActItemData[] {
        let level: number = G.DataMgr.heroData.level;
        let syncTime: SyncTime = G.SyncTime;
        let now = syncTime.getCurrentTime();
        let nowInSecond = Math.round(now / 1000);
        let day: number = syncTime.serverDate.getDay();
        let activityData: ActivityData = G.DataMgr.activityData;
        let actList: GameConfig.ActHomeConfigM[] = activityData.getActHomeCfgList(day);
        let resultList: HddtDailyActItemData[] = new Array<HddtDailyActItemData>();

        let count: number = 0;
        let durType: number = 0;
        let status: Protocol.ActivityStatus;
        let cfg: GameConfig.ActivityConfigM;
        let actId2ListIdx: { [actId: number]: number } = {};
        for (let actCfg of actList) {
            if (level < actCfg.m_iLevel) {
                continue;
            }

            status = activityData.getActivityStatus(actCfg.m_iID);
            //过滤已经开启的活动，但是没有到达结束时间
            if (status == null || (status.m_iStartTime < nowInSecond && status.m_ucStatus == Macros.ACTIVITY_STATUS_UNOPEN)) {
                continue;
            }
            //时段活动未开启前 （半小时 = 30分 = 1800秒） 提醒
            if (status == null || status.m_iStartTime > nowInSecond + 1800) {
                continue;
            }

            cfg = activityData.getActivityConfig(actCfg.m_iID);
            let timeLimitConfig = activityData.getTimeLimitConfigByID(cfg.m_iTimeLimitID);

            let startTime = timeLimitConfig.m_aOpenTimeStamps[actCfg.m_ucTimeId - 1];
            let endTime = timeLimitConfig.m_aCloseTimeStamps[actCfg.m_ucTimeId - 1];

            durType = EnumDurationType.InDuration;
            if (status.m_ucStatus == Macros.ACTIVITY_STATUS_UNOPEN) //只有没有开始的活动才开始
                durType = syncTime.getDurationType(startTime, endTime, now);
            if (durType != EnumDurationType.After) {//活动没有结束
                // 先检查是否已经添加了相同活动
                let oldIdx = -1;
                if (actCfg.m_iID in actId2ListIdx) {
                    let replace = false;
                    oldIdx = actId2ListIdx[actCfg.m_iID];
                    let oldItemData = resultList[oldIdx];
                    if (durType > oldItemData.durationType) {
                        // 说明这个时间段正常进行中，直接替换掉此前加入数组那个时间段
                        replace = true;
                    } else if (durType == EnumDurationType.Before && durType == oldItemData.durationType && actCfg.m_ucTimeId < oldItemData.config.m_ucTimeId) {
                        // 如果两个活动时间段都还没开始，那么时间越靠近的优先
                        replace = true;
                    }

                    if (!replace) {
                        continue;
                    }
                }

                let itemData = new HddtDailyActItemData();
                itemData.config = actCfg;
                itemData.status = status;
                itemData.durationType = durType;
                if (oldIdx < 0) {
                    resultList.push(itemData);
                    actId2ListIdx[actCfg.m_iID] = resultList.length - 1;
                } else {
                    resultList[oldIdx] = itemData;
                }
                if (durType == EnumDurationType.InDuration) {
                    count++;
                }
            }
        }

        if (resultList.length == 0) {
            return resultList;
        }

        resultList.sort(this._sortListData);
        resultList.length = count > 0 ? count : 1;
        return resultList;
    }

    private _sortListData(data1: HddtDailyActItemData, data2: HddtDailyActItemData): number {
        if (data1.durationType != data2.durationType) {
            return data2.durationType - data1.durationType;
        }
        else {
            return data1.config.m_ucPos - data2.config.m_ucPos;
        }
    }

    /**
     * 根据ID获取对应的controller。
     * @param id
     * @return
     *
     */
    getControllerById(id: number): BaseFuncIconCtrl {
        return this.id2ctrlMap[id];
    }

    getFuncBtn(id: number): UnityEngine.GameObject {
        //if (KeyWord.ACT_FUNCTION_7GOAL == id) {
        //    return this.btn7Goal.activeSelf ? this.btn7Goal.gameObject : null;
        //}

        //if (KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION == id) {
        //    return this.btnEquipCollect.activeSelf ? this.btnEquipCollect : null;
        //}

        let actIconCfg: GameConfig.ActIconOrderM = G.DataMgr.funcLimitData.getActIconCfg(id);
        if (null == actIconCfg) {
            return null;
        }

        let cnt = 0;
        let ctrls: BaseFuncIconCtrl[];
        let itemGo: UnityEngine.GameObject;
        if (actIconCfg.m_iType == KeyWord.ICON_ORDER2) {
            // 小类型，检查二级菜单
            if (this.subActBtns.activeSelf && null != this.subParentCtrl) {
                cnt = this.subList.Count;
                for (let i = 0; i < cnt; i++) {
                    let ctrl = this.subParentCtrl.subCtrls[i];
                    if (ctrl.data.id == id) {
                        itemGo = ctrl.item.goGetSet.gameObject;
                        break;
                    }
                }
            }

            if (null == itemGo) {
                // 如果二级菜单没找到，则找对应的大图标
                return this.getFuncBtn(actIconCfg.m_iArea);
            }

        } else {
            let item = this.id2item[id];
            if (null != item && item.goGetSet.activeSelf) {
                itemGo = item.goGetSet.gameObject;
            }
        }

        return itemGo;
    }

    private showCloseSubActBtns(isShow: boolean) {
        this.subActBtns.SetActive(isShow);
        let lineIdx = 0;
        if (isShow && null != this.subParentCtrl) {
            let actIconCfg = G.DataMgr.funcLimitData.getActIconCfg(this.subParentCtrl.data.id);
            lineIdx = this.getLineIndex(actIconCfg.m_iArea);
        }
        for (let i = lineIdx + 1; i < 3; i++) {
            this.lists[i].gameObject.SetActive(!isShow);
        }
    }

    executeFunc(type: number): boolean {
        // 检查当前环境是否可以使用
        if (!G.ActionHandler.checkCrossSvrUsable(true, type)) {
            return false;
        }
        // 检查对应活动状态，比如步步高升等
        let actID: number = G.DataMgr.activityData.getActIdByFuncId(type);
        if (actID > 0 && !G.DataMgr.activityData.isActivityOpen(actID)) {
            G.TipMgr.addMainFloatTip('活动尚未开始。');
            return false;
        }
        let ctrl = this.getControllerById(type);
        if (null == ctrl) {
            return false;
        }
        ctrl.handleClick();
        return true;
    }

    private onClickItem(ctrl: BaseFuncIconCtrl) {
        this.handleClick(ctrl);
    }

    private onClickSubListItem(index: number) {
        if (null != this.subParentCtrl && null != this.subParentCtrl.subCtrls) {
            this.handleClick(this.subParentCtrl.subCtrls[index]);
        }
    }

    private handleClick(ctrl: BaseFuncIconCtrl) {
        if (!G.ActionHandler.checkCrossSvrUsable(true, ctrl.data.id)) {
            return;
        }
        let aIconCfg = G.DataMgr.funcLimitData.getActIconCfg(ctrl.data.id);
        // 点击过了就去掉特效
        delete this.newFuncEffectMap[ctrl.data.id];
        let subTabs = ctrl.data.subTabs;
        if (null != subTabs) {
            for (let subTabId of subTabs) {
                delete this.newFuncEffectMap[subTabId];
            }
        }
        this.defaultEffectMap[ctrl.data.id] = true;
        this.doUpdateIcon(ctrl.item, ctrl);
        if (KeyWord.ICON_ORDER2 == aIconCfg.m_iType) {
            // 如果点击了二级菜单，还要刷新下一级菜单按钮的特效
            this.doUpdateIcon(this.subParentCtrl.item, this.subParentCtrl);
        }

        G.ViewCacher.functionGuideView.guideOffTarget(ctrl.item.goGetSet.gameObject);
        if (KeyWord.ICON_ORDER1 == aIconCfg.m_iType) {
            // 这是大图标，需要开启二级菜单
            this.subParentCtrl = ctrl;
            this.checkSubBtns();
        } else {
            if (KeyWord.ICON_ORDER2 == aIconCfg.m_iType) {
                this.showCloseSubActBtns(false);
            }

            if (ctrl.data.checkActivityIds && !this.checkAnyAcitivityOpen(ctrl.data.checkActivityIds)) {
                G.TipMgr.addMainFloatTip('活动暂未开始。');
                return;
            }
            if (ctrl.data.checkSceneId > 0 && G.DataMgr.sceneData.curSceneID == ctrl.data.checkSceneId) {
                G.TipMgr.addMainFloatTip('您已经在活动场景中了。');
                return;
            }
            ctrl.handleClick();
        }
    }

    private checkAnyAcitivityOpen(activityIds: number[]): boolean {
        let activityData = G.DataMgr.activityData;
        for (let activityId of activityIds) {
            if (activityData.isActivityOpen(activityId)) {
                return true;
            }
        }
        return false;
    }

    //private onClickBtnEquipCollect() {
    //    //if (!G.ActionHandler.checkCrossSvrUsable(true, KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION)) {
    //    //    return;
    //    //}
    //    G.Uimgr.createForm<ShenZhuangShouJiView>(ShenZhuangShouJiView).open(KeyWord.OTHER_FUNCTION_EQUIP_COLLECTION);
    //}
}