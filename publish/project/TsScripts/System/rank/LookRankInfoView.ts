import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { Global as G } from "System/global"
import { UIPathData } from "System/data/UIPathData"
import { ElemFinder } from 'System/uilib/UiUtility'
import { List, ListItem } from 'System/uilib/List'
import { RankListItemData } from 'System/data/vo/RankListItemData'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { UIRoleAvatar } from "System/unit/avatar/UIRoleAvatar"
import { KeyWord } from "System/constants/KeyWord"
import { RankEquipListItemData } from "System/data/RankEquipListItemData"
import { ThingItemData } from "System/data/thing/ThingItemData"
import { PetData } from "System/data/pet/PetData"
import { UnitCtrlType, GameIDType, SceneID, EnumEffectRule } from 'System/constants/GameEnum'
import { EnumRankRule } from 'System/rank/EnumRankRule'
import { ThingData } from 'System/data/thing/ThingData'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { JiuXingData } from 'System/data/JiuXingData'
import { SkillData } from 'System/data/SkillData'
import { UIUtils } from 'System/utils/UIUtils'
import { HeroView } from 'System/hero/view/HeroView'
import { ZhufuData } from 'System/data/ZhufuData'
import { DataFormatter } from 'System/utils/DataFormatter'
import { RoleEquipList } from "System/hero/RoleEquipList"
import { Macros } from 'System/protocol/Macros'

export class LookRankInfoView extends CommonForm {
    /**玩家装备最大数量*/
    private readonly maxEquipNum = 11;
    /**九星*/
    private readonly maxJiuXing = 9;

    /**祝福装备的类型*/
    private gameIDType = GameIDType.INVALID;
    private keywordType: number = -1;

    private _equipListData: RankEquipListItemData[] = [];
    private thingItemVo: { [pos: number]: ThingItemData };
    /**选择的玩家信息*/
    private _rankData: Protocol.OneRankInfo;
    /**角色模型*/
    private roleAvatar: UIRoleAvatar;
    private listDataEquip: RoleEquipList[];
    private subType: number = -1;


    private txtZdl: UnityEngine.UI.Text;
    private txtLevel: UnityEngine.UI.Text;
    private txtName: UnityEngine.UI.Text;

    private roleEquipList: UnityEngine.GameObject;
    private allBtn: UnityEngine.GameObject;
    private bg: UnityEngine.GameObject;
    private btnClose: UnityEngine.GameObject;
    /**玩家*/
    private role: UnityEngine.GameObject;
    /**坐骑，神器...*/
    private other: UnityEngine.GameObject;
    /**模型节点*/
    private roleRoot: UnityEngine.GameObject;
    private rideRoot: UnityEngine.GameObject;
    private wingRoot: UnityEngine.GameObject;
    private weaponRoot: UnityEngine.GameObject;
    private wuyuanRoot: UnityEngine.GameObject;
    private zhenfaRoot: UnityEngine.GameObject;
    private faqiRoot: UnityEngine.GameObject;
    private shenjiRoot: UnityEngine.GameObject;
    private hunHuanRoot: UnityEngine.GameObject;

    private otherList: UnityEngine.GameObject;
    private zhufuEquipIcons: UnityEngine.GameObject[] = [];
    private zhufuIconItems: IconItem[] = [];
    /**玩家的装备*/
    private roleEquips: UnityEngine.GameObject[] = [];
    /**装备ui*/
    private equipIcons: IconItem[] = [];

    /**除圣光外*/
    private roleInfo: UnityEngine.GameObject;
    /**圣光*/
    private ballList: UnityEngine.GameObject;
    /**管理九个九星图标List*/
    private imgBallList: UnityEngine.GameObject[] = [];
    /**九星技能*/
    private txtBallSkillList: UnityEngine.UI.Text[] = [];

    /**赠送鲜花*/
    private btnSendFlowers: UnityEngine.GameObject;
    /**加好友*/
    private btnAddFriend: UnityEngine.GameObject;
    /**查看信息*/
    private btnLookInfo: UnityEngine.GameObject;

    private itemIcon_Normal: UnityEngine.GameObject;

