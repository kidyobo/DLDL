import { PetData } from 'System/data/pet/PetData';
import { MaterialItemData } from 'System/data/vo/MaterialItemData';
import { Global as G } from 'System/global';
import { PropertyListNode } from './PropertyItemNode';
import { Macros } from 'System/protocol/Macros';
import { ProtocolUtil } from 'System/protocol/ProtocolUtil';
import { TipFrom } from 'System/tip/view/TipsView';
import { IconItem } from 'System/uilib/IconItem';
import { UiElements } from 'System/uilib/UiElements';
import { Color } from 'System/utils/ColorUtil';
import { TextFieldUtil } from 'System/utils/TextFieldUtil';
import { UIUtils } from 'System/utils/UIUtils';


/**伙伴觉醒界面 */
export class PetJuexingPanel {
    private gameObject: UnityEngine.GameObject;
    private petId: number;

    /**属性列*/
    private attributeListPanel: PropertyListNode;

    private txtLevel: UnityEngine.UI.Text;
    private txtLevelLast: UnityEngine.UI.Text;

    private imgSlider: UnityEngine.UI.Image;
    private txtMaxSlider: UnityEngine.UI.Text;
    private txtCurSlider: UnityEngine.UI.Text;
    private imgIcon: UnityEngine.GameObject;
    private materialItemicon: IconItem;
    private materialData: MaterialItemData = new MaterialItemData();

    //突破 - 觉醒 - 自动觉醒 停止觉醒
    private btnBreakThrough: UnityEngine.GameObject;
    private btnStart: UnityEngine.GameObject;
    private btnAutoStart: UnityEngine.GameObject;
    private txtAutoStartStop: UnityEngine.UI.Text;
    private txtDescribe: UnityEngine.UI.Text;

    //等级相关资源、标记
    private curLevel = -1;
    private levelAltas: Game.UGUIAltas;
    private readonly LEVEL_NAME = "Companion_Awakening_";

    /**是否正在自动觉醒*/
    private isAuto = false;
    private readonly awakenDeltaTime: number = 250;
    private oldLuck = 0;
    private promoteValue: UnityEngine.GameObject;

    private timer: Game.Timer;
    private autoAwakenTime: number = 0;

    private readonly SLIDER_MIN = 0.1;
    private readonly SLIDER_MAX = 0.9;
    private readonly AWAKE_LEVEL_MAX = 4;

    actionOnClick: () => void = null;

    setComponents(elements: UiElements, go: UnityEngine.GameObject, iconitem: UnityEngine.GameObject) {
        this.gameObject = go;
        let attPanel = elements.getElement("attributeListPanel");
        this.attributeListPanel = new PropertyListNode();
        this.attributeListPanel.setComponents(attPanel);
        this.attributeListPanel.setTitle("永久附加主角属性");

        this.levelAltas = elements.getUGUIAtals("levelAltas");

        this.txtLevel = elements.getText("txtLevel");
        this.txtLevelLast = elements.getText("txtLevelLast");

        this.imgSlider = elements.getImage("imgSlider");
        this.txtMaxSlider = elements.getText("txtMaxSlider");
        this.txtCurSlider = elements.getText("txtCurSlider");
        this.imgIcon = elements.getElement("imgIcon");
        this.materialItemicon = new IconItem();
        this.materialItemicon.setUsualIconByPrefab(iconitem, this.imgIcon);
        this.materialItemicon.setTipFrom(TipFrom.material);

        this.btnStart = elements.getElement("btnAwaken");
        this.btnAutoStart = elements.getElement("btnAutoAwaken");
        this.btnBreakThrough = elements.getElement("btnBreakThrough");
        this.txtAutoStartStop = elements.getText("txtAutoStartStop");
        this.txtDescribe = elements.getText("txtDescribe");

        this.promoteValue = elements.getElement("promoteValue");

        Game.UIClickListener.Get(this.btnBreakThrough).onClick = delegate(this, this.onClickBreakThrough);
        Game.UIClickListener.Get(this.btnStart).onClick = delegate(this, this.onClickStart);
        Game.UIClickListener.Get(this.btnAutoStart).onClick = delegate(this, this.onClickAutoStart);
        // Game.UIClickListener.Get(elements.getElement("btnClose")).onClick = delegate(this, this.onClose);
        // Game.UIClickListener.Get(elements.getElement("btnMask")).onClick = delegate(this, this.onClose);

    }

