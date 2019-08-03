import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { Macros } from 'System/protocol/Macros'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'

/**喇叭做特殊处理*/
export enum FloatShowType {
    LaBa = -2,
    GetReward = -3,
    EnterSafeZone = -4,
    LeaveSafeZone = -5,
    PkScene = -6,
}


export class FloatTip extends CommonForm {

    ////////////////////获得奖励飘字///////////////////
    private getRewardFloatPrefab: UnityEngine.GameObject = null;
    private getRewardFloatList: UnityEngine.GameObject = null;
    private floatGetRewardInfos: string[] = [];
    private getRewardLastAt: number = 0;
    private getRewardPools: UnityEngine.GameObject[] = [];
    private getRewardObjNum: number = 0;
    private playingRewardObj: UnityEngine.GameObject = null;
    ///////////////////////喇叭上电视飘字//////////////
    private laBaPrefab: UnityEngine.GameObject = null;
    private laBaMask: UnityEngine.GameObject = null;
    private laBaInfoItems: string[] = [];
    private playingLaBaObj: UnityEngine.GameObject = null;
    private labaBack: UnityEngine.GameObject = null;
    private laBaObs: UnityEngine.GameObject[] = [];
    private laBaObjNum: number = 0;
    /////////////底部飘字(技能)//////////////////////
    private skillFloatPrefab: UnityEngine.GameObject = null;
    private skillFloatList: UnityEngine.GameObject = null;
    private skillFloatInfos: string[] = [];
    private lastSkillFloatAt: number = 0;
    private skillPools: UnityEngine.GameObject[] = [];
    private skillObjNum: number = 0;
    ///////////////////公告提示飘字//////////////////
    private floatNotice: UnityEngine.GameObject = null;
    private floatNoticePrefab: UnityEngine.GameObject = null;
    private floatNoticeBack: UnityEngine.GameObject;
    private noticeInfoItems: string[] = [];
    private lastNoticeFloatAt: number = 0;
    private noticePools: UnityEngine.GameObject[] = [];
    private noticeObjNum: number = 0;
    private playingObjNotice: UnityEngine.GameObject = null;
    ///////////////////PK场景提示////////////////////
    private pkSceneTip: UnityEngine.GameObject;
    private textPkScene: UnityEngine.UI.Text;
    private isPlayingPkSceneTip = false;
    ///////////////////安全区提示////////////////////
    private saftyTip: UnityEngine.GameObject;
    private textSaftyEnter: UnityEngine.UI.Text;
    private textSaftyLeave: UnityEngine.UI.Text;
    private isPlayingSafeTip = false;

    private uiLayer: UILayer;

    constructor(uiLayer: UILayer) {
        super(0);
        this.openSound = null;
        this.closeSound = null;
        this.uiLayer = uiLayer;
    }

    layer(): UILayer {
        return this.uiLayer;
    }
    protected resPath(): string {
        return UIPathData.FloatTip;
    }

    protected initElements() {
        this.getRewardFloatPrefab = this.elems.getElement("normalFloatPrefab");
        this.getRewardFloatList = this.elems.getElement("FloatList");
        this.laBaPrefab = this.elems.getElement("floatLaba");
        this.laBaMask = this.elems.getElement("tvMask");
        this.floatNotice = this.elems.getElement("floatNotice");
        this.floatNoticePrefab = this.elems.getElement("floatNoticePrefab");
        this.skillFloatPrefab = this.elems.getElement("skillTipPrefab");
        this.skillFloatList = this.elems.getElement("skillTipList");
        this.labaBack = this.elems.getElement("back");
        this.floatNoticeBack = this.elems.getElement('floatNoticeBack');
        this.pkSceneTip = this.elems.getElement('pkSceneTip');
        this.textPkScene = this.elems.getText('textPkScene');
        this.pkSceneTip.SetActive(false);
        this.saftyTip = this.elems.getElement('saftyTip');
        this.textSaftyEnter = this.elems.getText('textSaftyEnter');
        this.textSaftyLeave = this.elems.getText('textSaftyLeave');
        this.saftyTip.SetActive(false);
    }

