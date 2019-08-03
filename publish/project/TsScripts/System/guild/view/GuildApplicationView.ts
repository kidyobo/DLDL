import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { UiElements } from 'System/uilib/UiElements'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'

class GuildApplicationItem {
    /**名字*/
    private textName: UnityEngine.UI.Text;
    /**等级*/
    private textLv: UnityEngine.UI.Text;
    /**战斗力*/
    private textZdl: UnityEngine.UI.Text;
    /**职业*/
    private textProf: UnityEngine.UI.Text;

    private imgBoy: UnityEngine.GameObject;
    private imgGirl: UnityEngine.GameObject;

    private btnOk: UnityEngine.GameObject;
    private btnNo: UnityEngine.GameObject;

    private vo: Protocol.GuildApplicantInfo;

    private bg1: UnityEngine.GameObject;
    private bg2: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.textName = ElemFinder.findText(go, 'textName');
        this.textLv = ElemFinder.findText(go, 'textLv');
        this.textZdl = ElemFinder.findText(go, 'textZdl');
        this.textProf = ElemFinder.findText(go, 'textProf');

        this.imgBoy = ElemFinder.findObject(go, 'gender/boy');
        this.imgGirl = ElemFinder.findObject(go, 'gender/girl');

        this.bg1 = ElemFinder.findObject(go, "bg1");
        this.bg2 = ElemFinder.findObject(go, "bg2");

        this.btnOk = ElemFinder.findObject(go, 'btnOk');
        this.btnNo = ElemFinder.findObject(go, 'btnNo');

        Game.UIClickListener.Get(this.btnOk).onClick = delegate(this, this.onClickBtnOk);
        Game.UIClickListener.Get(this.btnNo).onClick = delegate(this, this.onClickBtnNo);
    }

    update(info: Protocol.GuildApplicantInfo, index: number) {
        this.vo = info;

        this.textName.text = info.m_szNickName;
        this.textLv.text = info.m_usRoleLevel.toString();
        this.textZdl.text = info.m_iStrength.toString();
        this.textProf.text = KeyWord.getDesc(KeyWord.GROUP_GENDERTYPE, info.m_cProfession);

        if (KeyWord.GENDERTYPE_BOY == info.m_chGender) {
            this.imgBoy.SetActive(true);
            this.imgGirl.SetActive(false);
        } else {
            this.imgBoy.SetActive(false);
            this.imgGirl.SetActive(true);
        }

        this.bg1.SetActive(index % 2 == 0);
        this.bg2.SetActive(index % 2 == 1);
      
    }

    private onClickBtnOk() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildApproveApplicantList(Macros.GUILD_OPERATION_AGREE, [this.vo]));
    }

    private onClickBtnNo() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildApproveApplicantList(Macros.GUILD_OPERATION_REFUSE, [this.vo]));
    }
}

export class GuildApplicationView extends CommonForm {

    private btnClose: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;
    private list: List;
    private items: GuildApplicationItem[] = [];

    private btnAllOk: UnityEngine.GameObject;
    private btnAllNo: UnityEngine.GameObject;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.GuildApplicationView;
    }

    protected initElements() {
        this.btnClose = this.elems.getElement('btnClose');
        this.list = this.elems.getUIList('list');
        this.btnAllOk = this.elems.getElement('btnAllOk');
        this.btnAllNo = this.elems.getElement('btnAllNo');
        this.mask = this.elems.getElement("mask");

    }

    protected initListeners() {
        this.addClickListener(this.btnClose, this.onClickBtnClose);
        this.addClickListener(this.mask, this.onClickBtnClose);
        this.addClickListener(this.btnAllOk, this.onClickBtnAllOk);
        this.addClickListener(this.btnAllNo, this.onClickBtnAllNo);
    }

    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.fetchApplicantListRequest());
    }

    protected onClose() {
    }

    onApplicationChanged(): void {
        let listData = G.DataMgr.guildData.applicationInfoList;
        let cnt = 0;
        if (null != listData) {
            cnt = listData.length;
        }

        this.list.Count = cnt;
        let oldItemCnt = this.items.length;
        for (let i = 0; i < cnt; i++) {
            let item: GuildApplicationItem;
            if (i < oldItemCnt) {
                item = this.items[i];
            } else {
                this.items.push(item = new GuildApplicationItem());
                item.setComponents(this.list.GetItem(i).gameObject);
            }
            item.update(listData[i],i);
        }

        if (cnt <= 0) {
            UIUtils.setButtonClickAble(this.btnAllOk, false);
            UIUtils.setButtonClickAble(this.btnAllNo, false);
        }
        else {
            UIUtils.setButtonClickAble(this.btnAllOk, true);
            UIUtils.setButtonClickAble(this.btnAllNo, true);
        }
    }

    private onClickBtnAllOk() {
        let listData = G.DataMgr.guildData.applicationInfoList;
        if (null != listData && listData.length > 0) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildApproveApplicantList(Macros.GUILD_OPERATION_AGREE, listData));
        }
    }

    private onClickBtnAllNo() {
        let listData = G.DataMgr.guildData.applicationInfoList;
        if (null != listData && listData.length > 0) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildApproveApplicantList(Macros.GUILD_OPERATION_REFUSE, listData));
        }
    }

    private onClickBtnClose() {
        this.close();
    }
}