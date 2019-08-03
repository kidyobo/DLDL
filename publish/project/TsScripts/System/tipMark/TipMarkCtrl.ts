import { KeyWord } from 'System/constants/KeyWord';
import { Global as G } from 'System/global';
import { BaseTipMark } from 'System/tipMark/BaseTipMark';
import { DaoGongTipMark } from 'System/tipMark/DaoGongTipMark';
import { EquipCollectTipMark } from 'System/tipMark/EquipCollectTipMark';
import { EquipEnhanceTipMark } from 'System/tipMark/EquipEnhanceTipMark';
import { EquipFuHunTipMark } from 'System/tipMark/EquipFuHunTipMark';
import { EquipLianQiTipMark } from 'System/tipMark/EquipLianQiTipMark';
import { EquipLianTiTipMark } from 'System/tipMark/EquipLianTiTipMark';
import { EquipMergeTipMark } from 'System/tipMark/EquipMergeTipMark';
import { EquipMingWenTipMark } from 'System/tipMark/EquipMingWenTipMark';
import { EquipPartLevelUpTipMark } from 'System/tipMark/EquipPartLevelUpTipMark';
import { EquipUpLevelTipMark } from 'System/tipMark/EquipUpLevelTipMark';
import { FanJieTaoTipMark } from 'System/tipMark/FanJieTaoTipMark';
import { FanLiDaTingTipMark } from 'System/tipMark/FanLiDaTingTipMark';
import { FaQiTipMark } from 'System/tipMark/FaQiTipMark';
import { GuildTipMark } from 'System/tipMark/GuildTipMark';
import { HunGuShengJiTipMark } from 'System/tipMark/HunGuShengJiTipMark';
import { HunGuXiLianTipMark } from 'System/tipMark/HunGuXiLianTipMark';
import { ItemMergeTipMark } from 'System/tipMark/ItemMergeTipMark';
import { JuYuanTipMark } from 'System/tipMark/JuYuanTipMark';
import { MoFangTipMark } from 'System/tipMark/MoFangTipMark';
import { MountTipMark } from 'System/tipMark/MountTipMark';
import { PetTipMark } from 'System/tipMark/PetTipMark';
import { PetZhenTuTipMark } from 'System/tipMark/PetZhenTuTipMark';
import { RebirthEquipSuitTipMark } from 'System/tipMark/RebirthEquipSuitTipMark';
import { RebirthEquipTipMark } from 'System/tipMark/RebirthEquipTipMark';
import { RebirthSkillTipMark } from 'System/tipMark/RebirthSkillTipMark';
import { RebirthTipMark } from 'System/tipMark/RebirthTipMark';
import { ShengLingTipMark } from 'System/tipMark/ShengLingTipMark';
import { ShengQiTipMark } from 'System/tipMark/ShengQiTipMark';
import { ShenJiTipMark } from 'System/tipMark/ShenJiTipMark';
import { ShenQiTipMark } from 'System/tipMark/ShenQiTipMark';
import { SkillTipMark } from 'System/tipMark/SkillTipMark';
import { TipMarkView } from 'System/tipMark/TipMarkView';
import { WingEquipJingLianTipMark } from 'System/tipMark/WingEquipJingLianTipMark';
import { WingTipMark } from 'System/tipMark/WingTipMark';
import { XianJieTaoTipMark } from 'System/tipMark/XianJieTaoTipMark';
import { XueMaiTipMark } from 'System/tipMark/XueMaiTipMark';
import { ZhenFaTipMark } from 'System/tipMark/ZhenFaTipMark';
import { HunguIntensifyTipMark } from './HunguIntensifyTipMark';
import { HunguSkillTipMark } from './HunguSkillTipMark';
import { HunguStrengTipMark } from './HunguStrengTipMark';

export class TipMarkCtrl {

    private tipMarks: BaseTipMark[];
    private checkTimer: Game.Timer;
    private isStarted = false;

