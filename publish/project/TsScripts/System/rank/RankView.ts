import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { HeroData } from 'System/data/RoleData'
import { PetData } from 'System/data/pet/PetData'
import { ThingData } from 'System/data/thing/ThingData'
import { EnumRankRule } from 'System/rank/EnumRankRule'
import { RankEquipListItemData } from 'System/data/RankEquipListItemData'
import { Color } from 'System/utils/ColorUtil'
import { CompareUtil } from 'System/utils/CompareUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { RankListItemData } from 'System/data/vo/RankListItemData'
import { ElemFinder } from 'System/uilib/UiUtility'
import { List, ListItem } from 'System/uilib/List'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { RichTextUtil } from 'System/utils/RichTextUtil'
import { ZhufuData } from 'System/data/ZhufuData'
import { JuyuanRule } from 'System/juyuan/JuyuanRule'
import { LookRankInfoView } from 'System/rank/LookRankInfoView'
import { CurrencyTip } from 'System/uilib/CurrencyTip'


export enum EnumRankTab {
    /**等级*/
    LV = 0,
    /**战力*/
    ZhanLi = 1,
    /**坐骑*/
    QiYueShou,
    /**伙伴*/
    WuYuan,
    /**翅膀*/
    LingYi,
    /**圣印*/
    ZhenFa,
    /**宝物*/
    FaQi,
    /**强化*/
    QiangHua,
    /**神力*/
    JuYuan,
    /**神器*/
    ShenQi,
    /**圣光*/
    DaoGongJiuXing,
    /**真迹*/
    ShenJi,
    /**星环*/
    MoFang,
    /**宝石*/
    MingWen,
}

interface RankInfo {
    requested: boolean;
    selfrank: Protocol.RefreshRankInfo_Response;
    ranks: Array<Protocol.OneRankInfo>;
    /**个人数据是否已经添加*/
    isAddSelfData: boolean;
}

/**
 *排行版面板
 * @author bondzheng
 *
 */
export class RankView extends CommonForm {
    private currencyTip: CurrencyTip;

    /**一页显示多少*/
    private readonly rankItemCountOfPage: number = 50;
    /**最大可以显示10页-100个*/
    private readonly maxPageCount: number = 2;
    /**向服务段每50毫秒请求一次*/
    private readonly sendTime: number = 50;

    /**即将打开的Tab页*/
    private openTab: EnumRankTab;
    /**当前类型tab（等级/宝石/战力...）*/
    private curTypeIndex: number = 0;
    /**当前选择的要查看的人*/
    private curSelectRoleIndex: number = 0;
    /**当前页*/
    private curPagePane: number = 0;
    /**排行榜数据中给的有多少页*/
    private totalPage: number = 0;
    /**最后一个有多少人*/
    private lastRankCount: number = 0;

    /**排行榜信息列表*/
    private m_rankListData: RankListItemData[] = [];

    /**排行帮类型小类*/
    private m_typeList: GameConfig.RankConfInfoM[];

    private _equipListData: RankEquipListItemData[]
    private _rankData: RankListItemData;
    private _subTyep: number = -1;
    private _typeConfig: GameConfig.RankConfInfoM;
    private _typeSelectIndex: number = 0;

    private btnReturn: UnityEngine.GameObject;
    /**排行榜的标题*/
    private objTitle: UnityEngine.GameObject;
    private txtTitles: UnityEngine.UI.Text[] = [];
    /**提示信息（排行榜每逢整点刷新）*/
    private txtDiscription: UnityEngine.UI.Text;
    /**排行榜类型名字*/
    private titleList: List;
    /**世界排行*/
    private rankList: List;
    /**世界排行*/
    private worldRanks: WorldRankItem[] = [];

    private rankInfos: { [type: number]: RankInfo } = {};

    /**我的排名*/
    private myRank: UnityEngine.GameObject;
    private myRankItem: WorldRankItem = new WorldRankItem();

    private newTypeList: GameConfig.RankConfInfoM[] = [];


    constructor() {
        super(KeyWord.ACT_FUNCTION_RANK);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.RankView;
    }

