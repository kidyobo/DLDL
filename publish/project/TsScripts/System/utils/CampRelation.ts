import { UnitController } from 'System/unit/UnitController'
import { RoleData } from 'System/data/RoleData'
import { KeyWord } from 'System/constants/KeyWord'

/**
 * 阵营关系 
 *	//            | 普通玩家  | 普通怪物 | 中立怪物 | 友好怪物 | 动画怪物 | 动画怪物2 | 动画怪物3 | 动画怪物4
	
 *   // 普通玩家  |   友好    |   敌对   |   中立   |   友好   |   友好   |  敌对     |  敌对    |  中立
	
 *   // 普通怪物  |   敌对    |   友好   |   敌对   |   敌对   |   敌对   |  中立     |  中立    |  中立
	
 *  // 中立怪物   |   中立    |   敌对   |   友好   |   友好   |   敌对   |  中立     |  中立    |  中立
	
 *  // 友好怪物   |   友好    |   敌对   |   友好   |   友好   |   敌对   |  中立     |  中立    |  中立
	
 *  // 动画怪物   |   友好    |   敌对   |   敌对   |   敌对   |   友好   |  敌对     |  中立    |  中立
	
 *  // 动画怪物2  |   友好    |   中立   |   敌对   |   中立   |   敌对   |  友好     |  中立    |  中立
	
 *  // 动画怪物3  |   敌对    |   中立   |   中立   |   中立   |   中立   |  中立     |  中立    |  中立
 * 
 *  // 动画怪物4  |   敌对    |   中立   |   中立   |   中立   |   中立   |  中立     |  中立    |  中立
 * 
 * @author fygame
 * 
 */
export class CampRelation {
    private static m_aiCampRelation: { [campId: number]: { [campId: number]: number } } = {};

