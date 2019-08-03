import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { KeyWord } from 'System/constants/KeyWord'
import { UiElements } from "System/uilib/UiElements"
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { ElemFinder } from 'System/uilib/UiUtility'
import { UIUtils } from 'System/utils/UIUtils'

class PkModeItem {
    private gameObject: UnityEngine.GameObject;
    private selected: UnityEngine.GameObject;

    private view: PkModeView;
    index = 0;

    constructor(view: PkModeView) {
        this.view = view;
    }

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;
        this.selected = ElemFinder.findObject(go, 'selected');
        Game.UIClickListener.Get(go).onClick = delegate(this, this.onClickItem);
    }

    setState(selected: boolean, enabled: boolean) {
        this.selected.SetActive(selected);
        UIUtils.setButtonClickAble(this.gameObject, enabled);
    }

    private onClickItem() {
        this.view.onClickItem(this.index);
    }
}

export class PkModeView extends CommonForm {

    static readonly PK_MODES: number[] = [Macros.PK_STATUS_PEACE, Macros.PK_STATUS_TEAM, Macros.PK_STATUS_GUILD, Macros.PK_STATUS_ALL, Macros.PK_STATUS_EVIL];
    static readonly PK_MODE_DESCS: string[] = ['和平模式', '队伍模式', '宗门模式', '全体模式', '善恶模式'];

    private items: PkModeItem[] = [];
    private mask: UnityEngine.GameObject;

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.PkModeView;
    }

    protected initElements(): void {
        let cnt = PkModeView.PK_MODES.length;
        for (let i = 0; i < cnt; i++) {
            let item = new PkModeItem(this);
            item.index = i;
            let itemGo = this.elems.getElement('m' + i);
            item.setComponents(itemGo);
            this.items.push(item);
        }
        this.mask = this.elems.getElement('mask');
    }

    protected initListeners(): void {
        this.addClickListener(this.mask, this.onClickMask);
    }

    protected onOpen() {
        let sceneData = G.DataMgr.sceneData;
        let mode = G.DataMgr.heroData.pkMode;
        let cnt = this.items.length;
        for (let i = 0; i < cnt; i++) {
            this.items[i].setState(PkModeView.PK_MODES[i] == mode, Macros.PK_STATUS_PEACE != PkModeView.PK_MODES[i] || KeyWord.PVP_FREEDOM != sceneData.getSceneInfo(sceneData.curSceneID).config.m_iPVPModel);
        }
    }

    protected onClose() {
        G.DataMgr.settingData.writeSetting();
        G.ModuleMgr.deputyModule.save();
    }

    onClickItem(index: number) {
        if (index >= 0 && index < PkModeView.PK_MODES.length) {
            // 得到当前选择的模式
            let mode: number = PkModeView.PK_MODES[index];
            let sceneData = G.DataMgr.sceneData;
            //多人boss特殊限制 第一层只能是和平
            if (sceneData.curPinstanceID == 300100 && sceneData.curPinstanceIndex == 0) {
                if (index == 0) return;
                G.TipMgr.addMainFloatTip(uts.format('当前场景无法切换到{0}', PkModeView.PK_MODE_DESCS[index]));
                return;
            }
            if (Macros.PK_STATUS_PEACE == mode && KeyWord.PVP_FREEDOM == sceneData.getSceneInfo(sceneData.curSceneID).config.m_iPVPModel) {
                G.TipMgr.addMainFloatTip(uts.format('当前场景无法切换到{0}', PkModeView.PK_MODE_DESCS[index]));
                return;
            }
            G.TipMgr.addMainFloatTip(uts.format('您当前处于{0}，敬请留意！', PkModeView.PK_MODE_DESCS[index]));
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getChangePkModeRequest(PkModeView.PK_MODES[index]));
        }

        // 选完后自己关闭
        this.close();
    }

    private onClickMask() {
        this.close();
    }
}