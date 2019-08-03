import { Macros } from 'System/protocol/Macros'

/**
 * 神力规则
 * @author jesse
 *
 */
export class JuyuanRule {
    /** 神力引导的最大类型 */
    static MAIN_GUIDER_TYPE: number = 2;

    /** 每一个阶段的最大等级 */
    static MAX_JUYUAN_LEVEL: number = Macros.MAX_JUYUAN_LEVEL;
    /** 最大的类型 */
    static MAX_JUYUAN_TYPE: number = Macros.MAX_JUYUAN_TYPE;
    /** 系统图标+ID */
    static ICON_SYSTEM: string = 'png_JuYuan_IconFun_';
    /** 系统奇门八脉提示+ID */
    static ICON_QI_MEN_DUN_JIA_TIP: string = 'png_JuYuan_qiMenDunJiaTip_';
    /** 系统奇门八脉 + ID */
    static ICON_QI_MEN_DUN_JIA: string = 'png_JuYuan_qiMenDunJia_';
    /** 系统图标提示+ID */
    static ICON_SYSTEM_TIP: string = 'png_JuYuan_IconFunTip_';
    /** 神力名称 */
    static ICON_NAME_TYPE: string = 'png_JuYuan_NameType_';
    /** 神力名称(小) */
    static ICON_NAME_LEVEL: string = 'png_JuYuan_NameLevel_';
    /** 神力名称(竖) */
    static ICON_NAME_TYPE_H: string = 'PNG_JU_YUAN_NAME_H_';

    private static LEVEL_NAME_LIST = ['初期','中期','后期','巅峰'];

     /**
     * 获取神力名称的组合
     * @param baseName	神力基础名称
     * @param level		神力等级
     * @return 			已经组合完成的名称
     *
     */
    static getJuYuanName(baseName: string, level: number): string { 
        return baseName /*+ JuyuanRule.LEVEL_NAME_LIST[level - 1]*/;
    }
}