    static init() {
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_ROLE_NORMAL] = {};
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_ROLE_NORMAL][KeyWord.CAMP_ID_ROLE_NORMAL] = KeyWord.CAMP_RELATION_ALLY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_ROLE_NORMAL][KeyWord.CAMP_ID_MONSTER_NORMAL] = KeyWord.CAMP_RELATION_ENEMY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_ROLE_NORMAL][KeyWord.CAMP_ID_MONSTER_NEUTRAL] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_ROLE_NORMAL][KeyWord.CAMP_ID_MONSTER_FRIEND] = KeyWord.CAMP_RELATION_ALLY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_ROLE_NORMAL][KeyWord.CAMP_ID_MONSTER_ANIMATION] = KeyWord.CAMP_RELATION_ENEMY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_ROLE_NORMAL][KeyWord.CAMP_ID_MONSTER_ANIMATION2] = KeyWord.CAMP_RELATION_ENEMY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_ROLE_NORMAL][KeyWord.CAMP_ID_MONSTER_ANIMATION3] = KeyWord.CAMP_RELATION_ENEMY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_ROLE_NORMAL][KeyWord.CAMP_ID_MONSTER_ANIMATION4] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_ROLE_NORMAL][KeyWord.CAMP_ID_UNKNOWN] = KeyWord.CAMP_RELATION_UNKNOWN;

        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_NORMAL] = {};
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_NORMAL][KeyWord.CAMP_ID_ROLE_NORMAL] = KeyWord.CAMP_RELATION_ENEMY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_NORMAL][KeyWord.CAMP_ID_MONSTER_NORMAL] = KeyWord.CAMP_RELATION_ALLY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_NORMAL][KeyWord.CAMP_ID_MONSTER_NEUTRAL] = KeyWord.CAMP_RELATION_ENEMY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_NORMAL][KeyWord.CAMP_ID_MONSTER_FRIEND] = KeyWord.CAMP_RELATION_ENEMY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_NORMAL][KeyWord.CAMP_ID_MONSTER_ANIMATION] = KeyWord.CAMP_RELATION_ENEMY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_NORMAL][KeyWord.CAMP_ID_MONSTER_ANIMATION2] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_NORMAL][KeyWord.CAMP_ID_MONSTER_ANIMATION3] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_NORMAL][KeyWord.CAMP_ID_MONSTER_ANIMATION4] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_NORMAL][KeyWord.CAMP_ID_UNKNOWN] = KeyWord.CAMP_RELATION_UNKNOWN;

        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_NEUTRAL] = {};
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_NEUTRAL][KeyWord.CAMP_ID_ROLE_NORMAL] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_NEUTRAL][KeyWord.CAMP_ID_MONSTER_NORMAL] = KeyWord.CAMP_RELATION_ENEMY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_NEUTRAL][KeyWord.CAMP_ID_MONSTER_NEUTRAL] = KeyWord.CAMP_RELATION_ALLY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_NEUTRAL][KeyWord.CAMP_ID_MONSTER_FRIEND] = KeyWord.CAMP_RELATION_ALLY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_NEUTRAL][KeyWord.CAMP_ID_MONSTER_ANIMATION] = KeyWord.CAMP_RELATION_ENEMY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_NEUTRAL][KeyWord.CAMP_ID_MONSTER_ANIMATION2] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_NEUTRAL][KeyWord.CAMP_ID_MONSTER_ANIMATION3] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_NEUTRAL][KeyWord.CAMP_ID_MONSTER_ANIMATION4] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_NEUTRAL][KeyWord.CAMP_ID_UNKNOWN] = KeyWord.CAMP_RELATION_UNKNOWN;

        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_FRIEND] = {};
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_FRIEND][KeyWord.CAMP_ID_ROLE_NORMAL] = KeyWord.CAMP_RELATION_ALLY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_FRIEND][KeyWord.CAMP_ID_MONSTER_NORMAL] = KeyWord.CAMP_RELATION_ENEMY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_FRIEND][KeyWord.CAMP_ID_MONSTER_NEUTRAL] = KeyWord.CAMP_RELATION_ALLY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_FRIEND][KeyWord.CAMP_ID_MONSTER_FRIEND] = KeyWord.CAMP_RELATION_ALLY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_FRIEND][KeyWord.CAMP_ID_MONSTER_ANIMATION] = KeyWord.CAMP_RELATION_ENEMY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_FRIEND][KeyWord.CAMP_ID_MONSTER_ANIMATION2] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_FRIEND][KeyWord.CAMP_ID_MONSTER_ANIMATION3] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_FRIEND][KeyWord.CAMP_ID_MONSTER_ANIMATION4] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_FRIEND][KeyWord.CAMP_ID_UNKNOWN] = KeyWord.CAMP_RELATION_UNKNOWN;

        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION] = {};
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION][KeyWord.CAMP_ID_ROLE_NORMAL] = KeyWord.CAMP_RELATION_ENEMY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION][KeyWord.CAMP_ID_MONSTER_NORMAL] = KeyWord.CAMP_RELATION_ENEMY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION][KeyWord.CAMP_ID_MONSTER_NEUTRAL] = KeyWord.CAMP_RELATION_ENEMY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION][KeyWord.CAMP_ID_MONSTER_FRIEND] = KeyWord.CAMP_RELATION_ENEMY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION][KeyWord.CAMP_ID_MONSTER_ANIMATION] = KeyWord.CAMP_RELATION_ALLY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION][KeyWord.CAMP_ID_MONSTER_ANIMATION2] = KeyWord.CAMP_RELATION_ENEMY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION][KeyWord.CAMP_ID_MONSTER_ANIMATION3] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION][KeyWord.CAMP_ID_MONSTER_ANIMATION4] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION][KeyWord.CAMP_ID_UNKNOWN] = KeyWord.CAMP_RELATION_UNKNOWN;

        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION2] = {};
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION2][KeyWord.CAMP_ID_ROLE_NORMAL] = KeyWord.CAMP_RELATION_ALLY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION2][KeyWord.CAMP_ID_MONSTER_NORMAL] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION2][KeyWord.CAMP_ID_MONSTER_NEUTRAL] = KeyWord.CAMP_RELATION_ENEMY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION2][KeyWord.CAMP_ID_MONSTER_FRIEND] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION2][KeyWord.CAMP_ID_MONSTER_ANIMATION] = KeyWord.CAMP_RELATION_ENEMY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION2][KeyWord.CAMP_ID_MONSTER_ANIMATION2] = KeyWord.CAMP_RELATION_ALLY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION2][KeyWord.CAMP_ID_MONSTER_ANIMATION3] = KeyWord.CAMP_RELATION_ALLY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION2][KeyWord.CAMP_ID_MONSTER_ANIMATION4] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION2][KeyWord.CAMP_ID_UNKNOWN] = KeyWord.CAMP_RELATION_UNKNOWN;

        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION3] = {};
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION3][KeyWord.CAMP_ID_ROLE_NORMAL] = KeyWord.CAMP_RELATION_ENEMY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION3][KeyWord.CAMP_ID_MONSTER_NORMAL] = KeyWord.CAMP_RELATION_ENEMY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION3][KeyWord.CAMP_ID_MONSTER_NEUTRAL] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION3][KeyWord.CAMP_ID_MONSTER_FRIEND] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION3][KeyWord.CAMP_ID_MONSTER_ANIMATION] = KeyWord.CAMP_RELATION_ENEMY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION3][KeyWord.CAMP_ID_MONSTER_ANIMATION2] = KeyWord.CAMP_RELATION_ENEMY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION3][KeyWord.CAMP_ID_MONSTER_ANIMATION3] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION3][KeyWord.CAMP_ID_MONSTER_ANIMATION4] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION3][KeyWord.CAMP_ID_UNKNOWN] = KeyWord.CAMP_RELATION_UNKNOWN;

        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION4] = {};
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION4][KeyWord.CAMP_ID_ROLE_NORMAL] = KeyWord.CAMP_RELATION_ENEMY;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION4][KeyWord.CAMP_ID_MONSTER_NORMAL] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION4][KeyWord.CAMP_ID_MONSTER_NEUTRAL] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION4][KeyWord.CAMP_ID_MONSTER_FRIEND] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION4][KeyWord.CAMP_ID_MONSTER_ANIMATION] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION4][KeyWord.CAMP_ID_MONSTER_ANIMATION2] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION4][KeyWord.CAMP_ID_MONSTER_ANIMATION3] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION4][KeyWord.CAMP_ID_MONSTER_ANIMATION4] = KeyWord.CAMP_RELATION_NEUTRAL;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_MONSTER_ANIMATION4][KeyWord.CAMP_ID_UNKNOWN] = KeyWord.CAMP_RELATION_UNKNOWN;

        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_UNKNOWN] = {};
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_UNKNOWN][KeyWord.CAMP_ID_ROLE_NORMAL] = KeyWord.CAMP_RELATION_UNKNOWN;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_UNKNOWN][KeyWord.CAMP_ID_MONSTER_NORMAL] = KeyWord.CAMP_RELATION_UNKNOWN;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_UNKNOWN][KeyWord.CAMP_ID_MONSTER_NEUTRAL] = KeyWord.CAMP_RELATION_UNKNOWN;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_UNKNOWN][KeyWord.CAMP_ID_MONSTER_FRIEND] = KeyWord.CAMP_RELATION_UNKNOWN;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_UNKNOWN][KeyWord.CAMP_ID_MONSTER_ANIMATION] = KeyWord.CAMP_RELATION_UNKNOWN;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_UNKNOWN][KeyWord.CAMP_ID_MONSTER_ANIMATION2] = KeyWord.CAMP_RELATION_UNKNOWN;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_UNKNOWN][KeyWord.CAMP_ID_MONSTER_ANIMATION3] = KeyWord.CAMP_RELATION_UNKNOWN;
        CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_UNKNOWN][KeyWord.CAMP_ID_UNKNOWN] = KeyWord.CAMP_RELATION_UNKNOWN;

    }

    static getCampRelation(campID1: number, campID2: number): number {
        return CampRelation.m_aiCampRelation[campID1][campID2];
    }

    static getMyRelation(campID: number): number {
        return CampRelation.m_aiCampRelation[KeyWord.CAMP_ID_ROLE_NORMAL][campID];
    }

    static isFriend(role: UnitController): boolean {
        if (role == null || role.Data == null)
            return false;
        return CampRelation.getMyRelation((role.Data as RoleData).campID) == KeyWord.CAMP_RELATION_ALLY;
    }

    static isEnemy(role: UnitController): boolean {
        if (role == null || role.Data == null)
            return false;
        return CampRelation.getMyRelation((role.Data as RoleData).campID) == KeyWord.CAMP_RELATION_ENEMY;
    }

    static isNeutral(role: UnitController): boolean {
        if (role == null || role.Data == null)
            return false;
        return CampRelation.getMyRelation((role.Data as RoleData).campID) == KeyWord.CAMP_RELATION_NEUTRAL;
    }
}