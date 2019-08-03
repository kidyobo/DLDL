import { TabSubForm } from "System/uilib/TabForm";
import { UIPathData } from "System/data/UIPathData";
import { KeyWord } from "System/constants/KeyWord";
import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { UIRoleAvatar } from "System/unit/avatar/UIRoleAvatar";
import { ElemFinder } from "System/uilib/UiUtility";
import { CompareUtil } from "System/utils/CompareUtil";
import { ActHomeView } from "System/activity/actHome/ActHomeView";
import { TextFieldUtil } from 'System/utils/TextFieldUtil';
import { Color } from 'System/utils/ColorUtil';
import { UnitCtrlType, GameIDType, SceneID } from 'System/constants/GameEnum'
import { DataFormatter } from "System/utils/DataFormatter";
import { HeroData } from 'System/data/RoleData'
import { GameObjectGetSet, TextGetSet } from 'System/uilib/CommonForm'
export class TianMingBangRankView extends TabSubForm {
    //下次冲榜时间
    private nextTime: TextGetSet;
    private readonly RankTimerKey = '1';
    private btnChongBang:GameObjectGetSet;
    private roles: TianMingBangRankItem[] = [];
    private fightText: TextGetSet;
    private leftTime: TextGetSet;
    protected initElements() {
        // 面板左上角战斗力
        this.fightText = new TextGetSet(this.elems.getText('fightText'));
        this.btnChongBang = new GameObjectGetSet(this.elems.getElement('btnChongBang'));
        this.nextTime = new TextGetSet(this.elems.getText('nextTime'));
        this.leftTime = new TextGetSet(this.elems.getText('leftTimes'));
    }
    protected initListeners() {
        this.addClickListener(this.btnChongBang.gameObject, this.onBtnChongBangClick);
    }
    constructor() {
        super(KeyWord.OTHER_FUNCTION_DOUHUNBANG);
    }
    protected onClose() {

        for (let i: number = 0; i < 3; i++) {
            this.roles[i].destroy();
        }
        this.roles = [];
    }
    protected onOpen() {
        // 3个角色
        for (let i: number = 0; i < 3; i++) {
            let roleItem = new TianMingBangRankItem();
            let itemGo = this.elems.getElement('role' + i);
            roleItem.setUsual(itemGo);
            this.roles.push(roleItem);
        }
        this.addTimer(this.RankTimerKey, 1000, 0, this.updateTimer);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOpenPvpPanelRequest());
    }
    protected resPath(): string {
        return UIPathData.TianMingBangRankView;
    }

    private updateTimer() {
        let nowTime = DataFormatter.second2yyyymmdd(Math.floor(G.SyncTime.getCurrentTime() / 1000+86400));
        this.nextTime.text = uts.format('下次膜拜时间: {0}', TextFieldUtil.getColorText(nowTime.toString()+'00:00', Color.GREEN));
    }
    updateView() {
        let myFight: number = G.DataMgr.heroData.getProperty(Macros.EUAI_FIGHT);
        this.fightText.text ='战斗力 '+ myFight.toString();
        TianMingBangRankItem.leftTimes = 0;
        let heroData = G.DataMgr.heroData;
        //对手的信息
        let roleList = heroData.playerInfoList;
        let displaySeq = [2, 0, 1];
        for (let i = 0; i < 3; i++) {
            let roleInfo = roleList[displaySeq[i]];
            let hunhuanId = roleInfo.m_stRoleInfo.m_stAvatarList.m_uiHunHuanID;
            this.roles[i].update(roleInfo, this.sortingOrder, HeroData.RankMacros[displaySeq[i]],hunhuanId);
        }
        this.addTimer('delay',1500,1,this.playEffect);
        this.updateTimer();
        this.leftTime.text = uts.format('剩余膜拜次数: {0}',TextFieldUtil.getColorText( TianMingBangRankItem.leftTimes.toString(),Color.GREEN)); 
        
    }
    private onBtnChongBangClick() {
        let actHomeView = G.Uimgr.getForm<ActHomeView>(ActHomeView);
        if (actHomeView!=null) {
            actHomeView.open(KeyWord.OTHER_FUNCTION_TIANMINGBANG);
        }
    }
   private playEffect(){
       G.ResourceMgr.loadModel(TianMingBangRankItem.moBaiEffect.gameObject, UnitCtrlType.other, "effect/uitx/mobaibaokai/mobai.prefab", this.sortingOrder+1);
       TianMingBangRankItem.completeMoBai.SetActive(false);
   }
}

