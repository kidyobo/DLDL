import { Global as G } from 'System/global'
import { UiElements } from 'System/uilib/UiElements'
import { ElemFinder } from 'System/uilib/UiUtility'
import { Macros } from 'System/protocol/Macros'
import { HeroView } from 'System/hero/view/HeroView'
import { BuffListView } from 'System/buff/BuffListView'
import { PkModeView } from 'System/main/view/PkModeView'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Color } from 'System/utils/ColorUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { UIUtils } from 'System/utils/UIUtils'
import { VipView } from 'System/vip/VipView'
import { SlotMachine } from 'System/uilib/SlotMachine'
import { ZhufuData } from 'System/data/ZhufuData'
import { SkillData } from 'System/data/SkillData'
import { PetView } from 'System/pet/PetView'
import { ReportType } from 'System/channel/ChannelDef'
import { TextGetSet, GameObjectGetSet } from "System/uilib/CommonForm";
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'

class PkModeBtnStyle {
    label: string;
    bg: UnityEngine.GameObject;
}

export class HeroInfoCtrl {

    headIcon: UnityEngine.UI.Image;

    //private headTipMark: UnityEngine.GameObject;

    private hpBar: UnityEngine.UI.Image;
    private roleHpText: UnityEngine.UI.Text;

    private hunzhiBar: UnityEngine.UI.Image;
    private hunzhiTextGetSet: TextGetSet;

    private fightSlotMachine: SlotMachine;

    private roleNameText: UnityEngine.UI.Text;


    private btnPkMode: UnityEngine.GameObject;
    private labelPkMode: UnityEngine.UI.Text;

    private btnBuff: UnityEngine.GameObject;
    private textBuff: UnityEngine.UI.Text;

    private pkModeStyleMap: { [mode: number]: PkModeBtnStyle } = {};

    //vip
    private btn_vip: UnityEngine.GameObject = null;
    private vipLevelText: UnityEngine.UI.Text;
    private btn_vipSmallIcon: UnityEngine.GameObject;
    private btn_vipBigIcon: UnityEngine.GameObject;
    private btn_vipTipMark: UnityEngine.GameObject;


    private nuqiImage: UnityEngine.UI.Image;
    private nuqiAnim: UnityEngine.GameObject;

    private vipNuqi: UnityEngine.UI.Image;
    private vipNuqiAnim: UnityEngine.GameObject;
    private vipNuqiGuide: UnityEngine.GameObject;

    // private jingXueImage: UnityEngine.UI.Image;
    // private jingXueAnim: UnityEngine.GameObject;
    // private lastCurrentJingXue: number = -1;
    // private lastMaxJingXue: number = -1;

    private textYuanBao: UnityEngine.UI.Text;
    private textYuanBaoBind: UnityEngine.UI.Text;
    private textTongqian: UnityEngine.UI.Text;

    /////////////////////////////////////////
    /////缓存的变量
    //////////////////
    private _roleValue: number = 0;
    private set roleValue(value: number) {
        if (this._roleValue != value) {
            this._roleValue = value;
            this.hpBar.fillAmount = value;
            //Game.Tools.SetGameObjectLocalScale(this.hpBar, value, 1, 1);
        }
    }

    private _roleHP: string = null;
    private get roleHP() {
        return this._roleHP;
    }
    private set roleHP(value: string) {
        if (this._roleHP != value) {
            this._roleHP = value;
            this.roleHpText.text = value;
        }
    }

    private _roleMPValue: number = 0;
    private set roleMPValue(value: number) {
        if (this._roleMPValue != value) {
            this._roleMPValue = value;
            this.hunzhiBar.fillAmount = value;
            //Game.Tools.SetGameObjectLocalScale(this.hunzhiBar, value, 1, 1);
        }
    }

    private _roleLevel: number = -1;
    private set roleLevel(value: number) {
        if (this._roleLevel != value) {
            this._roleLevel = value;
            this.roleNameText.text = uts.format('{0} {1}', value, G.DataMgr.heroData.name);
            G.ServerData.setPlayerData('heroLevel', value.toString());
        }
    }

    private _vipLevel: number = -1;
    private get vipLevel() {
        return this._vipLevel;
    }
    private set vipLevel(value: number) {
        if (this._vipLevel != value) {
            this._vipLevel = value;
            if (value > 0) {
                this.vipLevelText.text = value.toString();
                this.btn_vipBigIcon.SetActive(false);
                this.btn_vipSmallIcon.SetActive(true);
            } else {
                this.vipLevelText.text = '';
                this.btn_vipBigIcon.SetActive(true);
                this.btn_vipSmallIcon.SetActive(false);
            }
        }
    }

