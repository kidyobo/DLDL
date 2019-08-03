import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { SkillData } from 'System/data/SkillData'
import { Constants } from 'System/constants/Constants'
import { EnumGuide } from 'System/constants/GameEnum'
import { GetSkillGuider } from 'System/guide/cases/GetSkillGuider'
import { SkillIconItem } from 'System/uilib/SkillIconItem'

export class SkillUnlockView extends CommonForm {
    private readonly AutoTimerKey = '1';

    private icon: UnityEngine.UI.RawImage;
    private iconWrapper: UnityEngine.GameObject;
    private iconOriginPos: UnityEngine.Vector3;

    private anim: UnityEngine.GameObject;
    private textName: UnityEngine.UI.Text;
    private mask: UnityEngine.GameObject;

    private m_skillId: number = 0;

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.SkillUnlockView;
    }

    protected onOpen() {
        if (this.m_skillId <= 0) {
            this._onComplete();
        }
        G.GuideMgr.processGuideNext(EnumGuide.GetSkill, EnumGuide.GetSkill_OpenView);
    }

    protected onClose() {
        this._removeTimer();
        G.GuideMgr.processGuideNext(EnumGuide.GetSkill, EnumGuide.GuideCommon_None);
    }

    protected initElements(): void {
        this.icon = this.elems.getRawImage('icon');
        this.iconWrapper = this.elems.getElement('iconWrapper');
        this.iconOriginPos = this.iconWrapper.transform.localPosition;

        this.anim = this.elems.getElement('anim');
        this.anim.SetActive(false);

        this.textName = this.elems.getText('textName');

        this.mask = this.elems.getElement('mask');
    }

    protected initListeners(): void {
        this.addClickListener(this.mask, this.onClickMask);
    }

    private _showSkill(skillId: number): void {
        this.iconWrapper.transform.localPosition = this.iconOriginPos;
        this.m_skillId = skillId;
        let config: GameConfig.SkillConfigM = SkillData.getSkillConfig(skillId);
        this.textName.text = config.m_szSkillName;
        this.textName.gameObject.SetActive(true);

        G.ResourceMgr.loadIcon(this.icon, config.m_iSkillIcon.toString());
        // 播放特效
        this.anim.SetActive(true);
        // 启动倒计时
        this.addTimer(this.AutoTimerKey, 2000, 1, this.onTimer);
        G.MainBtnCtrl.changeState(false, true);
    }

    private onTimer(): void {
        this._removeTimer();
        let endPoint = G.ViewCacher.mainView.getSkillPosition(this.m_skillId);
        if (null != endPoint) {
            this.anim.SetActive(false);
            this.textName.gameObject.SetActive(false);
            let tween = Tween.TweenPosition.Begin(this.iconWrapper, 1, endPoint, true);
            tween.onFinished = delegate(this, this.onFinished, this.m_skillId);
        } else {
            this._onComplete();
        }
    }
    private onFinished(skillId: number) {
        G.ViewCacher.mainView.onSkillChange(skillId);
        this._onComplete();
    }

    private _onComplete(): void {
        this.m_skillId = 0;

        // 查看还有没有在排队的
        let skillId = 0;
        let guider = G.GuideMgr.getCurrentGuider(EnumGuide.GetSkill) as GetSkillGuider;
        if (null != guider) {
            skillId = guider.getNextSkillId();
        }

        if (skillId > 0) {
            this._showSkill(skillId);
        }
        else {
            this.close();
        }
    }

    private _removeTimer() {
        this.removeTimer(this.AutoTimerKey);
    }

    private onClickMask() {
        if (this.hasTimer(this.AutoTimerKey)) {
            this._removeTimer();
            this.onTimer();
        }
    }
}