import { ElemFinder } from "../uilib/UiUtility";
import { TextGetSet, GameObjectGetSet } from "../uilib/CommonForm";
import { List } from "../uilib/List";


/**节点标题 */
export class TitleItemNode {
    private txtTitleName: TextGetSet;
    private txtSubTitleName: TextGetSet;

    setComponents(go: UnityEngine.GameObject) {
        this.txtTitleName = new TextGetSet(ElemFinder.findText(go, "txtTitleName"));
        this.txtSubTitleName = new TextGetSet(ElemFinder.findText(go, "txtTitleName/txtSubTitleName"));
    }

    setTitleName(name: string) {
        this.txtTitleName.text = name;
    }

    setFighting(fight: number) {
        if (fight == 0)
            this.txtSubTitleName.text = "";
        else
            this.txtSubTitleName.text = uts.format("战斗力 {0}", fight);
    }

    /**副标题 */
    setSubtitle(des: string) {
        this.txtSubTitleName.text = des;
    }
}

/**
 * 节点标题 + 星级
 */
export class TitleItemStarNode extends TitleItemNode {
    private starList: List;
    private stars: GameObjectGetSet[] = [];
    setComponents(go: UnityEngine.GameObject) {
        super.setComponents(go);
        this.starList = ElemFinder.getUIList(ElemFinder.findObject(go, "starList"))
        this.starList.Count = 10;
        for (let i = 0; i < 10; i++) {
            this.stars[i] = new GameObjectGetSet(this.starList.GetItem(i).findObject("star"));
        }
    }

    setStarNumber(number: number) {
        for (let i = 0; i < 10; i++) {
            this.stars[i].SetActive(i < number);
        }
    }

}