import { UnitCtrlType } from 'System/constants/GameEnum';
import { UIUtils } from 'System/utils/UIUtils';
import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { Macros } from 'System/protocol/Macros'
import { TextTipData } from 'System/tip/tipData/TextTipData'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { Color } from 'System/utils/ColorUtil'
import { DataFormatter } from 'System/utils/DataFormatter'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { PinstanceData } from 'System/data/PinstanceData'
import { ActivityRuleView } from 'System/diandeng/ActivityRuleView'
import { List } from 'System/uilib/List';
import { ListItemCtrl } from 'System/uilib/ListItemCtrl';
import { ElemFinder } from 'System/uilib/UiUtility';
import { IconItem } from 'System/uilib/IconItem';
import { TipFrom } from 'System/tip/view/TipsView';
import { GameIDUtil } from 'System/utils/GameIDUtil';
import { HeroData } from 'System/data/RoleData';
import { CompareUtil } from 'System/utils/CompareUtil';
import { RankListItemData } from 'System/pinstance/selfChallenge/SelfChallengeRankView'
import { MonsterData } from 'System/data/MonsterData'
import { EnumMonsterID, EnumPinstanceRule, EnumGuide, EnumEffectRule } from 'System/constants/GameEnum'
class ShenXuanZhiLuItem {
    private id: number;
    private gamoObject: UnityEngine.GameObject;
    private bossImg: UnityEngine.GameObject;
    private txtLevel: UnityEngine.UI.Text;
    private lock:UnityEngine.GameObject;
    setComponents(go: UnityEngine.GameObject) {
        this.txtLevel = ElemFinder.findText(go, 'flag/txtLevel');
        this.bossImg = ElemFinder.findObject(go,'bossImg');
        this.lock = ElemFinder.findObject(go,'flag/lock');
    }

    update(level: number,isShowLock:boolean) {
        // if ((level) % 5 == 0) {
        //     //每五层是boss层
        //     this.txtLevel.gameObject.SetActive(false);
        // } else {
        //     this.txtLevel.gameObject.SetActive(true);
        // }
        this.txtLevel.text = (level).toString();
        this.bossImg.SetActive(!isShowLock&&((level) % 5==0));
        this.lock.SetActive(isShowLock);
        this.txtLevel.gameObject.SetActive((!isShowLock)&&((level) % 5!=0));
    }
    updateSelection(sele: UnityEngine.GameObject) {
        if (sele == null) return;

        sele.transform.SetParent(this.gamoObject.transform);
        sele.transform.localPosition = /*UnityEngine.Vector3.zero + */new UnityEngine.Vector3(-1, 0, 0);
    }
}

class SxzlRankItemData {
    rank: number = 0;
    level: number = 0;
    time: number = 0;
    name: string = "";
}

class SxzlRankItem extends ListItemCtrl {

    private txtLevel: UnityEngine.UI.Text;
    private txtRank: UnityEngine.UI.Text;
    private txtTime: UnityEngine.UI.Text;
    private txtName: UnityEngine.UI.Text;

    setComponents(go: UnityEngine.GameObject) {
        this.txtLevel = ElemFinder.findText(go, 'bg2/txtLevel');
        this.txtRank = ElemFinder.findText(go, 'bg2/txtRank');
        this.txtTime = ElemFinder.findText(go, 'bg2/txtTime');
        this.txtName = ElemFinder.findText(go, 'bg2/txtName');
    }

    update(data: SxzlRankItemData) {
        this.txtLevel.text = data.level.toString();
        this.txtRank.text = data.rank.toString();
        // this.txtTime.text = data.time.toString();
        this.txtName.text = data.name;
        this.txtTime.text = DataFormatter.second2hhmmss(data.time);
    }
}

/**
 * 神选之路
 * @author oliver
 */
export class ShenXuanZhiLuPanel extends TabSubForm {

    /**进入*/
     btnEnter: UnityEngine.GameObject;
    private itemIcon_Normal: UnityEngine.GameObject;

    private txtFight: UnityEngine.UI.Text = null;
    private txtCurLevel: UnityEngine.UI.Text = null;
    private txtEnter: UnityEngine.UI.Text = null;

