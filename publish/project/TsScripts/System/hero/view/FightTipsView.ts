import { ListItem } from 'System/uilib/List';
import { TipFrom } from '../../tip/view/TipsView';
import { Macros } from 'System/protocol/Macros';
import { HeroView } from './HeroView';
import { List } from '../../uilib/List';
import { KeyWord } from 'System/constants/KeyWord';
import { UILayer, TextGetSet, GameObjectGetSet } from '../../uilib/CommonForm';
import { UIPathData } from '../../data/UIPathData';
import { TabSubForm } from 'System/uilib/TabForm';
import { ElemFinder } from '../../uilib/UiUtility';
import { IconItem } from '../../uilib/IconItem';
import { Global as G } from "System/global"
import { RewardIconItemData } from '../../data/vo/RewardIconItemData';

export class FightTipsView extends TabSubForm {
    private list:List;
    private heroView:HeroView;
    private itemIcon:GameObjectGetSet;
    private dataList:GameConfig.FightPointGuideConfigM[];
    constructor() {
        super(KeyWord.OTHER_FUNCTION_FIGHTPOINT_TIPS);
        this._cacheForm = true;
    }
    protected resPath(): string {
        return UIPathData.FightTipView;
    }
 
    protected initElements() {
       this.itemIcon = new GameObjectGetSet(this.elems.getElement('itemIcon_Normal'));
       this.list = this.elems.getUIList('list');
       this.list.onVirtualItemChange = delegate(this, this.onItemUpdate);
    }
    protected initListeners() {

    }
    updatePanel(){
        this.dataList = G.DataMgr.fightTipData.filterCfg;
        let fight = G.DataMgr.heroData.getProperty(Macros.EUAI_FIGHT);
        if (this.heroView != null) {
            //总战力
            this.heroView.setTxtFight(fight);
        }
        this.list.Count = this.dataList.length;
        this.dataList.sort(delegate(this, this.sortByCfgSortId));
        this.list.ScrollTop();
    }
    private onItemUpdate(item: ListItem) {
        let cfg = this.dataList[item._index];
        let data = item.data.data as FightItem;
        if (data==null) {
            data = item.data.data = new FightItem();
            data.setComponents(item.gameObject, this.itemIcon.gameObject);
        }
        data.update(cfg);
    }
    protected onOpen() {
        this.heroView = G.Uimgr.getForm<HeroView>(HeroView);
        if (this.heroView != null) {
            this.heroView.showFight(true);
        }
        this.updatePanel();
    }
    protected onClose() {
        if (this.heroView != null) {
            this.heroView.showFight(false);
        }
        G.MainBtnCtrl.update(true);
    }
    private sortByCfgSortId(a: GameConfig.FightPointGuideConfigM, b: GameConfig.FightPointGuideConfigM) {
        return a.m_ucDisplayOrder - b.m_ucDisplayOrder;
    }
}
 class FightItem {
    private name: TextGetSet;
    private desc: TextGetSet;
    private btnGo: GameObjectGetSet;
    private btnGet: GameObjectGetSet;
    private icon:UnityEngine.UI.Image;
    private rewardIcon:GameObjectGetSet[] = [];
    private config:GameConfig.FightPointGuideConfigM;
    private lightStars: UnityEngine.GameObject[] = [];
    private itemIcon:IconItem[]=[];
    private myRewardListData: RewardIconItemData[] = [];
    private rewardCount:number = 2;
    private readonly starCount: number = 10;
     setComponents(go: UnityEngine.GameObject,itemIcon:UnityEngine.GameObject) {
        this.name = new TextGetSet(ElemFinder.findText(go, 'name'));
        this.desc = new TextGetSet(ElemFinder.findText(go, 'desc'));
        this.btnGo = new GameObjectGetSet(ElemFinder.findObject(go, 'btnGo'));
        this.btnGet = new GameObjectGetSet(ElemFinder.findObject(go, 'btnGet'));
        this.icon = ElemFinder.findImage(go,'bg/icon');
        for (let i: number = 0; i < this.rewardCount; i++) {
            let iconRoot = ElemFinder.findObject(go, uts.format('rewardList/{0}', i));
            let iconItem = new IconItem();
            iconItem.setTipFrom(TipFrom.normal);
            this.itemIcon.push(iconItem);
            iconItem.setUsualIconByPrefab(itemIcon, iconRoot);
            this.rewardIcon.push(new GameObjectGetSet(iconRoot));
        }
         // 星星
         for (let i: number = 0; i < this.starCount / 2; i++) {
            let starGo = ElemFinder.findObject(go,uts.format('stars/star{0}',i));
            this.lightStars.push(ElemFinder.findObject(starGo, 'star/half'));
            this.lightStars.push(ElemFinder.findObject(starGo, 'star/light'));
        }
        Game.UIClickListener.Get(this.btnGo.gameObject).onClick = delegate(this, this.onClickBtnGo);
        Game.UIClickListener.Get(this.btnGet.gameObject).onClick = delegate(this, this.onClikBtnGet);
    }
    update(cfg: GameConfig.FightPointGuideConfigM) {
        this.config = cfg;
        this.name.text = this.config.m_szName;
        this.desc.text = this.config.m_szText;
        this.btnGet.SetActive(false);
        this.btnGo.SetActive(this.config.m_iGoto != 0)
        this.myRewardListData = RewardIconItemData.formatVector(this.rewardCount, this.myRewardListData);
        for (let i = 0; i < this.rewardCount; i++) {
            if (cfg.m_stItemList[i] != null) {
                this.rewardIcon[i].SetActive(true);
                let iconItem = this.itemIcon[i];
                let itemData = this.myRewardListData[i];
                itemData.id = this.config.m_stItemList[i].m_iId;
                iconItem.updateByRewardIconData(itemData);
                iconItem.updateIcon();
            }else{
                this.rewardIcon[i].SetActive(false);
            }
        }
        let sprite = G.AltasManager.getActIcon(this.config.m_iKeyword);
        if (null == sprite) {
            // 看看父功能有木有图标
            let funcCfg = G.DataMgr.funcLimitData.getFuncLimitConfig(this.config.m_iKeyword);
            if (funcCfg.m_iParentName > 0) {
                if (funcCfg.m_iParentName > 0) {
                    if (funcCfg.m_iParentName == 541) {//boss大图标的话,要换成bossFuncIcon
                        sprite = G.AltasManager.getActIconByName("bossFuncIcon");
                    } else {
                        sprite = G.AltasManager.getActIcon(funcCfg.m_iParentName);
                    }
                }
            }
        }
        this.icon.sprite = sprite;

        //星星
        let level = 0;
        if (this.config.m_iStarLevel == 10) {
            level = 10;
        }
        else {
            level = this.config.m_iStarLevel % 10;
        }
        for (let i: number = 0; i < this.starCount; i++) {
            if (i < level) {
                this.lightStars[i].SetActive(true);
            }
            else {
                this.lightStars[i].SetActive(false);
            }
        }
    }
    private onClickBtnGo(){
        G.ActionHandler.executeFunction(this.config.m_iGoto);
    }
    private onClikBtnGet(){

    }
}