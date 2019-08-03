import { Global as G } from 'System/global'
import { EventDispatcher } from 'System/EventDispatcher'
import { ConfirmCheck } from 'System/tip/TipManager'
import { ActionHandler } from 'System/ActionHandler'
import { QuestData } from 'System/data/QuestData'
import { EnumQuestState, EnumDoQuestFor } from 'System/constants/GameEnum'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { UiElements } from 'System/uilib/UiElements'
import { QuestTrackItemData } from 'System/quest/QuestTrackItemData'
import { NPCData } from 'System/data/NPCData'
import { QuestUtil } from 'System/utils/QuestUtil'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { MonsterData } from 'System/data/MonsterData'
import { ThingData } from 'System/data/thing/ThingData'
import { RichTextUtil } from 'System/utils/RichTextUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { LoopQuestRewardView } from 'System/quest/LoopQuestRewardView'
import { Events } from 'System/Events'
import { Profiler } from 'System/utils/Profiler'
import { TaskRecommendItem, TaskRecommendData } from 'System/data/TaskRecommendData'
import { DataFormatter } from 'System/utils/DataFormatter'
import { ProtocolUtil } from "System/protocol/ProtocolUtil"
import { GameObjectGetSet } from 'System/uilib/CommonForm'
export enum EnumTaskTrackLinkKey {
    LiJiWanCheng = 1,
    QuestGuide,
}

class TaskTrackLinkInfo {
    key: EnumTaskTrackLinkKey = 0;
    param = 0;
}

class TaskTrackItem {
    private static readonly TitleColor = 'beb673';
    private static readonly stateColor = '29e503';
    private static readonly nodeColor = 'dddddd';
    private typeToColor: { [type: number]: string } = null;

    gameObject: GameObjectGetSet;

    private effSelected: UnityEngine.GameObject;
    private selected: GameObjectGetSet;
    private imgSelected: UnityEngine.UI.Image;

    private imgTaskType: UnityEngine.UI.Image;
    private textline: UnityEngine.UI.UIText;
    private layoutElem: UnityEngine.UI.LayoutElement;
    private shoe: UnityEngine.GameObject;
    private displayText: string;

    private trackList: TaskTrackList;

    private oldDataStr: string;

    private itemData: QuestTrackItemData;
    private recommendItem: TaskRecommendItem;
    private recommendTimer: Game.Timer;
    private curQuestType: number;
    private isCurrentQuest: boolean = false;
    constructor(trackList: TaskTrackList) {
        this.trackList = trackList;
    }

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = new GameObjectGetSet(go);
        this.effSelected = ElemFinder.findObject(go, 'effSelected');
        this.effSelected.SetActive(false);
        this.layoutElem = go.GetComponent(UnityEngine.UI.LayoutElement.GetType()) as UnityEngine.UI.LayoutElement;
        Game.UIClickListener.Get(go).onClick = delegate(this, this.onClickTaskItem, false);

        this.shoe = ElemFinder.findObject(go, 'shoe');
        Game.UIClickListener.Get(this.shoe).onClick = delegate(this, this.onClickTaskItem, true);
        Game.UITouchListener.Get(go).onTouchBegin = delegate(this, this.onClickTaskItemBegin);
        Game.UITouchListener.Get(go).onTouchEnd = delegate(this, this.onClickTaskItemEnd);




        this.imgTaskType = ElemFinder.findImage(go, "imgType");
        this.imgSelected = ElemFinder.findImage(go, "imgSelected");
        this.selected = new GameObjectGetSet(ElemFinder.findObject(go, "imgSelected"));

        this.textline = ElemFinder.findUIText(go, 'textline');
        let textUrl = this.textline.GetComponentInChildren(UnityEngine.UI.UITextUrl.GetType()) as UnityEngine.UI.UITextUrl;
        textUrl.onUrlClick = delegate(this, this.onUrlClick);

