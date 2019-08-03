import { FindPosStrategy } from './../constants/GameEnum';
import { ConfirmCheck } from './../tip/TipManager';
import { MonsterData } from 'System/data/MonsterData';
import { MessageBoxConst } from 'System/tip/TipManager';
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { EnumMainViewChild } from "System/main/view/MainView";
import { Macros } from "System/protocol/Macros";
import { TipFrom } from "System/tip/view/TipsView";
import { IconItem } from "System/uilib/IconItem";
import { List } from "System/uilib/List";
import { ListItemCtrl } from "System/uilib/ListItemCtrl";
import { NestedSubForm } from "System/uilib/NestedForm";
import { UiElements } from "System/uilib/UiElements";
import { ElemFinder } from "System/uilib/UiUtility";
import { Color } from "System/utils/ColorUtil";
import { DataFormatter } from "System/utils/DataFormatter";
import { RegExpUtil } from "System/utils/RegExpUtil";
import { TextFieldUtil } from "System/utils/TextFieldUtil";
import { KeyWord } from 'System/constants/KeyWord'
import { GuildTools } from 'System/guild/GuildTools'
import { RoleAvatar } from 'System/unit/avatar/RoleAvatar'
import { MainView } from "System/main/view/MainView"

class PinstanceBossItem2 {
    private textName: UnityEngine.UI.Text;
    private textTime: UnityEngine.UI.Text;
    gameObject: UnityEngine.GameObject;
    data: any = null;
    typeid: number = 0;
    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;
        let wrapper = ElemFinder.findObject(go, 'wrapper');
        this.textName = ElemFinder.findText(wrapper, 'textName');
        this.textTime = ElemFinder.findText(wrapper, 'textTime');
    }

    update(typeid: number, data1: Protocol.SceneInfoOneMonster, data2: Protocol.SceneInfoOneBloodMonster,
        data3: Protocol.SceneInfoOneRole, index: number) {
        this.typeid = typeid;
        let data: any = null;
        if (typeid == Macros.SCENERIGHT_MONSTER) {
            data = data1;
        } else if (typeid == Macros.SCENERIGHT_BLOOD_MONSTER) {
            data = data2;
        }
        else if (typeid == Macros.SCENERIGHT_ROLE) {
            data = data3;
        }
        if (this.data != data) {
            this.data = data;
            let cfg: GameConfig.MonsterConfigM;
            if (typeid == Macros.SCENERIGHT_MONSTER || typeid == Macros.SCENERIGHT_BLOOD_MONSTER) {
                cfg = MonsterData.getMonsterConfig(data.m_uiMonstID);
                if (!cfg) {
                    uts.logWarning("怪物不存在：" + data.m_uiMonstID);
                }

                let curPinstanceID = G.DataMgr.sceneData.curPinstanceID;
                if (curPinstanceID == Macros.PINSTANCE_ID_DIGONG) {
                    this.textName.text = uts.format('{0}', cfg.m_szMonsterName);
                } else {
                    this.textName.text = uts.format('Lv.{0}{1}', cfg.m_usLevel, cfg.m_szMonsterName);
                }
                //if (Macros.PINSTANCE_ID_HOME_BOSS == G.DataMgr.sceneData.curPinstanceID) {
                //    //boss之家
                //this.textName.text = uts.format('Lv.{0} {1}', cfg.m_usLevel, cfg.m_szMonsterName);
                //} else {
                //   // this.textName.text = cfg.m_szMonsterName;
                //    this.textName.text = uts.format('Lv.{0} {1}', cfg.m_usLevel, cfg.m_szMonsterName);
                //}

            }
            else if (typeid == Macros.SCENERIGHT_ROLE) {
                this.textName.text = TextFieldUtil.getColorText(data3.m_szName, data3.m_iWorldID == G.DataMgr.gameParas.myWorldID ? Color.GREEN : Color.RED);
                this.textTime.gameObject.SetActive(false);
            }
        }
        if (typeid == Macros.SCENERIGHT_MONSTER) {
            let realdata = (this.data as Protocol.SceneInfoOneMonster);
            if (0 != realdata.m_ucIsKilled && realdata.m_iRevaveTime > 0) {
                // 显示倒计时
                let leftSecond = Math.max(0, realdata.m_iRevaveTime - Math.round(G.SyncTime.getCurrentTime() / 1000));
                this.textTime.text = TextFieldUtil.getColorText(DataFormatter.second2hhmmss(leftSecond), Color.RED);
            } else {
                // 显示刷新
                let curPinstanceID = G.DataMgr.sceneData.curPinstanceID;
                let str: string = "";
                if (curPinstanceID == Macros.PINSTANCE_ID_DIGONG) {
                    let tmpstr = index < 2 ? "安全区域" : "危险区域";
                    str = TextFieldUtil.getColorText(tmpstr, index < 2 ? Color.GREEN : Color.RED);
                } 
                else {
                    str = TextFieldUtil.getColorText("已刷新", Color.GREEN);
                }
                this.textTime.text = str;
            }
            this.textTime.gameObject.SetActive(true);
        } else if (typeid == Macros.SCENERIGHT_BLOOD_MONSTER) {
            let realdata = (this.data as Protocol.SceneInfoOneBloodMonster);
            let c = ['魅', '魔', '仙', '神', '凡'];
            let cfg = MonsterData.getMonsterConfig(realdata.m_uiMonstID);
            if (!cfg) {
                uts.logWarning("怪物不存在：" + realdata.m_uiMonstID);
            }
            this.textName.text = uts.format('{0}·{1}', c[realdata.m_ucCamp - 11], cfg.m_szMonsterName);
            // 显示血条
            this.textTime.gameObject.SetActive(false);
        }
    }
}
class PinstanceStatRankItem extends ListItemCtrl {
    gameObject: UnityEngine.GameObject;

    private column0: UnityEngine.UI.Text;
    private column1: UnityEngine.UI.Text;
    private column2: UnityEngine.UI.Text;

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;
        this.column0 = ElemFinder.findText(go, 'column0');
        this.column1 = ElemFinder.findText(go, 'column1');
        this.column2 = ElemFinder.findText(go, 'column2');
    }

    update(filedInfo: Protocol.SceneInfoOneField, isMe: boolean) {
        this.column0.text = filedInfo.m_uiField1.toString();
        this.column1.text = filedInfo.m_szField2;
        this.column2.text = filedInfo.m_uiField3.toString();
        if (isMe) {
            this.column0.color = Color.toUnityColor(Color.GREEN);
            this.column1.color = Color.toUnityColor(Color.GREEN);
            this.column2.color = Color.toUnityColor(Color.GREEN);
        } else {
            this.column0.color = Color.toUnityColor('ffffcc');
            this.column1.color = Color.toUnityColor('ffffcc');
            this.column2.color = Color.toUnityColor('ffffcc');
        }
    }
}

class PinstanceStatLogic {
    private static readonly maxBtnPerLine: number = 2;

    private content: UnityEngine.GameObject;
    private titleText: UnityEngine.UI.Text;