    /**
     * 刷新页面
     * @param petChangeData 服务器返回的数据
     * @param petFixationData 本地固有数据
     */
    updatePanel(petChangeData: Protocol.NewBeautyInfo, petFixationData: GameConfig.BeautyAwakeCfgM) {
        this.petId = petFixationData.m_iID;

        //当前等级
        let level = petChangeData.m_stAwake.m_ucLevel;
        //当前觉醒进度
        let luck = petChangeData.m_stAwake.m_usLuck;
        //最大觉醒值
        let maxLuck = petFixationData.m_iAwakeExp;

        this.oldLuck = luck;

        //刷新材料
        if (level >= this.AWAKE_LEVEL_MAX && luck >= maxLuck) {
            this.imgIcon.SetActive(false);
            this.txtDescribe.text = "已满级";
        }
        else {
            this.imgIcon.SetActive(true);
            this.txtDescribe.text = "每次觉醒都随机增加觉醒进度值";

            //材料数据
            if (luck >= maxLuck) {
                this.materialData.id = petFixationData.m_iByongID;
                this.materialData.need = petFixationData.m_iByongNumber;
            }
            else {
                this.materialData.id = petFixationData.m_iConsumableID;
                this.materialData.need = petFixationData.m_iConsumeNum;
            }
            this.materialData.has = G.DataMgr.thingData.getThingNum(this.materialData.id, Macros.CONTAINER_TYPE_ROLE_BAG, false);

            this.materialItemicon.updateByMaterialItemData(this.materialData);
            this.materialItemicon.updateIcon();
        }


        //刷新进度
        this.txtCurSlider.text = TextFieldUtil.getColorText(Math.min(luck, maxLuck).toString(), Color.GREEN);
        this.txtMaxSlider.text = uts.format("/{0}", maxLuck);

        this.imgSlider.fillAmount = this.countSliderValue(luck / maxLuck);
        if (this.curLevel != level) {
            this.txtLevelLast.text = level == 0 ? "无" : PetData.petTitleTip[level - 1];
            this.txtLevel.text = PetData.petTitleTip[level];
            this.imgSlider.sprite = this.levelAltas.Get(this.LEVEL_NAME + (level + 1));
        }

        //按钮控制
        if (luck >= maxLuck) {
            //突破
            this.btnBreakThrough.SetActive(level < this.AWAKE_LEVEL_MAX);
            this.btnStart.SetActive(false);
            this.btnAutoStart.SetActive(false);
            this.stopAutoAwaken();
            UIUtils.setGrey(this.btnBreakThrough, this.materialData.has < this.materialData.need);
        }
        else {
            //觉醒
            this.btnBreakThrough.SetActive(false);
            this.btnStart.SetActive(true);
            this.btnAutoStart.SetActive(true);
            UIUtils.setGrey(this.btnStart, this.materialData.has < this.materialData.need);
            UIUtils.setGrey(this.btnAutoStart, this.materialData.has < this.materialData.need);
        }

        //属性计算
        let jueXingPropData: GameConfig.BeautyPropAtt[] = [];
        let len = petFixationData.m_astFixProp.length;
        for (let i = 0; i < len; i++) {
            let p = {} as GameConfig.BeautyPropAtt;
            let value = 0;

            if (luck > 0) {
                value = petFixationData.m_astFixProp[i].m_iPropValue * luck + petFixationData.m_astProp[i].m_iPropValue;
            }
            else {
                value = /*petFixationData.m_astFixProp[i].m_iPropValue +*/ petFixationData.m_astProp[i].m_iPropValue;
            }
            p.m_ucPropId = petFixationData.m_astFixProp[i].m_ucPropId;
            p.m_iPropValue = value;
            jueXingPropData.push(p);
        }
        //刷新属性面板
        this.attributeListPanel.refreshPropertyForDatas(jueXingPropData);

        if (null != this.actionOnClick) {
            let callback = this.actionOnClick;
            callback();
        }
    }
    /**
     * 处理服务器通知
     * @param result 错误码
     */
    serverResponse(result: number, curluck: number) {
        if (result == 0) {
            let luck = curluck;
            let addLuck = luck - this.oldLuck;
            if (addLuck > 0) {
                G.TipMgr.addPosTextMsg(uts.format('+{0}', addLuck), Color.TIP_GREEN_COLOR, this.promoteValue.transform, 0, 10);
            }
            this.oldLuck = luck;

            if (this.materialData.has < this.materialData.need) {
                this.stopAutoAwaken();
            }
            if (this.isAuto) {
                let time: number = G.SyncTime.getCurrentTime();
                if (time - this.autoAwakenTime > this.awakenDeltaTime) {
                    this.autoAwakenTime = time;
                    this.onClickStart();
                }
                else {
                    if (this.timer == null) {
                        this.timer = new Game.Timer("autoStartAwaken", this.awakenDeltaTime, 1, delegate(this, this.awakenCallBack))
                    }
                    else {
                        this.timer.ResetTimer(this.awakenDeltaTime, 1, delegate(this, this.awakenCallBack));
                    }
                }
            }
        } else {
            this.stopAutoAwaken();
        }
    }

    onOpen() {
        this.gameObject.SetActive(true);
    }

    onClose() {
        this.gameObject.SetActive(false);
        this.stopAutoAwaken();
    }
    /**突破 */
    private onClickBreakThrough() {
        this.onClickStart();
    }

    /**觉醒 */
    private onClickStart() {
        if (this.materialData.has < this.materialData.need) {
            //G.Uimgr.createForm<BatBuyView>(BatBuyView).open(this.materialData.id, 1, 0, 0, 0, 0, true);
        } else {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPetAwakenRequest(Macros.BEAUTY_AWAKE_STRENGTHEN, this.petId));
        }
    }

    /**自动觉醒（停止） */
    private onClickAutoStart() {
        if (this.isAuto) {
            this.stopAutoAwaken();
        }
        else {
            this.startAutoAwaken();
        }
    }

    /**开始自动强化 */
    private startAutoAwaken() {
        this.onClickStart();

        this.isAuto = true;
        this.txtAutoStartStop.text = "停止觉醒";
    }

    /**停止自动强化 */
    stopAutoAwaken() {
        this.isAuto = false;
        this.txtAutoStartStop.text = "自动觉醒";
        if (this.timer != null) {
            this.timer.Stop();
            this.timer = null;
        }
    }

    private awakenCallBack(timer: Game.Timer) {
        this.autoAwakenTime = G.SyncTime.getCurrentTime();
        this.onClickStart();
    }

    /**
     * 获取slider处理过的值
     * @param val
     */
    private countSliderValue(val: number): number {
        if (val == 0) return 0;
        if (val == 1) return 1;

        val = Math.min(val, 1);
        val = Math.max(val, 0);
        let value = (this.SLIDER_MAX - this.SLIDER_MIN) * val + this.SLIDER_MIN;
        return value;
    }
}