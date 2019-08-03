import { Global as G } from 'System/global'
import { UIPathData } from 'System/data/UIPathData'
import { UiElements } from 'System/uilib/UiElements'
import { EnumBwdhPage } from 'System/kfjdc/BiWuDaHuiPanel'
import { BuffData } from 'System/data/BuffData'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { ElemFinder } from 'System/uilib/UiUtility'
import { BwdhBasePage } from 'System/kfjdc/view/BwdhBasePage'
import { BwdhSupportView } from 'System/kfjdc/view/BwdhSupportView'
import { BwdhRoleItem } from 'System/kfjdc/view/BwdhRoleItem'
import { BwdhVsItem } from 'System/kfjdc/view/BwdhVsItem'
import { UIRoleAvatar } from 'System/unit/avatar/UIRoleAvatar'
import { KfjdcData } from 'System/data/KfjdcData'
import { EnumDurationType } from 'System/constants/GameEnum'

class BwdhFinalRoleItem extends BwdhRoleItem {
    private avatarRoot: UnityEngine.Transform;
    private roleAvatar: UIRoleAvatar;
    private roleBg: UnityEngine.GameObject;

    private oldUin = 0;

    setComponents(go: UnityEngine.GameObject, flag: UnityEngine.UI.Image) {
        super.setComponents(go);
        this.avatarRoot = ElemFinder.findTransform(go, 'avatarRoot');
        this.flag = flag;
        this.roleBg = ElemFinder.findObject(go, 'roleBg');
        this.textPopularity = ElemFinder.findText(go, 'popular/textPopularity');
    }

    update(gameId: number, isCrtProgress: boolean, durationType: EnumDurationType, someoneNone: boolean, resultComeout: boolean, roleInfo: Protocol.CliSimSingleOneRank, betInfo: Protocol.CSKFJDCBetInfo, betOnThis: boolean, status: number, betMoney: number, poolBaseMoney: number, headAltas: Game.UGUIAltas, statusAltas: Game.UGUIAltas, sortingOrder: number) {
        super.update(gameId, isCrtProgress, durationType, someoneNone, resultComeout, roleInfo, betInfo, betOnThis, status, betMoney, poolBaseMoney, headAltas, statusAltas, sortingOrder);
        if (null == roleInfo || roleInfo.m_stRoleId.m_uiUin == 0) {
            // 轮空
            this.oldUin = 0;
            if (null != this.roleAvatar) {
                this.roleAvatar.setActive(false);
            }
        } else {
            if (null == this.roleAvatar) {
                this.roleAvatar = new UIRoleAvatar(this.avatarRoot, this.avatarRoot);
            }

            if (this.oldUin != roleInfo.m_stRoleId.m_uiUin) {
                this.oldUin = roleInfo.m_stRoleId.m_uiUin;
                this.roleAvatar.setAvataByList(roleInfo.m_stAvatar, roleInfo.m_ucProf, roleInfo.m_ucGender);
                this.roleAvatar.m_rebirthMesh.setRotation(15, 0, 0);
                Game.Tools.SetGameObjectLocalScale(this.roleAvatar.avatarRoot.gameObject,100, 100,100);
            }
            this.roleAvatar.setSortingOrder(sortingOrder);
            this.roleAvatar.setActive(true);
            this.roleBg.SetActive(false);
        }
    }

    destroyAvatar() {
        this.oldUin = 0;
        if (null != this.roleAvatar) {
            this.roleAvatar.destroy();
            this.roleAvatar = null;
        }
    }
}

class BwdhFinalItem extends BwdhVsItem {

    private leftRole = new BwdhFinalRoleItem(1, true);
    private rightRole = new BwdhFinalRoleItem(0, true);

    setComponents(go: UnityEngine.GameObject, leftFlag: UnityEngine.UI.Image, rightFlag: UnityEngine.UI.Image, btnGo: UnityEngine.GameObject) {
        this.left = this.leftRole;
        this.right = this.rightRole;
        this.leftRole.setComponents(ElemFinder.findObject(go, 'left'), leftFlag);
        this.rightRole.setComponents(ElemFinder.findObject(go, 'right'), rightFlag);

        this.btnGo = btnGo;
        this.labelBtnGo = ElemFinder.findText(this.btnGo, 'Text');

        Game.UIClickListener.Get(this.btnGo).onClick = delegate(this, this.onClickBtnGo);
    }

    destroyAvatars() {
        this.leftRole.destroyAvatar();
        this.rightRole.destroyAvatar();
    }
}

export class BwdhCurrentFinalPage extends BwdhBasePage {

    private textName: UnityEngine.UI.Text;
    private vsItem = new BwdhFinalItem();

    private statusAltas: Game.UGUIAltas;

    constructor() {
        super(EnumBwdhPage.Current_Final);
    }

    protected resPath(): string {
        return UIPathData.BwdhFinalPage;
    }

    protected initElements() {
        super.initElements();

        this.textName = this.elems.getText('textName');
        this.vsItem.setComponents(this.form, this.elems.getImage('leftFlag'), this.elems.getImage('rightFlag'), this.elems.getElement('btnGo'));
        this.statusAltas = this.elems.getElement('statusAltas').GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
    }

    protected onClose() {
        this.vsItem.destroyAvatars();
    }

    onActDataChange(activityID: number) {
    }

    onBiWuDaHuiChange(opType: number) {
        let kfjdcData = G.DataMgr.kfjdcData;
        let finalData = kfjdcData.m_finalData;
        if (finalData) {
            let gameData = finalData.m_stGameInfo;

            let showProgress = gameData.m_iProgress;
            let now = Math.floor(G.SyncTime.getCurrentTime() / 1000);
            if (0 == showProgress && now > gameData.m_uiEndTime) {
                showProgress = KeyWord.KFJDC_FINAL_PROGRESS_1VS2;
            }
            let progressSeq = KfjdcData.ProgressSeq.indexOf(showProgress);
            this.textName.text = KfjdcData.ProgressDesc[progressSeq];
            let idx = KfjdcData.ProgressStart[progressSeq];

            let gameInfo: Protocol.CSKFJDCFinalGame;
            if (idx >= 0) {
                gameInfo = gameData.m_stGameList[idx];
            }

            let isActivityOpen = G.DataMgr.activityData.isActivityOpen(Macros.ACTIVITY_ID_PVP_FINAL);
            let headAltas = G.AltasManager.roleHeadAltas;

            if (gameInfo) {
                this.vsItem.update(0, gameInfo, kfjdcData.getBetInfoByGameId(gameInfo.m_iGameID), showProgress, showProgress, gameData.m_uiStartTime, gameData.m_uiEndTime, isActivityOpen, headAltas, this.statusAltas, this.sortingOrder);
            } else {
                this.vsItem.update(0, null, null, showProgress, showProgress, gameData.m_uiStartTime, gameData.m_uiEndTime, isActivityOpen, headAltas, this.statusAltas, this.sortingOrder);
            }
        }
    }
}