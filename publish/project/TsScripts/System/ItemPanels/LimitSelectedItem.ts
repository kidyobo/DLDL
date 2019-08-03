import { ElemFinder } from "../uilib/UiUtility";
import { TextGetSet } from "../uilib/CommonForm";
import { List } from "../uilib/List";
import { KeyWord } from "../constants/KeyWord";
import { SpecialCharUtil } from "../utils/SpecialCharUtil";


/**选择分级 */
export class LimitSelectedItem {
    private txtTitle: TextGetSet;
    private list: List;
    private curSelected: number = -1;

    setComponents(go: UnityEngine.GameObject) {
        this.txtTitle = new TextGetSet(ElemFinder.findText(go, "txtTitle"));
        this.list = ElemFinder.getUIList(ElemFinder.findObject(go, "list"));
        this.list.onClickItem = delegate(this, this.onClickListItem);
    }

    /**
     * 设置显示 按掉落档次
     * @param count 档次数量（默认从1开始）
     * @param type 0魂骨年代  1装备阶级
     * @param min 最小档次
     */
    setDropLevelList(count: number, type: number = 0, min: number = 0) {
        this.list.Count = count;
        for (let i = 0; i < count; i++) {
            let item = this.list.GetItem(i);
            let name = ElemFinder.findText(item.gameObject, "txtName");
            if (type == 0) {
                //魂骨年代
                let str = KeyWord.getDesc(KeyWord.GROUP_HUNGU_DROP_LEVEL, i + 1 + min);
                name.text = str.replace("魂骨", "以上");
            }
            else if (type == 1) {
                //装备阶级
                let str = uts.format("{0}星以上", SpecialCharUtil.getJieNumberCN(i + min));
                name.text = str;
            }
        }
    }

    setListName(names: string[], count: number) {
        this.list.Count = count;
        for (let i = 0; i < count; i++) {
            let item = this.list.GetItem(i);
            let name = ElemFinder.findText(item.gameObject, "txtName");
            name.text = uts.format("{0}以上", names[i]);
        }
    }

    private onClickListItem(index: number) {
        if (this.curSelected != index) {
            this.curSelected = index;
            this.list.Selected = index;
        }
    }

    setTitleName(name: string) {
        this.txtTitle.text = name;
    }

    getSelctedIndex(): number {
        return this.curSelected;
    }

    setSelectedIndex(index: number) {
        this.onClickListItem(index);
    }
}