    protected initElements() {
        this.btnReturn = this.elems.getElement("btnReturn");
        this.titleList = this.elems.getUIList("titleList");
        this.rankList = this.elems.getUIList("rankList");
        //我的排名
        this.myRank = this.elems.getElement("myRank");

        //排行榜标题
        this.objTitle = this.elems.getElement("objTitle");
        for (let i = 0; i < 4; i++) {
            let txtTitle = ElemFinder.findText(this.objTitle, "txtTitle" + (i + 1));
            this.txtTitles.push(txtTitle);
        }
        //整点刷新的提示
        this.txtDiscription = ElemFinder.findText(this.objTitle, "txtDiscription");
        this.myRankItem.setComponents(this.myRank);

        this.currencyTip = new CurrencyTip();
        this.currencyTip.setComponents(this.elems.getElement("currencyTip"));
    }

    protected initListeners() {
        this.addClickListener(this.btnReturn, this.onClickReturn);
        this.addClickListener(this.elems.getElement("mask"), this.onClickReturn);

        this.addListClickListener(this.titleList, this.onTitleListClick);
        this.addListClickListener(this.rankList, this.onRankListClick);
    }

    open(openTab: EnumRankTab = 0, openParam: any = null) {
        this.openTab = openTab;
        super.open();
    }

    protected onOpen() {
        if (this.curTypeIndex != this.openTab) {
            this.curTypeIndex = this.openTab;
        }
        this.m_typeList = G.DataMgr.rankData.getAllConfigs();
        this.resetRankInfos();
        this.showRankName();
        this.onTypeChange();
        this.titleList.Selected = 0;

        this.onMoneyChange();

    }

    protected onClose() {
    }

    private onClickReturn() {
        this.close();
    }


    /**
     * 点击标题的切换
     * @param index
     */
    private onTitleListClick(index: number) {
        G.AudioMgr.playBtnClickSound();
        this.curTypeIndex = index;
        this.onTypeChange();
        this.rankList.ScrollTop();
        this.rankList.Selected = -1;
    }
    /**
     * 点击具体的人查看信息
     * @param index
     */
    private onRankListClick(index: number) {
        this.curSelectRoleIndex = index;
        let type = this.newTypeList[this.curTypeIndex].m_iRankType;
        G.DataMgr.runtime.oneRankInfo = this.rankInfos[type].ranks[index];
        if (G.DataMgr.runtime.oneRankInfo == null) {
            uts.logError('rank data error: type:' + type + ', index:' + index + ', ranklen:' + this.rankInfos[type].ranks.length);
            return;
        }
        G.ActionHandler.getProfile(G.DataMgr.runtime.oneRankInfo.m_stRoleID);
    }

    /**
     * 重置排行榜数据，将requested置为false,以便重新向服务器拉取数据
     */
    private resetRankInfos() {
        for (let i = 0; i < this.m_typeList.length; i++) {
            let type = this.m_typeList[i].m_iRankType;
            let rankInfo = this.rankInfos[type];
            if (rankInfo == null) {
                rankInfo = { requested: false, selfrank: {} as Protocol.RefreshRankInfo_Response, ranks: [], isAddSelfData: false };
                this.rankInfos[type] = rankInfo;
            }
            rankInfo.requested = false;
        }
    }

    /**
     * 显示（等级/强化/宝石...排行榜名字）
     */
    private showRankName() {
        for (let i = 0; i < this.m_typeList.length; i++) {
            if (this.m_typeList[i].m_iRankType == KeyWord.RANK_TYPE_YY) continue;
            this.newTypeList.push(this.m_typeList[i]);
        }

        this.titleList.Count = this.newTypeList.length;
        for (let i = 0; i < this.titleList.Count; i++) {
            let item = this.titleList.GetItem(i);
            let txtNameNormal = item.findText("normal/txtName");
            let txtNameSelected = item.findText("selected/txtName");
            let str = KeyWord.getDesc(KeyWord.GROUP_RANKINFO_RANKTYPE, this.newTypeList[i].m_iRankType);
            txtNameNormal.text = str;
            txtNameSelected.text = str;
        }
    }

    private onTypeChange(): void {
        this._typeConfig = this.newTypeList[this.curTypeIndex];
        if (this._typeConfig != null) {
            let heroData: HeroData = G.DataMgr.heroData;
            if (heroData.level < this._typeConfig.m_iOpenLevel) {
                G.TipMgr.addMainFloatTip(G.DataMgr.langData.getLang(192, this._typeConfig.m_iOpenLevel));
                return;
            }
            //标题+提示
            this.txtTitles[0].text = (this._typeConfig.m_szKey1);
            this.txtTitles[1].text = (this._typeConfig.m_szKey2);
            this.txtTitles[2].text = (this._typeConfig.m_szKey3);
            this.txtTitles[3].text = (this._typeConfig.m_szKey4);
            this.txtDiscription.text = (this._typeConfig.m_szDiscription);

            let rankInfo = this.rankInfos[this._typeConfig.m_iRankType];
            if (!rankInfo.requested) {
                rankInfo.requested = true;
                this.getRankFromServer(this._typeConfig.m_iRankType);
            }
            this.showRankView();

        }
    }

