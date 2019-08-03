import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { List } from "System/uilib/List"
import { DropPlanData } from 'System/data/DropPlanData'
import { IconItem } from 'System/uilib/IconItem'
import { TipFrom } from 'System/tip/view/TipsView'

export class WeiXinGiftView extends CommonForm 
{
    private rewardList: List;
    private btn_return: UnityEngine.GameObject;
    private mask: UnityEngine.GameObject;
    private readonly dropId: number = 60013102

    constructor()
    {
        super(0);
    }

    layer():UILayer 
    {
        return UILayer.Normal;
    }

    protected resPath(): string 
    {
        return UIPathData.WeiXinGiftView;
    }

    protected initElements()
    {
        this.rewardList = this.elems.getUIList('rewardList');
        this.btn_return = this.elems.getElement('btn_return');
        this.mask = this.elems.getElement('mask');
    }

    protected initListeners()
    {
        this.addClickListener(this.btn_return, this.onClickBtnReturn);
        this.addClickListener(this.mask, this.onClickBtnReturn);
    }

    protected onOpen()
    {
        let dropCfg = DropPlanData.getDropPlanConfig(this.dropId);
        let dropCnt = dropCfg.m_ucDropThingNumber;
        this .rewardList .Count = dropCnt;
        for (let i = 0; i < dropCfg.m_astDropThing.length; i++) {
            let iconItem = new IconItem();
            iconItem.setTipFrom(TipFrom.normal);
            iconItem.setUsuallyIcon(this.rewardList.GetItem(i).gameObject);
            iconItem.updateByDropThingCfg(dropCfg.m_astDropThing[i]);
            iconItem.updateIcon();
        }
    }

    private onClickBtnReturn()
    {
        this.close();
    }
}