    /**文本行复制源*/
    private _imgLineClone: UnityEngine.UI.Image;

    private _imgLines: UnityEngine.UI.Image[] = [];
    private _imgLinePool: UnityEngine.UI.Image[] = [];
    private textlineClone: UnityEngine.GameObject;
    private textlines: UnityEngine.GameObject[] = [];
    private textlinePool: UnityEngine.GameObject[] = [];
    /**UIText文本行复制源*/
    private uiTextClone: UnityEngine.UI.UIText;
    private uiTexts: UnityEngine.UI.UIText[] = [];
    private uiTextPool: UnityEngine.UI.UIText[] = [];
    /**带背景的文本行复制源*/
    private bgTextlineClone: UnityEngine.GameObject;
    private bgTextlines: UnityEngine.GameObject[] = [];
    private bgTextlinePool: UnityEngine.GameObject[] = [];
    /**倒计时映射表*/
    private countDownMap: { [timerId: number]: UnityEngine.UI.Text } = {};
    private countDownInfos: Protocol.SceneInfoCountdown[] = [];

    /**按钮组复制源*/
    private btnClone: UnityEngine.GameObject;
    private btns: UnityEngine.GameObject[] = [];
    private btnPool: UnityEngine.GameObject[] = [];

    /**物品图标list复制源*/
    private thingListClone: UnityEngine.GameObject;
    private thingLists: UnityEngine.GameObject[] = [];
    private thingListPool: UnityEngine.GameObject[] = [];
    private thingIcons: Array<IconItem[]> = [];

    /**分割线复制源*/
    private lineClone: UnityEngine.GameObject;
    private lines: UnityEngine.GameObject[] = [];
    private linePool: UnityEngine.GameObject[] = [];

    /**进度条复制源*/
    private progressClone: UnityEngine.GameObject;
    private progresses: UnityEngine.GameObject[] = [];
    private progressPool: UnityEngine.GameObject[] = [];

    /**排行榜复制源*/
    private rankHeadClone: UnityEngine.GameObject;
    private rankItemClone: UnityEngine.GameObject;
    private rankItems: PinstanceStatRankItem[] = [];
    private rankItemPool: PinstanceStatRankItem[] = [];

    /**查看排行按钮*/
    private switchRank: UnityEngine.GameObject;
    private btnRank: UnityEngine.GameObject;
    private labelBtnRank: UnityEngine.UI.Text;

    private itemIcon_Normal: UnityEngine.GameObject;
    private bottom: UnityEngine.GameObject;

    private guajiExp: number = 0;

    private contentIndex: number = 0;

    private statView: PinstanceStatView;
    private _imageAltas: Game.UGUIAltas;

    public hasTarget = false;
    public targetPosX = 0;
    public targetPosY = 0;

    setElems(elems: UiElements, statView: PinstanceStatView, altas: Game.UGUIAltas) {
        this.statView = statView;
        this._imageAltas = altas;
        elems = elems.getUiElements('stat');

        this.titleText = elems.getText('title');
        this.content = elems.getElement('content');
        this.textlines.push(this.textlineClone = elems.getElement('textlineClone'));
        this._imgLines.push(this._imgLineClone = elems.getImage('imageClone'));
        this.uiTexts.push(this.uiTextClone = elems.getUIText('uiTextClone'));
        this.bgTextlines.push(this.bgTextlineClone = elems.getElement('bgTextlineClone'));
        this.btns.push(this.btnClone = elems.getElement('btnClone'));
        // icon list不能push进数组里，因会在其上面动态加上icon，如果一方面用来使用，另一方面又用来clone，
        // 会把icon也clone出来，这样icon可能会重复
        this.thingListClone = elems.getElement('thingListClone');
        this.thingListClone.SetActive(false);
        this.lines.push(this.lineClone = elems.getElement('lineClone'));
        this.progresses.push(this.progressClone = elems.getElement('progressClone'));
        this.rankHeadClone = elems.getElement('rankHeadClone');
        this.rankItemClone = elems.getElement('rankItemClone')
        let rankItem = new PinstanceStatRankItem();
        rankItem.setComponents(this.rankItemClone);
        this.rankItems.push(rankItem);

        this.switchRank = elems.getElement('switchRank');
        this.btnRank = elems.getElement('btnRank');
        this.labelBtnRank = elems.getText('labelBtnRank');

        this.itemIcon_Normal = elems.getElement('itemIcon_Normal');
        this.bottom = elems.getElement('bottom');

        Game.UIClickListener.Get(this.btnRank).onClick = delegate(this, this.onClickBtnRank);
    }

    updateView(): boolean {
        let rightInfo = G.DataMgr.pinstanceData.rightInfo;
        if (rightInfo == null) {
            return false;
        }
        //if (data.m_uiTipsID > 0) {
        //    text = G.DataMgr.errorData.getSysTipText(data.m_uiTipsID);
        //    if (this._questTipData == null) {
        //        this._questTipData = new TextTipData();
        //    }

        //    this._questTipData.setTipData(text);

        //    this._btnQuestion.visible = true;
        //    TipMgr.setTip(this._btnQuestion, this._questTipData);
        //}
        //else {
        //    this._btnQuestion.visible = false;
        //}
        this.reset();
        let hasCountDown = false;
        this.titleText.text = rightInfo.m_szTitle;

        let count: number = rightInfo.m_astData.length;
        let data: Protocol.SceneInfoRight;
        for (let i: number = 0; i < count; i++) {
            data = rightInfo.m_astData[i];
            if (data.m_ucType == Macros.SCENERIGHT_TEXT) {
                // 普通文本
                let t = data.m_stValue.m_stText;
                if (t.m_ucIsShow > 0) {
                    this.addBgText(t.m_szString);
                } else {
                    if (t.m_stParameter != null && t.m_stParameter.m_ucTpye>0) {
                        this.addUIText(t.m_szString, t.m_stParameter);
                    } else {
                        this.addSceneInfoText(t.m_szString);
                    }
                }
            }
            else if (data.m_ucType == Macros.SCENERIGHT_ZAZENEXP) {
                // 挂机经验
                this.guajiExp += data.m_stValue.m_uiExp;
                this.addSceneInfoText(uts.format('挂机经验：{0}', DataFormatter.formatNumber(this.guajiExp, 10000)));
            }
            else if (data.m_ucType == Macros.SCENERIGHT_COUNTDOWN) {
                // 倒计时
                let countDownData = data.m_stValue.m_stCountdown;
                if (0 == countDownData.m_ucIsCenter) {
                    let szTime: string = TextFieldUtil.getColorText( RegExpUtil.xlsDesc2Html(countDownData.m_szTitle),Color.YELLOW) + TextFieldUtil.getColorText(DataFormatter.second2hhmmss(countDownData.m_uiTime), Color.GREEN);
                    let text = this.addSceneInfoText(szTime);
                    this.countDownMap[countDownData.m_ucTimeID] = text;
                    if (countDownData.m_uiTime > 0) {
                        this.countDownInfos.push(countDownData);
                        hasCountDown = true;
                    }
                }
            }
            //按钮
            else if (data.m_ucType == Macros.SCENERIGHT_BUTTON) {
                this.addButtons(data.m_stValue.m_stButton);
            }
            // 进度条
            else if (data.m_ucType == Macros.SCENERIGHT_PROGRESS) {
                this.addProgress(data.m_stValue.m_stProgress);
            }
            // 排行列表
            else if (data.m_ucType == Macros.SCENERIGHT_RANK) {
                this.addRankList(data.m_stValue.m_stRank);
            }
            // 物品列表
            else if (data.m_ucType == Macros.SCENERIGHT_THING) {
                this.addThingList(data.m_stValue.m_stThing);
            }
            // 分割线
            else if (data.m_ucType == Macros.SCENERIGHT_LINE) {
                this.addSeperateLine();
            }
            // 八卦阵
            else if (data.m_ucType == Macros.SCENERIGHT_BM_INFO) {
                //posY = _addBaguazhenInfo(holder, posY, data.m_stValue.m_stBMInfo.m_astInfo);
            }
            else if (data.m_ucType == Macros.SCENERIGHT_TASK_INFO) {
                //posY = this.addTaskInfo(holder, posY, data.m_stValue.m_stTaskInfo);
            }
            else if (data.m_ucType == Macros.SCENERIGHT_IMAGE) {
                this._addImage(data.m_stValue.m_stImage.m_iImageID);
            }
            else if (data.m_ucType == Macros.SCENERIGHT_TARGET_COORD) {
                let c = data.m_stValue.m_stTargetCoord;

                this.targetPosX = c.m_iPosX;
                this.targetPosY = c.m_iPosY;
                this.hasTarget = true;
                this.statView.checkArrowTimer();
            }
        }

        this.checkBtnRank();

        return hasCountDown;
    }