    private getRankFromServer(rankType: number) {
        for (let page = 0; page < this.maxPageCount; page++) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getRankInfoRequest(rankType, page));
        }
    }

    /**
     *刷新一个新的排行榜
     * @param msg
     *
     */
    onWorldRankResponse(response: Protocol.RefreshRankInfo_Response): void {
        if (response.m_ucResultID == 0) {
            let startPos = response.m_ucCurPage * this.rankItemCountOfPage;
            let rankInfo = this.rankInfos[response.m_stRankList.m_ucRankType];
            let ranks = rankInfo.ranks;
            for (let i = 0; i < response.m_stRankList.m_usCount; i++) {
                if (ranks[startPos + i] == null) ranks[startPos + i] = {} as Protocol.OneRankInfo;
                ranks[startPos + i] = response.m_stRankList.m_astRankInfo[i];
            }
            rankInfo.selfrank = response;
            rankInfo.isAddSelfData = true;
            this.showRankView();
        }
    }


    private showRankView() {
        //获取有排行榜有多少人 
        let type = this.newTypeList[this.curTypeIndex].m_iRankType;
        let rankRes = this.rankInfos[type];
        if (rankRes == null) {
            this.rankList.Count = 0;
            return;
        }

        this.rankList.Count = rankRes.ranks.length;
        for (let i = 0; i < this.rankList.Count; i++) {
            let itemObj = this.rankList.GetItem(i).gameObject;
            let item: WorldRankItem = null;
            if (this.worldRanks.length < this.rankList.Count) {
                item = new WorldRankItem();
                this.worldRanks.push(item);
            } else {
                item = this.worldRanks[i];
            }
            item.setComponents(itemObj);
            item.update(rankRes.ranks[i], i);
        }

        if (rankRes.isAddSelfData) {
            this.myRankItem.update(rankRes.selfrank.m_stRankInfo, rankRes.selfrank.m_aucMyRank[type - 1] - 1, false);
        }

    }

    /**获取装备列表数据*/
    private getEquipList(): Protocol.ContainerThingInfo[] {
        if (!this._rankData) {
            return null;
        }
        let showEquipListType: number = this.getShowEquipListType();
        let tmpVec: Protocol.ContainerThingInfo[]
        switch (showEquipListType) {
            case EnumRankRule.LIST_ROLE:
                tmpVec = this._rankData.rankInfo.m_stExtraInfo.m_stRoleInfo.m_stThingInfoList.m_astThingInfo;
                break;
            case EnumRankRule.LIST_ZHU_FU:
                tmpVec = this._rankData.rankInfo.m_stExtraInfo.m_stHeroSubInfo.m_astThingInfo;
                break;
            case EnumRankRule.LIST_HONG_YAN:
                tmpVec = this._rankData.rankInfo.m_stExtraInfo.m_stBeautyInfo.m_astThingInfo;
                break;
            default:
        }
        return tmpVec;
    }

    /**获取显示的装备类型*/
    private getShowEquipListType(): number {
        if (!this._rankData) {
            return 0;
        }
        if (this._subTyep > 0) {
            return EnumRankRule.LIST_ZHU_FU;
        }
        else if (this._rankData.rankInfo.m_ucType == KeyWord.RANK_TYPE_HONGYAN) {
            return EnumRankRule.LIST_HONG_YAN;
        }
        else if (this._rankData.rankInfo.m_ucType == KeyWord.RANK_TYPE_FAQI) {
            return 0;
        }
        else {
            return EnumRankRule.LIST_ROLE;
        }

    }


    get equipListData(): RankEquipListItemData[] {
        if (!this._equipListData) {
            this._equipListData = new Array<RankEquipListItemData>();
        }
        return this._equipListData;
    }
    onMoneyChange() {
        this.currencyTip.updateMoney();
    }
}

export class WorldRankItem extends ListItemCtrl {
    /**排名*/
    private txtRnakNum: UnityEngine.UI.Text;
    private imgRankOne: UnityEngine.GameObject;
    private imgRankTwo: UnityEngine.GameObject;
    private imgRankThree: UnityEngine.GameObject;