    equipCollectTipMark: EquipCollectTipMark = new EquipCollectTipMark();
    equipEnhanceTipMark: EquipEnhanceTipMark = new EquipEnhanceTipMark();
    equipUpLevelTipMark: EquipUpLevelTipMark = new EquipUpLevelTipMark();
    equipFuHunTipMark: EquipFuHunTipMark = new EquipFuHunTipMark();
    hunGuXiLianTipMark: HunGuXiLianTipMark = new HunGuXiLianTipMark();
    hunGuSkillTipMark: HunguSkillTipMark = new HunguSkillTipMark();
    equipLianQiTipMark: EquipLianQiTipMark = new EquipLianQiTipMark();
    equipMingWenTipMark: EquipMingWenTipMark = new EquipMingWenTipMark();
    equipPartLevelUpTipMark: EquipPartLevelUpTipMark = new EquipPartLevelUpTipMark();
    wingEquipJingLianTipMark: WingEquipJingLianTipMark = new WingEquipJingLianTipMark();
    juYuanTipMark: JuYuanTipMark = new JuYuanTipMark();
    rebirthSkillTipMark: RebirthSkillTipMark = new RebirthSkillTipMark();
    skillTipMark: SkillTipMark = new SkillTipMark();
    mountTipMark: MountTipMark = new MountTipMark();
    shenQiTipMark: ShenQiTipMark = new ShenQiTipMark();
    zhenFaTipMark: ZhenFaTipMark = new ZhenFaTipMark();
    shenJiTipMark: ShenJiTipMark = new ShenJiTipMark();
    wingTipMark: WingTipMark = new WingTipMark();
    shengQiTipMark: ShengQiTipMark = new ShengQiTipMark();
    faQiTipMark: FaQiTipMark = new FaQiTipMark();
    daoGongTipMark: DaoGongTipMark = new DaoGongTipMark();
    moFangTipMark: MoFangTipMark = new MoFangTipMark();
    petTipMark: PetTipMark = new PetTipMark();
    petZhenTuTipMark: PetZhenTuTipMark = new PetZhenTuTipMark();
    itemMergeTipMark: ItemMergeTipMark = new ItemMergeTipMark();
    guildTipMark: GuildTipMark = new GuildTipMark();
    rebirthTipMark: RebirthTipMark = new RebirthTipMark();
    rebirthEquipTipMark: RebirthEquipTipMark = new RebirthEquipTipMark();
    rebirthEquipSuitTipMark: RebirthEquipSuitTipMark = new RebirthEquipSuitTipMark();
    hunguIntensifyTipMark: HunguIntensifyTipMark = new HunguIntensifyTipMark();
    hunGuShengJiTipMark: HunGuShengJiTipMark = new HunGuShengJiTipMark();
    hunGuStrengTipMark: HunguStrengTipMark = new HunguStrengTipMark();
    // hunguMergeTipMark: HunguMergeTipMark = new HunguMergeTipMark();
    fanLiDaTingTipMark: FanLiDaTingTipMark = new FanLiDaTingTipMark();
    xueMaiTipMark: XueMaiTipMark = new XueMaiTipMark();
    equipMergeTipMark: EquipMergeTipMark = new EquipMergeTipMark();
    fanJieTaoTipMark: FanJieTaoTipMark = new FanJieTaoTipMark();
    xianJieTaoTipMark: XianJieTaoTipMark = new XianJieTaoTipMark();
    shengLingTipMark: ShengLingTipMark = new ShengLingTipMark();
    equipLianTiTipMark: EquipLianTiTipMark = new EquipLianTiTipMark();

    start() {
        this.isStarted = true;
        if (null == this.tipMarks) {
            this.tipMarks = [
                this.equipCollectTipMark,
                this.equipEnhanceTipMark,
                this.equipFuHunTipMark,
                this.hunGuXiLianTipMark,
                this.equipLianQiTipMark,
                this.equipMingWenTipMark,
                this.equipUpLevelTipMark,
                this.equipPartLevelUpTipMark,
                this.wingEquipJingLianTipMark,
                this.juYuanTipMark,
                this.skillTipMark,
                this.mountTipMark,
                this.shenQiTipMark,
                this.zhenFaTipMark,
                this.shenJiTipMark,
                this.wingTipMark,
                this.shengQiTipMark,
                this.faQiTipMark,
                this.daoGongTipMark,
                this.moFangTipMark,
                this.petTipMark,
                this.petZhenTuTipMark,
                this.itemMergeTipMark,
                this.guildTipMark,
                this.fanLiDaTingTipMark,
                this.xueMaiTipMark,
                this.equipMergeTipMark,
                this.fanJieTaoTipMark,
                this.xianJieTaoTipMark,
                this.shengLingTipMark,
                this.equipLianTiTipMark,
                this.rebirthTipMark,
                this.rebirthEquipTipMark,
                this.rebirthSkillTipMark,
                this.rebirthEquipSuitTipMark,
                this.hunguIntensifyTipMark,
                this.hunGuShengJiTipMark,
                this.hunGuStrengTipMark,
                this.hunGuSkillTipMark
                // this.hunguMergeTipMark
            ];
        }
        for (let tipMark of this.tipMarks) {
            tipMark.checkActivated();
        }
        if (null == this.checkTimer) {
            this.checkTimer = new Game.Timer("tipmark check", 1000, 0, delegate(this, this.onCheckTimer));
        }
    }

