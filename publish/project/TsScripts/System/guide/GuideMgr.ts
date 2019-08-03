import { Constants } from 'System/constants/Constants';
import { EnumGuide, EnumGuiderQuestRule, EnumGuideStartResult, EnumLoginStatus, EnumPetId } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { PinstanceData } from 'System/data/PinstanceData';
import { SkillData } from 'System/data/SkillData';
import { ThingData } from 'System/data/thing/ThingData';
import { Global as G } from 'System/global';
import { BaseGuider } from 'System/guide/cases/BaseGuider';
import { ChatWorldGuider } from 'System/guide/cases/ChatWorldGuider';
import { CommonOpenViewGuider } from 'System/guide/cases/CommonOpenViewGuider';
import { DailyRechargeReachGuider } from 'System/guide/cases/DailyRechargeReachGuider';
import { DiGongBossGuider } from "System/guide/cases/DiGongBossGuider";
import { DisplayPetGuider } from 'System/guide/cases/DisplayPetGuider';
import { DisplaySaiJiGuider } from 'System/guide/cases/DisplaySaiJiGuider';
import { FightTipGuider } from "System/guide/cases/FightTipGuider";
import { FunctionUnlockGuider } from 'System/guide/cases/FunctionUnlockGuider';
import { GetEquipGuider } from 'System/guide/cases/GetEquipGuider';
import { GetHeroEquipGuider } from 'System/guide/cases/GetHeroEquipGuider';
import { GetLiXianGuaJiKaGuider } from 'System/guide/cases/GetLiXianGuaJiKaGuider';
import { GetSkillGuider } from 'System/guide/cases/GetSkillGuider';
import { GetThingGuider } from 'System/guide/cases/GetThingGuider';
import { GetZhufuGuider } from 'System/guide/cases/GetZhufuGuider';
import { GuildGuider } from 'System/guide/cases/GuildGuider';
import { GuoYunGuider } from 'System/guide/cases/GuoYunGuider';
import { HunGuDecomposeGuider } from "System/guide/cases/HunGuDecomposeGuider";
import { HunGuGuider } from "System/guide/cases/HunGuGuider";
import { HunGuShengHuaGuider } from "System/guide/cases/HunGuShengHuaGuider";
import { HunHuanGuider } from "System/guide/cases/HunHuanGuider";
import { JingYanFuBenGuider } from 'System/guide/cases/JingYanFuBenGuider';
import { LiXianGuaJiGuider } from 'System/guide/cases/LiXianGuaJiGuider';
import { MiZongGuider } from "System/guide/cases/MiZongGuider";
import { OverDueGuider } from 'System/guide/cases/OverDueGuider';
import { PersonalBossGuider } from "System/guide/cases/PersonalBossGuider";
import { PetActivateGuider } from 'System/guide/cases/PetActivateGuider';
import { PrivilegeOverdueGuider } from 'System/guide/cases/PrivilegeOverdueGuider';
import { QinLongGuider } from "System/guide/cases/QinLongGuider";
import { RechargeReachGuider } from 'System/guide/cases/RechargeReachGuider';
import { RideOnGuider } from 'System/guide/cases/RideOnGuider';
import { SecondChargeGuider } from 'System/guide/cases/SecondChargeGuider';
import { ShenXuanZhiLuGuider } from "System/guide/cases/ShenXuanZhiLuGuider";
import { UseZhiShengDanGuider } from 'System/guide/cases/UseZhiShengDanGuider';
import { WelcomeGuider } from 'System/guide/cases/WelcomeGuider';
import { WuHunActivateGuider } from "System/guide/cases/WuHunActivateGuider";
import { WuYuanFuBenGuider } from 'System/guide/cases/WuYuanFuBenGuider';
import { XuanTianGongGuider } from "System/guide/cases/XuanTianGongGuider";
import { ZhenFaGuider } from "System/guide/cases/ZhenFaGuider";
import { MapId } from 'System/map/MapId';
import { FengMoTaView } from 'System/pinstance/fmt/FengMoTaView';
import { PinstanceHallView } from 'System/pinstance/hall/PinstanceHallView';
import { Macros } from 'System/protocol/Macros';
import { ProtocolUtil } from 'System/protocol/ProtocolUtil';
import { TipMarkCtrl } from 'System/tipMark/TipMarkCtrl';
import { UILayer } from 'System/uilib/CommonForm';
import { FightingStrengthUtil } from "System/utils/FightingStrengthUtil";
import { GameIDUtil } from 'System/utils/GameIDUtil';
import { BigSkillShowView, TeQuanBuyPanelType } from 'System/vip/BigSkillShowView';
import { SpecialTeQuanView } from "System/vip/SpecialTeQuanView";
import { VipView } from 'System/vip/VipView';
import { LuckyCatView } from '../activity/luckyCat/LuckyCatView';
import { ShouChongTipView } from '../activity/view/ShouChongTipView';
/**
 * 引导配置。
 * @author teppei
 *
 */
class GuiderConfig {
    /**引导器。*/
    guider: BaseGuider;

    /**触发功能。*/
    triggerByFunc: number = 0;

    constructor(guider: BaseGuider, triggerByFunc: number) {
        this.guider = guider;
        this.triggerByFunc = triggerByFunc;
    }
}

class GuideQueueInfo {
    type: EnumGuide;
    funcId = 0;
}

enum CheckGuideResult {
    noGuide = 0,
    needQueue,
    guiding,
    justDoIt,
}

/**
 * 新手指引管理器。
 * @author teppei
 *
 */
export class GuideMgr {
    private readonly UseZhiShengDanLvs: number[] = [/*49,*/ 69, 79, 89];

    private m_hasStarted = false;

    private m_isGuideEnabled = false;

    /**是否暂停。*/
    private m_isPaused = false;

    /**当前的引导类型。*/
    private m_crtGuider: BaseGuider;

    /**指引请求的队列。*/
    private m_guideReqQueue: GuideQueueInfo[] = [];
    private m_delayGetRoleEquips: Protocol.ContainerThingInfo[] = [];

    /**引导配置表。*/
    private m_guiderConfigMap: { [guideType: number]: GuiderConfig } = {};

    /**
     * 功能 - 引导 触发映射表。
     */
    private m_func2guideMap: { [funcId: number]: EnumGuide[] } = {};

    /**不再提示自动做任务。*/
    private m_noPrompAutoQuest = false;

    private timer: Game.Timer;
    private checkAutoUiLayers = [UILayer.Normal, UILayer.Second, UILayer.Result, UILayer.Pay];

    tipMarkCtrl: TipMarkCtrl = new TipMarkCtrl();

    /**标记是否已经提示过过期*/
    private privilegeOverdueFlag = false;

    /**是否需要自动引导经验副本等*/
    autoJuQingFuBen = false;
    autoQiangHuaFuBen = false;
    autoShenHuangMiJing = false;
    autoCaiLiaoFuBen = false;
    autoWuYuanFuBen = false;
    autoFengMoTa = false;

    private needCheckPromp = false;
    private needCheckWearEquip = true;