    private _addImage(imageID) {
        let imgLine: UnityEngine.UI.Image;
        if (this._imgLinePool.length > 0) {
            imgLine = this._imgLinePool.pop();
        } else {
            imgLine = UnityEngine.UnityObject.Instantiate(this._imgLineClone, this.content.transform, false) as UnityEngine.UI.Image;
        }
        imgLine.gameObject.SetActive(true);
        this._imgLines.push(imgLine);

        imgLine.sprite = this._imageAltas.Get(this._getImgName() + '_' + imageID);
        imgLine.transform.SetSiblingIndex(this.contentIndex);
        this.contentIndex++;
        return imgLine;
    }

    private _getImgName(): string {
        let curPinID = G.DataMgr.sceneData.curPinstanceID;
        switch (curPinID) {
            case Macros.PINSTANCE_ID_ZZHC:
                return 'kfLingDi';
        }
        return '';
    }

    reset() {
        this.titleText.text = '';
        this.countDownInfos.length = 0;
        // 先清理版面
        for (let i: number = this.textlines.length - 1; i >= 0; i--) {
            this.textlines[i].SetActive(false);
            this.textlinePool.push(this.textlines[i]);
        }
        this.textlines.length = 0;

        for (let i: number = this._imgLines.length - 1; i >= 0; i--) {
            this._imgLines[i].gameObject.SetActive(false);
            this._imgLinePool.push(this._imgLines[i]);
        }
        this._imgLines.length = 0;

        for (let i: number = this.uiTexts.length - 1; i >= 0; i--) {
            this.uiTexts[i].gameObject.SetActive(false);
            this.uiTextPool.push(this.uiTexts[i]);
        }
        this.uiTexts.length = 0;

        for (let i: number = this.bgTextlines.length - 1; i >= 0; i--) {
            this.bgTextlines[i].SetActive(false);
            this.bgTextlinePool.push(this.bgTextlines[i]);
        }
        this.bgTextlines.length = 0;

        for (let i: number = this.btns.length - 1; i >= 0; i--) {
            this.btns[i].SetActive(false);
            this.btnPool.push(this.btns[i]);
        }
        this.btns.length = 0;

        for (let i: number = this.thingLists.length - 1; i >= 0; i--) {
            this.thingLists[i].SetActive(false);
            this.thingListPool.push(this.thingLists[i]);
        }
        this.thingLists.length = 0;

        for (let i: number = this.lines.length - 1; i >= 0; i--) {
            this.lines[i].SetActive(false);
            this.linePool.push(this.lines[i]);
        }
        this.lines.length = 0;

        for (let i: number = this.progresses.length - 1; i >= 0; i--) {
            this.progresses[i].SetActive(false);
            this.progressPool.push(this.progresses[i]);
        }
        this.progresses.length = 0;

        this.rankHeadClone.SetActive(false);
        for (let i: number = this.rankItems.length - 1; i >= 0; i--) {
            this.rankItems[i].gameObject.SetActive(false);
            this.rankItemPool.push(this.rankItems[i]);
        }
        this.rankItems.length = 0;

        this.switchRank.SetActive(false);

        let sceneData = G.DataMgr.sceneData;
        let sceneCfg = sceneData.getSceneInfo(sceneData.curSceneID);

        // 因titlebar固定在最顶端，所以index从1开始
        this.contentIndex = 1;

        this.hasTarget = false;
    }

    private addSceneInfoText(str: string): UnityEngine.UI.Text {
        let textline: UnityEngine.GameObject;
        if (this.textlinePool.length > 0) {
            textline = this.textlinePool.pop();
        } else {
            textline = UnityEngine.UnityObject.Instantiate(this.textlineClone, this.content.transform, false) as UnityEngine.GameObject;
        }
        textline.SetActive(true);
        this.textlines.push(textline);
        // 显示文本内容
        let text = ElemFinder.findText(textline, 'text');
        text.text = RegExpUtil.xlsDesc2Html(str);
        textline.transform.SetSiblingIndex(this.contentIndex);
        this.contentIndex++;
        return text;
    }

    private addUIText(str: string, para: Protocol.SceneInfoParameter) {
        let uiText: UnityEngine.UI.UIText;
        if (this.uiTextPool.length > 0) {
            uiText = this.uiTextPool.pop();
        } else {
            uiText = UnityEngine.UnityObject.Instantiate(this.uiTextClone, this.content.transform, false) as UnityEngine.UI.UIText;
        }
        uiText.gameObject.SetActive(true);
        this.uiTexts.push(uiText);
        // 显示文本内容
        uiText.text = RegExpUtil.xlsDesc2Html(str, true);
        uiText.transform.SetSiblingIndex(this.contentIndex);
        let textUrl = uiText.GetComponentInChildren(UnityEngine.UI.UITextUrl.GetType()) as UnityEngine.UI.UITextUrl;
        textUrl.onUrlClick = delegate(this, this.onClickURL, para);
        this.contentIndex++;
    }

    private addBgText(str: string): UnityEngine.UI.Text {
        let bgTextline: UnityEngine.GameObject;
        if (this.bgTextlinePool.length > 0) {
            bgTextline = this.bgTextlinePool.pop();
        } else {
            bgTextline = UnityEngine.UnityObject.Instantiate(this.bgTextlineClone, this.content.transform, false) as UnityEngine.GameObject;
        }
        bgTextline.SetActive(true);
        this.bgTextlines.push(bgTextline);
        // 显示文本内容
        let text = ElemFinder.findText(bgTextline, 'text');
        text.text = RegExpUtil.xlsDesc2Html(str);
        bgTextline.transform.SetSiblingIndex(this.contentIndex);
        this.contentIndex++;
        return text;
    }

