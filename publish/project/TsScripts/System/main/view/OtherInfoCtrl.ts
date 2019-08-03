import { Global as G } from 'System/global'
import { UiElements } from 'System/uilib/UiElements'
import { ElemFinder } from 'System/uilib/UiUtility'
import { Macros } from 'System/protocol/Macros'
import { HPAnimBar } from 'System/uilib/HPAnimBar'
import { UIUtils } from 'System/utils/UIUtils'
import { List, ListItem } from 'System/uilib/List'
import { UnitController } from 'System/unit/UnitController'
import { RoleController } from 'System/unit/role/RoleController'
import { MonsterController } from 'System/unit/monster/MonsterController'
import { UnitCtrlType } from 'System/constants/GameEnum'
import { RoleData } from 'System/data/RoleData'
import { BuffIconItem } from 'System/uilib/BuffIconItem'
import { BuffData } from 'System/data/BuffData'
import { RoleAbstract } from 'System/data/vo/RoleAbstract'
import { RoleMenuView, MenuPanelType } from 'System/main/view/RoleMenuView'

export class OtherInfoCtrl {

    private gameObject: UnityEngine.GameObject;
    private roleHeadIcon: UnityEngine.UI.Image;
    private monsterHeadIcon: UnityEngine.UI.RawImage;       //boss的头像 @jackson 头像固定一个，不加载boss头像变换了
    private roleHpBar: HPAnimBar;
    private roleLevel: UnityEngine.UI.Text;
    //private hpStage: UnityEngine.UI.Text;
    private oldMonsterHeadID = 0;
    private unitCtrl: UnitController;
    private buffList: List;
    private buffIcons: BuffIconItem[] = [];
    private selectedRoleAbstract: RoleAbstract = new RoleAbstract();

    private buffDesNode: UnityEngine.GameObject;
    private txtBuffDes: UnityEngine.UI.Text;
    private btnCloseBuff: UnityEngine.GameObject;

    setView(uiElems: UiElements) {
        //玩家属性
        let root = uiElems.getElement("selectedInfo");
        this.gameObject = root;
        this.roleHeadIcon = ElemFinder.findImage(root, "roleHeadIcon");
        this.monsterHeadIcon = ElemFinder.findRawImage(root, "monsterHeadIcon");
        this.roleHpBar = new HPAnimBar();
        this.roleHpBar.setView(ElemFinder.findObject(root, "hp"));
        this.roleLevel = ElemFinder.findText(root, "level");
        //this.hpStage = ElemFinder.findText(root, "hpStage");
        this.buffDesNode = ElemFinder.findObject(root, "buffDesNode");
        this.txtBuffDes = ElemFinder.findText(root, "buffDesNode/txtBuffDes");
        this.btnCloseBuff = ElemFinder.findObject(root, "buffDesNode/btnCloseBuff");

        this.buffList = ElemFinder.getUIList(ElemFinder.findObject(root, 'buffList'));
        this.buffList.Count = 0;
        Game.UIClickListener.Get(root).onClick = delegate(this, this.onClickSelectedRole);
        Game.UIClickListener.Get(this.btnCloseBuff).onClick = delegate(this, this.onClickCloseBuff);

        root.SetActive(false);
    }

