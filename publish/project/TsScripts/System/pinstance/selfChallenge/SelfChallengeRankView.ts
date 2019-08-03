import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { List } from 'System/uilib/List'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { ElemFinder } from 'System/uilib/UiUtility'


export class RankListItemData {
    roleName: string;
    rank: number;
    value: number;
}



/**排行对话框。*/
export class SelfChallengeRankView extends CommonForm {

    private rankData: RankListItemData[] = [];
    /**排名列表*/
    private rankList: List = null;

    /**我的排名内容*/
    private myRank: string = "";
    /**我的排名文本显示*/
    private txtMyRank: UnityEngine.UI.Text;
    /**标题的名字*/
    private strOneLevelTitle: string = "";
    /**标题文本*/
    private titleText: UnityEngine.UI.Text;
    /**二级标题名字*/
    private strTwoLevelTitle: string = "";
    /**二级标题文本*/
    private twoLevelTitleText: UnityEngine.UI.Text;


    constructor() {
        super(0);
    }

    /**需要传入参数,oneLevelTitle:一级标题,twoLevelTitle:二级标题,rankData:数据,strMyRank:我的排名信息*/
    open(oneLevelTitle: string, twoLevelTitle: string, rankData: RankListItemData[], strMyRank: string) {
        this.strOneLevelTitle = oneLevelTitle;
        this.strTwoLevelTitle = twoLevelTitle;
        this.rankData = rankData;
        this.myRank = strMyRank;       
        super.open();
    }

    protected onOpen() {
        this.titleText.text = this.strOneLevelTitle;
        this.twoLevelTitleText.text = this.strTwoLevelTitle;
        this.txtMyRank.text = this.myRank;
        let length = this.rankData.length;
        this.rankList.Count = length;
        for (let i = 0; i < length; i++) {
            let item = this.rankList.GetItem(i).gameObject;
            let rankItem = new RankItem();
            rankItem.setComponents(item);
            rankItem.update(this.rankData[i], i);
        }    
    }

    protected onClose() {
     
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.SelfChallengeRankView;
    }

    protected initElements(): void {
        this.rankList = this.elems.getUIList('rankList');
        this.txtMyRank = this.elems.getText('txtMyRank');
        this.titleText = this.elems.getText('txtRankTitle');
        this.twoLevelTitleText = this.elems.getText("twoTitle");    
    }

    protected initListeners(): void {
        this.addClickListener(this.elems.getElement('btnClose'), this.close);
        this.addClickListener(this.elems.getElement('mask'), this.close);
    }
 

}



class RankItem {
    private txtRank: UnityEngine.UI.Text;
    private txtName: UnityEngine.UI.Text;
    private txtCeng: UnityEngine.UI.Text;
    private bg1: UnityEngine.GameObject;
    private bg2: UnityEngine.GameObject;


    setComponents(go: UnityEngine.GameObject) {
        this.txtRank = ElemFinder.findText( go,"txtRank");
        this.txtName = ElemFinder.findText(go,"txtName");
        this.txtCeng = ElemFinder.findText(go, "txtCeng");
        this.bg1 = ElemFinder.findObject(go, "bg1");
        this.bg2 = ElemFinder.findObject(go, "bg2");
    }

    update(data: RankListItemData, index: number) {
        this.txtRank.text = TextFieldUtil.getColorText(data.rank.toString(), Color.DEFAULT_WHITE);
        this.txtName.text = TextFieldUtil.getColorText(data.roleName, Color.DEFAULT_WHITE);
        this.txtCeng.text = TextFieldUtil.getColorText(data.value.toString(), Color.DEFAULT_WHITE);
        if (index % 2 == 1) {
            this.bg1.SetActive(true);
            this.bg2.SetActive(false);
        } else {
            this.bg1.SetActive(false);
            this.bg2.SetActive(true);
        }
    }
}