    private addButtons(buttonList: Protocol.SceneInfoButtonList) {
        // 仅保留离开按钮
        for (let i = buttonList.m_ucNum - 1; i >= 0; i--) {
            if (Macros.SCENEINFO_BUTTON_EXIT != buttonList.m_aucButtonType[i]) {
                buttonList.m_aucButtonType.splice(i, 1);
                buttonList.m_ucNum--;
            }
        }

        let btnsGo: UnityEngine.GameObject;
        if (this.btnPool.length > 0) {
            btnsGo = this.btnPool.pop();
        } else {
            btnsGo = UnityEngine.UnityObject.Instantiate(this.btnClone, this.content.transform, false) as UnityEngine.GameObject;
        }
        btnsGo.SetActive(true);
        this.btns.push(btnsGo);

        for (let i = 0; i < buttonList.m_ucNum; i++) {
            let btnType: number = buttonList.m_aucButtonType[i];

            let btn = ElemFinder.findObject(btnsGo, 'btn' + i);
            Game.UIClickListener.Get(btn).onClick = delegate(this, this.onButtonClick, btnType);
            btn.gameObject.SetActive(true);

            let btnLabel = ElemFinder.findText(btn.gameObject, 'Text');
            // 按钮类型信息，1退出、2战斗
            if (btnType == Macros.SCENEINFO_BUTTON_EXIT) {
                btnLabel.text = '退出';
            } else if (btnType == Macros.SCENEINFO_BUTTON_CALL) {
                btnLabel.text = '退出';
            }
        }
        for (let i = buttonList.m_ucNum; i < PinstanceStatLogic.maxBtnPerLine; i++) {
            let btn = ElemFinder.findObject(btnsGo, 'btn' + i);
            btn.gameObject.SetActive(false);
        }
        btnsGo.transform.SetSiblingIndex(this.contentIndex);
        this.contentIndex++;
    }

    private addThingList(info: Protocol.SceneInfoThingList) {
        let curThingListCnt = this.thingLists.length;
        let icons: IconItem[];
        if (curThingListCnt < this.thingIcons.length) {
            icons = this.thingIcons[curThingListCnt];
        } else {
            this.thingIcons.push(icons = []);
        }

        let thingListGo: UnityEngine.GameObject;
        if (this.thingListPool.length > 0) {
            thingListGo = this.thingListPool.pop();
        } else {
            thingListGo = UnityEngine.UnityObject.Instantiate(this.thingListClone, this.content.transform, false) as UnityEngine.GameObject;
        }
        thingListGo.SetActive(true);
        this.thingLists.push(thingListGo);

        let oldThingIconCnt = icons.length;
        for (let i = 0; i < info.m_ucNum; i++) {
            let thingIcon: IconItem;
            if (i < oldThingIconCnt) {
                thingIcon = icons[i];
                thingIcon.gameObject.SetActive(true);
            } else {
                icons.push(thingIcon = new IconItem());
                let iconGo = UnityEngine.UnityObject.Instantiate(this.itemIcon_Normal, thingListGo.transform, false) as UnityEngine.GameObject;
                thingIcon.setUsuallyIcon(iconGo);
                thingIcon.setTipFrom(TipFrom.normal);
            }
            thingIcon.updateById(info.m_astThing[i].m_uiThingID, info.m_astThing[i].m_uiThingNum);
            thingIcon.updateIcon();
            thingIcon.setStarLevelFlagScale(0.7);
        }
        for (let i = info.m_ucNum; i < oldThingIconCnt; i++) {
            icons[i].gameObject.SetActive(false);
        }
        thingListGo.transform.SetSiblingIndex(this.contentIndex);
        this.contentIndex++;
    }

    private addSeperateLine(): UnityEngine.GameObject {
        let line: UnityEngine.GameObject;
        if (this.linePool.length > 0) {
            line = this.linePool.pop();
        } else {
            line = UnityEngine.UnityObject.Instantiate(this.lineClone, this.content.transform, false) as UnityEngine.GameObject;
        }
        line.SetActive(true);
        this.lines.push(line);

        line.transform.SetSiblingIndex(this.contentIndex);
        this.contentIndex++;
        return line;
    }

    private addProgress(progressInfo: Protocol.SceneInfoProgress) {
        let progress: UnityEngine.GameObject;
        if (this.progressPool.length > 0) {
            progress = this.progressPool.pop();
        } else {
            progress = UnityEngine.UnityObject.Instantiate(this.progressClone, this.content.transform, false) as UnityEngine.GameObject;
        }
        let bar = ElemFinder.findImage(progress, 'bar/progress');
        bar.fillAmount = progressInfo.m_ucNum / 100;
        //bar.transform.localScale = new UnityEngine.Vector3(progressInfo.m_ucNum / 100, 1, 1);
        let text = ElemFinder.findText(progress, 'bar/text');
        text.text = uts.format('{0}%', progressInfo.m_ucNum);
        progress.SetActive(true);
        this.progresses.push(progress);

        progress.transform.SetSiblingIndex(this.contentIndex);
        this.contentIndex++;
    }

    private addRankList(rankInfo: Protocol.SceneInfoRank) {
        // 表头
        this.rankHeadClone.SetActive(true);
        let head0 = ElemFinder.findText(this.rankHeadClone, 'head0');
        head0.text = rankInfo.m_szTitle1;
        let head1 = ElemFinder.findText(this.rankHeadClone, 'head1');
        head1.text = rankInfo.m_szTitle2;
        let head2 = ElemFinder.findText(this.rankHeadClone, 'head2');
        head2.text = rankInfo.m_szTitle3;
        this.rankHeadClone.transform.SetSiblingIndex(this.contentIndex);
        this.contentIndex++;
        // 表内容
        let hasMyField = false;
        for (let i = 0; i < rankInfo.m_ucFieldNum; i++) {
            let isMe = rankInfo.m_astField[i].m_uiField1 == rankInfo.m_stOwnerField.m_uiField1;
            this.addRankItem(rankInfo.m_astField[i], isMe);
            if (!hasMyField) {
                hasMyField = isMe;
            }
        }

        // 再添加自己的
        if (!hasMyField && rankInfo.m_stOwnerField.m_uiField1 > 0) {
            this.addRankItem(rankInfo.m_stOwnerField, true);
        }
    }

    private addRankItem(fieldInfo: Protocol.SceneInfoOneField, isMe: boolean) {
        let item: PinstanceStatRankItem;
        if (this.rankItemPool.length > 0) {
            item = this.rankItemPool.pop();
        } else {
            let itemGo = UnityEngine.UnityObject.Instantiate(this.rankItemClone, this.content.transform, false) as UnityEngine.GameObject;
            item = new PinstanceStatRankItem();
            item.setComponents(itemGo);
        }
        item.update(fieldInfo, isMe);
        item.gameObject.SetActive(true);
        this.rankItems.push(item);

        item.gameObject.transform.SetSiblingIndex(this.contentIndex);
        this.contentIndex++;
    }

