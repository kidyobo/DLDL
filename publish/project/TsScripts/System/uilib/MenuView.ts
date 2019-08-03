import { Global as G } from 'System/global'
import { UILayer, CommonForm } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { List, ListItem } from 'System/uilib/List'
import { ElemFinder } from 'System/uilib/UiUtility'
import { ListItemCtrl } from 'System/uilib/ListItemCtrl'
import { MenuNodeKey } from 'System/constants/GameEnum'

export class MenuNodeData {
    key: MenuNodeKey;
    label: string;
    userData: Object;

    constructor(key: MenuNodeKey, label: string = null, userData: Object = null) {
        this.key = key;
        this.label = label;
        this.userData = userData;
    }
}

class MenuNodeItem extends ListItemCtrl {
    private textLabel: UnityEngine.UI.Text;

    gameObject: UnityEngine.GameObject;
    nodeData: MenuNodeData;

    private menuView: MenuView;

    constructor(menuView: MenuView) {
        super();
        this.menuView = menuView;
    }

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;
        this.textLabel = ElemFinder.findText(go, 'textLabel');

        Game.UIClickListener.Get(go).onClick = delegate(this, this.onClick);
    }

    update(nodeData: MenuNodeData, nodeLabel: string) {
        this.nodeData = nodeData;
        this.textLabel.text = nodeLabel;
    }

    private onClick() {
        this.menuView.onClickItem(this.nodeData);
    }
}

export class MenuView extends CommonForm {

    private mask: UnityEngine.GameObject;

    private textName: UnityEngine.UI.Text;
    private textLv: UnityEngine.UI.Text;
    private board: UnityEngine.GameObject;

    private itemClone: UnityEngine.GameObject;
    private items: MenuNodeItem[] = [];

    private roleName: string;
    private desc: string;
    private openNodes: MenuNodeData[];
    private openCallback: (selectedNode: MenuNodeData) => void;

    private menuLabelMap: { [key: number]: string } = {};

    constructor() {
        super(0);

        this.menuLabelMap[MenuNodeKey.ROLE_INFO] = '查看信息';
        this.menuLabelMap[MenuNodeKey.ROLE_TALK] = '开始聊天';
        this.menuLabelMap[MenuNodeKey.ROLE_ADD_FRIEND] = '加为好友';
        this.menuLabelMap[MenuNodeKey.ROLE_BLACK] = '加黑名单';
        this.menuLabelMap[MenuNodeKey.ROLE_FLOWER] = '赠送鲜花';
        this.menuLabelMap[MenuNodeKey.ROLE_COPYNAME] = '复制名字';

        this.menuLabelMap[MenuNodeKey.GUILD_APPLY] = '申请';
        this.menuLabelMap[MenuNodeKey.GUILD_ALLOT] = '分配';
        this.menuLabelMap[MenuNodeKey.GUILD_GET] = '兑换';
        this.menuLabelMap[MenuNodeKey.GUILD_DONATE] = '捐献';
        this.menuLabelMap[MenuNodeKey.GUILD_DISPOSE] = '摧毁';
        this.menuLabelMap[MenuNodeKey.GUILD_SET_VICE] = '任命职位';
        this.menuLabelMap[MenuNodeKey.GUILD_KICK] = '逐出宗门';

        this.menuLabelMap[MenuNodeKey.LH_DECOMPOSE] = '转化';
        this.menuLabelMap[MenuNodeKey.LH_LEVELUP] = '升级';
        this.menuLabelMap[MenuNodeKey.LH_LOCK] = '锁定';
        this.menuLabelMap[MenuNodeKey.LH_UNLOCK] = '解锁';
        this.menuLabelMap[MenuNodeKey.LH_EQUIP] = '装备';
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.MenuView;
    }

    protected initElements() {
        this.textName = this.elems.getText('textName');
        this.textLv = this.elems.getText('textLv');
        this.board = this.elems.getElement('board');

        this.itemClone = this.elems.getElement('itemClone');
        let item = new MenuNodeItem(this);
        item.setComponents(this.itemClone);
        this.items.push(item);

        this.mask = this.elems.getElement('mask');
    }

    protected initListeners() {
        this.addClickListener(this.mask, this.onClickMask);
    }

    open(roleName: string, desc: string, nodes: MenuNodeData[], callback: (selectedNode: MenuNodeData) => void) {
        this.roleName = roleName;
        this.desc = desc;
        this.openNodes = nodes;
        this.openCallback = callback;
        super.open();
    }

    onOpen() {
        this.textName.text = this.roleName;
        this.textLv.text = this.desc;

        let cnt = this.openNodes.length;
        let oldItemCnt = this.items.length;
        for (let i = 0; i < cnt; i++) {
            let item: MenuNodeItem;
            if (i < oldItemCnt) {
                item = this.items[i];
            } else {
                this.items.push(item = new MenuNodeItem(this));
                item.setComponents(UnityEngine.GameObject.Instantiate(this.itemClone, this.itemClone.transform.parent, true) as UnityEngine.GameObject);
            }
            let nodeData = this.openNodes[i];
            item.update(nodeData, null != nodeData.label ? nodeData.label : this.menuLabelMap[nodeData.key]);
            item.gameObject.SetActive(true);
        }
        for (let i = cnt; i < oldItemCnt; i++) {
            let item = this.items[i];
            item.gameObject.SetActive(false);
        }
        this.board.transform.SetSiblingIndex(cnt + 1);
    }

    onClose() {
    }

    onClickItem(nodeData: MenuNodeData) {
        if (null != this.openCallback) {
            this.openCallback(nodeData);
        }
        this.close();
    }

    private onClickMask() {
        this.close();
    }
}