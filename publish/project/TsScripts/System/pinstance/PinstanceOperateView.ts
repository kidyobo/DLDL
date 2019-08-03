import { Global as G } from 'System/global'
import { NestedSubForm } from 'System/uilib/NestedForm'
import { UIPathData } from 'System/data/UIPathData'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { GroupList } from 'System/uilib/GroupList'
import { ElemFinder } from 'System/uilib/UiUtility'
import { EnumGuide, FindPosStrategy } from 'System/constants/GameEnum'
import { MonsterData } from 'System/data/MonsterData'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { TipFrom } from 'System/tip/view/TipsView'
import { Constants } from 'System/constants/Constants'
import { EnumMainViewChild } from 'System/main/view/MainView'
import { GuildTools } from 'System/guild/GuildTools'
import { MapId } from 'System/map/MapId'
import { BossView } from 'System/pinstance/boss/BossView'
import { StrategyView } from 'System/activity/view/StrategyView'
import { DataFormatter } from 'System/utils/DataFormatter'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { ConfirmCheck } from 'System/tip/TipManager'
import { Color } from 'System/utils/ColorUtil'
import { MessageBoxConst } from 'System/tip/TipManager'
import { GameObjectGetSet } from '../uilib/CommonForm';

class PinstanceBossItem extends ListItemCtrl {
    info: { m_iPosX: number, m_iPosY: number, m_uiMonstID: number, m_ucIsKilled: number };

    private head: UnityEngine.GameObject;
    private bossHeadImg: UnityEngine.UI.RawImage;
    private noHead: UnityEngine.GameObject;
    private dead: UnityEngine.GameObject;
    private textName: UnityEngine.UI.Text;
    private textTime: UnityEngine.UI.Text;

    private hpBar: UnityEngine.GameObject;
    private hpBarContent: UnityEngine.GameObject;

    gameObject: UnityEngine.GameObject;
    bossId = 0;

    constructor() {
        super();
    }

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;
        let wrapper = ElemFinder.findObject(go, 'wrapper');

        this.head = ElemFinder.findObject(wrapper, 'head');
        this.bossHeadImg = ElemFinder.findRawImage(this.head, 'head/bossHead');
        this.noHead = ElemFinder.findObject(this.head, 'noHead');
        this.dead = ElemFinder.findObject(wrapper, 'dead');
        this.textName = ElemFinder.findText(wrapper, 'textName');
        this.textTime = ElemFinder.findText(wrapper, 'textTime');

        this.hpBar = ElemFinder.findObject(wrapper, 'hpBar');
        this.hpBarContent = ElemFinder.findObject(this.hpBar, 'bar');
    }

    init(bossId: number) {
        if (this.bossId != bossId) {
            this.bossId = bossId;
            let cfg = MonsterData.getMonsterConfig(bossId);
            if (Macros.PINSTANCE_ID_HOME_BOSS == G.DataMgr.sceneData.curPinstanceID) {
                //boss之家
                this.textName.text = 'Lv.' + cfg.m_usLevel + '\n' + cfg.m_szMonsterName;
            } else {
                this.textName.text = cfg.m_szMonsterName;
            }
            // 加载头像
            if (cfg.m_iHeadID > 0) {
                let url = 'images/head/{0}.png';
                if (Macros.PINSTANCE_ID_HOME_BOSS == G.DataMgr.sceneData.curPinstanceID) {
                    url = 'images/vipBossHead/{0}.png';
                    G.ResourceMgr.loadImage(this.bossHeadImg, uts.format(url, cfg.m_iHeadID));
                } else {
                    G.ResourceMgr.loadImage(this.bossHeadImg, uts.format(url, cfg.m_iHeadID));
                }
                this.bossHeadImg.gameObject.SetActive(true);
                this.noHead.SetActive(false);
            } else {
                this.bossHeadImg.gameObject.SetActive(false);
                this.noHead.SetActive(true);
            }
        }
    }

    update(info: { m_iPosX: number, m_iPosY: number, m_uiMonstID: number, m_ucIsKilled: number }, camp: number, hp: number, refreshTime: number) {
        let bossName: string;
        if (camp > 0) {
            let c = ['魅', '魔', '仙', '神', '凡'];
            let cfg = MonsterData.getMonsterConfig(info.m_uiMonstID);
            this.textName.text = uts.format('{0}·{1}', c[camp - 11], cfg.m_szMonsterName);
        }

        this.head.SetActive(0 == info.m_ucIsKilled);
        this.dead.SetActive(0 != info.m_ucIsKilled);

        if (0 != info.m_ucIsKilled && refreshTime > 0) {
            // 显示倒计时
            let leftSecond = Math.max(0, refreshTime - Math.round(G.SyncTime.getCurrentTime() / 1000));
            //this.textTime.text = DataFormatter.second2mmss(leftSecond);
            this.textTime.text = DataFormatter.second2hhmmss(leftSecond);
            this.textTime.gameObject.SetActive(true);
            this.hpBar.SetActive(false);
        } else {
            // 显示血条
            this.textTime.gameObject.SetActive(false);
            if (hp >= 0) {
                this.hpBarContent.transform.localScale = G.getCacheV3(hp / 100, 1, 1);
                this.hpBar.SetActive(true);
            } else {
                this.hpBar.SetActive(false);
            }
        }
        this.info = info;
    }
}

