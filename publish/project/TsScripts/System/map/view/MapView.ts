import { CommonForm, UILayer } from "System/uilib/CommonForm";
import { Global as G } from "System/global";
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { UIPathData } from "System/data/UIPathData"
import { GroupList } from "System/uilib/GroupList"
import { MapSceneConfig } from "System/data/scene/MapSceneConfig"
import { NPCData } from "System/data/NPCData"
import { NpcUtil } from "System/utils/NpcUtil"
import { TinyMapData } from "System/map/view/TinyMapData"
import { MapSignType } from "System/map/view/MapSignType"
import { QuestData } from 'System/data/QuestData'
import { NPCQuestState, PathingState, FindPosStrategy } from "System/constants/GameEnum"
import { ProtocolUtil } from "System/protocol/ProtocolUtil"
import { MonsterData } from "System/data/MonsterData"
import { Constants } from "System/constants/Constants"
import { HeroController } from "System/unit/hero/HeroController"
import { ElemFinder } from 'System/uilib/UiUtility'
import { UnitUtil } from 'System/utils/UnitUtil'
import { List, ListItem } from "System/uilib/List"
import { PinstanceData } from "../../data/PinstanceData";

enum MapRscType {
    Wrong = 0, 
    Exactly, 
    /**用于动态加载地编的副本，以上一个场景配置做为替身 */
    StandIn, 
}

//主界面窗口
export class MapView extends CommonForm {
    public readonly MAPWIDTH = 950;
    public readonly MAPHEIGHT = 750;

    private tabGroup: UnityEngine.UI.ActiveToggleGroup;
    private panelLocal: UnityEngine.GameObject;
    private panelWorld: UnityEngine.GameObject;
    private functionGroup: GroupList;
    private localMapImage: UnityEngine.UI.RawImage = null;
    private heroImage: UnityEngine.GameObject = null;
    private m_hero: HeroController;
    private btnDiDian:UnityEngine.GameObject;
    private btnRenWu:UnityEngine.GameObject;
    private btnGuaiWu:UnityEngine.GameObject;
    private worldSceneIDGroup = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    private m_curSceneConfig: MapSceneConfig;
    private sceneID: number=0;


    private iconPrefab: UnityEngine.GameObject = null;
    private namePrefab: UnityEngine.GameObject = null;
    private altas: Game.UGUIAltas = null;

    private markPanel: UnityEngine.GameObject = null;

    private PathPointPrefab: UnityEngine.GameObject = null;
    private pathPanel: UnityEngine.GameObject = null;

    private PATH_DISTANCE: number = 200;
    private drawPathList: UnityEngine.Vector2[][] = null;
    private drawPathDegreeList: number[][] = null;
    private drawPathGameObjectList: UnityEngine.GameObject[][] = null;
    private drawPathIndex1 = 0;
    private drawPathIndex2 = 0;

    private imageAssetRequest: Game.AssetRequest = null;
    private imageObj: UnityEngine.GameObject;
    private mapTitle: UnityEngine.UI.Text = null;
    private currentMapSign: UnityEngine.GameObject = null;
    private asset: Game.Asset;

    constructor() {
        super(KeyWord.ACT_FUNCTION_WORLDMAP);
    }

    layer(): UILayer {
        return UILayer.Normal;
    }
    protected resPath(): string {
        return UIPathData.MapView;
    }

    protected initElements(): void {
        this.m_hero = G.UnitMgr.hero;
        this.tabGroup = this.elems.getToggleGroup("tabGroup");
        this.panelLocal = this.elems.getElement("panelLocal");
        this.panelWorld = this.elems.getElement("panelWorld");
        this.functionGroup = this.elems.getUIGroupList("functionGroup");
        this.localMapImage = this.elems.getRawImage("localMapRect");
        this.heroImage = this.elems.getElement("heroImage");
        this.mapTitle = this.elems.getText("mapTitle");
        this.currentMapSign = this.elems.getElement("currentMapSign");

        this.iconPrefab = this.elems.getElement("iconPrefab");
        this.namePrefab = this.elems.getElement("namePrefab");
        this.altas = this.elems.getElement("altas").GetComponent(Game.UGUIAltas.GetType()) as Game.UGUIAltas;
        this.PathPointPrefab = this.elems.getElement("PathPointPrefab");
        this.markPanel = this.elems.getElement("markPanel");
        this.pathPanel = this.elems.getElement("pathPanel");
        this.btnDiDian = this.elems.getElement('btnDiDian');
        this.btnGuaiWu = this.elems.getElement('btnGuaiWu');
        this.btnRenWu = this.elems.getElement('btnRenWu');
       
        this.initLocolPanel();
        this.initWorldPanel();
    }

