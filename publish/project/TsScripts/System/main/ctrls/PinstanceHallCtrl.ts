import { Global as G } from 'System/global'
import { KeyWord } from 'System/constants/KeyWord'
import { BaseFuncIconCtrl } from 'System/main/BaseFuncIconCtrl'
import { PinstanceData } from 'System/data/PinstanceData'
import { FuncBtnState, EnumGuide } from 'System/constants/GameEnum'
import { PinstanceHallView } from 'System/pinstance/hall/PinstanceHallView'
import { JuQingFuBenGuider } from 'System/guide/cases/JuQingFuBenGuider'
import { CaiLiaoFuBenGuider } from 'System/guide/cases/CaiLiaoFuBenGuider'
import { TipMarkUtil } from 'System/tipMark/TipMarkUtil'

/**
 * 副本大厅入口控制器。
 * @author teppei
 *
 */
export class PinstanceHallCtrl extends BaseFuncIconCtrl {
    constructor() {
        super(KeyWord.ACT_FUNC_PINSTANCEHALL);
        this.data.setDisplayName('副本大厅');
        this.data.subTabs = /*PinstanceHallView.FUN_ID_TABS*/[];
    }

    onStatusChange() {
        let needTip = TipMarkUtil.juQingFuBen() || TipMarkUtil.qiangHuaFuBen() || TipMarkUtil.jingYanFuBen() ||
            TipMarkUtil.caiLiaoFuBen() || TipMarkUtil.zuDuiFuBen() || TipMarkUtil.mingWenShiLian() ||
           /* TipMarkUtil.faShenDian() ||*/ TipMarkUtil.jiSuTiaoZhan() || TipMarkUtil.shenxuanzhilu() || TipMarkUtil.wuYuanFuBen();
        this.data.tipCount = needTip ? 1 : 0;
    }

    handleClick() {
        let openTab = 0;
        if (G.GuideMgr.isGuiding(EnumGuide.JuQingFuBen)) {
            openTab = KeyWord.OTHER_FUNCTION_JQFB;
        } else if (G.GuideMgr.isGuiding(EnumGuide.CaiLiaoFuBen)) {
            openTab = KeyWord.OTHER_FUNCTION_CLFB;
        } else if (G.GuideMgr.isGuiding(EnumGuide.WuYuanFuBen)) {
            openTab = KeyWord.OTHER_FUNCTION_WYFB;
        }
        G.Uimgr.createForm<PinstanceHallView>(PinstanceHallView).open(openTab);
    }
}
