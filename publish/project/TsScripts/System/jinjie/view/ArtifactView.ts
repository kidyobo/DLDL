import { Global as G } from 'System/global'
import { ZhuFuBaseView } from 'System/hero/view/ZhuFuBaseView'
import { KeyWord } from 'System/constants/KeyWord';
import { UnitCtrlType } from "System/constants/GameEnum";
import { ZhufuArtifactBaseView } from 'System/hero/view/ZhufuArtifactBaseView'
/**
 * 神器。
 */
export class ArtifactView extends ZhufuArtifactBaseView {
    constructor() {
        super(KeyWord.HERO_SUB_TYPE_WUHUN);
    }
    protected initElements(): void {
        super.initElements();
        this.setTitile("神器");
    }
    protected onOpen() {
        if (G.DataMgr.heroData.profession == KeyWord.PROFTYPE_HUNTER) {
            this.modelRoot = this.elems.getElement("modelRoot2_women");
        } else {
            this.modelRoot = this.elems.getElement("modelRoot2_man");
        }
        this.modelRoot.SetActive(true);
        super.onOpen();
    }
    protected getModelType(): UnitCtrlType {
        return UnitCtrlType.weapon;
    }
    protected getModelUrl(id: number): string {
        return id.toString() + "_" + G.DataMgr.heroData.profession;
    }

    protected getEquipPart(): number[] {
        return [KeyWord.WH_EQUIP_PARTCLASS_1, KeyWord.WH_EQUIP_PARTCLASS_2, KeyWord.WH_EQUIP_PARTCLASS_3, KeyWord.WH_EQUIP_PARTCLASS_4];
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
export default ArtifactView;