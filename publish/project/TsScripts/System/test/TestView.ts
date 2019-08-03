import { MainUIEffectView } from './../main/MainUIEffectView';
import { MainView } from 'System/main/view/MainView';
import { Case } from './../../Common/unittest/unittest';
import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { Constants } from 'System/constants/Constants'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { DataFormatter } from 'System/utils/DataFormatter'
import { SpecialCharUtil } from 'System/utils/SpecialCharUtil'
import { FloatShowType } from 'System/floatTip/FloatTip'
import { ThingData } from 'System/data/thing/ThingData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { AchievementData } from 'System/data/AchievementData'
import { PetData } from 'System/data/pet/PetData'
import { EnumDir2D, HeroGotoType, UnitCtrlType } from "System/constants/GameEnum";
import { UnitController } from 'System/unit/UnitController'
import { RoleController } from 'System/unit/role/RoleController'
class TestViewItemData {
    gmCmd: string;

    gmDesc: string[];

    gmParam: string[];

    filters: TestViewFilter[];

    constructor(cmd: string, desc: string[], param: string[], filters: TestViewFilter[] = null) {
        this.gmCmd = cmd;
        this.gmDesc = desc;
        this.gmParam = param;
        this.filters = filters;
    }
}

class TestViewFilter {
    cfgName: string;
    fields: string[];
    targetField: string;

    constructor(cfgName: string, fields: string[], targetField: string) {
        this.cfgName = cfgName;
        this.fields = fields;
        this.targetField = targetField;
    }
}

class TestViewCandidateInfo {
    fieldValue: string;
    usedValue: string;
}

class TestViewItem {
    private testView: TestView;

    private root: UnityEngine.GameObject;
    private bg2: UnityEngine.GameObject;
    private btnGo: UnityEngine.GameObject;

    private textPool: UnityEngine.UI.Text[] = [];
    private inputPool: UnityEngine.UI.InputField[] = [];

    private textClone: UnityEngine.UI.Text;
    private inputClone: UnityEngine.UI.InputField;

    private texts: UnityEngine.UI.Text[] = [];

    private inputs: UnityEngine.UI.InputField[] = [];

    private m_scnt: number = 0;

    private m_dcnt: number = 0;

    private contentIndex: number = 0;

    private index = 0;
    private itemData: TestViewItemData;

    constructor(testView: TestView) {
        this.testView = testView;
    }

    setComponents(go: UnityEngine.GameObject) {
        this.bg2 = ElemFinder.findObject(go, 'bg2');
        this.btnGo = ElemFinder.findObject(go, 'btnGo');
        this.root = ElemFinder.findObject(go, 'root');
        this.texts.push(this.textClone = ElemFinder.findText(this.root, 'textClone'));
        this.inputs.push(this.inputClone = ElemFinder.findInputField(this.root, 'inputClone'));

        Game.UIClickListener.Get(this.btnGo).onClick = delegate(this, this.onClickBtnGo);
    }

    private onClickBtnGo() {
        for (let i = 0; i < this.m_dcnt; i++) {
            this.itemData.gmParam[i] = this.inputs[i].text;
        }
        this.testView.onClickItem(this.index);
    }

    update(index: number, vo: TestViewItemData) {
        this.index = index;
        this.itemData = vo;
        this.reset();

        let cnt: number = vo.gmDesc.length;
        this.m_scnt = 0;
        this.m_dcnt = 0;

        let descSlice: string;
        let i: number = 0;
        let nextPosX: number = 24;
        let tfWidth: number = 0;
        for (i = 0; i < cnt; i++) {
            descSlice = vo.gmDesc[i];
            if ('$' == descSlice.charAt(0)) {
                this.addInput(vo.gmParam[this.m_dcnt]);
                this.m_dcnt++;
            }
            else {
                this.addText(descSlice);
                this.m_scnt++;
            }
        }

        this.bg2.SetActive(index % 2 == 0);
    }

    private reset() {
        // 先清理版面
        for (let i: number = this.texts.length - 1; i >= 0; i--) {
            this.texts[i].gameObject.SetActive(false);
            this.textPool.push(this.texts[i]);
        }
        this.texts.length = 0;

        for (let i: number = this.inputs.length - 1; i >= 0; i--) {
            this.inputs[i].gameObject.SetActive(false);
            this.inputPool.push(this.inputs[i]);
        }
        this.inputs.length = 0;

        // 因titlebar固定在最顶端，所以index从1开始
        this.contentIndex = 1;
    }

    private addText(str: string): UnityEngine.UI.Text {
        let textline: UnityEngine.UI.Text;
        if (this.textPool.length > 0) {
            textline = this.textPool.pop();
        } else {
            textline = UnityEngine.UnityObject.Instantiate(this.textClone, this.root.transform, false) as UnityEngine.UI.Text;
        }
        textline.gameObject.SetActive(true);
        this.texts.push(textline);
        // 显示文本内容
        textline.text = str;
        textline.transform.SetSiblingIndex(this.contentIndex);
        this.contentIndex++;
        return textline;
    }

    private addInput(str: string): UnityEngine.UI.InputField {
        let textline: UnityEngine.UI.InputField;
        if (this.inputPool.length > 0) {
            textline = this.inputPool.pop();
        } else {
            textline = UnityEngine.UnityObject.Instantiate(this.inputClone, this.root.transform, false) as UnityEngine.UI.InputField;
        }
        textline.onValueChanged = delegate(this, this.onInputChange, this.m_dcnt);
        textline.gameObject.SetActive(true);
        this.inputs.push(textline);
        // 显示文本内容
        textline.text = str;
        textline.transform.SetSiblingIndex(this.contentIndex);
        this.contentIndex++;
        return textline;
    }

