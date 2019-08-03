import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { FixedList } from 'System/uilib/FixedList'
import { ThingData } from 'System/data/thing/ThingData'
import { IconItem } from 'System/uilib/IconItem'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { DropPlanData } from 'System/data/DropPlanData'
import { TipFrom } from 'System/tip/view/TipsView'

export class LotteryBoxView extends CommonForm {
    private readonly IconCount = 12;

    private readonly AutoCloseTimerKey = '1';

    private wheel: UnityEngine.GameObject;
    private list: FixedList;
    private icons: IconItem[] = [];

    private textName: UnityEngine.UI.Text;

    private btnClose: UnityEngine.GameObject;
    private btnRoll: UnityEngine.GameObject;

    private itemInfo: Protocol.ContainerThingInfo;
    private dropCfg: GameConfig.DropConfigM;

    private m_ucDrawIndex: number = -1;

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.LotteryBoxView;
    }

    protected initElements(): void {
        this.wheel = this.elems.getElement('wheel');
        this.list = this.elems.getUIFixedList('list');

        this.textName = this.elems.getText('textName');

        this.btnClose = this.elems.getElement('btnClose');
        this.btnRoll = this.elems.getElement('btnRoll');

        let itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
        for (let i = 0; i < this.IconCount; i++) {
            let iconItem = new IconItem();
            iconItem.setUsualIconByPrefab(itemIcon_Normal, this.list.GetItem(i).gameObject);
            iconItem.setTipFrom(TipFrom.normal);
            this.icons.push(iconItem);
        }
    }

    protected initListeners(): void {
        this.addClickListener(this.btnClose, this.onClickBtnClose);
        this.addClickListener(this.elems.getElement('mask'), this.onClickBtnClose);
        this.addClickListener(this.btnRoll, this.onClickBtnRoll);
    }

    protected onOpen() {
        let thingCfg = ThingData.getThingConfig(this.itemInfo.m_iThingID);
        this.textName.text = thingCfg.m_szName;
        this.dropCfg = DropPlanData.getDropPlanConfig(thingCfg.m_iFunctionID);
        for (let i = 0; i < this.IconCount; i++) {
            let icon = this.icons[i];
            icon.updateByDropThingCfg(this.dropCfg.m_astDropThing[i]);
            icon.updateIcon();
        }
        // 自动开转
        this.onClickBtnRoll();
    }

    protected onClose() {
        this.itemInfo = null;
    }

    open(itemInfo: Protocol.ContainerThingInfo) {
        this.itemInfo = itemInfo;
        super.open();
    }

    onPreviewResult() {
        this.getTargetIconIdx();
    }

    private onClickBtnClose() {
        this.close();
    }

    private onClickBtnRoll() {
        if (this.m_start) {
            return;
        }
        this.m_start = true;
        this.callTimes = 0;
        this.playRotateAnim(false);
    }

    private getTargetIconIdx() {
        let index = -1;
        let sp = this.itemInfo.m_stThingProperty.m_stSpecThingProperty;
        if (sp) {
            let pos = sp.m_stLotteryBoxInfo.m_ucDropPos;
            if (pos > 0) {
                if (pos <= this.dropCfg.m_ucDropThingNumber) {
                    index = pos - 1;
                } else {
                    index = 0;
                }
            }
        }
        this.m_ucDrawIndex = index;
    }

    ///////////////////////////////////////////// 转盘动画 /////////////////////////////////////////////

    private m_start = false;
    private callTimes: number = -1;
    private rotateSize: number = 0;
    private rotateTarget: number = 0;
    private playRotateAnim(end: boolean) {
        this.rotateSize = this.rotateSize % -360;
        if (end) {
            //仅角度小于90度时候停下
            let delta = -this.rotateTarget + this.rotateSize;
            if ((delta <= 0 || delta > 90) && delta > -270) {
                end = false;
            }
        }
        if (end) {
            this.rotateSize = this.rotateTarget;
        }
        else {
            this.rotateSize -= 90;
        }
        this.m_ucDrawIndex = -1;
        let tween = Tween.TweenRotation.Begin(this.wheel, 0.1, G.getCacheV3(0, 0, this.rotateSize));
        tween.quaternionLerp = true;

        if (end) {
            this.rotateTarget = 0;
            tween.onFinished = delegate(this, this.onEnd);
        }
        else {
            tween.onFinished = delegate(this, this.onRotateAnimEnd);
        }
    }
    private onRotateAnimEnd() {
        this.callTimes++;
        if (this.callTimes > 4) {
            // 转4圈后请求结果
            this.getTargetIconIdx();
            if (this.m_ucDrawIndex < 0) {
                G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getOperateContainerMsg(Macros.CONTAINER_OPERATE_PER_USE_THING, Macros.CONTAINER_TYPE_ROLE_BAG, this.itemInfo.m_iThingID, this.itemInfo.m_usPosition, 1));
                this.callTimes = -1;
            }
        }

        if (this.m_ucDrawIndex == -1) {
            this.playRotateAnim(false);
        }
        else {
            this.rotateTarget = -this.m_ucDrawIndex * (360 / this.IconCount);
            this.playRotateAnim(true);
        }
    }
    private onEnd() {
        // 正式使用物品
        let thingCfg = ThingData.getThingConfig(this.itemInfo.m_iThingID);
        G.ModuleMgr.bagModule.useThing(thingCfg, this.itemInfo, 1, true);
        this.addTimer(this.AutoCloseTimerKey, 10000, 1, this.onAutoCloseTimer);
    }

    private onAutoCloseTimer(timer: Game.Timer) {
        this.close();
    }
}