    private diffConfigs: GameConfig.PinstanceDiffBonusM[] = [];
    private bg: UnityEngine.GameObject;

    private pinstanceList: List;
    private sxzlItems: ShenXuanZhiLuItem[] = [];
    /**缓存旧的index */
    private oldIndex: number = 0;
    private rewardList: List;
    private iconItems: IconItem[] = [];
    /**当前层数 */
    private curLevel: number = 0;
    private rankList: List;
    private sxzlRankItem: SxzlRankItem[] = [];
    /**当前显示数量 */
    private diffCount: number = 0;
    /**最多显示的层数 */
    private maxLevelCount = 17;
    /**选中状态 */
    private isShowReward: boolean = false;
    //点击之后显示的层数
    private itemLevel:UnityEngine.UI.Text;
    private txtDesc:UnityEngine.UI.Text;
    //特效
    private normalEffect:UnityEngine.GameObject;
    private moveEffect:UnityEngine.GameObject;
    private readonly ListSize = 7;
    constructor() {
        super(KeyWord.OTHER_FUNCTION_SXZL);
    }

    protected resPath(): string {
        return UIPathData.ShenXuanZhiLuView;
    }

    protected initElements() {
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        //按钮
        this.btnEnter = this.elems.getElement("btnEnter");

        this.txtFight = this.elems.getText("txtFight");
        this.txtCurLevel = this.elems.getText("txtCurLevel");
        this.txtEnter = this.elems.getText("txtEnter");
        this.bg = this.elems.getElement('bg');
        this.rewardList = this.elems.getUIList('rewardList');
        this.rankList = this.elems.getUIList('rankList');
        this.pinstanceList = this.elems.getUIList('pinstanceList');
        this.pinstanceList.MovementType = Game.FyScrollRect.MovementType.NoCross;
        //暂时去掉滑动时的特效
        // this.pinstanceList.BeginDragCallback = delegate(this, this.beginDragList);
        // this.pinstanceList.EndDragCallback = delegate(this, this.endDragList);
        this.itemLevel = this.elems.getText('itemLevel');
        this.txtDesc = this.elems.getText('txtDes');
        this.normalEffect = this.elems.getElement('noramlEffect');
        this.moveEffect = this.elems.getElement('moveEffect');
    }