    constructor() {
        /////////////////////////////////////////////////////////////////////
        // 添加指引时，要查看功能开启、任务衔接对话确定指引是开功能后启动还是接取、
        // 完成任务后启动。策划靠不住，前台要自己看清楚
        /////////////////////////////////////////////////////////////////////

        this._addGuider(new WelcomeGuider(), 0);
        this._addGuider(new LiXianGuaJiGuider(), 0);
        this._addGuider(new OverDueGuider(), 0);
        this._addGuider(new PrivilegeOverdueGuider(), 0);
        this._addGuider(new GetSkillGuider(), 0);
        this._addGuider(new GetEquipGuider(), 0);
        this._addGuider(new GetHeroEquipGuider(), 0);
        this._addGuider(new GetThingGuider(), 0);
        this._addGuider(new GuoYunGuider(), 0);
        this._addGuider(new FunctionUnlockGuider(), 0);
        //this._addGuider(new CommonOpenViewGuider(0, SevenDayView), KeyWord.ACT_FUNCTION_7GOAL);
        this._addGuider(new CommonOpenViewGuider(1, SpecialTeQuanView), 0);
        this._addGuider(new CommonOpenViewGuider(2, VipView), 0);//充值面板
        this._addGuider(new CommonOpenViewGuider(3, BigSkillShowView), 0);
        this._addGuider(new CommonOpenViewGuider(4, ShouChongTipView), KeyWord.TEACH_FUNCTION_SHOUCHONG_UI_1);
        this._addGuider(new CommonOpenViewGuider(5, ShouChongTipView), KeyWord.TEACH_FUNCTION_SHOUCHONG_UI_2);
        this._addGuider(new CommonOpenViewGuider(6, ShouChongTipView), KeyWord.TEACH_FUNCTION_SHOUCHONG_UI_3);
        this._addGuider(new CommonOpenViewGuider(7, LuckyCatView), 0);

        this._addGuider(new GetZhufuGuider(), KeyWord.OTHER_FUNCTION_ZQJH);

        this._addGuider(new PersonalBossGuider(1), KeyWord.TEACH_FUNCTION_PRIVATE_BOSS);//个人boss引导
        this._addGuider(new PersonalBossGuider(2), KeyWord.TEACH_FUNCTION_PRIVATE_BOSS2);//个人boss引导
        this._addGuider(new PersonalBossGuider(3), KeyWord.TEACH_FUNCTION_PRIVATE_BOSS3);//个人boss引导
        this._addGuider(new PersonalBossGuider(4), KeyWord.TEACH_FUNCTION_PRIVATE_BOSS4);//个人boss引导
        this._addGuider(new PersonalBossGuider(5), KeyWord.TEACH_FUNCTION_PRIVATE_BOSS5);//个人boss引导
        this._addGuider(new PersonalBossGuider(6), KeyWord.TEACH_FUNCTION_PRIVATE_BOSS6);//个人boss引导
        this._addGuider(new PersonalBossGuider(7), KeyWord.TEACH_FUNCTION_PRIVATE_BOSS7);//个人boss引导
        this._addGuider(new PersonalBossGuider(8), KeyWord.TEACH_FUNCTION_PRIVATE_BOSS8);//个人boss引导
        this._addGuider(new PersonalBossGuider(9), KeyWord.TEACH_FUNCTION_PRIVATE_BOSS9);//个人boss引导

        this._addGuider(new FightTipGuider(1, KeyWord.TEACH_FUNCTION_FIGHT_TIP), KeyWord.TEACH_FUNCTION_FIGHT_TIP);//战力卡点任务引导1
        this._addGuider(new FightTipGuider(2, KeyWord.TEACH_FUNCTION_FIGHT_TIP2), KeyWord.TEACH_FUNCTION_FIGHT_TIP2);//战力卡点任务引导2
        this._addGuider(new FightTipGuider(3, KeyWord.TEACH_FUNCTION_LEVEL_TIP), KeyWord.TEACH_FUNCTION_LEVEL_TIP);//等级卡点任务引导
        this._addGuider(new FightTipGuider(4, KeyWord.TEACH_FUNCTION_KADIAN_GUIDE_1), KeyWord.TEACH_FUNCTION_KADIAN_GUIDE_1);//战力卡点任务引导1
        this._addGuider(new FightTipGuider(4, KeyWord.TEACH_FUNCTION_KADIAN_GUIDE_2), KeyWord.TEACH_FUNCTION_KADIAN_GUIDE_2);//战力卡点任务引导2
        this._addGuider(new FightTipGuider(4, KeyWord.TEACH_FUNCTION_KADIAN_GUIDE_3), KeyWord.TEACH_FUNCTION_KADIAN_GUIDE_3);//战力卡点任务引导3
        this._addGuider(new FightTipGuider(4, KeyWord.TEACH_FUNCTION_KADIAN_GUIDE_4), KeyWord.TEACH_FUNCTION_KADIAN_GUIDE_4);//战力卡点任务引导4
        this._addGuider(new FightTipGuider(4, KeyWord.TEACH_FUNCTION_KADIAN_GUIDE_5), KeyWord.TEACH_FUNCTION_KADIAN_GUIDE_5);//战力卡点任务引导5

        this._addGuider(new DiGongBossGuider(), KeyWord.TEACH_FUNCTION_COUNTRY_BOSS);//国家（地宫）Boss 引导

        this._addGuider(new HunGuGuider(), KeyWord.TEACH_FUNCTION_HUNGU_WEAR);//魂骨引导
        this._addGuider(new HunGuShengHuaGuider(), KeyWord.TEACH_FUNCTION_HunGu_ShengHua);//魂骨升华引导
        this._addGuider(new HunGuDecomposeGuider(), KeyWord.TEACH_FUNCTION_HUNGU_DECOMPOSE);//魂骨分解引导
        this._addGuider(new ShenXuanZhiLuGuider(), KeyWord.TEACH_FUNCTION_SHENXUAN);//神选之路引导

        //this._addGuider(new HunLiJinJieGuider(), KeyWord.TEACH_FUNCTION_HUNLIUPLEVEL);//魂力进阶引导

        this._addGuider(new HunHuanGuider(), KeyWord.TEACH_FUNCTION_HUNHUAN_ACTIVE);//魂环引导

        this._addGuider(new ZhenFaGuider(), KeyWord.TEACH_FUNCTION_FAZHEN);//紫极魔瞳引导
        this._addGuider(new XuanTianGongGuider(), KeyWord.TEACH_FUNCTION_JIUXING);//玄天功引导

        this._addGuider(new MiZongGuider(), KeyWord.TEACH_FUNCTION_SHENJI);//鬼影迷踪引导
        this._addGuider(new QinLongGuider(), KeyWord.TEACH_FUNCTION_MAGICCUBE);//控鹤擒龙引导

        //this._addGuider(new GetZhufuGuider(), KeyWord.OTHER_FUNCTION_FZJH);
        this._addGuider(new WuHunActivateGuider(), KeyWord.TEACH_FUNCTION_WUHUN_ACTIVE);//武魂激活
        this._addGuider(new JingYanFuBenGuider(), KeyWord.TEACH_FUNCTION_SHNV_1);//经验副本
        this._addGuider(new ChatWorldGuider(), KeyWord.TEACH_FUNCTION_CHAT_WORLD);//世界聊天 引导

        //this._addGuider(new GetZhufuGuider(), KeyWord.TEACH_FUNCTION_WUHUN_ACTIVE);//武魂激活
        //this._addGuider(new GetZhufuGuider(), KeyWord.ACT_FUNCTION_MRBZ);
        //this._addGuider(new GetZhufuGuider(), KeyWord.OTHER_FUNCTION_YYQH);
        //this._addGuider(new GetZhufuGuider(), KeyWord.OTHER_FUNCTION_JLJH);
        this._addGuider(new RideOnGuider(), KeyWord.OTHER_FUNCTION_ZQJH);
        //this._addGuider(new EquipEnhanceGuider(), KeyWord.OTHER_FUNCTION_STRENGSY);//装备强化
        //this._addGuider(new ShenZhuangShouJiGuider(0), KeyWord.OTHER_FUNCTION_SZSJ_1);//神装收集1
        //this._addGuider(new ShenZhuangShouJiGuider(1), KeyWord.OTHER_FUNCTION_SZSJ_2);//神装收集2
        //this._addGuider(new EquipSlotLvUpGuider(), KeyWord.OTHER_GUIDE_EQUIP_SLOTLVUP);//装备升级
        //this._addGuider(new EquipUpLevelGuider(), KeyWord.OTHER_FUNCTION_EQUIP_UPLEVEL);//装备升级
        //this._addGuider(new MountEnhanceGuider(), KeyWord.OTHER_FUNCTION_ZQQH);//坐骑强化
        //this._addGuider(new JuQingFuBenGuider(0, false), KeyWord.OTHER_FUNCTION_JDYJ1);//剧情副本1
        //this._addGuider(new JuQingFuBenGuider(1, true), KeyWord.OTHER_FUNCTION_JDYJ2);//剧情副本2
        //this._addGuider(new JuQingFuBenGuider(2, true), KeyWord.OTHER_FUNCTION_JDYJ3);////剧情副本3
        //this._addGuider(new CaiLiaoFuBenGuider(1, false), KeyWord.OTHER_FUNCTION_QIYUESHOUFB_1);
        //this._addGuider(new CaiLiaoFuBenGuider(2, true), KeyWord.OTHER_FUNCTION_QIYUESHOUFB_2);
        //this._addGuider(new CaiLiaoFuBenGuider(5, true), KeyWord.OTHER_FUNCTION_ZHENFAFB_1);
        this._addGuider(new WuYuanFuBenGuider(), KeyWord.TEACH_FUNCTION_WYFB);//伙伴副本
        //this._addGuider(new WuYuanFuBenGuider(2, false), KeyWord.OTHER_FUNCTION_WUYUANFB_2);
        //this._addGuider(new QiangHuaFuBenGuider(0), KeyWord.OTHER_FUNCTION_DZZL);//装备副本
        //this._addGuider(new QiangHuaFuBenGuider(1), KeyWord.OTHER_FUNCTION_QIANGHUAFB_2);//装备副本
        //this._addGuider(new JingYanFuBenGuider(), KeyWord.OTHER_FUNCTION_SHMJ);//经验副本
        this._addGuider(new GuildGuider(), KeyWord.TEACH_FUNCTION_GUILD);//宗门
        //this._addGuider(new QiFuGuider(), KeyWord.ACT_FUNCTION_QIFU);//祈福
        //this._addGuider(new ShouChongGuider(), KeyWord.OTHER_FUNCTION_ZHISHENGDAN1);
        //this._addGuider(new ZhiShengDanGuider(1), KeyWord.OTHER_FUNCTION_ZHISHENGDAN2);

        //以下首充引导表格配了999,所以注释掉
        //this._addGuider(new ZhiShengDanGuider(2), KeyWord.OTHER_FUNCTION_SHOUCHONG_5060);//首冲
        //this._addGuider(new ZhiShengDanGuider(2), KeyWord.OTHER_FUNCTION_SHOUCHONG_2);//首冲
        //this._addGuider(new ZhiShengDanGuider(2), KeyWord.OTHER_FUNCTION_SHOUCHONG_3);//首冲
        //this._addGuider(new ZhiShengDanGuider(2), KeyWord.OTHER_FUNCTION_SHOUCHONG_4);//首冲
        this._addGuider(new SecondChargeGuider(1), KeyWord.OTHER_FUNCTION_SECONDCHARGE_1);//次重
        this._addGuider(new SecondChargeGuider(1), KeyWord.OTHER_FUNCTION_SECONDCHARGE_2);//次重
        this._addGuider(new SecondChargeGuider(1), KeyWord.OTHER_FUNCTION_SECONDCHARGE_3);//次重
        this._addGuider(new SecondChargeGuider(1), KeyWord.OTHER_FUNCTION_SECONDCHARGE_4);//次重
        //this._addGuider(new UseItemGuider(), KeyWord.OTHER_FUNCTION_HPBAG_GUIDE); 
        //this._addGuider(new SkillUpGuider(), KeyWord.OTHER_FUNCTION_SKILL_GUIDE);//技能引导
        //this._addGuider(new JuYuanGuider(), KeyWord.OTHER_FUNCTION_JU_YUAN);//聚元
        //this._addGuider(new LvUpGiftGuider(70), KeyWord.OTHER_FUNCTION_LVGIFT_70);//70级等级礼包引导
        //this._addGuider(new PetGuider(), KeyWord.BAR_FUNCTION_BEAUTY);//伙伴进阶
        this._addGuider(new PetActivateGuider(EnumPetId.ALi), KeyWord.OTHER_FUNCTION_WYJH_1);//伙伴激活
        //this._addGuider(new FengMoTaGuider(0, 30420001), KeyWord.ACT_FUNCTION_FMT);
        //this._addGuider(new FengMoTaGuider(1, 30420002), KeyWord.ACT_FUNCTION_FMT2);
        this._addGuider(new GetLiXianGuaJiKaGuider(), KeyWord.OTHER_FUNCTION_LIXIANGUAJI);
        this._addGuider(new DisplayPetGuider(), 0);
        this._addGuider(new DisplaySaiJiGuider(), 0);
        this._addGuider(new RechargeReachGuider(), 0);
        this._addGuider(new DailyRechargeReachGuider(), 0);

        // 添加几个使用直升丹的指引
        for (let lv of this.UseZhiShengDanLvs) {
            this._addGuider(new UseZhiShengDanGuider(lv), 0);
        }
    }