    protected initListeners() {
    }

    protected onOpen() {
        this.addTimer("floatTimer", 10, 0, this.onCheck);
    }

    protected onClose() {

    }


    private onCheck() {
        this.checkFloatInfos();
        this.cheakObjNum();
    }

    private cheakObjNum() {
        if (this.getRewardObjNum == 0 && this.skillObjNum == 0 && this.laBaObjNum == 0 && this.noticeObjNum == 0 && !this.isPlayingSafeTip && !this.isPlayingPkSceneTip) {
            this.close();
        }
    }


    addFloatTip(info: string, showType: number) {
        if (showType == Macros.PROMPTMSG_TYPE_ROLL) {
            //上电视飘字
            this.noticeInfoItems.push(info);
            
        } else if (showType == FloatShowType.GetReward) {
            //获得奖励   
            this.floatGetRewardInfos.push(info);
        } else if (showType == FloatShowType.LaBa) {
            //喇叭
            this.laBaInfoItems.push(info);
        } else if (showType == FloatShowType.EnterSafeZone) {
            //进入安全区提示
            this.showSaftyTip(true);
        } else if (showType == FloatShowType.LeaveSafeZone) {
            //离开安全区提示
            this.showSaftyTip(false);
        } else if (showType == FloatShowType.PkScene) {
            //进入pk场景提示
            this.showPkSceneTip(info);
        } else {
            //其他先全部当技能飘字显示
            this.skillFloatInfos.push(info);
        }
    }

    private tipNum: number = 0;
    private checkFloatInfos() {

        if (this.floatGetRewardInfos.length > 0) {
            let nowTime = UnityEngine.Time.realtimeSinceStartup;
            if (nowTime - this.getRewardLastAt > 0.65) {
                //获取物品
                this.cloneFloatGetRewardTip(this.floatGetRewardInfos.shift());
                this.getRewardLastAt = nowTime;
            }
        }
        if (this.noticeInfoItems.length > 0) {
            if (this.tipNum == 0) {
                this.tipNum = this.noticeInfoItems.length;
            }
            let nowTime = UnityEngine.Time.realtimeSinceStartup;
            if (nowTime - this.lastNoticeFloatAt > 8.3) {
            //if (nowTime - this.lastNoticeFloatAt >= 2) {
                //公告消息
                this.cloneFloatNoticeTip(this.noticeInfoItems.shift());
                this.lastNoticeFloatAt = nowTime;
            }
        }
        if (this.skillFloatInfos.length > 0) {
            let nowTime = UnityEngine.Time.realtimeSinceStartup;
            if (nowTime - this.lastSkillFloatAt > 0.45) {
                //技能提示
                this.cloneSkillFloatTip(this.skillFloatInfos.shift());
                this.lastSkillFloatAt = nowTime;
            }
        }
        if (this.laBaInfoItems.length > 0) {
            //喇叭提示
            //this.cloneLaBaFloatTip(this.laBaInfoItems.shift());
        }

    }

    ////////////////////PK场景提示////////////////////////

    private showPkSceneTip(tipStr: string) {
        this.isPlayingPkSceneTip = true;
        // 先隐藏掉，这样动画可以重播
        this.pkSceneTip.SetActive(false);
        this.textPkScene.text = tipStr;
        this.pkSceneTip.SetActive(true);
        Game.Invoker.BeginInvoke(this.pkSceneTip, '1', 1.8, delegate(this, this.onPkSceneTipAnimExit));
    }

    private onPkSceneTipAnimExit() {
        this.pkSceneTip.SetActive(false);
        this.isPlayingPkSceneTip = false;
    }

    ////////////////////黑洞塔安全区提示////////////////////////

