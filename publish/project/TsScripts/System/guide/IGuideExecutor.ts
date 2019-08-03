import { EnumGuide } from 'System/constants/GameEnum'

/**
* 指引执行者必须实现的接口。
* @author teppei
* 
*/
export interface IGuideExecutor {
    /**
     * 强制执行指定的指引步骤。
     * @param type 指引类型。
     * @param step 指引步骤。
     * @param args 其他指引参数。
     * 
     */
    force(type: EnumGuide, step: EnumGuide, ...args): boolean;
}
