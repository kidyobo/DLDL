import { Global as G } from "System/global"
import { UIPathData } from 'System/data/UIPathData'
import { TabSubForm } from 'System/uilib/TabForm'
import { ProtocolUtil } from "System/protocol/ProtocolUtil"
import { ElemFinder } from 'System/uilib/UiUtility'
import { List, ListItem } from 'System/uilib/List'
import { TeamView } from "System/team/TeamView"
import { EnumTeamTab } from "System/team/TeamView"
import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { FixedList } from 'System/uilib/FixedList'
import { MyTeamView } from 'System/team/MyTeamView'


/**队伍信息 */
class TeamData {
    teamInfo: Protocol.NearTeamInfo;
    teamAllInfo: Protocol.TeamMemberInfoForNotify[];

    constructor(data: Protocol.NearTeamInfo, alldata: Protocol.TeamMemberInfoForNotify[]) {
        this.teamInfo = data;
        this.teamAllInfo = alldata;
    }
}

/**界面小图标类 */
class listTypeItem {
    panel: UnityEngine.GameObject;
    /**职业图集 职业图片替换时，要注意名字的更改*/
    private professionAltas: Game.UGUIAltas;
    /**职业图片前缀*/
    private readonly professionPrefix: string = "job_";

    private imgDown: UnityEngine.UI.Image;
    private imgUp: UnityEngine.UI.Image;
    private txtLv: UnityEngine.UI.Text;

    setComponents(go: UnityEngine.GameObject, altas: Game.UGUIAltas) {
        this.panel = go;
        this.imgDown = ElemFinder.findImage(go, "imgDown");
        this.imgUp = ElemFinder.findImage(go, "imgUp");
        this.txtLv = ElemFinder.findText(go, "txtLv");
        this.professionAltas = altas;
    }

    update(data: Protocol.TeamMemberInfoForNotify) {
        if (data == null) {
            //没有成员
            this.txtLv.text = "";
            this.imgUp.enabled = false;
        }
        else {
            //有成员
            this.txtLv.text = data.m_usLevel.toString();
            this.imgUp.enabled = true;
            this.imgUp.sprite = this.professionAltas.Get(this.professionPrefix + data.m_ucProfessionType);
        }
    }
}

export class NearTeamView extends CommonForm {
    /**职业类型图标图集*/
    professionAltas: Game.UGUIAltas;

    /**附近队伍，最大可显示*/
    private readonly maxTeamCount = 20;

    /**附近队伍信息*/
    private nearTeamData: Protocol.NearTeamInfo[];
    /**显示附近的队伍*/
    private objContent: UnityEngine.GameObject = null;
    /**刷新按钮*/
    private btnShuaXin: UnityEngine.GameObject = null;
    private btnCreate: UnityEngine.GameObject;
    private btnMatching: UnityEngine.GameObject;

    private teamList: List;

    private mask: UnityEngine.GameObject;
    private btnReturn: UnityEngine.GameObject;

    //constructor() {
    //    super(EnumTeamTab.NearTeam);
    //}

    layer(): UILayer {
        return UILayer.Normal;
    }

    constructor(id: number) {
        super(id);
        this.closeSound = null;
    }

    protected resPath(): string {
        return UIPathData.NearTeamView;
    }
    protected onClose() {

    }

    protected initElements(): void {
        this.professionAltas = this.elems.getElement("professionAltas").GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;

        this.objContent = this.elems.getElement("objContent");
        this.btnShuaXin = this.elems.getElement("btnShuaXin");
        this.btnCreate = this.elems.getElement("btnCreatTeam");
        this.btnMatching = this.elems.getElement("btnMatching");
        this.teamList = this.elems.getUIList("teamList");

        this.mask = this.elems.getElement("mask");
        this.btnReturn = this.elems.getElement("btnReturn");
    }

    protected initListeners(): void {
        this.addClickListener(this.btnShuaXin, this.OnShuaXinClick);
        this.addClickListener(this.btnCreate, this.OnCreateClick);
        this.addClickListener(this.btnMatching, this.OnMatchingClick);


        this.addClickListener(this.mask, this.close);
        this.addClickListener(this.btnReturn, this.close);

    }


