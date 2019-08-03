import { Global as G } from 'System/global'
import { UiElements } from 'System/uilib/UiElements'
import { UIUtils } from 'System/utils/UIUtils'
import { ElemFinder } from 'System/uilib/UiUtility'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { PetExpeditionBaseLogic, PetExpeditionItem } from 'System/pet/expedition/PetExpeditionBaseLogic'
import { List, ListItem } from 'System/uilib/List'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { BuffData } from 'System/data/BuffData'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { PriceBar } from 'System/business/view/PriceBar'

class PetExpeditionWishItem extends ListItemCtrl {

    private icon: UnityEngine.UI.RawImage;
    private textDesc: UnityEngine.UI.Text;
    private has: UnityEngine.GameObject;
    private priceBar: PriceBar;
    private btnBuy: UnityEngine.GameObject;
    private labelBtnBuy: UnityEngine.UI.Text;

    private cfg: GameConfig.WYYZBuff;
    private index = 0;

    constructor(index: number) {
        super();
        this.index = index;
    }

    setComponents(go: UnityEngine.GameObject) {
        let iconWrapper = ElemFinder.findObject(go, 'iconWrapper');
        this.icon = ElemFinder.findRawImage(iconWrapper, 'mask/icon');
        this.textDesc = ElemFinder.findText(go, 'textDesc');
        this.has = ElemFinder.findObject(iconWrapper, 'has');
        this.btnBuy = ElemFinder.findObject(go, 'btnBuy');
        this.labelBtnBuy = ElemFinder.findText(this.btnBuy, 'Text');

        this.priceBar = new PriceBar();
        let priceBarGo = ElemFinder.findObject(go, 'priceBar');
        this.priceBar.setComponents(priceBarGo);
        this.priceBar.setCurrencyID(KeyWord.MONEY_YUANBAO_ID);

        Game.UIClickListener.Get(this.btnBuy).onClick = delegate(this, this.onClickBtnBuy);
    }

    update(cfg: GameConfig.WYYZBuff, has: boolean) {
        this.cfg = cfg;
        let buffCfg = BuffData.getBuffByID(cfg.m_iID);
        G.ResourceMgr.loadIcon(this.icon, buffCfg.m_uiBuffIconID.toString());
        this.textDesc.text = buffCfg.m_szBuffDescription;
        this.priceBar.setPrice(this.cfg.m_iPrice);
        this.has.SetActive(has);
        UIUtils.setButtonClickAble(this.btnBuy, !has);
        this.labelBtnBuy.text = has ? '已购买' : '购买';
    }

    private onClickBtnBuy() {
        // 只能购买一个buff
        let expeditionData = G.DataMgr.petExpeditionData;
        let info = expeditionData.info;
        if (null != info) {
            if (info.m_iBuffBit == 0) {
                if (0 == G.ActionHandler.getLackNum(KeyWord.MONEY_YUANBAO_ID, this.cfg.m_iPrice, true)) {
                    G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getWyyzBuyBuffRequest(this.index));
                }
            } else {
                G.TipMgr.addMainFloatTip('您只能购买一个祝福');
            }
        }
    }
}

export class PetExpeditionInfoLogic extends PetExpeditionBaseLogic {

    private petList: List;
    private petItems: PetExpeditionItem[] = [];

    private wishList: List;
    private wishItems: PetExpeditionWishItem[] = [];

    private imgHead: UnityEngine.UI.Image;
    private textName: UnityEngine.UI.Text;
    private textRank: UnityEngine.UI.Text;

    private btnBack: UnityEngine.GameObject;
    private btnGo: UnityEngine.GameObject;
    private labelBtnGo: UnityEngine.UI.Text;
    private opponent: UnityEngine.GameObject;
    private textAllPass: UnityEngine.UI.Text;

    initElements(elems: UiElements) {
        this.petList = elems.getUIList('petList');
        this.petList.Count = Macros.MAX_WYYZ_FIGHT_PET_COUNT;
        for (let i = 0; i < Macros.MAX_WYYZ_FIGHT_PET_COUNT; i++) {
            let item = new PetExpeditionItem();
            item.setComponents(this.petList.GetItem(i).gameObject);
            this.petItems.push(item);
        }

        this.wishList = elems.getUIList('wishList');
        this.imgHead = elems.getImage('imgHead');
        this.textName = elems.getText('textName');
        this.textRank = elems.getText('textRank');
        this.btnBack = elems.getElement('btnBack');
        this.btnGo = elems.getElement('btnGo');
        this.labelBtnGo = elems.getText('labelBtnGo');
        this.opponent = elems.getElement('opponent');
        this.textAllPass = elems.getText('textAllPass');
    }