class ZhenLongQiJuItem extends ListItemCtrl {
    info: { m_iPosX: number, m_iPosY: number, m_uiMonstID: number, m_ucIsKilled: number };

    private textTime: UnityEngine.UI.Text;

    gameObject: UnityEngine.GameObject;
    bossId = 0;

    constructor() {
        super();
    }

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;
        let wrapper = ElemFinder.findObject(go, 'wrapper');

        this.textTime = ElemFinder.findText(wrapper, 'textTime');
    }

    update(info: { m_iPosX: number, m_iPosY: number, m_uiMonstID: number, m_ucIsKilled: number }, camp: number, hp: number, refreshTime: number) {
        if (0 != info.m_ucIsKilled && refreshTime > 0) {
            // 显示倒计时
            let leftSecond = refreshTime - Math.round(G.SyncTime.getCurrentTime() / 1000);
            this.textTime.text = DataFormatter.second2mmss(leftSecond);
            this.textTime.gameObject.SetActive(true);
        } else {
            this.textTime.gameObject.SetActive(false);
        }
        this.info = info;
    }
}

export class PinstanceOperateView extends NestedSubForm {
    private readonly TickTimerKey = '1';

    private readonly PiLaoZhiMinY = -64;
    private readonly PiLaoZhiMaxY = 0;

    /**棋子、守卫、黑棋阵营、白棋阵营*/
    private readonly ZhenLongQiJuMonsterIds: number[] = [31290001, 31290002, 31290005, 31290006];

    private left: UnityEngine.GameObject;
    private down: UnityEngine.GameObject;

    private btnExit: UnityEngine.GameObject;
    private pos: UnityEngine.GameObject;
    //private btnSummon: UnityEngine.GameObject;
    private btnCallPartner: UnityEngine.GameObject;
    //private btnDiGong: UnityEngine.GameObject;
    private btnStrategy: UnityEngine.GameObject;

    private bossItems: PinstanceBossItem[] = [];
    private bossTemplate: UnityEngine.GameObject;

    private piLaoZhi: UnityEngine.GameObject;
    private textPlz: UnityEngine.UI.Text;
    private piLaoZhiAnim: UnityEngine.GameObject;

    /**西洋棋*/
    private zlqj: UnityEngine.GameObject;
    private zlqjItems: { [id: number]: ZhenLongQiJuItem } = {};

    /**经验副本*/
    private jyfb: UnityEngine.GameObject;
    private jyfbBar: UnityEngine.GameObject;
    private tip: GameObjectGetSet;
    private btnCloseTip: UnityEngine.GameObject;
    private textJyfbExp: UnityEngine.UI.Text;
    private btnActiveJyfb: UnityEngine.GameObject;
    private fireBar: UnityEngine.GameObject;
    private fireBarActive: UnityEngine.GameObject;