    private _pkMode: number = -1;
    private get pkMode() {
        return this._pkMode;
    }
    private set pkMode(value: number) {
        if (this._pkMode != value) {
            this._pkMode = value;
            let style: PkModeBtnStyle = this.pkModeStyleMap[value];
            this.labelPkMode.text = style.label;
            for (let modeKey in this.pkModeStyleMap) {
                let tmpStyle = this.pkModeStyleMap[modeKey];
                tmpStyle.bg.SetActive(tmpStyle.bg == style.bg);
            }
        }
    }

    private _buffCount: number = -1;
    private get buffCount() {
        return this._buffCount;
    }
    private set buffCount(value: number) {
        if (this._buffCount != value) {
            this._buffCount = value;
            if (value > 0) {
                this.btnBuff.SetActive(true);
            } else {
                this.btnBuff.SetActive(false);
            }
            this.textBuff.text = '状态*' + value;
        }
    }

    private _currentNuQi = -1;
    public get currentNuQi() {
        return this._currentNuQi;
    }
    //设置怒气百分比
    public set currentNuQi(current: number) {
        if (this._currentNuQi != current) {
            let progress = current / 200;
            let enable = current >= 150;
            this.nuqiImage.fillAmount = progress;
            let active = this.nuqiAnim.activeSelf;
            if (enable && !active) {
                this.nuqiAnim.SetActive(true);
                this.vipNuqiAnim.SetActive(true);
            }
            else if (!enable && active) {
                this.nuqiAnim.SetActive(false);
                this.vipNuqiAnim.SetActive(false);
            }
            this.vipNuqi.fillAmount = progress;
            let vipProgress = current / 200;
            let vipEnable = current >= 50;
            let activeVip = this.vipNuqiAnim.activeSelf;

            if (vipEnable && !activeVip) {
                this.vipNuqiAnim.SetActive(true);
            }
            else if (!vipEnable && activeVip) {
                this.vipNuqiAnim.SetActive(false);

            }

            let cfg = G.DataMgr.skillData.getExperSkillConfig(G.DataMgr.heroData.profession)
            let isCd = G.ModuleMgr.skillModule._getSkillCd(cfg);
            let activeVipGuide = this.vipNuqiGuide.activeSelf;
            if (vipEnable && G.DataMgr.sceneData.curPinstanceID == Macros.PINSTANCE_ID_SHNS && !activeVipGuide && isCd == null) {
                this.vipNuqiGuide.SetActive(true);
            } else if (!vipEnable && activeVipGuide || G.DataMgr.sceneData.curPinstanceID != Macros.PINSTANCE_ID_SHNS || isCd != null) {
                this.vipNuqiGuide.SetActive(false);

            }
        }
    }


    //设置精血百分比
    private updateCurrentJingXue() {
        // let current = G.DataMgr.heroData.getProperty(Macros.EUAI_BLOOD);
        // let max = G.DataMgr.heroData.getProperty(Macros.EUAI_MAX_BLOOD);
        // if (this.lastCurrentJingXue == current && this.lastMaxJingXue == max) {
        //     return;
        // }
        // this.lastCurrentJingXue = current;
        // this.lastMaxJingXue = max;
        // this.jingXueImage.fillAmount = current / max;
        // let enable: boolean = false;
        // let skillConfig: GameConfig.SkillConfigM;
        // let data = G.DataMgr.zhufuData.xueMaiData;
        // if (data != null && data.m_ucStage > 0) {
        //     let config = ZhufuData.getXuemaiConfig(data.m_ucStage);
        //     skillConfig = SkillData.getSkillConfig(config.m_iActiveSkillID1);
        // }
        // if (skillConfig != null) {
        //     enable = current >= skillConfig.m_stConsumable[0].m_iConsumeValue;
        // } else {
        //     enable = false;
        // }
        // let active = this.jingXueAnim.activeSelf;
        // if (enable && !active) {
        //     //this.jingxueAnim.SetActive(true);
        // }
        // else if (!enable && active) {
        //     //this.jingxueAnim.SetActive(false);
        // }
    }


