import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { IconItem } from 'System/uilib/IconItem'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { TipFrom } from 'System/tip/view/TipsView'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { CompareUtil } from 'System/utils/CompareUtil'

class KuaFu3v3StageItem extends ListItemCtrl {
    private textStage: UnityEngine.UI.Text;
    private textZhanhun: UnityEngine.UI.Text;
    private textCredit: UnityEngine.UI.Text;

    private bg1: UnityEngine.GameObject;
    private bg2: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.textStage = ElemFinder.findText(go, 'textStage');
        this.textZhanhun = ElemFinder.findText(go, 'textZhanhun');
        this.textCredit = ElemFinder.findText(go, 'textCredit');

        this.bg1 = ElemFinder.findObject(go, 'bg1');
        this.bg2 = ElemFinder.findObject(go, 'bg2');
    }

    update(index: number, cfg: GameConfig.Cross3V3GradeM) {
        this.textStage.text = cfg.m_szName;
        this.textZhanhun.text = cfg.m_iReward1.toString();
        this.textCredit.text = cfg.m_iScore.toString();

        this.bg2.SetActive(index % 2 == 1);
    }
}

export class KuaFu3v3StageView extends CommonForm {
    private readonly RewardsCount = 3;

    private tabGroup: UnityEngine.UI.ActiveToggleGroup;
    //private btnClose: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;
    private stageIcons: UnityEngine.GameObject;
    private icons: UnityEngine.GameObject[] = [];
    private list: List;
    private items: KuaFu3v3StageItem[] = [];

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.KuaFu3v3StageView;
    }

    protected initElements() {
        //this.btnClose = this.elems.getElement('btnClose');
        this.tabGroup = this.elems.getToggleGroup('tabGroup');
        this.list = this.elems.getUIList('list');
        this.mask = this.elems.getElement('mask');
        this.stageIcons = this.elems.getElement("stageIcons");
        for (let i = 0; i < 5; i++) {
            this.icons.push(ElemFinder.findObject(this.stageIcons, 'image' + (i + 1)));
            this.icons[i].SetActive(false);
        }
    }

    protected initListeners() {
        //this.addClickListener(this.btnClose, this.onClickBtnClose);
        this.addToggleGroupListener(this.tabGroup, this.onTabGroupChanged);
        this.addClickListener(this.mask, this.onClickBtnClose);
    }

    protected onOpen() {
        let kf3v3Data = G.DataMgr.kf3v3Data;
        let info = kf3v3Data.pvpV3Info;
        let grade = 0;
        if (null != info) {
            grade = info.m_uiGrade;
        }
        let cfg = kf3v3Data.getConfByLevel(grade);
        // 默认选中当前段位
        let index = cfg.m_iStage - 1;
        if (index < 0) {
            index = 0;
        }
        this.tabGroup.Selected = index;
    }

    protected onClose() {
    }

    private onClickBtnClose() {
        this.close();
    }

    private onTabGroupChanged(index: number) {

        for (let i = 0; i < 5; i++) {
            if (i == index) {
                if (!this.icons[i].activeSelf) {
                    this.icons[i].SetActive(true);
                } 
            } else {
                if (this.icons[i].activeSelf) {
                    this.icons[i].SetActive(false);
                } 
            }
        }

        let cfgs = G.DataMgr.kf3v3Data.getConfArrByLevel(index + 1);
        let len = cfgs.length;
        this.list.Count = len;
        let oldItemCnt = this.items.length;
        for (let i = 0; i < len; i++) {
            let item: KuaFu3v3StageItem;
            if (i < oldItemCnt) {
                item = this.items[i];
            } else {
                this.items.push(item = new KuaFu3v3StageItem());
                item.setComponents(this.list.GetItem(i).gameObject);
            }
            item.update(i, cfgs[i]);
        }
    }
}