    private onInputChange(value: string, index: number) {
        if ('' == value) {
            this.testView.showCandidates(null, null);
            return;
        }
        if (this.itemData.filters) {
            let filter = this.itemData.filters[index];
            if (filter) {
                let cfgs = G.Cfgmgr.getCfg('data/' + filter.cfgName + '.json');
                let candidates: TestViewCandidateInfo[] = [];
                for (let i = 0, len = cfgs.length; i < len; i++) {
                    let oneCfg = cfgs[i];
                    for (let j = 0, flen = filter.fields.length; j < flen; j++) {
                        let fv = oneCfg[filter.fields[j]];
                        if ((fv + '').indexOf(value) >= 0) {
                            let ci = new TestViewCandidateInfo();
                            ci.fieldValue = fv + '';
                            ci.usedValue = oneCfg[filter.targetField] + '';
                            candidates.push(ci);
                            break;
                        }
                    }
                }
                if (candidates.length > 0) {
                    this.testView.showCandidates(candidates, delegate(this, this.onSelectCandidate, index));
                }
            }
        }
    }

    private onSelectCandidate(info: TestViewCandidateInfo, index: number) {
        this.inputs[index].text = info.usedValue;
    }
}

export class TestView extends CommonForm {
    private mask: UnityEngine.GameObject;
    private btnClose: UnityEngine.GameObject;

    private list: List;
    private listItems: TestViewItem[] = [];
    private listDatas: TestViewItemData[] = [];
    private m_gmMap: { [cmd: string]: TestViewItemData } = {};

    private textInfo: UnityEngine.UI.Text;

    private candidates: UnityEngine.GameObject;
    private candidatesList: List;
    private candidatesDatas: TestViewCandidateInfo[];
    private onSelectCandidate: (info: TestViewCandidateInfo) => void;

