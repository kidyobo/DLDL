import { Global as G } from 'System/global'
import { ProtocolUtil } from 'System/protocol/ProtocolUtil'
import { Macros } from 'System/protocol/Macros'
import { NetModule } from 'System/net/NetModule'
import { KeyWord } from 'System/constants/KeyWord'
import { ElemFinder } from 'System/uilib/UiUtility'
import { List } from 'System/uilib/List'
import { JjrRewardsItemData } from 'System/data/JjrRewardsItemData'
import { UIUtils } from 'System/utils/UIUtils'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'
import { FanLiDaTingView } from 'System/activity/fanLiDaTing/FanLiDaTingView'

export class JJRRewardItem {

    private txtneed1: UnityEngine.UI.Text;
    private txtneed2: UnityEngine.UI.Text;
    private txtGet: UnityEngine.UI.Text;
    private btnGet: UnityEngine.GameObject;
    private btnGo: UnityEngine.GameObject;
    private iconRoot: UnityEngine.GameObject;
    private rewardList: List;
    private iconItems: IconItem[] = [];
    private iconPrefab: UnityEngine.GameObject;
    private vo: JjrRewardsItemData;

    setComponents(go: UnityEngine.GameObject, prefab: UnityEngine.GameObject) {
        this.txtneed1 = ElemFinder.findText(go, "needBg1/txtneed1");
        this.txtneed2 = ElemFinder.findText(go, "needBg2/txtneed2");
        this.txtGet = ElemFinder.findText(go, "btnGet/txtGetLabel");
        this.btnGet = ElemFinder.findObject(go, "btnGet");
        this.btnGo = ElemFinder.findObject(go, "btnGo");
        this.rewardList = ElemFinder.getUIList(ElemFinder.findObject(go, "rewardList"));
        this.iconPrefab = prefab;
        Game.UIClickListener.Get(this.btnGet).onClick = delegate(this, this.onClickGet);
        Game.UIClickListener.Get(this.btnGo).onClick = delegate(this, this.onClickGo);
    }

    updata(vo: JjrRewardsItemData) {
        this.vo = vo;

        //按钮
        if (this.vo.m_ucStatus == 1) {
            this.updataBtnStatus(true);
        }
        else if (this.vo.m_ucStatus == 2) {
            this.updataBtnStatus(false, false);

        }
        else if (this.vo.m_ucStatus == 3) {
            this.updataBtnStatus(false, true);
        }
        //描述
        let cfg = this.vo.cfg;
        let strType: string = KeyWord.getDesc(KeyWord.GROUP_STAGEDAY_TYPE, cfg.m_ucType);
        if (cfg.m_uiCondition == 1){
            this.txtneed1.text = '登录即可领取';//uts.format('{0}激活', strType);
            //this.txtneed2.text = uts.format('登录即可领取', cfg.m_uiCondition);
        }
        else if (cfg.m_ucType == KeyWord.STAGEDAY_STRENG) {
            this.txtneed1.text = uts.format('全身{0}', strType);
            this.txtneed2.text = uts.format('+{0}可领取', cfg.m_uiCondition);
        }
        else if (cfg.m_ucType == KeyWord.STAGEDAY_BEAUTY) {
            this.txtneed1.text = uts.format('任一{0}达到', strType);
            this.txtneed2.text = uts.format('{0}阶可领取', cfg.m_uiCondition);
        }
        else {
            this.txtneed1.text = uts.format('今日{0}达到', strType);
            this.txtneed2.text = uts.format('{0}阶可领取', cfg.m_uiCondition);
        }
        //物品图标，数量的显示
        let rcnt = cfg.m_stItemList.length;
        let oldIconCnt = this.iconItems.length;
        this.rewardList.Count = rcnt;
        for (let i = 0; i < rcnt; i++) {
            let iconItem: IconItem;
            if (i < oldIconCnt) {
                iconItem = this.iconItems[i];
            } else {
                this.iconItems.push(iconItem = new IconItem());
                iconItem.setUsualIconByPrefab(this.iconPrefab, this.rewardList.GetItem(i).gameObject);
                iconItem.setTipFrom(TipFrom.normal);
            }
            let rcfg = cfg.m_stItemList[i];
            iconItem.updateById(rcfg.m_uiOne, rcfg.m_uiTwo);
            iconItem.updateIcon();
        }
    }

    private onClickGet() {
        if (!this.vo) {
            return;
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getKfhdRequest(Macros.GET_STAGEDAY_REWARD, this.vo.cfg.m_iID));
    }

    private onClickGo() {
        if (G.ActionHandler.executeFunction(this.vo.cfg.m_iFunction)) {
            G.Uimgr.closeForm(FanLiDaTingView);
        }
    }

    private updataBtnStatus(isGo: boolean, hasGet: boolean = true) {
        this.btnGo.SetActive(isGo);
        this.btnGet.SetActive(!isGo);
        this.txtGet.text = hasGet ? "已领取" : "可领取";
        UIUtils.setButtonClickAble(this.btnGet, !hasGet);
    }

}