    private showSaftyTip(isEnter: boolean) {
        this.isPlayingSafeTip = true;
        // 先隐藏掉，这样动画可以重播
        this.saftyTip.SetActive(false);
        this.textSaftyEnter.gameObject.SetActive(isEnter);
        this.textSaftyLeave.gameObject.SetActive(!isEnter);
        this.saftyTip.SetActive(true);
        Game.Invoker.BeginInvoke(this.saftyTip, '1', 2, delegate(this, this.onSaftyTipAnimExit));
    }

    private onSaftyTipAnimExit() {
        this.saftyTip.SetActive(false);
        this.isPlayingSafeTip = false;
    }

    //////////////////////////////获取物品飘字///////////////////

    private cloneFloatGetRewardTip(info: string) {
        let obj: UnityEngine.GameObject;
        if (this.getRewardPools.length > 0) {
            obj = this.getRewardPools.pop();
        } else {
            obj = UnityEngine.UnityObject.Instantiate(this.getRewardFloatPrefab, this.getRewardFloatList.transform, false) as UnityEngine.GameObject;
        }
        obj.SetActive(true);
        this.playingRewardObj = obj;
        this.getRewardObjNum++;
        let infoText = ElemFinder.findText(obj, "Text");
        infoText.text = info;
        Game.Invoker.BeginInvoke(obj, '1', 2, delegate(this, this.onFloatGetRewardAnimExit, obj));
    }

    private onFloatGetRewardAnimExit(obj: UnityEngine.GameObject) {
        obj.SetActive(false);
        this.getRewardPools.push(obj);
        this.getRewardObjNum--;
    }

    private canCreate: boolean = true;
    /////////////////////////公告飘字///////////////////////////////////
    private cloneFloatNoticeTip(info: string) {
        //uts.log("我的输出 + 公告次数  " + this.tipNum)
        this.tipNum -= 1;
        let obj: UnityEngine.GameObject;
        if (this.canCreate) {
            if (this.noticePools.length > 0) {
                obj = this.noticePools.pop();
            } else {
                obj = UnityEngine.UnityObject.Instantiate(this.floatNoticePrefab, this.floatNotice.transform, false) as UnityEngine.GameObject;
            }
            this.canCreate = false;
            obj.SetActive(true);
            this.playingObjNotice = obj;
            this.floatNoticeBack.SetActive(true);
            this.noticeObjNum++;
            let infoText = ElemFinder.findText(obj, "Text");
            infoText.text = info;
            //this.checkFloatNoticePos(obj, infoText.preferredWidth);
            //Game.Invoker.BeginInvoke(obj, '1', 13.3, delegate(this, this.onNoticeTipAnimExit, obj));
            if (this.tipNum != 0) {
                Game.Invoker.BeginInvoke(obj, '1', 2, delegate(this, this.onNoticeTipAnimExit, obj));
            }
            else {
                Game.Invoker.BeginInvoke(obj, '1', 12, delegate(this, this.onNoticeTipAnimExit, obj));
            }
        }
        
        
        
    }

    private checkFloatNoticePos(go: UnityEngine.GameObject, width: number) {
        this.removeTimer("checkPos");
        this.addTimer("checkPos", 100, 0, delegate(this, this.onCheckNoticeObjTimer, go, width));
    }
    private onCheckNoticeObjTimer(timer: Game.Timer, go: UnityEngine.GameObject, width: number) {
        if (this.noticeObjNum > 1) {
            this.floatNoticeBack.SetActive(false);
            this.removeTimer("checkPos");
        }
            
        //}
    }
    //private noticeTipSetActive(obj: UnityEngine.GameObject) {
    //    if (this.noticeObjNum > 1 ) {
    //        this.floatNoticeBack.SetActive(false);
    //    }
    //}
    private onNoticeTipAnimExit(obj: UnityEngine.GameObject) {
        this.canCreate = true;
        obj.SetActive(false);
        this.floatNoticeBack.SetActive(false);
        this.noticePools.push(obj);
        this.noticeObjNum--;
        if (this.tipNum != 0) {
            this.cloneFloatNoticeTip(this.noticeInfoItems.shift());
        }
    }


