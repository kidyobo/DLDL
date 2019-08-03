import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from "System/data/UIPathData"
import { MessageBoxConst, ConfirmCheck } from 'System/tip/TipManager'
import { ThingData } from 'System/data/thing/ThingData'
import { UIRoleAvatar } from 'System/unit/avatar/UIRoleAvatar'
import { Global as G } from 'System/global'

export class JuYuanFashionView extends CommonForm {

    private showId: number = 0;
    private selectedIndex: number = 0;
    private dressNames: string[] = ['旋丹舞者', '神变之身', '界王归来', '创世神'];
    private conditions: string[] = ['旋丹初期', '神变初期', '界王初期', '创世神初期'];
    //时装展示
    private showAvatar: UIRoleAvatar;
    private showModelPos: UnityEngine.Transform;
    private dressTitle: UnityEngine.UI.Text;
    private conditionText: UnityEngine.UI.Text;
    private showAvatarList: Protocol.AvatarList;

    constructor() {
        super(0);
        this.openSound = null;
        this.closeSound = null;
    }

    open(modelId: number, index: number) {
        this.showId = modelId;
        this.selectedIndex = index;
        super.open();
    }

    layer(): UILayer {
        return UILayer.Second;
    }
    
    protected resPath(): string {
        return UIPathData.JuYuanFashionView;
    }

    protected initElements() {
        this.showModelPos = this.elems.getTransform('modelPos');
        this.dressTitle = this.elems.getText('titleText');
        this.conditionText = this.elems.getText('condition');
    }

    protected initListeners() {
        this.addClickListener(this.elems.getElement('mask'), this.close);
        this.addClickListener(this.elems.getElement('btn_return'), this.close);
    }


    protected onOpen() {
        this.dressTitle.text = this.dressNames[this.selectedIndex];
        this.conditionText.text = '激活条件:境界达到' + this.conditions[this.selectedIndex] + '即可激活';
        let dressId = ThingData.getDressImageID(this.showId);
        let heroData = G.DataMgr.heroData;
        this.showAvatarList = uts.deepcopy(heroData.avatarList, this.showAvatarList, true);
        this.showAvatarList.m_uiDressImageID = dressId;
        if (null == this.showAvatar) {
            this.showAvatar = new UIRoleAvatar(this.showModelPos, this.showModelPos);
            this.showAvatar.hasWing = true;
            this.showAvatar.setAvataByList(this.showAvatarList, heroData.profession, heroData.gender);
            this.showAvatar.m_bodyMesh.playAnimation('stand');
            this.showAvatar.m_rebirthMesh.setRotation(10, 0, 0);
            this.showAvatar.setSortingOrder(this.sortingOrder);
        }
    }

    protected onClose() {
        if (null != this.showAvatar) {
            this.showAvatar.destroy();
            this.showAvatar = null;
        }
    }


}
