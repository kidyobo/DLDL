import { EventDispatcher } from 'System/EventDispatcher'
import { NetModule } from 'System/net/NetModule'
import { MainModule } from 'System/main/MainModule'
import { LoadingModule } from 'System/loading/LoadingModule'
import { UnitModule } from 'System/unit/UnitModule'
import { SkillModule } from 'System/skill/SkillModule'
import { LoginModule } from 'System/login/LoginModule'
import { SceneModule } from 'System/scene/SceneModule'
import { BagModule } from 'System/bag/BagModule'
import { QuestModule } from 'System/quest/QuestModule'
import { DeputyModule } from 'System/deputy/DeputyModule'
import { BusinessModule } from 'System/business/businessModule'
import { FriendModule } from 'System/friend/FriendModule'
import { ChatModule } from 'System/chat/ChatModule'
import { PetModule } from 'System/pet/PetModule'
import { BuffModule } from 'System/buff/BuffModule'
import { PinstanceModule } from 'System/pinstance/PinstanceModule'
import { GuildModule } from 'System/guild/GuildModule'
import { MailModule } from 'System/mail/MailModule'
import { TeamModule } from 'System/team/TeamModule'
import { ActivityModule } from 'System/activity/ActivityModule'
import { EquipModule } from 'System/equip/EquipModule'
import { HeroModule } from 'System/hero/HeroModule'
import { JuyuanModule } from 'System/juyuan/JuyuanModule'
import { AchievementModule } from 'System/achieveMent/AchievementModule'
import { MagicCubeModule } from 'System/magicCube/MagicCubeModule'
import { TeamFbModule } from 'System/teamFb/TeamFbModule'
import { RankModule } from 'System/rank/RankModule'
import { TgbjModule } from 'System/tanbao/TgbjModule'
import { KfModule } from 'System/kf/KfModule'
import { KfjdcModule } from 'System/kfjdc/KfjdcModule'
import { ZhuFuModule } from 'System/NewZhuFuRule/ZhuFuModule'
import { ShieldGodModule } from 'System/shield/ShieldGodModule'
import { AASModule } from 'System/aas/AASModule'
import { StarsTreasuryModule } from 'System/activity/xingdoubaoku/StarsTreasuryModule'

/**
 * 模块管理器。
 */
export class ModuleManager {
    netModule: NetModule;  // 网络模块
    loginModule: LoginModule;//登陆模块
    mainModule: MainModule;//主界面模块
    loadingModule: LoadingModule = null;//主界面模块
    unitModule: UnitModule;//单位模块
    skillModule: SkillModule;//技能模块（与单位模块关联较大）
    SceneModule: SceneModule;
    bagModule: BagModule;//背包模块
    questModule: QuestModule;
    deputyModule: DeputyModule;
    businessModule: BusinessModule;
    friendModule: FriendModule;
    chatModule: ChatModule;
    petModule: PetModule;
    buffModule: BuffModule;
    pinstanceModule: PinstanceModule;
    guildModule: GuildModule;
    mailModule: MailModule;
    teamModule: TeamModule;
    activityModule: ActivityModule;
    equipModule: EquipModule;//装备模块
    heroModule: HeroModule;//伙伴模块
    juyuanModule: JuyuanModule;
    achievementModule: AchievementModule;
    magicCubeModule: MagicCubeModule;
    teamFbModule: TeamFbModule;
    rankModule: RankModule;
    tgbjModule: TgbjModule;
    kfModule: KfModule;
    kfjdcModule: KfjdcModule;
    zhuFuModule: ZhuFuModule;
    shieldGodModule: ShieldGodModule
    aasModule: AASModule;
    starsModule: StarsTreasuryModule;//星斗宝库

    private allModules: EventDispatcher[] = [];

    InitLoadingModule() {
        this.loadingModule = new LoadingModule();
    }
    InitModules() {
        this.allModules.push(this.netModule = new NetModule());
        this.allModules.push(this.mainModule = new MainModule());
        this.allModules.push(this.unitModule = new UnitModule());
        this.allModules.push(this.loginModule = new LoginModule());
        this.allModules.push(this.SceneModule = new SceneModule());
        this.allModules.push(this.skillModule = new SkillModule());
        this.allModules.push(this.bagModule = new BagModule());
        this.allModules.push(this.questModule = new QuestModule());
        this.allModules.push(this.deputyModule = new DeputyModule());
        this.allModules.push(this.businessModule = new BusinessModule());
        this.allModules.push(this.friendModule = new FriendModule());
        this.allModules.push(this.chatModule = new ChatModule());
        this.allModules.push(this.petModule = new PetModule());
        this.allModules.push(this.buffModule = new BuffModule());
        this.allModules.push(this.pinstanceModule = new PinstanceModule());
        this.allModules.push(this.guildModule = new GuildModule());
        this.allModules.push(this.mailModule = new MailModule());
        this.allModules.push(this.teamModule = new TeamModule());
        this.allModules.push(this.activityModule = new ActivityModule());
        this.allModules.push(this.equipModule = new EquipModule());
        this.allModules.push(this.heroModule = new HeroModule());
        this.allModules.push(this.juyuanModule = new JuyuanModule());
        this.allModules.push(this.achievementModule = new AchievementModule());
        this.allModules.push(this.magicCubeModule = new MagicCubeModule());
        this.allModules.push(this.teamFbModule = new TeamFbModule());
        this.allModules.push(this.rankModule = new RankModule());
        this.allModules.push(this.tgbjModule = new TgbjModule());
        this.allModules.push(this.kfModule = new KfModule());
        this.allModules.push(this.kfjdcModule = new KfjdcModule());
        this.allModules.push(this.zhuFuModule = new ZhuFuModule());
        this.allModules.push(this.shieldGodModule = new ShieldGodModule());
        this.allModules.push(this.aasModule = new AASModule());
        this.allModules.push(this.starsModule = new StarsTreasuryModule());
        // 模块初始化完成
    }
}
export default ModuleManager;