    private onCheckTimer(timer: Game.Timer) {
        if (G.DataMgr.sceneData.isEnterSceneComplete) {
            this.checkUpdates(false);
        }
    }

    private checkUpdates(forceUpdate: boolean) {
        let anyShowTip = false;
        let mainTipMarks: BaseTipMark[] = [];
        let anyDiff = false;
        for (let tipMark of this.tipMarks) {
            if (!tipMark.IsActviated) {
                continue;
            }
            if (tipMark.check()) {
                anyDiff = true;
            }
            anyShowTip = anyShowTip || tipMark.ShowTip;
            if (tipMark.ShowTip && tipMark.ShowOnMain) {
                mainTipMarks.push(tipMark);
            }
        }

        let mainView = G.ViewCacher.mainView;
        if (anyDiff) {
            //kingsly 刷新主界面人物头像上的红点 已经不再用了
            //// 刷新主界面人物头像上的红点 屏蔽转生（魂骨）
            //mainView.heroInfoCtrl.setTipMark(this.juYuanTipMark.ShowTip || this.mountTipMark.ShowTip || this.zhenFaTipMark.ShowTip || this.shenQiTipMark.ShowTip || this.shenJiTipMark.ShowTip || this.moFangTipMark.ShowTip || this.wingTipMark.ShowTip || TipMarkUtil.chengHao() || TipMarkUtil.shiZhuangQHTip() > 0 || this.juYuanTipMark.ShowTip
            //   /* || G.GuideMgr.tipMarkCtrl.rebirthEquipSuitTipMark.ShowTip || G.GuideMgr.tipMarkCtrl.rebirthTipMark.ShowTip || G.GuideMgr.tipMarkCtrl.rebirthSkillTipMark.ShowTip || G.GuideMgr.tipMarkCtrl.rebirthEquipTipMark.ShowTip*/);
            G.MainBtnCtrl.update(false);
            G.ActBtnCtrl.update(false);
        }

        if (anyDiff || forceUpdate) {
            if (G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.BAR_FUNCTION_BIANQIANG, false)) {
                let tipMarkView = G.ViewCacher.tipMarkView;

                // 刷新提示面板
                let cnt = mainTipMarks.length;
                mainView.setBtnStrongActive(cnt);
                if (cnt > 0) {
                    TipMarkView.tipMarks = mainTipMarks;
                    if (tipMarkView.isOpened) {
                        tipMarkView.updateView();
                    }
                } else {
                    tipMarkView.close();
                }
            }
        }
    }

    onChangeDay() {
        if (!this.isStarted) {
            return;
        }
        for (let tipMark of this.tipMarks) {
            tipMark.checkActivated();
        }
    }

    onFunctionUnlock(funcs: GameConfig.NPCFunctionLimitM[]) {
        if (!this.isStarted) {
            return;
        }
        for (let tipMark of this.tipMarks) {
            for (let cfg of funcs) {
                tipMark.onFunctionUnlock(cfg.m_iName);
                if (tipMark.WaitChecking) {
                    break;
                }
            }
        }

        for (let cfg of funcs) {
            if (KeyWord.BAR_FUNCTION_BIANQIANG == cfg.m_iName) {
                this.checkUpdates(true);
                return;
            }
        }
    }

    onHeroUpgrade() {
        if (!this.isStarted) {
            return;
        }
        for (let tipMark of this.tipMarks) {
            tipMark.onHeroUpgrade();
        }
    }

    onSkillChange() {
        if (!this.isStarted) {
            return;
        }
        for (let tipMark of this.tipMarks) {
            tipMark.onSkillChange();
        }
    }

    onContainerChange(containerID: number) {
        if (!this.isStarted) {
            return;
        }
        for (let tipMark of this.tipMarks) {
            tipMark.onContainerChange(containerID);
        }
    }

    onCurrencyChange(id: number) {
        if (!this.isStarted) {
            return;
        }
        for (let tipMark of this.tipMarks) {
            tipMark.onCurrencyChange(id);
        }
    }

    onZhufuDataChange(id: number) {
        if (!this.isStarted) {
            return;
        }
        for (let tipMark of this.tipMarks) {
            tipMark.onZhufuDataChange(id);
        }
    }

    onFabaoChange() {
        if (!this.isStarted) {
            return;
        }
        for (let tipMark of this.tipMarks) {
            tipMark.onFabaoChange();
        }
    }

    onFaQiChange() {
        if (!this.isStarted) {
            return;
        }
        for (let tipMark of this.tipMarks) {
            tipMark.onFaQiChange();
        }
    }

    onSiXiangChange() {
        if (!this.isStarted) {
            return;
        }
        for (let tipMark of this.tipMarks) {
            tipMark.onSiXiangChange();
        }
    }

    onPetChange() {
        if (!this.isStarted) {
            return;
        }
        for (let tipMark of this.tipMarks) {
            tipMark.onPetChange();
        }
    }

    onGuildApplyChange() {
        if (!this.isStarted) {
            return;
        }
        for (let tipMark of this.tipMarks) {
            tipMark.onGuildApplyChange();
        }
    }

    onGuildGiftChange() {
        if (!this.isStarted) {
            return;
        }
        for (let tipMark of this.tipMarks) {
            tipMark.onGuildGiftChange();
        }
    }

    onMagicCudeChange() {
        if (!this.isStarted) {
            return;
        }
        for (let tipMark of this.tipMarks) {
            tipMark.onMagicCudeChange();
        }
    }

    onRebirthChange() {
        if (!this.isStarted) {
            return;
        }
        for (let tipMark of this.tipMarks) {
            tipMark.onRebirthChange();
        }
    }


    onJuYuanChange() {
        if (!this.isStarted) {
            return;
        }
        for (let tipMark of this.tipMarks) {
            tipMark.onJuYuanChange();
        }
    }


    onDaoGongChange() {
        if (!this.isStarted) {
            return;
        }
        for (let tipMark of this.tipMarks) {
            tipMark.onDaoGongChange();
        }
    }

    onXueMaiChange() {
        if (!this.isStarted) {
            return;
        }
        for (let tipMark of this.tipMarks) {
            tipMark.onXueMaiChange();
        }
    }


    onEquipCollectChange() {
        if (!this.isStarted) {
            return;
        }
        for (let tipMark of this.tipMarks) {
            tipMark.onEquipCollectChange();
        }
    }

    onEquipFuHunChange() {
        if (!this.isStarted) {
            return;
        }
        for (let tipMark of this.tipMarks) {
            tipMark.onEquipFuHunChange();
        }
    }

    onHunGuXiLianChange() {
        if (!this.isStarted) {
            return;
        }
        for (let tipMark of this.tipMarks) {
            tipMark.onHunGuXiLianChange();
        }
    }

    onEquipLiantiChange() {
        if (!this.isStarted) {
            return;
        }
        for (let tipMark of this.tipMarks) {
            tipMark.onEquipLiantiChange();
        }
    }

    onPetZhenTuChange() {
        if (!this.isStarted) {
            return;
        }
        for (let tipMark of this.tipMarks) {
            tipMark.onPetZhenTuChange();
        }
    }


    onGuildPaiMaiChange() {
        if (!this.isStarted) {
            return;
        }
        for (let tipMark of this.tipMarks) {
            tipMark.onGuildPaiMaiChange();
        }
    }


    onZhanDouLiChange() {
        if (!this.isStarted) {
            return;
        }
        for (let tipMark of this.tipMarks) {
            tipMark.onZhanDouLiChange();
        }
    }

    onHunliLevelChange() {
        if (!this.isStarted) {
            return;
        }
        for (let tipMark of this.tipMarks) {
            tipMark.onHunliLevelChange();
        }
    }
}