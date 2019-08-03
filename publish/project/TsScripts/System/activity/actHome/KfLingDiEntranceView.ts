import { KeyWord } from "System/constants/KeyWord";
import { DropPlanData } from "System/data/DropPlanData";
import { GuildData } from "System/data/GuildData";
import { KfLingDiData } from "System/data/KfLingDiData";
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";
import { TipFrom } from "System/tip/view/TipsView";
import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { IconItem } from "System/uilib/IconItem";
import { List } from "System/uilib/List";
import { UIRoleAvatar } from "System/unit/avatar/UIRoleAvatar";


export class KfLingDiEntranceView extends CommonForm {
    private _cityId: number;
    private _titleTxt: UnityEngine.UI.Text;
    private _guildNameTxt: UnityEngine.UI.Text;
    private _leaderNameTxt: UnityEngine.UI.Text;
    private _rewardList: List;
    private _btnEnter: UnityEngine.GameObject;
    private _modelRootTR: UnityEngine.RectTransform;
    private _roleAvatar: UIRoleAvatar;

    constructor() {
        super(KeyWord.ACT_FUNCTION_ZZHC);
    }

    open(id: number) {
        this._cityId = id;
        super.open();
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.KfLingDiEntranceView;
    }

    protected initElements() {
        this._titleTxt = this.elems.getText('titleTxt');
        this._guildNameTxt = this.elems.getText('guildNameTxt');
        this._leaderNameTxt = this.elems.getText('leaderNameTxt');

        this._rewardList = this.elems.getUIList('rewardList');

        this._btnEnter = this.elems.getElement('enterBtn');
        this._modelRootTR = this.elems.getRectTransform('modelRoot');
    }

    private _updateRewardList() {
        let dropID = KfLingDiData.VICTORY_REWARD_ID_GROUP[this._cityId - 1];
        let dropThing = DropPlanData.getDropPlanConfig(dropID).m_astDropThing;
        let len = dropThing.length;

        this._rewardList.Count = len;
        for (let i = 0; i < len; i++) {
            let iconItem = new IconItem();
            let config = dropThing[i];
            iconItem.setUsuallyIcon(this._rewardList.GetItem(i).gameObject);
            iconItem.setTipFrom(TipFrom.normal);
            iconItem.updateById(config.m_iDropID, config.m_uiDropNumber);
            iconItem.updateIcon();
        }
    }

    protected initListeners() {
        this.addClickListener(this._btnEnter, this._onClickBtnEnter);
        this.addClickListener(this.elems.getElement('mask'), this._onClickMask);
    }

    private _onClickMask() {
        this.close();
    }

    private _onClickBtnEnter() {
        if (G.DataMgr.heroData.guildId <= 0) {
            G.TipMgr.addMainFloatTip("您没有加入宗门，无法攻打");
            return;
        }

        if (G.DataMgr.heroData.guildJoinTime + GuildData.JOIN_GUILD_MIN_TIME * 3600 >= G.SyncTime.getCurrentTime() / 1000) {
            G.TipMgr.addMainFloatTip(uts.format('加入或创建宗门不足{0}小时，无法攻打', GuildData.JOIN_GUILD_MIN_TIME));
            return;
        }

        if (G.DataMgr.guildData.guildLevel < Macros.ZZHC_GUILD_NEED_LEVEL) {
            G.TipMgr.addMainFloatTip(uts.format("宗门等级不足{0}级，无法攻打", Macros.ZZHC_GUILD_NEED_LEVEL));
            return;
        }


        if (G.DataMgr.heroData.level < Macros.ZZHC_ROLE_JOIN_MIN_LEVEL) {
            G.TipMgr.addMainFloatTip(uts.format("角色等级不足{0}级，无法攻打", Macros.ZZHC_ROLE_JOIN_MIN_LEVEL));
            return;
        }

        if (this._cityId == KfLingDiData.MAIN_CITY_ID && !G.DataMgr.kfLingDiData.isTakeUpSubCity()) {
            G.TipMgr.addMainFloatTip("您的宗门未占领其他城池，无法攻打主城");
            return;
        }

        let actID = (this._cityId == KfLingDiData.MAIN_CITY_ID ? Macros.ACTIVITY_ID_ZZHCMAIN : Macros.ACTIVITY_ID_ZZHCSUB);
        G.ModuleMgr.kfModule.tryJoinKfAct(actID, this._cityId);
    }

    protected onOpen() {
        this.updateView();
    }

    protected onClose() {
        if (!this._roleAvatar) return;
        this._roleAvatar.destroy();
        this._roleAvatar = null;
    }

    ////////////////////////////////////////////////////////////////

    updateView() {
        let cityInfo = G.DataMgr.kfLingDiData.PanelInfo.m_stCityData.m_stRankList[this._cityId - 1];

        this._titleTxt.text = cityInfo.m_szCityName;
        this._guildNameTxt.text = this._isNullString(cityInfo.m_szName) ? '无' : cityInfo.m_szName;
        this._leaderNameTxt.text = (!cityInfo.m_stLeaderRole ||
            this._isNullString(cityInfo.m_stLeaderRole.m_stBaseProfile.m_szNickName) ? '无' :
            cityInfo.m_stLeaderRole.m_stBaseProfile.m_szNickName);

        this._updateAvatar(cityInfo.m_stLeaderRole);
        this._updateRewardList();
    }

    private _isNullString(str: string) {
        if (str == null || str == '') return true;
        return false;
    }

    private _updateAvatar(roleInfo: Protocol.CSZZHCCityOneRole) {
        if (!roleInfo) return;

        if (null == this._roleAvatar) this._roleAvatar = new UIRoleAvatar(this._modelRootTR, this._modelRootTR);

        this._roleAvatar.setAvataByList(roleInfo.m_stAvatarList,
            roleInfo.m_stBaseProfile.m_cProfession, roleInfo.m_stBaseProfile.m_cGender);
        this._roleAvatar.setSortingOrder(this.sortingOrder);
    }
}
