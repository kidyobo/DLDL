import { KeyWord } from 'System/constants/KeyWord'

/**
 * 兑换商城标签的枚举。
 * @author teppei
 * 
 */
export class EnumExcStoreTab {
    ///////////////////////////////////////////////// 宝石兑换 /////////////////////////////////////////////////

    /**
     * 宝石兑换 -- 总览 枚举值。
     */
    static SUB_BSSP_TOTAL: { value: number, label: string } = { value: KeyWord.GENERALSTORE_TAB_ALL, label: 'mcSubLabel0' };

    /**
     * 宝石兑换 -- 宝石 枚举值。
     */
    static SUB_BSSP_DIAMOND: { value: number, label: string } = { value: KeyWord.EXCSTORE_SUB_TAB_DIAMOND, label: 'mcSubLabel1' };

    /**
     * 宝石兑换 -- 打孔石 枚举值。
     */
    static SUB_BSSP_DKZ: { value: number, label: string } = { value: KeyWord.EXCSTORE_SUB_TAB_DIAMOND_HOLE, label: 'mcSubLabel2' };

    /**
     * 宝石兑换 -- 宝石卷轴 枚举值。
     */
    static SUB_BSSP_FORMULAR: { value: number, label: string } = { value: KeyWord.EXCSTORE_SUB_TAB_DIAMOND_FORMULAR, label: 'mcSubLabel3' };

    /**宝石兑换子分类枚举列表。*/
    static SUB_BSSP: { value: number, label: string }[] = [EnumExcStoreTab.SUB_BSSP_TOTAL, EnumExcStoreTab.SUB_BSSP_DIAMOND, EnumExcStoreTab.SUB_BSSP_DKZ, EnumExcStoreTab.SUB_BSSP_FORMULAR];

    /**宝石兑换父分类枚举值。*/
    static MAIN_BSSP: { value: number, subTypes: { value: number, label: string }[] } = { value: KeyWord.EXCSTORE_TAB_DIAMOND, subTypes: EnumExcStoreTab.SUB_BSSP };

    ///////////////////////////////////////////////// 法宝兑换 /////////////////////////////////////////////////

    /**
     * 法宝兑换 -- 总览 枚举值。
     */
    static SUB_FBSP_TOTAL: { value: number, label: string } = { value: KeyWord.GENERALSTORE_TAB_ALL, label: 'mcSubLabel0' };

    /**
     * 法宝兑换 -- 强化石 枚举值。
     */
    static SUB_FBSP_QHS: { value: number, label: string } = { value: KeyWord.EXCSTORE_SUB_TAB_EQUIP_ENHANCE, label: 'mcSubLabel4' };

    /**
     * 法宝兑换 -- 紫装 枚举值。
     */
    static SUB_FBSP_ZZ: { value: number, label: string } = { value: KeyWord.EXCSTORE_SUB_TAB_PURPLE_ENHANCE, label: 'mcSubLabel5' };

    /**法宝兑换子分类枚举列表。*/
    static SUB_FBSP: { value: number, label: string }[] = [EnumExcStoreTab.SUB_FBSP_TOTAL, EnumExcStoreTab.SUB_FBSP_QHS, EnumExcStoreTab.SUB_FBSP_ZZ];

    /**法宝兑换父分类枚举值。*/
    static MAIN_FBSP: { value: number, subTypes: { value: number, label: string }[] } = { value: KeyWord.EXCSTORE_TAB_EQUIP, subTypes: EnumExcStoreTab.SUB_FBSP };

    ///////////////////////////////////////////////// 仙元兑换 /////////////////////////////////////////////////

    /**
     * 仙元兑换 -- 总览 枚举值。
     */
    static SUB_XY_TOTAL: { value: number, label: string } = { value: KeyWord.GENERALSTORE_TAB_ALL, label: 'mcSubLabel0' };

    //		/**
    //		 * 仙元兑换 -- 神器 枚举值。
    //		 */		
    //		public static const SUB_XY_SHENQI: Object = {value: KeyWord.EXCSTORE_SUB_TAB_SHENQI_ENHANCE, label: 'mcSubLabel6'};

    /**仙元兑换子分类枚举列表。*/
    static SUB_XY: { value: number, label: string }[] = [EnumExcStoreTab.SUB_XY_TOTAL];

    /**仙元兑换父分类枚举值。*/
    static MAIN_XY: { value: number, subTypes: { value: number, label: string }[] } = { value: KeyWord.EXCSTORE_TAB_XIANYUAN, subTypes: EnumExcStoreTab.SUB_XY };

    ///////////////////////////////////////////////// 神源兑换 /////////////////////////////////////////////////

    /**
     * 神源兑换 -- 总览 枚举值。
     */
    static SUB_SY_TOTAL: { value: number, label: string } = { value: KeyWord.GENERALSTORE_TAB_ALL, label: 'mcSubLabel0' };

    //		/**
    //		 * 神源兑换 -- 神器 枚举值。
    //		 */		
    //		public static const SUB_SY_SHENQI: Object = {value: KeyWord.EXCSTORE_SUB_TAB_SHENQI_ENHANCE, label: 'mcSubLabel6'};

    /**神源兑换子分类枚举列表。*/
    static SUB_SY: { value: number, label: string }[] = [EnumExcStoreTab.SUB_SY_TOTAL];

    /**神源兑换父分类枚举值。*/
    static MAIN_SY: { value: number, subTypes: { value: number, label: string }[] } = { value: KeyWord.EXCSTORE_TAB_SUIPIAN, subTypes: EnumExcStoreTab.SUB_SY };

    ///////////////////////////////////////////////// 战勋兑换 /////////////////////////////////////////////////
    /**
     *战勋兑换-- 总揽 枚举值 
     */
    static SUB_ZX_TOTAL: { value: number, label: string } = { value: KeyWord.GENERALSTORE_TAB_ALL, label: 'mcSubLabel0' };

    //		/**
    //		 * 战勋兑换 -- 神器 枚举值。
    //		 */		
    //		public static const SUB_ZX_SHENQI: Object = {value: KeyWord.EXCSTORE_SUB_TAB_SHENQI_ENHANCE, label: 'mcSubLabel6'};

    /**战勋兑换子分类枚举列表。*/
    static SUB_ZX: { value: number, label: string }[] = [EnumExcStoreTab.SUB_ZX_TOTAL];

    /**战勋对换父类枚举值*/
    static MAIN_ZX: { value: number, subTypes: { value: number, label: string }[] } = { value: KeyWord.EXCSTORE_TAB_ZHANXUN, subTypes: EnumExcStoreTab.SUB_ZX };

    ///////////////////////////////////////////////// 主页签 /////////////////////////////////////////////////

    /**兑换商城枚举列表。*/
    static DH_TABS: { value: number, subTypes: { value: number, label: string }[] }[] = [EnumExcStoreTab.MAIN_FBSP, EnumExcStoreTab.MAIN_BSSP];

    /**神秘商城枚举列表*/
    static SM_TABS: { value: number, subTypes: { value: number, label: string }[] }[] = [EnumExcStoreTab.MAIN_XY, EnumExcStoreTab.MAIN_SY, EnumExcStoreTab.MAIN_ZX];
}
