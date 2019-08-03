import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { IconItem } from 'System/uilib/IconItem'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { TipFrom } from 'System/tip/view/TipsView'
import { RewardIconItemData } from 'System/data/vo/RewardIconItemData'
import { CompareUtil } from 'System/utils/CompareUtil'
import { Constants } from 'System/constants/Constants'
import { PetData } from 'System/data/pet/PetData'
import { ExpeditionPetOne } from 'System/data/pet/PetExpeditionData'
import { PetExpeditionItem } from 'System/pet/expedition/PetExpeditionBaseLogic'

class ExpeditionRankItem extends ListItemCtrl {
    private item: PetExpeditionItem;

    private textName: UnityEngine.UI.Text;
    private textPetName: UnityEngine.UI.Text;
    private textHurt: UnityEngine.UI.Text;
    private textBeHurted: UnityEngine.UI.Text;

    private bg2: UnityEngine.GameObject;

    gameObject: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;
        this.item = new PetExpeditionItem();
        this.item.setComponents(ElemFinder.findObject(go, 'pet'));

        this.textName = ElemFinder.findText(go, 'textName');
        this.textPetName = ElemFinder.findText(go, 'textPetName');

        this.textHurt = ElemFinder.findText(go, 'textHurt');
        this.textBeHurted = ElemFinder.findText(go, 'textBeHurted');
        this.bg2 = ElemFinder.findObject(go, 'bg2');
    }

    update(index: number, info: Protocol.SceneInfoResultWYYZPet, petOne: ExpeditionPetOne, masterName: string) {
        if (null != info) {
            this.item.update(petOne, true);
            this.item.gameObject.SetActive(true);

            this.textName.text = masterName;
            let petCfg = PetData.getPetConfigByPetID(info.m_iPetID);
            let n = petCfg.m_szBeautyName;
            if (petOne.feiSheng > 0) {
                n += uts.format("({0}转)", petOne.feiSheng);
            }
            this.textPetName.text = n;

            this.textHurt.text = info.m_iHurt.toString();
            this.textBeHurted.text = info.m_iBeHurt.toString();

            this.textName.gameObject.SetActive(true);
            this.textPetName.gameObject.SetActive(true);
            this.textHurt.gameObject.SetActive(true);
            this.textBeHurted.gameObject.SetActive(true);
        } else {
            this.item.update(null, false);
            this.item.gameObject.SetActive(false);

            this.textName.gameObject.SetActive(false);
            this.textPetName.gameObject.SetActive(false);
            this.textHurt.gameObject.SetActive(false);
            this.textBeHurted.gameObject.SetActive(false);
        }

        if (null != this.bg2) {
            this.bg2.SetActive(index % 2 == 0);
        }
    }
}

export class PetExpeditionResultView extends CommonForm {
    private readonly MinDisplayCount = 10;
    private readonly TickKey = '1';

    private btnExit: UnityEngine.GameObject;
    private labelBtnExit: UnityEngine.UI.Text;
    private mask: UnityEngine.GameObject;

    private list: List;
    private items: ExpeditionRankItem[] = [];

    private win: UnityEngine.GameObject;
    private lose: UnityEngine.GameObject;

    private textDesc: UnityEngine.UI.Text;
    private rewardList: List;
    private icons: IconItem[] = [];

    private titleSuccess: UnityEngine.GameObject;
    private titleFail: UnityEngine.GameObject;
    private animSuccess: UnityEngine.GameObject;

    private info: Protocol.SceneInfoResultWYYZ;

