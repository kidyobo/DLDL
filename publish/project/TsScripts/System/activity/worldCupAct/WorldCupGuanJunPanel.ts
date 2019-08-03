import { UILayer } from 'System/uilib/CommonForm'
import { TabSubForm } from 'System/uilib/TabForm'
import { UIPathData } from 'System/data/UIPathData'
import { Global as G } from 'System/global'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from "System/protocol/Macros"
import { UIUtils } from 'System/utils/UIUtils'
import { KeyWord } from 'System/constants/KeyWord'
import { Color } from 'System/utils/ColorUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { DataFormatter } from "System/utils/DataFormatter"
import { ActivityRuleView } from "System/diandeng/ActivityRuleView"
import { WorldCupActView } from 'System/activity/worldCupAct/WorldCupActView'
import { WorldCupGuanJunJingCaiView } from 'System/activity/worldCupAct/WorldCupGuanJunJingCaiView'
import { WorldCupGuanJunSupportView } from 'System/activity/worldCupAct/WorldCupGuanJunSupportView'

class GameInfoItem extends ListItemCtrl {
    private mainTeamImage: UnityEngine.UI.Image;
    private visitTeamImage: UnityEngine.UI.Image;

    private configData: Protocol.WorldCupChampionConfig_Server;

    setComponents(go: UnityEngine.GameObject) {
        let mainTeam = go.transform.Find("mainTeam");
        let visitTeam = go.transform.Find("visitTeam");
        this.mainTeamImage = mainTeam.GetComponent(UnityEngine.UI.Image.GetType()) as UnityEngine.UI.Image;
        this.visitTeamImage = visitTeam.GetComponent(UnityEngine.UI.Image.GetType()) as UnityEngine.UI.Image;
        Game.UIClickListener.Get(mainTeam.gameObject).onClick = delegate(this, this.onTeamClick, true);
        Game.UIClickListener.Get(visitTeam.gameObject).onClick = delegate(this, this.onTeamClick, false);
        UIUtils.setButtonClickAble(this.mainTeamImage.gameObject, false);
        UIUtils.setButtonClickAble(this.visitTeamImage.gameObject, false);
    }

    update(config: Protocol.WorldCupChampionConfig_Server) {
        UIUtils.setButtonClickAble(this.mainTeamImage.gameObject, true);
        UIUtils.setButtonClickAble(this.visitTeamImage.gameObject, true);

        this.configData = config;
        let country1: string = G.DataMgr.activityData.countryIndexId2CfgMap[config.m_iMainTeamID].m_szDesc;
        let country2: string = G.DataMgr.activityData.countryIndexId2CfgMap[config.m_iVisitTeamID].m_szDesc;
        this.mainTeamImage.sprite = WorldCupActView.CountryAltas2.Get(country1);
        this.visitTeamImage.sprite = WorldCupActView.CountryAltas2.Get(country2);
        /**投注的队伍显示勾选图片 */
        let gameInfo = WorldCupGuanJunPanel.gameInfoIdMap[config.m_iID];
        if (gameInfo != null) {
            if (gameInfo.m_iRoleBetTeamID == config.m_iMainTeamID) {
                if (this.mainTeamImage.transform.Find("selected") != null) {
                    this.mainTeamImage.transform.Find("selected").gameObject.SetActive(true);
                }
            } else {
                if (this.visitTeamImage.transform.Find("selected") != null) {
                    this.visitTeamImage.transform.Find("selected").gameObject.SetActive(true);
                }
            }
        }
        /**晋级队伍亮色,失败队伍设置灰色 */
        if (config.m_iJinjidui != undefined && config.m_iJinjidui != 0) {
            if (config.m_iJinjidui == config.m_iMainTeamID) {
                UIUtils.setGrey(this.visitTeamImage.gameObject, true);
            } else {
                UIUtils.setGrey(this.mainTeamImage.gameObject, true);
            }
        }
    }

    private onTeamClick(isMainTeam: boolean) {
        G.Uimgr.createForm<WorldCupGuanJunSupportView>(WorldCupGuanJunSupportView).open(this.configData, isMainTeam);
    }
}

export class WorldCupGuanJunPanel extends TabSubForm {
    private textTime: UnityEngine.UI.Text;
    private btnRule: UnityEngine.GameObject;
    private btnGuess: UnityEngine.GameObject;
    private btnReward: UnityEngine.GameObject;

