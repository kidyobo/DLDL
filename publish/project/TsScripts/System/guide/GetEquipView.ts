import { Global as G } from 'System/global'
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
import { EnumGuide, GameIDType } from 'System/constants/GameEnum'
import { GetEquipGuider } from 'System/guide/cases/GetEquipGuider'
import { GetEquipInfo } from 'System/guide/GetEquipInfo'
import { IconItem } from 'System/uilib/IconItem'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { UIUtils } from 'System/utils/UIUtils'
import { EffectPlayer } from "System/unit/EffectPlayer";
import { Color } from "System/utils/ColorUtil"

export class GetEquipView extends CommonForm {
    private readonly AutoSeconds = 3;

    private readonly autoTimerId = '1';
    private readonly displayTimerId = '2';

    /**战斗力。*/
    private textZdl: UnityEngine.UI.Text;

    /**装备名字*/
    private textName: UnityEngine.UI.Text;

    private icon: IconItem;
    private iconGo: UnityEngine.GameObject;

    /**装备按钮。*/
    private btnEquip: UnityEngine.GameObject;
    private labelBtn: UnityEngine.UI.Text;

    private mask: UnityEngine.GameObject;
    private btnReturn: UnityEngine.GameObject;

    private targetIconData: ThingItemData;
    private targetIdx = -1;

    private m_crtEquip: GetEquipInfo;
    private canTakeOn = false;

    private leftSeconds = 0;

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.GetEquipView;
    }

    protected onOpen() {
        if (null == this.m_crtEquip) {
            this.processAfterEquip();
        }
        G.GuideMgr.processGuideNext(EnumGuide.GetEquip, EnumGuide.GetEquip_OpenView);
    }

    protected onClose() {
        this.m_crtEquip = null;
        // 继续下一步引导
        G.GuideMgr.processGuideNext(EnumGuide.GetEquip, EnumGuide.GuideCommon_None);
    }

    protected initElements(): void {
        this.textName = this.elems.getText('textName');
        this.textZdl = this.elems.getText('textZdl');
        this.btnEquip = this.elems.getElement('btnEquip');
        this.labelBtn = this.elems.getText('labelBtn');

        this.btnReturn = this.elems.getElement('btnReturn');
        this.mask = this.elems.getElement('mask');

        let itemIcon_Normal = this.elems.getElement('itemIcon_Normal');
        this.icon = new IconItem();
        this.icon.setUsualIconByPrefab(itemIcon_Normal, this.elems.getElement('icon'));
    }

    protected initListeners(): void {
        this.addClickListener(this.btnEquip, this.onClickBtnEquip);
        this.addClickListener(this.btnReturn, this.onclickBtnReturn);
        //this.addClickListener(this.mask, this.onclickBtnReturn);
    }

    private onClickBtnEquip() {
        // 先把装备穿上
        if (this.canTakeOn && this.m_crtEquip) {
            // 理论上 this.m_crtEquip 不可能是null，但某些情况下不知道什么原因导致报错，故判空
            let itemData = G.DataMgr.thingData.getBagItemByGuid(this.m_crtEquip.id, this.m_crtEquip.guid);
            if (null != itemData) {
                G.ModuleMgr.bagModule.useThing(itemData.config, itemData.data);
            }
        }
        
        this.processAfterEquip();
    }

    private onDisplayTimer(timer: Game.Timer) {
        this.processAfterEquip();
    }

    private processAfterEquip() {
        // 检查是否还有装备要显示
        let equip: GetEquipInfo;
        let guider = G.GuideMgr.getCurrentGuider(EnumGuide.GetEquip) as GetEquipGuider;
        if (null != guider) {
            equip = guider.getNextEquip();
        }
        if (null != equip) {
            this._updateView(equip);
        }
        else {
            // 取消任务聚焦
            this.close();
        }
    }

    private _updateView(equip: GetEquipInfo): void {
        this.m_crtEquip = equip;
        let equipObj = G.DataMgr.thingData.getBagItemByGuid(equip.id, equip.guid);
        if (null == equipObj) {
            this.processAfterEquip();
            return;
        }

         // 名字
        if (equipObj.config.m_iEquipPart == KeyWord.EQUIP_PARTCLASS_WING) {
            let color = KeyWord.COLOR_BLUE;
            if (equipObj && equipObj.data) {
                color = G.DataMgr.equipStrengthenData.getWingEquipColor(equipObj.config, equipObj.data);
            }
            this.textName.text = TextFieldUtil.getColorText(equipObj.config.m_szName, Color.getColorById(color));
        } else {
            this.textName.text = TextFieldUtil.getItemText(equipObj.config);
        }
     
        // 图标
        this.icon.updateByThingItemData(equipObj);
        this.icon.updateIcon();
        // 更新战斗力
        this.textZdl.text = uts.format('战力：{0}', equipObj.zdl);

        // 确定是否可穿戴
        this.canTakeOn = G.ActionHandler.canTakeOnEquip(equipObj.data, 0, false);

        this.addTimer(this.autoTimerId, 1000, this.AutoSeconds, this.onAutoTimer);
        this.leftSeconds = this.AutoSeconds;
        if (this.canTakeOn) {
            if (null == G.DataMgr.thingData.getWearedEquip(this.m_crtEquip.id, 0)) {
                this.labelBtn.text = uts.format('立即装备({0})', this.AutoSeconds);
            } else {
                this.labelBtn.text = uts.format('立即装备({0})', this.AutoSeconds);
            }
           
        } else {
            this.labelBtn.text = uts.format('确定({0})', this.AutoSeconds);
        }        
    }

    private onAutoTimer(timer: Game.Timer) {
        this.leftSeconds -= timer.CallCountDelta;
        if (this.canTakeOn) {
            if (null == G.DataMgr.thingData.getWearedEquip(this.m_crtEquip.id, 0)) {
                this.labelBtn.text = uts.format('立即装备({0})', this.leftSeconds);
            } else {
                this.labelBtn.text = uts.format('立即装备({0})', this.leftSeconds);
            }
        } else {
            this.labelBtn.text = uts.format('确定({0})', Math.max(0, this.leftSeconds));
        }
        
        if (this.leftSeconds <= 0) {
            this.onclickBtnReturn();
        }
    }

    private onclickBtnReturn() {
        let autoWear = false;
        if (null != this.m_crtEquip && this.canTakeOn) {
            // 主角装备如果身上没穿这个部位的则强制穿上，其他装备一概不自动穿
            if (GameIDUtil.isRoleEquipID(this.m_crtEquip.id)/* && null == G.DataMgr.thingData.getWearedEquip(this.m_crtEquip.id, 0)*/) {
                autoWear = true;
            }
        }

        if (autoWear) {
            this.onClickBtnEquip();
        } else {
            this.processAfterEquip();
        }        
    }
}