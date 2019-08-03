import { Global as G } from 'System/global'
import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { IconItem } from 'System/uilib/IconItem'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { GroupList } from 'System/uilib/GroupList'
import { ElemFinder } from 'System/uilib/UiUtility'
import { DataFormatter } from 'System/utils/DataFormatter'
import { DropPlanData } from 'System/data/DropPlanData'
import { EnumGuide } from 'System/constants/GameEnum'
import { MonsterData } from 'System/data/MonsterData'
import { BossBaseItem } from 'System/pinstance/boss/BossBasePanel'
import { TipFrom } from 'System/tip/view/TipsView'
import { Constants } from 'System/constants/Constants'
import { EnumKfhdBossType, EnumKfhdBossStatus } from 'System/constants/GameEnum'
import { KfhdBossVo } from 'System/data/vo/KfhdBossVo'


class fengMoTaItem extends BossBaseItem{

    protected xuanShangStatus: UnityEngine.GameObject;
    constructor() {
        super(true, true);
    }

    setComponents(go: UnityEngine.GameObject) {
        super.setComponents(go);
        this.xuanShangStatus = ElemFinder.findObject(go,'xuanShangStatus');
    }

    update(isDead: boolean, refreshTime: number, killerName: string, xuanShangStatus: EnumKfhdBossStatus)
    {
        super.update(isDead, refreshTime, killerName);

        if (EnumKfhdBossStatus.hasGot == xuanShangStatus)
        {
            this.xuanShangStatus.SetActive(true );
        }
        else
        {
            this.xuanShangStatus.SetActive(false );
        }
    }
}



/**<黑洞塔>的对话框。*/
export class FengMoTaView extends CommonForm implements IGuideExecutor {
    private readonly RefreshTimerKey = 'refresh';

    private readonly MaxDropCnt: number = 8;
    private readonly MaxBossCntPerLayer = 3;
    //黑洞塔最大层数11层
    private readonly MaxBossLayers = 11;

    btnReturn: UnityEngine.GameObject;
    btnGo: UnityEngine.GameObject;
    private labelBtnGo: UnityEngine.UI.Text;
    private layerList: List;
    private txtLayer: UnityEngine.UI.Text;
    private zdlText: UnityEngine.UI.Text;
    private dropIcons: IconItem[] = [];
    private openLayer: number = 0;

    private bossItems: fengMoTaItem[] = [];

    private curLimiteLv = 0;

    constructor() {
        super(KeyWord.ACT_FUNCTION_FMT);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.FengMoTaView;
    }

    protected initElements() {
        this.btnReturn = this.elems.getElement('btnReturn');
        this.btnGo = this.elems.getElement('btnGo');
        this.labelBtnGo = this.elems.getText('labelBtnGo');
        this.layerList = this.elems.getUIList('layerList');
        this.txtLayer = this.elems.getText('txtLayer');
        this.zdlText = this.elems.getText('zdlText');
        // 掉落图标
        let itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
        for (let i: number = 0; i < this.MaxDropCnt; i++) {
            let icon = new IconItem();
            icon.setUsualIconByPrefab(itemIcon_Normal, ElemFinder.findObject(this.elems.getElement("dropList"), uts.format('icon{0}/icon', i)));
            icon.setTipFrom(TipFrom.normal);
            this.dropIcons.push(icon);
        }
        // 塔层数据
        let fmtArr = G.DataMgr.fmtData.fmtArr;
        let len: number = fmtArr.length;
        this.layerList.Count = len;
        for (let i: number = 0; i < len; i++) {
            let layerItem = this.layerList.GetItem(i);
            let layerText = ElemFinder.findText(layerItem.gameObject, 'info/text');
            layerText.text = uts.format('第{0}层', DataFormatter.toHanNumStr(i + 1));
        }

        for (let i = 0; i < this.MaxBossCntPerLayer; i++) {
            let bossGo = this.elems.getElement('boss' + i);
            let bossItem = new fengMoTaItem();
            bossItem.setComponents(bossGo);
            this.bossItems.push(bossItem);
        }
    }

