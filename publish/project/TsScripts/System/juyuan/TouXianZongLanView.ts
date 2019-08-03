import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { List } from 'System/uilib/List'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { ElemFinder } from 'System/uilib/UiUtility'


export class titleListItemData {
    icon: number;
    value: number;
}


/**头衔预览*/
export class TouXianZongLanView extends CommonForm {
    private titleData: titleListItemData[] = [];
    /**头衔列表*/
    private titleList: List = null;

    /**标题的名字*/
    private titleString: string = "";
    /**标题文本*/
    private titleText: UnityEngine.UI.Text;

    protected iconAltas: Game.UGUIAltas = null;

    constructor() {
        super(0);
    }

    /**需要传入参数,titleText:标题,titleData:数据*/
    open(titleString: string, titleData: titleListItemData[]) {
        this.titleString = titleString;
        this.titleData = titleData;
        super.open();
    }

    protected onOpen() {
        this.titleText.text = this.titleString;
        let length = this.titleData.length;
        this.titleList.Count = length;
        for (let i = 0; i < length; i++) {
            let item = this.titleList.GetItem(i).gameObject;
            let titleItem = new TitleItem();
            titleItem.setComponents(item);
            titleItem.update(this, this.titleData[i], i);
        }
    }

    protected onClose() {

    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.TouXianZongLanView;
    }

    protected initElements(): void {
        this.iconAltas = this.elems.getUGUIAtals('actIcons');
        this.titleList = this.elems.getUIList('rankList');
        this.titleText = this.elems.getText('txtRankTitle');
    }

    protected initListeners(): void {
        this.addClickListener(this.elems.getElement('btnClose'), this.close);
        this.addClickListener(this.elems.getElement('mask'), this.close);
    }

    getIcon(id: number): UnityEngine.Sprite {
        let s = this.iconAltas.Get(id.toString());
        if (s == null) {
            uts.logError('no icon: ' + id);
        }
        return s;
    }
}


class TitleItem {
    private imageIcon: UnityEngine.UI.Image;
    private txtValue: UnityEngine.UI.Text;
    private bg1: UnityEngine.GameObject;
    private bg2: UnityEngine.GameObject;


    setComponents(go: UnityEngine.GameObject) {
        this.imageIcon = ElemFinder.findImage(go, "icon/Image");
        this.txtValue = ElemFinder.findText(go, "ZhanLi");
        this.bg1 = ElemFinder.findObject(go, "bg1");
        this.bg2 = ElemFinder.findObject(go, "bg2");
    }

    update(touXianZongLanView: TouXianZongLanView, data: titleListItemData, index: number) {
        this.imageIcon.sprite = touXianZongLanView.getIcon(data.icon);
        this.txtValue.text = TextFieldUtil.getColorText(data.value.toString(), Color.UIGreen);
        if (index % 2 == 1) {
            this.bg1.SetActive(true);
            this.bg2.SetActive(false);
        } else {
            this.bg1.SetActive(false);
            this.bg2.SetActive(true);
        }
    }
}