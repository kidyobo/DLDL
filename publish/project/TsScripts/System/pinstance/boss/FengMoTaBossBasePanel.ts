import { Global as G } from 'System/global'
import { BossBasePanel, CtrlBossBtnGoStrategy } from 'System/pinstance/boss/BossBasePanel'
import { UIPathData } from 'System/data/UIPathData'
import { UiElements } from 'System/uilib/UiElements'
import { KeyWord } from 'System/constants/KeyWord'
import { Macros } from 'System/protocol/Macros'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { ConfirmCheck, MessageBoxConst } from 'System/tip/TipManager'
import { PinstanceData } from 'System/data/PinstanceData'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { BossRecordView } from 'System/pinstance/boss/BossRecordView'

export abstract class FengMoTaBossBasePanel extends BossBasePanel {

    constructor(id: number, needRecord: boolean) {
        super(id, needRecord, true, 0, Macros.ACTIVITY_ID_BFXYACT, CtrlBossBtnGoStrategy.SceneLv);
    }

    protected initElements() {
        super.initElements();

        // boss列表
        this.initBossData();
        let bossCnt = this.bossListDatas.length;
        this.list.Count = bossCnt;
    }

    protected onOpen() {
        super.onOpen();
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_BFXYACT, Macros.ACTIVITY_FMT_LIST));

        this.updateView();
    }

    updateView() {
        let selectIndex: number = this.handChoice;
        // 刷新boss状态
        let bossCnt = this.bossListDatas.length;
        for (let i: number = 0; i < bossCnt; i++) {
            let itemData = this.bossListDatas[i];
            let bossInfo = G.DataMgr.fmtData.getBossOneInfo(this.bossListDatas[i].bossId);
            if (null != bossInfo) {
                itemData.isDead = bossInfo.m_ucIsDead != 0;
                itemData.refreshTime = bossInfo.m_uiFreshTime;
            } else {
                itemData.isDead = false;
                itemData.refreshTime = 0;
            }
        }
        this.updateBossList();
    }

    protected abstract initBossData();
    protected abstract onBtnGoClick();
}