    protected initListeners() {
        this.addClickListener(this.btnGo, this.onClickGoBtn);
        this.addClickListener(this.btnReturn, this.onClickReturnBtn);
        this.addClickListener(this.elems.getElement("mask"), this.onClickReturnBtn);
        this.addListClickListener(this.layerList, this.onClickLayerList);

        for (let i = 0; i < this.MaxBossCntPerLayer; i++) {
            let bossItem = this.bossItems[i];
            this.addClickListener(bossItem.gameObject, delegate(this, this.onClickBoss, i));
        }
    }
    protected onClose() {

    }

    protected onOpen() {
        let openIndex: number = this.openLayer - 1;
        // 刷新当前层
        let cnt = this.layerList.Count;
        let curSceneID = G.DataMgr.sceneData.curSceneID;
        let cfgs = G.DataMgr.fmtData.fmtArr;
        for (let i: number = 0; i < cnt; i++) {
            let layerItem = this.layerList.GetItem(i);
            let isCurrentGo = ElemFinder.findObject(layerItem.gameObject, 'isCurrent');
            if (curSceneID == cfgs[i].m_iSceneID) {
                isCurrentGo.SetActive(true);
                if (openIndex < 0) {
                    // 没有指定哪一层则自动选中当前层
                    openIndex = i;
                }
            } else {
                isCurrentGo.SetActive(false);
            }
        }

        if (openIndex < 0) {
            // 默认选中当前所在层
            openIndex = 0;
        }
        this.layerList.Selected = openIndex;
        this.layerList.ScrollByAxialRow(openIndex);
        this.onClickLayerList(openIndex);

        // 进行下一步指引
        G.GuideMgr.processGuideNext(EnumGuide.FengMoTa, EnumGuide.FengMoTa_OpenFengMoTa);
    }

    open(openLayer: number = 0) {
        if (!G.DataMgr.funcLimitData.isFuncAvailable(KeyWord.ACT_FUNCTION_FMT, true) || !G.ActionHandler.checkCrossSvrUsable(true)) {
            return;
        }

        if (G.GuideMgr.isGuiding(EnumGuide.FengMoTa)) {
            // 引导黑洞塔时打开第一层
            openLayer = Constants.FengMoTaGuiderLayer;
        }
        this.openLayer = openLayer;
        super.open();
    }

    private onClickLayerList(index: number) {
        //第几层
        G.AudioMgr.playBtnClickSound();
        this.txtLayer.text = '第' + DataFormatter.toHanNumStr(index + 1) + '层';
        let cfg = G.DataMgr.fmtData.fmtArr[index];
        //推荐战力
        this.zdlText.text = cfg.m_iFightPower.toString();
        //掉落
        let dropCfg = DropPlanData.getDropPlanConfig(cfg.m_iMonsterDropID);
        let dropCnt = 0;
        if (null != dropCfg) {
            dropCnt = dropCfg.m_astDropThing.length;
        }    
        for (let i: number = 0; i < this.MaxDropCnt; i++) {
            let icon = this.dropIcons[i];
            if (i < dropCnt) {
                icon.updateById(dropCfg.m_astDropThing[i].m_iDropID, dropCfg.m_astDropThing[i].m_uiDropNumber);
            } else {
                icon.updateById(0);
            }
            icon.updateIcon();
        }
        //boss头像
        this.updateBossList();

        // 判断boss所在场景的进入等级
        let sceneLv = 0;
        if (cfg.m_iSceneID > 0) {
            let sceneCfg = G.DataMgr.sceneData.getSceneInfo(cfg.m_iSceneID).config;
            sceneLv = sceneCfg.m_ucRequiredLevel;
        }
        if (sceneLv > 0 && G.DataMgr.heroData.level < sceneLv) {
            this.labelBtnGo.text = uts.format('{0}级开放', sceneLv);
            UIUtils.setButtonClickAble(this.btnGo, false);
            this.curLimiteLv = sceneLv;
        } else {
            this.labelBtnGo.text = '闯塔';
            UIUtils.setButtonClickAble(this.btnGo, true);
            this.curLimiteLv = 0;
        }
    }