    protected initListeners(): void {
        //this.addClickListener(this.elems.getElement("mask"), this.onBtnReturn);
        this.addClickListener(this.elems.getElement("BT_Close"), this.onBtnReturn);
        this.addToggleGroupListener(this.tabGroup, this.onSwitch);
        this.addClickListener(this.localMapImage.gameObject, this.onMapClick);
        //this.addClickListener(this.tabGroup.GetToggle(0).gameObject, this.onClickLocal);
        this.addClickListener(this.elems.getElement('btnWord'), this.onClickWorld);
        this.addClickListener(this.elems.getElement('btnLocal'), this.onClickLocal);
        //this.addClickListener(this.elems.getElement('btnWord'), this.onClickWorld);
        Game.UIClickListener.Get(this.btnGuaiWu).onClick = delegate(this, this.onBtnList, 0);
        Game.UIClickListener.Get(this.btnRenWu).onClick = delegate(this, this.onBtnList, 1);
        Game.UIClickListener.Get(this.btnDiDian).onClick = delegate(this, this.onBtnList, 2);
      
    }
    private onBtnList(index:number) {
        this.functionGroup.Selected = index;
        let selected0 = ElemFinder.findImage(this.btnGuaiWu, 'selected');
        let selected1 = ElemFinder.findImage(this.btnRenWu, 'selected');
        let selected2 = ElemFinder.findImage(this.btnDiDian, 'selected');
        selected0.gameObject.SetActive(index == 0);
        selected1.gameObject.SetActive(index == 1);
        selected2.gameObject.SetActive(index == 2);
    }

    protected onOpen() {
        this.addTimer("map", 50, 0, this.updateHeroPosition);
        //if (this.tabGroup.Selected == 0) {
        //    this.updateLocalPanel(G.DataMgr.sceneData.curSceneID);
        //}
        this.drawPath();
        this.updateHeroPosition();
        this.updateLocalPanel(G.DataMgr.sceneData.curSceneID);
        this.onBtnList(2);
    }

    protected onClose() {
        this.tabGroup = null;
        if (this.imageAssetRequest != null) {
            this.imageAssetRequest.Abort();
            this.imageAssetRequest = null;
        }
        if (this.asset != null) {
            this.asset.autoCollect = true;
        }
    }

    private onSwitch(index: number) {
        G.AudioMgr.playBtnClickSound();
        if (index == 0) {
            this.updateLocalPanel(G.DataMgr.sceneData.curSceneID);
        }
        else {
            this.updateWorldPanel();
        }
    }

    private onClickLocal() {
        this.onBtnList(2);
        this.updateLocalPanel(G.DataMgr.sceneData.curSceneID);
        this.elems.getElement('btnWord').SetActive(true);
        this.elems.getElement('btnLocal').SetActive(false);
    }
    private onClickWorld() {
        this.updateWorldPanel();
        this.elems.getElement('btnWord').SetActive(false);
        this.elems.getElement('btnLocal').SetActive(true);
    }

    private initLocolPanel() {
        //初始化列表
        this.functionGroup.Count = 3;
        for (let i = 0; i < this.functionGroup.Count; i++) {
            this.functionGroup.GetSubList(i).Count = 0;
        }
        //let friendObj = this.functionGroup.GetItem(0);
        //let findText: string = "citem/text";
        //let normalText = friendObj.findText(findText);
        //normalText.text = "怪物";
        //let enemyObj = this.functionGroup.GetItem(1);
        //let enemyNormalText = enemyObj.findText(findText);
        //enemyNormalText.text = "人物";
        //let blackObj = this.functionGroup.GetItem(2);
        //let blackNormalText = blackObj.findText(findText);
        //blackNormalText.text = "地点";
    }

    private initWorldPanel() {
        //绑定世界面板的按钮
        let len = this.worldSceneIDGroup.length;
        for (let i = 0; i < len; i++) {
            let obj = this.panelWorld.transform.GetChild(i).gameObject;
            this.addClickListener(obj, this.onWorldIconClick);
            obj.name = this.worldSceneIDGroup[i].toString();
        }
    }

