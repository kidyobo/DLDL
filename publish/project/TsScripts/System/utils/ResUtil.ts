import { KeyWord } from 'System/constants/KeyWord'
import { EnumIconSize } from 'System/IconManger/EnumIconSize'

/**
* 资源工具。
* @author teppei
* 
*/
export class ResUtil {

    static getActIconName(cfg: GameConfig.ActHomeConfigM): string {
        if (null != cfg.m_szIconRes && '' != cfg.m_szIconRes) {
            return cfg.m_szIconRes;
        }
        return cfg.m_iID.toString();
    }

    /**
     * 根据大小返回实际图标名 
     * @param iconID
     * @return 
     * 
     */
    static getIconID(iconID: string, size: number): string {

        //if (size == EnumIconSize.EXTRA_LARGE) {
        //    return iconID + "XL";
        //}
        //else if (size == EnumIconSize.LARGE) {
        //    return iconID + "L";
        //}
        //else if (size == EnumIconSize.SMALL) {
        //    return iconID + "S";
        //}
        //else if (size == EnumIconSize.EXTRA_SMALL) {
        //    return iconID + "XS";
        //}
        //else if (size == EnumIconSize.FILLET_SMALL) {
        //    return iconID + "S";
        //}
        //else if (size == EnumIconSize.FILLET_EXTRA_LARGE) {
        //    return iconID + "XL";
        //}
        //else {   
        //    return iconID;
        //}
        return iconID;
    }

    /**
    * 获取图标特效名字 
    * @param color
    * @param size
    * @return 
    * 
    */
    static getIconEffName(color: number, size: number): string {

        if (size == EnumIconSize.FILLET_NORMAL ||
            size == EnumIconSize.FILLET_EXTRA_LARGE) {
            return "ie_" + (size - 1) + "_" + color;
        }
        else {
            return "ie_" + size + "_" + color;
        }
    }
}