    testGuide() {
        let timer = new Game.Timer("guideTestTimer", 2000, 1, delegate(this, this.onTestGuideTimer));
    }

    private onTestGuideTimer(timer: Game.Timer) {
        //this.tryGuide(EnumGuide.FunctionUnlock, 0, false, 0, false, [G.DataMgr.funcLimitData.getFuncLimitConfig(KeyWord.BAR_FUNCTION_WING)]);
        //this.tryGuide(EnumGuide.FengMoTa + 1, 0, false, KeyWord.ACT_FUNCTION_FMT2, false, KeyWord.ACT_FUNCTION_FMT2);
        //this.tryGuide(EnumGuide.GetThing, 0, false, 0, false, 10079011);
        //this.tryGuide(EnumGuide.GetZhufu, 0, false, KeyWord.OTHER_FUNCTION_JLJH, false, KeyWord.OTHER_FUNCTION_JLJH, G.DataMgr.thingData.getBagItemById(20156001)[0].data);
        //this.tryGuide(EnumGuide.ShouChong, 0, false, KeyWord.OTHER_FUNCTION_ZHISHENGDAN1, false, KeyWord.OTHER_FUNCTION_ZHISHENGDAN1);
        //this.tryGuide(EnumGuide.GetLiXianGuaJiKa, 0, false, KeyWord.OTHER_FUNCTION_LIXIANGUAJI, false, KeyWord.OTHER_FUNCTION_LIXIANGUAJI);
        //this.tryGuide(EnumGuide.PetActivate + EnumPetId.ALi, 0, false, KeyWord.OTHER_FUNCTION_WYJH_1, false, 0);
        //this.tryGuide(EnumGuide.Pet, 0, false, KeyWord.BAR_FUNCTION_BEAUTY, false, KeyWord.BAR_FUNCTION_BEAUTY);
        //this.tryGuide(EnumGuide.FightTip + 3, 0, false, KeyWord.TEACH_FUNCTION_LEVEL_TIP, false, KeyWord.TEACH_FUNCTION_LEVEL_TIP);
        //this.tryGuide(EnumGuide.LvUpGift , 0, false, KeyWord.OTHER_FUNCTION_LVGIFT_70, false, KeyWord.OTHER_FUNCTION_LVGIFT_70);
        //this.tryGuide(EnumGuide.ChatWorld, 0, false, KeyWord.TEACH_FUNCTION_CHAT_WORLD, false, KeyWord.TEACH_FUNCTION_CHAT_WORLD);
        //this.tryGuide(EnumGuide.QiFu, 0, false, KeyWord.ACT_FUNCTION_QIFU, false, KeyWord.ACT_FUNCTION_QIFU);
        //this.tryGuide(EnumGuide.LiXianGuaJi, 0, false, 0, false, 0);
        //this.tryGuide(EnumGuide.Guild, 0, false, KeyWord.TEACH_FUNCTION_GUILD, false, KeyWord.TEACH_FUNCTION_GUILD);
        //this.tryGuide(EnumGuide.ShenZhuangShouJi, 0, false, KeyWord.OTHER_FUNCTION_SZSJ_1, false, KeyWord.OTHER_FUNCTION_SZSJ_1);
        //this.tryGuide(EnumGuide.WuYuanFuBen + 2, 0, false, KeyWord.OTHER_FUNCTION_WUYUANFB_2, false, KeyWord.OTHER_FUNCTION_WUYUANFB_2);
        //this.tryGuide(EnumGuide.ZhiShengDan + 2, 0, false, KeyWord.OTHER_FUNCTION_SHOUCHONG_5060, false, KeyWord.OTHER_FUNCTION_SHOUCHONG_5060);
        //this.tryGuide(EnumGuide.SecondCharge + 1, 0, false, KeyWord.OTHER_FUNCTION_SECONDCHARGE_1, false, KeyWord.OTHER_FUNCTION_SECONDCHARGE_1);
        //this.tryGuide(EnumGuide.UseZhiShengDan + 69, 0, false, 0, false);
        //this.tryGuide(EnumGuide.SkillUp, 0, false, KeyWord.OTHER_FUNCTION_SKILL_GUIDE, false, KeyWord.OTHER_FUNCTION_SKILL_GUIDE);
        //this.tryGuide(EnumGuide.PersonBossActive + 2, 0, false, KeyWord.TEACH_FUNCTION_PRIVATE_BOSS2, false, KeyWord.TEACH_FUNCTION_PRIVATE_BOSS2);
        //this.tryGuide(EnumGuide.HunGuShengHua, 0, false, KeyWord.TEACH_FUNCTION_HunGu_ShengHua, false, KeyWord.TEACH_FUNCTION_HunGu_ShengHua);
        //this.tryGuide(EnumGuide.HunGuActive, 0, false, KeyWord.TEACH_FUNCTION_HUNGU_WEAR, false, KeyWord.TEACH_FUNCTION_HUNGU_WEAR);
        this.tryGuide(EnumGuide.UseZhiShengDan + 69, 0, false, 0, false);
    }