        if (this.typeToColor == null) {
            this.typeToColor = {};
            // KeyWord.keywordTable[KeyWord.GROUP_QUEST_TYPE] = {};
            // KeyWord.keywordTable[KeyWord.GROUP_QUEST_TYPE][KeyWord.QUEST_TYPE_BRANCH] = "支线任务";----------------
            // KeyWord.keywordTable[KeyWord.GROUP_QUEST_TYPE][KeyWord.QUEST_TYPE_CHILD] = "子任务";
            // KeyWord.keywordTable[KeyWord.GROUP_QUEST_TYPE][KeyWord.QUEST_TYPE_DAILY] = "日常任务";-----------------
            // KeyWord.keywordTable[KeyWord.GROUP_QUEST_TYPE][KeyWord.QUEST_TYPE_FRONT_LINE] = "前线任务";
            // KeyWord.keywordTable[KeyWord.GROUP_QUEST_TYPE][KeyWord.QUEST_TYPE_GROUP] = "组任务";
            // KeyWord.keywordTable[KeyWord.GROUP_QUEST_TYPE][KeyWord.QUEST_TYPE_GUILD_DAILY] = "宗门任务";----------------
            // KeyWord.keywordTable[KeyWord.GROUP_QUEST_TYPE][KeyWord.QUEST_TYPE_GUO_YUN] = "护送任务";--------------
            // KeyWord.keywordTable[KeyWord.GROUP_QUEST_TYPE][KeyWord.QUEST_TYPE_HUANG_BANG] = "皇榜任务";
            // KeyWord.keywordTable[KeyWord.GROUP_QUEST_TYPE][KeyWord.QUEST_TYPE_JUANZHOU] = "卷轴任务";--------------------
            // KeyWord.keywordTable[KeyWord.GROUP_QUEST_TYPE][KeyWord.QUEST_TYPE_PROF] = "门派任务";
            // KeyWord.keywordTable[KeyWord.GROUP_QUEST_TYPE][KeyWord.QUEST_TYPE_REWARDEXP] = "悬赏经验任务";
            // KeyWord.keywordTable[KeyWord.GROUP_QUEST_TYPE][KeyWord.QUEST_TYPE_REWARDSHELL] = "悬赏贝任务";
            // KeyWord.keywordTable[KeyWord.GROUP_QUEST_TYPE][KeyWord.QUEST_TYPE_TREASURE_HUNT] = "探险任务";
            // KeyWord.keywordTable[KeyWord.GROUP_QUEST_TYPE][KeyWord.QUEST_TYPE_TRUNK] = "主线任务";------------------
            // KeyWord.keywordTable[KeyWord.GROUP_QUEST_TYPE][KeyWord.QUEST_TYPE_XUKONG] = "虚空任务";
            //暂时只有这六个图标，暂配这六个颜色
            this.typeToColor[0] = "FFFFFF00";
            this.typeToColor[KeyWord.QUEST_TYPE_BRANCH] = "206AD5";
            this.typeToColor[KeyWord.QUEST_TYPE_DAILY] = "42C42E";
            this.typeToColor[KeyWord.QUEST_TYPE_GUILD_DAILY] = "E65B5B";
            this.typeToColor[KeyWord.QUEST_TYPE_GUO_YUN] = "33AABF";
            this.typeToColor[KeyWord.QUEST_TYPE_JUANZHOU] = "983CD7";
            this.typeToColor[KeyWord.QUEST_TYPE_TRUNK] = "C07C2C";
        }
    }

    showSelected(isSelected: boolean) {
        this.isCurrentQuest = isSelected;
        let color = this.typeToColor[this.curQuestType];
        if (color == null) {
            color = this.typeToColor[0];
        }
        else {
            //满透明度
            color += "FF";
        }
        this.imgSelected.color = Color.toUnityColor(color);
        this.effSelected.SetActive(isSelected);
        this.selected.SetActive(isSelected);
    }

    setSelectedAlph() {
        let color = this.typeToColor[this.curQuestType];
        if (color == null) {
            color = this.typeToColor[0];
        }
        else {
            //半透明
            color += "64";
        }
        this.imgSelected.color = Color.toUnityColor(color);
        this.selected.SetActive(true);
    }

    get Id(): number {
        //此处对recommendItem做了500W得偏移，和任务ID区分
        return this.itemData ? this.itemData.id : (this.recommendItem.id + 5000000);
    }

    private onClickTaskItemBegin() {
        if (!this.isCurrentQuest) {
            this.setSelectedAlph();
        }
    }

    private onClickTaskItemEnd() {
        if (!this.isCurrentQuest) {
            this.selected.SetActive(false);
        }
    }

    private onClickTaskItem(isTransport: boolean) {
        if (this.itemData) {
            //任务类型
            if (this.itemData.id > 0) {
                G.ModuleMgr.questModule.tryAutoDoQuest(this.itemData.id, isTransport, false, EnumDoQuestFor.manually, true);
                this.trackList.setSelected(this.itemData.id);
            } else {
                if (EnumQuestState.ExtraReward == this.itemData.state) {
                    G.Uimgr.createForm<LoopQuestRewardView>(LoopQuestRewardView).open(this.itemData.questType);
                }
            }
            this.trackList.guideOff();
        }
        else {
            this.trackList.setSelected(this.Id);
            //面板自定义类型
            let item = this.recommendItem;
            switch (item.config.m_iOperationType) {
                case KeyWord.RECOMMEND_TYPE_OPENPANEL || KeyWord.FIGHT_POINT_OPEN_PANEL:
                    G.ActionHandler.executeFunction(item.config.m_iFunctionType);
                    break;
                case KeyWord.RECOMMEND_TYPE_GOTONPC || KeyWord.FIGHT_POINT_XUNLU_NPC:
                    G.ModuleMgr.questModule.doQuestByType(item.config.m_iFunctionType, false);
                    break;
                case KeyWord.RECOMMEND_TYPE_PINSTANCE:
                    if (item.config.m_iFunctionType == KeyWord.OTHER_FUNCTION_DYZSPIN) {
                        G.Mapmgr.trySpecialTransport(KeyWord.NAVIGATION_DYZSPIN);
                    }
                    break;
            }
        }
    }

    private onUrlClick(value: string) {
        let linkInfo = RichTextUtil.getEventData(value) as TaskTrackLinkInfo;
        G.ModuleMgr.questModule.processQuestLink(linkInfo.key, linkInfo.param, false);
        this.trackList.setSelected(this.itemData.id);
        this.trackList.guideOff();
    }

    private addText(content: string) {
        if (null != this.displayText) {
            this.displayText += '\n';
            this.displayText += content;
        } else {
            this.displayText = content;
        }
    }

    updateRecommend(vo: TaskRecommendItem) {
        this.itemData = null;
        this.recommendItem = vo;
        let dataStr = vo.toString();
        if (this.oldDataStr == dataStr) {
            return;
        }
        this.oldDataStr = dataStr;
        this.displayText = null;
        this.imgTaskType.sprite = G.AltasManager.taskTypeAtlas.Get(vo.config.m_szType.toString());
        //设置任务框颜色
        this.curQuestType = vo.config.m_szType;

        this.addText(RichTextUtil.getColorText(uts.format("{0}", vo.config.m_szName), TaskTrackItem.TitleColor));
        if (vo.contentStr != "") {
            this.addText(RichTextUtil.getColorText(vo.contentStr, TaskTrackItem.nodeColor));
        }
        if (vo.maxCount > 0) {
            //更新倒计时
            let str = vo.timeStr != null ? vo.timeStr : "下次回复:"
            if (vo.maxCount == vo.count) {
                this.addText(RichTextUtil.getColorText(uts.format("{0}{1}", RichTextUtil.getColorText(uts.format(str), Color.ORANGE), "已满"), TaskTrackItem.stateColor));
                if (this.recommendTimer != null) {
                    this.recommendTimer.Stop();
                    this.recommendTimer = null;
                }
            }
            else {
                let leftSecond = vo.nexttime - Math.round(G.SyncTime.getCurrentTime() / 1000);
                if (leftSecond < 0) {
                    leftSecond = 0;
                }
                this.addText(RichTextUtil.getColorText(uts.format("{0}{1}", RichTextUtil.getColorText(uts.format(str), Color.ORANGE), DataFormatter.second2hhmmss(leftSecond)), TaskTrackItem.stateColor));
                if (this.recommendTimer == null) {
                    this.recommendTimer = new Game.Timer("tasktick", 1000, 0, delegate(this, this.onTimerTick));
                }
            }
        }
        else {
            if (this.recommendTimer != null) {
                this.recommendTimer.Stop();
                this.recommendTimer = null;
            }
        }
        this.textline.text = this.displayText;
        this.textline.ProcessText();
        this.layoutElem.preferredHeight = this.textline.renderHeight + 21;
        this.shoe.SetActive(false);
    }

    private onTimerTick(timer) {
        let vo = this.recommendItem;
        if (!vo) {
            return;
        }
        this.displayText = null;
        let str = vo.timeStr != null ? vo.timeStr : "下次回复:"
        this.addText(RichTextUtil.getColorText(uts.format("{0}", vo.config.m_szName), TaskTrackItem.TitleColor));
        if (vo.contentStr != "") {
            this.addText(RichTextUtil.getColorText(vo.contentStr, TaskTrackItem.nodeColor));
        }
        //更新倒计时
        if (vo.maxCount == vo.count) {
            this.addText(RichTextUtil.getColorText(uts.format("{0}{1}", RichTextUtil.getColorText(uts.format(str), Color.ORANGE), "已满"), TaskTrackItem.stateColor));
            if (this.recommendTimer != null) {
                this.recommendTimer.Stop();
                this.recommendTimer = null;
            }
        }
        else {
            let leftSecond = vo.nexttime - Math.round(G.SyncTime.getCurrentTime() / 1000);
            if (leftSecond <= 0) {
                leftSecond = 0;
            }
            this.addText(RichTextUtil.getColorText(uts.format("{0}{1}", RichTextUtil.getColorText(uts.format(str), Color.ORANGE), DataFormatter.second2hhmmss(leftSecond)), TaskTrackItem.stateColor));
        }
        this.textline.text = this.displayText;
        this.textline.ProcessText();
    }

    updateQuest(vo: QuestTrackItemData, xfxEnabled: boolean) {
        if (this.recommendTimer != null) {
            this.recommendTimer.Stop();
            this.recommendTimer = null;
        }
        this.recommendItem = null;
        this.itemData = vo;
        let dataStr = vo.toString();
        if (this.oldDataStr == dataStr) {
            return;
        }
        this.oldDataStr = dataStr;

        this.displayText = null;
        if (0 == vo.id) {
            this.addText(RichTextUtil.getColorText(vo.title, TaskTrackItem.TitleColor));
            this.addText(RichTextUtil.getColorText(vo.desc, TaskTrackItem.nodeColor));
        } else {
            // 任务名称
            this.toQuestName(vo);
            ////设置任务Tips
            //let questConfig: GameConfig.QuestConfigM = QuestData.getConfigByQuestID(vo.id);
            //let questTipData: QuestTipData = this.setQuestTip(questConfig);
            //if (questTipData != null) {
            //    TipMgr.setTip(text, questTipData);
            //}
            let questConfig: GameConfig.QuestConfigM = QuestData.getConfigByQuestID(vo.id);
            // 任务节点
            if (EnumQuestState.Doing == vo.state) {
                // 已经在做了，显示任务节点
                let questNodeProgress: Protocol.QuestNodeProgress;
                let questNode: GameConfig.QuestNodeConfigCli;
                let len: number = vo.progress.m_astNodeProgress.length;
                for (let i: number = 0; i < len; i++) {
                    // 遍历所有的节点，生成节点的字符串
                    questNodeProgress = vo.progress.m_astNodeProgress[i];
                    questNode = questConfig.m_astQuestNodeConfig[questNodeProgress.m_ucQuestProgressIndex];
                    this.toQuestNode(questConfig, questNodeProgress.m_ucQuestProgressIndex, questNodeProgress, vo.state, true, -1);
                    if (questConfig.m_ucQuestType == KeyWord.QUEST_TYPE_GUILD_DAILY || questConfig.m_ucQuestType == KeyWord.QUEST_TYPE_JUANZHOU || questConfig.m_ucQuestType == KeyWord.QUEST_TYPE_DAILY) {
                        this.toLjwcLink(questConfig, questNodeProgress.m_ucQuestProgressIndex);
                    }
                }
            }
            else if (EnumQuestState.Completing == vo.state) {
                if (0 == questConfig.m_iAwarderNPCID) {
                    this.addText(RichTextUtil.getColorText('点击领取奖励', TaskTrackItem.nodeColor));
                }
                else {
                    this.toQuestNpcName(questConfig, false);
                }
            }
            else {
                // 还没接，显示领取NPC
                this.toQuestNpcName(questConfig, true);
            }

            //if (KeyWord.QUEST_TYPE_BRANCH == questConfig.m_ucQuestType || KeyWord.QUEST_TYPE_JUANZHOU == questConfig.m_ucQuestType) {
            //    text = this.m_textPool.makeObject() as QuestTrackText;
            //    text.toRewardList(config);
            //    this._showText(text);
            //}
        }

        this.textline.text = this.displayText;
        this.textline.ProcessText();
        this.layoutElem.preferredHeight = this.textline.renderHeight + 21;
        this.imgTaskType.sprite = G.AltasManager.taskTypeAtlas.Get(vo.questType.toString());
        //设置任务类型
        this.curQuestType = vo.questType;
        this.shoe.SetActive(xfxEnabled);
    }

    private toQuestName(vo: QuestTrackItemData) {
        let questTypeDesc = KeyWord.getDesc(KeyWord.GROUP_QUEST_TYPE, vo.questType);
        let content = vo.title;

        content = RichTextUtil.getColorText(content, TaskTrackItem.TitleColor);

        //任务进度
        let finishedCnt: number = 0;
        let progressStr: string;
        if (EnumQuestState.Completing == vo.state) {
            // 显示已完成
            progressStr = '(已完成)';
        }
        else if (EnumQuestState.Doing == vo.state) {
            let questData = G.DataMgr.questData;
            switch (vo.questType) {
                case KeyWord.QUEST_TYPE_GUILD_DAILY:
                    finishedCnt = Math.min(questData.guildDailyCompletedNumer + 1, questData.maxGuildQuestNum);
                    progressStr = ('(' + finishedCnt + '/' + questData.maxGuildQuestNum + ')环');
                    break;
                case KeyWord.QUEST_TYPE_DAILY:
                    finishedCnt = Math.min(questData.dailyCompleteTime + 1, QuestData.DAILY_QUEST_MAX_TIME);
                    progressStr = ('(' + finishedCnt + '/' + QuestData.DAILY_QUEST_MAX_TIME + ')环');
                    break;
                case KeyWord.QUEST_TYPE_GUO_YUN:
                    let maxGuoyunQuestNum: number = questData.maxGuoyunQuestNum;
                    finishedCnt = Math.min(questData.guoYunDayCompletedTimes + 1, maxGuoyunQuestNum);
                    progressStr = ('(' + finishedCnt + '/' + maxGuoyunQuestNum + ')');
                    break;
                case KeyWord.QUEST_TYPE_JUANZHOU:
                    let maxJuanZhouQuestNum: number = questData.jzTotalCnt;
                    finishedCnt = Math.min(questData.juanzhouNum + 1, maxJuanZhouQuestNum);
                    progressStr = ('(' + finishedCnt + '/' + maxJuanZhouQuestNum + ')');
                    break;
                default:
                    progressStr = '(进行中)';
                    break;
            }
        }
        else {
            // 显示可接
            progressStr = '(可接)';
        }

        content += RichTextUtil.getColorText(progressStr, TaskTrackItem.stateColor);
        this.addText(content);
    }

    private toQuestNpcName(questConfig: GameConfig.QuestConfigM, isAccept: boolean) {
        let questID: number = questConfig.m_iQuestID;

        let npcName: string;
        let npcID: number = isAccept ? questConfig.m_iConsignerNPCID : questConfig.m_iAwarderNPCID;
        if (npcID > 0) {
            npcName = NPCData.getNpcConfig(npcID).m_szNPCName;
        }

        let content: string;
        if (null != npcName) {
            content = uts.format('对话：{0}', RichTextUtil.getColorText(npcName, TaskTrackItem.nodeColor));
        } else {
            content = '点击领取任务';
        }

        this.addText(content);
    }

    private toQuestNode(questConfig: GameConfig.QuestConfigM, nodeIndex: number, progress: Protocol.QuestNodeProgress, status: number, isNodeEnabled: boolean, huangbangIndex: number = -1): void {
        let content = '';
        //传奇启航
        let nav: GameConfig.NavigationConfigM;
        let questNode: GameConfig.QuestNodeConfigCli = questConfig.m_astQuestNodeConfig[nodeIndex];
        let thingName: string;

        // 获取进度
        let progressValue: number = 0;
        if (isNodeEnabled) {
            if (questNode.m_shValue > 0) {
                if (null != progress) {
                    progressValue = progress.m_shProgressValue;
                }
                else {
                    if (EnumQuestState.Acceptable == status || EnumQuestState.Unacceptable == status) {
                        progressValue = 0;
                    }
                    else if (EnumQuestState.Completed == status || EnumQuestState.Completing == status) {
                        progressValue = questNode.m_shValue;
                    }
                }
            }
        }

        // 确定是否有超链接、筋斗云等
        let canDoQuest: boolean = (null != progress || EnumQuestState.Acceptable == status
            || EnumQuestState.Doing == status || EnumQuestState.Completing == status);

        let action: string;
        if (KeyWord.QUEST_NODE_LEVELUP == questNode.m_ucType) {
            content += RichTextUtil.getColorText(uts.format('{0}级开启\n', questNode.m_iThingID), Color.RED);
        } else if (KeyWord.QUEST_NODE_FIGHT_POINT == questNode.m_ucType) {
            //战力卡点
            content += RichTextUtil.getColorText(uts.format('战力达到{0}\n', questNode.m_iThingID), Color.RED);
        }
        else {
            content += questNode.m_szWord;
        }

        if (isNodeEnabled) {
            // 进度
            if (progressValue >= questNode.m_shValue) {
                content += RichTextUtil.getColorText('(已完成)', TaskTrackItem.stateColor);
            }
            else if (KeyWord.QUEST_NODE_QUEST != questNode.m_ucType && questNode.m_shValue > 1) {
                // 子任务（对话）不需要显示进度 '(' + progressValue + '/' + questNode.m_shValue + ')'
                content += RichTextUtil.getColorText(uts.format('({0}/{1})', progressValue, questNode.m_shValue), TaskTrackItem.stateColor);
            }
        }
        else {
            // 显示节点未开始
            content += RichTextUtil.getColorText('(未开始)', TaskTrackItem.stateColor);
        }
        let questGuildConfig: GameConfig.QuestGuildConfigM = G.DataMgr.questData.getTjQuest(questConfig.m_iQuestID);
        if (questGuildConfig != null && questGuildConfig.m_iRecommendNum > 0) {
            let info = questGuildConfig.m_astRecommend[0];
            let linkInfo: TaskTrackLinkInfo = { key: EnumTaskTrackLinkKey.QuestGuide, param: info.m_iType };
            content += RichTextUtil.getUnderlineText(info.m_sTip, TaskTrackItem.nodeColor, linkInfo);
        }

        this.addText(content);
    }

    private toLjwcLink(questConfig: GameConfig.QuestConfigM, nodeIndex: number): void {
        let linkInfo: TaskTrackLinkInfo = { key: EnumTaskTrackLinkKey.LiJiWanCheng, param: this.itemData.id };
        let content = RichTextUtil.getUnderlineText('(立即完成)', TaskTrackItem.stateColor, linkInfo);
        this.addText(content);
    }

    public dispose() {
        this.itemData = null;
        this.oldDataStr = null;
        this.recommendItem = null;
        if (this.recommendTimer != null) {
            this.recommendTimer.Stop();
            this.recommendTimer = null;
        }
    }
}