    protected initListeners() {
        this.addClickListener(this.btnEnter, this.onEnterPinstance);
    }
    protected onOpen() {
        this.playEffect();
        this.isShowReward = false;//初始化
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_LIST, Macros.PINSTANCE_ID_SXZL));
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPinstanceHomeRequest(Macros.PINHOME_GET_RANKINFO, Macros.PINSTANCE_ID_SXZL));
        G.GuideMgr.processGuideNext(EnumGuide.ShenXuan, EnumGuide.ShenXuan_OpenPinstanceHallView);
    }
    private beginDragList(): void {
        this.playMoveEffect();
    }
    private endDragList(): void {
        this.addTimer('delay',1000,1,this.playEnd);
    }
    private onScrollValueChange(): void {
        let showLevel = this.curLevel + ((this.maxLevelCount - this.pinstanceList.FirstShowIndex) - this.ListSize) + 1;
        this.itemLevel.text = (showLevel).toString();
        this.txtCurLevel.text = uts.format('第{0}层', (showLevel));
        this.onClickPinstanceItem(showLevel);
    }
    updateView(): void {
        let pinstanceId = Macros.PINSTANCE_ID_SXZL;
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(pinstanceId);
        if (info == null) {
            return;
        }
        this.diffConfigs = PinstanceData.getDiffBonusConfigs(pinstanceId);
        if (this.diffConfigs == null) {
            return;
        }
        this.curLevel = info.m_uiCurLevel;
        //判断按钮状态
        let nextCfg = PinstanceData.getDiffBonusData(pinstanceId, this.curLevel + 1);//下级配置
        if (nextCfg) {
            if (G.DataMgr.heroData.level >= nextCfg.m_iOpenLevel) {
                this.txtEnter.text = uts.format('挑战第{0}层',(this.curLevel+1));
                UIUtils.setButtonClickAble(this.btnEnter, true);
            } else {
                this.txtEnter.text = uts.format("{0}级开启", nextCfg.m_iOpenLevel);
                UIUtils.setButtonClickAble(this.btnEnter, false);
            }
        } else {
            this.txtEnter.text = "已通关";
            UIUtils.setButtonClickAble(this.btnEnter, false);
        }
       
        //默认选择可进入的层数
        let autoIdx = 0;//跳转索引
        let rewardIndex: number = 4;//选中索引
        this.diffCount = 10;//当前层数为0时，默认显示10个
        if (this.curLevel > 0) {
            //玩家最多只能显示到当前最高通关层数的下一页，不可以无穷尽翻页到最后一关
            this.diffCount = Math.min(this.diffConfigs.length, Math.ceil(this.curLevel / this.ListSize + 1) * this.ListSize);//list显示数量
            if (this.curLevel < this.diffConfigs.length) {
                autoIdx = this.curLevel;//跳到能打的层（当前层+1）//this.curLevel - 1;
                rewardIndex = this.curLevel + (this.ListSize - this.curLevel % this.ListSize) - 1;//跳到boss层
            } else {
                // 全部通关了，显示最后一层
                rewardIndex = autoIdx = this.diffConfigs.length - 1;
                this.curLevel = this.diffConfigs.length;
            }
        }
        //如果满层
        if (this.curLevel == 100) {
            this.maxLevelCount = 7;
            this.txtCurLevel.text = '第100层';
            this.itemLevel.text = (this.curLevel).toString();
            this.onClickPinstanceItem(this.curLevel);
        }else{
            if (this.curLevel+1>90&&this.curLevel<100) {
                this.maxLevelCount = (100 - this.curLevel)+6;
            }
            this.txtCurLevel.text = uts.format('第{0}层', (this.curLevel+1));
            this.itemLevel.text = (this.curLevel+1).toString();
            this.pinstanceList.OnScrollValueChange = delegate(this, this.onScrollValueChange);
        }
        //最多显示15层，从当前层开始
        this.pinstanceList.Count = this.maxLevelCount;
        for (let i = 0; i < this.maxLevelCount; i++) {
            if (this.sxzlItems[i] == null) {
                let item = this.pinstanceList.GetItem(i);
                this.sxzlItems[i] = new ShenXuanZhiLuItem();
                this.sxzlItems[i].setComponents(item.gameObject);
            }
            if (i < 5) {
                this.sxzlItems[i].update(this.curLevel + (this.maxLevelCount - i) - 1, true);
            } else {
                this.sxzlItems[i].update(this.curLevel+(this.maxLevelCount-i)-1,false);
            }
        }
        this.pinstanceList.ScrollBottom();//跳转到当前层
        this.updateRankList();
    }
    protected onClose() {
    }
    //进入副本
     onEnterPinstance(): void {
        let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_SXZL);
        if (info == null) {
            return;
        }
        let fight: number = G.DataMgr.heroData.fight;
        let nextCfg = PinstanceData.getDiffBonusData(Macros.PINSTANCE_ID_SXZL, info.m_uiCurLevel + 1);
        if (fight < nextCfg.m_iFightPower) {
            G.TipMgr.showConfirm('当前战力远低于推荐通关战力，副本难度较大，是否继续挑战？',
                ConfirmCheck.noCheck,
                '是|否',
                delegate(this, this.onConfirmClick));
        } else {
            G.ModuleMgr.pinstanceModule.tryEnterPinstance(Macros.PINSTANCE_ID_SXZL, info.m_uiCurLevel + 1);
         }
         G.GuideMgr.processGuideNext(EnumGuide.ShenXuan, EnumGuide.ShenXuan_ClickEnter);
    }
    private onConfirmClick(stage: number): void {
        if (MessageBoxConst.yes == stage) {
            let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_SXZL);
            G.ModuleMgr.pinstanceModule.tryEnterPinstance(Macros.PINSTANCE_ID_SXZL, info.m_uiCurLevel + 1);
        }
    }
    /**
    * 点击副本item
    * @param index
    */
    private onClickPinstanceItem(index: number) {
        if (this.diffConfigs[index-1] != null) {
            this.txtDesc.text = this.diffConfigs[index-1].m_szDesc;
        }
        else {
            this.txtDesc.text = "";
        }
        if (this.oldIndex == index) {
            //点击相同的item才切换显示
            this.isShowReward = !this.isShowReward;
        } else {
            this.isShowReward = true;
        }
        let config = this.diffConfigs[index-1];
        let heroFight = G.DataMgr.heroData.fight;
        this.txtFight.text = uts.format("推荐战力: {0}", TextFieldUtil.getColorText(config.m_iFightPower.toString(), config.m_iFightPower > heroFight ? "FF0000" : "00FF00"));
        if (this.curLevel >= config.m_iDiff) {
            this.oldIndex = index;
        }
        //更新奖励
        this.updateReward(config);
        this.oldIndex = index;

    }

   
    /**播放特效 */
    private playEffect(){
        G.ResourceMgr.loadModel(this.normalEffect, UnitCtrlType.other, "effect/uitx/shenxuan/shenxuanzt.prefab", this.sortingOrder+2);
    }

    /**往下滑的时候播放特效 */
    private playMoveEffect(){
        this.moveEffect.gameObject.SetActive(true);
        G.ResourceMgr.loadModel(this.moveEffect, UnitCtrlType.other, "effect/uitx/shenxuan/sxbaokai.prefab", this.sortingOrder+2);
    }
    private playEnd(){
        this.moveEffect.gameObject.SetActive(false);
    }
    private updateReward(config: GameConfig.PinstanceDiffBonusM) {
        this.rewardList.Count = config.m_stLifeBonus.length;
        for (let i = 0; i < this.pinstanceList.Count; i++) {
            let cfg = config.m_stLifeBonus[i];
            if (cfg == null) {
                continue;
            }
            if (this.iconItems[i] == null) {
                let item = this.rewardList.GetItem(i);
                this.iconItems[i] = new IconItem();
                this.iconItems[i].setUsualIconByPrefab(this.itemIcon_Normal, item.gameObject);
                this.iconItems[i].setTipFrom(TipFrom.normal);
            }
            this.iconItems[i].updateById(cfg.m_iThingId, cfg.m_iThingNum);
            this.iconItems[i].updateIcon();
        }
    }

    private updateRankList(): void {
        let passInfo: Protocol.RankPinInfo = G.DataMgr.pinstanceData.getPinstanceRankInfo(Macros.PINSTANCE_ID_SXZL);
        if (!passInfo) {
            return;
        }
        let len: number = passInfo.m_stRankInfoList.length;
        if (len == 0) {
            this.bg.SetActive(true);
        } else {
            this.bg.SetActive(false);
        }
        if (len > EnumPinstanceRule.SXZL_ALL_RANK_MAX_COUNT) {
            this.rankList.Count = EnumPinstanceRule.SXZL_ALL_RANK_MAX_COUNT;
        } else {
            this.rankList.Count = len;
        }
        for (let i: number = 0; i < len; i++) {
            let rankOne: Protocol.OneAllRankInfo = passInfo.m_stRankInfoList[i];
            if (GameIDUtil.isRoidIsPeople(rankOne.m_stRoleID)) {
                if (i < EnumPinstanceRule.SXZL_ALL_RANK_MAX_COUNT) {
                    if (this.sxzlRankItem[i] == null) {
                        let item = this.rankList.GetItem(i);
                        this.sxzlRankItem[i] = new SxzlRankItem();
                        this.sxzlRankItem[i].setComponents(item.gameObject);
                    }
                    let itemVo: SxzlRankItemData = new SxzlRankItemData();
                    itemVo.name = rankOne.m_szNickName;
                    itemVo.level = rankOne.m_usPinLv;
                    itemVo.time = rankOne.m_uiTime;
                    itemVo.rank = i + 1;
                    this.sxzlRankItem[i].update(itemVo);
                }
            }
        }
    }
}
