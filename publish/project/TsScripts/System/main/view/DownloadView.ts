import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { UIPathData } from "System/data/UIPathData"
import { Global as G } from "System/global"
import { List } from "System/uilib/List"
import { Macros } from 'System/protocol/Macros'
import { DropPlanData } from "System/data/DropPlanData"
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { MainView } from "System/main/view/MainView";

export class DownloadView extends CommonForm {

    public static manualContinue: boolean = false;

    private readonly TickTimerKey = 'download';

    private autoDownloadRequest: Game.DownloadRequest;
    private progressText: UnityEngine.UI.Text;
    private progressImage: UnityEngine.UI.Image;
    private rewardList: List;
    private BT_Get: UnityEngine.GameObject;
    private BT_Pause: UnityEngine.GameObject;
    private awardedTip: UnityEngine.GameObject;

    private itemIcon_Normal: UnityEngine.GameObject;


    layer(): UILayer {
        return UILayer.Normal;
    }

    protected resPath(): string {
        return UIPathData.DownloadView;
    }

    protected initElements() {
        this.itemIcon_Normal = this.elems.getElement("itemIcon_Normal");
        this.progressText = this.elems.getText("progressText");
        this.progressImage = this.elems.getImage("progressImage");
        this.BT_Get = this.elems.getElement("BT_Get");
        this.BT_Pause = this.elems.getElement("BT_Pause");
        this.awardedTip = this.elems.getElement("awardedTip");

        this.rewardList = this.elems.getUIList("rewardList");
        this.BT_Get.SetActive(false);
    }


    protected initListeners() {
        this.addClickListener(this.BT_Get, this.onClickGet);
        this.addClickListener(this.BT_Pause, this.onClickPause);
        this.addClickListener(this.elems.getElement("BT_Close"), this.close);
        this.addClickListener(this.elems.getElement("mask"), this.close);
    }

    protected onOpen() {
        G.ViewCacher.mainView.setViewEnable(false);
        this.addTimer(this.TickTimerKey, 1000, 0, this.onUpdateTimer);
        this.autoDownloadRequest = G.ViewCacher.mainView.autoDownloadRequest;
        this.onUpdateTimer();

        //加载列表
        let drop: GameConfig.DropConfigM = DropPlanData.getDropPlanConfig(Macros.APP_DOWN_GIFT_DROPID);
        this.rewardList.Count = drop.m_ucDropThingNumber;

        for (let i = 0; i < drop.m_ucDropThingNumber; i++) {
            let rewardItem = this.rewardList.GetItem(i);

            let iconItem: IconItem = new IconItem();
            if (rewardItem != null) {
                iconItem.setUsualIconByPrefab(this.itemIcon_Normal, rewardItem.gameObject);
                iconItem.updateByDropThingCfg(drop.m_astDropThing[i]);
                iconItem.updateIcon();
                iconItem.setTipFrom(TipFrom.normal);
            }

        }
        this.updateStatus();
    }

    protected onClose() {
        G.ViewCacher.mainView.setViewEnable(true);
    }

    private onUpdateTimer() {
        if (this.autoDownloadRequest.isDone) {
            this.removeTimer(this.TickTimerKey);
            this.progressImage.fillAmount = 1;
            this.progressText.text = uts.format("100%");
            this.BT_Pause.SetActive(false);

            this.updateStatus();
        }
        else {
            let progress = this.autoDownloadRequest.progress;
            this.progressImage.fillAmount = progress;
            this.progressText.text = uts.format("{0}%", Math.floor(progress * 100));
        }
    }

    private onClickGet() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getFirstOpenRequest(Macros.FST_APP_DOWN_REWARD))
    }

    private onClickPause() {
        let text = this.BT_Pause.transform.GetChild(0).GetComponent(UnityEngine.UI.Text.GetType()) as UnityEngine.UI.Text;

        if (this.autoDownloadRequest.isLoading) {
            this.autoDownloadRequest.Abort();
            DownloadView.manualContinue = false;
            text.text = "继续";
        }
        else {
            if (UnityEngine.Application.internetReachability != UnityEngine.NetworkReachability.ReachableViaLocalAreaNetwork) {
                DownloadView.manualContinue = true;
            }
            else {
                DownloadView.manualContinue = false;
            }
            G.ViewCacher.mainView.enableAutoDownload(true);
            text.text = "暂停";
        }
        this.updateStatus(true);

        //if (this.autoDownloadRequest.isLoading) {
        //    this.autoDownloadRequest.Abort();
        //    DownloadView.manualContinue = false;
        //}
        //else {
        //    if (UnityEngine.Application.internetReachability != UnityEngine.NetworkReachability.ReachableViaLocalAreaNetwork) {
        //        DownloadView.manualContinue = true;
        //    }
        //    else {
        //        DownloadView.manualContinue = false;
        //    }
        //    G.ViewCacher.mainView.enableAutoDownload(true);
        //}
        //this.updateStatus();
    }

    public updateStatus(isClick: boolean = false) {
        if (G.DataMgr.systemData.onlyOneTimeAllLifeBits & Macros.FST_APP_DOWN_REWARD) {
            this.awardedTip.SetActive(true);
            this.BT_Get.SetActive(false);
        }
        else {
            this.awardedTip.SetActive(false);
            if (this.autoDownloadRequest.isDone) {
                this.BT_Get.SetActive(true);
            }
        }
        if (this.BT_Pause.activeSelf && !isClick) {
            let text = this.BT_Pause.transform.GetChild(0).GetComponent(UnityEngine.UI.Text.GetType()) as UnityEngine.UI.Text;
            if (this.autoDownloadRequest.isLoading) {
                text.text = "暂停";
            }
            else {
                text.text = "继续";
            }
        }
    }
}