class QuestSectionView {
    gameObject: UnityEngine.GameObject;

    private textTitle: UnityEngine.UI.Text;

    private textProgress: UnityEngine.UI.Text;
    private progress: UnityEngine.UI.Image;

    private textDesc: UnityEngine.UI.Text;
    private textAction: UnityEngine.UI.Text;

    private shoe: UnityEngine.GameObject;

    private questId = 0;

    private trackList: TaskTrackList;

    constructor(trackList: TaskTrackList) {
        this.trackList = trackList;
    }

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;

        let mapper = go.GetComponent(Game.ElementsMapper.GetType()) as Game.ElementsMapper;
        let elems = new UiElements(mapper);
        this.textTitle = elems.getText('textTitle');
        this.textProgress = elems.getText('textProgress');
        this.progress = elems.getImage('progress');
        this.textDesc = elems.getText('textDesc');
        this.textAction = elems.getText('textAction');
        this.shoe = elems.getElement('shoe');

        Game.UIClickListener.Get(go).onClick = delegate(this, this.onClick, false);
        Game.UIClickListener.Get(this.shoe).onClick = delegate(this, this.onClick, true);
    }

    update(sectionCfg: GameConfig.QuestSectionM, xfxEnabled: boolean) {
        this.questId = sectionCfg.m_iTaskID;

        this.textTitle.text = uts.format('第{0}章·{1}', sectionCfg.m_iID + 1, G.DataMgr.questData.getSectionTitle(sectionCfg.m_iID));
        this.textDesc.text = sectionCfg.m_szTaskDesc;

        let pgs = sectionCfg.m_iSectionID / G.DataMgr.questData.getSetionNum(sectionCfg.m_iID);
        this.textProgress.text = uts.format('{0}%', Math.round(pgs * 100));
        //this.progress.transform.localScale = G.getCacheV3(pgs, 1, 1);
        this.progress.fillAmount = pgs;
        let questConfig = QuestData.getConfigByQuestID(sectionCfg.m_iTaskID);
        let questNode: GameConfig.QuestNodeConfigCli = questConfig.m_astQuestNodeConfig[0];
        let progress = G.DataMgr.questData.getQuestProgress(sectionCfg.m_iTaskID);
        let actionStr: string;
        if (null == progress) {
            actionStr = uts.format('对话：{0}', TextFieldUtil.getColorText(NPCData.getNpcConfig(questConfig.m_iConsignerNPCID).m_szNPCName, Color.GREEN));
        }
        else if (progress.m_astNodeProgress[0].m_shProgressValue >= questNode.m_shValue) {
            actionStr = uts.format('对话：{0}', TextFieldUtil.getColorText(NPCData.getNpcConfig(questConfig.m_iAwarderNPCID).m_szNPCName, Color.GREEN));
        }
        else if (KeyWord.QUEST_NODE_LEVELUP == questNode.m_ucType) {
            actionStr = uts.format('提升到{0}级', questNode.m_iThingID);
        } else if (KeyWord.QUEST_NODE_FIGHT_POINT == questNode.m_ucType) {
            actionStr = uts.format('战力达到{0}', questNode.m_iThingID);
        }
        else {
            let action: string;
            if (KeyWord.QUEST_NODE_COLLECT == questNode.m_ucType
                || KeyWord.QUEST_NODE_COLLECT_SHARE == questNode.m_ucType
                || KeyWord.QUEST_NODE_BEAUTY_EQUIP == questNode.m_ucType
                || KeyWord.QUEST_NODE_PET_EQUIP_NUM == questNode.m_ucType) {
                actionStr = '收集：';
            }
            else if (KeyWord.QUEST_NODE_MONSTER == questNode.m_ucType
                || KeyWord.QUEST_NODE_MONSTER_SHARE == questNode.m_ucType
                || KeyWord.QUEST_NODE_FMT_RANDOM_BOSS == questNode.m_ucType
                || KeyWord.QUEST_NODE_FMT_RANDOM == questNode.m_ucType) {
                actionStr = '打败：';
            }
            else if (KeyWord.QUEST_NODE_JUYUAN == questNode.m_ucType) {
                actionStr = '神力：';
            }
            else if (KeyWord.QUEST_NODE_DIALOG == questNode.m_ucType) {
                actionStr = '对话：';
            }
            else if (KeyWord.QUEST_NODE_FMT == questNode.m_ucType) {
                actionStr = '黑洞塔：';
            }
            else if (KeyWord.QUEST_NODE_PINSTANCE == questNode.m_ucType
                || KeyWord.QUEST_NODE_JDYJ1 == questNode.m_ucType
                || KeyWord.QUEST_NODE_SHNS == questNode.m_ucType
                || KeyWord.QUEST_NODE_WST == questNode.m_ucType
                || KeyWord.QUEST_NODE_CLFB == questNode.m_ucType
                || KeyWord.QUEST_NODE_WYFB == questNode.m_ucType) {
                actionStr = '副本：';
            }
            else {
                actionStr = '';
            }
            actionStr += TextFieldUtil.getColorText(questNode.m_szWord, Color.GREEN);

            // 进度
            if (questNode.m_shValue > 1) {
                actionStr += '(' + progress.m_astNodeProgress[0].m_shProgressValue + '/' + questNode.m_shValue + ')';
            }
        }
        this.textAction.text = actionStr;
        this.shoe.SetActive(xfxEnabled);
    }


    private onClick(isTransport: boolean) {
        G.ModuleMgr.questModule.tryAutoDoQuest(this.questId, isTransport, false, EnumDoQuestFor.manually);
        this.trackList.guideOff();
    }
}

