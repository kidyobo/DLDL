import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { Global as G } from "System/global";
import { Macros } from "System/protocol/Macros";
import { KeyWord } from "System/constants/KeyWord";
import { ProtocolUtil } from "System/protocol/ProtocolUtil";
import { UIPathData } from "System/data/UIPathData"
import { Color } from "System/utils/ColorUtil"
import { TextFieldUtil } from "System/utils/TextFieldUtil"
import { List } from "System/uilib/List";
import { ElemFinder } from 'System/uilib/UiUtility'
import { EnumEffectRule } from 'System/constants/GameEnum'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { FabaoData } from 'System/data/FabaoData'
import { PetPropItem } from 'System/pet/view/PetPropItem'
import { PropUtil } from 'System/utils/PropUtil'
import { SiXiangData } from 'System/data/SiXiangData'

class SiXiangFaQiItemData {
    info: Protocol.FaQiInfo;
    position = 0;
    propValues: GameConfig.EquipPropAtt[];
    propColors: string[];
}

class SiXiangFaQiItem extends ListItemCtrl {
    private static readonly MaxHaloProps = 4;

    private icon: UnityEngine.UI.Image;
    private textName: UnityEngine.UI.Text;
    private textStage: UnityEngine.UI.Text;
    private isUsed: UnityEngine.GameObject;

    private props: UnityEngine.GameObject;
    private noProps: UnityEngine.GameObject;

    private propItems: PetPropItem[] = [];

    private id = 0;
    private position = -1;

    setComponents(go: UnityEngine.GameObject) {
        this.icon = ElemFinder.findImage(go, 'icon');
        this.textName = ElemFinder.findText(go, 'textName');
        this.textStage = ElemFinder.findText(go, 'textStage');
        this.isUsed = ElemFinder.findObject(go, 'isUsed');

        this.props = ElemFinder.findObject(go, 'props');
        this.noProps = ElemFinder.findObject(go, 'noProps');

        for (let i = 0; i < SiXiangFaQiItem.MaxHaloProps; i++) {
            let itemGo = ElemFinder.findObject(this.props, i.toString());
            let item = new PetPropItem();
            item.setUsual(itemGo);
            this.propItems.push(item);
        }
    }

    update(itemData: SiXiangFaQiItemData, altas: Game.UGUIAltas) {
        this.id = itemData.info.m_iID;
        this.position = itemData.position;

        let faQiData = G.DataMgr.fabaoData;
        let cfg = faQiData.getFaqiConfig(itemData.info.m_iID, itemData.info.m_ucLayer);
        this.icon.sprite = altas.Get(cfg.m_szName);
        this.textName.text = cfg.m_szName;
        this.textStage.text = itemData.info.m_ucLayer + '阶';
        this.isUsed.SetActive(itemData.position > 0);

        let pcnt = itemData.propValues.length;
        this.props.SetActive(pcnt > 0);
        this.noProps.SetActive(pcnt <= 0);

        if (pcnt > 0) {
            for (let i = 0; i < SiXiangFaQiItem.MaxHaloProps; i++) {
                let propItem = this.propItems[i];
                if (i < pcnt) {
                    let p = itemData.propValues[i];
                    propItem.update(p.m_ucPropId, p.m_ucPropValue, false, itemData.propColors[i]);
                    propItem.gameObject.SetActive(true);
                } else {
                    propItem.gameObject.SetActive(false);
                }
            }
        } 
    }

    get Id(): number {
        return this.id;
    }

    get Position(): number {
        return this.position;
    }
}

export class SiXiangFaQiView extends CommonForm {
    private list: List;
    private items: SiXiangFaQiItem[] = [];
    private itemDatas: SiXiangFaQiItemData[] = [];

    private faQiAltas: Game.UGUIAltas;
    private btnClose: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;

