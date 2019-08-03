import { Global as G } from 'System/global'
import { ConfirmCheck } from 'System/tip/TipManager'
import { HeroData } from 'System/data/RoleData'
import { KeyWord } from 'System/constants/KeyWord'

/**
 * 在线礼包数据。
 * @author teppei
 *
 */
export class LevelGiftData {
    /**等级礼包相差多少级提示*/
    static readonly DJLB_TIP_LEVEL: number = 3;

    private levelBag: number = 0;

    private lastMaxGetLevel: number = 0;

    /**最低等级*/
    minLevel: number = 0;
    /**最高等级*/
    maxLevel: number = 0

    notGetLvs: number[] = [];

    isHasNotGetLv: boolean = false;

    selectedLevel: number = 0;
    /**
    * 更新数据。
    * @param data
    *
    */
    setGetlevel(data: number): void {
        this.levelBag = data;
    }

    getlevel(): number {
        return this.levelBag;
    }

    cheakHasNotGetLv(getLv: number): number {
        this.selectedLevel = getLv;
        for (let i = 0; i < this.notGetLvs.length; i++) {
            if (getLv > this.notGetLvs[i]) {
                this.isHasNotGetLv = true;
            }
        }
        return this.notGetLvs.shift();
    }

    canGet(): boolean {
        if (!G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.OTHER_FUNCTION_SJLB))
            return false;
        let heroData: HeroData = G.DataMgr.heroData;
        return heroData.level >= this.getNextLevelGiftLevel();
    }


    initNotGetLvs(lastGetLv: number) {
        let giftData: GameConfig.GiftBagConfigM[] = G.DataMgr.giftGroupData.getListDataByType(KeyWord.GIFT_TYPE_LEVEL);
        for (let conf of giftData) {
            if (lastGetLv < conf.m_iParameter) {
                this.notGetLvs.push(conf.m_iParameter);
            }
        }
    }

    /**初始化等级礼包最低最高等级*/
    initMinAndMaxLevel(): void {
        this.minLevel = 10000;
        let giftData: GameConfig.GiftBagConfigM[] = G.DataMgr.giftGroupData.getListDataByType(KeyWord.GIFT_TYPE_LEVEL);
        for (let conf of giftData) {
            this.minLevel = Math.min(this.minLevel, conf.m_iParameter);
            this.maxLevel = Math.max(this.maxLevel, conf.m_iParameter);
        }
    }

    /**检查是否弹等级礼包提示*/
    checkShowGiftTip(): void {
        let levelGiftCanGetConfig: GameConfig.GiftBagConfigM = this.getLevelGiftCanGetConfig();
        if (levelGiftCanGetConfig) {
            //this.dispatchEvent(Events.OpenCloseLevelGiftTipDialog, DialogCmd.open, levelGiftCanGetConfig);
        }
    }

    /**获取等级礼包可领取的配置表*/
    getLevelGiftCanGetConfig(): GameConfig.GiftBagConfigM {
        let heroLevel: number = G.DataMgr.heroData.level;
        if (heroLevel > this.maxLevel || heroLevel < this.minLevel) {
            return null;
        }
        let giftData: GameConfig.GiftBagConfigM[] = G.DataMgr.giftGroupData.getListDataByType(KeyWord.GIFT_TYPE_LEVEL);
        for (let conf of giftData) {
            if (conf.m_iParameter <= this.getlevel()) {
                continue;
            }
            if (conf.m_iParameter == heroLevel) {
                return conf;
            }
        }
        return null;
    }

    /**是否显示等级礼包提示图标*/
    isShowLevelGiftTip(): boolean {
        let heroData: HeroData = G.DataMgr.heroData;
        let heroLevel: number = heroData.level;
        let nextDjlbLevel: number = this.getNextLevelGiftLevel();
        return heroLevel + LevelGiftData.DJLB_TIP_LEVEL >= nextDjlbLevel;
    }

    /**获取下一个等级礼包可领取等级*/
    getNextLevelGiftLevel(): number {
        let lastGetLevel: number = this.getlevel();
        let giftData: GameConfig.GiftBagConfigM[] = G.DataMgr.giftGroupData.getListDataByType(KeyWord.GIFT_TYPE_LEVEL);
        for (let config of giftData) {
            if (config.m_iParameter > lastGetLevel) {
                return config.m_iParameter;
            }
        }
        return 99999;
    }

    /**获取下一级可领取配置表*/
    getNextLelvelGiftConfig(): GameConfig.GiftBagConfigM {
        let nextDjlbLevel: number = this.getNextLevelGiftLevel();
        let giftData: GameConfig.GiftBagConfigM[] = G.DataMgr.giftGroupData.getListDataByType(KeyWord.GIFT_TYPE_LEVEL);
        for (let config of giftData) {
            if (config.m_iParameter == nextDjlbLevel) {
                return config;
            }
        }
        return null;
    }
}