    private leftPosition: UnityEngine.Vector3;
    private downPosition: UnityEngine.Vector3;

    private isStatDirty = false;
    private isFatigueDirty = false;
    private isDblExpDirty = false;
    private jyfbStatus = -1;
    private needRefreshDblExpEff = true;
    private isShowTip = true;
    private dblPrice = 0;

    constructor() {
        super(EnumMainViewChild.pinstanceOperate);
    }

    protected resPath(): string {
        return UIPathData.PinstanceOperateView;
    }

    protected initElements() {
        this.left = this.elems.getElement('left');
        this.down = this.elems.getElement('down');

        this.btnExit = this.elems.getElement('btnExit');
        //this.btnSummon = this.elems.getElement('btnSummon');
        this.btnCallPartner = this.elems.getElement('btnCallPartner');
        //this.btnDiGong = this.elems.getElement('btnDiGong');
        this.btnStrategy = this.elems.getElement('btnStrategy');

        this.bossTemplate = this.elems.getElement('bossTemplate');
        this.bossTemplate.SetActive(false);
        this.addBossItem(this.bossTemplate, 0);

        this.piLaoZhi = this.elems.getElement('piLaoZhi');
        this.textPlz = this.elems.getText('textPlz');
        this.piLaoZhiAnim = this.elems.getElement('piLaoZhiAnim');

        this.zlqj = this.elems.getElement('zlqj');
        for (let id of this.ZhenLongQiJuMonsterIds) {
            // 守卫有2只，所以每个id都尝试加上后缀_2找一下
            this.tryGetZlqjItem(id.toString());
            this.tryGetZlqjItem(id + '_2');
        }

        this.jyfb = this.elems.getElement('jyfb');
        let jyfbElems = this.elems.getUiElements('jyfb');
        this.tip = new GameObjectGetSet(this.elems.getElement('tip'));
        this.btnCloseTip = this.elems.getElement('btnCloseTip');
        this.jyfbBar = jyfbElems.getElement('bar');
        this.textJyfbExp = jyfbElems.getText('textExp');
        this.btnActiveJyfb = jyfbElems.getElement('btnActive');
        this.fireBar = jyfbElems.getElement('fireBar');
        this.fireBarActive = jyfbElems.getElement('fireBarActive');
        this.fireBarActive.SetActive(false);
        // 设置双倍扫荡价格
        this.dblPrice = G.DataMgr.constData.getValueById(KeyWord.PARAM_SHNS_DOUBLE_EXP_PRICE);
        let textDblPrice = jyfbElems.getText('textDblPrice');
        textDblPrice.text = this.dblPrice.toString();

        this.leftPosition = this.left.transform.localPosition;
        this.downPosition = this.down.transform.localPosition;
        this.pos = this.elems.getElement('pos');
    }

    private tryGetZlqjItem(name: string) {
        let go = ElemFinder.findObject(this.zlqj, name);
        if (null != go) {
            let zlqjItem = new ZhenLongQiJuItem();
            zlqjItem.setComponents(go);
            this.zlqjItems[name] = zlqjItem;
        }
    }

    protected initListeners() {
        this.addClickListener(this.btnExit, this.onClickBtnExit);
        //this.addClickListener(this.btnSummon, this.onClickBtnSummon);
        this.addClickListener(this.btnCallPartner, this.onClickCallPartner);
        //this.addClickListener(this.btnDiGong, this.onClickBtnDiGong);
        this.addClickListener(this.btnStrategy, this.onClickBtnStrategy);
        for (let idKey in this.zlqjItems) {
            let zlqjItem = this.zlqjItems[idKey];
            this.addClickListener(zlqjItem.gameObject, delegate(this, this.onClickZlqj, zlqjItem));
        }
        this.addClickListener(this.btnActiveJyfb, this.onClickBtnActiveJyfb);
        this.addClickListener(this.btnCloseTip, this.onClickBtnCloseTip);
        
    }
    protected onClose() {

    }