    public static tipMarks: BaseTipMark[];

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.TestView;
    }

    protected initElements() {
        this.mask = this.elems.getElement('mask');
        this.btnClose = this.elems.getElement('btnClose');
        this.list = this.elems.getUIList('list');

        this.candidatesList = this.elems.getUIList('candidatesList');
        this.candidatesList.onVirtualItemChange = delegate(this, this.onRenderCandidates);
        this.candidates = this.elems.getElement('candidates');

        this.textInfo = this.elems.getText('textInfo');
    }

    protected initListeners() {
        this.addClickListener(this.mask, this.onClickMask);
        this.addClickListener(this.btnClose, this.onClickMask);
        this.addListClickListener(this.candidatesList, this.onClickCandidatesList);
    }
    protected onClose() {
        this.listDatas = null;
        this.m_gmMap = null;
        this.listItems = null;
    }
    protected onOpen() {
        this.initCommands();
        let len = this.listDatas.length;
        let oldItemCnt = this.listItems.length;
        this.list.Count = len;
        for (let i = 0; i < len; i++) {
            let item: TestViewItem;
            if (i < oldItemCnt) {
                item = this.listItems[i];
            } else {
                this.listItems.push(item = new TestViewItem(this));
                item.setComponents(this.list.GetItem(i).gameObject);
            }
            item.update(i, this.listDatas[i]);
        }

        let hero = G.UnitMgr.hero;
        let runtime = G.DataMgr.runtime;
        this.textInfo.text = uts.format('{0}\n当前场景:{1}，副本:{2}，坐标:{3}\nHero:{4}\n状态:runtime={5}\n引导：{6}\n挂机：{7}\n单位：{8}',
            G.SyncTime.toString(),
            G.DataMgr.sceneData.curSceneID, G.DataMgr.sceneData.curPinstanceID,
            G.UnitMgr.hero.getPixelPosition().ToString(), hero.toString(), runtime.toString(),
            G.GuideMgr.toString(), G.BattleHelper.toString(), G.UnitMgr.toString());
    }

    showCandidates(listData: TestViewCandidateInfo[], onSelect: (info: TestViewCandidateInfo) => void) {
        if (listData) {
            this.candidatesDatas = listData;
            this.onSelectCandidate = onSelect;
            let cnt = listData.length;
            this.candidatesList.Count = cnt;
        }
    }

    private onRenderCandidates(item: ListItem) {
        let text = ElemFinder.findText(item.gameObject, 'text');
        let itemData = this.candidatesDatas[item.Index];
        text.text = itemData.usedValue + '(' + itemData.fieldValue + ')';
    }

    private onClickCandidatesList(index: number) {
        this.onSelectCandidate(this.candidatesDatas[index]);
    }

    onClickItem(index: number) {
        let itemData = this.listDatas[index];
        this.doGM(itemData.gmCmd, itemData.gmParam);
    }

    private onClickMask() {
        this.close();
    }

    doGM(cmd: string, gmParam: string[] = null) {
        let paramStr: string = ' ';
        switch (cmd) {
            case 'noSkillNotify':
                G.DataMgr.runtime.__noSkillNotify = !G.DataMgr.runtime.__noSkillNotify;
                return;

            case 'logBattle':
                G.DataMgr.runtime.__logBattle = !G.DataMgr.runtime.__logBattle;
                return;

            case 'stopAutoGuide':
                G.GuideMgr.pauseAndResume(-1);
                return;

            case 'setrole clearcd':
                G.DataMgr.cdData.reset();
                G.DataMgr.localCdData.reset();
                break;

            case 'setrole clearact 0':
                break;

            case 'checkBlock':
                let isValid: boolean = G.Mapmgr.tileMap.IsWalkablePositionPixel(parseInt(gmParam[0]), parseInt(gmParam[1]));
                if (isValid) {
                    G.TipMgr.addMainFloatTip('非阻挡点。', Macros.PROMPTMSG_TYPE_MIDDLE);
                }
                else {
                    G.TipMgr.addMainFloatTip('阻挡点！');
                }
                return;

            case 'checkPath':
                let x1: number = parseInt(gmParam[0]);
                let y1: number = parseInt(gmParam[1]);
                let x2: number = parseInt(gmParam[2]);
                let y2: number = parseInt(gmParam[3]);

                isValid = G.Mapmgr.tileMap.IsWalkablePositionPixel(x1, y1);
                if (isValid) {
                    isValid = G.Mapmgr.tileMap.IsWalkablePositionPixel(x2, y2);
                    if (isValid) {
                        isValid = null != G.Mapmgr.tileMap.IsConnectedPixel(x1, y1, x2, y2);
                        if (isValid) {
                            G.TipMgr.addMainFloatTip('两点可连通。', Macros.PROMPTMSG_TYPE_MIDDLE);
                        }
                        else {
                            G.TipMgr.addMainFloatTip('两点不可连通！');
                        }
                    }
                    else {
                        G.TipMgr.addMainFloatTip('点2是阻挡点！');
                    }
                }
                else {
                    G.TipMgr.addMainFloatTip('点1是阻挡点！');
                }
                return;

            case 'setPosition':
                let x = parseInt(gmParam[0]);
                let y = parseInt(gmParam[1]);
                let findPath = parseInt(gmParam[2]) != 0;
                if (findPath) {
                    let state = G.Mapmgr.moveHeroToPos(x, y, true, 0);
                    uts.log('move state: ' + state);
                } else {
                    G.UnitMgr.hero.drag2pos(x, y);
                }
                return;

            case 'dailyActTest':
                G.DataMgr.runtime.__testact = true;
                return;

            case 'quickTask':
                Constants.AutoGuideTimeout = 1;
                Constants.AutoDoTimeout = 1;
                return;

            case 'toggleActivity':
                {
                    let activityId: number = parseInt(gmParam[0]);
                    if (activityId > 0) {
                        if (G.DataMgr.activityData.isActivityOpen(activityId)) {
                            this.sendGM('activity ' + activityId + ' ' + 2);
                            G.TipMgr.addMainFloatTip('活动已关闭：' + activityId);
                        } else {
                            this.sendGM('activity ' + activityId + ' ' + 1);
                            G.TipMgr.addMainFloatTip('活动已开启：' + activityId);
                        }
                    }
                }
                return;

            case 'checkActivity':
                let activityId: number = parseInt(gmParam[0]);
                if (activityId > 0) {
                    if (G.DataMgr.activityData.isActivityOpen(activityId)) {
                        let status = G.DataMgr.activityData.getActivityStatus(activityId);
                        G.TipMgr.addMainFloatTip('结束时间：' + DataFormatter.second2yyyymmddhhmm(status.m_iEndTime));
                    } else {
                        G.TipMgr.addMainFloatTip('活动未开启');
                    }
                }
                return;

            case 'viplevel':
                let vipLevel: number = parseInt(gmParam[0]);
                if (vipLevel > 0) {
                    paramStr += vipLevel.toString();
                }
                else {
                    G.TipMgr.addMainFloatTip('奶奶的，别瞎捣乱！');
                    return;
                }
                break;

            case 'setrole level':
                let level: number = parseInt(gmParam[0]);
                if (level > 0) {
                    paramStr += level.toString();
                }
                else {
                    G.TipMgr.addMainFloatTip('我擦！');
                    return;
                }
                break;

            case 'money copper':
            case 'money bindcopper':
                let copper: number = parseInt(gmParam[0]);
                paramStr += copper.toString();
                break;

            case 'money shell':
                let shell: number = parseInt(gmParam[0]);
                paramStr += shell.toString();
                break;

            case 'guild money':
                let guildFund: number = parseInt(gmParam[0]);
                paramStr += guildFund.toString();
                break;

            case 'guild level':
                let guildLevel: number = parseInt(gmParam[0]);
                paramStr += guildLevel.toString();
                break;

            case 'otherMoney':
                let num = parseInt(gmParam[0]);
                for (let i = KeyWord.CURRENCY_MIN + 1; i < KeyWord.CURRENCY_MAX; i++) {
                    if (KeyWord.MONEY_CROSSPVP_ID != i && KeyWord.MONEY_CROSSPVP_GRADE != i) {
                        this.sendGM('additem ' + i + ' ' + num);
                    }
                }
                break;

            case 'setrole speed':
                let speed: number = parseInt(gmParam[0]);
                if (speed > 0) {
                    paramStr += speed.toString();
                }
                else {
                    G.TipMgr.addMainFloatTip('一边冒烟去！');
                    return;
                }
                break;
            case 'add hungu equip':
                let hunliLevel: number = parseInt(gmParam[0]);
                let prof: number = parseInt(gmParam[1]);

                let drops = ["03", "05", "07", "09", "11", "13", "15", "18", "20"]
                let drop = drops[hunliLevel - 1];
                for (let i = 0; i < 9; i++) {
                    let id = uts.format("1{0}{1}{2}1050", prof, drop, i + 1);
                    this.sendGM(uts.format("additem {0} 1", id));
                }

                //10 03 1 1050    10 03 2 1050     10 03 5 1050
                //11 05 1 1050
                //11 07 1 1050
                //110911050
                //111111050

                break;

            case 'smash':
                paramStr += parseInt(gmParam[0]);
                break;

            case 'strong':
                paramStr += parseInt(gmParam[0]);
                break;

            case 'questcancel':
                break;

            case 'questaccept':
            case 'questdone':
                let questStr: string = gmParam[0];
                let questID: number = parseInt(questStr);
                if (0 == questID) {
                    G.TipMgr.addMainFloatTip('任务ID或名称不正确！');
                    return;
                }
                paramStr += questID.toString();
                break;

            case 'clearbag ' + Macros.CONTAINER_TYPE_ROLE_BAG:
            case 'clearbag ' + Macros.CONTAINER_TYPE_ROLE_STORE:
            case 'clearbag ' + Macros.CONTAINER_TYPE_SKYLOTTERY:
                break;

            case 'setrole clearfb':
            case 'setrole clearhyd':
                break;

            case 'gmstartact 1':
                if (1 != G.SyncTime.getDateAfterStartServer()) {
                    G.TipMgr.addMainFloatTip('艹，不是开服当天乱摸个屌啊！');
                    return;
                }
                break;

            case 'setrole addhyd':
                paramStr += parseInt(gmParam[0]).toString();
                break;
            case 'hideUI':
                let mainView = G.Uimgr.getForm<MainView>(MainView);
                let mainUIEffectView = G.Uimgr.getForm<MainUIEffectView>(MainUIEffectView)
                if (mainView) {
                    mainView.setViewEnable(false);
                }
                if (mainUIEffectView) {
                    mainUIEffectView.close();
                }
                break;
            case 'openAll':
                let all: GameConfig.NPCFunctionLimitM[] = G.DataMgr.funcLimitData.limitFuncs;
                let lv = 0;
                let completeQuests: number[] = [];
                let acceptQuests: number[] = [];
                for (let funcLimitConfig of all) {
                    if (funcLimitConfig.m_ucLevel > G.DataMgr.heroData.level) {
                        if (funcLimitConfig.m_ucLevel > lv) {
                            lv = funcLimitConfig.m_ucLevel;
                        }
                    }
                }

                // 升级
                if (lv > G.DataMgr.heroData.level) {
                    this.sendGM('setrole level ' + lv);
                }

                // 完成所有主线任务
                this.doGM('finishAllTrunk');

                return;
            case 'finishAllTrunk':
                let trunks = G.DataMgr.questData.m_neverAccepttrunkIdList;
                for (let qid of trunks) {
                    this.sendGM('questaccept ' + qid);
                    this.sendGM('questdone ' + qid);
                }
                return;

            case 'gmscriptLv':
                // 修改副本层数
                cmd = 'gmscript 1 ' + parseInt(gmParam[0]) + ' 0';
                break;

            case 'testGuide':
                // 测试引导
                G.GuideMgr.testGuide();
                this.close();
                return;
            case 'scaleScreen':
                let scale = Number(gmParam[0]);
                let neww = Math.floor(G.originWidth * scale);
                let newh = Math.floor(G.orginHeight * scale);
                uts.log("change screen to: x:" + neww + " y:" + newh);
                UnityEngine.Screen.SetResolution(neww, newh, true);
                return;
            case 'hideSelf':
                if (UnityEngine.Application.targetFrameRate == 0) {
                    UnityEngine.Application.targetFrameRate = 30;
                }
                else {
                    UnityEngine.Application.targetFrameRate = 0;
                }
                return;
            case 'petNoMove':
                G.noatttest = !G.noatttest;
                return;
            case 'getDistance':
                let selectedUnit = G.UnitMgr.SelectedUnit;
                if (null != selectedUnit) {
                    let d = UnityEngine.Vector2.Distance(G.UnitMgr.hero.getPixelPosition(), selectedUnit.getPixelPosition());
                    uts.log('distance = ' + d);
                }
                return;
            case 'testNotice':
                let strs: string[] = ['恭喜玩家飞翔的蜗牛突破境界了，恭喜恭喜恭喜哦哦哦哦哦哦哦哦哦方法'
                    , '恭喜玩家菲菲七天突破境界了，恭喜恭喜恭喜哈哈哈哈哈哈哈哈哈哈哈',
                    '恭喜玩家蒙娜丽莎突破境界了，恭喜恭喜恭喜莉莉姐姐急急急急急急'];
                for (let i = 0; i < 3; i++) {
                    G.TipMgr.addMainFloatTip(strs[i], Macros.PROMPTMSG_TYPE_ROLL);
                    G.TipMgr.addMainFloatTip('获取神仙大力丸*1', FloatShowType.GetReward);
                    G.TipMgr.addMainFloatTip('不要这样子啊啊');
                }
                return;

            case 'setrole sundry whjx_self':
                paramStr += parseInt(gmParam[0]);
                break;

            case 'setrole sundry zlqj_self':
                break;
            case 'dropItem':
                {//掉落方案
                    let idArr = gmParam[0].split(/\s+/);
                    let num = parseInt(gmParam[1]);
                    if (isNaN(num)) {
                        num = 1;
                    }
                    for (let idStr of idArr) {
                        idStr = idStr.replace(/\s+/, '');
                        if ('' == idStr) {
                            continue;
                        }
                        let id = 0;
                        let idRe = /^(\d{6,9})$/;
                        let idRst = idRe.exec(idStr);
                        if (null != idRst) {
                            id = parseInt(idRst[1]);
                        }
                        if (0 == id) {
                            id = G.DataMgr.runtime.__tip_id;
                        }
                        if (id > 0) {
                            this.sendGM('drop ' + id + ' ' + num);
                        }
                    }
                }
                break;
            case 'batAdditem':
                {
                    let idArr = gmParam[0].split(/\s+/);
                    let num = parseInt(gmParam[1]);
                    if (isNaN(num)) {
                        num = 1;
                    }
                    for (let idStr of idArr) {
                        idStr = idStr.replace(/\s+/, '');
                        if ('' == idStr) {
                            continue;
                        }
                        let id = 0;
                        let idRe = /^(\d{6,9})$/;
                        let idRst = idRe.exec(idStr);
                        if (null != idRst) {
                            id = parseInt(idRst[1]);
                        }
                        if (0 == id) {
                            id = G.DataMgr.runtime.__tip_id;
                        }
                        if (id > 0) {
                            this.sendGM('additem ' + id + ' ' + num);
                        }
                    }
                }
                break;

            case 'getRebirthEquip':

                if (G.DataMgr.heroData.profession == 1) {
                    this.sendGM('additem 101101001 1');
                } else {
                    this.sendGM('additem 103101001 1');
                }
                this.sendGM('additem 10578011 999');

                for (let i = 2; i <= 8; i++) {
                    this.sendGM(uts.format('additem 100{0}01001 1', i));
                }
                break;


            case 'addequip':
                //凡仙 1剑2刀    
                //uts.log("  G.DataMgr.heroData.profession  " + G.DataMgr.heroData.profession);
                //if (G.DataMgr.heroData.profession == 1) {
                //    this.sendGM('additem 210106301 1');
                //} else {
                //    this.sendGM('additem 230106291 1');
                //}
                this.sendGM('additem 210111000 1');
                this.sendGM('additem 230111000 1');
                this.sendGM('additem 200211000 1');
                this.sendGM('additem 200511000 1');
                this.sendGM('additem 200611000 1');
                this.sendGM('additem 200711000 1');
                this.sendGM('additem 200811000 1');
                this.sendGM('additem 201011000 1');
                this.sendGM('additem 201111000 1');

                break;

            case 'addequip1':
                this.sendGM('additem 230100001 1');
                this.sendGM('additem 230101011 1');
                this.sendGM('additem 230102001 1');
                this.sendGM('additem 230103001 1');
                this.sendGM('additem 230104001 1');
                this.sendGM('additem 230105001 1');
                this.sendGM('additem 230106001 1');
                this.sendGM('additem 230107001 1');
                this.sendGM('additem 230108001 1');
                this.sendGM('additem 230109001 1');
                this.sendGM('additem 230109001 1');
                this.sendGM('additem 230110001 1');
                this.sendGM('additem 230111001 1');
                this.sendGM('additem 230111211 1');
                break;

            case 'getAllSpecialImage':
                for (let idKey in ThingData.m_itemMap) {
                    let c = ThingData.m_itemMap[idKey];
                    if (KeyWord.ITEM_FUNCTION_SUBIMAGE == c.m_ucFunctionType && 0 == c.m_iFunctionValue && c.m_iID % 2 == 0) {
                        this.sendGM('additem ' + c.m_iID + ' 1');
                    }
                }
                break;

            case 'getAllShenQiImage':
                this.sendGM('additem 10386030 1');
                this.sendGM('additem 10386040 1');
                this.sendGM('additem 10386050 1');
                this.sendGM('additem 10386060 1');
                this.sendGM('additem 10386080 1');
                this.sendGM('additem 10386090 1');
                this.sendGM('additem 10386100 1');
                this.sendGM('additem 10386110 1');
                this.sendGM('additem 10386120 1');
                this.sendGM('additem 10386130 1');
                this.sendGM('additem 10386140 1');
                this.sendGM('additem 10386150 1');
                this.sendGM('additem 10386160 1');
                this.sendGM('additem 10386170 1');
                this.sendGM('additem 10386180 1');
                this.sendGM('additem 10386190 1');
                this.sendGM('additem 10386200 1');
                this.sendGM('additem 10386210 1');
                this.sendGM('additem 10386220 1');
                this.sendGM('additem 10386230 1');
                this.sendGM('additem 10386240 1');
                this.sendGM('additem 10386250 1');
                this.sendGM('additem 10386260 1');
                this.sendGM('additem 10386270 1');
                this.sendGM('additem 10386280 1');
                this.sendGM('additem 10386290 1');
                this.sendGM('additem 10386300 1');
                this.sendGM('additem 10386310 1');
                return;
            case 'getAllTitleCard':
                let m: { [titleId: number]: GameConfig.ThingConfigM } = {}
                for (let idKey in ThingData.m_itemMap) {
                    let c = ThingData.m_itemMap[idKey];
                    if (KeyWord.ITEM_FUNCTION_TITLECARD == c.m_ucFunctionType) {
                        if (c.m_iFunctionID in m) {
                            let oldC = m[c.m_iFunctionID];
                            if (0 == c.m_iFunctionValue || c.m_iFunctionValue > oldC.m_iFunctionValue) {
                                m[c.m_iFunctionID] = c;
                            }
                        } else {
                            m[c.m_iFunctionID] = c;
                        }
                    }
                }
                for (let i in m) {
                    this.sendGM('additem ' + m[i].m_iID + ' 1');
                }
                break;

            case 'getAllPrivileage':
                this.sendGM('additem 10404011 1');
                this.sendGM('additem 10404021 1');
                this.sendGM('additem 10404031 1');
                break;
            case 'clearBwdh':
                this.sendGM('additem ' + KeyWord.MONEY_CROSSPVP_ID + ' -' + G.DataMgr.heroData.crossPoint);
                this.sendGM('additem ' + KeyWord.MONEY_CROSSPVP_GRADE + ' -' + G.DataMgr.heroData.crossStage);
                break;

            case 'getAllPet':
                this.sendGM('additem 10225010 1');

                this.sendGM('additem 10225111 1');
                this.sendGM('additem 10225220 1');

                this.sendGM('additem 10225021 1');
                this.sendGM('additem 10225041 90');
                this.sendGM('additem 10225121 1');

                this.sendGM('additem 10225420 1');
                this.sendGM('additem 10225131 1');
                this.sendGM('additem 10225071 200');
                this.sendGM('additem 10225050 200');

                this.sendGM('additem 10225061 200');
                this.sendGM('additem 10225170 1');

                this.sendGM('additem 10225090 1');
                this.sendGM('additem 10225150 1');
                this.sendGM('additem 10225260 1');
                this.sendGM('additem 10225321 1');
                this.sendGM('additem 10225350 1');
                this.sendGM('additem 10225281 1');
                this.sendGM('additem 10225401 1');
                this.sendGM('additem 10225101 1');
                this.sendGM('additem 10225200 1');
                this.sendGM('additem 10225481 1');
                this.sendGM('additem 10225501 1');


                break;

            case 'getAllFaQi':
                this.sendGM('additem 10337100 999');
                this.sendGM('additem 10337110 999');
                this.sendGM('additem 10337120 999');
                this.sendGM('additem 10337160 999');
                this.sendGM('additem 10337170 999');
                this.sendGM('additem 10337180 999');
                this.sendGM('additem 10337190 999');
                this.sendGM('additem 10337200 999');
                this.sendGM('additem 10337210 999');
                this.sendGM('additem 10337220 999');
                this.sendGM('additem 10337230 999');
                break;


            case 'getAllDiamond':
                for (let idKey in ThingData.m_itemMap) {
                    let item = ThingData.m_itemMap[idKey];
                    if (item.m_ucFunctionType == KeyWord.ITEM_FUNCTION_EQUIP_JEWEL && item.m_iID % 2 == 1) {
                        this.sendGM('additem ' + item.m_iID + ' 1');
                    }
                }
                return;

            case 'getAllDiamond':
                for (let idKey in ThingData.m_itemMap) {
                    let item = ThingData.m_itemMap[idKey];
                    if (item.m_ucFunctionType == KeyWord.ITEM_FUNCTION_EQUIP_JEWEL && item.m_iID % 2 == 1) {
                        this.sendGM('additem ' + item.m_iID + ' 1');
                    }
                }
                return;

            case 'getAllJinJieFu':
                for (let idKey in ThingData.m_itemMap) {
                    let item = ThingData.m_itemMap[idKey];
                    if (item.m_ucFunctionType == KeyWord.ITEM_FUNCTION_HEROSUB_JINGJIEFU && item.m_iID % 2 == 1) {
                        this.sendGM('additem ' + item.m_iID + ' 1');
                    }
                }
                return;

            case 'getAllLingBao':
                this.sendGM('additem 201501001 1');
                this.sendGM('additem 201502001 1');
                this.sendGM('additem 201503001 1');
                break;

            case 'getAllShenShou':
                this.sendGM('additem 10428010 999');
                this.sendGM('additem 10428030 999');
                this.sendGM('additem 10428020 999');
                this.sendGM('additem 10428040 999');
                break;

            case 'getAllShenShouJinJie':
                this.sendGM('additem 10426010 999');
                this.sendGM('additem 10426030 999');
                this.sendGM('additem 10426020 999');
                this.sendGM('additem 10426040 999');
                this.sendGM('additem 10427010 999');
                this.sendGM('additem 10427030 999');
                this.sendGM('additem 10427020 999');
                this.sendGM('additem 10427040 999');
                break;

            case 'getPetFeishengMaterials':
                this.sendGM('additem 10375061 999');
                this.sendGM('additem 10225461 9999');
                this.sendGM('additem 10225341 9999');
                this.sendGM('additem 10225381 9999');
                this.sendGM('additem 10375071 999');
                break;

            case 'getFanXianMaterials':
                this.sendGM('additem 10446010 999');
                this.sendGM('additem 10446030 999');
                this.sendGM('additem 10446020 999');
                this.sendGM('additem 10447010 999');
                this.sendGM('additem 10447020 999');
                break;

            case 'getLianTi':
                this.sendGM('additem 10556010 999');
                this.sendGM('additem 10557010 1');
                this.sendGM('additem 10557020 1');
                this.sendGM('additem 10557030 1');
                this.sendGM('additem 10557040 1');
                this.sendGM('additem 10557050 1');
                break;

            case 'getTianZhu':
                this.sendGM('additem 10111010 999');
                this.sendGM('additem 10112030 999');
                this.sendGM('additem 10461010 999');
                this.sendGM('additem 10461020 999');
                this.sendGM('additem 10461030 999');
                this.sendGM('additem 10461040 999');
                this.sendGM('additem 10461050 999');
                this.sendGM('additem 10461060 999');
                this.sendGM('additem 10461070 999');
                this.sendGM('additem 10461080 999');
                this.sendGM('additem 10461090 999');
                this.sendGM('additem 10461100 999');
                this.sendGM('additem 10461110 999');
                break;

            case 'addzhufuequip':
                this.sendGM('additem 136100031 1');
                this.sendGM('additem 136110051 1');
                this.sendGM('additem 136120041 1');
                this.sendGM('additem 136130041 1');
                this.sendGM('additem 136130121 1');

                this.sendGM('additem 136200051 1');
                this.sendGM('additem 136200111 1');
                this.sendGM('additem 136210051 1');
                this.sendGM('additem 136210121 1');
                this.sendGM('additem 136220031 1');

                this.sendGM('additem 136220111 1');
                this.sendGM('additem 136230021 1');
                this.sendGM('additem 136230121 1');
                this.sendGM('additem 136300031 1');
                this.sendGM('additem 136300131 1');

                this.sendGM('additem 136310041 1');
                this.sendGM('additem 136310131 1');
                this.sendGM('additem 136320041 1');
                this.sendGM('additem 136320111 1');
                this.sendGM('additem 136330031 1');

                this.sendGM('additem 136330121 1');
                this.sendGM('additem 136400031 1');
                this.sendGM('additem 136400121 1');
                this.sendGM('additem 136410031 1');
                this.sendGM('additem 136410111 1');

                this.sendGM('additem 136420031 1');
                this.sendGM('additem 136420131 1');
                this.sendGM('additem 136430031 1');
                this.sendGM('additem 136430121 1');
                this.sendGM('additem 136500031 1');

                this.sendGM('additem 136500111 1');
                this.sendGM('additem 136510031 1');
                this.sendGM('additem 136510121 1');
                this.sendGM('additem 136520041 1');
                this.sendGM('additem 136520111 1');

                this.sendGM('additem 136530031 1');
                this.sendGM('additem 136530121 1');

                break;


            case 'addpetequip':
                this.sendGM('additem 151503000 1');
                this.sendGM('additem 151603000 1');
                this.sendGM('additem 151506000 1');
                this.sendGM('additem 151606000 1');
                this.sendGM('additem 151507000 1');
                this.sendGM('additem 151607000 1');

                this.sendGM('additem 152000000 1');
                this.sendGM('additem 152000010 1');
                this.sendGM('additem 152000030 1');
                this.sendGM('additem 152000050 1');
                this.sendGM('additem 152000090 1');
                this.sendGM('additem 152000100 1');
                this.sendGM('additem 152000120 1');
                this.sendGM('additem 152000190 1');

                this.sendGM('additem 152010030 1');
                this.sendGM('additem 152010060 1');
                this.sendGM('additem 152010090 1');
                this.sendGM('additem 152010120 1');
                this.sendGM('additem 152010150 1');

                this.sendGM('additem 152030030 1');
                this.sendGM('additem 152030060 1');
                this.sendGM('additem 152030090 1');
                this.sendGM('additem 152030120 1');

                this.sendGM('additem 152000031 1');
                this.sendGM('additem 152000061 1');
                this.sendGM('additem 152000091 1');


                this.sendGM('additem 152010051 1');
                this.sendGM('additem 152010071 1');
                this.sendGM('additem 152010091 1');

                this.sendGM('additem 152120030 1');
                this.sendGM('additem 152120060 1');
                this.sendGM('additem 152120090 1');
                this.sendGM('additem 152120120 1');

                break;

            case 'getWingEquip':
                //凡仙 1剑2刀    
                if (G.DataMgr.heroData.profession == 1) {
                    this.sendGM('additem 201710000 3');
                    this.sendGM('additem 201710010 3');
                    this.sendGM('additem 201710020 3');
                    this.sendGM('additem 201710030 3');
                } else {
                    this.sendGM('additem 201700000 3');
                    this.sendGM('additem 201700010 3');
                    this.sendGM('additem 201700020 3');
                    this.sendGM('additem 201700030 3');
                }
                break;
            case 'getLianTi':
                this.sendGM('additem 10458010 999');
                this.sendGM('additem 10459010 50');
                this.sendGM('additem 10459020 50');
                this.sendGM('additem 10459030 50');
                this.sendGM('additem 10459040 50');
                this.sendGM('additem 10459050 50');
                break;

            case 'gmPriHY ':
                let type = parseInt(gmParam[0]);
                type = Math.min(Math.max(1, type), 3);
                let exp = parseInt(gmParam[1]);
                exp = Math.max(0, exp);
                paramStr += type + ' ' + exp;
                break;

            case 'petUpStage':
                let stage = parseInt(gmParam[0]);
                let pets = G.DataMgr.petData.getActivedPets();
                for (let pet of pets) {
                    let petStage = PetData.getPetStage(pet.m_uiStage, pet.m_iBeautyID);
                    if (petStage < stage) {
                        for (let i = 0; i < (stage - petStage) * 10; i++) {
                            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPetEnhanceRequest(pet.m_iBeautyID));
                        }
                    }
                }
                break;

            case 'setrole tongguan ':
                let pid = parseInt(gmParam[0]);
                let diff = parseInt(gmParam[1]);
                paramStr += pid + ' ' + diff;
                break;

            case 'testPinstance':
                let layer = parseInt(gmParam[1]);
                G.ModuleMgr.pinstanceModule.tryEnterPinstance(parseInt(gmParam[0]), layer);
                this.close();
                break;

            case 'showfps':
                G.ModuleMgr.chatModule.handleClientGM('//showfps');
                break;

            case 'copyfps':
                G.ModuleMgr.chatModule.handleClientGM('//copyfps');
                break;

            default:
                if (gmParam) {
                    paramStr = gmParam.join(' ');
                    if (cmd.charAt(cmd.length - 1) != ' ') {
                        cmd += ' ';
                    }
                }
                break;
        }

        this.sendGM(cmd, paramStr);
    }

    private sendGM(cmd: string, paramStr: string = '') {
        let cmdStr: string = '//' + cmd + paramStr;
        G.ModuleMgr.chatModule.sendGM(cmdStr);
    }

    private initCommands() {
        let runtime = G.DataMgr.runtime;
        let addItemDafault = '多个id空格隔开';
        if (runtime.__tip_id > 0) {
            addItemDafault = ThingData.getThingConfig(runtime.__tip_id).m_szName;
        }

        this.listDatas = [
            new TestViewItemData('openAll', ['开启所有功能（需刷新）'], null),
            new TestViewItemData('batAdditem', ['批量加道具货币', '$', '$'], [addItemDafault, '数量不填1'], [new TestViewFilter('ThingConfigM', ['m_szName'], 'm_iID')]),
            new TestViewItemData('drop', ['测试掉落方案', '$'], ['方案id'], [new TestViewFilter('DropConfigM', ['m_uiDropID'], 'm_uiDropID')]),
            new TestViewItemData('dropItem', ['获取掉落方案', '$', '$'], [addItemDafault, '数量不填1'], [new TestViewFilter('ThingConfigM', ['m_szName'], 'm_iID')]),
            new TestViewItemData('clearbag ' + Macros.CONTAINER_TYPE_ROLE_BAG, ['清空我的背包'], null),
            new TestViewItemData('setrole level', ['我要升级: ', '$', '！'], ['30']),
            new TestViewItemData('viplevel', ['给我VIP: ', '$', '！'], ['1']),
            new TestViewItemData('money copper', ['钻石: ', '$'], ['10000']),
            new TestViewItemData('money bindcopper', ['绑定钻石: ', '$'], ['10000']),
            new TestViewItemData('money shell', ['魂币: ', '$'], ['8000000']),
            new TestViewItemData('stopAutoGuide', ['停止自动做任务'], null),
            new TestViewItemData('quickTask', ['极速任务'], null),
            new TestViewItemData('smash', ['一击必杀：', '$'], ['1']),
            new TestViewItemData('strong', ['刀枪不入：', '$'], ['1']),
            new TestViewItemData('setrole speed', ['我要溜得快: ', '$', '！'], ['9']),
            new TestViewItemData('add hungu equip', ['批量添加魂骨装备: ', '$', '$'], ['魂力等级', '职业']),
            new TestViewItemData('setrole clearfb 0', ['清除所有副本次数'], null),
            new TestViewItemData('questaccept', ['接取这个任务：', '$'], ['任务id']),
            new TestViewItemData('questdone', ['结束这个任务：', '$'], ['任务id']),



            new TestViewItemData('noSkillNotify', [G.DataMgr.runtime.__noSkillNotify ? '取消屏蔽技能通知' : '屏蔽技能通知'], null),
            new TestViewItemData('scaleScreen', ['调整屏幕分辨率:', '$'], ['1']),
            new TestViewItemData('logBattle', [G.DataMgr.runtime.__logBattle ? '关闭战斗日志' : '输出战斗日志'], null),
            new TestViewItemData('clearbag ' + Macros.CONTAINER_TYPE_ROLE_STORE, ['清空我的仓库'], null),
            new TestViewItemData('clearbag ' + Macros.CONTAINER_TYPE_SKYLOTTERY, ['清空我的宝镜仓库'], null),
            new TestViewItemData('finishAllTrunk', ['完成所有主线任务'], null),
            new TestViewItemData('hideUI', ['隐藏所有UI'], null),
            new TestViewItemData('setrole tongguan ', ['通关', '$', '$'], ['300032', '5'], [new TestViewFilter('PinstanceConfigM', ['m_iPinstanceID', 'm_szName'], 'm_iPinstanceID')]),
            new TestViewItemData('dailyActTest', ['时段活动测试'], null),
            new TestViewItemData('toggleActivity', ['切换活动状态：', '$'], ['活动id'], [new TestViewFilter('ActivityConfigM', ['m_szName'], 'm_iID')]),
            new TestViewItemData('checkActivity', ['活动是否开启：', '$'], ['活动id'], [new TestViewFilter('ActivityConfigM', ['m_szName'], 'm_iID')]),
            new TestViewItemData('gmPriHY', ['特权活跃经验值', '$', '$'], ['特权类型1-3', '经验默认100']),
            new TestViewItemData('gmPriHY 2', ['清除所有特权的活跃进度'], null),

            new TestViewItemData('otherMoney', ['各种其它货币'], ['100000']),
            new TestViewItemData('guild money', ['增加宗门财富：', '$'], ['100000']),
            new TestViewItemData('guild level', ['设置宗门等级：', '$'], ['10']),
            new TestViewItemData('setrole zptk 2 0', ['宗门探险下一步'], null),
            new TestViewItemData('setrole zptk 3 3', ['宗门探险满体力'], null),

            new TestViewItemData('setrole wyyz 3', ['伙伴远征清理玩家数据'], null),

            new TestViewItemData('setrole clearhyd', ['清除活跃度'], null),
            new TestViewItemData('setrole addhyd', ['增加活跃度', '$'], ['1000']),

            new TestViewItemData('getRebirthEquip', ['一键转生装备材料'], null),
            new TestViewItemData('getWingEquip', ['一键翅膀装备'], null),
            new TestViewItemData('addpetequip', ['一键武缘装备'], null),
            new TestViewItemData('addzhufuequip', ['一键祝福装备'], null),
            new TestViewItemData('getFanXianMaterials', ['一键获取创世套装材料'], null),
            new TestViewItemData('addequip', ['一键添加粉色装备'], null),
            new TestViewItemData('addequip1', ['一键添加各阶级刀'], null),
            new TestViewItemData('getAllDiamond', ['一键获取宝石'], null),
            new TestViewItemData('getAllJinJieFu', ['一键获取进阶符'], null),
            new TestViewItemData('getAllSpecialImage', ['一键添加外形卡'], null),
            new TestViewItemData('getAllShenQiImage', ['一键添加神器外形卡'], null),
            new TestViewItemData('getAllTitleCard', ['一键添加称号卡'], null),
            new TestViewItemData('getAllPrivileage', ['一键添加特权卡'], null),
            new TestViewItemData('getAllPet', ['一键获取所有伙伴激活道具'], null),
            new TestViewItemData('getAllFaQi', ['一键获取宝物激活卡'], null),
            new TestViewItemData('getAllLingBao', ['一键获取精灵'], null),
            new TestViewItemData('getAllShenShou', ['一键获取斗兽神兽'], null),
            new TestViewItemData('getAllShenShouJinJie', ['一键获取斗兽神兽进阶材料'], null),
            new TestViewItemData('getAllShieldGod', ['一键获取守护神'], null),
            new TestViewItemData('getPetFeishengMaterials', ['一键获取伙伴飞升材料'], null),
            new TestViewItemData('petUpStage', ['伙伴一键升阶', '$'], ['5']),

            new TestViewItemData('getLianTi', ['一键添加装备炼体材料'], null),


            new TestViewItemData('setrole cleardayrefresh', ['清跨天数据'], null),
            new TestViewItemData('clearBwdh', ['清除比武大会段位积分'], null),
            new TestViewItemData('setrole clearcd', ['清cd'], null),
            new TestViewItemData('setrole clearact 0', ['清在线礼包'], null),
            new TestViewItemData('gmstartact 1', ['回到当初，七天榜刚出的时候'], null),

            new TestViewItemData('setrole sundry whjx_self', ['能力叛乱报名：', '$'], ['1报名0取消']),
            new TestViewItemData('setrole sundry zlqj_self', ['西洋棋清次数'], null),

            new TestViewItemData('gmscriptLv', ['修改当前副本为第', '$', '层'], ['20']),
            new TestViewItemData('gmscriptTimer', ['清除总计时器'], null),

            new TestViewItemData('questcancel', ['取消所有任务'], null),


            new TestViewItemData('getTianZhu', ['一键添加天珠材料'], null),

            new TestViewItemData('testGuide', ['测试引导'], null),
            new TestViewItemData('testPinstance', ['进入副本第几层：', '$', '$'], ['300080', '0']),

            new TestViewItemData('checkBlock', ['查阻挡', '$', ',', '$'], ['x', 'y']),
            new TestViewItemData('checkPath', ['查连通', '$', ',', '$', '$', ',', '$'], ['x1', 'y1', 'x2', 'y2']),
            new TestViewItemData('setPosition', ['设位置', '$', ',', '$', ', 是否寻路：', '$'], ['x', 'y', '0']),
            new TestViewItemData('getDistance', ['测量距离'], null),

            new TestViewItemData('hideSelf', ['不限制帧率'], null),
            new TestViewItemData('petNoMove', ['宝宝不移动'], null),
            new TestViewItemData('testNotice', ['测试飘字'], null),

            new TestViewItemData('showfps', ['显示fps，同时录制'], null),
            new TestViewItemData('copyfps', ['将录制的fps复制到剪贴板'], null),
        ];

        this.m_gmMap = {};
        for (let gmItemData of this.listDatas) {
            this.m_gmMap[gmItemData.gmCmd] = gmItemData;
        }
    }
}