export class TaskTrackList extends EventDispatcher {
    private taskPanel: UnityEngine.GameObject;

    /**章节*/
    private sectionView: QuestSectionView;

    /**任务列表*/
    private trackList: UnityEngine.GameObject;
    private trackListHeight = 0;
    private trackListPosY = 0;
    private content: UnityEngine.GameObject;
    private contentPositionY = 0;

    private arrow: UnityEngine.GameObject;
    private sectionArrowPos: UnityEngine.Vector3;

    private itemClone: UnityEngine.GameObject;
    private items: TaskTrackItem[] = [];
    private itemPool: TaskTrackItem[] = [];

    private m_questTextData: QuestTrackItemData[] = [];

    /**是否需要更新*/
    private isDirty = false;

    private selectedId = 0;
    private xfxLv = 0;

    setView(uiElems: UiElements) {
        let funcLimitCfg = G.DataMgr.funcLimitData.getFuncLimitConfig(KeyWord.OTHER_FUNCTION_TRANSPORT);
        if (null != funcLimitCfg) {
            this.xfxLv = funcLimitCfg.m_ucLevel;
        }

        this.taskPanel = uiElems.getElement('taskPanel');

        let section = uiElems.getElement('taskSection');
        this.sectionView = new QuestSectionView(this);
        this.sectionView.setComponents(section);
        this.sectionView.gameObject.SetActive(false);

        this.trackList = uiElems.getElement('trackList');
        let trackListRT = this.trackList.transform as UnityEngine.RectTransform;
        this.trackListHeight = trackListRT.sizeDelta.y;
        this.trackListPosY = trackListRT.localPosition.y;

        this.content = uiElems.getElement('taskContent');
        this.contentPositionY = (this.content.transform as UnityEngine.RectTransform).localPosition.y;

        this.itemClone = uiElems.getElement('taskItem');
        this.itemClone.SetActive(false);

        this.arrow = uiElems.getElement('arrow');
        this.arrow.SetActive(false);
        this.sectionArrowPos = this.arrow.transform.localPosition;
    }