    private updateLocalPanel(sceneID: number) {
        this.heroImage.SetActive(false);
        if (this.sceneID != 0 && this.m_curSceneConfig==null) {
            return;
        }
        this.sceneID = sceneID;
        this.m_curSceneConfig = null;
        //首先拉取图片数据
        //加载图片
        this.mapTitle.text = G.DataMgr.sceneData.getSceneName(sceneID);
        this.clearMarks();
        //拉数据配置
        //加载二进制
        if (G.DataMgr.sceneData.curSceneID != this.sceneID) //只去加载非本场景的二进制数据
        {
            G.ModuleMgr.SceneModule.sceneLoadUtil.loadSceneConfigData(this.sceneID);
            this.heroImage.SetActive(false);
            this.pathPanel.SetActive(false);
        }
        else {
            this.onLoadMapConfig(G.DataMgr.sceneData.curSceneConfig);
            this.heroImage.SetActive(true);
            this.pathPanel.SetActive(true);
            G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getIconMonsterRequest(sceneID));
        }
    }

    private updateWorldPanel() {
        this.panelLocal.SetActive(false);
        this.panelWorld.SetActive(true);

        let targetImage = this.panelWorld.transform.Find(G.DataMgr.sceneData.curSceneID.toString());
        if (targetImage == null) {
            this.currentMapSign.SetActive(false);
        }
        else {
            this.currentMapSign.SetActive(true);
            this.currentMapSign.transform.localPosition = targetImage.localPosition;
        }
    }

    private updateHeroPosition() {
        if (this.m_curSceneConfig != null) {
            let heroPos = this.m_hero.getPixelPosition();
            this.heroImage.transform.localPosition = this.getPosInMap(heroPos.x, heroPos.y, G.DataMgr.sceneData.curSceneConfig);

            let directionCache = this.m_hero.getDirection();
            //获取角度
            let angle = UnityEngine.Vector3.Angle(directionCache, UnityEngine.Vector3.left);
            if (directionCache.z > 0) {
                angle = 360 - angle;
            }
            this.heroImage.transform.localRotation = UnityEngine.Quaternion.Euler(0, 0, angle);
            if (G.DataMgr.sceneData.curSceneID != this.sceneID)
            {
                this.heroImage.SetActive(false);
                this.pathPanel.SetActive(false);
            }
            else {
                this.heroImage.SetActive(true);
                this.pathPanel.SetActive(true);
            }

            //将寻路点与玩家移动时间进行对比，移除已经走过的点
            this.updatePath();

        }
    }
    public drawPath() {
        Game.Tools.ClearChildren(this.pathPanel.transform);
        this.drawPathList = [];
        this.drawPathDegreeList = [];
        this.drawPathGameObjectList = [];
        this.drawPathIndex1 = 0;
        this.drawPathIndex2 = 0;
        if (!this.m_hero.isMoving) {
            return;
        }
        let path = this.m_hero.getMovePathForDisplay();
        //将这个路径根据距离重新生成一个数组
        
        let lastPos: UnityEngine.Vector2 = null;
        for (let i = 0, length = path.length; i < length; i++) {
            let pos = path[i];
            this.drawPathList[i] = [];
            this.drawPathDegreeList[i] = [];
            this.drawPathGameObjectList[i] = [];
            //去除过于密集的点
            if (lastPos != null) {
                if (UnityEngine.Vector2.Distance(lastPos, pos) >= this.PATH_DISTANCE) {
                    this.drawPathList[i].push(pos);
                    this.drawPathDegreeList[i].push(0);
                    lastPos = pos;
                }
            }
            else {
                if (i > 0) {
                    this.drawPathList[i].push(pos);
                    this.drawPathDegreeList[i].push(0);
                }
                lastPos = pos;
            }
            let next = i + 1;
            if (next < length) {
                let nextPos = path[next];
                //在2点之间创建过渡点
                let dis = UnityEngine.Vector2.Distance(pos, nextPos);
                if (dis < this.PATH_DISTANCE * 2) {
                    continue;
                }
                let count = Math.floor(dis / this.PATH_DISTANCE);
                for (let j = 1; j < count; j++) {
                    let point = UnityEngine.Vector2.Lerp(pos, nextPos, j / count);
                    this.drawPathList[i].push(point);
                    this.drawPathDegreeList[i].push(j / count);
                }
            }
        }
        for (let i = 0, length = this.drawPathList.length; i < length; i++) {
            let list = this.drawPathList[i];

            for (let j = 0, jLen = list.length; j < jLen; j++) {
                let pos = list[j];
                let prefab = UnityEngine.GameObject.Instantiate(this.PathPointPrefab) as UnityEngine.GameObject;
                prefab.transform.SetParent(this.pathPanel.transform, false);
                prefab.transform.localPosition = this.getPosInMap(pos.x, pos.y, G.DataMgr.sceneData.curSceneConfig);
                this.drawPathGameObjectList[i][j] = prefab;
            }
        }
    }

    private updatePath() {
        if (this.drawPathGameObjectList == null) {
            return;
        }
        if (!this.m_hero.isMoving) {
            if (this.drawPathGameObjectList.length > 0) {
                this.drawPath();
            }
            return;
        }
        let tweenIndex = this.m_hero.getPathIndex();
        let tweenFactor = this.m_hero.getPathFactor();
        for (let i = 0, length = this.drawPathGameObjectList.length; i < length; i++) {
            let list = this.drawPathGameObjectList[i];
            if (tweenIndex >= i) {
                for (let j = 0, jLen = list.length; j < jLen; j++) {
                    if (tweenIndex == i) {
                        if (tweenFactor >= this.drawPathDegreeList[i][j]) {
                            list[j].SetActive(false);
                        }
                    }
                    else{
                        list[j].SetActive(false);
                    }
                }
            }
        }
    }

    private addIconMark(x: number, y: number, type: string, name: string) {
        if (this.m_curSceneConfig == null) {
            return;
        }
        let prefab = UnityEngine.GameObject.Instantiate(this.iconPrefab) as UnityEngine.GameObject;
        let transform = prefab.transform;
        transform.SetParent(this.markPanel.transform, false);
        transform.localPosition = this.getPosInMap(x, y, this.m_curSceneConfig);
        let image = prefab.GetComponent(UnityEngine.UI.Image.GetType()) as UnityEngine.UI.Image;
        image.sprite = this.altas.Get(type);
        image.SetNativeSize();
        if (name != null) {
            let namePrefab = UnityEngine.GameObject.Instantiate(this.namePrefab) as UnityEngine.GameObject;
            let nameTransform = namePrefab.transform;
            nameTransform.SetParent(transform, false);
            Game.Tools.SetLocalPosition(nameTransform, 0, 30, 0);
            let text = namePrefab.GetComponent(UnityEngine.UI.Text.GetType()) as UnityEngine.UI.Text;
            text.text = name;
        }
    }
    private clearMarks() {
        Game.Tools.ClearChildren(this.markPanel.transform);
    }

    public onSceneChange() {
        if (this.tabGroup.Selected == 0) {
            this.updateLocalPanel(G.DataMgr.sceneData.curSceneID);
        }
        else if (this.panelWorld.activeSelf) {
            this.updateWorldPanel();
        }
    }

    private npcSortFun(a: TinyMapData, b: TinyMapData) {
        return b.id - a.id;
    }
    public onLoadMapConfig(mapConfig: MapSceneConfig) {
        let rscType = this.checkRscCanBeUsed(mapConfig.sceneID);
        if (MapRscType.Wrong == rscType) {
            return;
        }
        if (this.imageAssetRequest != null) {
            this.imageAssetRequest.Abort();
            this.imageAssetRequest=null;
        }

        this.m_curSceneConfig = mapConfig;
        let resourceID: number = G.DataMgr.sceneData.getSceneRescourceID(this.sceneID);

        this.localMapImage.enabled = false;
        this.imageAssetRequest = Game.ResLoader.CreateAssetRequest(Game.AssetPriority.High1, uts.format('map/smallMap/{0}.png', resourceID));
        Game.ResLoader.BeginAssetRequest(this.imageAssetRequest, delegate(this, this.onLoadMapImage));


        let m_npcListData: TinyMapData[] = [];

        let npcInfoList = G.DataMgr.sceneData.getNpcInfoList(this.sceneID);
        for (let npcIDString in npcInfoList) //遍历所有的npc
        {
            let npcID = Number(npcIDString);
            // 如果是在排除列表里的npcId  则不显示出来
            //if (EnumNPCId.notCreateNpcId.indexOf(int(npcID)) >= 0) {
            //    continue;
            //}
            let config = NPCData.getNpcConfig(npcID);
            if (config.m_ucFunctionNumber > 0 && KeyWord.NPC_FUNCITON_ACTOR == config.m_astNPCFunction[0].m_ucFunction) {
                // 表演怪不显示
                continue;
            }

            let npcInfo = npcInfoList[npcID];
            let npcName = config.m_szNPCName;

            let npcData = new TinyMapData(this.sceneID, npcID, npcName, config.m_szNPCDesignation, this._getMapNpcQuestType(npcID), npcInfo.x, npcInfo.y);
            m_npcListData.push(npcData);
        }
        //NPC数据排序
        m_npcListData.sort(this.npcSortFun);
        let list = this.functionGroup.GetSubList(1);
        list.Count = m_npcListData.length;
        for (let i = 0; i < m_npcListData.length; i++) {
            let data = m_npcListData[i];
            let item = list.GetItem(i);
            item.findText("name").text = data.name;
            item.OnClick = delegate(this, this._onItemClick, data);

            let flyButton = item.findObject("bt");
            Game.UIClickListener.Get(flyButton).onClick = delegate(this, this._onItemFlyButtonClick, data);
            this.addIconMark(data.x, data.y, "npc",null);
        }


        let wayPointList: TinyMapData[] = [];
        let gateList = G.DataMgr.sceneData.getTeleportList(this.sceneID);
        let sceneData = G.DataMgr.sceneData;
        for (let telePortIdString in gateList) {
            let telePortId = Number(telePortIdString);
            let info = gateList[telePortId];
            let gateConfig = G.DataMgr.sceneData.getTeleportConfig(info.gateID);
            if (gateConfig == null) {
                uts.logWarning("info.gateID 表里没配置:" + info.gateID);
            }
            if (gateConfig.m_ucType == KeyWord.TRANS_NORMAL && info.isEnable && !sceneData.disableAllGate) {
                let data = new TinyMapData(this.sceneID, info.gateID, gateConfig.m_szName, "", MapSignType.Map_Waypoint, info.x, info.y);
                wayPointList.push(data);
            }
        }
        list = this.functionGroup.GetSubList(2);
        list.Count = wayPointList.length;
        for (let i = 0; i < wayPointList.length; i++) {
            let data = wayPointList[i];
            let item = list.GetItem(i);
            item.findText("name").text = data.name;
            item.OnClick = delegate(this, this._onItemClick, data);

            let flyButton = item.findObject("bt");
            Game.UIClickListener.Get(flyButton).onClick = delegate(this, this._onItemFlyButtonClick, data);
            this.addIconMark(data.x, data.y, "transport", data.name);
        }
        G.ModuleMgr.netModule.sendMsg(ProtocolUtil.getSceneMonsterRequest(this.sceneID));
    }

    private checkRscCanBeUsed(sid: number): MapRscType {
        if(this.sceneID == sid) {
            return MapRscType.Exactly;
        }

        let sceneData = G.DataMgr.sceneData;
        if(this.sceneID == sceneData.curSceneID && sceneData.curPinstanceID > 0) {
            let pcfg = PinstanceData.getConfigByID(sceneData.curPinstanceID);
            if(pcfg.m_cLoadingType == KeyWord.PIN_LOADING_PART) {
                // 此类副本若场景资源id和上一次资源id相同的话则不需要重新加载地编
                if(sceneData.getSceneInfo(this.sceneID).config.m_iSceneFather == sid) {
                    return MapRscType.StandIn;
                }
            } else if(pcfg.m_cLoadingType == KeyWord.PIN_LOADING_ALL) {
                // 此类副本已上次场景创建副本，故不需要重新加载地编
                if(sid == sceneData.preSceneID) {
                    return MapRscType.StandIn;
                }
            }
        }
        return MapRscType.Wrong;
    }
    /**
     * 显示当前某一块地图，点击世界地图上某一个小块触发
     * @param sceneID 场景id
     * @param bmtData 加载上来的当前场景的地图数据
     *
     */
    private onLoadMapImage(assetRequest: Game.AssetRequest): void {
        if (assetRequest.error != null) {
            uts.logWarning("MapView加载失败:" + "  error:" + assetRequest.error);
            return;
        }
        if (!this.m_curSceneConfig) {
            return;
        }
        this.localMapImage.enabled = true;
        //_checkHero();
        //m_btnFly.visible = false;
        //重新将子节点绑定
        if (this.asset != null) {
            this.asset.autoCollect = true;
        }
        this.asset = assetRequest.mainAsset;
        this.asset.autoCollect = false;
        this.localMapImage.texture = this.asset.texture;

        let mapConfig = this.m_curSceneConfig;
        let mapWidth = mapConfig.curMapWidth;
        let mapHeight = mapConfig.curMapHeight;
        //将地图的原宽高等比例缩放
        let targetRadio = this.MAPWIDTH / this.MAPHEIGHT;
        let mapRadio = mapWidth / mapHeight;
        if (mapRadio > targetRadio) {
            let size = mapWidth / this.MAPWIDTH;
            mapWidth = this.MAPWIDTH;
            mapHeight = Math.floor(mapHeight / size);
        }
        else {
            let size = mapHeight / this.MAPHEIGHT;
            mapHeight = this.MAPHEIGHT;
            mapWidth = Math.floor(mapWidth / size);
        }

        let size = G.getCacheV2(mapWidth, mapHeight);
        this.localMapImage.rectTransform.sizeDelta = size;

        this.updateHeroPosition();
        this.panelLocal.SetActive(true);
        this.panelWorld.SetActive(false);
    }


    private getPosInMap(x: number, y: number, mapConfig: MapSceneConfig): UnityEngine.Vector3{
        let newPos = G.getCacheV3(0, 0, 0);
        let mapWidth = mapConfig.curMapWidth;
        let mapHeight = mapConfig.curMapHeight;
        //将地图的原宽高等比例缩放
        let targetRadio = this.MAPWIDTH / this.MAPHEIGHT;
        let mapRadio = mapWidth / mapHeight;
        if (mapRadio > targetRadio) {
            let size = mapWidth / this.MAPWIDTH;
            mapWidth = this.MAPWIDTH;
            mapHeight = Math.floor(mapHeight / size);
        }
        else {
            let size = mapHeight / this.MAPHEIGHT;
            mapHeight = this.MAPHEIGHT;
            mapWidth = Math.floor(mapWidth / size);
        }

        newPos.x = x / mapConfig.curMapWidth - 0.5;
        newPos.y = 1 - y / mapConfig.curMapHeight - 0.5;
        newPos.x *= mapWidth;
        newPos.y *= mapHeight;
        return newPos;
    }


    public updateMonsters(sceneID: number, m_aiList: number[]) {
        if (this.sceneID != sceneID) {
            return;
        }
        var monsterData: TinyMapData[] = [];
        for (let id of m_aiList) {
            let config = MonsterData.getMonsterConfig(id);
            // 剔除掉无效的怪物
            if (KeyWord.MONSTER_TYPE_PICK != config.m_bDignity && 0 != config.m_ucIsBeSelected) {
                let navConfig = G.DataMgr.sceneData.getMonsterNav(id, false);
                if (navConfig != null) {
                    let mapData = new TinyMapData(sceneID, id, config.m_szMonsterName, "", MapSignType.Map_Monster, navConfig.m_stPosition.m_uiX, navConfig.m_stPosition.m_uiY);
                    monsterData.push(mapData);
                }
            }
        }
        let list = this.functionGroup.GetSubList(0);
        let mcnt = monsterData.length;
        list.Count = mcnt;
        for (let i = 0; i < monsterData.length; i++) {
            let data = monsterData[i];
            let item = list.GetItem(i);
            item.findText("name").text = data.name;
            item.OnClick = delegate(this, this._onItemClick, data);
            let flyButton = item.findObject("bt");
            Game.UIClickListener.Get(flyButton).onClick = delegate(this, this._onItemFlyButtonClick, data);
            this.addIconMark(data.x, data.y, "monster", null);
        }
        //if (mcnt > 0) {
        //    this.functionGroup.Selected = 2;
        //} else {
        //    this.functionGroup.Selected = 1;
        //}
    }

    public updateMapIcon(sceneID: number, m_aiList: Protocol.OnMonsterInfo[]) {
        if (this.sceneID != sceneID) {
            return;
        }
        for (let item of m_aiList) {
            let config = MonsterData.getMonsterConfig(item.m_iID);
            let type = 'monster';
            if (UnitUtil.isBoss(config.m_bDignity)) {
                type = 'boss';
            } else if(KeyWord.MONSTER_TYPE_PICK == config.m_bDignity) {
                type = 'pick';
            }
            this.addIconMark(item.m_uiX, item.m_uiY, type, config.m_szMonsterName);
        }
    }

    private _getMapNpcQuestType(npcID: number): number {
        let state: number = G.DataMgr.questData.getStateByNPCID(npcID, G.DataMgr.heroData);
        let result: number = MapSignType.Map_Npc;
        switch (state) {
            case NPCQuestState.complete:
                result = MapSignType.Map_Npc_Get_Reward;
                break;
            case NPCQuestState.receive:
                result = MapSignType.Map_Npc_Accept_Quest;
                break;
            case NPCQuestState.doing:
                result = MapSignType.Map_Npc_Quest_Doing;
                break;
            default:
                break;
        }
        return result;
    }



    /**
 * 在大地图上寻路
 * @param event
 *
 */
    private m_lastClickTime: number = 0;
    private onMapClick(): void {
        if (this.m_curSceneConfig == null) {
            return;
        }
        if (this.sceneID != G.DataMgr.sceneData.curSceneID) {
            G.TipMgr.addMainFloatTip("点击左侧列表寻路");
            return;
        }
        if (UnityEngine.Time.time - this.m_lastClickTime < Constants.CLICKMAP_INTERVAL/1000) {
            //如果寻路间隔小于0.5秒，则不寻路
            return;
        }
        this.m_lastClickTime = UnityEngine.Time.time;

        let clickPos = Game.UIClickListener.eventData.position;

        UnityEngine.RectTransformUtility.ScreenPointToLocalPointInRectangle(Game.UIClickListener.target.GetComponent(UnityEngine.RectTransform.GetType()) as UnityEngine.RectTransform
            , clickPos, this.canvas.worldCamera, clickPos);
        let mapSize = G.getCacheV2(this.MAPWIDTH, this.MAPHEIGHT);
        clickPos.x += mapSize.x / 2;
        clickPos.y += mapSize.y / 2;
        clickPos.x = clickPos.x / mapSize.x;
        clickPos.y = (1 - clickPos.y / mapSize.y);
        if (clickPos.x < 0 ||
            clickPos.x > 1 ||
            clickPos.y < 0 ||
            clickPos.y > 1) {
            return;
        }
        let ret = G.Mapmgr.goToPos(this.sceneID, this.m_curSceneConfig.curMapWidth * clickPos.x, this.m_curSceneConfig.curMapHeight * clickPos.y, false, true, FindPosStrategy.MakeSureValid);
        if (PathingState.CAN_REACH == ret) {
            //this.close();
        } 
    }

    private _onItemClick(item, data: TinyMapData): void {
        this.handleItemClick(data, false);
    }

    private _onItemFlyButtonClick(data: TinyMapData): void {
        if (PathingState.CAN_REACH == this.handleItemClick(data, true)) {
            this.close();
        }
    }

    private handleItemClick(data: TinyMapData, isTransport: boolean): PathingState {
        let state: PathingState = PathingState.CANNOT_REACH;
        if (data.mapType == MapSignType.Map_None) {
            return state;
        }
     
        if (data.mapType == MapSignType.Map_Monster) {
            state = G.Mapmgr.goToPos(data.sceneID, data.x, data.y, isTransport, true, FindPosStrategy.Specified, data.id, true);
        }
        else if (data.mapType == MapSignType.Map_Waypoint) {
            state = G.Mapmgr.goToPos(data.sceneID, data.x, data.y, isTransport, true);
        }
        else {
            state = G.Mapmgr.findPath2Npc(data.id, isTransport, 0, true);
        }
        return state;
    }

    private onWorldIconClick(): void {
        this.onBtnList(2);
        this.elems.getElement('btnWord').SetActive(true);
        this.elems.getElement('btnLocal').SetActive(false);
        let id = Number(Game.UIClickListener.target.name);
        this.updateLocalPanel(id);
    }

    /**
     * 关闭返回按钮
     */
    private onBtnReturn(): void {
        this.close();
    }
}
export default MapView;