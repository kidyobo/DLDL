import { UnitCtrlType } from "System/constants/GameEnum";
import { BuffData } from "System/data/BuffData";
import { GuildData } from "System/data/GuildData";
import { MonsterData } from "System/data/MonsterData";
import { UIPathData } from "System/data/UIPathData";
import { Global as G } from "System/global";
import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { SkillIconItem } from "System/uilib/SkillIconItem";
import { RegExpUtil } from "System/utils/RegExpUtil";
import { SpecialCharUtil } from "System/utils/SpecialCharUtil";

/*
 *宗派神兽下阶预览
 */
export class GuildMonsterPreviewView extends CommonForm {

    private _level: number = 0;
    /**技能图标*/
    private _skillItems: SkillIconItem[] = [];

    private _modelCtnTR: UnityEngine.GameObject;
    private _effectRootTR: UnityEngine.GameObject;

    private _txtName: UnityEngine.UI.Text;
    private _txtDesc: UnityEngine.UI.Text;
    private _txtStage: UnityEngine.UI.Text;

    private _originModelScale: UnityEngine.Vector3;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }
    protected resPath(): string {
        return UIPathData.GuildMonsterPreviewView;
    }

    protected initElements() {
        this._modelCtnTR = this.elems.getElement("modelCtn");
        this._originModelScale = this._modelCtnTR.transform.localScale;
        this._effectRootTR = this.elems.getElement('effectRoot');

        this._txtName = this.elems.getText('txtName');
        this._txtDesc = this.elems.getText('txtDesc');
        this._txtStage = this.elems.getText('txtStage');

        let _skillList = this.elems.getUiElements("skill");
        let _skillIcon_Normal = this.elems.getElement("skillIcon_Normal");
        let len = GuildData.MONSTER_SKILL_IDS.length;
        for (let i = 0; i < len; i++) {
            let item = _skillList.getElement('skill' + i);
            let iconItem = new SkillIconItem(true);
            iconItem.setUsuallyByPrefab(_skillIcon_Normal, item);
            //iconItem.isBuffSkill = true;
            this._skillItems.push(iconItem);
        }
    }

    protected initListeners() {
        this.addClickListener(this.elems.getElement("mask"), this.onClickClose);
        this.addClickListener(this.elems.getElement("btnClose"), this.onClickClose);
    }

    open(level: number) {
        this._level = level;
        super.open();
    }

    protected onOpen() {
        let cfgs = G.DataMgr.guildData.GuildMonsterCfg;

        this._txtStage.text = SpecialCharUtil.getHanNum(this._level) + '阶';

        //模型
        let config = cfgs[this._level];
        let monsterConfig = MonsterData.getMonsterConfig(config.m_iMonsterId);

        this._txtName.text = monsterConfig.m_szMonsterName;
        G.ResourceMgr.loadModel(this._modelCtnTR, UnitCtrlType.boss, monsterConfig.m_szModelID, this.sortingOrder);
        if (monsterConfig.m_ucUnitScale > 0) {
            let scalePer = monsterConfig.m_ucUnitScale / 100;
            this._modelCtnTR.transform.localScale = G.getCacheV3(this._originModelScale.x * scalePer,
                this._originModelScale.y * scalePer,
                this._originModelScale.z * scalePer);
        }

        //脚底光环
        let effectConfig = BuffData.getBuffByID(config.m_iBuffId);
        G.ResourceMgr.loadModel(this._effectRootTR, UnitCtrlType.other,
            uts.format("effect/skill/{0}.prefab", effectConfig.m_szBuffSpecialEffect), this.sortingOrder);

        //描述
        this._txtDesc.text = RegExpUtil.xlsDesc2Html(G.DataMgr.langData.getLang(429));

        //技能
        this.updateSkill();
    }

    private updateSkill() {
        for (let i = GuildData.MONSTER_SKILL_IDS.length - 1; i >= 0; i--) {
            let item = this._skillItems[i];
            item.needGrey = this._level < GuildData.MONSTER_SKILL_OPEN_LV[i];
            item.updateBySkillID(GuildData.MONSTER_SKILL_IDS[i]);
            item.updateIcon();
        }
    }

    protected onClose() {
    }


    private onClickClose() {
        this.close();
    }
}