    onFormClosed() {
        // 有一种情况，比如GetThingGuider点了使用某些东西会自动弹出窗口A，这时候会把随后的引导需要弹出的窗口B(还未弹出)关掉，导致该引导卡住任务流程
        // 这里是简单的处理方式，更好的处理方式是使用物品引发的自动弹窗也采用引导来做
        if (null != this.m_crtGuider && (this.m_crtGuider.IsWaitingViewClosed || !this.m_crtGuider.isActive)) {
            this.m_crtGuider.start();
        }
    }

    getCurrentGuider(group: EnumGuide): BaseGuider {
        if (null != this.m_crtGuider && (0 == group || this.m_crtGuider.group == group)) {
            return this.m_crtGuider;
        }

        return null;
    }

    start() {
        if (this.m_hasStarted) {
            return;
        }

        this.m_hasStarted = true;

        G.DataMgr.runtime.guideStarted = true;

        // 检查是否开始初始化所有已经开启的功能
        this.checkFunctions();
        this.checkUseZhiShengDan();

        //// 检查大招是否可以学了，可以的话直接帮他学了，因为大招是通过指引引导他学的，他可能错过了
        //let nqSkill = G.DataMgr.skillData.getSkillsByProf(G.DataMgr.heroData.profession)[KeyWord.SKILL_BRANCH_ROLE_NQ][0];
        //if (0 == nqSkill.completed && 1 == nqSkill.m_ushSkillLevel && SkillData.canStudySkill(nqSkill.m_iSkillID, true)) {
        //    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOperateSkill(nqSkill.m_iSkillID, Macros.OPERATE_SKILL_STUDY, 1));
        //} 
    }

    enableGuide() {
        if (this.m_isGuideEnabled) {
            return;
        }
        this.m_isGuideEnabled = true;

        // 第一个任务没做完就显示欢迎界面
        if (G.DataMgr.heroData.level == 1) {
            this.tryGuide(EnumGuide.Welcome, 0, false, 0, false);
        }

        //神兵天降弹窗
        //this.shenBingTianJiangView()

        if (null == this.m_crtGuider && this.m_guideReqQueue.length > 0) {
            let queueInfo = this.m_guideReqQueue.shift();
            this._startGuider(queueInfo.type, 0, false, queueInfo.funcId);
        }

        // 可能有离线挂机引导，这里检查并不会马上弹出来
        if (this.isGuiding(0)) {
            this.needCheckPromp = true;
        } else {
            G.ModuleMgr.activityModule.checkPromp(0);
        }

        // 35级之前15秒不动就自动任务寻路
        if (null == this.timer) {
            this.timer = new Game.Timer('autoRunTimer', Constants.GuideQuestTimeout * 1000, 0, delegate(this, this.onTimer));
        }
    }

