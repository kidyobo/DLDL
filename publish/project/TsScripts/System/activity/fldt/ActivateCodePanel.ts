import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { UiElements } from 'System/uilib/UiElements'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { IconItem } from 'System/uilib/IconItem'
import { ElemFinder } from 'System/uilib/UiUtility'
import { TipFrom } from 'System/tip/view/TipsView'
import { UIUtils } from 'System/utils/UIUtils'


export class ActivateCodePanel extends TabSubForm {

    private static readonly CODE_LEN: number = 8;
    private input: UnityEngine.UI.InputField;
    private btnGetReward: UnityEngine.GameObject;
    //西游平台相关
    private customPanel: UnityEngine.GameObject;
    private iconRoot: UnityEngine.GameObject;
    private iconItemNormal: UnityEngine.GameObject;
    private cusTomQQText: UnityEngine.UI.Text;
    private btn_xiyouGetReward: UnityEngine.GameObject;
    private btnText: UnityEngine.UI.Text;
    private readonly itemId: number = 10218011;
    private readonly itemNum: number = 2;
    private iconItem: IconItem;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_JHMDH);
    }

    protected resPath(): string {
        return UIPathData.ActivateCodeView;
    }

    protected initElements() {
        this.input = this.elems.getInputField('input');
        this.input.characterLimit = ActivateCodePanel.CODE_LEN;
        this.input.characterValidation = UnityEngine.UI.InputField.CharacterValidation.Alphanumeric;
        this.btnGetReward = this.elems.getElement('btnGetReward');
        //西游相关
        this.customPanel = this.elems.getElement('xiyouPanel');
        this.iconRoot = ElemFinder.findObject(this.customPanel, 'iconRoot');
        this.iconItemNormal = this.elems.getElement('itemIcon_Normal');
        this.cusTomQQText = ElemFinder.findText(this.customPanel, 'xiYouCustomText');
        this.btn_xiyouGetReward = ElemFinder.findObject(this.customPanel, 'btn_get');
        this.btnText = ElemFinder.findText(this.btn_xiyouGetReward, 'Text');
        this.iconItem = new IconItem();
        this.iconItem.setUsualIconByPrefab(this.iconItemNormal, this.iconRoot);
        this.iconItem.setTipFrom(TipFrom.normal);
        this.iconItem.updateById(this.itemId, this.itemNum);
        this.iconItem.updateIcon();
    }

    protected initListeners() {
        this.addClickListener(this.btnGetReward, this.onClickBtnReward);
        this.addClickListener(this.btn_xiyouGetReward, this.onClickBtnXiYouGetReward);
    }

    protected onOpen() {
        if (G.needShowCustomQQ) {
            this.customPanel.SetActive(true);
            this.cusTomQQText.text = G.DataMgr.systemData.getCustomQQStr(G.AppCfg.Plat, G.ChannelSDK.ChannelID);
            this.updateBtnStage();
        } else {
            this.customPanel.SetActive(false);
        }
    }

    protected onClose() {
    }

    private onClickBtnReward() {
        let codeStr = this.input.text;
        if (ActivateCodePanel.CODE_LEN != codeStr.length) {
            G.TipMgr.addMainFloatTip(uts.format('激活码为8位数字或字母，请重新输入', ActivateCodePanel.CODE_LEN));
            return;
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCDKeyExchangeRequest(Macros.CDKEY_OPERATE_EXCHANGE, codeStr));
    }


    /////////////////////西游qq客服相关////////////////////////////
    updateBtnStage() {
        if (0 == (G.DataMgr.systemData.dayOperateBits & Macros.DAY_QQ_SERVICE)) {
            UIUtils.setButtonClickAble(this.btn_xiyouGetReward, true);
            this.btnText.text = '领取';
        } else {
            UIUtils.setButtonClickAble(this.btn_xiyouGetReward, false);
            this.btnText.text = '已领取';
        }
    }

    private onClickBtnXiYouGetReward() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDailyOperateRequest(Macros.DAY_QQ_SERVICE));
    }


}