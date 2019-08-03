import { Color } from 'System/utils/ColorUtil'
import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'
/**
 *角色属性配置和逻辑解析 
 * @author fygame
 * 
 */
export class RoleAttributeData {
    protected idObj: { [level: number]: GameConfig.RoleLevelConfigM };
    protected divisor: number = 1000000;

    onCfgReady(): void {
        let data: GameConfig.RoleLevelConfigM[] = G.Cfgmgr.getCfg('data/RoleLevelConfigM.json') as GameConfig.RoleLevelConfigM[];
        this.idObj = {};
        for (let index in data) {
            if (data[index].m_usLevel == 0) {
                // 过滤掉无用数据
                continue;
            }
            this.idObj[data[index].m_usLevel] = data[index];
        }
    }

    /**
     * 获取指定顶级的配置 
     * @param level
     * @return 
     * 
     */
    getConfig(level: number): GameConfig.RoleLevelConfigM {
        return this.idObj[level];
    }

    /**
 * 根据指定经验返回可升级的数量 
 * @param exp
 * @return 
 * 
 */
    getExpLevelNumber(exp: number): number {
        let level = G.DataMgr.heroData.level;
        let curExp = G.DataMgr.heroData.getProperty(Macros.EUAI_CUREXP);
        let uplevel = 0;
        for (let i = level; i < level + 100; i++) {
            if (level > 300) {
                break;
            }
            let maxexp = this.getConfig(i).m_uiExperience;
            if (exp + curExp > maxexp) {
                uplevel += 1;
                exp -= maxexp - curExp;
                curExp = 0;
            }
            else {
                uplevel += exp / maxexp;
                break;
            }
        }
        return uplevel;
    }

    getMissPerPoint(id: number): number {
        let config: GameConfig.RoleLevelConfigM = this.getConfig(id);

        if (config) {
            return config.m_uiMissPerPoint / this.divisor;
        }
        else {
            return 0;
        }

    }

    getOfflineExpByLevel(level: number): number {
        return this.idObj[level].m_iLXJY;
    }

    /**
     * 获取指定等级的伙伴每小时获得的离线经验 
     * @param level
     * @return 
     * 
     */
    getExpPerHourOfflineByLevel(level: number): number {
        return this.idObj[level].m_iExpPerHourOffline;
    }

    /**
     * 获取指定等级的伙伴每小时获得的在线经验 
     * @param level
     * @return 
     * 
     */
    getExpPerHourOnlineByLevel(level: number): number {
        return this.idObj[level].m_ushExpPerTimeOnline;
    }

    /**
     * 根据当前的等级和战斗力获得相应的颜色 
     * @param level
     * @param combatValue
     * @return 
     * 
     */
    getCombatColor(level: number, combatValue: number): string {
        let cfg: GameConfig.RoleLevelConfigM = this.idObj[level];

        if (cfg != null) {
            if (combatValue <= cfg.m_uiGreenStandard) {
                return Color.GREEN;
            }
            else if (combatValue > cfg.m_uiGreenStandard && combatValue <= cfg.m_uiBlueStandard) {
                return Color.BLUE;
            }
            else if (combatValue > cfg.m_uiBlueStandard && combatValue <= cfg.m_uiPurpleStandard) {
                return Color.PURPLE;
            }
            else if (combatValue > cfg.m_uiPurpleStandard && combatValue <= cfg.m_uiOrangeStandard) {
                return Color.GOLD;
            }
            else if (combatValue > cfg.m_uiOrangeStandard) {
                return Color.RED;
            }
        }

        return Color.GREEN;
    }

    /**
     * 根据当前的等级和战斗力获得相应的帧, 目前用于角色面板战斗力显示背景
     * @param level
     * @param combatValue
     * @return 
     * 
     */
    getCombatColorFrame(level: number, combatValue: number): number {
        let cfg: GameConfig.RoleLevelConfigM = this.idObj[level];

        if (cfg != null) {
            if (combatValue <= cfg.m_uiGreenStandard) {
                return 1;
            }
            else if (combatValue > cfg.m_uiGreenStandard && combatValue <= cfg.m_uiBlueStandard) {
                return 2;
            }
            else if (combatValue > cfg.m_uiBlueStandard && combatValue <= cfg.m_uiPurpleStandard) {
                return 3;
            }
            else if (combatValue > cfg.m_uiPurpleStandard && combatValue <= cfg.m_uiOrangeStandard) {
                return 4;
            }
            else if (combatValue > cfg.m_uiOrangeStandard) {
                return 5;
            }
        }

        return 1;
    }
}