    checkBtnRank() {
        let pinstanceData = G.DataMgr.pinstanceData;
        if (null != pinstanceData.hurtInfo) {
            //this.switchRank.SetActive(true);
            if (pinstanceData.needAutoOpenRank) {
                // 自动弹开伤害排行
                pinstanceData.needAutoOpenRank = false;
                this.onClickBtnRank();
                // 如果是在世界boss中则自动收起统计信息
                let sceneData = G.DataMgr.sceneData;
                if (Macros.PINSTANCE_ID_DIGONG == sceneData.curPinstanceID || Macros.PINSTANCE_ID_WORLDBOSS == sceneData.curPinstanceID) {
                    this.statView.setState(false);
                }
            } else {
                this.setLabelBtnRank(this.statView.isShowingRank());
            }
        } else {
            this.switchRank.SetActive(false);
        }
    }

    private setLabelBtnRank(isRankOpened: boolean) {
        if (isRankOpened) {
            this.labelBtnRank.text = '隐藏排行';
        } else {
            this.labelBtnRank.text = '查看排行';
        }
    }
    ///////////////////////////////////////// 事件处理 /////////////////////////////////////////

    onCountDownTimer(timer: Game.Timer): boolean {
        let deltaCallCount = timer.CallCountDelta;
        for (let i: number = this.countDownInfos.length - 1; i >= 0; i--) {
            let countDownData = this.countDownInfos[i];
            countDownData.m_uiTime -= deltaCallCount;

            if (countDownData.m_uiTime <= 0) {
                this.countDownInfos.splice(i);
            }
            let text = this.countDownMap[countDownData.m_ucTimeID];
            text.text =  TextFieldUtil.getColorText(RegExpUtil.xlsDesc2Html(countDownData.m_szTitle),Color.YELLOW) +  TextFieldUtil.getColorText(DataFormatter.second2hhmmss(countDownData.m_uiTime), Color.GREEN);
        }

        return (this.countDownInfos.length > 0);
    }

    private onClickURL(url: string, param: Protocol.SceneInfoParameter) {
        // if (1 == param.m_ucTpye) {
        //     // 以uin为参数
        //     let uin = param.m_uiParameter1;
        //     if (G.DataMgr.heroData.uin != uin) {
        //         let role = G.UnitMgr.getRoleByUIN(uin);
        //         if (role) {
        //             G.UnitMgr.selectUnit(role.Data.unitID, false);
        //             G.UnitMgr.hero.attackAuto();
        //         } else {
        //             G.TipMgr.addMainFloatTip('玩家不在视野范围内！');
        //         }
        //     }
        // } else if (2 == param.m_ucTpye){
            //怪物
            let monsterId = param.m_uiParameter1;
            let curPinstanceID = G.DataMgr.sceneData.curPinstanceID;
            if (curPinstanceID == Macros.PINSTANCE_ID_GUILDPVP|| curPinstanceID == Macros.PINSTANCE_ID_YMZC) {
                let pinstanceStatView = G.Uimgr.getChildForm<PinstanceStatView>(MainView, EnumMainViewChild.pinstanceStat);
                if (pinstanceStatView) {
                    pinstanceStatView.onClickBoss(monsterId, true);

                }
            }
        // }
    }

    private onClickBtnRank() {
        let isRankOpened = this.statView.switchRank();
        this.setLabelBtnRank(isRankOpened);
    }

    private onButtonClick(btnType: number): void {
        if (btnType == Macros.SCENEINFO_BUTTON_EXIT) {
            G.ModuleMgr.pinstanceModule.onClickQuitPinstance(false);
        }
        else if (btnType == Macros.SCENEINFO_BUTTON_CALL) {
            GuildTools.summonGuildMembers();
        }
        else if (btnType == Macros.SCENEINFO_BUTTON_FIGHT) {
            if (G.DataMgr.runtime.isHangingUp) {
                G.ModuleMgr.deputyModule.startEndHangUp(false);
            }
            else {
                G.ModuleMgr.deputyModule.startEndHangUp(true, 0);
            }
        }
        //else if (btnType == Macros.SCENEINFO_BUTTON_RANK_ZPQYH) {
        //    this.dispatchEvent(Events.SHOW_CLOSE_GUILD_PVP_RANK_DIALOG, DialogCmd.toggle);
        //}
        //else if (btnType == Macros.SCENEINFO_BUTTON_RANK_YMZC) // 极星塔信息
        //{
        //    this.dispatchEvent(Events.OpenCloseJXTRankDialog, DialogCmd.toggle);
        //}
        //else if (btnType == Macros.SCENEINFO_BUTTON_RANK_YSZC) {
        //    this.dispatchEvent(Events.ShowYszcRankDialog);
        //}
        //else if (btnType == Macros.SCENEINFO_BUTTON_REWARD_YSZC) {
        //    if (MapId.PINSTANCE_CROSS_GUILD == G.DataMgr.sceneData.curPinstanceID) {
        //        this.dispatchEvent(Events.showGuildCrossPvpRewardDialog, DialogCmd.toggle);
        //    }
        //    else {
        //        this.dispatchEvent(Events.ShowYszcRewardDialog);
        //    }
        //}
    }
}

class PinstanceHurtItem {
    private rankText: UnityEngine.UI.Text;
    private nameText: UnityEngine.UI.Text;
    private hurtText: UnityEngine.UI.Text;

    //private bar: UnityEngine.GameObject;
    //private barProgress: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.rankText = ElemFinder.findText(go, 'rankText');
        this.nameText = ElemFinder.findText(go, 'nameText');

        //this.bar = ElemFinder.findObject(go, 'bar');
        //this.barProgress = ElemFinder.findObject(this.bar, 'progress');
        this.hurtText = ElemFinder.findText(go, 'hurtText');
    }

    update(rank: number, info: Protocol.SceneRoleHurt, totalHurt: number, showProgress: boolean) {
        this.rankText.text = rank.toString();
        this.nameText.text = info.m_szRoleInfo;

        if (showProgress) {
            if (info.m_uiHurtNum > 0) {
                let rate = info.m_uiHurtNum / totalHurt;
                //this.barProgress.transform.localScale = G.getCacheV3(rate, 1, 1);
                this.hurtText.text = uts.format('{0}%', (rate * 100).toFixed(1));
            } else {
                //this.barProgress.transform.localScale = G.getCacheV3(0, 1, 1);
                this.hurtText.text = '0%';
            }
            // this.bar.SetActive(true);
        } else {
            this.hurtText.text = info.m_uiHurtNum.toString();
            //this.bar.SetActive(false);
        }
    }
}

class PinstanceHurtLogic {

    private content: UnityEngine.GameObject;
    private titleText: UnityEngine.UI.Text;
    private headText2: UnityEngine.UI.Text;
    private textMine: UnityEngine.UI.Text;

