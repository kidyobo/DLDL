import { Global as G } from 'System/global'
import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { RegExpUtil } from 'System/utils/RegExpUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { GameIDUtil } from 'System/utils/GameIDUtil'
import { List } from 'System/uilib/List'
import { EquipStrengthenData } from 'System/data/EquipStrengthenData'
import { FightingStrengthUtil } from 'System/utils/FightingStrengthUtil'
import { ThingData } from 'System/data/thing/ThingData'
import { ThingItemData } from 'System/data/thing/ThingItemData'
import { EnumGuide } from 'System/constants/GameEnum'
import { GetThingGuider } from 'System/guide/cases/GetThingGuider'
import { IconItem } from 'System/uilib/IconItem'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { UIUtils } from 'System/utils/UIUtils'
import { GetHunguEquipView } from './GetHunguEquipView';

export class GetThingView extends CommonForm implements IGuideExecutor {
    private readonly AutoTimerKey = '1';
    private readonly AutoSeconds = 5;

    /**物品名字*/
    private textName: UnityEngine.UI.Text;

    private icon: IconItem;
    private iconGo: UnityEngine.GameObject;

    /**使用按钮。*/
    private btnUse: UnityEngine.GameObject;
    private labelBtn: UnityEngine.UI.Text;

    private btnReturn: UnityEngine.GameObject;

    private m_crtThingId = 0;

    private leftSeconds = 0;
    private autoUse = false;

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.GetThingView;
    }

    protected onOpen() {
        // 先进行下一步指引，否则可能指定的物品以及消失了，直接关闭要求执行GuideCommon_None，导致步骤对不上
        G.GuideMgr.processGuideNext(EnumGuide.GetThing, EnumGuide.GetThing_OpenView);
        if (0 == this.m_crtThingId) {
            this.processAfterUse();
        }
    }

    protected onClose() {
        this.m_crtThingId = 0;
        // 继续下一步引导
        G.GuideMgr.processGuideNext(EnumGuide.GetThing, EnumGuide.GuideCommon_None);
        this.removeTimer(this.AutoTimerKey);
    }

    protected initElements(): void {
        this.textName = this.elems.getText('textName');
        this.btnUse = this.elems.getElement('btnUse');
        this.labelBtn = this.elems.getText('labelBtn');

        let itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
        this.icon = new IconItem();
        this.icon.setUsualIconByPrefab(itemIcon_Normal, this.elems.getElement('icon'));

        this.btnReturn = this.elems.getElement('btnReturn');
    }

    protected initListeners(): void {
        this.addClickListener(this.btnUse, this.onClickBtnUse);
        this.addClickListener(this.btnReturn, this.onclickBtnReturn);
    }

    private onClickBtnUse() {
        this.removeTimer(this.AutoTimerKey);
        // 先使用物品
        let itemDatas = G.DataMgr.thingData.getBagItemById(this.m_crtThingId, false, 1, true);
        if (null != itemDatas && itemDatas.length > 0) {
            let itemData = itemDatas[0];
            if ((itemData.config.m_ucCanBatUse & KeyWord.ITEM_USE_METHOD_BATUSE) != 0) {
                // 可以批量使用
                G.ModuleMgr.bagModule.useThing(itemData.config, itemData.data, itemData.data.m_iNumber);
            } else {
                if (GameIDUtil.isHunguEquipID(itemData.config.m_iID)) {//魂骨
                    //魂骨能进入到这里的,都是比身上好的
                    G.ActionHandler.takeOnEquip(itemData, 0);
                    if (itemData.config.m_iDropLevel <= G.DataMgr.constData.getValueById(KeyWord.PARAM_HUNGU_APPAREL_UI_LIMIT) && G.DataMgr.sceneData.curPinstanceID <= 0) {
                        this.onOpenGetHunguView(itemData.config.m_iID, itemData.config.m_iEquipPart)
                    }
                }
                else {
                    G.ModuleMgr.bagModule.useThing(itemData.config, itemData.data, 1);
                }
            }
        }

        this.processAfterUse();
    }

    private onOpenGetHunguView(id: number, part: number) {
        let gethunguview = G.Uimgr.createForm<GetHunguEquipView>(GetHunguEquipView);
        if (gethunguview != null) {
            //100211050
            gethunguview.open(id, part);
        }
    }

    private onclickBtnReturn() {
        let cfg = ThingData.getThingConfig(this.m_crtThingId);
        if (cfg && (cfg.m_ucCanBatUse & KeyWord.ITEM_USE_METHOD_FORCEUSE) != 0) {
            // 强制使用的物品，点关闭也使用
            this.onClickBtnUse();
        } else {
            this.processAfterUse();
        }
    }

    private processAfterUse() {
        // 检查是否还有装备要显示
        let id = 0;
        let guider = G.GuideMgr.getCurrentGuider(EnumGuide.GetThing) as GetThingGuider;
        if (null != guider) {
            id = guider.getNextThing();
        }
        if (id > 0) {
            this._updateView(id);
        }
        else {
            // 取消任务聚焦
            this.close();
        }
    }

    private _updateView(id: number): void {
        this.m_crtThingId = id;
        let itemDatas = G.DataMgr.thingData.getBagItemById(id, false, 1, true);
        if (null == itemDatas || itemDatas.length <= 0) {
            this.processAfterUse();
            return;
        }

        // 名字
        let itemData = itemDatas[0];
        this.textName.text = TextFieldUtil.getItemText(itemData.config);
        // 图标
        this.icon.updateByThingItemData(itemData);
        this.icon.updateIcon();

        if (GameIDUtil.isHunguEquipID(itemData.config.m_iID) || (itemData.config.m_ucCanBatUse & KeyWord.ITEM_USE_METHOD_AUTOUSE) != 0) {
            // 各种货币卡倒计时自动使用
            this.autoUse = true;
            this.labelBtn.text = uts.format('立刻使用({0})', this.AutoSeconds);
        } else {
            this.autoUse = false;
            this.labelBtn.text = uts.format('使用', this.AutoSeconds);
        }
        this.addTimer(this.AutoTimerKey, 1000, this.AutoSeconds, this.onAutoTimer);
    }

    private onAutoTimer(timer: Game.Timer) {
        let leftSeconds = this.AutoSeconds - timer.CallCount;
        if (this.autoUse) {
            this.labelBtn.text = uts.format('立刻使用({0})', leftSeconds);
        }
        if (leftSeconds <= 0) {
            if (this.autoUse) {
                this.onClickBtnUse();
            } else {
                this.onclickBtnReturn();
            }
        }
    }

    checkCurrentId(id: number): boolean {
        if (this.isOpened && this.m_crtThingId == id) {
            // 跟当前的物品id一致，刷新数量
            let itemDatas = G.DataMgr.thingData.getBagItemById(id, false, 1, true);
            if (itemDatas.length > 0) {
                let itemData = itemDatas[0];
                this.icon.updateByThingItemData(itemData);
                this.icon.updateIcon();
                return true;
            }
        }
        return false;
    }

    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (this.hasTimer(this.AutoTimerKey)) {
            if (this.autoUse) {
                this.onClickBtnUse();
            } else {
                this.onclickBtnReturn();
            }
        }
        return true;
    }
}