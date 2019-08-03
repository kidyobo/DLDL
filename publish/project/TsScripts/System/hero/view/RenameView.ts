import { Global as G } from 'System/global'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { GameParas } from 'System/data/GameParas'
import { ChannelClean } from 'System/chat/ChannelClean'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { ReportType } from 'System/channel/ChannelDef'
import { GameIdDef } from 'System/channel/GameIdDef'
import { ProtocolUtil } from "System/protocol/ProtocolUtil";

//该面板为其他子面板的父面板
export class RenameView extends CommonForm {

    private btnReturn: UnityEngine.GameObject;
    private btnCancel: UnityEngine.GameObject;
    private btnOk: UnityEngine.GameObject;


    private openTabId: number = 0;
    private subClass: number = 0;

    private text: UnityEngine.UI.Text;
    private inputText: UnityEngine.UI.InputField;

    private callback: (state: MessageBoxConst, isCheckSelected: boolean) => void = null;
    private name: string = "";
    constructor() {
        super(18);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.RenameView;
    }

    protected initElements(): void {
        this.btnReturn = this.elems.getElement("btnX");
        this.btnCancel = this.elems.getElement("btnCancel");
        this.btnOk = this.elems.getElement("btnConfirm");

        this.inputText = this.elems.getInputField("inputText");
        this.text = this.elems.getText("ruleText");
    }

    protected initListeners(): void {
        super.initListeners();
        this.addClickListener(this.btnReturn, this.onBtnReturn);
        this.addClickListener(this.btnCancel, this.onBtnReturn);

        this.addClickListener(this.btnOk, this.onBtnOk);

        
    }


    /**
     * 
     * @param tabId
     * @param subclass -1 表示查看别人信息，只显示信息，其他页隐藏
     */
    open() {
        super.open();
    }

    protected onOpen() {
      
    }

    protected onClose() {
       
       
    }
    
    /**
     * 关闭返回按钮
     */
    private onBtnReturn(): void {
        this.close();
    }

    private onBtnOk(): void {
        let roleName: string = this.inputText.text;

        roleName = RegExpUtil.getKeyBoardEnterStr(roleName);
        roleName = RegExpUtil.removeAllBlanks(roleName);
        let invalidTip: string;

        if (0 == roleName.length) {
            invalidTip = '请输入名字';
        } else {
            let resLen: number = this.getNameLength(roleName);  //取得输入名字的字节数，进行判断
            //超过6个中文或者12个英文
            if (resLen > 12) {
                invalidTip = '名字请勿超过6个字符';
            } else if (resLen <= 2) {
                invalidTip = '名字需包含至少2个字符';
            } else if (ChannelClean.isInvalidRoleName(roleName)) {
                invalidTip = '名字中包含非法字符';
            }
        }

        if (null != invalidTip) {
            G.TipMgr.showConfirm(invalidTip, ConfirmCheck.noCheck, '确定', this.callback);
        } else {
            this.name = roleName;
            G.TipMgr.showConfirm(uts.format("{0}\n是否确认修改角色名", roleName), ConfirmCheck.noCheck, "确认|取消", delegate(this, this._onRenameConfirm));
        }
    }

    /**
    *获取名字的字节数
    * @param name
    * @return
    */
    private getNameLength(name: string): number {
        //charCodeAt() 方法可返回指定位置的字符的 Unicode 编码。这个返回值是 0 - 65535 之间的整数。
        let len: number = 0;
        for (let i: number = 0; i < name.length; i++) {
            len += name.charCodeAt(i) > 255 ? 2 : 1;
        }
        return len;
    }

    private _onRenameConfirm(state: MessageBoxConst, isCheckSelected: boolean, isFree: number): void {
        if (state == MessageBoxConst.yes) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getRenameRequest(this.name));
        }
    }
}
export default RenameView;