    /**名字*/
    private txtRankName: UnityEngine.UI.Text;
    /**职业*/
    private txtRankJob: UnityEngine.UI.Text;
    /**什么类型，等级*/
    private txtRankTypeLv: UnityEngine.UI.Text;
    /**排行榜的类型*/
    private _subType: number;

    private imgFirstBG: UnityEngine.UI.Image;
    private imgSecondBG: UnityEngine.UI.Image;
    private imgThirdlyBG: UnityEngine.UI.Image;
    private imgOtherBG: UnityEngine.UI.Image;

    private animation: UnityEngine.Animator;

    setComponents(go: UnityEngine.GameObject) {
        this.txtRnakNum = ElemFinder.findText(go, 'txtRankNum/num');
        this.imgRankOne = ElemFinder.findObject(go, 'txtRankNum/img1');
        this.imgRankTwo = ElemFinder.findObject(go, 'txtRankNum/img2');
        this.imgRankThree = ElemFinder.findObject(go, 'txtRankNum/img3');

        this.txtRankName = ElemFinder.findText(go, 'txtRankName');
        this.txtRankJob = ElemFinder.findText(go, 'txtRankJob');
        this.txtRankTypeLv = ElemFinder.findText(go, 'txtRankTypeLv');

        this.imgFirstBG = ElemFinder.findImage(go, "first");
        this.imgSecondBG = ElemFinder.findImage(go, "second");
        this.imgThirdlyBG = ElemFinder.findImage(go, "thirdly");
        this.imgOtherBG = ElemFinder.findImage(go, "other");

        let anim = ElemFinder.findObject(go, "animator");
        if (anim) {
            this.animation = anim.GetComponent(UnityEngine.Animator.GetType()) as UnityEngine.Animator;
        }
    }

    update(data: Protocol.OneRankInfo, index: number, changeBg: boolean = true) {
        //等级
        if (data == null || data.m_stRoleID.m_uiUin == 0) {
            this.imgRankOne.SetActive(false);
            this.imgRankTwo.SetActive(false);
            this.imgRankThree.SetActive(false);
            this.txtRnakNum.gameObject.SetActive(true);
            this.txtRnakNum.text = '--';
            this.txtRankName.text = '--';
            this.txtRankJob.text = '--';
            this.txtRankTypeLv.text = '--';
            return;
        }
        if (this.imgFirstBG)
            this.imgFirstBG.gameObject.SetActive(index == 0);
        if (this.imgSecondBG)
            this.imgSecondBG.gameObject.SetActive(index == 1);
        if (this.imgThirdlyBG)
            this.imgThirdlyBG.gameObject.SetActive(index == 2);
        if (this.imgOtherBG)
            this.imgOtherBG.gameObject.SetActive(index > 2);
        if (this.animation) {
            if (index < 3) {
                this.animation.gameObject.SetActive(true);
                this.animation.Play("animRank" + (index + 1));
            }
            else {
                this.animation.gameObject.SetActive(false);
            }
        }

        if (index == 0) {
            this.imgRankOne.SetActive(true);
            this.imgRankTwo.SetActive(false);
            this.imgRankThree.SetActive(false);
            this.txtRnakNum.gameObject.SetActive(false);
        }
        else if (index == 1) {
            this.imgRankOne.SetActive(false);
            this.imgRankTwo.SetActive(true);
            this.imgRankThree.SetActive(false);
            this.txtRnakNum.gameObject.SetActive(false);
        }
        else if (index == 2) {
            this.imgRankOne.SetActive(false);
            this.imgRankTwo.SetActive(false);
            this.imgRankThree.SetActive(true);
            this.txtRnakNum.gameObject.SetActive(false);
        } else {
            this.imgRankOne.SetActive(false);
            this.imgRankTwo.SetActive(false);
            this.imgRankThree.SetActive(false);
            this.txtRnakNum.gameObject.SetActive(true);
            this.txtRnakNum.text = (index + 1).toString();
        }
        this.txtRankName.text = data.m_stBaseProfile.m_szNickName;
        this.txtRankJob.text = KeyWord.getDesc(KeyWord.GROUP_PROFTYPE, data.m_stBaseProfile.m_cProfession);

        this._subType = -1;
        if (data.m_ucType == KeyWord.RANK_TYPE_ZQ) {
            this._subType = KeyWord.HERO_SUB_TYPE_ZUOQI;
        }
        else if (data.m_ucType == KeyWord.RANK_TYPE_YY) {
            this._subType = KeyWord.HERO_SUB_TYPE_YUYI;
        }

        else if (data.m_ucType == KeyWord.RANK_TYPE_JL) {
            this._subType = KeyWord.HERO_SUB_TYPE_JINGLING;
        }
        else if (data.m_ucType == KeyWord.RANK_TYPE_MR) {
            this._subType = KeyWord.HERO_SUB_TYPE_MEIREN;
        }
        else if (data.m_ucType == KeyWord.RANK_TYPE_WH) {
            this._subType = KeyWord.HERO_SUB_TYPE_WUHUN;
        }

        // else if (data.m_ucType == KeyWord.RANK_TYPE_HJ) {
        //     this._subType = KeyWord.HERO_SUB_TYPE_HUOJING;
        // }
        else if (data.m_ucType == KeyWord.RANK_TYPE_ZL) {
            this._subType = KeyWord.HERO_SUB_TYPE_ZHANLING;
        }
        else if (data.m_ucType == KeyWord.RANK_TYPE_ZL) {
            this._subType = KeyWord.HERO_SUB_TYPE_TIANZHU;
        }
        this.updateTfKey4(data);

    }

