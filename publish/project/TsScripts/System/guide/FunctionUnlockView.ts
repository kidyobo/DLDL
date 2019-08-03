import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { EnumGuide } from 'System/constants/GameEnum'
import { FunctionUnlockGuider } from 'System/guide/cases/FunctionUnlockGuider'

export class FunctionUnlockView extends CommonForm {
    private readonly AutoTimerKey = '1';

    private imgIcon: UnityEngine.UI.Image;
    private txtName: UnityEngine.UI.Text;
    private iconWrapper: UnityEngine.GameObject;
    private iconOriginPos: UnityEngine.Vector3;
    private anim: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;

    private content: UnityEngine.GameObject;

    /**当前的配置。*/
    private m_config: GameConfig.NPCFunctionLimitM;

    /**完成队列。*/
    private m_finishedQueue: GameConfig.NPCFunctionLimitM[] = [];

    /**是否正在飞图标。*/
    private m_isFlyingIcon: boolean = false;

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.FunctionUnlockView;
    }

    protected onOpen() {
        G.GuideMgr.processGuideNext(EnumGuide.FunctionUnlock, EnumGuide.FunctionUnlock_OpenView);

        if (null == this.m_config) {
            this.afterGuide();
        }
    }

    protected onClose() {
        this.anim.SetActive(false);
        // 新功能开启后，检查引导
        this.m_config = null;
        let finished = this.m_finishedQueue.concat();
        this.m_finishedQueue.length = 0;
        G.GuideMgr.processGuideNext(EnumGuide.FunctionUnlock, EnumGuide.GuideCommon_None);
    }

    protected initElements(): void {
        this.imgIcon = this.elems.getImage('imgIcon');
        this.txtName = this.elems.getText("txtName");
        this.iconWrapper = this.elems.getElement('iconWrapper');
        this.iconOriginPos = this.iconWrapper.transform.localPosition;
        this.anim = this.elems.getElement('anim');
        this.anim.SetActive(false);

        this.mask = this.elems.getElement('mask');
        this.content = this.elems.getElement('content');
    }

    protected initListeners(): void {
        this.addClickListener(this.mask, this.onClickMask);
    }

    private afterGuide() {
        if (null != this.m_config) {
            this.m_finishedQueue.push(this.m_config);
        }

        let funcCfg = null;
        let guider = G.GuideMgr.getCurrentGuider(EnumGuide.FunctionUnlock) as FunctionUnlockGuider;
        if (null != guider) {
            funcCfg = guider.getNextFuncCfg();
        }

        if (null != funcCfg) {
            this._guideFunc(funcCfg);
        }
        else {
            this.close();
        }
    }

    private _guideFunc(funcCfg: GameConfig.NPCFunctionLimitM): void {
        this.content.SetActive(true);
        this.m_config = funcCfg;

        this.iconWrapper.transform.localPosition = this.iconOriginPos;
        let sprite = G.AltasManager.getActIcon(funcCfg.m_iName);
        if (null == sprite) {
            // 看看父功能有木有图标
            if (funcCfg.m_iParentName > 0) {
                sprite = G.AltasManager.getActIcon(funcCfg.m_iParentName);
            }
        }
        if (null == sprite) {
            uts.logError('func image not found: ' + funcCfg.m_iName);
        }
        this.imgIcon.sprite = sprite;
        this.txtName.text =funcCfg.m_szDisplayName; //G.ActBtnCtrl.getNameFormId(funcCfg.m_iName);

        this.m_isFlyingIcon = false;
        // 播放特效
        this.anim.SetActive(true);

        // 启动倒计时
        this.addTimer(this.AutoTimerKey, 2000, 1, this.onTimer);
    }

    private onTimer(): void {
        this._removeTimer();
        this._flyIcon();
    }

    private onClickMask() {
        if (this.hasTimer(this.AutoTimerKey)) {
            this._removeTimer();
            this.onTimer();
        }
    }

    private _removeTimer() {
        this.removeTimer(this.AutoTimerKey);
    }

    private _flyIcon(): void {
        if (this.m_isFlyingIcon) {
            return;
        }
        this.m_isFlyingIcon = true;
        this.anim.SetActive(false);
        // 飞图标
        let funcRoot = G.DataMgr.funcLimitData.getFuncRoot(this.m_config);
        G.AudioMgr.playSound(uts.format('sound/functionDes/{0}.mp3', this.m_config.m_iName));
        let endPoint: UnityEngine.Vector3;
        if (KeyWord.BAR_FUNCTION_ROLE == funcRoot.m_iName) {
            // 飞到人物头像
            endPoint = G.ViewCacher.mainView.heroInfoCtrl.headIcon.transform.position;
        } else if (KeyWord.BAR_FUNCTION_BEAUTY == funcRoot.m_iName) {
            G.MainBtnCtrl.update(true);
            endPoint = G.MainBtnCtrl.btnPet.transform.position;
        } else if (KeyWord.FUNC_LIMIT_ACT == funcRoot.m_ucFunctionClass) {
            // 飞到右上角活动图标那里
            G.ActBtnCtrl.update(true);
            if (G.ActBtnCtrl.IsOpened) {
                let btn = G.ActBtnCtrl.getFuncBtn(funcRoot.m_iName);
                if (null != btn) {
                    endPoint = btn.transform.position;
                }
            } else {
                // 没有打开就飞到+号按钮
                endPoint = G.ActBtnCtrl.switcher.transform.position;
            }
        } else {
            if (KeyWord.FUNC_LIMIT_BAR == funcRoot.m_ucFunctionClass) {
                // 其它情况都飞到主功能栏那里
                G.MainBtnCtrl.update(true);
                if (G.MainBtnCtrl.IsOpened) {
                    let btn = G.MainBtnCtrl.getFuncBtn(funcRoot.m_iName);
                    if (null != btn) {
                        endPoint = btn.transform.position;
                    }
                } else {
                    // 没有打开就飞到+号按钮
                    endPoint = G.MainBtnCtrl.switcher.transform.position;
                }
            }
        }

        if (null != endPoint) {
            let tween = Tween.TweenPosition.Begin(this.iconWrapper, 1, endPoint, true);
            tween.onFinished = delegate(this, this.onTweenComplete);
        } else {
            uts.logWarning('no endpoint: ' + this.m_config.m_iName + ', funcRoot = ' + funcRoot.m_iName);
            this.afterGuide();
        }
    }
    private onTweenComplete() {
        this.afterGuide();
    }

    //private _afterFlyIcon(): void {
    //    if (this.m_config.m_ucOpenpanel > 0) {
    //        if (this.m_config.m_iName == KeyWord.BAR_FUNCTION_BEAUTY) {
    //            //写死慕芊雪
    //            G.ActionHandler.executeFunction(this.m_config.m_iName, 0, 40000001);
    //        }
    //        else {
    //            G.ActionHandler.executeFunction(this.m_config.m_iName);
    //        }
    //    }

    //    close();
    //}
}