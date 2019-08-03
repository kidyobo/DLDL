import { Global as G } from 'System/global'
import { NewZhuFuBaseView } from 'System/hero/view/NewZhuFuBaseView'
import { KeyWord } from 'System/constants/KeyWord';
import { UnitCtrlType } from "System/constants/GameEnum";
import { UIPathData } from 'System/data/UIPathData'
/**
 * 圣印。
 * 新 紫极魔瞳
 */
export class ZhenFaView extends NewZhuFuBaseView {
    constructor() {
        super(KeyWord.HERO_SUB_TYPE_FAZHEN, true, 0, null);
    }
    protected resPath(): string {
        return UIPathData.NewZhuFuView;
    }
    protected initElements(): void {
        super.initElements();
        this.setTitile("圣印");
        this.modelRoot = this.elems.getElement("modelRoot3");
        this.setTopTitle(0);
    }
    protected initCentreIco(loop: UnityEngine.UI.Image, ico: UnityEngine.UI.Image) {
        loop.sprite = this.altasIco.Get("KonjacLoop");
        ico.sprite = this.altasIco.Get("Konjac");
    }
    protected initTitleText(equip: UnityEngine.UI.Text, skill: UnityEngine.UI.Text, advance: UnityEngine.UI.Text) {
        equip.text = "魔瞳境界";
        skill.text = "魔瞳技能";
        advance.text = "魔瞳进阶";
    }
    protected getModelType(): UnitCtrlType {
        return UnitCtrlType.zhenfa;
    }
    protected getModelUrl(id: number): string {
        return id.toString();
    }

    protected getEquipPart(): number[] {
        return [KeyWord.FZ_EQUIP_PARTCLASS_1, KeyWord.FZ_EQUIP_PARTCLASS_2, KeyWord.FZ_EQUIP_PARTCLASS_3, KeyWord.FZ_EQUIP_PARTCLASS_4];
    }

    //vip白金
    protected getVipBaiJinActive(): boolean {
        let status = G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_3);
        let level = G.DataMgr.heroData.curVipLevel;
        if (status >= 0 && level > 3) {
            return true;
        } else {
            return false;
        }
    }

    protected getVipBaiJinBaiFenBi(): number {
        let str = this.getNum();
        if (str == '') {
            return 0;
        }
        return Number(str) / 100;
    }


    protected getVipBaiJinDes(): string {
        return this.getNum();
    }

    private getNum(): string {
        let des: string = '';
        let status = G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_3);
        let level = G.DataMgr.heroData.curVipLevel;
        if (status >= 0 && level > 3) {
            if (level >= 4 && level <= 6) {
                des = "5";
            } else if (level >= 7 && level <= 9) {
                des = "10";
            } else {
                des = "15";
            }
        }
        return des;
    }

    protected isShowWanyongJJDTip(): boolean {
        return G.DataMgr.zhufuData.isWanyongJJDTipForZJMT;
    }

    protected setWanyongJJDTip(show: boolean) {
        G.DataMgr.zhufuData.isWanyongJJDTipForZJMT = show;
    }

}
export default ZhenFaView;