    private countDownSec = 0;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Result;
    }

    protected resPath(): string {
        return UIPathData.PetExpeditionResultView;
    }

    protected initElements() {
        this.btnExit = this.elems.getElement('btnExit');
        this.labelBtnExit = this.elems.getText('labelBtnExit');
        this.mask = this.elems.getElement('mask');

        this.list = this.elems.getUIList('list');
        this.list.Count = Macros.MAX_WYYZ_FIGHT_PET_COUNT * 2;
        for (let i = 0; i < Macros.MAX_WYYZ_FIGHT_PET_COUNT * 2; i++) {
            let item = new ExpeditionRankItem();
            item.setComponents(this.list.GetItem(i).gameObject);
            this.items.push(item);
        }

        this.win = this.elems.getElement('win');
        this.lose = this.elems.getElement('lose');

        this.rewardList = this.elems.getUIList('rewardList');
        this.textDesc = this.elems.getText('textDesc');

        this.titleSuccess = this.elems.getElement('titleSuccess');
        this.titleFail = this.elems.getElement('titleFail');
        this.animSuccess = this.elems.getElement('animSuccess');
    }

    protected initListeners() {
        this.addClickListener(this.btnExit, this.onClickBtnExit);
        this.addClickListener(this.mask, this.onClickBtnExit);
    }

    protected onOpen() {
        this.updateView();

        this.countDownSec = Constants.ResultCountDownMin + Math.round(Math.random() * (Constants.ResultCountDownMax - Constants.ResultCountDownMin));

        this.labelBtnExit.text = uts.format('退出({0})', this.countDownSec);
        this.addTimer(this.TickKey, 1000, this.countDownSec, this.onTickTimer);
    }

    protected onClose() {
    }

    open(info: Protocol.SceneInfoResultWYYZ) {
        //uts.log(info);
        this.info = info;
        super.open();
    }

    private onClickBtnExit() {
        G.ModuleMgr.pinstanceModule.onClickQuitPinstance(true);
        this.close();
    }

    private updateView() {
        let expeditionData = G.DataMgr.petExpeditionData;
        let info = expeditionData.info;

        // 我的伙伴
        let myName = G.DataMgr.heroData.name;
        let self = this.info.m_stSelfPetList;
        for (let i = 0; i < Macros.MAX_WYYZ_FIGHT_PET_COUNT; i++) {
            let item = this.items[i];

            if (i < this.info.m_ucSelfPetCnt) {
                let p = self[i];
                let po = expeditionData.getPetOne(p.m_iPetID);
                po.hpPct = p.m_iPercent;
                item.update(i, p, po, myName);
            } else {
                // 只是显示一个空行，这样好看点
                item.update(i, null, null, null);
            }
        }

        // 对手的伙伴
        let opponentName = this.info.m_szLevelName;
        let opponent = this.info.m_stLevelPetList;
        for (let i = 0; i < Macros.MAX_WYYZ_FIGHT_PET_COUNT; i++) {
            let idx = Macros.MAX_WYYZ_FIGHT_PET_COUNT + i;
            let item = this.items[idx];

            if (i < this.info.m_ucLevelPetCnt) {
                let p = opponent[i];
                let po = expeditionData.getLevelPetOne(p.m_iPetID);
                po.hpPct = p.m_iPercent;
                item.update(idx, p, po, opponentName);
            } else {
                // 只是显示一个空行，这样好看点
                item.update(idx, null, null, null);
            }
        }

        if (1 == this.info.m_bWin) {
            this.animSuccess.SetActive(true);
            this.titleSuccess.SetActive(true);
            this.titleFail.SetActive(false);

            this.win.SetActive(true);
            this.lose.SetActive(false);
            this.textDesc.text = uts.format('恭喜您成功通过第{0}关，获得以下奖励：', this.info.m_iLevel);
            this.rewardList.Count = 1;
            let r = this.info.m_stReward;
            let icon = this.icons[0];
            if (null == icon) {
                this.icons[0] = icon = new IconItem();
                icon.setUsuallyIcon(this.rewardList.GetItem(0).gameObject);
                icon.setTipFrom(TipFrom.normal);
            }
            icon.updateById(r.m_uiThingID, r.m_uiThingNum);
            icon.updateIcon();
        } else {
            this.animSuccess.SetActive(false);
            this.titleSuccess.SetActive(false);
            this.titleFail.SetActive(true);

            this.win.SetActive(false);
            this.lose.SetActive(true);
        }
    }

    private onTickTimer(timer: Game.Timer) {
        let left = this.countDownSec - timer.CallCount;
        if (left > 0) {
            this.labelBtnExit.text = uts.format('退出({0})', left);
        } else {
            this.onClickBtnExit();
        }
    }
}