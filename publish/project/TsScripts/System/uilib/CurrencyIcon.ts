import { Global as G } from 'System/global'
import { ThingData } from 'System/data/thing/ThingData'
import { ItemTipData } from 'System/tip/tipData/ItemTipData'
import { TextTipData } from 'System/tip/tipData/TextTipData'
import { Color } from 'System/utils/ColorUtil'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { ResUtil } from 'System/utils/ResUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'

/**
 * 货币图标。
 * @author teppei
 * 
 */
export class CurrencyIcon {
    /**货币ID。*/
    private m_currencyID: number = 0;

    private iconImg: UnityEngine.UI.RawImage;

    setComponents(container: UnityEngine.GameObject) {
        let iconTransform = container.transform.Find('icon');
        if (null != iconTransform) {
            this.iconImg = iconTransform.GetComponent(UnityEngine.UI.RawImage.GetType()) as UnityEngine.UI.RawImage;
        } else {
            this.iconImg = container.GetComponent(UnityEngine.UI.RawImage.GetType()) as UnityEngine.UI.RawImage;
        }
        uts.assert(null != this.iconImg, 'UI错误！');
    }

    setCurrencyID(value: number, bindSensitive: boolean): void {
        if (!bindSensitive) {
            if (GameIDUtil.isYuanbaoID(value)) {
                value = KeyWord.MONEY_YUANBAO_ID;
            }
        }

        if (this.m_currencyID != value) {
            this.m_currencyID = value;

            // 两种经验使用同一个图标
            if (KeyWord.EXPERIENCE_LEVEL_THING_ID == value) {
                value = KeyWord.EXPERIENCE_THING_ID;
            }
            //是否是货币
            let isHuobi: boolean = GameIDUtil.isSpecialID(value);
            let itemConfig: GameConfig.ThingConfigM;
            let iconStr: string;
            if (isHuobi) {
                iconStr = value + '';
            }
            else {
                itemConfig = ThingData.getThingConfig(value);
                if (KeyWord.ITEM_FUNCTION_WYSP == itemConfig.m_ucFunctionType) {
                    // 伙伴万能碎片有货币图标
                    iconStr = 'c' + value;
                } else {
                    iconStr = itemConfig.m_szIconID;
                }
            }

            G.ResourceMgr.loadIcon(this.iconImg,iconStr);
        }
    }

    static getTipStr(id: number): string {
        let tipStr: string = TextFieldUtil.getColorText(KeyWord.getDesc(KeyWord.GROUP_SPECIAL_ITEM, id), Color.getCurrencyColor(id));
        let desc = G.DataMgr.langData.getLang(id);
        if (null == desc) {
            if (KeyWord.SKY_BONUS_ID == id) {
                // 宝镜积分
                tipStr += G.DataMgr.langData.getLang(93);
            }
        }

        if (null != desc) {
            tipStr += '\n\n';
            tipStr += desc;
        }

        return tipStr;
    }
}