    private updateTfKey4(data: Protocol.OneRankInfo): void {
        let starLevel: number = 0;
        let stageLevel: number = 0;
        let infoLevel: number = 0;
        if (!data) {
            return;
        }
        if (this._subType > 0) {
            let modelName: string;
            let showID: number = data.m_stExtraInfo.m_stHeroSubInfo.m_uiShowID;
            let image: GameConfig.ZhuFuImageConfigM = G.DataMgr.zhufuData.getImageConfig(showID);
            if (image != null) {
                modelName = image.m_szModelName;
            }
            else {
                let config: GameConfig.ZhuFuConfigM = G.DataMgr.zhufuData.getConfig(this._subType, showID);
                uts.assert(config != null, "祝福类型,找不到配置: " + this._subType + "  showID  " + showID);
                modelName = config.m_szName;
            }

            //等级
            infoLevel = (data.m_llOrder1);

            stageLevel = ZhufuData.getZhufuStage(infoLevel, this._subType);
            starLevel = ZhufuData.getZhufuStar(infoLevel, this._subType);
            this.txtRankTypeLv.text = uts.format('{0}阶{1}星', stageLevel, starLevel);
        }
        else {
            if (data.m_ucType == KeyWord.RANK_TYPE_HONGYAN) {
                //阶级             
                stageLevel = data.m_stExtraInfo.m_stBeautyInfo.m_iTotalLayer;
                this.txtRankTypeLv.text = uts.format('{0}阶', stageLevel);
            }
            else if (data.m_ucType == KeyWord.RANK_TYPE_MAGIC) {
                //控鹤擒龙
                let stage = ZhufuData.getZhufuStage(data.m_llOrder1, KeyWord.OTHER_FUNCTION_MAGICCUBE);
                this.txtRankTypeLv.text = uts.format('{0}阶', stage);
            }
            else if (data.m_ucType == KeyWord.RANK_TYPE_FZ) {
                //紫极魔瞳
                let stage = ZhufuData.getZhufuStage(data.m_llOrder1, KeyWord.HERO_SUB_TYPE_FAZHEN);
                this.txtRankTypeLv.text = uts.format('{0}阶', stage);
            }
            else if (data.m_ucType == KeyWord.RANK_TYPE_LL) {
                //鬼影迷踪
                let stage = ZhufuData.getZhufuStage(data.m_llOrder1, KeyWord.HERO_SUB_TYPE_LEILING);
                this.txtRankTypeLv.text = uts.format('{0}阶', stage);
            } else if (data.m_ucType == KeyWord.RANK_TYPE_JIUXING) {
                //玄天功
                let maxLevel = G.DataMgr.jiuXingData.maxLevel;
                let stage = data.m_llOrder1;
                if (stage >= maxLevel) {

                    stage = Math.floor(maxLevel / 10);
                }
                else {
                    stage = Math.floor((stage - 1) / 10) + 1;
                }
                this.txtRankTypeLv.text = uts.format('{0}阶', stage);
            }
            else if (data.m_ucType == KeyWord.RANK_TYPE_SAIJI) {
                this.txtRankTypeLv.text = uts.format('{0}套{1}件', data.m_llOrder1, data.m_llOrder2);
            }
            else if (data.m_ucType == KeyWord.RANK_TYPE_HUNHUAN) {
                //魂环
                this.txtRankTypeLv.text = (data.m_llOrder1 % 100).toString();
            }
            else {
                this.txtRankTypeLv.text = data.m_llOrder1.toString();
            }
        }
    }
}
