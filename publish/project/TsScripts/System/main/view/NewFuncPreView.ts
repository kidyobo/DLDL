import { CommonForm, UILayer, GameObjectGetSet, TextGetSet } from "System/uilib/CommonForm"
import { Global as G } from "System/global"
import { UIPathData } from "System/data/UIPathData"
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { Color } from 'System/utils/ColorUtil'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from "System/uilib/List"
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { EnumEffectRule, EnumRewardState, GameIDType } from "System/constants/GameEnum";
class NewFuncItem {
    private bg: GameObjectGetSet;
    private icon: UnityEngine.UI.Image;
    private level: TextGetSet;
    private funcName: TextGetSet;
    private desc: TextGetSet;
    private iconroot: GameObjectGetSet;
    private iconitem: IconItem;
    private canget: GameObjectGetSet;
    private isget: GameObjectGetSet;
    private cfg: GameConfig.NPCFunctionPreviewM;
    setComponent(obj: UnityEngine.GameObject, itemIcon_Normal: UnityEngine.GameObject) {
        this.bg = new GameObjectGetSet(ElemFinder.findObject(obj,"bg"));
        this.icon = ElemFinder.findImage(obj, "bg/icon");
        this.level = new TextGetSet(ElemFinder.findText(obj, "level"));
        this.funcName = new TextGetSet(ElemFinder.findText(obj, "bg/icon/funcName"));
        this.desc = new TextGetSet(ElemFinder.findText(obj, "desc"));
        this.iconroot = new GameObjectGetSet(ElemFinder.findObject(obj, "icon"));
        this.iconitem = new IconItem();
        this.iconitem.setUsualIconByPrefab(itemIcon_Normal, this.iconroot.gameObject);
        this.iconitem.setTipFrom(TipFrom.normal);
        this.canget = new GameObjectGetSet(ElemFinder.findObject(obj, "canget"));
        this.isget = new GameObjectGetSet(ElemFinder.findObject(obj, "isget"));
        this.iconitem.m_effectRule = EnumEffectRule.none;
        Game.UIClickListener.Get(this.canget.gameObject).onClick = delegate(this, this.onGet);
    }
    private onGet() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getPreviewRewardRequest(this.cfg.m_iFunctionName));
    }
    update(cfg: GameConfig.NPCFunctionPreviewM) {
        this.cfg = cfg;
        let checkLevel = G.DataMgr.heroData.level;
        let sprite = G.AltasManager.getActIcon(cfg.m_iFunctionName);
        if (null == sprite) {
            // 看看父功能有木有图标
            let funcCfg = G.DataMgr.funcLimitData.getFuncLimitConfig(cfg.m_iFunctionName);
            if (funcCfg.m_iParentName > 0) {
                if (funcCfg.m_iParentName > 0) {
                    if (funcCfg.m_iParentName == 541) {//boss大图标的话,要换成bossFuncIcon
                        sprite = G.AltasManager.getActIconByName("bossFuncIcon");
                    } else {
                        sprite = G.AltasManager.getActIcon(funcCfg.m_iParentName);
                    }
                }
            }
        }
        this.icon.sprite = sprite;
        this.funcName.text = cfg.m_szName;
        this.level.text = uts.format("{0}级开启", cfg.m_iLevel);
        if (cfg.m_iItemID > 0) {
            this.desc.text = "";
            this.iconitem.updateById(cfg.m_iItemID, cfg.m_iItemCount);
            this.iconitem.updateIcon();
            this.iconroot.SetActive(true);
        }
        else {
            this.desc.text = cfg.m_szDesc;
            this.iconroot.SetActive(false);
        }
        this.bg.grey = this.iconroot.grey = (checkLevel < cfg.m_iLevel);
        let info = G.DataMgr.activityData.m_stPreviewRewardInfo;
        if (cfg.m_iItemID>0&&info && checkLevel >= cfg.m_iLevel) {
            if (info.m_stRewardList.indexOf(cfg.m_iFunctionName) > -1) {
                this.canget.SetActive(false);
                this.isget.SetActive(true);
            }
            else {
                this.canget.SetActive(true);
                this.isget.SetActive(false);
            }
        }
        else {
            this.canget.SetActive(false);
            this.isget.SetActive(false);
        }
    }
}
export class NewFuncPreView extends CommonForm {
    private list: List;
    private datalist: GameConfig.NPCFunctionPreviewM[];
    private itemIcon_Normal: UnityEngine.GameObject;
    private curIndex = 0;
    constructor() {
        super(0);
        this._cacheForm = true;
    }
    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.NewFuncPreView;
    }

    protected initElements(): void {
        this.list = this.elems.getUIList("list");
        this.list.onVirtualItemChange = delegate(this, this.onItemUpdate);
        this.datalist = G.DataMgr.newFuncPreData.list;
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
    }

    protected initListeners(): void {
      //  this.addClickListener(this.elems.getElement("btnReturn"), this.onBtnReturn);
        this.addClickListener(this.elems.getElement("mask"), this.onBtnReturn);
    }

    protected onOpen() {
        let checkLevel = G.DataMgr.heroData.level;
        let cfg = G.DataMgr.newFuncPreData.getCurLevelSuitConfig(checkLevel);
        if (cfg) {
            this.curIndex = this.datalist.indexOf(cfg);
            this.list.ScrollByAxialRow(Math.max(this.curIndex - 2, 0));
        }
        else {
            this.list.ScrollBottom();
            this.curIndex = -1;
        }
        this.updateView();
    }

    public updateView() {
        //刷新整个list
        this.list.Count = this.datalist.length;
        this.list.Refresh();
    }
    private onItemUpdate(item: ListItem) {
        let cfg = this.datalist[item._index];
        let data = item.data.data as NewFuncItem;
        if (!data) {
            data = item.data.data = new NewFuncItem();
            data.setComponent(item.gameObject, this.itemIcon_Normal);
        }
        data.update(cfg);
    }

    private onBtnReturn() {
        this.close();
    }
}