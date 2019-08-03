import { NestedSubForm } from "System/uilib/NestedForm"
import { UIPathData } from "System/data/UIPathData"
import { IconItem } from 'System/uilib/IconItem'
import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { UIUtils } from 'System/utils/UIUtils'
import { TipFrom } from 'System/tip/view/TipsView'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { UnitController } from "System/unit/UnitController"
import { UnitCtrlType, EnumDir2D } from 'System/constants/GameEnum'
import { ProtocolUtil } from "System/protocol/ProtocolUtil"
import { RoleData } from "System/data/RoleData"
import { DataFormatter } from "System/utils/DataFormatter"
import { EnumMainViewChild } from 'System/main/view/MainView'
export class TianChiView extends NestedSubForm {
    /**抹肥皂*/
    private m_btnMo: UnityEngine.GameObject;

    /**泼水按钮*/
    private m_btnPo: UnityEngine.GameObject;

    /**搓背按钮*/
    private m_btnCuo: UnityEngine.GameObject;

    /**抹肥皂CD*/
    private m_moCD: UnityEngine.UI.Text;

    /**泼水按钮CD*/
    private m_poCD: UnityEngine.UI.Text;

    /**搓背按钮CD*/
    private m_cuoCD: UnityEngine.UI.Text;

    /**抹肥皂Count*/
    private m_moCount: UnityEngine.UI.Text;

    /**泼水按钮Count*/
    private m_poCount: UnityEngine.UI.Text;

    /**搓背按钮Count*/
    private m_cuoCount: UnityEngine.UI.Text;

    //三个动作的cd
    private m_cd: number = -1;

    private m_cntMo: number = 0;
    private m_cntPo: number = 0;
    private m_cntCuo: number = 0;
    constructor() {
        super(EnumMainViewChild.tianChi);
        this.rootPath = 'panelRoot';
    }

    protected resPath(): string {
        return UIPathData.TianChiView;
    }

    protected initElements() {
        this.m_btnMo = this.elems.getElement("m_btnMo");
        this.m_btnPo = this.elems.getElement("m_btnPo");
        this.m_btnCuo = this.elems.getElement("m_btnCuo");
        this.m_moCD = this.elems.getText("m_moCD");
        this.m_poCD = this.elems.getText("m_poCD");
        this.m_cuoCD = this.elems.getText("m_cuoCD");
        this.m_moCount = this.elems.getText("m_moCount");
        this.m_poCount = this.elems.getText("m_poCount");
        this.m_cuoCount = this.elems.getText("m_cuoCount");
    }