    initListeners() {
        Game.UIClickListener.Get(this.btnBack).onClick = delegate(this, this.onClickBtnBack);
        Game.UIClickListener.Get(this.btnGo).onClick = delegate(this, this.onClickBtnGo);
    }

    protected onOpen() {
        super.onOpen();
        this.panel.bg.SetActive(true);
        this.panel.map.SetActive(false);
        this.panel.info.SetActive(true);
        this.panel.choose.SetActive(false);
        this.panel.bottom.SetActive(true);
        this.panel.mapBottom.SetActive(false);
        this.panel.infoBottom.SetActive(true);
    }

    protected onClose() {
    }

    onPanelClosed() {
    }

    onExpeditionChange() {
        let expeditionData = G.DataMgr.petExpeditionData;
        let info = expeditionData.info;
        let level = 0;
        let hasGetReward = false;
        let refreshTime = 0;
        let buffBit = 0;
        let levelInfoCnt = 0;
        if (null != info) {
            level = info.m_iTGLevel;
            hasGetReward = 0 != info.m_iTGRewardBit;
            refreshTime = info.m_uiFreshTime;
            buffBit = info.m_iBuffBit;
            levelInfoCnt = info.m_stLevelList.m_iCount;
        }

        let showLevel = Math.min(level + 1, Macros.MAX_WYYZ_LEVEL);
        this.labelBtnGo.text = level < Macros.MAX_WYYZ_LEVEL ? uts.format('挑战{0}关', showLevel) : '全通关';

        // 对手信息
        let levelOne: Protocol.CSWYYZLevelOne;
        if (level < Macros.MAX_WYYZ_LEVEL && showLevel - 1 < levelInfoCnt) {
            levelOne = info.m_stLevelList.m_stList[showLevel - 1];
        }

        // 守关伙伴
        let petData = G.DataMgr.petData;
        for (let i = 0; i < Macros.MAX_WYYZ_FIGHT_PET_COUNT; i++) {
            let petItem = this.petItems[i];
            let petId = 0;
            if (null != levelOne && i < levelOne.m_stPetList.m_iCount) {
                petId = levelOne.m_stPetList.m_stList[i].m_iPetID;
            }

            if (petId > 0) {
                let itemData = expeditionData.getLevelPetOne(petId);
                petItem.update(itemData, true);
            } else {
                petItem.update(null, false);
            }
        }

        // 祝福
        let cfg = expeditionData.getWyyzLevelConfig(showLevel);
        let len = cfg.m_stBuffList.length;
        let oldWishItemCnt = this.wishItems.length;
        this.wishList.Count = len;
        let bit = 1;
        for (let i = 0; i < len; i++) {
            let wishItem: PetExpeditionWishItem;
            if (i < oldWishItemCnt) {
                wishItem = this.wishItems[i];
            } else {
                this.wishItems.push(wishItem = new PetExpeditionWishItem(i));
                wishItem.setComponents(this.wishList.GetItem(i).gameObject);
            }
            wishItem.update(cfg.m_stBuffList[i], 0 != (buffBit & bit));
            bit = bit << 1;
        }

        if (null != levelOne) {
            this.opponent.SetActive(true);
            let profile = levelOne.m_stBasePro;
            this.imgHead.sprite = G.AltasManager.roleHeadAltas.Get(uts.format('{0}_{1}', profile.m_cProfession, profile.m_cGender));
            this.textName.text = profile.m_szNickName;
            this.textRank.text = uts.format('伙伴排行：{0}', levelOne.m_iRank);
            UIUtils.setButtonClickAble(this.btnGo, true);
            this.textAllPass.gameObject.SetActive(false);
        } else {
            this.opponent.SetActive(false);
            UIUtils.setButtonClickAble(this.btnGo, false);
            let nz = Math.floor(G.SyncTime.getCurrentTime() / 86400000);
            let rz = Math.floor(refreshTime / 86400);
            this.textAllPass.text = uts.format('已完成全部关卡，将在{0}天后重置进度', Math.max(1, rz - nz));
            this.textAllPass.gameObject.SetActive(true);
        }
    }

    onCurrencyChange(id: number) {
    }

    onTickTimer(timer: Game.Timer) {
    }

    private onClickBtnBack() {
        this.panel.gotoFace();
    }

    private onClickBtnGo() {
        this.panel.gotoChoose();
    }
}