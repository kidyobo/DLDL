import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { List } from 'System/uilib/List'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { JstzItemData } from 'System/data/JstzItemData'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ElemFinder } from 'System/uilib/UiUtility'
import { IconItem } from 'System/uilib/IconItem'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { TipFrom } from 'System/tip/view/TipsView'/**极速挑战排行对话框。*/
export class JiSuTiaoZhanRankView extends CommonForm {

    private btnClose: UnityEngine.GameObject;

    /**排行榜的数据*/
    private rankData: JstzItemData[] = [];
    /**排名列表*/
    private rankList: List = null;
    /**我的排名内容*/
    private myRank: string = null;
    /**我的通关时间*/
    private myTime: string = null;
    /**排行榜的数量*/
    private rankCount: number = 0;

    /**我的排名文本显示*/
    private txtMyRank: UnityEngine.UI.Text = null;
    /**我的排名文本显示*/
    private txtMyTime: UnityEngine.UI.Text = null;

    private listItems: JSTZRankItem[] = [];
    private itemIcon_Normal: UnityEngine.GameObject;

    constructor() {
        super(0);
    }

    open(rankData: JstzItemData[], myRank: string, myTime: string, rankCount: number) {
        this.rankData = rankData;
        this.myRank = myRank;
        this.myTime = myTime;
        this.rankCount = rankCount;
        super.open();
    }
    protected onOpen() {
        this.updateView();      
    }

    protected onClose() {
    }
    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.JiSuTiaoZhanRankView;
    }
    protected initElements(): void {
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.btnClose = this.elems.getElement('btnClose');
        this.rankList = this.elems.getUIList('rankList'); 
        this.txtMyRank = this.elems.getText('txtMyRank');
        this.txtMyTime = this.elems.getText('txtMyTime');
    }
    protected initListeners(): void {
        this.addClickListener(this.btnClose, this.onClickReturnBtn);
        this.addClickListener(this.elems.getElement('mask'), this.onClickReturnBtn);
    }

    private onClickReturnBtn() {
        this.close();
    }


    private updateView() {
        this.txtMyRank.text ="我的排名:"+ this.myRank;
        this.txtMyTime.text = "我的通关时间:" + this.myTime;
        this.rankList.Count = this.rankCount;
        for (let i = 0; i < this.rankCount; i++) {
            let item = this.rankList.GetItem(i).gameObject;
            if (this.listItems[i] == null) {
                this.listItems[i] = new JSTZRankItem();
                this.listItems[i].setComponents(item, this.itemIcon_Normal);
            }
            this.listItems[i].update(this.rankData[i], i);
        }
    }
}

class JSTZRankItem extends ListItemCtrl {
    /**排名*/
    private txtRank: UnityEngine.UI.Text;
    /**名字*/
    private txtName: UnityEngine.UI.Text;
    /**通关时间*/
    private txtTime: UnityEngine.UI.Text;
    private iconParent: UnityEngine.GameObject;
    private iconItem: IconItem = new IconItem();
    private bg1: UnityEngine.GameObject;
    private bg2: UnityEngine.GameObject;
  
    setComponents(go: UnityEngine.GameObject, icon: UnityEngine.GameObject ) {
        this.txtRank = ElemFinder.findText(go, 'txtRank');
        this.txtName = ElemFinder.findText(go, 'txtName');
        this.txtTime = ElemFinder.findText(go, 'txtTime');
        this.bg1 = ElemFinder.findObject(go, 'bg1');
        this.bg2 = ElemFinder.findObject(go, 'bg2');
        this.iconParent = ElemFinder.findObject(go, 'icon');
        this.iconItem.setUsualIconByPrefab(icon, this.iconParent);
        this.iconItem.setTipFrom(TipFrom.normal);

    }

    update(vo: JstzItemData, index: number) {
        let data: JstzItemData = vo;
        this.txtRank.text = data.rank.toString();
        this.txtName.text = data.roleName;
        if (data.roleID != null) {
            this.txtTime.text = TextFieldUtil.getColorText(DataFormatter.second2hhmmss(data.time), data.isHero ? Color.GREEN : Color.DEFAULT_WHITE);           
        }
        else {
            this.txtTime.text =TextFieldUtil.getColorText('00:00:00', Color.GREY);         
        }
        let cfg: GameConfig.JSTZRankM = data.cfg;
        this.iconItem.updateById(cfg.m_stItemList[0].m_iID, cfg.m_stItemList[0].m_iCount);
        this.iconItem.updateIcon();          
        if (index % 2 == 1) {
            this.bg1.SetActive(true);
            this.bg2.SetActive(false);
        } else {
            this.bg1.SetActive(false);
            this.bg2.SetActive(true);
        }   
    }   
}