    setActive(value: boolean) {
        this.taskPanel.SetActive(value);
        if (value) {
            this.addEvent(Events.QuestChange, this.onQuestChange);
            this.updateView(true);
        } else {
            this.removeEvent(Events.QuestChange);
        }
    }

    setSelected(id: number) {
        if (id != this.selectedId) {
            this.selectedId = id;
            this.updateSelected();
        }
    }

    private updateSelected() {
        for (let item of this.items) {
            if (item.Id == this.selectedId) {
                item.showSelected(true);
            } else {
                item.showSelected(false);
            }
        }
    }

    private onQuestChange() {
        this.updateView(false);
    }

    updateView(rightNow: boolean) {
        this.isDirty = true;
        if (rightNow) {
            this.checkUpdate();
        }
    }

    checkUpdate() {
        if (!this.isDirty || !G.DataMgr.questData.isQuestDataReady || !G.DataMgr.activityData.isReady) {
            return;
        }

        let xfxEnabled = G.DataMgr.heroData.level >= this.xfxLv;
        this.m_questTextData.length = 0;

        // 先抓取普通任务
        this._getDoingQuests();
        this._getCanAccpetQuests();
        this.getLoopRewards();
        //Profiler.push('datasort');
        this.m_questTextData.sort(delegate(this, this.sortQuests));
        //Profiler.pop();

        let cnt = this.m_questTextData.length;
        // 先查看是否有章节任务，有的话就显示章节，否则显示列表
        let sectionCfg: GameConfig.QuestSectionM;
        let itemData: QuestTrackItemData;
        for (let i = 0; i < cnt; i++) {
            itemData = this.m_questTextData[i];
            if (KeyWord.QUEST_TYPE_TRUNK == itemData.questType) {
                sectionCfg = G.DataMgr.questData.getSetionConfig(itemData.id);
                break;
            }
        }
        if (null != sectionCfg) {
            // 显示章节
            this.sectionView.update(sectionCfg, false);
            this.sectionView.gameObject.SetActive(true);
            this.content.SetActive(false);
        } else {
            // 显示列表
            let oldCnt = this.items.length;
            let recommends = G.DataMgr.taskRecommendData.getRecommendArray();
            let recommendCnt = recommends.length;
            if (oldCnt > cnt + recommendCnt) {
                for (let i = cnt + recommendCnt; i < oldCnt; i++) {
                    let item = this.items[i];
                    this.itemPool.push(item);
                    item.dispose();
                    item.gameObject.SetActive(false);
                }
                this.items.length = cnt + recommendCnt;
            }
            for (let i = 0; i < cnt; i++) {
                let item: TaskTrackItem;
                if (i < oldCnt) {
                    item = this.items[i];
                } else {
                    if (this.itemPool.length > 0) {
                        item = this.itemPool.pop();
                    } else {
                        item = new TaskTrackItem(this);
                        let itemGo = UnityEngine.GameObject.Instantiate(this.itemClone, this.content.transform, true) as UnityEngine.GameObject;
                        item.setComponents(itemGo);
                    }
                    this.items.push(item);
                }
                itemData = this.m_questTextData[i];
                item.updateQuest(itemData, xfxEnabled);
                item.gameObject.SetActive(true);
            }

            for (let i = cnt; i < cnt + recommendCnt; i++) {
                let item: TaskTrackItem;
                if (i < oldCnt) {
                    item = this.items[i];
                } else {
                    if (this.itemPool.length > 0) {
                        item = this.itemPool.pop();
                    } else {
                        item = new TaskTrackItem(this);
                        let itemGo = UnityEngine.GameObject.Instantiate(this.itemClone, this.content.transform, true) as UnityEngine.GameObject;
                        item.setComponents(itemGo);
                    }
                    this.items.push(item);
                }
                let data = recommends[i - cnt];
                item.updateRecommend(data);
                item.gameObject.SetActive(true);
            }

            this.updateSelected();
            this.sectionView.gameObject.SetActive(false);
            this.content.SetActive(true);
        }

        this.isDirty = false;
    }

