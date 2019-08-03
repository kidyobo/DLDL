import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { UiElements } from 'System/uilib/UiElements'
import { EnumBwdhPage } from 'System/kfjdc/BiWuDaHuiPanel'
import { BuffData } from 'System/data/BuffData'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { BwdhBasePage } from 'System/kfjdc/view/BwdhBasePage'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { List, ListItem } from 'System/uilib/List'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ElemFinder } from 'System/uilib/UiUtility'
import { DataFormatter } from 'System/utils/DataFormatter'
import { UIRoleAvatar } from 'System/unit/avatar/UIRoleAvatar'
import { KfjdcData } from 'System/data/KfjdcData'
import { DropPlanData } from 'System/data/DropPlanData'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'

class BwdhChampionItem extends ListItemCtrl {

    private textDate: UnityEngine.UI.Text;
    private textName: UnityEngine.UI.Text;
    private textZdl: UnityEngine.UI.Text;

    private bg2: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.textDate = ElemFinder.findText(go, 'textDate');
        this.textName = ElemFinder.findText(go, 'textName');
        this.textZdl = ElemFinder.findText(go, 'textZdl');
        this.bg2 = ElemFinder.findObject(go, 'bg2');
    }

    update(info: Protocol.CSSingleSessionOne, index: number) {
        this.textDate.text = DataFormatter.second2yyyymmdd(info.m_uiTime, '{0}-{1}-{2}');
        this.textName.text = '' == info.m_szNickName ? '未产生' : info.m_szNickName;
        this.textZdl.text = info.m_uiFight.toString();
        this.bg2.SetActive(index % 2 == 1);
    }
}

export class BwdhChampionPage extends BwdhBasePage {

    protected textName: UnityEngine.UI.Text;
    protected textStage: UnityEngine.UI.Text;
    private avatarRoot: UnityEngine.Transform;
    private roleAvatar: UIRoleAvatar;
    private roleBg: UnityEngine.GameObject;

    private list: List;
    private items: BwdhChampionItem[] = [];

    private rewardList: List;

    private oldUin = 0;

    constructor() {
        super(EnumBwdhPage.Champion);
    }

    protected resPath(): string {
        return UIPathData.BwdhChampionPage;
    }

    protected initElements() {
        super.initElements();
        let role = this.elems.getElement('role');
        this.avatarRoot = ElemFinder.findTransform(role, 'avatarRoot');
        this.roleBg = ElemFinder.findObject(role, 'roleBg');
        this.textName = ElemFinder.findText(role, 'textName');
        this.textStage = ElemFinder.findText(role, 'stage/textStage');

        this.list = this.elems.getUIList('list');

        this.rewardList = this.elems.getUIList('rewardList');
        let cfg = G.DataMgr.kfjdcData.getFinalCfg(KeyWord.KFJDC_FINAL_PROGRESS_1VS2);
        let dropCfg = DropPlanData.getDropPlanConfig(cfg.m_iWinReward);
        this.rewardList.Count = dropCfg.m_ucDropThingNumber;
        for (let i = 0; i < dropCfg.m_ucDropThingNumber; i++) {
            let iconItem = new IconItem();
            iconItem.setUsuallyIcon(this.rewardList.GetItem(i).gameObject);
            iconItem.setTipFrom(TipFrom.normal);
            iconItem.updateByDropThingCfg(dropCfg.m_astDropThing[i]);
            iconItem.updateIcon();
        }
    }

    protected onOpen() {
        super.onOpen();
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getCrossSingleNotifyRequest(Macros.CROSS_SINGLE_SESSION_OPEN));
    }

    protected onClose() {
        this.oldUin = 0;
        if (null != this.roleAvatar) {
            this.roleAvatar.setActive(false);
        }
    }

    onActDataChange(activityID: number) {
    }

    onBiWuDaHuiChange(opType: number) {
        let data = G.DataMgr.kfjdcData.m_oldChampionData;
        let listCnt = 0;
        if (data) {
            listCnt = data.m_iCount;
        }
        this.list.Count = listCnt;
        let oldItemCnt = this.items.length;
        for (let i = 0; i < listCnt; i++) {
            let item: BwdhChampionItem;
            if (i < oldItemCnt) {
                item = this.items[i];
            } else {
                this.items[i] = item = new BwdhChampionItem();
                item.setComponents(this.list.GetItem(i).gameObject);
            }
            item.update(data.m_stList[listCnt - 1 - i], i);
        }

        let dataFianl = G.DataMgr.kfjdcData.m_finalData;
        let champoinInfo: Protocol.CliSimSingleOneRank;
        if (dataFianl) {
            let gameInfo = dataFianl.m_stGameInfo.m_stGameList[31];
            if (gameInfo) {
                if (gameInfo.m_ucLeftStatus == Macros.KFJDC_FINAL_PLAYER_WIN) {
                    champoinInfo = gameInfo.m_stLeftRole;
                }
                else if (gameInfo.m_ucRightStatus == Macros.KFJDC_FINAL_PLAYER_WIN) {
                    champoinInfo = gameInfo.m_stRightRole;
                }
            }
        }

        if (champoinInfo) {
            this.textName.text = champoinInfo.m_szNickName;
            this.textStage.text = KfjdcData.getRankDesc(champoinInfo.m_uiGrade, champoinInfo.m_uiScore);
            if (null == this.roleAvatar) {
                this.roleAvatar = new UIRoleAvatar(this.avatarRoot, this.avatarRoot);
            }

            if (this.oldUin != champoinInfo.m_stRoleId.m_uiUin) {
                this.oldUin = champoinInfo.m_stRoleId.m_uiUin;
                this.roleAvatar.setAvataByList(champoinInfo.m_stAvatar, champoinInfo.m_ucProf, champoinInfo.m_ucGender);
                this.roleAvatar.m_rebirthMesh.setRotation(8, 0, 0);
            }
            this.roleAvatar.setSortingOrder(this.sortingOrder);
            this.roleAvatar.setActive(true);
            this.roleBg.SetActive(false);
        } else {
            this.textName.text = '';
            this.textStage.text = '虚位以待';
            this.oldUin = 0;
            if (null != this.roleAvatar) {
                this.roleAvatar.setActive(false);
            }
        }
    }
}