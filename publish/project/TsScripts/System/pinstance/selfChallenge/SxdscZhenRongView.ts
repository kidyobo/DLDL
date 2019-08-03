import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { Color } from 'System/utils/ColorUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { SiXiangData } from 'System/data/SiXiangData'
import { DataFormatter } from 'System/utils/DataFormatter'
import { UnitCtrlType } from 'System/constants/GameEnum'

class SxdscChooseItem {
    gameObject: UnityEngine.GameObject;
    private head: UnityEngine.UI.Image;
    private textName: UnityEngine.UI.Text;
    private lock: UnityEngine.GameObject;

    private id = 0;

    setComponents(go: UnityEngine.GameObject) {
        this.head = ElemFinder.findImage(go, 'head');
        this.textName = ElemFinder.findText(go, 'textName');
        this.lock = ElemFinder.findObject(go, 'lock');

        this.gameObject = go;
    }

    update(id: number, altas: Game.UGUIAltas) {
        this.id = id;
        if (id > 0) {
            this.head.sprite = altas.Get(id.toString());
            this.head.gameObject.SetActive(true);
            this.textName.text = SiXiangData.Names[id - 1];
            this.textName.gameObject.SetActive(true);
            this.lock.SetActive(false);
        } else {
            this.head.gameObject.SetActive(false);
            this.textName.gameObject.SetActive(false);
            this.lock.SetActive(true);
        }
    }

    get Id(): number {
        return this.id;
    }
}

class SxdscZhenRongItem extends ListItemCtrl {
    private head: UnityEngine.UI.Image;
    private textName: UnityEngine.UI.Text;
    private textZdl: UnityEngine.UI.Text;
    private textStage: UnityEngine.UI.Text;
    private add: UnityEngine.GameObject;
    private modelRootTR: UnityEngine.GameObject;

    btnSet: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.textName = ElemFinder.findText(go, 'textName');
        this.textZdl = ElemFinder.findText(go, 'textZdl');
        this.textStage = ElemFinder.findText(go, 'textStage');

        this.btnSet = ElemFinder.findObject(go, 'btnSet');
        this.add = ElemFinder.findObject(this.btnSet, 'add');
        this.head = ElemFinder.findImage(this.btnSet, 'head');

        this.modelRootTR = ElemFinder.findObject(go, 'avatarRoot');
    }

    init(index: number) {
        this.textName.text = SiXiangData.PositionDesc[index];
    }

    update(isActive: boolean, cfg: GameConfig.ShenShouCfgM, stage: number, fight: number, altas: Game.UGUIAltas, sortingOrder: number) {
        if (null != cfg) {
            this.btnSet.SetActive(true);
            this.head.sprite = altas.Get(cfg.m_uiSeasonID.toString());
            this.head.gameObject.SetActive(true);
            this.textStage.text = uts.format('{0}阶', DataFormatter.toHanNumStr(stage));
            this.textStage.gameObject.SetActive(true);
            this.textZdl.text = uts.format('当前战力：{0}', fight);
            this.textZdl.gameObject.SetActive(true);
            this.add.SetActive(false);

            G.ResourceMgr.loadModel(this.modelRootTR, UnitCtrlType.monster, cfg.m_szModelID, sortingOrder);
        } else {
            this.btnSet.SetActive(isActive);
            this.head.gameObject.SetActive(false);
            this.textStage.gameObject.SetActive(false);
            this.textZdl.gameObject.SetActive(false);
            this.add.SetActive(true);

            G.ResourceMgr.loadModel(this.modelRootTR, 0, null, 0);
        }
    }
}

/**斗兽斗兽场阵容对话框。*/
export class SxdscZhenRongView extends CommonForm {

    private btnClose: UnityEngine.GameObject;

    private list: List;
    private items: SxdscZhenRongItem[] = [];

    private setView: UnityEngine.GameObject;
    private setViewMask: UnityEngine.GameObject;
    private chooseItems: SxdscChooseItem[] = [];

    private altas: Game.UGUIAltas;