    /////////////////////////////技能飘字//////////////////////////////////////

    private cloneSkillFloatTip(info: string) {
        let obj: UnityEngine.GameObject;
        if (this.skillPools.length > 0) {
            obj = this.skillPools.pop();
        } else {
            obj = UnityEngine.UnityObject.Instantiate(this.skillFloatPrefab, this.skillFloatList.transform, false) as UnityEngine.GameObject;
        }
        obj.SetActive(true);
        this.skillObjNum++;
        let infoText = ElemFinder.findText(obj, "Text");
        infoText.text = info;
        Game.Invoker.BeginInvoke(obj, '1', 2, delegate(this, this.onSkillTipAnimExit, obj));
    }

    private onSkillTipAnimExit(obj: UnityEngine.GameObject) {
        if (obj == null || obj == undefined || obj.SetActive == null || obj.SetActive == undefined) { // 定位bug
            if (!obj) {
                uts.bugReport('FloatTip::onSkillTipAnimExit obj == null');
            }
            else {
                let s = 'FloatTip::onSkillTipAnimExit ';
                if (obj.name != null) {
                    s += ' obj.name = ' + obj.name;
                }
                s += ' keylist = ';
                for (let k in obj) {
                    s += k + ',';
                }
                let argLen = arguments.length;
                s += ' arglen = ' + argLen;
                for (let i = 0, n = argLen; i < n; i++) {
                    let arg = arguments[i];
                    for (let k in arg) {
                        s += k + ',';
                    }
                }
                uts.bugReport(s);
            }
        }
        obj.SetActive(false);
        this.skillPools.push(obj);
        this.skillObjNum--;
    }

    ////////////////////////////喇叭///////////////////////////////////////

    private cloneLaBaFloatTip(info: string) {
        if (this.playingLaBaObj != null) {
            let uiTextObj = ElemFinder.findObject(this.playingLaBaObj, 'uiText');
            uiTextObj.SetActive(false);
            this.playingLaBaObj = null;
        }
        let obj: UnityEngine.GameObject;
        if (this.laBaObs.length > 0) {
            obj = this.laBaObs.pop();
        } else {
            obj = UnityEngine.UnityObject.Instantiate(this.laBaPrefab, this.laBaMask.transform, false) as UnityEngine.GameObject;
        }
        obj.SetActive(true);
        this.labaBack.SetActive(true);
        this.laBaObjNum++;
        this.playingLaBaObj = obj;
        let infoText = ElemFinder.findUIText(obj, "uiText");
        infoText.gameObject.SetActive(true);
        infoText.text = info;
        infoText.ProcessText();
        this.cheakLaBaObjPos(obj, infoText.renderWidth);
        Game.Invoker.BeginInvoke(obj, '1', 20, delegate(this, this.onLaBaTipAnimExit, obj));

    }

    private onLaBaTipAnimExit(obj: UnityEngine.GameObject) {
        obj.SetActive(false);
        this.laBaObs.push(obj);
        if (this.playingLaBaObj == obj) {
            this.playingLaBaObj = null;
        }
        this.laBaObjNum--;
    }

    /**检查当前obj的位置*/
    private cheakLaBaObjPos(go: UnityEngine.GameObject, width: number) {
        this.removeTimer("checkTimer");
        this.addTimer("checkTimer", 100, 0, delegate(this, this.onCheckLaBaObjTimer, go, width));
    }


    private onCheckLaBaObjTimer(timer: Game.Timer, go: UnityEngine.GameObject, width: number) {
        let rect = ElemFinderMySelf.findRectTransForm(go);
        let positionX = rect.anchoredPosition.x + width;
        if (positionX < 0) {
            this.removeTimer("checkTimer");
            this.labaBack.SetActive(false);
        }
    }

}