import { Global as G } from 'System/global'
import { ConfirmCheck } from 'System/tip/TipManager'
import { Constants } from 'System/constants/Constants'
import { LangData } from 'System/data/LangData'
import { Color } from 'System/utils/ColorUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { ElemFinder } from 'System/uilib/UiUtility'


export class GuildPvpRuleView extends CommonForm {

  

    private btnClose: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;
 
    private objContent: UnityEngine.GameObject;

  
    private txtContents: UnityEngine.UI.Text[] = [];

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.GuildPvpRuleView;
    }

    protected initElements() {
        this.btnClose = this.elems.getElement("btnClose");
        this.mask = this.elems.getElement("mask");
        this.objContent = this.elems.getElement("objContent");
        for (let i = 0; i < 7; i++) {
            this.txtContents.push(this.elems.getText('txtContent' + i));
        }
    }

    protected initListeners() {
        this.addClickListener(this.btnClose, this.onBtnClose);
        this.addClickListener(this.mask, this.onBtnClose);
    }

    protected onOpen() {
      
        this.initContents();
    }

    protected onClose() {

    }

    private onBtnClose() {
        this.close();
    }

   

    private initContents(): void {
        let strList: number[];
        let text: string;
        if (G.SyncTime.getDateAfterStartServer() > Constants.CORSS_GUILD_PVP_START_DAY) {
            strList = [254, 255, 256, 257, 258, 259, 260];
        }
        else {
            strList = [45, 46, 47, 48, 49, 50, 51];
        }
        for (let i: number = 0; i < strList.length; i++) {        
            text = G.DataMgr.langData.getLang(strList[i]);
            this.txtContents[i].text = text;
        }
    }
}