    protected onOpen() {
        this.reset();
        this.showConfirm();
    }


    private showConfirm() {
        if (G.DataMgr.sceneData.curPinstanceID == Macros.PINSTANCE_ID_SHNS) {
            if (G.MainBtnCtrl.IsOpened)
                G.MainBtnCtrl.onClickBtnSwitcher();
            //let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_SHNS);
            // if (null != info)
            //     if (info.m_ucExpPinDouble == 0) {
            //         this.tip.SetActive(true);
            //     } else {
            //         this.tip.SetActive(false);
            //     }
            this.isShowTip = true;
        }
    }
    private doBuyExpPinDouble(stage: MessageBoxConst, isCheckSelected: boolean): void {
        if (MessageBoxConst.yes == stage) {
            this.onClickBtnActiveJyfb()
        }
    }

    reset() {
        this.isStatDirty = false;
        this.isFatigueDirty = false;
        this.isDblExpDirty = false;
        this.jyfbStatus = -1;
        this.needRefreshDblExpEff = true;
        let sceneData = G.DataMgr.sceneData;
        let point = this.pos.transform.position;
        if (MapId.isLuori()) {
            this.btnExit.transform.position = new UnityEngine.Vector3(point.x,point.y-0.5,point.z);
        }else{
            this.btnExit.transform.position = point;
        }
        this.onGuildGradeChanged();
        this.left.SetActive(false);
        if (Macros.PINSTANCE_ID_ZLQJ == sceneData.curPinstanceID) {
            // 西洋棋左侧显示自定义的ui
            this.zlqj.SetActive(true);
            //this.btnDiGong.SetActive(false);
            this.piLaoZhi.SetActive(false);
            this.jyfb.SetActive(false);

            for (let idKey in this.zlqjItems) {
                let item = this.zlqjItems[idKey];
                item.gameObject.SetActive(false);
            }
        }
        else if (Macros.PINSTANCE_ID_DIGONG == sceneData.curPinstanceID) {
            // 地宫副本内显示boss按钮和疲劳值
            this.zlqj.SetActive(false);
            //this.btnDiGong.SetActive(true);
            this.piLaoZhi.SetActive(false);
            this.jyfb.SetActive(false);
            this.updateFatigue();
        }
        else if (Macros.PINSTANCE_ID_SHNS == sceneData.curPinstanceID) {
            // 经验副本显示经验条
            this.zlqj.SetActive(false);
            //this.btnDiGong.SetActive(false);
            this.piLaoZhi.SetActive(false);
            this.jyfb.SetActive(true);
            this.updateDblExp();
        }
        else {
            this.zlqj.SetActive(false);
            //this.btnDiGong.SetActive(false);
            this.piLaoZhi.SetActive(false);
            this.jyfb.SetActive(false);

            for (let item of this.bossItems) {
                item.info = null;
                item.gameObject.SetActive(false);
            }
        }
        // 若该场景配了攻略则显示攻略按钮
        let sceneCfg = sceneData.getSceneInfo(sceneData.curSceneID).config;
        this.btnStrategy.SetActive(null != sceneCfg.m_szStrategy && '' != sceneCfg.m_szStrategy);
        // 世界boss里因为有黑洞塔按钮，所以退出按钮显示在左侧，其他场景都是副本，没有黑洞塔按钮，故显示在下方
        if (Macros.PINSTANCE_ID_WORLDBOSS == G.DataMgr.sceneData.curPinstanceID) {
            Game.Tools.SetLocalPosition(this.down.transform, this.leftPosition);
        } else {
            Game.Tools.SetLocalPosition(this.down.transform, this.downPosition);
        }
        // 刷新boss
        this.onRightInfoChanged();
    }

    onRightInfoChanged() {
        this.isStatDirty = true;
    }

    onDiGongFatigueChanged() {
        this.isFatigueDirty = true;
    }

    onDoubleExpChanged() {
        this.isDblExpDirty = true;
    }

