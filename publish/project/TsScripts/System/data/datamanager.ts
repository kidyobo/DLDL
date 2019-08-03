import { FightTipData } from './FightTipsData';
import { LuckyCatData } from './../activity/luckyCat/LuckyCatData';
import { DaBaoData } from "System/data/DaBaoData";
import { KeyWord } from "System/constants/KeyWord";
import { AchievementData } from "System/data/AchievementData";
import { DaTiData } from "System/data/activities/DaTiData";
import { wenjuanData } from "System/data/activities/wenjuanData";
import { FirstRechargeData } from "System/data/activities/FirstRechargeData";
import { LeiJiRechargeData } from "System/data/activities/LeiJiRechargeData";
import { ZyzhData } from "System/data/activities/ZyzhData";
import { ActivityData } from "System/data/ActivityData";
import { BuffData } from "System/data/BuffData";
import { CdDataMgr } from "System/data/CdDataMgr";
import { ChatData } from "System/data/ChatData";
import { ConsumeRankData } from "System/data/ConsumeRankData";
import { ConstantParameterData } from "System/data/ConstantParameterData";
import { CrossParas } from "System/data/CrossParas";
import { DefaultValue } from "System/data/DefaultValue";
import { DropPlanData } from "System/data/DropPlanData";
import { EquipStrengthenData } from "System/data/EquipStrengthenData";
import { ErrorData } from "System/data/ErrorData";
import { FabaoData } from "System/data/FabaoData";
import { FmtData } from "System/data/FmtData";
import { FriendData } from "System/data/FriendData";
import { FuncLimitData } from "System/data/FuncLimitData";
import { GameParas } from "System/data/GameParas";
import { GiftGroupData } from "System/data/GiftGroupData";
import { GuideTipData } from "System/data/GuideTipData";
import { GuildData } from "System/data/GuildData";
import { IosLocalNotifyData } from "System/data/IosLocalNotifyData";
import { JiuXingData } from "System/data/JiuXingData";
import { JuyuanData } from "System/data/JuyuanData";
import { KaifuActivityData } from "System/data/KaifuActivityData";
import { KfData } from "System/data/KfData";
import { KfhdData } from "System/data/KfhdData";
import { KfjdcData } from "System/data/KfjdcData";
import { KuaFu3v3Data } from "System/data/KuaFu3v3Data";
import { LangData } from "System/data/LangData";
import { LingBaoData } from "System/data/LingBaoData";
import { LuckyWheelData } from "System/data/LuckyWheelData";
import { MagicCubeData } from "System/data/MagicCubeData";
import { MailData } from "System/data/MailData";
import { MainData } from "System/data/MainData";
import { MonsterData } from "System/data/MonsterData";
import { ModelData } from "System/data/ModelData";
import { MwslData } from "System/data/MwslData";
import { NPCData } from "System/data/NPCData";
import { NPCSellData } from "System/data/NPCSellData";
import { OtherPlayerData } from "System/data/OtherPlayerData";
import { PetData } from "System/data/pet/PetData";
import { PetExpeditionData } from "System/data/pet/PetExpeditionData";
import { PinstanceData } from "System/data/PinstanceData";
import { PlatformData } from "System/data/PlatformData";
import { QuestData } from "System/data/QuestData";
import { RankData } from "System/data/RankData";
import { RmbData } from "System/data/RmbData";
import { RoleAttributeData } from "System/data/RoleAttributeData";
import { HeroData } from "System/data/RoleData";
import { Runtime } from "System/data/Runtime";
import { SceneData } from "System/data/scenedata";
import { SettingData } from "System/data/SettingData";
import { SiXiangData } from "System/data/SiXiangData";
import { SkillData } from "System/data/SkillData";
import { SystemData } from "System/data/SystemData";
import { TeamData } from "System/data/TeamData";
import { TeamFbData } from "System/data/TeamFbData";
import { TgbjData } from "System/data/TgbjData";
import { ThingData } from "System/data/thing/ThingData";
import { VipData } from "System/data/VipData";
import { TitleData } from "System/data/vo/TitleData";
import { CameraAnimData } from "System/data/CameraAnimData";
import { BubbleData } from "System/data/BubbleData";
import { WybqData } from "System/data/WybqData";
import { ZhufuData } from "System/data/ZhufuData";
import { HfhdData } from "System/mergeActivity/HfhdData";
import { PayData } from "System/pay/PayData";
import { Macros } from "System/protocol/Macros";
import { DeputySetting } from "System/skill/DeputySetting";
import { CampRelation } from "System/utils/CampRelation";
import { FightingStrengthUtil } from "System/utils/FightingStrengthUtil";
import { GameIDUtil } from "System/utils/GameIDUtil";
import { UnitUtil } from "System/utils/UnitUtil";
import { DoubleChargeData } from "../pay/DoubleChargeData";
import { KfLingDiData } from "./KfLingDiData";
import { MingJiangData } from "./MingJiangData";
import { ShieldGodData } from 'System/data/ShieldGodData';
import { AuctionTreeData } from 'System/jishou/AuctionTreeData'
import { HunLiData } from 'System/data/hunli/HunLiData'
import { StarsTreasuryData } from "System/activity/xingdoubaoku/StarsTreasuryData";
import { TaskRecommendData } from 'System/data/TaskRecommendData'
import { LevelRecommendData } from 'System/data/LevelRecommendData'
import { FyGameLoginData } from 'System/FygameLogin/FyGameLoginData'
import { PayRecepitData } from 'System/data/PayRecepitData'
import { DynamicThingData } from "System/data/thing/DynamicThingData"
import { NewFuncPreData } from "System/data/NewFuncPreData"

