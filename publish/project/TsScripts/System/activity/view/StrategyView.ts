import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { IconItem } from 'System/uilib/IconItem'
import { UiElements } from 'System/uilib/UiElements'
import { ElemFinder } from 'System/uilib/UiUtility'
import { TipFrom } from 'System/tip/view/TipsView'
import { Macros } from 'System/protocol/Macros'
import { DropPlanData } from 'System/data/DropPlanData'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'

class StrategyRewardItem {
 
    /**带背景的文本行复制源*/
    private bgTextlineClone: UnityEngine.GameObject;
    private bgTextlines: UnityEngine.GameObject[] = [];
    private bgTextlinePool: UnityEngine.GameObject[] = [];
    /**物品图标list复制源*/
    private thingListClone: UnityEngine.GameObject;
    private thingLists: UnityEngine.GameObject[] = [];
    private thingListPool: UnityEngine.GameObject[] = [];
    private thingIcons: Array<IconItem[]> = [];
    /**分割线复制源*/
    private lineClone: UnityEngine.GameObject;
    private lines: UnityEngine.GameObject[] = [];
    private linePool: UnityEngine.GameObject[] = [];

    private txtRule: UnityEngine.UI.Text;
    private itemIcon_Normal: UnityEngine.GameObject;
    private content: UnityEngine.GameObject;

    private contentIndex: number = 1;

    private scroll: UnityEngine.GameObject;

    setElems(elems: UiElements, scroll: UnityEngine.GameObject) {
        this.scroll = scroll;
        this.bgTextlines.push(this.bgTextlineClone = elems.getElement('bgTextlineClone'));
        // icon list不能push进数组里，因会在其上面动态加上icon，如果一方面用来使用，另一方面又用来clone，
        // 会把icon也clone出来，这样icon可能会重复
        this.thingListClone = elems.getElement('thingListClone');
        this.thingListClone.SetActive(false);
        this.lines.push(this.lineClone = elems.getElement('lineClone'));
        this.itemIcon_Normal = elems.getElement('itemIcon_Normal');
        this.content = elems.getElement("content");
        this.txtRule = elems.getText("txtRule");
    }


    updateView(config: GameConfig.SceneConfigM) {
      
        this.txtRule.text = RegExpUtil.xlsDesc2Html(config.m_szStrategy);
        this.reset();
        this.addSeperateLine();

        let hasCountDown = false;
        let count: number = config.m_astRewardDecList.length;
        let data: GameConfig.SceneReward;


        for (let i: number = 0; i < count; i++) {
            data = config.m_astRewardDecList[i];
            this.addBgText(data.m_ucSceneRewardDec);
            let dropConfig = DropPlanData.getDropPlanConfig(data.m_ucSceneRewardList);
            if (dropConfig) {
                this.addThingList(dropConfig);
            }
            else {
                uts.logErrorReport("掉落方案不存在:" + data.m_ucSceneRewardList);
            }
        }
        let scr = this.scroll.GetComponent(UnityEngine.UI.ScrollRect.GetType()) as UnityEngine.UI.ScrollRect;
        if (scr != null) {
            scr.verticalNormalizedPosition = 1;
        }
    }

    private addBgText(str: string): UnityEngine.UI.Text {
        let bgTextline: UnityEngine.GameObject;
        if (this.bgTextlinePool.length > 0) {
            bgTextline = this.bgTextlinePool.pop();
        } else {
            bgTextline = UnityEngine.UnityObject.Instantiate(this.bgTextlineClone, this.content.transform, false) as UnityEngine.GameObject;
        }
        bgTextline.SetActive(true);
        this.bgTextlines.push(bgTextline);
        // 显示文本内容
        let text = ElemFinder.findText(bgTextline, 'text');
        text.text = RegExpUtil.xlsDesc2Html(str);
        bgTextline.transform.SetSiblingIndex(this.contentIndex);
        this.contentIndex++;
        return text;
    }


