import { Global as G } from 'System/global'
import { NewZhuFuBaseView } from 'System/hero/view/NewZhuFuBaseView'
import { KeyWord } from 'System/constants/KeyWord';
import { UnitCtrlType } from "System/constants/GameEnum";
import { UIPathData } from 'System/data/UIPathData'
/**
 * 真迹
 * 新 鬼影迷踪
 */
export class ShenJiView extends NewZhuFuBaseView {
    constructor() {
        super(KeyWord.HERO_SUB_TYPE_LEILING, true, KeyWord.SPECPRI_SHENJI_ADD, '凌波微步');
    }
    protected resPath(): string {
        return UIPathData.NewZhuFuView;
    }
    protected initElements(): void {
        super.initElements();
        this.setTitile("真迹");
        this.modelRoot = this.elems.getElement("modelRoot4");
        this.setTopTitle(1);
    }
    protected initCentreIco(loop: UnityEngine.UI.Image, ico: UnityEngine.UI.Image) {
        loop.sprite = this.altasIco.Get("GhostLoop");
        ico.sprite = this.altasIco.Get("Ghost");
    }
    protected initTitleText(equip: UnityEngine.UI.Text, skill: UnityEngine.UI.Text, advance: UnityEngine.UI.Text) {
        equip.text = "迷踪境界";
        skill.text = "迷踪技能";
        advance.text = "迷踪进阶";
    }
    protected getModelType(): UnitCtrlType {
        return UnitCtrlType.shenji;
    }
    protected getModelUrl(id: number): string {
        return id.toString();
    }
    
    protected getEquipPart(): number[] {
        return [KeyWord.LL_EQUIP_PARTCLASS_1, KeyWord.LL_EQUIP_PARTCLASS_2, KeyWord.LL_EQUIP_PARTCLASS_3, KeyWord.LL_EQUIP_PARTCLASS_4];
    }

    protected getVipBaiJinBaiFenBi(): number {
        return 0;
    }

    //vip白金
    protected getVipBaiJinActive(): boolean {
        return false;
    }

    protected getVipBaiJinDes(): string {
        return '';
    }

    protected isShowWanyongJJDTip(): boolean {
        return G.DataMgr.zhufuData.isWanyongJJDTipForGYMZ;
    }

    protected setWanyongJJDTip(show: boolean) {
        G.DataMgr.zhufuData.isWanyongJJDTipForGYMZ = show;
    }

}
export default ShenJiView;