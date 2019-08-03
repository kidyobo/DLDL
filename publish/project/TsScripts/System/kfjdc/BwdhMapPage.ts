import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { UiElements } from 'System/uilib/UiElements'
import { EnumBwdhPage } from 'System/kfjdc/BiWuDaHuiPanel'
import { BuffData } from 'System/data/BuffData'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { ElemFinder } from 'System/uilib/UiUtility'
import { BwdhBasePage } from 'System/kfjdc/view/BwdhBasePage'
import { UIUtils } from 'System/utils/UIUtils'

class BwdhMapItem extends ListItemCtrl {
    private textName: UnityEngine.UI.Text;
    private gameObject: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;
        this.textName = ElemFinder.findText(go, 'textName');
    }

    update(gameInfo: Protocol.CliSimSingleOneRank, status: number) {
        if (gameInfo) {
            this.textName.text = gameInfo.m_szNickName;
            UIUtils.setGrey(this.gameObject, Macros.KFJDC_FINAL_PLAYER_LOST == status, false, false);
        } else {
            this.textName.text = '';
            UIUtils.setGrey(this.gameObject, false, false, false);
        }
    }
}

export class BwdhMapPage extends BwdhBasePage {

    private items32: BwdhMapItem[] = [];
    private items16: BwdhMapItem[] = [];
    private items8: BwdhMapItem[] = [];
    private items4: BwdhMapItem[] = [];
    private items2: BwdhMapItem[] = [];
    private champion = new BwdhMapItem();

    constructor() {
        super(EnumBwdhPage.Map);
    }

    protected resPath(): string {
        return UIPathData.BwdhMapPage;
    }

    protected initElements() {
        let blockTmpl = this.elems.getElement('item');
        let item = new BwdhMapItem();
        item.setComponents(blockTmpl);
        this.items2.push(item);

        let list32 = this.elems.getTransform('list32');
        this.initBlocks(blockTmpl, list32, 32, this.items32);

        let list16 = this.elems.getTransform('list16');
        this.initBlocks(blockTmpl, list16, 16, this.items16);

        let list8 = this.elems.getTransform('list8');
        this.initBlocks(blockTmpl, list8, 8, this.items8);

        let list4 = this.elems.getTransform('list4');
        this.initBlocks(blockTmpl, list4, 4, this.items4);

        let list2 = this.elems.getTransform('list2');
        this.initBlocks(blockTmpl, list2, 1, this.items2);

        this.champion.setComponents(this.elems.getElement('champion'));

        let line8l = this.elems.getTransform('line8l');
        this.initTransitions(line8l, 8);

        let line4l = this.elems.getTransform('line4l');
        this.initTransitions(line4l, 4);

        let line2l = this.elems.getTransform('line2l');
        this.initTransitions(line2l, 2);

        let line8r = this.elems.getTransform('line8r');
        this.initTransitions(line8r, 8);

        let line4r = this.elems.getTransform('line4r');
        this.initTransitions(line4r, 4);

        let line2r = this.elems.getTransform('line2r');
        this.initTransitions(line2r, 2);
    }

    private initBlocks(blockTmpl: UnityEngine.GameObject, trans: UnityEngine.Transform, count: number, items: BwdhMapItem[]) {
        for (let i = 0; i < count; i++) {
            let itemGo = UnityEngine.UnityObject.Instantiate(blockTmpl, trans, false) as UnityEngine.GameObject;
            let item = new BwdhMapItem();
            item.setComponents(itemGo);
            items.push(item);
        }
    }

    private initTransitions(trans: UnityEngine.Transform, count: number) {
        let tmpl = trans.GetChild(0).gameObject;
        for (let i = 0; i < count - 1; i++) {
            UnityEngine.UnityObject.Instantiate(tmpl, trans, false) as UnityEngine.GameObject;
        }
    }

    onActDataChange(activityID: number) {
    }

    onBiWuDaHuiChange(opType: number) {
        let kfjdcData = G.DataMgr.kfjdcData;
        let finalData = kfjdcData.m_finalData;
        if (finalData) {
            let games = finalData.m_stGameInfo.m_stGameList;
            // 16强
            for (let i = 0; i < 16; i++) {
                let gameInfo = games[i];
                let left = this.items32[i * 2];
                let right = this.items32[i * 2 + 1];
                if (gameInfo) {
                    left.update(gameInfo.m_stLeftRole, gameInfo.m_ucLeftStatus);
                    right.update(gameInfo.m_stRightRole, gameInfo.m_ucRightStatus);
                } else {
                    left.update(null, 0);
                    right.update(null, 0);
                }
            }
            // 8强
            for (let i = 16; i < 24; i++) {
                let gameInfo = games[i];
                let left = this.items16[i * 2 - 32];
                let right = this.items16[i * 2 - 31];
                if (gameInfo) {
                    left.update(gameInfo.m_stLeftRole, gameInfo.m_ucLeftStatus);
                    right.update(gameInfo.m_stRightRole, gameInfo.m_ucRightStatus);
                } else {
                    left.update(null, 0);
                    right.update(null, 0);
                }
            }
            // 4强
            for (let i = 24; i < 28; i++) {
                let gameInfo = games[i];
                let left = this.items8[i * 2 - 48];
                let right = this.items8[i * 2 - 47];
                if (gameInfo) {
                    left.update(gameInfo.m_stLeftRole, gameInfo.m_ucLeftStatus);
                    right.update(gameInfo.m_stRightRole, gameInfo.m_ucRightStatus);
                } else {
                    left.update(null, 0);
                    right.update(null, 0);
                }
            }
            // 2强
            for (let i = 28; i < 30; i++) {
                let gameInfo = games[i];
                let left = this.items4[i * 2 - 56];
                let right = this.items4[i * 2 - 55];
                if (gameInfo) {
                    left.update(gameInfo.m_stLeftRole, gameInfo.m_ucLeftStatus);
                    right.update(gameInfo.m_stRightRole, gameInfo.m_ucRightStatus);
                } else {
                    left.update(null, 0);
                    right.update(null, 0);
                }
            }
            // 冠军赛
            let gameInfo = games[31];
            let left = this.items2[0];
            let right = this.items2[1];
            if (gameInfo) {
                left.update(gameInfo.m_stLeftRole, gameInfo.m_ucLeftStatus);
                right.update(gameInfo.m_stRightRole, gameInfo.m_ucRightStatus);

                // 赢的是冠军
                if (Macros.KFJDC_FINAL_PLAYER_WIN == gameInfo.m_ucLeftStatus) {
                    this.champion.update(gameInfo.m_stLeftRole, gameInfo.m_ucLeftStatus);
                } else if (Macros.KFJDC_FINAL_PLAYER_WIN == gameInfo.m_ucRightStatus) {
                    this.champion.update(gameInfo.m_stRightRole, gameInfo.m_ucRightStatus);
                } else {
                    this.champion.update(null, 0);
                }
            } else {
                left.update(null, 0);
                right.update(null, 0);
                this.champion.update(null, 0);
            }
        }
    }
}