    onUnitSelected(unitCtrl: UnitController) {
        this.unitCtrl = unitCtrl;
        if (null == unitCtrl) {
            this.gameObject.SetActive(false);
            return;
        }
        if (!this.gameObject.activeSelf) {
            this.gameObject.SetActive(true);
            this.onClickCloseBuff();
            G.ActBtnCtrl.onShowOtherInfo();
        }
        // 显示头像 
        let hpStageNum = 1;
        let showPercent = false;
        if (unitCtrl.Data.unitType == UnitCtrlType.role) //role
        {
            let roleCtrl = unitCtrl as RoleController;
            this.monsterHeadIcon.gameObject.SetActive(false);
            this.roleHeadIcon.enabled = true;
            this.roleHeadIcon.sprite = G.AltasManager.roleHeadAltas.Get(uts.format('{0}_{1}', roleCtrl.Data.profession, roleCtrl.Data.gender));
            let roleData = unitCtrl.Data as RoleData;
            this.selectedRoleAbstract.adaptFromRoleData(roleData);
        }
        else if (unitCtrl.Data.unitType == UnitCtrlType.monster) //monster
        {
            let monsterCtrl = unitCtrl as MonsterController;
            this.monsterHeadIcon.gameObject.SetActive(true);
            this.roleHeadIcon.enabled = false;
            if (monsterCtrl.Config != null) {
                hpStageNum = monsterCtrl.Config.m_usHPColorNumber;
                showPercent = 0 != monsterCtrl.Config.m_ucShowHPPercent;
                if (this.oldMonsterHeadID != monsterCtrl.Config.m_iHeadID) {
                    this.oldMonsterHeadID = monsterCtrl.Config.m_iHeadID;
                    //@jackson boss头像改成固定的
                    //G.ResourceMgr.loadImage(this.monsterHeadIcon, uts.format('images/head/{0}.png', monsterCtrl.Config.m_iHeadID));
                }
            } else {
                G.ResourceMgr.loadImage(this.monsterHeadIcon, null);
            }
            this.selectedRoleAbstract.roleID.m_uiUin = 0;
        }

        this.roleHpBar.setBasic(hpStageNum, showPercent);
        this.updateInfo();
        this.updateBuffList();
    }

    onUnitDataChanged(unitCtrl: UnitController) {
        if (this.unitCtrl == unitCtrl) {
            this.updateInfo();
        }
    }

    onUnitBuffChanged(unitCtrl: UnitController) {
        if (this.unitCtrl == unitCtrl) {
            this.updateBuffList();
        }
    }

    private updateInfo() {
        let name = '';
        let level = this.unitCtrl.Data.getProperty(Macros.EUAI_LEVEL);
        if (level > 0) {
            name += uts.format('{0}级', level);
        }

        let roleData = this.unitCtrl.Data as RoleData;
        if (null != roleData.name) {
            name += '[' + roleData.name + ']';
        }
        this.roleLevel.text = name;
        // 更新血条 ，返回当前血条进行的段数
        let curHpStage: number = this.roleHpBar.setValue(this.unitCtrl.Data.unitID, roleData.getProperty(Macros.EUAI_CURHP), roleData.getProperty(Macros.EUAI_MAXHP));
        //this.hpStage.text = uts.format('x{0}', curHpStage);
    }

    private updateBuffList() {
        let dataList = this.unitCtrl.buffProxy.buffDataList;
        let allBuffIds = dataList.getAllBuffId();
        let cnt = allBuffIds.length;
        this.buffList.Count = cnt;
        let oldItemCnt = this.buffIcons.length;
        for (let i = 0; i < cnt; i++) {
            let iconItem: BuffIconItem;
            if (i < oldItemCnt) {
                iconItem = this.buffIcons[i];
            } else {
                this.buffIcons.push(iconItem = new BuffIconItem());
                iconItem.setUsual(this.buffList.GetItem(i).gameObject);
            }
            let data = dataList.getBuffInfoData(allBuffIds[i]).config;
            Game.UIClickListener.Get(this.buffList.GetItem(i).gameObject).onClick = delegate(this, this.onClick, data.m_szBuffDescription);

            iconItem.updateByIconName(data.m_uiBuffIconID.toString());
            iconItem.updateIcon();
        }
    }

    private onClickSelectedRole() {
        if (this.selectedRoleAbstract.roleID.m_uiUin > 0) {
            G.ViewCacher.roleMenuView.open(this.selectedRoleAbstract, MenuPanelType.fromMain);
        }
    }

    private onClick(des: string) {
        this.buffDesNode.SetActive(true);
        this.txtBuffDes.text = des;
    }

    private onClickCloseBuff() {
        this.buffDesNode.SetActive(false);
    }
}