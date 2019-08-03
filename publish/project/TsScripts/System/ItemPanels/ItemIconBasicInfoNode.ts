import { ThingData } from "System/data/thing/ThingData";
import { IconItem } from 'System/uilib/IconItem';
import { ElemFinder } from 'System/uilib/UiUtility';
import { Color } from 'System/utils/ColorUtil';
import { GameIDUtil } from "System/utils/GameIDUtil";
import { RegExpUtil } from "System/utils/RegExpUtil";
import { TextFieldUtil } from 'System/utils/TextFieldUtil';
import { KeyWord } from '../constants/KeyWord';

/**物品（装备）基本信息 */
export class ItemIconBasicInfoNode {
    private gameObject: UnityEngine.GameObject;

    /**图标*/
    private goIcon: UnityEngine.GameObject;
    /**名字*/
    private txtName: UnityEngine.UI.Text;
    /**类型*/
    private txtType: UnityEngine.UI.Text;
    /**使用限制*/
    private txtLimit: UnityEngine.UI.Text;
    /**获取信息*/
    private txtGetInfo: UnityEngine.UI.Text;
    private txtGetTitle: UnityEngine.UI.Text;

    private iconItem: IconItem;

    setComponents(go: UnityEngine.GameObject, itemIcon_Normal: UnityEngine.GameObject) {
        this.gameObject = go;

        this.goIcon = ElemFinder.findObject(go, "imgItem");
        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(itemIcon_Normal, this.goIcon);

        this.txtName = ElemFinder.findText(go, "txtName");
        this.txtType = ElemFinder.findText(go, "txtType")
        this.txtLimit = ElemFinder.findText(go, "txtLimit")
        this.txtGetInfo = ElemFinder.findText(go, "txtLabel/txtGetInfo")
        this.txtGetTitle = ElemFinder.findText(go, "txtLabel")
    }


    updateItemThing(data: GameConfig.ThingConfigM) {
        this.iconItem.updateById(data.m_iID);
        this.iconItem.updateIcon();

        let color = Color.getColorById(data.m_ucColor);
        this.txtName.text = TextFieldUtil.getColorText(data.m_szName, color);
        this.txtType.text = "类型：" + KeyWord.getDesc(KeyWord.GROUP_HUNGU_EQUIP_MAIN, data.m_iMainClass);
        if (GameIDUtil.isHunguEquipID(data.m_iID)) {
            //魂骨装备
            this.txtLimit.text = uts.format("使用需求：{0}", KeyWord.getDesc(KeyWord.GROUP_DOULUO_TITLE_TYPE, data.m_ucHunLiLevel));
            this.txtGetTitle.text = "特殊说明";
            this.txtGetInfo.text = RegExpUtil.xlsDesc2Html(data.m_szDesc);
        }
        else {
            this.txtLimit.text = uts.format("要求等级：{0}级", data.m_ucRequiredLevel);
            this.txtGetTitle.text = "获取来源";
            this.txtGetInfo.text = RegExpUtil.xlsDesc2Html(data.m_szSpecDesc);
        }
    }

    updateItemEquip(data: GameConfig.EquipConfigM) {
        this.iconItem.updateById(data.m_iID);
        this.iconItem.updateIcon();

        let color = Color.getColorById(data.m_ucColor);
        this.txtName.text = TextFieldUtil.getColorText(data.m_szName, color);
        this.txtType.text = "类型：" + KeyWord.getDesc(KeyWord.GROUP_HUNGU_EQUIP_MAIN, data.m_iMainClass);
        if (GameIDUtil.isHunguEquipID(data.m_iID)) {
            //魂骨装备
            this.txtLimit.text = uts.format("使用需求：{0}", KeyWord.getDesc(KeyWord.GROUP_DOULUO_TITLE_TYPE, data.m_ucHunLiLevel));
            this.txtGetTitle.text = "特殊说明";
            this.txtGetInfo.text = RegExpUtil.xlsDesc2Html(data.m_szDesc);
        }
        else {
            this.txtLimit.text = uts.format("要求等级：{0}级", data.m_ucRequiredLevel);
            this.txtGetTitle.text = "获取来源";
            this.txtGetInfo.text = RegExpUtil.xlsDesc2Html(data.m_szSpecDesc);
        }
    }

    updateItemId(id: number) {
        if (GameIDUtil.isBagThingID(id)) {
            let data = ThingData.getThingConfig(id);
            this.updateItemThing(data);
        }
        else {
            uts.logError("@jackson 请检查选中物品是否是可以放入背包的物品...");
        }
    }
}