    private shenBingTianJiangView() {
        let vipData = G.DataMgr.vipData;
        let lastLoginAt = UnityEngine.PlayerPrefs.GetInt('lastLoginAt', 0);
        let now = Math.floor(G.SyncTime.getCurrentTime() / 1000);
        if (!G.SyncTime.isSameDay(lastLoginAt, now)) {
            let d = G.SyncTime.getDateAfterStartServer();
            let id = vipData.getSpecialPriKeyByDay(d);
            if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_SPECIAL_PRI) && !vipData.hasBuySpecialPri(id)) {
                this.tryGuide(EnumGuide.CommonOpenView + 1, 0, false, 0, false);
            }
            if ((d > 1 && d < 8) && G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.ACT_FUNCTION_TOUZILICAI)) {
                let openId = -1;
                let fundTypeArray = [];
                let fundData = G.DataMgr.activityData.sevenDayFundData;
                if (fundData != null && fundData.m_ucNumber > 0) {
                    for (let i = 0; i < fundData.m_stOneDataList.length; i++) {
                        let oneData = fundData.m_stOneDataList[i];
                        if (fundTypeArray.indexOf(oneData.m_ucCfgType) < 0) {
                            fundTypeArray.push(oneData.m_ucCfgType);
                        }
                    }
                    if (fundTypeArray.indexOf(KeyWord.SEVEN_DAY_FUND_TYPE_3) < 0) openId = KeyWord.SEVEN_DAY_FUND_TYPE_3;
                    else if (fundTypeArray.indexOf(KeyWord.SEVEN_DAY_FUND_TYPE_2) < 0) openId = KeyWord.SEVEN_DAY_FUND_TYPE_2;
                    else if (fundTypeArray.indexOf(KeyWord.SEVEN_DAY_FUND_TYPE_1) < 0) openId = KeyWord.SEVEN_DAY_FUND_TYPE_1;
                } else {
                    openId = KeyWord.SEVEN_DAY_FUND_TYPE_3;
                }
                if (openId != -1) {
                    this.tryGuide(EnumGuide.CommonOpenView + 2, 0, false, 0, false, openId);
                }
            }
            //必需是第一次登入且开服第二天
            if (d > 1) {
                let heroData = G.DataMgr.heroData;
                let stageHuangJin = heroData.getPrivilegeState(KeyWord.VIPPRI_2);
                let stageZuanShi = heroData.getPrivilegeState(KeyWord.VIPPRI_3);
                if (stageHuangJin < 0 && G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_GOLD_VIP)) {
                    this.tryGuide(EnumGuide.CommonOpenView + 3, 0, false, 0, false, TeQuanBuyPanelType.HuangJin);
                }
                else if (stageHuangJin >= 0 && stageZuanShi < 0 && G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.OTHER_FUNCTION_DIAMONDS_VIP)) {
                    this.tryGuide(EnumGuide.CommonOpenView + 3, 0, false, 0, false, TeQuanBuyPanelType.ZuanShi);
                }
            }
        }
        UnityEngine.PlayerPrefs.SetInt('lastLoginAt', now);
    }

    onLeavePinstance() {
        for (let i = this.m_delayGetRoleEquips.length - 1; i >= 0; i--) {
            this.onGetBetterEquip(this.m_delayGetRoleEquips.pop());
        }
    }

    private onTimer(timer: Game.Timer) {
        let hero = G.UnitMgr.hero;
        if (null == hero) {
            return;
        }

        // 顺便检查特权卡是否过期
        let now = UnityEngine.Time.realtimeSinceStartup;
        let heroData = G.DataMgr.heroData;
        if (!this.privilegeOverdueFlag && heroData.nextPriTimeoutAt > 0 && now > heroData.nextPriTimeoutAt) {
            this.privilegeOverdueFlag = true;
            heroData.privilegeOverdueLv = heroData.nextPriTimeoutLv;
            G.NoticeCtrl.checkOverDue();
        }

        let runtime = G.DataMgr.runtime;
        let sceneData = G.DataMgr.sceneData;
        if (this.m_isPaused || this.m_noPrompAutoQuest ||
            runtime.isAllFuncLocked || runtime.loginStatus != EnumLoginStatus.logined ||
            !sceneData.isEnterSceneComplete || MapId.isFXZDMapId(sceneData.curSceneID)) {
            return;
        }


        if (null != this.m_crtGuider) {
            // 因引导可能会打开某些界面，因此应在检查界面打开之前检查引导
            if (this.m_crtGuider.isActive && now - this.m_crtGuider.crtStepStartedAt >= Constants.AutoGuideTimeout && now - runtime.lastMouseActionTime >= Constants.AutoGuideTimeout) {
                // 强制执行当前引导
                this.m_crtGuider.force();
            }
            return;
        }

        //// 检查距上次走路停下的时间
        //if (runtime.lastWalkEnd > 0 && now - runtime.lastWalkEnd < Constants.AutoRunTimeout) {
        //    return;
        //}

        if (G.ViewCacher.collectionBar.isOpened) {
            runtime.lastActiveAt = now;
            return;
        }

        // 检查走路
        if (hero.isMoving || hero.isAboutToJumpOrJumping || hero.IsLanding || (null != G.Mapmgr.crossPathData) && G.Mapmgr.crossPathData.length > 0) {
            // 正在走路
            runtime.lastActiveAt = now;
            return;
        }

        // 5s不操作后显示任务指引箭头
        let qid = -1;
        if (sceneData.curPinstanceID == 0 && now - runtime.lastActiveAt >= Constants.GuideQuestTimeout &&
            !G.Uimgr.isAnyFormOpenedBut(null, this.checkAutoUiLayers)) {
            qid = G.ModuleMgr.questModule.pickBestQuest();
            //任务指引去掉  kingsly
            //G.ViewCacher.mainView.taskTrackList.guideOnQuest(qid);
        }

        // 检查活动时间、鼠标操作和最近一次除了心跳包之外的协议
        if (now - runtime.lastActiveAt < Constants.AutoRunTimeout) {
            return;
        }

        // 这里暂不检查对话框是否打开，因为有些任务会自动弹开对话框的，如果这时候return了，那么就一直停在这个对话框上
        let forms = [];
        if (this.autoQiangHuaFuBen || this.autoShenHuangMiJing || this.autoJuQingFuBen || this.autoCaiLiaoFuBen || this.autoWuYuanFuBen) {
            let view = G.Uimgr.getForm<PinstanceHallView>(PinstanceHallView);
            if (null != view) {
                forms.push(view);
            }
        } else if (this.autoFengMoTa) {
            let view = G.Uimgr.getForm<FengMoTaView>(FengMoTaView);
            if (null != view) {
                forms.push(view);
            }
        }
        if (G.Uimgr.isAnyFormOpenedBut(forms, this.checkAutoUiLayers)) {
            return;
        }

        if (!hero.canAutoRun(true)) {
            return;
        }

        // 如果这个傻逼在自动挂机的副本里发呆，自动恢复挂机
        if (sceneData.curPinstanceID > 0) {
            if (!runtime.isHangingUp && KeyWord.GENERAL_YES == PinstanceData.getConfigByID(sceneData.curPinstanceID).m_ucIsAutoAttack) {
                G.ModuleMgr.deputyModule.startEndHangUp(true, -1);
            }
            return;
        }

        // 检查有没有可以自动寻路完成的任务
        G.ModuleMgr.questModule.doQuestOrGotoFmt(qid);
    }

    onQuestDataReady() {
        this.checkFunctions();
    }

    onPinstanceDataReady() {
        this.checkFunctions();
    }

    private checkFunctions() {
        if (G.DataMgr.questData.isQuestDataReady && G.DataMgr.pinstanceData.isReady && this.m_hasStarted) {
            let funcLimitData = G.DataMgr.funcLimitData;
            if (!funcLimitData.isFiltered) {
                let pinfo = G.DataMgr.pinstanceData.getPinstanceInfo(300032);
                funcLimitData.filterLimits();
                this.tipMarkCtrl.start();
                G.MainBtnCtrl.update(true);
                G.ActBtnCtrl.update(true);
                G.NoticeCtrl.start();
                //this.checkTrailAndFmtBossCtrl();
            }
        }
    }

    //checkTrailAndFmtBossCtrl() {
    //    if (G.DataMgr.funcLimitData.needTrail()) {
    //        //G.ViewCacher.mainView.newFunctionTrailerCtrl.setEnabled(true);
    //        G.ViewCacher.mainView.fmtBossCtrl.setActive(false);
    //    } else {
    //        // 达到70级，不再显示功能引导，但是96级后要显示灵翼强化引导
    //        //G.ViewCacher.mainView.newFunctionTrailerCtrl.setEnabled(false);
    //        G.ViewCacher.mainView.fmtBossCtrl.setActive(G.DataMgr.sceneData.curPinstanceID <= 0);
    //    }
    //}

    checkNoneWearedEquips() {
        if (this.needCheckWearEquip) {
            let equipMap = G.DataMgr.thingData.getNonWearedRoleEquips();
            for (let k in equipMap) {
                let itemData = equipMap[k];
                this.onGetBetterEquip(itemData.data);
            }
            this.needCheckWearEquip = false;
        }
    }

    /**
     * 是否可以自动做任务。
     * @return
     *
     */
    canAutoRun(): boolean {
        return G.DataMgr.heroData.level < Constants.LVUP_QUEST_NO_CONTINUE_LV;
    }

    /**
     * 暂停或者继续。
     * @param mode -1表示暂停，1表示继续，0表示切换状态。
     * @return 是否已暂停。
     *
     */
    pauseAndResume(mode: number): boolean {
        if (-1 == mode) {
            this.m_isPaused = true;
        }
        else if (1 == mode) {
            this.m_isPaused = false;
        }
        else {
            this.m_isPaused = !this.m_isPaused;
        }
        return this.m_isPaused;
    }

    /**
     * 获得更好的新装备。
     * @param thingInfo
     *
     */
    onGetBetterEquip(thingInfo: Protocol.ContainerThingInfo) {
        let equipConfig = ThingData.getThingConfig(thingInfo.m_iThingID);
        if (GameIDUtil.isRoleEquipID(equipConfig.m_iID) && equipConfig.m_iEquipPart != KeyWord.EQUIP_PARTCLASS_LINGBAO) {
            // 如果是首次获得武器，使用GetZhufuView
            let isFirstWeapon = false;
            let isRoleEquip = GameIDUtil.isRoleEquipID(thingInfo.m_iThingID);
            if (isRoleEquip && equipConfig.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_WEAPON) {
                isFirstWeapon = null == G.DataMgr.thingData.getEquipByPart(equipConfig.m_iEquipPart, Macros.CONTAINER_TYPE_ROLE_EQUIP, 0);
            }

            if (isFirstWeapon) {
                // 自动穿上
                let config = ThingData.getThingConfig(thingInfo.m_iThingID);
                G.ModuleMgr.bagModule.useThing(config, thingInfo);
                //this.tryGuide(EnumGuide.GetZhufu, 0, false, KeyWord.TEACH_FUNCTION_WUHUN_ACTIVE, false, KeyWord.OTHER_FUNCTION_WHJH, thingInfo);
            } else {
                if (isRoleEquip) {
                    if (equipConfig.m_iEquipPart != KeyWord.EQUIP_PARTCLASS_WING) {
                        if (G.DataMgr.sceneData.curPinstanceID > 0) {
                            // 副本里不提示
                            this.m_delayGetRoleEquips.push(thingInfo);
                        } else {
                            this.tryGuide(EnumGuide.GetHeroEquip, 0, false, 0, false, thingInfo);
                        }
                    } else {
                        this.tryGuide(EnumGuide.GetEquip, 0, false, 0, false, thingInfo);
                    }
                } else {
                    //获得武缘装备
                    if (KeyWord.ITEM_FUNCTION_BEAUTY_EQUIPID == equipConfig.m_ucFunctionType) {
                        //兵魂,手环
                        if (equipConfig.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_BINHUN || equipConfig.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_BRACELET) {
                            let curfight = FightingStrengthUtil.getStrengthByEquip(equipConfig, thingInfo.m_stThingProperty.m_stSpecThingProperty);
                            if (G.DataMgr.petData.isBetterThanAllPetEquip(equipConfig, curfight)) {
                                this.tryGuide(EnumGuide.GetEquip, 0, false, 0, false, thingInfo);
                            }
                        } else if (G.DataMgr.petData.isEquipCanTakeOn(equipConfig.m_ucRequiredLevel)) {//武缘其他装备,要判断
                            this.tryGuide(EnumGuide.GetEquip, 0, false, 0, false, thingInfo);
                        }
                    } else {//不是武缘装备
                        this.tryGuide(EnumGuide.GetEquip, 0, false, 0, false, thingInfo);
                    }
                }
            }
        }
    }

    onGetLingbao(thingInfo: Protocol.ContainerThingInfo) {
        //this.tryGuide(EnumGuide.GetZhufu, 0, false, KeyWord.OTHER_FUNCTION_JLJH, false, KeyWord.OTHER_FUNCTION_JLJH, thingInfo);
    }

    /**
     * 获得大血包。
     * @param thingInfo
     *
     */
    onGetThing(config: GameConfig.ThingConfigM, thingInfo: Protocol.ContainerThingInfo, reason: number) {
        // 检查物品是否可用
        if (!G.ActionHandler.canUse(config, thingInfo, false)) {
            return;
        }
        //
        if (KeyWord.ITEM_FUNCTION_SUPPER_EXP == config.m_ucFunctionType) {
            // 直升丹如果在最适等级则开启使用引导
            let heroLv = G.DataMgr.heroData.level;
            if (heroLv == config.m_iFunctionValue) {
                this.tryGuide(EnumGuide.UseZhiShengDan + config.m_iFunctionValue, 0, false, 0, false);
            } else if (heroLv > config.m_iFunctionValue) {
                // 已经超过该经验丹等级则直接提示
                this.tryGuide(EnumGuide.GetThing, 0, false, 0, false, thingInfo.m_iThingID);
            }
        } else if (KeyWord.ITEM_FUNCTION_BEAUTY_ACTIVE == config.m_ucFunctionType && (config.m_ucCanBatUse & KeyWord.ITEM_USE_METHOD_TIP) == 0) {
            if (config.m_iFunctionID > 0) {
                let pet: Protocol.NewBeautyInfo = G.DataMgr.petData.getPetInfo(config.m_iFunctionID);
                if (pet != null && pet.m_ucStatus != Macros.GOD_LOAD_AWARD_DONE_GET) {
                    //this.tryGuide(EnumGuide.DisplayPet, 0, false, 0, false, thingInfo.m_iThingID);
                }
            }
        }
        else if (KeyWord.ITEM_FUNCTION_SAIJI_SUBIMAGE == config.m_ucFunctionType) {
            //赛季激活
            this.tryGuide(EnumGuide.DisplaySaiJi, 0, false, 0, false, thingInfo.m_iThingID);
        }
        else {
            this.tryGuide(EnumGuide.GetThing, 0, false, 0, false, thingInfo.m_iThingID);
        }
    }

    /**
     * 角色升级事件的响应函数。
     * @param lv
     *
     */
    onHeroUpgrade(): void {
        // 检查是否有新技能解锁
        this.checkUnlockNewSkill();

        // 检查新功能
        this._checkNewFunc();

        // 使用直升丹指引
        this.checkUseZhiShengDan();

        this.tipMarkCtrl.onHeroUpgrade();

        G.MainBtnCtrl.update(true);
    }

    private checkUseZhiShengDan() {
        let lv = G.DataMgr.heroData.level;
        if (this.UseZhiShengDanLvs.indexOf(lv) >= 0) {
            this.tryGuide(EnumGuide.UseZhiShengDan + lv, 0, false, 0, false);
        }
    }

    processOperateQuest(questID: number, needTransport: boolean): boolean {
        // 没有则继续下一步检查
        this._checkNewFunc();
        return this._checkCrtGuideByQuest(questID, needTransport, -1);
    }

    /**
     * 处理任务时需要检查当前是否有其他引导，如果有就要延迟。
     * @param questID
     * @param isTransport
     * @param nodeIndex
     * @return
     *
     */
    private _checkCrtGuideByQuest(questID: number, needTransport: boolean, nodeIndex: number): boolean {
        if (null != this.m_crtGuider && this.m_crtGuider.needPauseQuest(questID)) {
            this.m_crtGuider.questID = questID;
            this.m_crtGuider.needTransport = needTransport;
            this.m_crtGuider.nodeIndex = nodeIndex;
            return true;
        }

        return false;
    }

    /**
    * 打开新手礼包等面板之前，需要检查其他面板（同类面板除外）是否打开，如果打开就要排队。
    * @param guideType
    * @param caller
    * @param params
    * @return
    *
    */
    tryGuide(guideType: EnumGuide, questID: number, needTransport: boolean, funcId: number, force: boolean, ...args): CheckGuideResult {
        if (G.DataMgr.sceneData.curPinstanceID > 0 && guideType != EnumGuide.GetThing) {
            //在副本中跳过引导
            if (defines.has('DEVELOP')) {
                uts.logError('因为在副本中,所以跳过这个引导:  引导枚举EnumGuide: ' + guideType + ', NPC功能表关键字: ' + funcId);
            }
            return;
        }
        let result = CheckGuideResult.noGuide;

        if (!this.m_isGuideEnabled /* || !G.ActionHandler.checkCrossSvrUsable(false)*/) {
            result = CheckGuideResult.needQueue;
        }
        else if (null != this.m_crtGuider) {
            // 当前有引导，需要排队
            if (guideType == this.m_crtGuider.type) {
                result = CheckGuideResult.guiding;
            } else if (force) {
                result = CheckGuideResult.justDoIt;
            } else {
                result = CheckGuideResult.needQueue;
            }
        }
        else {
            result = CheckGuideResult.justDoIt;
        }
        //uts.log('tryGuide: ' + guideType + ', funcId: ' + funcId + ', result = ' + result);
        let cfg = this.getGuiderCfg(guideType, funcId);
        cfg.guider.processRequiredParams.apply(cfg.guider, args);
        if (CheckGuideResult.needQueue == result) {
            let inQueue = false;
            for (let info of this.m_guideReqQueue) {
                if (info.type == guideType && info.funcId == funcId) {
                    inQueue = true;
                    break;
                }
            }
            if (!inQueue) {
                let queueInfo = new GuideQueueInfo();
                queueInfo.type = guideType;
                queueInfo.funcId = funcId;
                this.m_guideReqQueue.push(queueInfo);
            }
        } else if (CheckGuideResult.justDoIt == result) {
            this._startGuider(guideType, questID, needTransport, funcId);
        }
        return result;
    }

    ///////////////////////////////////////////////////////// 新技能 /////////////////////////////////////////////////////////

    /**
     * 检查是否有新技能解锁。
     *
     */
    private checkUnlockNewSkill() {
        // 再检查是否有新技能提示
        let skillIds: number[] = G.DataMgr.skillData.getCanStudyOrUpgradeSkills(KeyWord.SKILL_BRANCH_ROLE_ZY, 0);
        if (skillIds.length > 0) {
            // 如果是新技能就打开提示对话框
            // 剔除掉已经学过的
            let skillID: number = 0;
            for (let i: number = skillIds.length - 1; i >= 0; i--) {
                skillID = skillIds[i];
                if (1 != skillIds[i] % 10 || SkillData.getSkillConfig(skillIds[i]).completed || skillID == Macros.PROF_TYPE_HUNTER_VIP_SKILL_ID || skillID == Macros.PROF_TYPE_WARRIOR_VIP_SKILL_ID || skillID == Macros.MAX_PINSTANCE_FLOOR_USE_VIP_SKILL) {
                    skillIds.splice(i, 1);
                }
                else {
                    // 自动学习该技能
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOperateSkill(skillID, Macros.OPERATE_SKILL_STUDY));
                }
            }

            if (skillIds.length > 0) {
                this.tryGuide(EnumGuide.GetSkill, 0, false, 0, false, skillIds);
            }
        }
    }

    ///////////////////////////////////////////////////////// 新攻能 /////////////////////////////////////////////////////////

    /**
     * 检查是否有新功能可以开启。
     * @return
     *
     */
    public _checkNewFunc() {
        let funcLimitData = G.DataMgr.funcLimitData;
        if (!funcLimitData.isFiltered) {
            return;
        }
        let newFuncs = funcLimitData.checkNewFunc();
        this._checkNewFuncNext(newFuncs);
    }
    private _checkNewFuncNext(newFuncs: GameConfig.NPCFunctionLimitM[]) {
        let funcLimitData = G.DataMgr.funcLimitData;
        G.ActBtnCtrl.onFunctionUnlock(newFuncs);
        let d = G.SyncTime.getDateAfterStartServer();
        let updateActBarRightNow = false;
        let updateMainFuncRightNow = false;
        let updateJueBanWuQi = false;
        let guideBianQiang = false;
        let showUnlockFuncs = [];
        let guideFuncs = [];
        for (let i = newFuncs.length - 1; i >= 0; i--) {
            let config = newFuncs[i];
            if (KeyWord.OTHER_FUNCTION_GUOYUN == config.m_iName) {
                G.DataMgr.runtime.forceGuoYun = true;
                // G.DataMgr.runtime.noContinueGuoYun = true;
            } else if (KeyWord.ACT_FUNCTION_FIRSTCHARGE == config.m_iName /*|| KeyWord.ACT_FUNCTION_SZSJ == config.m_iName*/) {
                updateJueBanWuQi = true;
            } else if (KeyWord.OTHER_FUNCTION_BQZY == config.m_iName) {
                guideBianQiang = true;
            }
            //首充UI提示
            else if (KeyWord.TEACH_FUNCTION_SHOUCHONG_UI_1 == config.m_iName) {
                let scValue = G.DataMgr.firstRechargeData.scValue;
                let isRecharge = scValue != null && (scValue.m_uiLifeSCTime > 0 || scValue.m_ucGetRFCBit > 0 || scValue.m_uiSCValue > 0);
                if (!isRecharge) {
                    this.tryGuide(EnumGuide.CommonOpenView + 4, 0, false, KeyWord.TEACH_FUNCTION_SHOUCHONG_UI_1, false);
                    // G.Uimgr.createForm<ShouChongTipView>(ShouChongTipView).open();
                }
                else {
                    return;
                }
            }
            else if (KeyWord.TEACH_FUNCTION_SHOUCHONG_UI_2 == config.m_iName) {
                let scValue = G.DataMgr.firstRechargeData.scValue;
                let isRecharge = scValue != null && (scValue.m_uiLifeSCTime > 0 || scValue.m_ucGetRFCBit > 0 || scValue.m_uiSCValue > 0);
                if (!isRecharge) {
                    this.tryGuide(EnumGuide.CommonOpenView + 5, 0, false, KeyWord.TEACH_FUNCTION_SHOUCHONG_UI_2, false);
                }
                else {
                    return;
                }
            }
            else if (KeyWord.TEACH_FUNCTION_SHOUCHONG_UI_3 == config.m_iName) {
                let scValue = G.DataMgr.firstRechargeData.scValue;
                let isRecharge = scValue != null && (scValue.m_uiLifeSCTime > 0 || scValue.m_ucGetRFCBit > 0 || scValue.m_uiSCValue > 0);
                if (!isRecharge) {
                    this.tryGuide(EnumGuide.CommonOpenView + 6, 0, false, KeyWord.TEACH_FUNCTION_SHOUCHONG_UI_3, false);
                }
                else {
                    return;
                }
            }
            else if (KeyWord.OTHER_FUNCTION_PET_SKILL == config.m_iName) {
                G.ViewCacher.mainView.onPetSkillUnlock();
            }

            let isNotInDate = (config.m_ucStartDate > 0 && d < config.m_ucStartDate) ||
                (config.m_ucEndDate > 0 && d > config.m_ucEndDate);
            if (KeyWord.GENERAL_NO == config.m_ucShowUnlockTip || isNotInDate) {
                // 不需要提示
                let funcRoot = funcLimitData.getFuncRoot(config);
                if (KeyWord.FUNC_LIMIT_ACT == funcRoot.m_ucFunctionClass) {
                    updateActBarRightNow = true;
                } else if (KeyWord.FUNC_LIMIT_BAR == funcRoot.m_ucFunctionClass || KeyWord.SUBBAR_FUNCTION_RIDE == funcRoot.m_iName) {
                    updateMainFuncRightNow = true;
                }
            } else {
                // 需要提示
                showUnlockFuncs.push(config);
            }

            if (!isNotInDate) {
                guideFuncs.push(config);
            }
        }
        // 先更新按钮栏
        if (updateActBarRightNow) {
            G.ActBtnCtrl.update(true);
        }
        if (updateMainFuncRightNow) {
            G.MainBtnCtrl.update(true);
        }

        // 再开启新功能解锁引导
        if (showUnlockFuncs.length > 0) {
            this.tryGuide(EnumGuide.FunctionUnlock, 0, false, 0, false, showUnlockFuncs);
        }
        // 同时让功能引导排队
        for (let i = guideFuncs.length - 1; i >= 0; i--) {
            let config = guideFuncs[i];
            // 检查是否需要引导
            let guideTypes = this.m_func2guideMap[config.m_iName];
            //uts.log('func activated: id = ' + config.m_iName + ', name = ' + config.m_szDisplayName + ', guideType = ' + JSON.stringify(guideTypes));

            // 需要引导
            if (undefined != guideTypes) {
                //祝福系统的要把当前开启的功能id传过去
                let questID = 0;
                if (config.m_ucCompleteQuest > 0) {
                    questID = config.m_ucCompleteQuest;
                } else if (config.m_ucAcceptQuest > 0) {
                    questID = config.m_ucAcceptQuest;
                }
                for (let guideType of guideTypes) {
                    //通用的指引开启
                    this.tryGuide(guideType, questID, false, config.m_iName, false, config.m_iName);
                }
            }
        }
        this.tipMarkCtrl.onFunctionUnlock(newFuncs);
        G.NoticeCtrl.onFunctionUnlock(newFuncs);

        if (guideBianQiang) {
            G.DataMgr.runtime.guideBianQiang = true;
            G.ViewCacher.mainView.checkGuideBianQiang();
        }
        //有新功能开启时的一个提醒
        G.DataMgr.fightTipData.isOnOpen = true;
        this.onFunctionUnlock(newFuncs);
    }

    /**
     * 处理下一步指引。
     * @param type 指引类型，比如散仙、坐骑。
     * @param step 指引步骤，比如打开面板、点击按钮。
     *
     */
    processGuideNext(group: EnumGuide, step: EnumGuide): void {
        if (null != this.m_crtGuider && this.m_crtGuider.group == group && this.m_crtGuider.canNext(step)) {
            // 正是当前的指引，则指引下一步
            this.m_crtGuider.next(step);
            if (null == this.m_crtGuider || this.m_crtGuider.isEnd) {
                // 已经指引结束，继续任务引导
                this._processAfterGuide(false);
            }
        }
    }

    /**
     * 取消指定的引导。
     * @param type
     *
     */
    cancelGuide(type: EnumGuide): void {
        if (null == this.m_crtGuider || this.m_crtGuider.type != type) {
            return;
        }

        this.m_crtGuider.end();

        // 继续其他引导
        this._processAfterGuide(true);
    }

    private _processAfterGuide(forceResumeQuest: boolean): void {
        let questID = 0;
        let needTransport = false;
        let resumeQuest = forceResumeQuest;
        let parentGuider: BaseGuider = null;
        if (null != this.m_crtGuider) {
            questID = this.m_crtGuider.questID;
            needTransport = this.m_crtGuider.needTransport;
            this.m_crtGuider.questID = 0;
            resumeQuest = resumeQuest || EnumGuiderQuestRule.PauseAbsolutely != this.m_crtGuider.questRule;
            parentGuider = this.m_crtGuider.parentGuider;

            //uts.log('after guide: ' + this.m_crtGuider.type);
            this.m_crtGuider = null;
        }

        if (null != parentGuider) {
            parentGuider.next(0);
            return;
        }

        // 检查引导队列
        while (this.m_guideReqQueue.length > 0) {
            let queueInfo = this.m_guideReqQueue.shift();
            if (this._startGuider(queueInfo.type, questID, needTransport, queueInfo.funcId)) {
                return;
            }
        }

        if (this.needCheckPromp) {
            G.ModuleMgr.activityModule.checkPromp(0);
            this.needCheckPromp = false;
        }

        if (questID > 0) {
            G.ModuleMgr.questModule.continueAfterGuide(questID, needTransport);
        }

        //G.ViewCacher.mainView.newFunctionTrailerCtrl.enableGuideArrow(true);
    }

    /**
     * 查询是否正在执行指定的指引类型和步骤（可选）。
     * @param type
     * @param step
     * @return
     *
     */
    isGuiding(group: EnumGuide = 0, index: number = 0, step: EnumGuide = 0): boolean {
        if (null == this.m_crtGuider) {
            return false;
        }

        if (group > 0 && this.m_crtGuider.group != group) {
            return false;
        }

        if (index > 0 && this.m_crtGuider.index != index) {
            return false;
        }

        if (step > 0 && this.m_crtGuider.getCrtStep() != step) {
            return false;
        }

        return true;
    }

    /**
     * 添加引导配置。
     * @param type
     * @param maxCount
     *
     */
    private _addGuider(guider: BaseGuider, funcId: number): void {
        uts.assert(undefined == this.getGuiderCfg(guider.type, funcId));
        this.m_guiderConfigMap[this.getGuiderKey(guider.type, funcId)] = new GuiderConfig(guider, funcId);
        if (funcId > 0) {
            let types = this.m_func2guideMap[funcId];
            if (undefined == types) {
                this.m_func2guideMap[funcId] = types = [];
            }
            types.push(guider.type);
        }
    }

    private getGuiderCfg(type: EnumGuide, funcId: number): GuiderConfig {
        return this.m_guiderConfigMap[this.getGuiderKey(type, funcId)];
    }

    private getGuiderKey(type: EnumGuide, funcId: number): string {
        return type + '_' + funcId;
    }

    private _startGuider(type: EnumGuide, questID: number, needTransport: boolean, funcId: number): boolean {
        if (0 == questID && null != this.m_crtGuider) {
            questID = this.m_crtGuider.questID;
        }

        if (null != this.m_crtGuider) {
            if (this.m_crtGuider.type == type) {
                this.m_crtGuider.questID = questID;
                this.m_crtGuider.needTransport = needTransport;
                return true;
            }
        }

        let config: GuiderConfig = this.getGuiderCfg(type, funcId);
        if (null == config) {
            if (defines.has('_DEBUG')) {
                uts.assert(false, '没有注册过的引导类型：' + type);
            }
            return false;
        }

        if (null != this.m_crtGuider) {
            // 说明是半路插入的新指引
            config.guider.parentGuider = this.m_crtGuider;
        }

        config.guider.questID = questID;
        config.guider.needTransport = needTransport;
        // 提前设置m_crtGuider
        this.m_crtGuider = config.guider;
        // start引导，但是可能在引导步骤里会主动cancel掉引导，所以要判断
        let result = config.guider.start();
        if (EnumGuideStartResult.failed != result) {
            if (null != this.m_crtGuider) {
                G.ViewCacher.taskView.close();
                //G.ViewCacher.mainView.newFunctionTrailerCtrl.enableGuideArrow(false);
                return true;
            }
        }
        else {
            return false;
        }
    }

    onFunctionUnlock(funcs: GameConfig.NPCFunctionLimitM[]) {
        for (let func of funcs) {
            switch (func.m_iName) {
                case KeyWord.OTHER_FUNCTION_SIXIANG_JINJIE:
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSxPkPanelRequest());
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_COLOSSEUM, Macros.COLOSSEUM_ACT_OPEN));
                    break;
                case KeyWord.OTHER_FUNCTION_SIXIANGDOUSHOUCHANG:
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getShenShouRequest(Macros.SHENSHOU_OP_PANEL, 0, 0));
                    break;
                case KeyWord.ACT_FUNCTION_KF_ZHAOCAIMAO:
                    //招财猫数据拉取
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.KF_LUCKYCAT_OPEN_PANNEL));
                    break;
                case KeyWord.ACT_FUNCTION_QIFU:
                    //祈福
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getQifuRequest(Macros.QIFU_OPEN_PANEL));
                    break;
            }
        }

    }

    toString(): string {
        let s = '[Guide]crtGuider=';
        if (null != this.m_crtGuider) {
            s += this.m_crtGuider.toString();
        } else {
            s += 'NULL';
        }
        s += ', queue=' + JSON.stringify(this.m_guideReqQueue);
        return s;
    }
}
