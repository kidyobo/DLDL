import { Global as G } from 'System/global'
import { UILayer } from 'System/uilib/CommonForm'
import { TabSubForm } from 'System/uilib/TabForm'
import { UIPathData } from 'System/data/UIPathData'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { ChannelClean } from 'System/chat/ChannelClean'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { List } from 'System/uilib/List'
import { ElemFinder } from "System/uilib/UiUtility"
import { UIUtils } from "System/utils/UIUtils"
import { MenuNodeKey, EnumGuide } from 'System/constants/GameEnum'

export class GuildListItem {
    /**排名(前三名用专用图标)*/
    private rankImage: UnityEngine.UI.Image;
    /**排名*/
    private rankText: UnityEngine.UI.Text;
    /**名称*/
    private nameText: UnityEngine.UI.Text;
    /**宗主名字*/
    private masterText: UnityEngine.UI.Text;
    /**等级*/
    private lvText: UnityEngine.UI.Text;
    /**人数*/
    private numText: UnityEngine.UI.Text;
    /**战斗力*/
    private zdlText: UnityEngine.UI.Text;

    /**深浅交替背景*/
    private bg2: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.rankImage = ElemFinder.findImage(go, 'imgRank');
        this.rankText = ElemFinder.findText(go, 'txtRank');
        this.nameText = ElemFinder.findText(go, 'txtGuildName');
        this.masterText = ElemFinder.findText(go, 'txtMaster');
        this.lvText = ElemFinder.findText(go, 'txtLv');
        this.numText = ElemFinder.findText(go, 'txtCount');
        this.zdlText = ElemFinder.findText(go, 'txtBattle');

        this.bg2 = ElemFinder.findObject(go, 'bg2');
    }

    update(rank: number, info: Protocol.GuildQueryInfo) {
        this.rankImage.gameObject.SetActive(false);

        this.bg2.SetActive(rank % 2 == 0);
        this.rankText.text = rank.toString();
        this.nameText.text = info.m_szGuildName;
        this.masterText.text = info.m_szChairmanName;
        this.lvText.text = info.m_ushGuildLevel.toString();
        this.numText.text = uts.format('{0}/{1}', info.m_ushMemberNumber, G.DataMgr.guildData.getGuildLevelConfig(info.m_ushGuildLevel).m_uchMan);
        this.zdlText.text = info.m_uiFightVal.toString();
    }
}

export class GuildEnterPanel extends TabSubForm {
    private static readonly MAX_GUILD_NAME_LENGTH = 8;

    private items: GuildListItem[] = [];
    private list: List;