    onGuildGradeChanged() {
        // 宗主显示召集按钮
        let showSummon = false;
        let heroData = G.DataMgr.heroData;
        let sceneData = G.DataMgr.sceneData;
        //if (heroData.guildId > 0 && heroData.isManager) {
        //    if (heroData.isManager)
        //        showSummon = (Macros.PINSTANCE_ID_WORLDBOSS == sceneData.curPinstanceID || MapId.isZMMJMapId(sceneData.curSceneID));
        //}
        //this.btnSummon.SetActive(showSummon);
        this.btnCallPartner.SetActive(Macros.PINSTANCE_ID_XZFM == sceneData.curPinstanceID && heroData.guildId > 0);
    }

    checkUpdate() {
        if (!this.isOpened) {
            return;
        }
        if (this.isStatDirty) {
            this.updateMonsters();
            this.isStatDirty = false;
        }
        if (this.isFatigueDirty) {
            this.updateFatigue();
            this.isFatigueDirty = false;
        }
        if (this.isDblExpDirty) {
            this.updateDblExp();
            this.isDblExpDirty = false;
        }
    }

    private updateMonsters() {
        let rightInfo = G.DataMgr.pinstanceData.rightInfo;
        if (rightInfo == null) {
            return false;
        }
        let count = rightInfo.m_ucNum;
        let monsterCnt = 0;
        let monsterType = 0;
        let monsters: Protocol.SceneInfoOneMonster[];
        let bloodMonsters: Protocol.SceneInfoOneBloodMonster[];

        for (let i: number = 0; i < count; i++) {
            let oneRightInfo = rightInfo.m_astData[i];
            if (oneRightInfo.m_ucType == Macros.SCENERIGHT_MONSTER) {
                monsterType = oneRightInfo.m_ucType;
                let monsterInfos = oneRightInfo.m_stValue.m_stMonster;
                monsterCnt = monsterInfos.m_ucNum;
                monsters = monsterInfos.m_astInfo;
            } else if (oneRightInfo.m_ucType == Macros.SCENERIGHT_BLOOD_MONSTER) {
                monsterType = oneRightInfo.m_ucType;
                let monsterInfos = oneRightInfo.m_stValue.m_stBloodMonster;
                monsterCnt = monsterInfos.m_ucNum;
                bloodMonsters = monsterInfos.m_astInfo;
            }

            if (null != monsters) {
                break;
            }
        }

        let needCountDown = false;
        if (Macros.PINSTANCE_ID_ZLQJ == G.DataMgr.sceneData.curPinstanceID) {
            // 西洋棋的怪物id可能有重复的，比如守卫
            let idCount: { [id: number]: number } = {};
            let showMap: { [name: string]: boolean } = {};
            for (let i = 0; i < monsterCnt; i++) {
                let bossOneInfo = monsters[i];
                if (bossOneInfo.m_ucIsKilled != 0 && bossOneInfo.m_iRevaveTime > 0) {
                    needCountDown = true;
                }
                let oldShowNum = idCount[bossOneInfo.m_uiMonstID];
                if (undefined == oldShowNum) {
                    oldShowNum = 0;
                }
                idCount[bossOneInfo.m_uiMonstID] = oldShowNum + 1;
                let itemKey = bossOneInfo.m_uiMonstID.toString();
                if (oldShowNum > 0) {
                    itemKey += '_' + (oldShowNum + 1);
                }
                showMap[itemKey] = true;
                let item = this.zlqjItems[itemKey];
                if (item) {
                    item.update(bossOneInfo, -1, -1, bossOneInfo.m_iRevaveTime);
                    item.gameObject.SetActive(true);
                }
            }
            for (let idKey in this.zlqjItems) {
                if (undefined == showMap[idKey]) {
                    let item = this.zlqjItems[idKey];
                    item.gameObject.SetActive(false);
                }
            }
        } else {
            //屏蔽右上角的头像
            // let oldBossIconCnt = this.bossItems.length;
            // for (let i = 0; i < monsterCnt; i++) {
            //     let item: PinstanceBossItem;
            //     if (i < oldBossIconCnt) {
            //         item = this.bossItems[i];
            //     } else {
            //         let itemGo = UnityEngine.GameObject.Instantiate(this.bossTemplate, this.left.transform, true) as UnityEngine.GameObject;
            //         item = this.addBossItem(itemGo, i);
            //     }
            //     item.gameObject.SetActive(true);

            //     if (monsterType == Macros.SCENERIGHT_MONSTER) {
            //         let bossOneInfo = monsters[i];
            //         item.init(bossOneInfo.m_uiMonstID);
            //         item.update(bossOneInfo, -1, -1, bossOneInfo.m_iRevaveTime);
            //         if (bossOneInfo.m_ucIsKilled != 0 && bossOneInfo.m_iRevaveTime > 0) {
            //             needCountDown = true;
            //         }
            //     } else {
            //         let bossOneInfo = bloodMonsters[i];
            //         item.init(bossOneInfo.m_uiMonstID);
            //         item.update(bossOneInfo, bossOneInfo.m_ucCamp, bossOneInfo.m_iBloodVolume, 0);
            //     }
            // }
            // for (let i = monsterCnt; i < oldBossIconCnt; i++) {
            //     let item = this.bossItems[i];
            //     item.info = null;
            //     item.gameObject.SetActive(false);
            // }
            // this.left.SetActive(monsterCnt > 0);
        }

        if (needCountDown) {
            this.addTimer(this.TickTimerKey, 1000, 0, this.onUpdateTimer);
        } else {
            this.removeTimer(this.TickTimerKey);
        }
    }