    private sixteen_finals: UnityEngine.Transform;
    private eight_finals: UnityEngine.Transform;
    private quarter_finals: UnityEngine.Transform;
    private semi_finals: UnityEngine.Transform;
    private guanJunIcon: UnityEngine.UI.Image;
    private textRewardDes: UnityEngine.UI.Text;

    private sixteen_Item: GameInfoItem[] = [];
    private eight_Item: GameInfoItem[] = [];
    private quarter_Item: GameInfoItem[] = [];
    private semi_Item: GameInfoItem = new GameInfoItem();

    private currentLunci: number = 0;
    
    /**已竞猜比赛信息字典*/
    static gameInfoIdMap: { [id: number]: Protocol.DBWCupChampionRoleOneBetInfo } = {};

    constructor() {
        super(Macros.ACTIVITY_ID_WORLDCUPCHAMPION);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.WorldCupGuanJunPanel;
    }

    protected initElements() {
        super.initElements();

        this.sixteen_finals = this.elems.getTransform("sixteen_finals");
        let sixteenNum = this.sixteen_finals.childCount;
        for (let i = 0; i < sixteenNum; i++) {
            let go = this.sixteen_finals.GetChild(i);
            let item = new GameInfoItem();
            item.setComponents(go.gameObject);
            this.sixteen_Item.push(item);
        }
        this.eight_finals = this.elems.getTransform("eight_finals");
        let eightNum = this.eight_finals.childCount;
        for (let i = 0; i < eightNum; i++) {
            let go = this.eight_finals.GetChild(i);
            let item = new GameInfoItem();
            item.setComponents(go.gameObject);
            this.eight_Item.push(item);
        }
        this.quarter_finals = this.elems.getTransform("quarter_finals");
        let quarterNum = this.quarter_finals.childCount;
        for (let i = 0; i < quarterNum; i++) {
            let go = this.quarter_finals.GetChild(i);
            let item = new GameInfoItem();
            item.setComponents(go.gameObject);
            this.quarter_Item.push(item);
        }
        this.semi_finals = this.elems.getTransform("semi_finals");
        let go = this.semi_finals.GetChild(0);
        this.semi_Item.setComponents(go.gameObject);

        this.textTime = this.elems.getText("textTime");
        this.guanJunIcon = this.elems.getImage("icon");
        this.textRewardDes = this.elems.getText("rewardDes");
        this.btnReward = this.elems.getElement("btnReward");
        this.btnRule = this.elems.getElement('btnRule');
        this.btnGuess = this.elems.getElement('btnGuess');
    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.btnReward, this.onClickBtnReward);
        this.addClickListener(this.btnRule, this.onClickBtnRule);
        this.addClickListener(this.btnGuess, this.onClickBtnGuess);
    }

    protected onOpen() {
        super.onOpen();
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_WORLDCUPCHAMPION, Macros.ACTIVITY_WORLDCUP_CHAMPION_PANEL));
    }

    updateView() {
        let activityData = G.DataMgr.activityData;
        let panelData = activityData.worldCupChampionPanelData;
        if (panelData == null || panelData.m_ucItemCount == 0) return;

        this.setGameInfoIdMap(panelData);
        let cfgIndex = this.getCurrentLunci(panelData);

        let hasRewardValue = WorldCupGuanJunPanel.judgeRewardGet();
        UIUtils.setButtonClickAble(this.btnReward, hasRewardValue[0] ? false : true);
        let startTime = DataFormatter.second2mmddmm(panelData.m_stGetCfgList[cfgIndex].m_uiChongzhiStartTime);
        let endTime = DataFormatter.second2mmddmm(panelData.m_stGetCfgList[cfgIndex].m_uiChongzhiEndTime);
        this.textTime.text = TextFieldUtil.getColorText(uts.format('本轮充值时间：{0}—{1}', startTime, endTime), Color.GREEN);
        if (hasRewardValue[0] == false) {
            this.textRewardDes.text = TextFieldUtil.getColorText(uts.format('第{0}轮比赛每猜中一场获得{1}充值返利\n你在本轮已充值：{2}钻石', hasRewardValue[1], this.getPeiLvByLunci(hasRewardValue[1]), panelData.m_astChargeInfo[hasRewardValue[1] - 1]), Color.GREEN);
        } else {
            this.textRewardDes.text = TextFieldUtil.getColorText(uts.format('第{0}轮比赛每猜中一场获得{1}充值返利\n你在本轮已充值：{2}钻石', this.currentLunci, this.getPeiLvByLunci(this.currentLunci), panelData.m_astChargeInfo[this.currentLunci - 1]), Color.GREEN);
        }

        for (let i = 0; i < panelData.m_ucItemCount; i++) {
            let configData = panelData.m_stGetCfgList[i];
            if (configData.m_iMainTeamID == 0 || configData.m_iVisitTeamID == 0) continue;
            if (configData.m_bLunci == KeyWord.WORLDCPU_CHAMPION_ROUND_1) {
                this.sixteen_Item[i].update(configData);
            } else if (configData.m_bLunci == KeyWord.WORLDCPU_CHAMPION_ROUND_2) {
                this.eight_Item[i - 8].update(configData);
            } else if (configData.m_bLunci == KeyWord.WORLDCPU_CHAMPION_ROUND_3) {
                this.quarter_Item[i - 12].update(configData);
            } else if (configData.m_bLunci == KeyWord.WORLDCPU_CHAMPION_ROUND_4) {
                this.semi_Item.update(configData);
                if (configData.m_iJinjidui != undefined && configData.m_iJinjidui != 0) {
                    this.guanJunIcon.sprite = WorldCupActView.CountryAltas2.Get(activityData.countryIndexId2CfgMap[configData.m_iJinjidui].m_szDesc);
                }
            }
        }
    }

    private setGameInfoIdMap(panelData: Protocol.WCupChampionPanelRsp) {
        for (let i = 0; i < panelData.m_ucNum; i++) {
            let gameInfo = panelData.m_astGameInfo[i];
            WorldCupGuanJunPanel.gameInfoIdMap[gameInfo.m_iGameID] = gameInfo;
        }
    }

    private getCurrentLunci(panelData: Protocol.WCupChampionPanelRsp) {
        let cfgIndex = 0;
        let currentTime = G.SyncTime.getCurrentTime() / 1000;
        for (let i = 0; i < panelData.m_ucItemCount; i++) {
            let config = panelData.m_stGetCfgList[i];
            if (config.m_bLunci == KeyWord.WORLDCPU_CHAMPION_ROUND_4) {
                this.currentLunci = 4;
                cfgIndex = i;
                break;
            }
            if (currentTime > config.m_uiChongzhiStartTime && currentTime < config.m_uiChongzhiEndTime) {
                this.currentLunci = config.m_bLunci;
                cfgIndex = i;
                break;
            }
        }
        return cfgIndex;
    }

    private getPeiLvByLunci(lunci: number): string {
        if (lunci < 1) return "0%";
        let peiLv = 0;
        let panelData = G.DataMgr.activityData.worldCupChampionPanelData;
        if (panelData != null) {
            for (let i = 0; i < panelData.m_ucItemCount; i++) {
                let cfg = panelData.m_stGetCfgList[i];
                if (cfg.m_bLunci == lunci) {
                    peiLv = cfg.m_iPeiLv;
                    break;
                }
            }
        }
        return peiLv + "%";
    }
    
    /**判断是否有奖励未领取， true已领取，false未领取,未领取的轮次 */
    static judgeRewardGet() {
        let rntValue: [boolean, number] = [true, 0];
        let panelData = G.DataMgr.activityData.worldCupChampionPanelData;
        for (let i = 0; i < panelData.m_ucNum; i++) {
            let gameInfo = panelData.m_astGameInfo[i];
            if (gameInfo.m_ucHaveGet == 0) {
                let config = G.DataMgr.activityData.worldCupChampionId2CfgMap[gameInfo.m_iGameID];
                if (config.m_iJinjidui != undefined && config.m_iJinjidui == gameInfo.m_iRoleBetTeamID) {
                    let chargeNum = panelData.m_astChargeInfo[config.m_bLunci - 1];
                    if (chargeNum != 0) {
                        rntValue = [false, config.m_bLunci];
                        break;
                    }
                }
            }
        }
        return rntValue;
    }

    private onClickBtnReward() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_WORLDCUPCHAMPION, Macros.ACTIVITY_WORLDCUP_CHAMPION_GET));
    }

    private onClickBtnRule() {
        G.Uimgr.createForm<ActivityRuleView>(ActivityRuleView).open(G.DataMgr.langData.getLang(454), '冠军之路');
    }

    private onClickBtnGuess() {
        G.Uimgr.createForm<WorldCupGuanJunJingCaiView>(WorldCupGuanJunJingCaiView).open();
    }

    private onClickCloseBtn() {
        this.close();
    }
}