    private inputName: UnityEngine.UI.InputField;
    private btnApply: UnityEngine.GameObject;
    public btnOnekey: UnityEngine.GameObject;
    private btnCreate: UnityEngine.GameObject;
    private txtLimit: UnityEngine.UI.Text;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_GUILD_ENTER);
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.GuildEnterView;
    }

    protected initElements() {
        this.list = this.elems.getUIList("list");
        this.btnApply = this.elems.getElement("btnApply");
        this.btnOnekey = this.elems.getElement("btnApplyOnekey");
        this.btnCreate = this.elems.getElement('btnCreate');
        this.inputName = this.elems.getInputField('inputName');
        this.inputName.characterLimit = GuildEnterPanel.MAX_GUILD_NAME_LENGTH;
    }

    protected initListeners() {
        this.addClickListener(this.btnApply, this.onClickBtnApply);
        this.addClickListener(this.btnOnekey, this.onClickBtnOnekey);
        this.addClickListener(this.btnCreate, this.onClickBtnCreate);
    }

    onOpen() {
        // 拉取宗门列表
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildQueryRequest(Macros.GUILD_GET_GUILD_LIST));
        this.guideSetting();
    }

    guideSetting() {
        G.GuideMgr.processGuideNext(EnumGuide.Guild, EnumGuide.Guild_OpenGuildView);
    }

    updateView() {
        let guildInfolist: Protocol.GuildQueryList = G.DataMgr.guildData.m_stGuildList;
        let myGuildID: number = G.DataMgr.heroData.guildId;
        this.list.Count = guildInfolist.m_ushNumber;
        let oldItemCnt = this.items.length;
        for (let i: number = 0; i < guildInfolist.m_ushNumber; i++) {
            let item: GuildListItem;
            if (i < oldItemCnt) {
                item = this.items[i];
            } else {
                this.items.push(item = new GuildListItem());
                item.setComponents(this.list.GetItem(i).gameObject);
            }
            if (guildInfolist.m_astGuildInfo[i] != null) {
                item.update(i + 1, guildInfolist.m_astGuildInfo[i]);
            }
        }
    }

    private onClickBtnApply() {
        let index = this.list.Selected;
        let guildInfo = G.DataMgr.guildData.m_stGuildList.m_astGuildInfo[index];
        if (guildInfo == null) {
            return;
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildJoinRequest(guildInfo.m_uiGuildID, Macros.GUILD_APPLY_CODE_APPLY));
    }

    private onClickBtnOnekey() {
        let guildInfoList: Protocol.GuildQueryList = G.DataMgr.guildData.m_stGuildList;
        if (null != guildInfoList) {
            let hasApplyNum: number = 0;
            let auiGuildIDArray: number[] = G.DataMgr.guildData.auiGuildIDArray;
            if (auiGuildIDArray) {
                hasApplyNum = auiGuildIDArray.length;
            }
            if (hasApplyNum >= Macros.MAX_GUILD_ROLE_APPLY_REQUEST_NUMBER) {
                // 超出最大申请数量
                G.TipMgr.addMainFloatTip(uts.format('你已申请了{0}个宗门，无法继续申请', Macros.MAX_GUILD_ROLE_APPLY_REQUEST_NUMBER));
                return;
            }
            //还可以申请宗派的个数
            let leftCnt = Macros.MAX_GUILD_ROLE_APPLY_REQUEST_NUMBER - hasApplyNum;
            let guildInfos = guildInfoList.m_astGuildInfo;

            for (let i = 0; i < Macros.MAX_GUILD_ROLE_APPLY_REQUEST_NUMBER; i++) {
                //宗派列表长度
                let length = guildInfos.length;
                //随机选取下标
                let index = Math.floor(Math.random() * length);

                let oneInfo = guildInfos[index];
                if (oneInfo != null && oneInfo.m_ushMemberNumber < G.DataMgr.guildData.getGuildLevelConfig(oneInfo.m_ushGuildLevel).m_uchMan) {
                    // 人数未满
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildJoinRequest(oneInfo.m_uiGuildID, Macros.GUILD_APPLY_CODE_APPLY));
                    //将申请过的宗派从列表中删掉
                    guildInfos.splice(index, 1);

                    if (--leftCnt <= 0) {
                        break;
                    }
                }
            }

            if (leftCnt < Macros.MAX_GUILD_ROLE_APPLY_REQUEST_NUMBER - hasApplyNum) {
                G.TipMgr.addMainFloatTip('一键申请成功');
            } else {
                G.TipMgr.addMainFloatTip('没有可申请的宗门');
            }
        }

        G.GuideMgr.processGuideNext(EnumGuide.Guild, EnumGuide.Guild_ClickApply);
    }

    private onClickBtnCreate() {
        let guildName: string = this.inputName.text;
        if ('' == guildName) {
            G.TipMgr.addMainFloatTip('宗门名不能为空');
            return;
        }
        else if (ChannelClean.isInvalidName(guildName)) {
            G.TipMgr.addMainFloatTip('宗门名含有不适当词汇，请检查。');
            return;
        }

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getGuildCreateRequest(guildName, ""));
    }


    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (EnumGuide.Guild_ClickApply == step) {
            this.onClickBtnOnekey();
            return true;
        }
        return false;
    }
}