    private _getDoingQuests(): void {
        let progressList: Protocol.QuestProgress[] = G.DataMgr.questData.getDoingQuestList();
        if (null == progressList) {
            return;
        }
        let progressNum: number = progressList.length;
        let progress: Protocol.QuestProgress;
        let questConfig: GameConfig.QuestConfigM;
        let questItemData: QuestTrackItemData;
        for (let i: number = 0; i < progressNum; ++i) {
            progress = progressList[i];
            questConfig = QuestData.getConfigByQuestID(progress.m_iQuestID);
            //if (QuestData.isSpecialQuestByType(questConfig.m_ucQuestType)) {
            //    // 过滤掉门派任务等
            //    continue;
            //}

            let state: number = 0;
            if (G.DataMgr.questData.isQuestCompleting(progress)) //已经完成的任务不需要显示子任务
            {
                state = EnumQuestState.Completing;
            }
            else {
                state = EnumQuestState.Doing;
            }

            questItemData = new QuestTrackItemData(progress.m_iQuestID, questConfig.m_szQuestTitle, questConfig.m_ucQuestType, state, null);
            questItemData.progress = progress;
            //				_makeQuestData(questItemData); //填充具体的任务数据.
            this.m_questTextData.push(questItemData);
        }
    }

    private _getCanAccpetQuests(): void {
        // 先抓取普通任务
        let quests: number[] = G.DataMgr.questData.getAllAcceptableNormalQuests(G.DataMgr.heroData);
        if (null == quests) {
            return;
        }
        let len: number = quests.length;
        let questItemData: QuestTrackItemData;
        let questID: number = 0;
        let questConfig: GameConfig.QuestConfigM;
        let levelLimit: number = 0;
        for (let i: number = 0; i < len; ++i) {
            questID = quests[i];
            questConfig = QuestData.getConfigByQuestID(questID);
            //悬赏任务的可接不显示
            if (questConfig.m_ucQuestType == KeyWord.QUEST_TYPE_HUANG_BANG) {
                continue;
            }
            levelLimit = questConfig.m_stPrefixCondition.m_ucLevelLowerLimit;
            questItemData = new QuestTrackItemData(questID,
                G.DataMgr.questData.isLevelMeet(G.DataMgr.heroData.level, levelLimit, questConfig.m_stPrefixCondition.m_ucLevelUpperLimit) ?
                    questConfig.m_szQuestTitle : questConfig.m_szQuestTitle + '(' + levelLimit + '级)',
                questConfig.m_ucQuestType, EnumQuestState.Acceptable, null);
            this.m_questTextData.push(questItemData);
        }
    }

