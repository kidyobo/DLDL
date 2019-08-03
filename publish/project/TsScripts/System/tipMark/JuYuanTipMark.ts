import { Global as G } from 'System/global'
import { BaseTipMark } from 'System/tipMark/BaseTipMark'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { JuYuanUtils } from 'System/juyuan/JuYuanUtils'

export class JuYuanTipMark extends BaseTipMark {
    constructor() {
        super(true);
        this.concernedContainers = [Macros.CONTAINER_TYPE_ROLE_BAG];
        this.concernedFunctions = [KeyWord.OTHER_FUNCTION_JU_YUAN];
        this.sensitiveToHeroLv = true;
        this.sensitiveToJuYuan = true;
        this.sensitiveToZhanDouLi = true;
        this.activeByFunc = KeyWord.OTHER_FUNCTION_JU_YUAN;
    }

    protected doCheck(): boolean {
        return this.getJuYuanTip();
    }

    getJuYuanTip(): boolean {
        //屏蔽掉
        //let isShow = false;
        ////神力
        //if (G.DataMgr.juyuanData.isFullLevel()) {
        //    return false;
        //}
        //let nextCfg: GameConfig.JuYuanCfgM = G.DataMgr.juyuanData.getNextCfg();
        //if (nextCfg != null) {
        //    isShow = JuYuanUtils.isUpgradeGrey(nextCfg);
        //    return isShow;
        //}
        return false;
    }


    get TipName(): string {
        return '神力提升';
    }

    action() {
        G.ActionHandler.executeFunction(KeyWord.OTHER_FUNCTION_JU_YUAN);
    }
}