    private onUpdateTimer() {
        this.updateMonsters();
    }

    private addBossItem(itemGo: UnityEngine.GameObject, index: number): PinstanceBossItem {
        let item = new PinstanceBossItem();
        this.bossItems.push(item);
        item.setComponents(itemGo);
        Game.UIClickListener.Get(itemGo).onClick = delegate(this, this.onClickBoss, index);
        return item;
    }

    private onClickBtnExit() {
        if (MapId.isLuori()&&G.DataMgr.sceneData.curPinstanceID != 300063){
            if (G.Mapmgr.isPathing) {
                 // 清除任务标记
                 G.DataMgr.runtime.resetAllBut();
                 // 停止自动寻路
                 G.Mapmgr.stopAutoPath();
            }
            G.Mapmgr.goToPos(G.DataMgr.sceneData.curSceneID, 3888,10305, false);
        }else{
            G.ModuleMgr.pinstanceModule.onClickQuitPinstance(false);
        }
    }

    //private onClickBtnSummon() {
    //    GuildTools.summonGuildMembers();
    //}

    private onClickCallPartner() {
        GuildTools.callGuildMembers();
    }

    private onClickBtnDiGong() {
        G.Uimgr.createForm<BossView>(BossView).open(KeyWord.OTHER_FUNCTION_DI_BOSS);
    }

    private onClickBtnStrategy() {
        let sceneData = G.DataMgr.sceneData;
        let sceneCfg = sceneData.getSceneInfo(sceneData.curSceneID);
        let content = sceneCfg.config;

        if (null != content) {
            G.Uimgr.createForm<StrategyView>(StrategyView).open(content);
        }
    }

    private onClickBoss(bossIndex: number) {
        let bossItem = this.bossItems[bossIndex];
        let bossOneInfo = bossItem.info;
        let bosscfg = MonsterData.getMonsterConfig(bossOneInfo.m_uiMonstID);
        if (G.DataMgr.heroData.fight < bosscfg.m_iFightPoint) {
            let msg = uts.format('此BOSS推荐战力{0}，高于您当前战力，是否确定前往挑战？', TextFieldUtil.getColorText(bosscfg.m_iFightPoint.toString(), Color.RED));
            //提示
            G.TipMgr.showConfirm(msg, ConfirmCheck.noCheck, '确定|取消', delegate(this, (state: number) => {
                if (MessageBoxConst.yes == state) {
                    if (null != bossOneInfo && bossOneInfo.m_iPosX > 0 && bossOneInfo.m_iPosY > 0) {
                        G.Mapmgr.goToPos(G.DataMgr.sceneData.curSceneID, bossOneInfo.m_iPosX, bossOneInfo.m_iPosY, false, true, FindPosStrategy.FindSuitableAround, bossOneInfo.m_uiMonstID, true);
                    }
                }
            }));
        }
        else {
            if (null != bossOneInfo && bossOneInfo.m_iPosX > 0 && bossOneInfo.m_iPosY > 0) {
                G.Mapmgr.goToPos(G.DataMgr.sceneData.curSceneID, bossOneInfo.m_iPosX, bossOneInfo.m_iPosY, false, true, FindPosStrategy.FindSuitableAround, bossOneInfo.m_uiMonstID, true);
            }
        }
    }