    private updateBossList() {
        let index = this.layerList.Selected;
        let cfg = G.DataMgr.fmtData.fmtArr[index];

        let hasDead: boolean = false;
        let bossCnt = cfg.m_astBossDropList.length;
        let itemSeq: number[];
        if (bossCnt == 3) {
            itemSeq = [0, 1, 2];
        } else if (bossCnt == 1) {
            itemSeq = [1, 0, 2];
        } else {
            uts.assert(false, '不支持的bosss数量');
        }
        for (let i = 0; i < this.MaxBossCntPerLayer; i++) {
            let bossItem = this.bossItems[itemSeq[i]];
            // 注意boss的数量是动态的，但是这里不能使用layout组件，因为这样的话无法获取准确的item坐标，导致指引箭头位置错乱
            if (i < bossCnt) {
                let bossId = cfg.m_astBossDropList[i].m_iBossID;
               
                bossItem.init(bossId);

                let bossInfo = G.DataMgr.fmtData.getBossOneInfo(bossId);
                let bossListData = G.DataMgr.kfhdData.getBossList(EnumKfhdBossType.fengMoTa);
                let dataIndex = index * this.MaxBossCntPerLayer + i;
                let data: KfhdBossVo =null;
                if (dataIndex <= bossListData.length - 1)
                {
                    data = bossListData[dataIndex];
                }
                
                if (null != bossInfo) {
                    if (dataIndex <= bossListData.length - 1)
                    {
                        bossItem.update(bossInfo.m_ucIsDead != 0, bossInfo.m_uiFreshTime, null, data.status);
                    }
                    else
                    {
                        bossItem.update(bossInfo.m_ucIsDead != 0, bossInfo.m_uiFreshTime, null, EnumKfhdBossStatus.noReached);
                    }
                   
                    if (bossInfo.m_ucIsDead != 0) {
                        hasDead = true;
                    }
                } else {
                    bossItem.update(false, 0, null, null);
                }
                bossItem.gameObject.SetActive(true);
            } else {
                bossItem.gameObject.SetActive(false);
            }
        }

        if (hasDead) {
            this.addTimer(this.RefreshTimerKey, 1000, 0, this.onUpdateTimer);
        } else {
            this.removeTimer(this.RefreshTimerKey);
        }
    }

    private onUpdateTimer() {
        this.updateBossList();
    }

    private onClickGoBtn() {
        G.ActionHandler.goToFmtLayer(this.layerList.Selected + 1);
    }

    private onClickBoss(bossIndex: number) {
        if (this.curLimiteLv > 0) {
            G.TipMgr.addMainFloatTip(uts.format('{0}级方可挑战', this.curLimiteLv));
            return;
        }
        let index = this.layerList.Selected;
        let cfg = G.DataMgr.fmtData.fmtArr[index];
        //11层，数组长度为1，bossIndex==1，报错
        bossIndex = index == (this.MaxBossLayers - 1) ? 0 : bossIndex;
        this.doClickBoss(cfg.m_iLayer, cfg.m_astBossDropList[bossIndex].m_iBossID);
    }

    private doClickBoss(layer: number, bossId: number) {
        G.ActionHandler.goToFmtLayer(layer, bossId);

        // 进行下一步指引
        G.GuideMgr.processGuideNext(EnumGuide.FengMoTa, EnumGuide.FengMoTa_ClickEnter);
    }

    private onClickReturnBtn() {
        this.close();
    }

    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    getBossItem(bossId: number): UnityEngine.GameObject {
        for (let i = 0; i < this.MaxBossCntPerLayer; i++) {
            let bossItem = this.bossItems[i];
            if (bossItem.bossId == bossId) {
                if (bossItem.gameObject.activeSelf) {
                    return bossItem.gameObject;
                }
                break;
            }
        }
        return null;
    }

    getLayerItem(layer: number): UnityEngine.GameObject {
        return this.layerList.GetItem(layer - 1).gameObject;
    }

    force(type: EnumGuide, step: EnumGuide, bossId: number): boolean {
        if (EnumGuide.FengMoTa_ClickEnter == step) {
            this.doClickBoss(Constants.FengMoTaGuiderLayer, bossId);
            return true;
        }
        return false;
    }
}