export class DataManager {
    ready = false;
    payRecepitData: PayRecepitData = new PayRecepitData();
    hunliData: HunLiData = new HunLiData();
    gameParas: GameParas = new GameParas();
    crossParas: CrossParas = new CrossParas();
    runtime: Runtime = new Runtime();
    constData: ConstantParameterData = new ConstantParameterData();
    systemData: SystemData = new SystemData();
    roleAttributeData: RoleAttributeData = new RoleAttributeData();
    funcLimitData: FuncLimitData = new FuncLimitData();
    heroData: HeroData = new HeroData();
    npcData: NPCData = new NPCData();
    questData: QuestData = new QuestData();
    sceneData: SceneData = new SceneData();
    pinstanceData: PinstanceData = new PinstanceData();
    guildData: GuildData = new GuildData();
    vipData: VipData = new VipData();
    skillData: SkillData = new SkillData();
    thingData: ThingData = new ThingData();
    langData: LangData = new LangData();
    monsterData: MonsterData = new MonsterData();
    modelData: ModelData = new ModelData();
    deputySetting: DeputySetting = new DeputySetting();
    errorData: ErrorData = new ErrorData();
    buffData: BuffData = new BuffData();
    equipStrengthenData: EquipStrengthenData = new EquipStrengthenData();
    cdData: CdDataMgr = new CdDataMgr();
    localCdData: CdDataMgr = new CdDataMgr();
    friendData: FriendData = new FriendData();
    teamData: TeamData = new TeamData();
    chatData: ChatData = new ChatData();
    consumeRankData: ConsumeRankData = new ConsumeRankData();
    zhufuData: ZhufuData = new ZhufuData();
    settingData: SettingData = new SettingData();
    petData: PetData = new PetData();
    fabaoData: FabaoData = new FabaoData();
    npcSellData: NPCSellData = new NPCSellData();
    mailData: MailData = new MailData();
    platformData: PlatformData = new PlatformData();
    activityData: ActivityData = new ActivityData();
    otherPlayerData: OtherPlayerData = new OtherPlayerData();
    achievementData: AchievementData = new AchievementData();
    juyuanData: JuyuanData = new JuyuanData();
    sxtData: TeamFbData = new TeamFbData();
    jiuXingData: JiuXingData = new JiuXingData();
    lingbaoData: LingBaoData = new LingBaoData();
    titleData: TitleData = new TitleData();
    giftGroupData: GiftGroupData = new GiftGroupData();
    fmtData: FmtData = new FmtData();
    magicCubeData: MagicCubeData = new MagicCubeData();
    dropPlanData: DropPlanData = new DropPlanData();
    rankData: RankData = new RankData();
    tgbjData: TgbjData = new TgbjData();
    starsData: StarsTreasuryData = new StarsTreasuryData();
    kfData: KfData = new KfData();
    rmbData: RmbData = new RmbData();
    daTiData: DaTiData = new DaTiData();
    wenjuanData:wenjuanData = new wenjuanData();
    firstRechargeData: FirstRechargeData = new FirstRechargeData();
    luckyWheelData: LuckyWheelData = new LuckyWheelData();
    mwslData: MwslData = new MwslData();
    wybqData: WybqData = new WybqData();
    /**资源找回数据*/
    zyzhData: ZyzhData = new ZyzhData();
    payData: PayData = new PayData();
    kaifuActData: KaifuActivityData = new KaifuActivityData();
    kfhdData: KfhdData = new KfhdData();
    /**累计充值*/
    leiJiRechargeData: LeiJiRechargeData = new LeiJiRechargeData();
    guideTipData: GuideTipData = new GuideTipData();
    mainData: MainData = new MainData();
    kf3v3Data: KuaFu3v3Data = new KuaFu3v3Data();
    kfjdcData: KfjdcData = new KfjdcData();
    defaultValue: DefaultValue = new DefaultValue();
    /**合服活动*/
    hfhdData: HfhdData = new HfhdData();
    siXiangData: SiXiangData = new SiXiangData();
    petExpeditionData = new PetExpeditionData();
    kfLingDiData: KfLingDiData = new KfLingDiData();
    doubleChargeData: DoubleChargeData = new DoubleChargeData();
    //ios消息推送
    iosNotifyData: IosLocalNotifyData = new IosLocalNotifyData();
    mingJiangData: MingJiangData = new MingJiangData();
    shieldGodData = new ShieldGodData();
    cameraAnimData = new CameraAnimData();
    bubbleData = new BubbleData();
    auctionTreeData = new AuctionTreeData();
    taskRecommendData = new TaskRecommendData();
    levelRecommendData = new LevelRecommendData();
    luckyCatData = new LuckyCatData();
    dynamicThing: DynamicThingData = new DynamicThingData();
    newFuncPreData: NewFuncPreData = new NewFuncPreData(); 
    fightTipData:FightTipData = new FightTipData();
    //打马甲包
    dabaoData: DaBaoData = new DaBaoData();

