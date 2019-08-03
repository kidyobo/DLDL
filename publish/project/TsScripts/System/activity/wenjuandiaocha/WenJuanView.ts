import { FixedList } from 'System/uilib/FixedList';
import { ElemFinder } from 'System/uilib/UiUtility';
import { IconItem } from 'System/uilib/IconItem';
import { Global as G } from 'System/global'
import { GameObjectGetSet, TextGetSet } from "System/uilib/CommonForm";
import { KeyWord } from "System/constants/KeyWord";
import { UIPathData } from "System/data/UIPathData";
import { TabSubForm } from "System/uilib/TabForm";
import { List, ListItem } from 'System/uilib/List'
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { Macros } from "System/protocol/Macros";
import { ElemFinderMySelf } from 'System/uilib/UiUtility'

/**问卷调查 */
export class WenJuanView extends TabSubForm {
   private icon:GameObjectGetSet;
   private itemIcon_Normal:GameObjectGetSet;
   /**提交 */
   private btnMention:GameObjectGetSet;
   private config:GameConfig.SurveyCfgM;
   private titleList:List;
   private wenjuanitems: wenjuanItem[] = [];
   protected initElements(){
        this.icon = new GameObjectGetSet(this.elems.getElement('icon'));
        this.itemIcon_Normal = new GameObjectGetSet(this.elems.getElement('itemIcon_Normal'));
        this.btnMention = new GameObjectGetSet(this.elems.getElement('btnMention'));
        this.titleList = this.elems.getUIList('titleList');
        this.titleList.Count = 12;
   }
    protected initListeners() {
      this.addClickListener(this.btnMention.gameObject,this.onClickMention);
    }
    constructor() {
        super(KeyWord.ACT_FUNCTION_WENJUAN);
    }

    protected resPath(): string {
        return UIPathData.wenjuanView;
    }
    protected onOpen(){
        this.updateView();
    }
    protected onClose(){
        G.DataMgr.wenjuanData.clearAllAnswer();
    }
    updateView(){
        if(G.DataMgr.wenjuanData.isSelectAllTitle()){
            this.close();
        }
        for (let i = 0; i < this.titleList.Count; i++) {
            this.wenjuanitems[i] = new wenjuanItem();
            let obj = this.titleList.GetItem(i);
            this.wenjuanitems[i].setUsual(obj.gameObject);
            this.config = G.DataMgr.wenjuanData.getDatiConfig(i+1);
            this.wenjuanitems[i].update(this.config,i);
        }
       
    }
    private onClickMention(){
        let allAnswer = G.DataMgr.wenjuanData.getAllAnswer();
        if(G.DataMgr.wenjuanData.isSelectAllTitle()){
            for (let i = 0; i < G.DataMgr.wenjuanData.maxNum; i++) {
                let config = G.DataMgr.wenjuanData.getDatiConfig(i + 1);
                if (allAnswer[config.m_iID-1] == null) {
                    G.TipMgr.addMainFloatTip(uts.format("您第{0}题尚未回答！",config.m_iID));
                    return;
                }
            }
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOpenWenJuanRequest(allAnswer,allAnswer.length));
        }else{
            G.TipMgr.addMainFloatTip(uts.format("您第{0}题尚未回答！",(G.DataMgr.wenjuanData.getNoSelectTitle().toString())));
        }
    }  

}