    private getLoopRewards() {
        let questData = G.DataMgr.questData;
        // 先看看日常任务是否可以领奖
        if (!questData.noTipLoopRewardsMap[KeyWord.QUEST_TYPE_DAILY] && ((G.DataMgr.systemData.dayOperateBits & Macros.DAY_QUEST_DAILY) == 0) && questData.dailyCompleteTime == QuestData.DAILY_QUEST_MAX_TIME) {
            let questItemData = new QuestTrackItemData(0, '环任务奖励', KeyWord.QUEST_TYPE_DAILY, EnumQuestState.ExtraReward, '点击领取双倍奖励');
            this.m_questTextData.push(questItemData);
        }
        // 再看看宗门环任务是否可以领奖
        if (!questData.noTipLoopRewardsMap[KeyWord.QUEST_TYPE_GUILD_DAILY] && ((G.DataMgr.systemData.dayOperateBits & Macros.DAY_QUEST_GUILD) == 0) && questData.guildDailyCompletedNumer > 0 && questData.guildDailyCompletedNumer == questData.maxGuildQuestNum) {
            let questItemData = new QuestTrackItemData(0, '环任务奖励', KeyWord.QUEST_TYPE_GUILD_DAILY, EnumQuestState.ExtraReward, '点击领取双倍奖励');
            this.m_questTextData.push(questItemData);
        }
    }

