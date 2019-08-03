import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { SystemSettingView } from 'System/setting/SystemSettingView'
import { DataFormatter } from 'System/utils/DataFormatter'
import { KeyWord } from 'System/constants/KeyWord'
import { Color } from 'System/utils/ColorUtil'
import { List, ListItem } from 'System/uilib/List'
import { IconItem } from 'System/uilib/IconItem'
import { ThingData } from 'System/data/thing/ThingData'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { EnumGuide } from 'System/constants/GameEnum'
import { TipFrom } from 'System/tip/view/TipsView'

export class GuaJiRewardView extends CommonForm {
    private readonly maxShowEquipCount = 4;
    private readonly maxUseTime = 20 * 60 * 60;
    private time: UnityEngine.UI.Text;
    private lastLevel: UnityEngine.UI.Text;
    private toLevelArraw: UnityEngine.GameObject;
    private level: UnityEngine.UI.Text;
    private exp: UnityEngine.UI.Text;
    private textYinLiang: UnityEngine.UI.Text;

    private list: List;

    private equipIconItems: IconItem[] = [];

    private mask: UnityEngine.GameObject;

    private openInfo: Protocol.CSOffGuajiInfo;

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.GuaJiRewardView;
    }

    protected initElements(): void {
        this.time = this.elems.getText('time');
        this.lastLevel = this.elems.getText('lastLevel');
        this.toLevelArraw = this.elems.getElement('toLevelArraw');
        this.level = this.elems.getText('level');
        this.exp = this.elems.getText('exp');
        this.textYinLiang = this.elems.getText('textYinLiang');
        this.mask = this.elems.getElement("mask");

        this.list = this.elems.getUIList("list");
    }

    protected initListeners(): void {
        this.addClickListener(this.mask, this.OnClickClose);
        this.addClickListener(this.getElement('btnClose'), this.OnClickClose);
    }

    protected onOpen() {
        //超过20小时，显示20
        if (this.openInfo.m_iUseTime > this.maxUseTime) {
            this.openInfo.m_iUseTime = this.maxUseTime;
            this.openInfo.m_iEnableTime = 0;
        }
        this.time.text = uts.format('{0}（剩余{1}）', DataFormatter.second2day(this.openInfo.m_iUseTime, true, true), DataFormatter.second2day(this.openInfo.m_iEnableTime, true, true));
        this.lastLevel.text = (G.DataMgr.heroData.level - this.openInfo.m_iLevelGet).toString();
        this.showLevel(this.openInfo.m_iLevelGet > 0);
        this.level.text = G.DataMgr.heroData.level.toString();
        this.exp.text = DataFormatter.cutWan(this.openInfo.m_iExpGet, 0);
        this.textYinLiang.text = DataFormatter.cutWan(this.openInfo.m_iTongqianGet);

        let ids: number[] = [];
        let id2cntMap: { [id: number]: number } = {};
        let equipStat = this.openInfo.m_stEquipStat;
        if (equipStat != null) {
            for (let e of equipStat) {
                let oldItemCnt = 0;
                if (e.m_iItemID in id2cntMap) {
                    oldItemCnt = id2cntMap[e.m_iItemID];
                } else {
                    ids.push(e.m_iItemID);
                }
                id2cntMap[e.m_iItemID] = e.m_iCount + oldItemCnt;
            }
        } 

        let count = ids.length;
        this.list.Count = count;

        for (let i = 0; i < count; i++) {
            let iconItem = this.equipIconItems[i];
            if (iconItem == null) {
                this.equipIconItems[i] = iconItem = new IconItem();
                iconItem.setUsuallyIcon(this.list.GetItem(i).gameObject);
                iconItem.setTipFrom(TipFrom.normal);
            }
            let id = ids[i];
            iconItem.updateById(id, id2cntMap[id]);
            iconItem.updateIcon();
        }

        G.GuideMgr.processGuideNext(EnumGuide.LiXianGuaJiStat, EnumGuide.LiXianGuaJiStat_OpenView);
    }

    protected onClose() {
        this.openInfo = null;
        G.GuideMgr.processGuideNext(EnumGuide.LiXianGuaJiStat, EnumGuide.GuideCommon_None);
    }

    open(info: Protocol.CSOffGuajiInfo) {
        this.openInfo = info;
        super.open();
    }

    private onCloseView() {
        this.close();
    }

    private onOpenSettingView() {
        // 必须先打开别人，再关闭自己，否则会跟新手指引冲突，因为新手指引会监听面板关闭然后恢复指引
        G.Uimgr.createForm<SystemSettingView>(SystemSettingView).open();
        this.close();
    }

    private showLevel(show: boolean) {
        this.level.gameObject.SetActive(show);
        this.toLevelArraw.SetActive(show);
    }

    private OnClickClose() {
        this.close();
    }
}