    private crtSetIndex = -1;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.SxdscZhenRongView;
    }

    protected initElements(): void {
        this.btnClose = this.elems.getElement('btnClose');

        this.setView = this.elems.getElement('setView');
        this.setViewMask = this.elems.getElement('setViewMask');
        this.setView.SetActive(false);
        let chooseItemsGo = this.elems.getElement('chooseItems');

        this.list = this.elems.getUIList('list');
        this.list.Count = SiXiangData.TotalCnt;
        for (let i = 0; i < SiXiangData.TotalCnt; i++) {
            let item = new SxdscZhenRongItem();
            item.setComponents(this.list.GetItem(i).gameObject);
            item.init(i);
            this.items.push(item);

            let chooseItem = new SxdscChooseItem();
            chooseItem.setComponents(ElemFinder.findObject(chooseItemsGo, i.toString()));
            this.chooseItems.push(chooseItem);
        }

        this.altas = this.elems.getElement('altas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
    }

    protected initListeners(): void {
        this.addClickListener(this.btnClose, this.onClickReturnBtn);
        this.addClickListener(this.elems.getElement('mask'), this.onClickReturnBtn);
        this.addClickListener(this.setViewMask, this.onClickSetViewMask);
        for (let i = 0; i < SiXiangData.TotalCnt; i++) {
            Game.UIClickListener.Get(this.items[i].btnSet).onClick = delegate(this, this.onClickBtnSet, i);
            Game.UIClickListener.Get(this.chooseItems[i].gameObject).onClick = delegate(this, this.onClickChooseItem, i);
        }
    }

    protected onOpen() {
        this.onSxdscActChange();
    }

    protected onClose() {
    }

    onSxdscActChange() {
        let siXiangData = G.DataMgr.siXiangData;
        let sxActInfo = siXiangData.sxActInfo;
        if (null == sxActInfo) {
            return;
        }

        let battleList = sxActInfo.m_astBattleSSList;
        let activatedCnt = siXiangData.getActivatedShenShouIds().length;
        for (let i = 0; i < SiXiangData.TotalCnt; i++) {
            let item = this.items[i];
            if (i < sxActInfo.m_ucSSCout) {
                let oneBattle = battleList[i];
                let stage = oneBattle.m_ucLevel;
                let exp = oneBattle.m_uiExp;
                let info = siXiangData.getShenShouInfo(oneBattle.m_ucType);
                if (null != info) {
                    stage = info.m_ucLevel;
                    exp = info.m_uiLayer;
                }
                let cfg = siXiangData.getCfg(oneBattle.m_ucType, stage);
                item.update(true, cfg, stage, SiXiangData.getFight(cfg, exp), this.altas, this.sortingOrder);
            } else {
                // 如果还有多的神兽就显示+号
                item.update(i == sxActInfo.m_ucSSCout && activatedCnt > sxActInfo.m_ucSSCout, null, 0, 0, null, 0);
            }
        }
    }

    ///////////////////////////////////////// 事件处理 /////////////////////////////////////////

    private onClickReturnBtn() {
        this.close();
    }

    private onClickBtnSet(index: number) {
        let siXiangData = G.DataMgr.siXiangData;
        let sxActInfo = siXiangData.sxActInfo;
        if (null == sxActInfo) {
            return;
        }

        let ssArr: number[] = [];
        let battleList = sxActInfo.m_astBattleSSList;
        for (let i = 0; i < SiXiangData.TotalCnt; i++) {
            let id = i + 1;
            let info = siXiangData.getShenShouInfo(id);
            let oldIdx = siXiangData.getShenShouBattleIndex(id);
            if (null != info && info.m_ucLevel > 0 && (oldIdx < 0 || (index < sxActInfo.m_ucSSCout && oldIdx != index))) {
                // 已激活且不是当前的
                ssArr.push(id);
            }
        }

        let cnt = ssArr.length;
        for (let i = 0; i < SiXiangData.TotalCnt; i++) {
            let item = this.chooseItems[i];
            if (i < cnt) {
                item.update(ssArr[i], this.altas);
            } else {
                item.update(0, null);
            }
        }

        this.crtSetIndex = index;
        this.setView.SetActive(true);
    }

    private onClickChooseItem(index: number) {
        let siXiangData = G.DataMgr.siXiangData;
        let sxActInfo = siXiangData.sxActInfo;
        if (null == sxActInfo) {
            return;
        }

        let battleList = sxActInfo.m_astBattleSSList;
        let out: Protocol.CSBattleSSList[] = [];
        for (let i = 0; i < sxActInfo.m_ucSSCout; i++) {
            let b = { m_ucType: battleList[i].m_ucType } as Protocol.CSBattleSSList;
            out.push(b);
        }

        let id = this.chooseItems[index].Id;
        if (this.crtSetIndex >= sxActInfo.m_ucSSCout) {
            // 这是新上阵的
            out.push({ m_ucType: id });
        } else {
            out[this.crtSetIndex].m_ucType = id;
            let oldIdx = siXiangData.getShenShouBattleIndex(id);
            if (oldIdx >= 0) {
                // 这是交换
                out[oldIdx].m_ucType = battleList[this.crtSetIndex].m_ucType;
            }
        }

        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_COLOSSEUM, Macros.COLOSSEUM_ACT_ON_BATTLE, out.length, out));
        this.setView.SetActive(false);
    }

    private onClickSetViewMask() {
        this.setView.SetActive(false);
    }
}
