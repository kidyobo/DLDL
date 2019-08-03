import { Global as G } from 'System/global'
import { ZhuFuBaseView } from 'System/hero/view/ZhuFuBaseView'
import { KeyWord } from 'System/constants/KeyWord';
import { UnitCtrlType } from "System/constants/GameEnum";
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"

/**
 * 终极神器展示
 */
export class ShenQiZhongJiView extends CommonForm {
    private modelRoot: UnityEngine.GameObject;
    private fullLevelScore: UnityEngine.UI.Text;
    private oldmodelURL: string;
    private zhanli: string;
    private maxCfg: GameConfig.ZhuFuImageConfigM ;
    constructor() {
        super(0);
    }
    protected initElements(): void {

        this.modelRoot = this.elems.getElement("modelRoot2");
        this.fullLevelScore = this.elems.getText("fullLevelScore");
    }
    protected initListeners(): void {

        this.addClickListener(this.elems.getElement("mask"), this.onClose);
        this.addClickListener(this.elems.getElement("btnClose"), this.onClose);
    }
    open(maxCfg: GameConfig.ZhuFuImageConfigM,zhanli:string) {
        this.maxCfg = maxCfg;
        this.zhanli = zhanli;
        super.open();

    }
    protected onOpen() {
        this.lateLoadModel();
        this.fullLevelScore.text = this.zhanli;
    }
    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.ShenQiEndView;
    }



    public lateLoadModel() {
      
        let modelUrl = this.getModelUrl(this.maxCfg.m_iModelID);
        G.ResourceMgr.loadModel(this.modelRoot, UnitCtrlType.weapon, modelUrl, this.sortingOrder, true);


    }


    protected getModelUrl(id: number): string {
        return id.toString() + "_" + G.DataMgr.heroData.profession;
    }

    protected onClose() {
        this.close();
    }

}