    setView(uiElems: UiElements) {
        this.nuqiImage = uiElems.getImage("nuqi");
        this.nuqiAnim = uiElems.getElement("nuqiAnim");
        this.vipNuqi = uiElems.getImage("vipNuqi");
        this.vipNuqiAnim = uiElems.getElement("vipNuqiAnim");
        // this.jingXueImage = uiElems.getImage('jingxue');
        // this.jingXueAnim = uiElems.getElement('jingxueAnim');
        this.vipNuqiGuide = uiElems.getElement("vipArrow");
        // this.jingXueAnim.SetActive(false);
        //玩家属性
        let roleRectElems = uiElems.getUiElements('roleRect');

        this.textYuanBao = roleRectElems.getText('textYuanBao');
        this.textYuanBaoBind = roleRectElems.getText('textYuanBaoBind');
        this.textTongqian = roleRectElems.getText('textTongqian');

        this.headIcon = roleRectElems.getImage("roleHead");
        //人物头像红点
        //this.headTipMark = roleRectElems.getElement('roleTipMark');
        //this.headTipMark.SetActive(false);

        this.hpBar = roleRectElems.getImage('hpBar');
        this.roleHpText = roleRectElems.getText("hpText");

        this.hunzhiBar = roleRectElems.getImage('hunzhiBar');
        this.hunzhiTextGetSet = new TextGetSet(roleRectElems.getText("hunzhiText"));

        let roleFight = roleRectElems.getText("textRoleFight");
        this.fightSlotMachine = new SlotMachine();
        this.fightSlotMachine.setComponent(roleFight, null);

        this.roleNameText = roleRectElems.getText("roleName");

        this.btn_vip = roleRectElems.getElement("btnVip");
        this.btn_vipSmallIcon = ElemFinder.findObject(this.btn_vip, 'vSmall');
        this.btn_vipBigIcon = ElemFinder.findObject(this.btn_vip, 'vBig');
        this.btn_vipTipMark = ElemFinder.findObject(this.btn_vip, 'tipMark');

        Game.UIClickListener.Get(this.btn_vip).onClick = delegate(this, this.onClickVipIcon);
        this.vipLevelText = roleRectElems.getText('textVipLv');

        this.btnPkMode = roleRectElems.getElement('btnPkMode');
        this.labelPkMode = ElemFinder.findText(this.btnPkMode.gameObject, 'Text');
        // this.addPkModeBtnStyle(Macros.PK_STATUS_EVIL, '善恶', 'pupple');
        this.addPkModeBtnStyle(Macros.PK_STATUS_PEACE, '和平', 'green');
        this.addPkModeBtnStyle(Macros.PK_STATUS_TEAM, '队伍', 'orange');
        this.addPkModeBtnStyle(Macros.PK_STATUS_ALL, '全体', 'red');
        this.addPkModeBtnStyle(Macros.PK_STATUS_ARMY, '军团', 'red');
        this.addPkModeBtnStyle(Macros.PK_STATUS_ZONE, '区服', 'red');
        this.addPkModeBtnStyle(Macros.PK_STATUS_EVIL, '善恶', 'pupple');
        this.addPkModeBtnStyle(Macros.PK_STATUS_GUILD, '宗门', 'blue');

        this.btnBuff = roleRectElems.getElement('btnBuff');
        this.textBuff = roleRectElems.getText('textBuff');

        Game.UIClickListener.Get(this.headIcon.gameObject).onClick = delegate(this, this.onClickHeadIcon);
        Game.UIClickListener.Get(this.btnPkMode).onClick = delegate(this, this.onClickBtnPkMode);
        Game.UIClickListener.Get(this.btnBuff).onClick = delegate(this, this.onClickBtnBuff);
    }

    private addPkModeBtnStyle(mode: number, label: string, bg: string) {
        let style = new PkModeBtnStyle();
        style.label = label;
        style.bg = ElemFinder.findObject(this.btnPkMode, bg);
        this.pkModeStyleMap[mode] = style;
    }

    public onSceneChange() {
        let data = G.DataMgr.heroData;
        // 头像
        this.headIcon.sprite = G.AltasManager.roleHeadAltas.Get(uts.format('{0}_{1}r', data.profession, data.gender));
        let sceneData = G.DataMgr.sceneData;
        let pvpMode = sceneData.getSceneInfo(sceneData.curSceneID).config.m_iPVPModel;
        let canSelectPkMode = pvpMode == KeyWord.PVP_NONE || pvpMode == KeyWord.PVP_FREEDOM;
        UIUtils.setButtonClickAble(this.btnPkMode, canSelectPkMode);
        if (!canSelectPkMode) {
            G.Uimgr.closeForm(PkModeView);
        }
    }