    private list: List;
    private listItems: PinstanceHurtItem[] = [];

    setElems(elems: UiElements) {
        elems = elems.getUiElements('hurt');
        this.content = elems.getElement('content');
        this.titleText = elems.getText('titleText');
        this.headText2 = elems.getText('head2');
        this.textMine = elems.getText('textMine');
        this.list = elems.getUIList('list');
    }

    updateView() {
        let info = G.DataMgr.pinstanceData.hurtInfo;

        let showProgress = false;

        let count: number = info.m_ucNum;
        let m_astData: Protocol.SceneRoleHurt[] = info.m_astData;
        // 统计总伤害
        let totalHurt = info.m_llAccHurt;

        this.titleText.text = info.m_szTitle;

        let mineStr: string;
        if (3 == info.m_ucType) {
            // 3表示积分
            this.headText2.text = '积分';
            mineStr = uts.format('我的积分：{0}', info.m_astOwnerData.m_uiHurtNum);
        } else {
            // 其他表示伤害
            this.headText2.text = '伤害';
            let myHurt: string;
            if (info.m_astOwnerData.m_uiHurtNum > 0) {
                myHurt = (info.m_astOwnerData.m_uiHurtNum / totalHurt * 100).toFixed(1);
            } else {
                myHurt = '0';
            }
            mineStr = uts.format('我的伤害：{0}%', myHurt);
            showProgress = true;
        }
        if (info.m_szExtText) {
            mineStr += '\n' + info.m_szExtText;
        }
        this.textMine.text = mineStr;

        let oldItemCnt: number = this.listItems.length;
        this.list.Count = count;
        let item: PinstanceHurtItem;
        for (let i: number = 0; i < count; i++) {
            if (i < oldItemCnt) {
                item = this.listItems[i];
            } else {
                this.listItems.push(item = new PinstanceHurtItem());
                item.setComponents(this.list.GetItem(i).gameObject);
            }
            item.update(i + 1, m_astData[i], totalHurt, showProgress);
        }

        //this._iconlRewardTitle.label = RegExpUtil.xlsDesc2Html(data.m_szExtText);
        //this._iconlRewardTitle.y = height - 25;
        //height += 30;
        //let goodsList: [] = [];
        //for (let j: number = 0; j < data.m_astRankRewardInfo.length; j++) {
        //    if (!StringUtil.isEmpty(data.m_astRankRewardInfo[j].m_szRankExtText)) {
        //        goodsList.push(data.m_astRankRewardInfo[j]);
        //    }

        //}

        //if (goodsList.length > 0) {
        //    if (this._rewardList.parent == null)
        //        this._realUI.addChild(this._rewardList);
        //    this._rewardList.model.data = goodsList;
        //    this._rewardList.y = this._iconlRewardTitle.y + 30;
        //    height += (70 * int(goodsList.length / 3));
        //}
        //else {
        //    DOUtils.removeParent(this._rewardList);
        //}
    }
}

export class PinstanceStatView extends NestedSubForm {
    private readonly TickTimerKey = '1';
    private readonly CountDownKey = 'CountDown';

    private wrapper: UnityEngine.GameObject;
    private btnOpen: UnityEngine.GameObject;
    private btnClose: UnityEngine.GameObject;

    private statLogic: PinstanceStatLogic = new PinstanceStatLogic();
    private hurtLogic: PinstanceHurtLogic = new PinstanceHurtLogic();

    private statGo: UnityEngine.GameObject;
    private hurtGo: UnityEngine.GameObject;
    private statContenGo: UnityEngine.GameObject;

    private _imageAltas: Game.UGUIAltas;
    
    private tabGroup:UnityEngine.GameObject;
    private titles:UnityEngine.GameObject[]=[];
    private titleSelects:UnityEngine.GameObject[]=[];
    private titleTab:UnityEngine.GameObject;
    //Boss列表
    private bossList:List;
    private bossPanel: UnityEngine.GameObject;

    private isStatDirty = false;
    private isHurtDirty = false;
    private isBossDirty = false;

    private canRefreshBossHome: boolean = false;
    private bossItems: PinstanceBossItem2[] = [];
    private indexIDMap: { [bossID: number]: number } = {};

    private hasBossHead: boolean = false;
    private isFirstOpen: boolean = true;
    private titleBar:UnityEngine.GameObject;
    private starPos:UnityEngine.GameObject;
    constructor() {
        super(EnumMainViewChild.pinstanceStat);
        this.rootPath = 'root';
        this.openSound = null;
        this.closeSound = null;
        this._cacheForm = true;
    }

    protected resPath(): string {
        return UIPathData.PinstanceStatView;
    }