    //fygame登录
    fygameLoginData: FyGameLoginData = new FyGameLoginData();

    onCfgReady() {
        GameIDUtil.initStaticMaps();
        UnitUtil.initStaticMaps();
        CampRelation.init();

        this.constData.onCfgReady();
        this.roleAttributeData.onCfgReady();
        this.funcLimitData.onCfgReady();
        this.npcData.onCfgReady();
        this.questData.onCfgReady();
        this.hunliData.onCfgReady();
        this.sceneData.onCfgReady();
        this.pinstanceData.onCfgReady();
        this.guildData.onCfgReady();
        this.guildData.onCfgReady();
        this.skillData.onCfgReady();
        this.thingData.onCfgReady();
        this.langData.onCfgReady();
        this.monsterData.onCfgReady();
        this.modelData.onCfgReady();
        this.errorData.onCfgReady();
        this.buffData.onCfgReady();
        this.equipStrengthenData.onCfgReady();
        this.vipData.onCfgReady();
        this.zhufuData.onCfgReady();
        this.petData.onCfgReady();
        this.fabaoData.onCfgReady();
        this.npcSellData.onCfgReady();
        this.activityData.onCfgReady();
        this.achievementData.onCfgReady();
        this.juyuanData.onCfgReady();
        this.lingbaoData.onCfgReady();
        this.giftGroupData.onCfgReady();
        this.titleData.onCfgReady();
        this.fmtData.onCfgReady();
        this.magicCubeData.onCfgReady();
        this.dropPlanData.onCfgReady();
        this.rankData.onCfgReady();
        this.zyzhData.onCfgReady();
        this.jiuXingData.onCfgReady();
        this.tgbjData.onCfgReady();
        this.starsData.onCfgReady();
        this.daTiData.onCfgReady();
        this.wenjuanData.onCfgReady();
        this.firstRechargeData.onCfgReady();
        this.mwslData.onCfgReady();
        this.wybqData.onCfgReady();
        this.payData.onCfgReady();
        this.kfhdData.onCfgReady();
        this.consumeRankData.onCfgReady();
        this.systemData.onCfgReady();
        this.guideTipData.onCfgReady();
        this.kf3v3Data.onCfgReady();
        this.hfhdData.onCfgReady();
        this.siXiangData.onCfgReady();
        this.kaifuActData.onCfgReady();
        this.defaultValue.onCfgReady();
        this.petExpeditionData.onCfgReady();
        this.doubleChargeData.onCfgReady();
        this.iosNotifyData.onCfgReady();
        this.mingJiangData.onCfgReady();
        this.shieldGodData.onCfgReady();
        this.auctionTreeData.onCfgReady();
        this.cameraAnimData.onCfgReady();
        this.bubbleData.onCfgReady();
        this.dabaoData.onCfgReady();
        this.taskRecommendData.onCfgReady();
        this.levelRecommendData.onCfgReady();
        this.fightTipData.onCfgReady();//战力提示
        //招财猫
        this.luckyCatData.onCfgReady();
        this.kfjdcData.onCfgReady();
        this.newFuncPreData.onCfgReady();
        this.dynamicThing.onCfgReady();
        // 初始化战斗力计算表
        FightingStrengthUtil.initStrengthMap();

        // 下面进行不同数据间的整合
        this.skillData.processSkills();
        this.chatData.processChatCd();
        this.npcSellData.updateMarketItemData(this.thingData);
        this.npcSellData.initStoreID2NpcID(this.npcData);
        this.activityData.levelGiftData.initMinAndMaxLevel();
        // 初始化连续签到礼包数据
        this.activityData.dailySignData.initGiftData(this.giftGroupData.getListDataByType(KeyWord.GIFT_SIGN_GIFT));
        this.activityData.dailySignData.setDailyGiftData(this.giftGroupData.getListDataByType(KeyWord.GIFT_SIGN_DAILY_GIFT));
        // 初始化特惠礼包
        this.kfhdData.initTeHuiLiBao();
        this.ready = true;
    }