    onHeroDataChange() {
        let data = G.DataMgr.heroData;
        // 血量
        let hpNow: number = data.getProperty(Macros.EUAI_CURHP);
        let hpMax: number = data.getProperty(Macros.EUAI_MAXHP);
        this.roleValue = hpNow / hpMax;
        this.roleHP = hpNow + "/" + hpMax;
        this.roleLevel = data.getProperty(Macros.EUAI_LEVEL);   
        this.vipLevel = data.curVipLevel;
        this.pkMode = G.DataMgr.heroData.pkMode;
        this.currentNuQi = data.getProperty(Macros.EUAI_RAGE);
        //精血
        this.updateCurrentJingXue();
        this.fightSlotMachine.rollTo(data.getProperty(Macros.EUAI_FIGHT));
        // 守护神护盾
        this.onShieldChaned();
        // buff
        this.onHeroBuffChanged();
    }

    onVipChange() {
        this.vipLevel = G.DataMgr.heroData.curVipLevel;
    }

    onCurrencyChange(id: number) {
        let heroData = G.DataMgr.heroData;
        if (0 == id) {
            this.textYuanBao.text = heroData.gold.toString();
            this.textYuanBaoBind.text = heroData.gold_bind.toString();
            this.setTongqian(heroData.tongqian);
        } else if (KeyWord.MONEY_YUANBAO_ID == id) {
            this.textYuanBao.text = heroData.gold.toString();
        } else if (KeyWord.MONEY_YUANBAO_BIND_ID == id) {
            this.textYuanBaoBind.text = heroData.gold_bind.toString();
        } else if (KeyWord.MONEY_TONGQIAN_ID == id) {
            this.setTongqian(heroData.tongqian);
        }
    }

    onNameChange() {
        let heroData = G.DataMgr.heroData;

        let level = heroData.getProperty(Macros.EUAI_LEVEL);
        this.roleNameText.text = uts.format("{0} {1}", level, heroData.name);
        G.ServerData.setPlayerData('heroLevel', level.toString());
    }

    private setTongqian(value: number) {
        if (value > 10000) {
            this.textTongqian.text = Math.floor(value / 10000) + '万';
        } else {
            this.textTongqian.text = value.toString();
        }
    }

    onShieldChaned() {
        // 守护神护盾
        let value = -1;
        let t: string;
        if (G.DataMgr.funcLimitData.isFuncEntranceVisible(KeyWord.BAR_FUNCTION_SHIELDGOD)) {
            let data = G.DataMgr.shieldGodData;
            let shieldId = data.CrtShieldId;
            if (shieldId > 0) {
                let oneInfo = data.getShieldInfo(shieldId);
                if (oneInfo) {
                    let cfg = data.getCfg(shieldId, oneInfo.m_shLv);
                    let maxSP: number = Math.floor(G.DataMgr.heroData.getProperty(Macros.EUAI_MAXHP) * cfg.m_iInjuryRaito / 10000);
                    let curSP: number = G.DataMgr.heroData.getProperty(Macros.EUAI_SHIELDGOD);
                    value = Math.min(curSP / maxSP, 1);
                    t = uts.format('减伤{0}%', Math.floor(cfg.m_iInjuryRaito / 100));
                }
            }
        }
        this.roleMPValue = Math.max(0, value);
        if (!t) {
            t = /*G.DataMgr.langData.getLang(117)*/'';
        }
        this.hunzhiTextGetSet.text = t;
    }

    onHeroBuffChanged() {
        let heroCtrl = G.UnitMgr.hero;
        if (null != heroCtrl) {
            let allBuffIds = heroCtrl.buffProxy.buffDataList.getAllBuffId();
            let cnt = allBuffIds.length;
            if (heroCtrl.Data.getProperty(Macros.EUAI_HPSTORE) > 0) {
                cnt++;
            }
            this.buffCount = cnt;
        }
    }

    //setTipMark(show: boolean) {
    //    this.headTipMark.SetActive(show);
    //}
    setVipTipMark(show: boolean) {
        this.btn_vipTipMark.SetActive(show);
    }

    //点击头像
    private onClickHeadIcon(): void {
        G.ViewCacher.functionGuideView.guideOffTarget(this.headIcon.gameObject);
        if (!G.ActionHandler.checkCrossSvrUsable(true, KeyWord.BAR_FUNCTION_ROLE)) {
            return;
        }
        G.Uimgr.createForm<HeroView>(HeroView).open();
    }

    private onClickBtnPkMode() {
        G.Uimgr.createForm<PkModeView>(PkModeView).open();
    }

    private onClickBtnBuff() {
        G.Uimgr.createForm<BuffListView>(BuffListView).open(G.UnitMgr.hero);
    }

    //点击Vip
    private onClickVipIcon() {
        G.Uimgr.createForm<VipView>(VipView).open();
    }

}