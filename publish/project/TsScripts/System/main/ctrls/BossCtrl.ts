import { KeyWord } from 'System/constants/KeyWord';
import { Global as G } from 'System/global';
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl';
import { BossView } from 'System/pinstance/boss/BossView';
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil';

export class BossCtrl extends BaseFuncIconCtrl {

    constructor() {
        super(KeyWord.ACT_FUNCTION_BOSS);
        this.data.subTabs = [];
    }

    onStatusChange(): void {
        //uts.log("kingsly boss挑战红点:" +
        //    TipMarkUtil.digong() + "," +
        //    TipMarkUtil.kfhdBoss() + "," +
        //    TipMarkUtil.bossHome() + "," +
        //    //TipMarkUtil.woodsBossTipMark() + "," +
        //    TipMarkUtil.ancientBoss() + "," +
        //    TipMarkUtil.WorldBossTipMark() + "," +
        //    TipMarkUtil.personalBoss() + "," +
        //    TipMarkUtil.multipleBoss()
        //);
        if (TipMarkUtil.digong() ||
            TipMarkUtil.kfhdBoss() ||
            //TipMarkUtil.vipFuBen() ||
            //TipMarkUtil.vipBossTipMark() ||
            TipMarkUtil.bossHome()||
            //TipMarkUtil.woodsBossTipMark() ||
            TipMarkUtil.ancientBoss() ||
            //TipMarkUtil.mingJiang() ||
            TipMarkUtil.WorldBossTipMark()||
            TipMarkUtil.personalBoss() ||/*个人Boss*/
            TipMarkUtil.multipleBoss()) {
            // 显示数字图标
            this.data.tipCount = 1;
        }
        else {
            this.data.tipCount = 0;
        }
    }

    handleClick(): void {
        G.Uimgr.createForm<BossView>(BossView).open();
    }
}