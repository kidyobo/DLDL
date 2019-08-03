import { Global as G } from 'System/global'
import { CommonForm, UILayer } from 'System/uilib/CommonForm'
import { UIPathData } from 'System/data/UIPathData'
import { KeyWord } from 'System/constants/KeyWord'
import { WorldCupActView } from 'System/activity/worldCupAct/WorldCupActView'

export class WorldCupGuanJunJingCaiView extends CommonForm {
    private eight_Image: UnityEngine.UI.Image[] = [];
    private quarter_Image: UnityEngine.UI.Image[] = [];
    private two_Image: UnityEngine.UI.Image[] = [];
    private guanJunImage: UnityEngine.UI.Image;

    /**竞猜信息 */
    private eight_GameInfo: Protocol.DBWCupChampionRoleOneBetInfo[] = [];
    private quarter_GameInfo: Protocol.DBWCupChampionRoleOneBetInfo[] = [];
    private two_GameInfo: Protocol.DBWCupChampionRoleOneBetInfo[] = [];
    private guanJun_GameInfo: Protocol.DBWCupChampionRoleOneBetInfo;

    constructor() {
        super(0);
    }

    layer(): UILayer {
        return UILayer.Second;
    }

    protected resPath(): string {
        return UIPathData.WorldCupGuanJunJingCaiView;
    }
    
    protected initElements() {
        super.initElements();
        let eight_Transform = this.elems.getElement("eight_Countrys");
        let eightNum = eight_Transform.transform.childCount;
        for (let i = 0; i < eightNum; i++) {
            this.eight_Image[i] = eight_Transform.transform.GetChild(i).GetComponent(UnityEngine.UI.Image.GetType()) as UnityEngine.UI.Image;
        }
        let quarter_Transform = this.elems.getElement("quarter_Countrys");
        let quarterNum = quarter_Transform.transform.childCount;
        for (let i = 0; i < quarterNum; i++) {
            this.quarter_Image[i] = quarter_Transform.transform.GetChild(i).GetComponent(UnityEngine.UI.Image.GetType()) as UnityEngine.UI.Image;
        }
        let two_Transform = this.elems.getElement("two_Countrys");
        let twoNum = two_Transform.transform.childCount;
        for (let i = 0; i < twoNum; i++) {
            this.two_Image[i] = two_Transform.transform.GetChild(i).GetComponent(UnityEngine.UI.Image.GetType()) as UnityEngine.UI.Image;
        }
        let guanJunTransform = this.elems.getElement("guanJun_Country");
        this.guanJunImage = guanJunTransform.transform.GetChild(0).GetComponent(UnityEngine.UI.Image.GetType()) as UnityEngine.UI.Image;
    }

    protected initListeners() {
        super.initListeners();
        this.addClickListener(this.elems.getElement("btnClose"), this.onClickBtnClose);
        this.addClickListener(this.elems.getElement("mask"), this.onClickBtnClose);
    }

    protected onOpen() {
        super.onOpen();
        this.updateView();
    }

    updateView() {
        let activityData = G.DataMgr.activityData;
        let panelData = activityData.worldCupChampionPanelData;
        if (panelData.m_ucNum == 0 || panelData.m_astGameInfo == null) return;
        for (let i = 0; i < panelData.m_ucNum; i++) {
            let gameInfo = panelData.m_astGameInfo[i];
            let gameLunci = activityData.worldCupChampionId2CfgMap[gameInfo.m_iGameID].m_bLunci;
            if (gameLunci == KeyWord.WORLDCPU_CHAMPION_ROUND_1) {
                this.eight_GameInfo.push(gameInfo);
            } else if (gameLunci == KeyWord.WORLDCPU_CHAMPION_ROUND_2) {
                this.quarter_GameInfo.push(gameInfo);
            } else if (gameLunci == KeyWord.WORLDCPU_CHAMPION_ROUND_3) {
                this.two_GameInfo.push(gameInfo);
            } else if (gameLunci == KeyWord.WORLDCPU_CHAMPION_ROUND_4) {
                this.guanJun_GameInfo = gameInfo;
            }
        }

        let eightNum = this.eight_GameInfo.length;
        for (let i = 0; i < eightNum; i++) {
            let teamDes = activityData.countryIndexId2CfgMap[this.eight_GameInfo[i].m_iRoleBetTeamID].m_szDesc;
            this.eight_Image[i].sprite = WorldCupActView.CountryAltas2.Get(teamDes);
        }
        let quarterNum = this.quarter_GameInfo.length;
        for (let i = 0; i < quarterNum; i++) {
            let teamDes = activityData.countryIndexId2CfgMap[this.quarter_GameInfo[i].m_iRoleBetTeamID].m_szDesc;
            this.quarter_Image[i].sprite = WorldCupActView.CountryAltas2.Get(teamDes);
        }
        let twoNum = this.two_GameInfo.length;
        for (let i = 0; i < twoNum; i++) {
            let teamDes = activityData.countryIndexId2CfgMap[this.two_GameInfo[i].m_iRoleBetTeamID].m_szDesc;
            this.two_Image[i].sprite = WorldCupActView.CountryAltas2.Get(teamDes);
        }
        if (this.guanJun_GameInfo != null) {
            let guanJunDes = activityData.countryIndexId2CfgMap[this.guanJun_GameInfo.m_iRoleBetTeamID].m_szDesc;
            this.guanJunImage.sprite = WorldCupActView.CountryAltas2.Get(guanJunDes);
        }
    }

    private onClickBtnClose() {
        this.close();
    }
}