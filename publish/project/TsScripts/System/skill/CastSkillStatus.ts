/**
 * 释放技能时候的状态 
 * @author fygame
 * 
 */
export enum CastSkillStatus {
    //		public static const IS_IN_PUBLIC_COLDING: int = 2;
    //		public static const OUTOF_MP: int = 3;
    //		public static const NO_SELECT: int = 4;

    INAUTO = 5,//在自动攻击中释放技能
    INCOLD_NOAUTO = 6,//在非自动攻击,但在公共冷却
    NOCOLD_NOAUTO = 8,//不在冷却，也不在自动攻击
    IN_SELFCOLD = 7,//在自身冷却，不能使用

    OUTOFDIS = 9,//距离太远，要先跑到合适的距离才能释放
    OUTOFDIS_NOGO = 15,//距离太远，但是不需要跑到合适的距离才能释放
    NO_SELECTED_TARGET = 10,//没有选中目标
    TARGER_DIE_OR_NOEXIST = 12,//目标已经死亡或者不存在了
    BLOCKED = 13,//与被攻击者之间有阻隔
    INVALID_TARGET = 14,//所选的目标不合法
    CANCAST = 11,//可以释放

    NO_TARGET = 15,//特殊，针对有target的道具

}
export default CastSkillStatus;