class TianMingBangRankItem {
    clickGo: GameObjectGetSet;
    private roleName: TextGetSet;
    private roleInfo: Protocol.CacheRoleInfo;
    crtRoleID: Protocol.RoleID;
    private roleAvatar: UIRoleAvatar;
    private modelCtn: UnityEngine.Transform;
    private titleRoot: GameObjectGetSet;
    private rankMacros: number;
    private achieveMoBai: GameObjectGetSet;
    static completeMoBai: GameObjectGetSet;
    private mask: GameObjectGetSet;
    private bg: GameObjectGetSet;
    static moBaiEffect:GameObjectGetSet;
    /**有玩家的时候 */
    private hasPeople:GameObjectGetSet;
    /**没有玩家的时候 */
    private noPeople:GameObjectGetSet;
    /**是否膜拜过*/
    private isMoBai: boolean = false;
    //剩余次数
    static leftTimes:number = 0;
    private hunhuanRoot:GameObjectGetSet;
    setUsual(go: UnityEngine.GameObject) {
        this.clickGo = new GameObjectGetSet(ElemFinder.findObject(go, 'hasPeople/click'));
        this.roleName = new TextGetSet(ElemFinder.findText(go, 'hasPeople/name'));
        this.titleRoot = new GameObjectGetSet(ElemFinder.findObject(go, 'hasPeople/titleroot'));
        this.modelCtn = ElemFinder.findTransform(go, 'hasPeople/modelCtn');
        this.achieveMoBai = new GameObjectGetSet(ElemFinder.findObject(go, 'hasPeople/achieveMoBai'));
        TianMingBangRankItem.completeMoBai = new GameObjectGetSet(ElemFinder.findObject(go, 'hasPeople/completeMoBai'));
        this.mask = new GameObjectGetSet(ElemFinder.findObject(go, 'hasPeople/completeMoBai/mask'));
        this.bg = new GameObjectGetSet(ElemFinder.findObject(go, 'hasPeople/completeMoBai/mask/bg'));
        TianMingBangRankItem.moBaiEffect = new GameObjectGetSet(ElemFinder.findObject(go,'hasPeople/completeMoBai/moBaiEffect'));
        this.hasPeople = new GameObjectGetSet(ElemFinder.findObject(go,'hasPeople'));
        this.noPeople = new GameObjectGetSet(ElemFinder.findObject(go,'noPeople'));
        this.hunhuanRoot = new GameObjectGetSet(ElemFinder.findObject(this.hasPeople.gameObject,'hunhuanRoot'));
        Game.UIClickListener.Get(this.clickGo.gameObject).onClick = delegate(this, this.onRoleItemClick);
        Game.UIClickListener.Get(this.mask.gameObject).onClick = delegate(this, this.onClickClose);
        Game.UIClickListener.Get(this.bg.gameObject).onClick = delegate(this, this.onClickClose);
    }

    destroy() {
        if (null != this.roleAvatar) {
            this.roleAvatar.destroy();
            this.roleAvatar = null;
        }
    }

    update(roleInfo: Protocol.CacheRoleInfo, sortingOrder: number, macros: number,hunhuanId:number) {
        let roleName = roleInfo.m_stRoleInfo.m_stBaseProfile.m_szNickName;
        this.hasPeople.SetActive(!(roleName == ""));
        this.noPeople.SetActive((roleName == ""));
        if (roleName=="") {
            return;
        }
        this.roleInfo = roleInfo;
        this.rankMacros = macros;
        //判断是否膜拜过
        this.isMoBai = G.DataMgr.systemData.canMoBai(1 << this.rankMacros);
        if (this.isMoBai) {
           TianMingBangRankItem.leftTimes += 1;
        }
        this.achieveMoBai.SetActive(this.isMoBai);
        if (null != this.crtRoleID) {
            return;
        }
        this.crtRoleID = roleInfo.m_stRoleInfo.m_stID;
        this.roleName.text = roleInfo.m_stRoleInfo.m_stBaseProfile.m_szNickName;
        // this.roleName.color = Color.toUnityColor(KeyWord.GENDERTYPE_BOY == roleInfo.m_cGender ? Color.BOY : Color.GIRL);
        if (null == this.roleAvatar) {
            this.roleAvatar = new UIRoleAvatar(this.modelCtn, this.modelCtn);
            this.roleAvatar.setRenderLayer(5);
            this.roleAvatar.setSortingOrder(sortingOrder);
            this.roleAvatar.hasWing = true;
        }
      
        this.roleAvatar.setAvataByList(roleInfo.m_stRoleInfo.m_stAvatarList, roleInfo.m_stRoleInfo.m_stBaseProfile.m_cProfession, roleInfo.m_stRoleInfo.m_stBaseProfile.m_cGender);

        //称号
        G.ResourceMgr.loadModel(this.titleRoot.gameObject, UnitCtrlType.chenghao, roleInfo.m_stShowTitleFixInfo.m_usID.toString(), 0);
        if (hunhuanId > 0) {
            let config = G.DataMgr.hunliData.getHunHuanConfigById(hunhuanId);
            let url = config.m_iModelID.toString();
            G.ResourceMgr.loadModel(this.hunhuanRoot.gameObject, UnitCtrlType.reactive, uts.format("model/hunhuan/{0}/{1}.prefab", url, url), sortingOrder);
        }
    }

    private onRoleItemClick() {
        if (this.isMoBai) {
            TianMingBangRankItem.completeMoBai.SetActive(true);
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOpenPvpPanelRequest(Macros.PVPRANK_MOBAI, this.rankMacros));
        } else {
            G.TipMgr.addMainFloatTip("你已膜拜！");
        }
    }
    private onClickClose() {
        TianMingBangRankItem.completeMoBai.SetActive(false);
    }
}