    protected onOpen() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTeamInfoRequest());
    }

    /**刷新 */
    private OnShuaXinClick() {
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getTeamInfoRequest());
    }
    /**创建队伍 */
    private OnCreateClick() {
        let teamview = G.Uimgr.createForm<MyTeamView>(MyTeamView);
        teamview.open();
        //teamview.createTeamButton();
    }
    /**直接匹配 */
    private OnMatchingClick() {
        if (G.DataMgr.teamData.m_nearTeamInfo == null) {
            G.TipMgr.addMainFloatTip("附近没有可加入的队伍");
            return;
        } else {
            for (let i = 0; i < G.DataMgr.teamData.m_nearTeamInfo.length; i++) {
                if (G.DataMgr.teamData.m_nearTeamInfo[i].m_stTeamRestriction.m_ucCanOtherJoin == 1) {
                    if (G.DataMgr.teamData.hasTeam) {
                        G.TipMgr.addMainFloatTip('您已经有队伍了！');
                        return;
                    }
                    else {
                        G.ActionHandler.joinTeam(G.DataMgr.teamData.m_nearTeamInfo[i].m_stRoleID);
                        G.Uimgr.createForm<MyTeamView>(MyTeamView).open();
                    }
                }
            }
        }
    }

    /**
     *刷新附近队伍的信息
     * @param data1 附近队伍信息    
     */
    updateView(): void {
        let data = G.DataMgr.teamData.m_nearTeamInfo;
        let alldata = G.DataMgr.teamData.memberList;
        //最大显示多少
        if (data == null) {
            this.teamList.Count = 0;
            return;
        }
        let maxCount = data.length > this.maxTeamCount ? this.maxTeamCount : data.length;
        this.teamList.Count = maxCount;
        for (let i = 0; i < maxCount; i++) {
            let item = this.teamList.GetItem(i);
            //this.addTxtInfo(item, data[i], data[i].m_stBaseInfo.m_szNickName, data[i].m_usLevel, data[i].m_uiCaptainFight, data[i].m_ucMemberNum, i);
            //let teamdata: TeamData = new TeamData(data[i], alldata);
            this.addTeamInfo(item, data[i], alldata);
        }
    }

    private addTeamInfo(item: ListItem, /*data: TeamData ,*/ data: Protocol.NearTeamInfo, alldata: Protocol.TeamMemberInfoForNotify[]) {
        let imgPhoto = ElemFinder.findImage(item.gameObject, "imgPhoto");
        let txtLv = ElemFinder.findText(item.gameObject, "imgPhoto/txtLv");
        let txtHeroName = ElemFinder.findText(item.gameObject, "imgPhoto/txtHeroName");
        let txtFight = ElemFinder.findText(item.gameObject, "imgPhoto/txtFight");
        let btnJoin = ElemFinder.findObject(item.gameObject, 'btnJoin');
        let go = ElemFinder.findObject(item.gameObject, "list");
        let list = ElemFinder.getUIFixedList(ElemFinder.findObject(item.gameObject, "list"));
        let listdata: listTypeItem[] = [];
        for (let i = 0; i < list.Count; i++) {
            let item = new listTypeItem();
            item.setComponents(list.GetItem(i).gameObject, this.professionAltas);
            listdata.push(item);
        }
        Game.UIClickListener.Get(btnJoin).onClick = delegate(this, this.onClickJoin, data);

        //刷新显示
        let laderInfo = data.m_stBaseInfo;
        imgPhoto.sprite = G.AltasManager.roleHeadAltas.Get(uts.format('{0}_{1}s', laderInfo.m_cProfession, laderInfo.m_cGender));
        txtLv.text = laderInfo.m_usLevel.toString();
        txtHeroName.text = laderInfo.m_szNickName.toString();
        txtFight.text = data.m_uiCaptainFight.toString();
        let count = list.Count;
        for (let i = 0; i < count; i++) {
            listdata[i].update(alldata[i]);
        }
    }



    private addTxtInfo(item: ListItem, data: Protocol.NearTeamInfo, name: string, lv: number, zdl: number, num: number, curNum: number) {
        let txtDuizhang = ElemFinder.findText(item.gameObject, 'txtDuizhang');
        let txtLv = ElemFinder.findText(item.gameObject, 'txtLv');
        let txtZdl = ElemFinder.findText(item.gameObject, 'txtZdl');
        let txtRenShu = ElemFinder.findText(item.gameObject, 'txtRenShu');
        let btnJoin = ElemFinder.findObject(item.gameObject, 'btnJoin');
        /**深浅交替背景*/
        let bg1 = ElemFinder.findObject(item.gameObject, 'bg1');
        let bg2 = ElemFinder.findObject(item.gameObject, 'bg2');
        Game.UIClickListener.Get(btnJoin).onClick = delegate(this, this.onClickJoin, data);
        txtDuizhang.text = name;
        txtLv.text = lv.toString();
        txtZdl.text = zdl.toString();
        txtRenShu.text = num.toString();
        if (curNum % 2 == 0) {
            bg1.SetActive(true);
            bg2.SetActive(false);
        } else {
            bg1.SetActive(false);
            bg2.SetActive(true);
        }
    }


    private onClickJoin(teamData: Protocol.NearTeamInfo) {
        let data: Protocol.NearTeamInfo = teamData;
        if (G.DataMgr.teamData.hasTeam) {
            G.TipMgr.addMainFloatTip('您已经有队伍了！');
            return;
        }
        else {
            G.ActionHandler.joinTeam(data.m_stRoleID);
            G.Uimgr.createForm<MyTeamView>(MyTeamView).open();
        }
    }
}