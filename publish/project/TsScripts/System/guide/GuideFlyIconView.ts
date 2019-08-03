import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { EnumGuide } from 'System/constants/GameEnum'
import { FunctionUnlockGuider } from 'System/guide/cases/FunctionUnlockGuider'

/**某些引导结束后，主动发起飞图标，而不是由表格控制 */
export class GuideFlyIconView extends CommonForm {
    private readonly AutoTimerKey = '1';

    private imgIcon: UnityEngine.UI.Image;
    private txtName: UnityEngine.UI.Text;
    private iconWrapper: UnityEngine.GameObject;
    private iconOriginPos: UnityEngine.Vector3;
    private anim: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;

    private content: UnityEngine.GameObject;

    /**是否正在飞图标。*/
    private m_isFlyingIcon: boolean = false;

    private iconId: number = 0;
    private name: string = "";
    private keyword: number = 0;

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.GuideFlyIconView;
    }


    open(iconId: number, name: string = "", keyWord: number=0) {
        this.iconId = iconId;
        this.name = name;
        this.keyword = keyWord; 
        super.open();
    }

    protected onOpen() {
        if (this.iconId > 0) {
            this._guideFunc();
        } else {
            uts.logError("图标id错误：" + this.iconId);
        }
           
        
    }

    protected onClose() {
        this.anim.SetActive(false);
       // G.GuideMgr.processGuideNext(EnumGuide.WuHunActivate, EnumGuide.WuHunActivate_FlyIcon);
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

    private _guideFunc(): void {

        this.iconWrapper.transform.localPosition = this.iconOriginPos;
        let sprite = G.AltasManager.getActIcon(this.iconId);
        if (null == sprite) {
            uts.logError('func image not found: ' + this.iconId);
        }
        this.imgIcon.sprite = sprite;
        this.txtName.text = this.name;

        this.m_isFlyingIcon = false;
        // 播放特效
        this.anim.SetActive(true);

        // 启动倒计时
        this.addTimer(this.AutoTimerKey, 1000, 1, this.onTimer);
    }

    private onTimer(): void {
        this._removeTimer();
        this._flyIcon();
    }

    private onClickMask() {
        this.addTimer("close", 3000, 1, this.close);
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
        //G.AudioMgr.playSound(uts.format('sound/functionDes/{0}.mp3', this.m_config.m_iName));
        let endPoint: UnityEngine.Vector3;
        if (KeyWord.BAR_FUNCTION_ROLE == this.keyword) {
            // 飞到人物头像
            endPoint = G.ViewCacher.mainView.heroInfoCtrl.headIcon.transform.position;
        //} else if (KeyWord.BAR_FUNCTION_BEAUTY == this.keyword) {
        //    G.MainBtnCtrl.update(true);
        //    endPoint = G.MainBtnCtrl.btnPet.transform.position;
        } else if (KeyWord.BAR_FUNCTION_REBIRTH == this.keyword) {
            G.MainBtnCtrl.update(true);
            endPoint = G.MainBtnCtrl.btnPet.transform.position;
        }
        else if (KeyWord.FUNC_LIMIT_ACT == this.keyword) {
            // 飞到右上角活动图标那里
            G.ActBtnCtrl.update(true);
            if (G.ActBtnCtrl.IsOpened) {
                let btn = G.ActBtnCtrl.getFuncBtn(this.iconId);
                if (null != btn) {
                    endPoint = btn.transform.position;
                }
            } else {
                // 没有打开就飞到+号按钮
                endPoint = G.ActBtnCtrl.switcher.transform.position;
            }
        } else {
            if (KeyWord.FUNC_LIMIT_BAR == this.keyword) {
                // 其它情况都飞到主功能栏那里
                G.MainBtnCtrl.update(true);
                if (G.MainBtnCtrl.IsOpened) {
                    let btn = G.MainBtnCtrl.getFuncBtn(this.iconId);
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
            uts.logWarning('no endpoint: ' + this.iconId + ', name = ' + this.name);
            this._guideFunc();
        }
    }
    private onTweenComplete() {
        // 启动倒计时
        this.addTimer("close1", 200, 1, this.close);
    }
}