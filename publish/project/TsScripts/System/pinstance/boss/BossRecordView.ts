import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { GroupList } from 'System/uilib/GroupList'
import { ElemFinder } from 'System/uilib/UiUtility'
import { DataFormatter } from 'System/utils/DataFormatter'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'

class BossRecordItem {
    private textInfo: UnityEngine.UI.Text;

    /**深浅交替背景*/
    private bg1: UnityEngine.GameObject;
    private bg2: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.textInfo = ElemFinder.findText(go, 'textInfo');

        this.bg1 = ElemFinder.findObject(go, 'bg1');
        this.bg2 = ElemFinder.findObject(go, 'bg2');
    }

    update(info: Protocol.CSFMTKillerOneInfo, index: number) {
        uts.log(info);
        if (null != info) {
            if (info.m_uiTime > 0) {
                this.textInfo.text = uts.format('于{0}被 {1} 击败', DataFormatter.second2mmddmm(info.m_uiTime), TextFieldUtil.getColorText(info.m_szKillerName, 'DAEFF3'));
            } else {
                this.textInfo.text = uts.format('上轮击杀者： {0}', TextFieldUtil.getColorText(info.m_szKillerName, 'DAEFF3'));
            }
            this.textInfo.gameObject.SetActive(true);
        } else {
            this.textInfo.gameObject.SetActive(false);
        }        

        if (null != this.bg2) {
            this.bg2.SetActive(index % 2 == 0);
        }
    }
}

export class BossRecordView extends CommonForm {

    private readonly MinDisplayCnt = 10;

    private list: List;
    private items: BossRecordItem[] = [];
    private btnClose: UnityEngine.GameObject;

    private infos: Protocol.CSFMTKillerOneInfo[];

    constructor() {
        super(0);
    }

    protected onOpen() {
        let cnt = 0;
        if (null != this.infos) {
            cnt = this.infos.length;
        }

        let displayCnt = cnt;
        if (cnt < this.MinDisplayCnt) {
            displayCnt = this.MinDisplayCnt;
        }
        this.list.Count = displayCnt;
        let oldItemCnt = this.items.length;
        for (let i: number = 0; i < displayCnt; i++) {
            let item: BossRecordItem;
            if (i < oldItemCnt) {
                item = this.items[i];
            } else {
                this.items.push(item = new BossRecordItem());
                item.setComponents(this.list.GetItem(i).gameObject);
            }

            if (i < cnt) {
                item.update(this.infos[i], i);
            } else {
                item.update(null, i);
            }            
        }
    }

    protected onClose() {
    }
    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.BossRecordView;
    }
    protected initElements(): void {
        this.btnClose = this.elems.getElement('btnClose');
        this.list = this.elems.getUIList('list');
    }
    protected initListeners(): void {
        this.addClickListener(this.btnClose, this.onClickCloseBtn);
        this.addClickListener(this.elems.getElement("mask"), this.onClickCloseBtn);
    }
    open(infos: Protocol.CSFMTKillerOneInfo[]) {
        this.infos = infos;
        super.open();
    }
    private onClickCloseBtn() {
        this.close();
    }
}