    private onClickZlqj(zlqjItem: ZhenLongQiJuItem) {
        let bossOneInfo = zlqjItem.info;
        if (null != bossOneInfo && bossOneInfo.m_iPosX > 0 && bossOneInfo.m_iPosY > 0) {
            G.Mapmgr.goToPos(G.DataMgr.sceneData.curSceneID, bossOneInfo.m_iPosX, bossOneInfo.m_iPosY, false, true, FindPosStrategy.FindSuitableAround, bossOneInfo.m_uiMonstID, false);
        }
    }

    private updateFatigue() {
        let diGongFatigue = G.DataMgr.fmtData.diGongFatigue;
        let current = 0;
        let max = 200;
        if (null != diGongFatigue) {
            max = diGongFatigue.m_uiMax;
            current = Math.min(diGongFatigue.m_uiCurrent, max);
        }
        this.textPlz.text = uts.format('疲劳值\n{0}/{1}', current, max);
        let pct = current / max;
        let targetY = this.PiLaoZhiMinY + (this.PiLaoZhiMaxY - this.PiLaoZhiMinY) * pct;
        let p = this.piLaoZhiAnim.transform.localPosition;
        if (p.y != targetY) {
            p.y = targetY;
            Tween.TweenPosition.Begin(this.piLaoZhiAnim, 0.4, p, false);
        }
    }


    private onClickBtnActiveJyfb() {
        let dblExpInfo = G.DataMgr.pinstanceData.dblExpInfo;
        if (null != dblExpInfo && 0 == dblExpInfo.m_iStatus && 0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, this.dblPrice, true)) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getClickMenuRequest(G.DataMgr.sceneData.curPinstanceID, 201));
            this.onClickBtnCloseTip();
        }
        //let info: Protocol.ListPinHomeRsp = G.DataMgr.pinstanceData.getPinstanceInfo(Macros.PINSTANCE_ID_SHNS);
        //if (null != info && 0 == info.m_ucExpPinDouble && 0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, this.dblPrice, true))
        //G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOneKeyGetRequest(Macros.PINSTANCE_ID_SHNS, false, 1));
    }

    private updateDblExp() {
        let dblExpInfo = G.DataMgr.pinstanceData.dblExpInfo;
        let exp = 0;
        let status = 0;
        if (null != dblExpInfo) {
            exp = dblExpInfo.m_uiExp;
            status = dblExpInfo.m_iStatus;
        }
        this.textJyfbExp.text = exp.toString();
        let isNewActive = false;
        if (status != this.jyfbStatus) {
            this.jyfbStatus = status;
            isNewActive = 1 == status;
            this.fireBar.SetActive(isNewActive);
            UIUtils.setGrey(this.jyfbBar, !isNewActive);
            this.btnActiveJyfb.SetActive(!isNewActive);
            this.tip.SetActive(!isNewActive && this.isShowTip);
        }
        if (this.needRefreshDblExpEff || isNewActive) {
            this.fireBarActive.SetActive(true);
            Game.Invoker.BeginInvoke(this.fireBarActive, '1', 1, delegate(this, this.onFireBarActive));
            this.needRefreshDblExpEff = false;
        }
    }

    private onFireBarActive() {
        this.fireBarActive.SetActive(false);
    }
    private onClickBtnCloseTip() {
        this.tip.SetActive(false);
    }
}