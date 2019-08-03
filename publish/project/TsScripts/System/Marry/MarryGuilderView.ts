import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { QiuHunView } from 'System/Marry/QiuHunView'
import { LiHunView } from 'System/Marry/LiHunView'
import { KeyWord } from 'System/constants/KeyWord'
import { Global as G } from 'System/global'
import { MarryQiuYuanRecordView } from 'System/Marry/MarryQiuYuanRecordView'
import { MallView } from 'System/business/view/MallView'
import { EnumStoreID } from "System/constants/GameEnum"



export class MarryGuilderView extends CommonForm {

    private btn_marry: UnityEngine.GameObject;
    private btn_marryStore: UnityEngine.GameObject;
    private btn_marryBreak: UnityEngine.GameObject;
    private btn_qiuYuan: UnityEngine.GameObject;
    private marryLimitLevel: number = 0;

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    open() {
        super.open();
    }

    layer(): UILayer {
        return UILayer.Chat;
    }


    protected resPath(): string {
        return UIPathData.MarryGuilderView;
    }

    protected initElements() {
        this.btn_marry = this.elems.getElement('btn_marry');
        this.btn_marryBreak = this.elems.getElement('btn_marryBreak');
        this.btn_marryStore = this.elems.getElement('btn_marryStore');
        this.btn_qiuYuan = this.elems.getElement('btn_qiuYuan');
    }


    protected initListeners() {
        this.addClickListener(this.elems.getElement('mask'), this.close);
        this.addClickListener(this.elems.getElement('btn_return'), this.close);
        this.addClickListener(this.btn_marry, this.onClickBtnMarry);
        this.addClickListener(this.btn_marryBreak, this.onClickBtnMarryBreak);
        this.addClickListener(this.btn_marryStore, this.onClickBtnMarryStore);
        this.addClickListener(this.btn_qiuYuan, this.onClickBtnQiuYuan);
    }

    protected onOpen() {
        let config = G.DataMgr.funcLimitData.getFuncLimitConfig(KeyWord.BAR_FUNCTION_XIANYUAN);
        if (config != null) {
            this.marryLimitLevel = config.m_ucLevel;
        }
    }

    protected onClose() {

    }


    private onClickBtnMarry() {
        let heroData = G.DataMgr.heroData;
        if (heroData.mateName != '') {
            G.TipMgr.addMainFloatTip('您已经有仙侣了');
            return;
        }
        let openLevel = this.marryLimitLevel;
        if (G.DataMgr.teamData.hasTeam && G.DataMgr.teamData.memberList.length == 1) {
            let target = G.DataMgr.teamData.memberList[0];
            if (heroData.level >= openLevel && target.m_usLevel >= openLevel) {
                this.close();
                G.Uimgr.createForm<QiuHunView>(QiuHunView).open();
                return;
            }
        }
        G.TipMgr.addMainFloatTip(uts.format('需要双方单独组队并且都达到{0}级', openLevel));
    }

    private onClickBtnMarryBreak() {
        if (G.DataMgr.heroData.mateName != "") {
            this.close();
            G.Uimgr.createForm<LiHunView>(LiHunView).open();
        }
        else {
            G.TipMgr.addMainFloatTip('您当前还没有仙侣');
        }
    }

    private onClickBtnMarryStore() {
        G.Uimgr.createForm<MallView>(MallView).open(EnumStoreID.Marry);
    }


    private onClickBtnQiuYuan() {
        if (G.DataMgr.heroData.level < this.marryLimitLevel) {
            G.TipMgr.addMainFloatTip(uts.format("需要达到{0}级才能求缘", this.marryLimitLevel));
            return;
        }
        G.Uimgr.createForm<MarryQiuYuanRecordView>(MarryQiuYuanRecordView).open();
    }


}