class wenjuanItem{
    //你是从那些渠道接触到《斗罗大陆》？动画 小说 漫画answerList circle square
    private answerList: GameObjectGetSet;
    private title: TextGetSet;
    // private optionNum:string[]=[];
    private multiItems:UnityEngine.GameObject[]=[];
    private multiSelect:GameObjectGetSet;
    private singleSelect:UnityEngine.GameObject;
    private singleList:FixedList;
    setUsual(go: UnityEngine.GameObject) {
        this.title = new TextGetSet(ElemFinder.findText(go, 'title'));
        this.answerList = new GameObjectGetSet(ElemFinder.findObject(go, 'answerList'));
        this.singleSelect = ElemFinder.findObject(this.answerList.gameObject, 'singleSelect'); 
        this.multiSelect = new GameObjectGetSet(ElemFinder.findObject(this.answerList.gameObject, 'multiSelect')); 
        for (let i = 1; i < 5; i++) {
            let answerItem = new GameObjectGetSet(ElemFinder.findObject(this.multiSelect.gameObject, i.toString()));
            this.multiItems.push(answerItem.gameObject);
        }
        //单选list
        this.singleList = ElemFinder.getUIFixedList(this.singleSelect);

    }
    update(config: GameConfig.SurveyCfgM, index: number) {
        if (config.m_iCondition1 == 2) {
            this.title.text = uts.format('{0}.{1}{2}',(index+1).toString(),config.m_szCondition2,'(多选)');
            this.multiSelect.SetActive(true);
            this.singleSelect.SetActive(false);
            this.updatemulti(config);
        } else {
            this.title.text = uts.format('{0}.{1}{2}',(index+1).toString(),config.m_szCondition2,'(单选)');
            this.multiSelect.SetActive(false);
            this.singleSelect.SetActive(true);
            this.updateSingle(config);
        }
       
     
    }
    /**单选 */
    private updateSingle(config: GameConfig.SurveyCfgM) {
        if (config.m_szOption2 == "") {
            this.singleList.GetItem(1).gameObject.SetActive(false);
        }
        if (config.m_szOption3 == "") {
            this.singleList.GetItem(2).gameObject.SetActive(false);
        }
        if (config.m_szOption4 == "") {
            this.singleList.GetItem(3).gameObject.SetActive(false);
        }
        this.singleList.onClickItem = delegate(this, this.onClickSingleItem,config);
        for (let i = 0; i < 4; i++) {
            let items = this.singleList.GetItem(i);
            if(items.gameObject.activeInHierarchy){
                let answardText = new TextGetSet(ElemFinder.findText(items.gameObject, 'Text'));
                switch (i) {
                    case 0:
                        answardText.text = config.m_szOption1;
                        break;
                    case 1:
                        answardText.text = config.m_szOption2;
                        break;
                    case 2:
                        answardText.text = config.m_szOption3;
                        break;
                    case 3:
                        answardText.text = config.m_szOption4;
                        break;
                    default:
                        break;
                }
            }
            
        }
    }

    /**多选 */
    private updatemulti(config: GameConfig.SurveyCfgM){
        if (config.m_szOption2 == "") {
            this.multiItems[1].gameObject.SetActive(false);
        }
        if (config.m_szOption3 == "") {
            this.multiItems[2].gameObject.SetActive(false);
        }
        if (config.m_szOption4 == "") {
            this.multiItems[3].gameObject.SetActive(false);
        }
       for (let i = 0; i < 4; i++) {
           let items = this.multiItems[i];
          
        if(items.activeInHierarchy){
            let multiText = new TextGetSet(ElemFinder.findText(this.multiItems[i], 'Text'));
            let checkmark = ElemFinder.findObject(this.multiSelect.gameObject, i + 1 + "/Checkmark")

            Game.UIClickListener.Get(this.multiItems[i].gameObject).onClick = delegate(this, this.onClickMultiItem, config, i);
            
            switch (i) {
                case 0:
                    multiText.text = config.m_szOption1;
                    break;
                case 1:
                    multiText.text = config.m_szOption2;
                    break;
                case 2:
                    multiText.text = config.m_szOption3;
                    break;
                case 3:
                    multiText.text = config.m_szOption4;
                    break;
                default:
                    break;
            }
        }
    }
    }
    /**点击item */
    private onClickSingleItem(index:number,config:GameConfig.SurveyCfgM) {
        G.DataMgr.wenjuanData.setAnswer(config.m_iID - 1, config.m_iID, 1, [index+1]);
    }
    private indexs:number[]=[0,0,0,0];
    private oldConfig: GameConfig.SurveyCfgM;
    private onClickMultiItem(config: GameConfig.SurveyCfgM, index: number) {
        let allAnswer: Protocol.SurveyAnswer[] = G.DataMgr.wenjuanData.getAllAnswer();
        //下面这个 判断是否换了题目
        if (this.oldConfig != config) {
            if (allAnswer[config.m_iID - 1])
            this.indexs = allAnswer[config.m_iID - 1].m_aiChooseID;
            this.oldConfig = config;
        }
        //如果点了取消勾选
        if (allAnswer[config.m_iID - 1] && allAnswer[config.m_iID - 1].m_aiChooseID && allAnswer[config.m_iID - 1].m_aiChooseID[index] > 0) {
            allAnswer[config.m_iID - 1].m_aiChooseID[index] = 0;
            let num = 0;
            let len = allAnswer[config.m_iID - 1].m_aiChooseID.length;
            for (let i = 0; i < len;i++) {
                if (allAnswer[config.m_iID - 1].m_aiChooseID[i] == 0) {
                    num++;
                }
            }
            if (num == 4) {
                allAnswer[config.m_iID - 1] = null;
            }
        } else {////如果点了勾选
            this.indexs[index] = index + 1;
            G.DataMgr.wenjuanData.setAnswer(config.m_iID - 1, config.m_iID, 4, this.indexs);
        }
    }
}