    /**
    * 查询指定ID的拥有量，比如钻石数量。
	* @param id
	* @return
	*
	*/
    getOwnValueByID(id: number): number {
        let has: number;
        if (KeyWord.MONEY_YUANBAO_ID == id) {
            // 钻石
            has = this.heroData.gold;
        }
        else if (KeyWord.MONEY_YUANBAO_BIND_ID == id) {
            // 绑定钻石
            has = this.heroData.gold_bind;
        }
        else if (KeyWord.MONEY_TONGQIAN_ID == id) {
            // 铜钱、钻石
            has = this.heroData.tongqian;
        }
        else if(KeyWord.MONEY_ID_HUNLI == id){
            //海神魂力
            has = this.heroData.haishenhunli;
        }
        else if (GameIDUtil.isExperience(id)) {
            // 经验
            has = this.heroData.getProperty(Macros.EUAI_CUREXP);
        }
        else if (GameIDUtil.isPvpExploitID(id)) {
            // 战勋
            has = this.heroData.explot;
        }
        else if (GameIDUtil.isSkyBonusID(id)) {
            // 宝镜积分
            has = this.heroData.skyBonus;
        }
        else if (GameIDUtil.isBfqdBonusID(id)) {
            // 庆典积分
            has = this.heroData.qdBonus;
        }
        else if (GameIDUtil.isJiuXingBonusID(id)) {
            // 九星积分
            has = this.heroData.jxBonus;
        }
        else if (KeyWord.REPUTATION_THING_ID == id) {
            // 声望
            has = this.heroData.reputation;
        }
        else if (KeyWord.XYZP_THING_ID == id) {
            has = this.heroData.xyzpBonus;
        }
        else if (KeyWord.HONOUR_THING_ID == id) {
            // 荣誉
            has = this.heroData.hornor;
        }
        else if (KeyWord.GUILD_CONTRIBUTE_ID == id) {
            // 贡献度
            has = this.heroData.guildDonateCur;
        }
        else if (KeyWord.HONEY_THING_ID == id) {
            has = this.heroData.honey;
        }
        else if (GameIDUtil.isBagThingID(id)) {
            // 物品
            has = this.thingData.getThingNum(id, Macros.CONTAINER_TYPE_ROLE_BAG, false);
        }
        else if (KeyWord.MAGICCUBE_SOUL_ID == id) {
            //魂值经验
            has = this.heroData.soulExp;
        }
        else if (KeyWord.REIKI_THING_ID == id) {
            //灵力
            has = this.heroData.reiki;
        }
        else if (KeyWord.QKL_LIANZHI_ID == id) {
            //熔炼值
            has = this.heroData.smelting;
        }
        else if (KeyWord.MONEY_SHENHUN_ID == id) {
            has = this.heroData.shenhun;
        }
        else if (KeyWord.WARSOUL_THING_ID == id) {
            has = this.heroData.zhanHun;
        }
        else if (KeyWord.COLOSSEUM_MONEY_ID == id) {
            has = this.heroData.siXiangBi;
        }
        else if (KeyWord.MONEY_ID_JINGPO == id) {
            has = this.heroData.jingPo;
        }
        else if (KeyWord.MONEY_ID_MJTZ == id) {
            has = this.heroData.mingJiang;
        }
        else if (KeyWord.MONEY_ID_LILIAN == id) {
            has = this.heroData.liLian;
        }
        else if (KeyWord.MONEY_ID_WYYZ == id) {
            has = this.heroData.yuanZhengBi;
        }
        else if (KeyWord.MONEY_ID_ENERGY_WY == id) {
            has = this.heroData.energy;
        }
        else {
            if (defines.has('_DEBUG')) {
                uts.assert(false, '不受支持的货币ID：' + id);
            }
        }

        return has;
    }
}