    protected initListeners() {
        this.addClickListener(this.m_btnMo, this._onBtnMoClick);
        this.addClickListener(this.m_btnPo, this._onBtnPoClick);
        this.addClickListener(this.m_btnCuo, this._onBtnCuoClick);
    }
    protected onOpen() {
        this.setActive(!G.MainBtnCtrl.IsOpened);
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_BATHE, Macros.ACTIVITY_BATHE_LIST));
        this._updateEnable();

        this.m_moCD.text = '';
        this.m_poCD.text = '';
        this.m_cuoCD.text = '';

    }
    protected onClose() {

    }

    private _updateEnable(): void {
        UIUtils.setButtonClickAble(this.m_btnCuo, this.m_cntCuo > 0 && this.m_cd < 0);
        UIUtils.setButtonClickAble(this.m_btnMo, this.m_cntMo > 0 && this.m_cd < 0);
        UIUtils.setButtonClickAble(this.m_btnPo, this.m_cntPo > 0 && this.m_cd < 0);

        this.m_cuoCount.text = uts.format("剩余次数：{0}", this.m_cntCuo.toString());
        this.m_poCount.text = uts.format("剩余次数：{0}", this.m_cntPo.toString());
        this.m_moCount.text = uts.format("剩余次数：{0}", this.m_cntMo.toString());

        //this.m_btnPo.setTip('轻轻的向对手泼水，双方获得一定的经验奖励\n剩余次数:' + TextFieldUtil.getColorTipText(string(this.m_cntPo), Color.GREEN));
        //this.m_btnCuo.setTip('剧烈搓揉对方的背部，双方获得一定的经验奖励\n剩余次数：' + TextFieldUtil.getColorTipText(string(this.m_cntCuo), Color.GREEN));
        //this.m_btnMo.setTip('不怀好意的向对方扔出一枚肥皂，双方获得一定的经验奖励\n剩余次数:' + TextFieldUtil.getColorTipText(string(this.m_cntMo), Color.GREEN));
    }

    ///////////////////////////////////////// 事件处理 /////////////////////////////////////////

    private _onBtnMoClick(): void {
        let target = G.UnitMgr.SelectedUnit;

        if (target == null || target.Data.unitType != UnitCtrlType.role) {
            G.TipMgr.addMainFloatTip('请选择一个合适的目标');
            return;
        }
        let roleData = target.Data as RoleData;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_BATHE, Macros.ACTIVITY_BATHE_REQ, Macros.BATHE_WIPING_SOAP_TYPE, roleData.roleID));

        this.m_cd = 5;
        this.m_cntMo--;
        this._onTimeCallBack();
        this.addTimer("1", 1000, 0, this._onTimeCallBack);
    }

    private _onBtnPoClick(): void {
        let target = G.UnitMgr.SelectedUnit;

        if (target == null || target.Data.unitType != UnitCtrlType.role) {
            G.TipMgr.addMainFloatTip('请选择一个合适的目标');
            return;
        }
        let roleData = target.Data as RoleData;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_BATHE, Macros.ACTIVITY_BATHE_REQ, Macros.BATHE_SPLASH_WATER_TYPE, roleData.roleID));

        this.m_cd = 5;
        this.m_cntPo--;
        this._onTimeCallBack();
        this.addTimer("1", 1000, 0, this._onTimeCallBack);
    }

    private _onBtnCuoClick(): void {
        let target = G.UnitMgr.SelectedUnit;

        if (target == null || target.Data.unitType != UnitCtrlType.role) {
            G.TipMgr.addMainFloatTip('请选择一个合适的目标');
            return;
        }
        let roleData = target.Data as RoleData;
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getDoActivityRequest(Macros.ACTIVITY_ID_BATHE, Macros.ACTIVITY_BATHE_REQ, Macros.BATHE_BACK_RUBS_TYPE, roleData.roleID));

        this.m_cd = 5;
        this.m_cntCuo--;
        this._onTimeCallBack();
        this.addTimer("1", 1000, 0, this._onTimeCallBack);
    }

    private _onTimeCallBack(): void {
        if (this.m_cd > 0) {
            this.m_cuoCD.text = DataFormatter.second2mmss(this.m_cd);
            this.m_moCD.text = DataFormatter.second2mmss(this.m_cd);
            this.m_poCD.text = DataFormatter.second2mmss(this.m_cd);
        }
        else {
            this.m_cuoCD.text = '';
            this.m_moCD.text = '';
            this.m_poCD.text = '';
        }

        this.m_cd--;

        this._updateEnable();
        if (this.m_cd < 0) {
            this.removeTimer("1");
        }
    }

    ///////////////////////////////////////// 面板显示 /////////////////////////////////////////

    updateCnt(type: number, cnt: number): void {
        if (type == Macros.BATHE_BACK_RUBS_TYPE) {
            this.m_cntCuo = cnt;
        }
        else if (type == Macros.BATHE_SPLASH_WATER_TYPE) {
            this.m_cntPo = cnt;
        }
        else if (type == Macros.BATHE_WIPING_SOAP_TYPE) {
            this.m_cntMo = cnt;
        }

        this._updateEnable();
    }

    /**
     * 更新各个参数
     * @param cntMo
     * @param cntPo
     * @param cntCuo
     * 
     */
    updateView(cnt: number[]): void {
        this.m_cntCuo = 5 - cnt[Macros.BATHE_BACK_RUBS_TYPE];
        this.m_cntPo = 5 - cnt[Macros.BATHE_SPLASH_WATER_TYPE];
        this.m_cntMo = 5 - cnt[Macros.BATHE_WIPING_SOAP_TYPE];

        this._updateEnable();
    }

    public setActive(value: boolean) {
        this.form.SetActive(value);
    }
}