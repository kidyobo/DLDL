import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { UiElements } from 'System/uilib/UiElements'
import { KfhdBasePanel } from 'System/activity/kfhd/KfhdBasePanel'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { DropPlanData } from 'System/data/DropPlanData'
import { IconItem } from 'System/uilib/IconItem'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { DataFormatter } from 'System/utils/DataFormatter'
import { Color } from 'System/utils/ColorUtil'
import { TipFrom } from 'System/tip/view/TipsView'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { SyncTime } from 'System/net/SyncTime'

export class KfhdZongMenZhengBaPanel extends KfhdBasePanel {

    private readonly dropMaster = 60010026;
    private readonly dropMembers = 60010025;

    private textTime: UnityEngine.UI.Text;
    private textDesc: UnityEngine.UI.Text;

    private listMaster: List;
    private listMembers: List;

    constructor() {
        super(KeyWord.OTHER_FUNCTION_ZPQYH);
    }

    protected resPath(): string {
        return UIPathData.KfhdZongMenZhengBaView;
    }

    protected initElements() {
        this.textTime = this.elems.getText('textTime');
        this.textDesc = this.elems.getText('textDesc');

        this.listMaster = this.elems.getUIList('listMaster');
        this.listMembers = this.elems.getUIList('listMembers');

        this.textDesc.text = G.DataMgr.langData.getLang(80);
        this.setRewards(this.listMaster, this.dropMaster);
        this.setRewards(this.listMembers, this.dropMembers);
    }

    protected initListeners() {
    }

    protected onOpen() {
        this.textTime.text  = G.DataMgr.langData.getLang(91, DataFormatter.second2yyyymmdd(G.SyncTime.m_uiServerStartTime + 86400));
    }

    protected onClose() {
    }

    private setRewards(list: List, dropId: number) {
        let cfg = DropPlanData.getDropPlanConfig(dropId);
        list.Count = cfg.m_ucDropThingNumber;
        for (let i = 0; i < cfg.m_ucDropThingNumber; i++) {
            let iconItem = new IconItem();
            iconItem.setTipFrom(TipFrom.normal);
            iconItem.setUsuallyIcon(list.GetItem(i).gameObject);
            iconItem.updateByDropThingCfg(cfg.m_astDropThing[i]);
            iconItem.updateIcon();
        }
    }

    onServerOverDay() {

    }
}