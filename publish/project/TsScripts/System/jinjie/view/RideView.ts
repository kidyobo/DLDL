import { Global as G } from 'System/global'
import { IGuideExecutor } from 'System/guide/IGuideExecutor'
import { ZhufuRideBaseView } from 'System/hero/view/ZhufuRideBaseView'
import { KeyWord } from 'System/constants/KeyWord';
import { UnitCtrlType, EnumGuide } from "System/constants/GameEnum"
import { MountEnhanceGuider } from 'System/guide/cases/MountEnhanceGuider'
import { ElemFinder } from 'System/uilib/UiUtility'
import { UIPathData } from 'System/data/UIPathData'

export class RideView extends ZhufuRideBaseView implements IGuideExecutor {

    constructor() {
        super(KeyWord.HERO_SUB_TYPE_ZUOQI, false, 0, null);
    }
    protected initElements(): void {
        super.initElements();
        this.setTitile("坐骑");
        this.modelRoot = this.elems.getElement("modelRoot1");
        this.y = 223;
        //关闭“幻化”功能
        //this.CloseEvolveButton();

    }
    protected resPath(): string {
        return UIPathData.ZhuFuRideView;
    }
    protected getModelType(): UnitCtrlType {
        return UnitCtrlType.ride;
    }
    protected getModelUrl(id: number): string {
        return id.toString();
    }

    protected getEquipPart(): number[] {
        return [KeyWord.ZQ_EQUIP_PARTCLASS_1, KeyWord.ZQ_EQUIP_PARTCLASS_2, KeyWord.ZQ_EQUIP_PARTCLASS_3, KeyWord.ZQ_EQUIP_PARTCLASS_4];
    }

    protected getTeShuTeQuanDes(): string {
        return ''
    }

    protected getVipBaiJinBaiFenBi(): number {
        let str = this.getNum();
        if (str == '') {
            return 0;
        }
        return Number(str) / 100;
    }


    //vip白金
    protected getVipBaiJinActive(): boolean {
        return false;
        //let status = G.DataMgr.heroData.getPrivilegeState(KeyWord.VIPPRI_3);
        //let level = G.DataMgr.heroData.curVipLevel;
        //if (status >= 0 && level > 3) {
        //    return true;
        //} else {
        //    return false;
        //}
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


    protected onOpen() {
        super.onOpen();

        // 进行下一步指引
        G.GuideMgr.processGuideNext(EnumGuide.MountEnhance, EnumGuide.FunctionGuide_ClickHero);
    }

    /**关闭幻化功能  就是先把按钮隐藏掉 */
    private CloseEvolveButton() {
        let btnEvolve = ElemFinder.findObject(this.funcGroup.gameObject, "btnHH");
        btnEvolve.SetActive(false);
    }

    ////////////////////////////////////////////// 引导 //////////////////////////////////////////////

    force(type: EnumGuide, step: EnumGuide, ...args): boolean {
        if (EnumGuide.MountEnhance_ClickAutoEnhance == step) {
            this.onAutoClick();
            return true;
        }
        return false;
    }
}
export default RideView;