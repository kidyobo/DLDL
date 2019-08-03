import { Global as G } from 'System/global'
import { ZhuFuBaseView } from 'System/hero/view/ZhuFuBaseView'
import { KeyWord } from 'System/constants/KeyWord';
import { UnitCtrlType } from "System/constants/GameEnum";
/**
 * 翅膀
 */
export class WingView extends ZhuFuBaseView {
    constructor() {
        super(KeyWord.HERO_SUB_TYPE_YUYI, false, KeyWord.SPECPRI_YUYI_ADD, '凌冽天幕');
    }
    protected initElements(): void {
        super.initElements();
        this.setTitile("翅膀");
        this.modelRoot = this.elems.getElement("modelRoot5");
    }
    protected onOpen() {
        super.onOpen();
    }
    protected getModelType(): UnitCtrlType {
        return UnitCtrlType.wing;
    }
    protected getModelUrl(id: number): string {
        return id.toString();
    }

    protected getEquipPart(): number[] {
        return [KeyWord.YY_EQUIP_PARTCLASS_1, KeyWord.YY_EQUIP_PARTCLASS_2,
        KeyWord.YY_EQUIP_PARTCLASS_3, KeyWord.YY_EQUIP_PARTCLASS_4];
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

}
export default WingView;