    private openPosition = 0;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.SiXiangFaQiView;
    }
    protected initElements(): void {
        this.list = this.elems.getUIList("list");
        this.faQiAltas = this.elems.getElement('faQiAltas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        this.btnClose = this.elems.getElement("btnClose");
        this.mask = this.elems.getElement("mask");

    }
    protected initListeners(): void {
        this.addListClickListener(this.list, this.onClickList);
        this.addClickListener(this.btnClose, this.onBtnClose);
        this.addClickListener(this.mask, this.onBtnClose);
    }

    open(position: number) {
        this.openPosition = position;
        super.open();
    }
  
    protected onOpen() {
        let faQiData = G.DataMgr.fabaoData;
        let siXiangData = G.DataMgr.siXiangData;

        // 获取相邻的两个神兽
        let ssId1 = SiXiangData.getShenShouId1ByFaQiPosition(this.openPosition);
        let ssId2 = SiXiangData.getShenShouId2ByFaQiPosition(this.openPosition);
        let ssInfo1 = siXiangData.getShenShouInfo(ssId1);
        let ssInfo2 = siXiangData.getShenShouInfo(ssId2);
        let ssCfg1: GameConfig.ShenShouCfgM;
        let ssCfg2: GameConfig.ShenShouCfgM;
        if (null != ssInfo1 && ssInfo1.m_ucLevel > 0) {
            // 神兽已激活
            ssCfg1 = siXiangData.getCfg(ssId1, ssInfo1.m_ucLevel);
        }
        if (null != ssInfo2 && ssInfo2.m_ucLevel > 0) {
            // 神兽已激活
            ssCfg2 = siXiangData.getCfg(ssId2, ssInfo2.m_ucLevel);
        }

        this.itemDatas.length = 0;
        for (let i = 0; i < FabaoData.MAX_FaQiNum; i++) {
            let id = faQiData.faqiIdArr[i];
            if (id > 0) {
                let info = faQiData.getFaqiData(id);
                if (null != info && info.m_ucStatus == Macros.GOD_LOAD_AWARD_DONE_GET) {
                    let position = siXiangData.getFaQiPositionById(id);
                    if (position != this.openPosition) {
                        // 属性
                        let propValues: GameConfig.EquipPropAtt[] = [];
                        let colors: string[] = [];
                        let propMap: { [propId: number]: GameConfig.EquipPropAtt } = {};
                        let cfg = faQiData.getFaqiConfig(info.m_iID, info.m_ucLayer);
                        let soulCfg = faQiData.getFaqiZhuhunCfg(info.m_iID, info.m_stZhuHunInfo.m_uiLevel);
                        PropUtil.getFaqiProps(cfg, soulCfg, propValues, propMap);
                        // 检查哪些属性受光环影响
                        let pcnt = propValues.length;
                        for (let i = pcnt - 1; i >= 0; i--) {
                            let propId = propValues[i].m_ucPropId;
                            let ssCfg = PropUtil.isFaQiEffectedByHalo(propId, ssCfg1, ssCfg2);
                            if (null != ssCfg) {
                                colors.unshift(SiXiangData.Colors[ssCfg.m_uiSeasonID - 1]);
                            } else {
                                propValues.splice(i, 1);
                            }
                        }

                        let itemData = new SiXiangFaQiItemData();
                        itemData.info = info;
                        itemData.position = position;
                        itemData.propValues = propValues;
                        itemData.propColors = colors;
                        this.itemDatas.push(itemData);
                    } 
                }
            }
        }

        this.itemDatas.sort(delegate(this, this.sortItemData));
        let cnt = this.itemDatas.length;
        let oldItemCnt = this.items.length;
        this.list.Count = cnt;
        for (let i = 0; i < cnt; i++) {
            let itemData = this.itemDatas[i];
            let item: SiXiangFaQiItem;
            if (i < oldItemCnt) {
                item = this.items[i];
            } else {
                this.items.push(item = new SiXiangFaQiItem());
                item.setComponents(this.list.GetItem(i).gameObject);
            }
            item.update(itemData, this.faQiAltas);
        }
    }

    private sortItemData(a: SiXiangFaQiItemData, b: SiXiangFaQiItemData): number {
        let aPropCnt = a.propValues.length;
        let bPropCnt = b.propValues.length;
        if (aPropCnt != bPropCnt) {
            return bPropCnt - aPropCnt;
        }
        if (a.position != b.position) {
            return a.position - b.position;
        }

        if (a.info.m_ucLayer != b.info.m_ucLayer) {
            return b.info.m_ucLayer - a.info.m_ucLayer;
        }
        return a.info.m_iID - b.info.m_iID;
    }

    private onClickList(index: number) {
        let item = this.items[index];
        // 如果这个已经镶嵌了，先脱下
        if (item.Position > 0) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getShenShouRequest(Macros.SHENSHOU_OP_DOWN_FAQI, item.Id, item.Position));
        } 

        let oldId = G.DataMgr.siXiangData.getFaQiIdAtPosition(this.openPosition);
        if (oldId > 0) {
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getShenShouRequest(Macros.SHENSHOU_OP_DOWN_FAQI, oldId, this.openPosition));
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getShenShouRequest(Macros.SHENSHOU_OP_SET_FAQI, item.Id, this.openPosition));
        this.close();
    }

    /**
     * 关闭按钮
     */
    private onBtnClose() {
        this.close();
    }
}