    protected initElements() {
        this.wrapper = this.elems.getElement('wrapper');
        this.btnOpen = this.elems.getElement('btnOpen');
        this.btnClose = this.elems.getElement('btnClose');

        this._imageAltas = this.elems.getElement('imageAltas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        this.statLogic.setElems(this.elems, this, this._imageAltas);
        this.hurtLogic.setElems(this.elems);

        this.statGo = this.elems.getElement('stat');
        this.statGo.SetActive(false);
        this.hurtGo = this.elems.getElement('hurt');
        this.hurtGo.SetActive(false);

        this.bossList = this.elems.getUIList('bossList');
        this.bossPanel = this.elems.getElement('bossPanel');
        this.bossPanel.SetActive(false);
        this.statContenGo = this.elems.getElement('content');
        this.titleTab = this.elems.getElement('titleTab');
        this.tabGroup = ElemFinder.findObject(this.titleTab,'tabGroup');
        this.titleBar = ElemFinder.findObject(this.statContenGo,'titlebar');
        this.starPos = ElemFinder.findObject(this.statGo,'starPos');
        for (let i = 0; i < 2; i++) {
            let title = ElemFinder.findObject(this.tabGroup,uts.format('t{0}',i));
            let titleSelect = ElemFinder.findObject(this.tabGroup,uts.format('t{0}/selected',i));
            this.titles.push(title);
            this.titleSelects.push(titleSelect);
            Game.UIClickListener.Get(this.titles[i]).onClick = delegate(this, this.onClickTabGroup,i);
        }
        this.titleTab.SetActive(false);
        this.setState(true);
    }

    protected initListeners() {
        this.addClickListener(this.btnOpen, this.onClickBtnOpen);
        this.addClickListener(this.btnClose, this.onClickBtnClose);
        this.addListClickListener(this.bossList, this.onClickBoss);
    }

    protected onClose() {
        this.reset();
        this.isFirstOpen = true;
    }

    protected onOpen() {
        let sceneData = G.DataMgr.sceneData;
        if (sceneData.curPinstanceID > 0) {
            this.setState(true);
        }
    }
    public checkArrowTimer() {
        if (this.statLogic.hasTarget) {
            if (!this.timerRun) {
                this.timerRun = true;
                this.addTimer("updatehero", 30, 0, this.onUpdateHero);
            }
        }
        else {
            if (this.timerRun) {
                this.timerRun = false;
                this.removeTimer("updatehero");
            }
        }
    }
    private timerRun: boolean = false;
    private down = UnityEngine.Vector2.down;
    private vector3: UnityEngine.Vector3;
    private onUpdateHero() {
        if (!this.statLogic.hasTarget) {
            return;
        }
        let avatar = (G.UnitMgr.hero.model.avatar as RoleAvatar);
        if (this.statLogic.targetPosX <= 0) {
            avatar.setArrowVisible(false);
        }
        else {
            avatar.setArrowVisible(true);
            if (avatar.m_arrowMesh.model != null) {
                this.vector3 = G.serverPixelToLocalPosition(this.statLogic.targetPosX, this.statLogic.targetPosY);
                this.vector3.y = G.UnitMgr.hero.getWorldPosition().y;
                avatar.m_arrowMesh.model.transform.LookAt(this.vector3);
            }
        }
    }

    open(statDirty: boolean, hurtDirty: boolean) {
        if (statDirty) {
            this.isStatDirty = true;
            this.isBossDirty = true;
        }
        if (hurtDirty) {
            this.isHurtDirty = true;
        }
        super.open();
    }

    reset() {
        this.isStatDirty = false;
        this.isBossDirty = false;
        this.statLogic.reset();
        this.isHurtDirty = false;
        if (null != this.hurtGo) {
            this.hurtGo.SetActive(false);
        }
        this.timerRun = false;
        this.hasBossHead = false;
        this.isFirstOpen = true;
        this.onClickTabGroup(1);
    }
  

    autoSelectInfo(index:number){
        let statGoEnable = this.statGo.activeSelf;
        if (this.hasBossHead&&statGoEnable) {
            this.onClickTabGroup(index);
        }
    }

    isShowingRank(): boolean {
        return null != this.hurtGo && this.hurtGo.activeSelf;
    }

    switchRank(): boolean {
        let isOpen = !this.hurtGo.activeSelf;
        this.hurtGo.SetActive(isOpen);
        this.statGo.SetActive(!isOpen);
        // if (this.statGo.activeSelf && isOpen == false)
        //     this.hurtGo.SetActive(isOpen);
        // else if (this.statGo.activeSelf == false && isOpen)
        //     this.hurtGo.SetActive(isOpen);
        if (isOpen && this.isHurtDirty) {
            this.hurtLogic.updateView();
            this.isHurtDirty = false;
        }
        return isOpen;
    }

    private onClickTabGroup(index:number){
        //index ==0是 Boss列表 1为boss信息

        if (Macros.PINSTANCE_ID_HOME_BOSS == G.DataMgr.sceneData.curPinstanceID && index == 1) {
            index = 0;
        }

        if (index == 0) {
            this.titleSelects[1].SetActive(false);
        }else{
            this.titleSelects[0].SetActive(false);
        }
        this.titleSelects[index].SetActive(true);
        let enableBoss = index == 0;
        this.bossPanel.SetActive(enableBoss);
        this.statContenGo.SetActive(!enableBoss);
    }

    onRightInfoChanged() {
        this.isStatDirty = true;
        this.isBossDirty = true;
    }

    onHurtInfoChanged() {
        this.isHurtDirty = true;
    }

    private updateInfoAndBossList() {
        let statGoEnable = this.statGo.activeSelf;
        this.titleTab.SetActive(statGoEnable && this.hasBossHead);
        let startPos = this.starPos.transform.position;
        if (this.titleTab.activeSelf) {
            this.titleBar.SetActive(false);
            this.statContenGo.transform.position = new UnityEngine.Vector3(startPos.x+0.65,startPos.y,startPos.z);
        }else{
            this.titleBar.SetActive(true);
            this.statContenGo.transform.position = this.starPos.transform.position;
        }
    }

    checkUpdate() {
        if (!this.isOpened) {
            return;
        }
        if (this.isBossDirty) {
            this.updateMonsters();
            this.isBossDirty = false;
        }
        if (this.isStatDirty) {
            if (this.statGo.activeSelf) {
                let hasCountDown = this.statLogic.updateView();
                if (hasCountDown) {
                    this.addTimer(this.CountDownKey, 1000, 0, this.onCountDownTimer);
                } else {
                    this.removeTimer(this.CountDownKey);
                }
                this.isStatDirty = false;
            }
        }
        if (this.isHurtDirty) {
            this.statLogic.checkBtnRank();
            if (this.hurtGo.activeSelf) {
                this.hurtLogic.updateView();
                this.isHurtDirty = false;
            }
        }
    }

    private onCountDownTimer(timer: Game.Timer) {
        let hasCountDown = this.statLogic.onCountDownTimer(timer);
        if (!hasCountDown) {
            this.removeTimer('statCountDown');
        }
    }

    private onClickBtnOpen() {
        this.setState(true);
        this.hurtGo.SetActive(false);
    }

    private onClickBtnClose() {
        this.setState(false);
        let pinstanceData = G.DataMgr.pinstanceData;
        if (null != pinstanceData.hurtInfo) {
            this.hurtGo.SetActive(true);
        }
    }

    setState(isStreched: boolean) {
        this.btnOpen.SetActive(!isStreched);
        this.btnClose.SetActive(isStreched);
        this.statGo.SetActive(isStreched);
        if (isStreched) {
            this.checkUpdate();
        }

        //vipBoss隐藏信息列表
        this.titles[1].SetActive(Macros.PINSTANCE_ID_HOME_BOSS != G.DataMgr.sceneData.curPinstanceID);
    }
    private updateMonsters() {
        let rightInfo = G.DataMgr.pinstanceData.rightInfo;
        if (rightInfo == null) {
            return false;
        }

        let needCountDown = false;
        this.canRefreshBossHome = false;

        let allItems: Array<{ t: number, data: any }> = [];
        for (let i: number = 0, count = rightInfo.m_ucNum; i < count; i++) {
            let oneRightInfo = rightInfo.m_astData[i];
            if (oneRightInfo.m_ucType == Macros.SCENERIGHT_MONSTER) {
                let monsterInfos = oneRightInfo.m_stValue.m_stMonster;

                for (let info of monsterInfos.m_astInfo) {
                    allItems.push({ t: Macros.SCENERIGHT_MONSTER, data: info });
                }
            } else if (oneRightInfo.m_ucType == Macros.SCENERIGHT_BLOOD_MONSTER) {
                let monsterInfos = oneRightInfo.m_stValue.m_stBloodMonster;
                for (let info of monsterInfos.m_astInfo) {
                    allItems.push({ t: Macros.SCENERIGHT_BLOOD_MONSTER, data: info });
                }
            }
            else if (oneRightInfo.m_ucType == Macros.SCENERIGHT_ROLE) {
                let roleinfo = oneRightInfo.m_stValue.m_stRole;
                for (let info of roleinfo.m_astInfo) {
                    allItems.push({ t: Macros.SCENERIGHT_ROLE, data: info });
                }
            }
        }
        let allcount = allItems.length;
        this.hasBossHead = allcount > 0;
        let curPinstanceID = G.DataMgr.sceneData.curPinstanceID;
        if (this.specicalNeedHideBoss()) {
            this.hasBossHead = false;
        }
        this.updateInfoAndBossList();
        let oldBossIconCnt = this.bossItems.length;
        this.bossList.Count = allcount;

        for (let i = 0; i < allcount; i++) {
            let data = allItems[i];
            let item: PinstanceBossItem2;
            if (i < oldBossIconCnt) {
                item = this.bossItems[i];
            } else {
                let itemGo = this.bossList.GetItem(i).gameObject;
                item = this.addBossItem(itemGo, i);
            }
            item.gameObject.SetActive(true);
            let showtype = data.t;
            if (showtype == Macros.SCENERIGHT_MONSTER) {
                let bossOneInfo = data.data as Protocol.SceneInfoOneMonster;
                item.update(Macros.SCENERIGHT_MONSTER, bossOneInfo, null, null, i);
                if (bossOneInfo.m_ucIsKilled != 0 && bossOneInfo.m_iRevaveTime > 0) {
                    needCountDown = true;
                }
                //////////////////////////////////////////////////////
                this.indexIDMap[bossOneInfo.m_uiMonstID] = i;

            } else if (showtype == Macros.SCENERIGHT_BLOOD_MONSTER) {
                let bossOneInfo = data.data as Protocol.SceneInfoOneBloodMonster;
                item.update(Macros.SCENERIGHT_BLOOD_MONSTER, null, bossOneInfo, null, i);
            }
            else if (showtype == Macros.SCENERIGHT_ROLE) {
                let oneInfo = data.data as Protocol.SceneInfoOneRole;
                item.update(Macros.SCENERIGHT_ROLE, null, null, oneInfo, i);
            }
        }
        for (let i = allcount; i < oldBossIconCnt; i++) {
            let item = this.bossItems[i];
            item.data = null;
            item.gameObject.SetActive(false);
        }
        if (this.isFirstOpen) {
            if (this.hasBossHead) {
                // this.tabGroup.Selected = 1;
                if (G.DataMgr.pinstanceData.ismultipBossNum) {
                    //多人boss没有次数时先打开信息
                    this.onClickTabGroup(1);
                }else{
                    //先打开boss列表
                    this.onClickTabGroup(0);
                }
            }
            this.isFirstOpen = false;
        }
        if (needCountDown) {
            this.addTimer(this.TickTimerKey, 1000, 0, this.onUpdateTimer);
            if (G.DataMgr.runtime.curBossHomeLayer > 0) {
                this.canRefreshBossHome = true;
            }
        } else {
            this.removeTimer(this.TickTimerKey);
        }
    }

    private onUpdateTimer() {
        this.updateMonsters();
    }

    private addBossItem(itemGo: UnityEngine.GameObject, index: number): PinstanceBossItem2 {
        let item = new PinstanceBossItem2();
        this.bossItems.push(item);
        item.setComponents(itemGo);
        //Game.UIClickListener.Get(itemGo).onClick = delegate(this, this.onClickBoss, index);
        return item;
    }

    onClickBoss(bossIndex: number, isMonsterId: boolean = false) {
        let newIndex = 0;
        if (isMonsterId) {
            for (let i = 0; i < this.bossItems.length; i++) {
                let data = this.bossItems[i];
                if (!data || !data.data)
                    continue;
                if (data.data.m_uiMonstID == bossIndex) {
                    newIndex = i;
                    break;
                }
            }
        }
        bossIndex = isMonsterId ? newIndex : bossIndex;
        let bossItem = this.bossItems[bossIndex];
        let bossOneInfo = bossItem.data;
        let fight = G.DataMgr.heroData.fight;
        if (null != bossOneInfo) {
            let curPinstanceID = G.DataMgr.sceneData.curPinstanceID;
            if (Macros.PINSTANCE_ID_WORLDBOSS == curPinstanceID || Macros.PINSTANCE_ID_HOME_BOSS == curPinstanceID||Macros.PINSTANCE_ID_MULTIPLAYER_BOSS==curPinstanceID) {
                let bossCfg = MonsterData.getMonsterConfig(bossOneInfo.m_uiMonstID);
                if (!bossCfg) {
                    uts.logWarning(" no  ZYCMCfgM cfg  monstId = " + bossOneInfo.m_uiMonstID);
                    return;
                }
                if (fight < bossCfg.m_iFightPoint) {
                    G.TipMgr.showConfirm(uts.format('此BOSS推荐战力{0}，高于您当前战力，是否确定前往挑战？', bossCfg.m_iFightPoint), ConfirmCheck.noCheck, '确定|取消', delegate(this, this.confirm, bossItem));
                    //暂停寻路
                    let pos = G.UnitMgr.hero.getPixelPosition();
                    G.Mapmgr.goToPos(G.DataMgr.sceneData.curSceneID, pos.x, pos.y, false, true, FindPosStrategy.Specified, 0, false);
                    //G.UnitMgr.hero.beginMoveToward(pos);
                    G.Mapmgr.stopAutoPath();
                    G.UnitMgr.hero.stopHeroMove(true, true);
                    return;
                }
            }

            let x, y = 0;
            if (bossItem.typeid == Macros.SCENERIGHT_ROLE) {
                let realdata = bossOneInfo as Protocol.SceneInfoOneRole;
                x = realdata.m_iPosX;
                y = realdata.m_iPosY;
            }
            else {
                x = bossOneInfo.m_iPosX;
                y = bossOneInfo.m_iPosY;
            }
            if (x > 0 && y > 0) {
                G.Mapmgr.goToPos(G.DataMgr.sceneData.curSceneID, bossOneInfo.m_iPosX, bossOneInfo.m_iPosY, false, true, FindPosStrategy.FindSuitableAround, bossOneInfo.m_uiMonstID, isMonsterId?false:true);
            }
        }
    }
    private confirm(status:MessageBoxConst, isCheckSelected: boolean, bossItem:  PinstanceBossItem2) {
        if (MessageBoxConst.yes == status) {
            if (null != bossItem.data) {
                let x, y = 0;
                if (bossItem.typeid == Macros.SCENERIGHT_ROLE) {
                    let realdata = bossItem.data as Protocol.SceneInfoOneRole;
                    x = realdata.m_iPosX;
                    y = realdata.m_iPosY;
                }
                else {
                    x = bossItem.data.m_iPosX;
                    y = bossItem.data.m_iPosY;
                }
                if (x > 0 && y > 0) {
                    G.Mapmgr.goToPos(G.DataMgr.sceneData.curSceneID, bossItem.data.m_iPosX, bossItem.data.m_iPosY, false, true, FindPosStrategy.FindSuitableAround, bossItem.data.m_uiMonstID, true);
                }
            }
        }
    }
     //特殊处理，boss列表的数据保留，隐藏boss列表，脚本添加到信息列表，
    //点击信息的名字，可以走原来列表的寻路过去
    private specicalNeedHideBoss(): boolean {
        let curPinstanceID = G.DataMgr.sceneData.curPinstanceID;
        return curPinstanceID == Macros.PINSTANCE_ID_GUILDPVP
            || curPinstanceID == Macros.PINSTANCE_ID_YMZC
    }
}