    private sortQuests(a: QuestTrackItemData, b: QuestTrackItemData): number {
        let cfgA: GameConfig.QuestConfigM = QuestData.getConfigByQuestID(a.id);
        let cfgB: GameConfig.QuestConfigM = QuestData.getConfigByQuestID(b.id);

        let aType = a.questType;
        let bType = b.questType;
        if (null != cfgA) {
            aType = cfgA.m_ucQuestType;
        }
        if (null != cfgB) {
            bType = cfgB.m_ucQuestType;
        }

        if (aType != bType) {
            return QuestData.COMMON_TYPES.indexOf(aType) - QuestData.COMMON_TYPES.indexOf(bType);
        }

        if (a.state == b.state) {
            if (null == cfgA || null == cfgB) {
                return 0;
            }
            if (cfgA.m_iQuestSortID == cfgB.m_iQuestSortID) {
                return cfgA.m_stPrefixCondition.m_ucLevelLowerLimit - cfgB.m_stPrefixCondition.m_ucLevelLowerLimit;
            }
            return cfgA.m_iQuestSortID - cfgB.m_iQuestSortID;
        }
        else {
            return b.state - a.state;
        }
    }

    guideOnQuest(qid: number) {
        // 如果当前正在显示章节任务，则直接指向章节按钮
        // 注意panel需以左上角为原点，锚点不要使用四周扩展模式，否则计算结果会有问题
        let pos: UnityEngine.Vector3;
        if (this.sectionView.gameObject.activeSelf) {
            pos = this.sectionArrowPos;
        } else {
            let cnt = this.m_questTextData.length;
            if (cnt > 0) {
                let idx = 0;
                if (qid > 0) {
                    for (let i = 0; i < cnt; i++) {
                        let td = this.m_questTextData[i];
                        if (td.id == qid) {
                            idx = i;
                            break;
                        }
                    }
                }
                let targetItem = this.items[idx];
                this.setSelected(targetItem.Id);
                let itemRt = targetItem.gameObject.transform as UnityEngine.RectTransform;
                let itemLpY = itemRt.localPosition.y;
                let contentRt = this.content.transform as UnityEngine.RectTransform;
                let maxY = Math.max(0, contentRt.sizeDelta.y - this.trackListHeight);
                let cy = Math.min(-itemLpY, maxY);
                cy += this.contentPositionY;
                if (contentRt.localPosition.y != cy) {
                    contentRt.localPosition = G.getCacheV3(contentRt.localPosition.x, cy, 0);
                }

                pos = G.getCacheV3(this.sectionArrowPos.x, itemLpY - itemRt.sizeDelta.y / 2 + cy + this.trackListPosY, -100);
            }
        }

        if (pos) {
            this.arrow.transform.localPosition = pos;
            this.arrow.SetActive(true);
        } else {
            this.arrow.SetActive(false);
        }
    }

    guideOff() {
        this.arrow.SetActive(false);
    }
}