    private addThingList(dropConfig: GameConfig.DropConfigM) {
        let curThingListCnt = this.thingLists.length;
        let icons: IconItem[];
        if (curThingListCnt < this.thingIcons.length) {
            icons = this.thingIcons[curThingListCnt];
        } else {
            this.thingIcons.push(icons = []);
        }

        let thingListGo: UnityEngine.GameObject;
        if (this.thingListPool.length > 0) {
            thingListGo = this.thingListPool.pop();
        } else {
            thingListGo = UnityEngine.UnityObject.Instantiate(this.thingListClone, this.content.transform, false) as UnityEngine.GameObject;
        }
        thingListGo.SetActive(true);
        this.thingLists.push(thingListGo);

        let oldThingIconCnt = icons.length;

        let myRewardListData: RewardIconItemData[] = []
        myRewardListData = RewardIconItemData.formatVector(dropConfig.m_ucDropThingNumber, myRewardListData);

        for (let i = 0; i < dropConfig.m_ucDropThingNumber; i++) {
            let thingIcon: IconItem;
            if (i < oldThingIconCnt) {
                thingIcon = icons[i];
                thingIcon.gameObject.SetActive(true);
            } else {
                icons.push(thingIcon = new IconItem());
                let iconGo = UnityEngine.UnityObject.Instantiate(this.itemIcon_Normal, thingListGo.transform, false) as UnityEngine.GameObject;
                thingIcon.setUsuallyIcon(iconGo);
                thingIcon.setTipFrom(TipFrom.normal);
            }

            let itemData = myRewardListData[i];
            itemData.id = dropConfig.m_astDropThing[i].m_iDropID;
            itemData.number = dropConfig.m_astDropThing[i].m_uiDropNumber;
            thingIcon.updateByRewardIconData(itemData);           
            thingIcon.updateIcon();
        }
        for (let i = dropConfig.m_ucDropThingNumber; i < oldThingIconCnt; i++) {
            icons[i].gameObject.SetActive(false);
        }
        thingListGo.transform.SetSiblingIndex(this.contentIndex);
        this.contentIndex++;
    }


    private addSeperateLine(): UnityEngine.GameObject {
        let line: UnityEngine.GameObject;
        if (this.linePool.length > 0) {
            line = this.linePool.pop();
        } else {
            line = UnityEngine.UnityObject.Instantiate(this.lineClone, this.content.transform, false) as UnityEngine.GameObject;
        }
        line.SetActive(true);
        this.lines.push(line);

        line.transform.SetSiblingIndex(this.contentIndex);
        this.contentIndex++;
        return line;
    }


    reset() {

        //带背景的文字
        for (let i: number = this.bgTextlines.length - 1; i >= 0; i--) {
            this.bgTextlines[i].SetActive(false);
            this.bgTextlinePool.push(this.bgTextlines[i]);
        }
        this.bgTextlines.length = 0;

        for (let i: number = this.thingLists.length - 1; i >= 0; i--) {
            this.thingLists[i].SetActive(false);
            this.thingListPool.push(this.thingLists[i]);
        }
        this.thingLists.length = 0;

        for (let i: number = this.lines.length - 1; i >= 0; i--) {
            this.lines[i].SetActive(false);
            this.linePool.push(this.lines[i]);
        }
        this.lines.length = 0;

    }

}



export class StrategyView extends CommonForm {
    private mask: UnityEngine.GameObject;
    private btnClose: UnityEngine.GameObject;
    private textRule: UnityEngine.UI.Text;
    private openContent: string;
    private strategyRewardItem: StrategyRewardItem;

    private conentElems: UiElements;

    private config: GameConfig.SceneConfigM;

    constructor() {
        super(0);
    }
    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.StrategyView;
    }
    protected initElements(): void {
        this.mask = this.elems.getElement("mask");
        this.btnClose = this.elems.getElement('btnClose');
        this.textRule = this.elems.getText('textRule');

        this.conentElems = this.elems.getUiElements("scroll");
        this.strategyRewardItem = new StrategyRewardItem();
        this.strategyRewardItem.setElems(this.conentElems, this.elems.getElement("scroll"));
    }
    protected initListeners(): void {
        this.addClickListener(this.mask, this.onClickBtnClose);
        this.addClickListener(this.btnClose, this.onClickBtnClose);
    }

    protected onOpen() {
      //  this.textRule.text = this.openContent;
        this.strategyRewardItem.updateView(this.config );
    }

    protected onClose() {
    }


   

    open(config: GameConfig.SceneConfigM) {
       // this.openContent = RegExpUtil.xlsDesc2Html(config.m_szStrategy);
        this.config = config;

        //uts.log(this.config);

        super.open();
    }

    private onClickBtnClose() {
        this.close();
    }

    onRightInfoChanged() {
        this.strategyRewardItem.updateView(this.config);
    }

  

}