    private txtLv: UnityEngine.UI.Text;


    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.LookRankInfoView;
    }


    protected initElements(): void {
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.txtName = this.elems.getText("txtName");
        this.txtLevel = this.elems.getText("txtLevel");
        this.txtZdl = this.elems.getText("txtZDL");
        this.listDataEquip = new Array<RoleEquipList>(ThingData.All_HuGu_NUM + 1);
         //装备
         for (let i = 0; i < ThingData.All_HuGu_NUM; i++) {
             this.listDataEquip[i] = new RoleEquipList();
             this.listDataEquip[i].containerID = Macros.CONTAINER_TYPE_HUNGU_EQUIP;
         }
        //玩家装备
        this.roleEquipList = this.elems.getElement("roleEquipList");
        for (let i = 0; i < ThingData.All_HuGu_NUM; i++) {
            let temp = this.roleEquipList.transform.Find("equipIcon" + i);
            if(this.equipIcons[i] == null){
                this.equipIcons[i] = new IconItem();
                this.equipIcons[i].effectRule = EnumEffectRule.none;
                this.equipIcons[i].setUsualIconByPrefab(this.itemIcon_Normal, temp.gameObject);
                this.equipIcons[i].showBg = false;
                this.equipIcons[i].needWuCaiColor = true;
                this.equipIcons[i].needForceShowWuCaiColor = true;
                this.equipIcons[i].setTipFrom(TipFrom.equip);
                this.roleEquips.push(temp.gameObject);
                // this.equipIcons.push(iconItem);
            }
           
            
        }
        this.allBtn = this.elems.getElement("allBtn");
        this.bg = this.elems.getElement("bg");
        this.btnClose = this.elems.getElement("btnClose");
        //显示人物/祝福装备，坐骑。。
        this.role = this.elems.getElement("role");
        this.other = this.elems.getElement("other");

        //各种类型模型节点
        this.roleRoot = this.elems.getElement("roleRoot");
        this.rideRoot = this.elems.getElement("rideRoot");
        this.wingRoot = this.elems.getElement("wingRoot");
        this.weaponRoot = this.elems.getElement("weaponRoot");
        this.wuyuanRoot = this.elems.getElement("wuyuanRoot");
        this.zhenfaRoot = this.elems.getElement("zhenfaRoot");
        this.shenjiRoot = this.elems.getElement("shenjiRoot");
        this.faqiRoot = this.elems.getElement("faqiRoot");
        this.hunHuanRoot = this.elems.getElement("hunHuanRoot");
        this.otherList = this.elems.getElement("otherList");
        //祝福类的4个装备+特殊2个
        for (let i = 0; i < 6; i++) {
            let temp = this.otherList.transform.Find("equipSlotIcon" + i);
            let icon = this.otherList.transform.Find("equipSlotIcon" + i + "/icon");
            this.zhufuEquipIcons.push(temp.gameObject);

            let iconItem = new IconItem();
            iconItem.setUsualIconByPrefab(this.itemIcon_Normal, icon.gameObject);
            iconItem.showBg = false;
            // iconItem.setTipFrom(TipFrom.equip);
            this.zhufuIconItems.push(iconItem);
        }

        //玩家/祝福
        this.roleInfo = this.elems.getElement("roleInfo");
        //圣光
        this.ballList = this.elems.getElement("ballList");
        for (let i = 0; i < this.maxJiuXing; i++) {
            let obj = this.ballList.transform.Find(i.toString()).gameObject;
            let txtSkill = this.ballList.transform.Find(i + "/text").GetComponent(UnityEngine.UI.Text.GetType()) as UnityEngine.UI.Text;
            this.imgBallList.push(obj);
            this.txtBallSkillList.push(txtSkill);
        }

        //按钮
        this.btnSendFlowers = this.elems.getElement("btnSendFlowers");
        this.btnAddFriend = this.elems.getElement("btnAddFriend");
        this.btnLookInfo = this.elems.getElement("btnLookInfo");

        this.txtLv = this.elems.getText("txtLv");

    }

    protected initListeners(): void {
        this.addClickListener(this.bg, this.onClickClose);
        this.addClickListener(this.btnClose, this.onClickClose);
        this.addClickListener(this.btnSendFlowers, this.onClickSendFlower);
        this.addClickListener(this.btnAddFriend, this.onClickAddFriend);
        this.addClickListener(this.btnLookInfo, this.onClickLookInfo);
    }

    open(roleInfo: Protocol.OneRankInfo) {
        this._rankData = roleInfo;
        super.open();
    }

    protected onOpen() {
        //角色Avatar
        if (null == this.roleAvatar) {
            let root = this.roleRoot.transform.Find("root");
            this.roleAvatar = new UIRoleAvatar(root, root);
            this.roleAvatar.setSortingOrder(this.sortingOrder);
            this.roleAvatar.hasWing = true;
        }

        this._onQueryRoleInfo();
    }

    protected onClose() {
        if (null != this.roleAvatar) {
            this.roleAvatar.destroy();
            this.roleAvatar = null;
        }
        G.DataMgr.runtime.oneRankInfo = null;
        G.DataMgr.otherPlayerData.roleByRes = null;
    }


    private onClickClose() {
        this.close();
    }

    private onClickSendFlower() {

    }

    private onClickAddFriend() {
        if (this._rankData != null) {
            G.ActionHandler.addFriend(this._rankData.m_stRoleID, this._rankData.m_stBaseProfile.m_usLevel);
        }
    }

    private onClickLookInfo() {
        if (this._rankData != null) {
            G.ActionHandler.getProfile(this._rankData.m_stRoleID);
            this.close();
        }
    }


    /**
      * 更新角色avatar显示
      * @param avatarList
      * @param prof]
      * @param gender
      *
      */
    setAvatarList(): void {
        //模型的显示        
        if (this._rankData != null) {
            this.roleAvatar.setAvataByList(this._rankData.m_stExtraInfo.m_stRoleInfo.m_stAvatarList, this._rankData.m_stBaseProfile.m_cProfession, this._rankData.m_stBaseProfile.m_cGender);
            this.roleAvatar.m_bodyMesh.playAnimation('stand');
            this.roleAvatar.m_rebirthMesh.setRotation(20, 0, 0);
            this.roleAvatar.setSortingOrder(this.sortingOrder);
        }
    }

    /**
     * 级数，阶级2种等级显示
     * @param num
     * @param isLv
     */
    private showLvOrJieJi(num: number) {
        this.txtLv.text = num.toString();
    }


    private _onQueryRoleInfo(): void {
        this.roleInfo.SetActive(true);
        this.ballList.SetActive(false);
        let petAttrConf: GameConfig.BeautyAttrM;
        let realPos: number = 0;
        let itemVo: RankEquipListItemData = new RankEquipListItemData();
        let nameStr: string;
        if (this._rankData != null) {
            this.subType = -1;
            this.role.SetActive(false);
            this.other.SetActive(false);
            this.otherList.SetActive(true);
            if (this._rankData.m_ucType == KeyWord.RANK_TYPE_ZQ) {
                this.subType = KeyWord.HERO_SUB_TYPE_ZUOQI;
            }
            else if (this._rankData.m_ucType == KeyWord.RANK_TYPE_YY) {
                this.subType = KeyWord.HERO_SUB_TYPE_YUYI;
            }
            else if (this._rankData.m_ucType == KeyWord.RANK_TYPE_FZ) {
                //紫极魔瞳
                //this.subType = KeyWord.HERO_SUB_TYPE_FAZHEN;
            }
            else if (this._rankData.m_ucType == KeyWord.RANK_TYPE_JL) {
                this.subType = KeyWord.HERO_SUB_TYPE_JINGLING;
            }
            else if (this._rankData.m_ucType == KeyWord.RANK_TYPE_MR) {
                this.subType = KeyWord.HERO_SUB_TYPE_MEIREN;
            }
            else if (this._rankData.m_ucType == KeyWord.RANK_TYPE_WH) {
                this.subType = KeyWord.HERO_SUB_TYPE_WUHUN;
            }
            else if (this._rankData.m_ucType == KeyWord.RANK_TYPE_LL) {
                //鬼影迷踪
                //this.subType = KeyWord.HERO_SUB_TYPE_LEILING;
            }
            // else if (this._rankData.m_ucType == KeyWord.RANK_TYPE_HJ) {
            //     this.subType = KeyWord.HERO_SUB_TYPE_HUOJING;
            // }
            else if (this._rankData.m_ucType == KeyWord.RANK_TYPE_ZL) {
                this.subType = KeyWord.HERO_SUB_TYPE_ZHANLING;
            }
            //else if (this._rankData.m_ucType == KeyWord.RANK_TYPE_JIUXING) {
            //    this.subType = KeyWord.HERO_SUB_TYPE_TIANZHU;
            //}
            else if (this._rankData.m_ucType == KeyWord.RANK_TYPE_MAGIC) {
                //控鹤擒龙
                //this.subType = KeyWord.HERO_SUB_TYPE_TIANZHU;
            }


            //是祝福系统类型的
            if (this.subType > 0) {
                this.other.SetActive(true);
                let showModelId: number = this._rankData.m_stExtraInfo.m_stHeroSubInfo.m_uiShowID;
                let config: GameConfig.ZhuFuConfigM = G.DataMgr.zhufuData.getConfig(this.subType, showModelId);
                let imageConfig: GameConfig.ZhuFuImageConfigM;

                //等级
                let infoLevel = (this._rankData.m_llOrder1);
                let stageLevel = ZhufuData.getZhufuStage(infoLevel, this.subType);
                this.showLvOrJieJi(stageLevel);

                if (config) {
                    nameStr = config.m_szName;
                }
                else {
                    imageConfig = G.DataMgr.zhufuData.getImageConfig(showModelId);
                    if (defines.has('_DEBUG')) {
                        uts.assert(imageConfig != null, uts.format('祝福系统：{0}，模型：{1}。祝福配置表没有，化形配置表也没有，后台给的什么模型？', this.subType, showModelId));
                    }
                    nameStr = imageConfig.m_szModelName;
                }
                if (config != null) {
                    //普通 
                    this.gameIDType = GameIDType.OTHER_EQUIP;
                    if (this.subType == KeyWord.HERO_SUB_TYPE_WUHUN) {
                        this.keywordType = KeyWord.HERO_SUB_TYPE_WUHUN;
                        let type = UnitCtrlType.weapon;
                        let id = config.m_iModelID.toString() + "_" + this._rankData.m_stBaseProfile.m_cProfession;
                        this.updateCurrentModel(id, type, id);
                    }
                    else if (this.subType == KeyWord.HERO_SUB_TYPE_FAZHEN) {
                        this.keywordType = KeyWord.HERO_SUB_TYPE_FAZHEN;
                        let type = UnitCtrlType.zhenfa;
                        this.updateCurrentModel(config.m_iModelID.toString(), type, config.m_iModelID.toString());
                    }
                    else if (this.subType == KeyWord.HERO_SUB_TYPE_LEILING) {
                        this.keywordType = KeyWord.HERO_SUB_TYPE_LEILING;
                        let type = UnitCtrlType.shenji;
                        this.updateCurrentModel(config.m_iModelID.toString(), type, config.m_iModelID.toString());
                    }
                    else if (this.subType == KeyWord.HERO_SUB_TYPE_ZUOQI) {
                        this.keywordType = KeyWord.HERO_SUB_TYPE_ZUOQI;
                        let type = UnitCtrlType.ride;
                        this.updateCurrentModel(config.m_iModelID.toString(), type, config.m_iModelID.toString());
                    } else if (this.subType == KeyWord.HERO_SUB_TYPE_YUYI) {
                        this.keywordType = KeyWord.HERO_SUB_TYPE_YUYI;
                        let type = UnitCtrlType.wing;
                        this.updateCurrentModel(config.m_iModelID.toString(), type, config.m_iModelID.toString());
                    }
                }
                else if (imageConfig) {
                    //幻化 特殊 造型
                    this.other.SetActive(true);
                    this.gameIDType = GameIDType.OTHER_EQUIP;
                    if (this.subType == KeyWord.HERO_SUB_TYPE_WUHUN) {
                        this.keywordType = KeyWord.HERO_SUB_TYPE_WUHUN;
                        let type = UnitCtrlType.weapon;
                        let id = imageConfig.m_iModelID.toString() + "_" + this._rankData.m_stBaseProfile.m_cProfession;
                        this.updateCurrentModel(id.toString(), type, id.toString());
                    }
                    else if (this.subType == KeyWord.HERO_SUB_TYPE_FAZHEN) {
                        this.keywordType = KeyWord.HERO_SUB_TYPE_FAZHEN;
                        let type = UnitCtrlType.zhenfa;
                        this.updateCurrentModel(imageConfig.m_iModelID.toString(), type, imageConfig.m_iModelID.toString());
                    }
                    else if (this.subType == KeyWord.HERO_SUB_TYPE_LEILING) {
                        this.keywordType = KeyWord.HERO_SUB_TYPE_LEILING;
                        let type = UnitCtrlType.shenji;
                        this.updateCurrentModel(imageConfig.m_iModelID.toString(), type, imageConfig.m_iModelID.toString());
                    }
                    else if (this.subType == KeyWord.HERO_SUB_TYPE_ZUOQI) {
                        this.keywordType = KeyWord.HERO_SUB_TYPE_ZUOQI;
                        let type = UnitCtrlType.ride;
                        this.updateCurrentModel(imageConfig.m_iModelID.toString(), type, imageConfig.m_iModelID.toString());
                    } else if (this.subType == KeyWord.HERO_SUB_TYPE_YUYI) {
                        this.keywordType = KeyWord.HERO_SUB_TYPE_YUYI;
                        let type = UnitCtrlType.wing;
                        this.updateCurrentModel(imageConfig.m_iModelID.toString(), type, imageConfig.m_iModelID.toString());
                    }
                }
            }
            else if (this._rankData.m_ucType == KeyWord.RANK_TYPE_HONGYAN) {
                //武器缘分阶级             
                let stageLevel = this._rankData.m_stExtraInfo.m_stBeautyInfo.m_iTotalLayer;
                this.showLvOrJieJi(stageLevel);

                this.role.SetActive(false);
                this.other.SetActive(true);
                this.gameIDType = GameIDType.PET_EQUIP;
                nameStr = PetData.getPetConfigByPetID(this._rankData.m_stExtraInfo.m_stBeautyInfo.m_iPetID).m_szBeautyName;
                let petConfig: GameConfig.BeautyStageM;
                petConfig = PetData.getEnhanceConfig(this._rankData.m_stExtraInfo.m_stBeautyInfo.m_iPetID, this._rankData.m_stExtraInfo.m_stBeautyInfo.m_iPetLayer);
                petAttrConf = PetData.getPetConfigByPetID(this._rankData.m_stExtraInfo.m_stBeautyInfo.m_iPetID);
                let type = UnitCtrlType.pet;
                this.updateCurrentModel(petConfig.m_iModelID.toString(), type, petConfig.m_iModelID.toString());
                //this.m_tfGuild.text = '';
            } 
            else if (this._rankData.m_ucType == KeyWord.RANK_TYPE_FAQI) {
                this.other.SetActive(true);
                let faqiConfig: GameConfig.FaQiCfgM = G.DataMgr.fabaoData.getFaqiConfig(this._rankData.m_stExtraInfo.m_stFaQiInfo.m_ucShowId, 1);
                nameStr = faqiConfig.m_szName;
                let type = UnitCtrlType.faqi;
                this.updateCurrentModel(faqiConfig.m_iModelID.toString(), type, faqiConfig.m_iModelID.toString());
                this.txtName.text = nameStr;
                this.otherList.SetActive(false);
                this.showLvOrJieJi(this._rankData.m_llOrder1);
                return;
            }
            // else if (this._rankData.m_ucType == KeyWord.RANK_TYPE_JIUXING) {
            //     this.roleInfo.SetActive(false);
            //     this.ballList.SetActive(true);
            //     this.updateJiuxing(this._rankData);
            //     nameStr = this._rankData.m_stBaseProfile.m_szNickName;
            //     this.txtName.text = nameStr;
            //     this.showLvOrJieJi(this._rankData.m_llOrder1);
                // let showModelId: number = this._rankData.m_stExtraInfo.m_stHeroSubInfo.m_uiShowID;
                // let config: GameConfig.ZhuFuConfigM = G.DataMgr.zhufuData.getConfig(this.subType, showModelId);
                // let imageConfig: GameConfig.ZhuFuImageConfigM;
                // this.keywordType = KeyWord.HERO_SUB_TYPE_LEILING;
                // let type = UnitCtrlType.shenji;
                // this.updateCurrentModel(imageConfig.m_iModelID.toString(), type, imageConfig.m_iModelID.toString());
            //     return;
            // }
            //else if (this._rankData.m_ucType == KeyWord.RANK_TYPE_MAGIC) {
            //    this.other.SetActive(true);
            //    let stage = ZhufuData.getZhufuStage(this._rankData.m_llOrder1, KeyWord.OTHER_FUNCTION_MAGICCUBE);
            //    nameStr = uts.format("{0}阶星环", stage);
            //    G.ResourceMgr.loadModel(this.getModelRoot(UnitCtrlType.ride), UnitCtrlType.other, "model/magicCube/lifangti.prefab", this.sortingOrder);
            //    this.txtName.text = nameStr;
            //    this.otherList.SetActive(false);
            //    this.showLvOrJieJi(stage);
            //    return;
            //}

            //else if (this._rankData.m_ucType == KeyWord.RANK_TYPE_FZ) {
            //    this.role.SetActive(true);

            //    //魔瞳
            //    let data = this._rankData.m_stExtraInfo;
            //    this.roleAvatar.setAvataByList(data.m_stRoleInfo.m_stAvatarList, this._rankData.m_stBaseProfile.m_cProfession, this._rankData.m_stBaseProfile.m_cGender);
            //    this.roleAvatar.m_bodyMesh.playAnimation('stand');
            //    this.roleAvatar.m_rebirthMesh.setRotation(20, 0, 0);
            //    this.roleAvatar.setSortingOrder(this.sortingOrder);

            //}
            //else if (this._rankData.m_ucType == KeyWord.RANK_TYPE_LL) {
            //    this.role.SetActive(true);

            //    //迷踪
            //}
            //else if (this._rankData.m_ucType == KeyWord.RANK_TYPE_MAGIC) {
            //    this.role.SetActive(true);

            //    //擒龙
            //}

            else {
                this.role.SetActive(true);
                let hunhuanId = G.DataMgr.hunliData.hunhuanId;
                if (hunhuanId > 0) {
                    let config = G.DataMgr.hunliData.getHunHuanConfigById(hunhuanId);
                    let url = config.m_iModelID.toString();
                    G.ResourceMgr.loadModel(this.hunHuanRoot, UnitCtrlType.reactive, uts.format("model/hunhuan/{0}/{1}.prefab", url, url), this.sortingOrder);
                }
                nameStr = this._rankData.m_stBaseProfile.m_szNickName;
                this.setAvatarList();
                let titleId: number = this._rankData.m_stExtraInfo.m_stRoleInfo.m_iJuYuanID;
                if (this._rankData.m_ucType == KeyWord.RANK_TYPE_BATTLE || this._rankData.m_ucType == KeyWord.RANK_TYPE_SAIJI||this._rankData.m_ucType == KeyWord.RANK_TYPE_JIUXING) {
                    this.showLvOrJieJi(this._rankData.m_stBaseProfile.m_usLevel);
                }
                else if (this._rankData.m_ucType == KeyWord.RANK_TYPE_STRENGTH || this._rankData.m_ucType == KeyWord.RANK_TYPE_DIAMOND) {
                    this.showLvOrJieJi(this._rankData.m_stBaseProfile.m_usLevel);
                }
                else if (this._rankData.m_ucType == KeyWord.RANK_TYPE_FZ || this._rankData.m_ucType == KeyWord.RANK_TYPE_LL
                    || this._rankData.m_ucType == KeyWord.RANK_TYPE_MAGIC) {
                    this.showLvOrJieJi(this._rankData.m_stBaseProfile.m_usLevel);
                }
                else {
                    this.showLvOrJieJi(this._rankData.m_llOrder1);
                }
            }

            this.txtName.text = nameStr;
            let showEquipListType: number = this.getShowEquipListType();
            let cnt = EnumRankRule.getEquipNumByListType(showEquipListType);
            this._equipListData.length = 0;
            this.thingItemVo = {};
            for (let i = 0; i < cnt; i++) {
                let itemData = new RankEquipListItemData();
                this._equipListData.push(itemData);
                itemData.equipType = showEquipListType;
                itemData.subType = this.subType;
                let temp = new ThingItemData();
                temp.config = null;
                temp.data = null;
                this.thingItemVo[i] = temp;
            }

            let equipList: Protocol.ContainerThingInfo[] = this.getEquipList();
            if (showEquipListType == EnumRankRule.LIST_ROLE) {
                G.DataMgr.otherPlayerData.setRank(this._rankData.m_stExtraInfo.m_stRoleInfo);
            }

            if (!equipList)
                return;

            for (let oneThingInfo of equipList) {
                realPos = petAttrConf ? oneThingInfo.m_usPosition - petAttrConf.m_uiEquipPosition : oneThingInfo.m_usPosition;
                if (realPos >= 0 && realPos < cnt) {
                    itemVo = this._equipListData[realPos];
                    let temp: ThingItemData = new ThingItemData();
                    temp.config = ThingData.getThingConfig(oneThingInfo.m_iThingID);
                    temp.data = uts.deepcopy(oneThingInfo, this.thingItemVo[realPos].data, true);
                    this.thingItemVo[realPos] = temp;
                }
                else {
                    if (defines.has('_DEBUG')) {
                        uts.assert(false, uts.format('角色：{0}的装备ID：{1}位置为：{2}得到真实位置：{3}', this._rankData.m_stBaseProfile.m_szNickName, oneThingInfo.m_iThingID, oneThingInfo.m_usPosition, realPos));
                    }
                }
            }

            if (showEquipListType == EnumRankRule.LIST_ROLE) {
                this.updateRoleEquipUI();
            } else {
                this.updateEquipIcon();
            }
        }
    }


    /**
    * 更新九星显示
    */
    private updateJiuxing(data: Protocol.OneRankInfo): void {
        let jxData: JiuXingData = G.DataMgr.jiuXingData;
        let rankData: Protocol.ExtraJiuXingInfo = data.m_stExtraInfo.m_stJiuXingInfo;
        let skillId: number = 0;
        let skillMap: { [key: number]: number } = {};
        for (let i: number = 0; i < rankData.m_usNumber; i++) {
            skillId = rankData.m_iSkillID[i];
            skillMap[(Math.floor(skillId / 100) * 100 + 1)] = skillId;
        }
        let skillConfig: GameConfig.SkillConfigM;
        let skillList = G.DataMgr.jiuXingData.skillList;
        for (let i = 0; i < this.maxJiuXing; i++) {
            skillId = skillList[i];
            if ((skillMap[skillId]) > 0) {
                skillId = skillMap[skillId];
                skillConfig = SkillData.getSkillConfig(skillId);
                this.txtBallSkillList[i].color = Color.toUnityColor(Color.GREEN);
                this.txtBallSkillList[i].text = skillConfig.m_szSkillName + ' 等级:' + skillConfig.m_ushSkillLevel;
                UIUtils.setGrey(this.imgBallList[i], false, false);
            }
            else {
                skillConfig = SkillData.getSkillConfig(skillId);
                this.txtBallSkillList[i].text = skillConfig.m_szSkillName + '(未激活)';
                UIUtils.setGrey(this.imgBallList[i], true, false);
            }
        }
    }


    /**
   * 更新玩家装备显示
   */
    private updateRoleEquipUI() {
        let hunguObject = G.DataMgr.otherPlayerData.hunguData;
        // 先重置所有格子，锁定
        // 先重置所有格子，锁定
        let rawObj: ThingItemData;
        for (let i = 0; i < ThingData.All_HuGu_NUM; i++) {
            rawObj = hunguObject[i];
            if (null != rawObj) {
                this.listDataEquip[i].thingData = rawObj;
                this.listDataEquip[i].thingData.containerID = Macros.CONTAINER_TYPE_HUNGU_EQUIP;
            }
        }
        for (let i = 0; i < ThingData.All_HuGu_NUM; i++) {
            this.equipIcons[i].updateByThingItemData(this.listDataEquip[i].thingData);
            this.equipIcons[i].updateIcon();
        }
    }

    /**
     * 祝福类装备的显示
     */
    private updateEquipIcon(): void {
        //先全部隐藏，伙伴多2个
        for (let i = 0; i < this.zhufuEquipIcons.length; i++) {
            this.zhufuEquipIcons[i].SetActive(false);
        }
        if (this.gameIDType != GameIDType.INVALID) {
            //根据装备多少显示
            for (let i = 0; i < this._equipListData.length; i++) {
                this.zhufuEquipIcons[i].SetActive(true);
                let data = this.thingItemVo[i];
                this.zhufuIconItems[i].updateByThingItemData(data);
                this.zhufuIconItems[i].updateIcon();
            }
        }
    }

    /**更新当前阶级模型*/
    private updateCurrentModel(modelID: string, modelType: UnitCtrlType, modelUrl: string): void {
        G.ResourceMgr.loadModel(this.getModelRoot(modelType), modelType, modelUrl, this.sortingOrder, true);
    }
    /**
     * 得到模型的节点
     * @param modelType
     */
    private getModelRoot(modelType: UnitCtrlType): UnityEngine.GameObject {
        this.hideModelRoot(modelType);
        if (modelType == UnitCtrlType.ride) {
            return this.rideRoot;
        } else if (modelType == UnitCtrlType.wing) {
            return this.wingRoot;
        } else if (modelType == UnitCtrlType.weapon) {
            return this.weaponRoot;
        } else if (modelType == UnitCtrlType.pet) {
            return this.wuyuanRoot;
        } else if (modelType == UnitCtrlType.zhenfa) {
            return this.zhenfaRoot;
        } else if (modelType == UnitCtrlType.faqi) {
            return this.faqiRoot;
        } else if (modelType == UnitCtrlType.shenji) {
            return this.shenjiRoot;
        } else if (modelType == UnitCtrlType.hunhuan) {
            return this.hunHuanRoot;
        }

    }

    private hideModelRoot(modelType: UnitCtrlType) {
        this.rideRoot.SetActive(modelType == UnitCtrlType.ride);
        this.wingRoot.SetActive(modelType == UnitCtrlType.wing);
        this.weaponRoot.SetActive(modelType == UnitCtrlType.weapon);
        this.wuyuanRoot.SetActive(modelType == UnitCtrlType.pet);
        this.zhenfaRoot.SetActive(modelType == UnitCtrlType.zhenfa);
        this.faqiRoot.SetActive(modelType == UnitCtrlType.faqi);
        this.shenjiRoot.SetActive(modelType == UnitCtrlType.shenji)
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
                tmpVec = this._rankData.m_stExtraInfo.m_stRoleInfo.m_stThingInfoList.m_astThingInfo;
                break;
            case EnumRankRule.LIST_ZHU_FU:
                tmpVec = this._rankData.m_stExtraInfo.m_stHeroSubInfo.m_astThingInfo;
                break;
            case EnumRankRule.LIST_HONG_YAN:
                tmpVec = this._rankData.m_stExtraInfo.m_stBeautyInfo.m_astThingInfo;
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
        if (this.subType > 0) {
            return EnumRankRule.LIST_ZHU_FU;
        }
        else if (this._rankData.m_ucType == KeyWord.RANK_TYPE_HONGYAN) {
            return EnumRankRule.LIST_HONG_YAN;
        }
        else if (this._rankData.m_ucType == KeyWord.RANK_TYPE_FAQI) {
            return 0;
        }
        else {
            return EnumRankRule.LIST_ROLE;
        }
    }
}