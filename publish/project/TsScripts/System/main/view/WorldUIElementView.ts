import { Global as G } from 'System/global'
import { CommonForm, UILayer } from "System/uilib/CommonForm"
import { UIPathData } from 'System/data/UIPathData'
import { IconItem } from 'System/uilib/IconItem'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
import { UIUtils } from 'System/utils/UIUtils'
import { TipFrom } from 'System/tip/view/TipsView'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { ElemFinder, ElemFinderMySelf } from 'System/uilib/UiUtility'
import { EnumMainViewChild } from 'System/main/view/MainView'
import { TopTitleContainer } from "System/unit/TopTitle/TopTitleContainer"
export class WorldUIElementView extends CommonForm {
    public unitBoardRoot: UnityEngine.Transform;
    public effectRoot: UnityEngine.Transform;

    private headContainerRoot: UnityEngine.GameObject;
    private textTopTitle: UnityEngine.GameObject;
    private bloodTopTitle: UnityEngine.GameObject;
    private npcQuestStateTitle: UnityEngine.GameObject;

    public hurtNumber_monster: UnityEngine.GameObject;
    public hurtNumber_hero: UnityEngine.GameObject;
    public hurtNumber_beauty: UnityEngine.GameObject;
    public hurtNumber_fabao: UnityEngine.GameObject;
    public hurtNumber_hero_critic: UnityEngine.GameObject;
    public cureNumber_hero: UnityEngine.GameObject;
    public miss_green: UnityEngine.GameObject;
    public miss_grey: UnityEngine.GameObject;
    public poJi: UnityEngine.GameObject;
    public zhenShenYiJi: UnityEngine.GameObject;
    public geDang: UnityEngine.GameObject;
    public popWord: UnityEngine.GameObject;
    public bubble: UnityEngine.GameObject;

    constructor() {
        super(1);
        this.openSound = null;
        this.closeSound = null;
    }

    layer(): UILayer {
        return UILayer.Base;
    }

    protected resPath(): string {
        return UIPathData.WorldUIElementView;
    }

    protected initElements() {
        this.headContainerRoot = this.elems.getElement("headContainerRoot");
        this.unitBoardRoot = this.elems.getElement("unitBoardRoot").transform;

        this.effectRoot = this.elems.getElement("effectRoot").transform;
        let com = this.effectRoot.gameObject.AddComponent(Game.TransformFollower.GetType()) as Game.TransformFollower;
        com.target = G.Root.transform;
        com.selfCamera = G.Uimgr.UICamera;
        com.targetCamera = G.getMainCamera();
        com.ignoreZ = true;
        com.ignoreX = true;
        com.ignoreY = true;

        this.textTopTitle = this.elems.getElement("textTopTitle");
        this.textTopTitle.SetActive(true);
        this.bloodTopTitle = this.elems.getElement("bloodTopTitle");
        this.bloodTopTitle.SetActive(false);
        this.npcQuestStateTitle = this.elems.getElement("npcQuestStateTitle");
        this.npcQuestStateTitle.SetActive(false);
        this.hurtNumber_monster = this.elems.getElement("hurtNumber_monster");
        this.hurtNumber_hero = this.elems.getElement("hurtNumber_hero");
        this.hurtNumber_beauty = this.elems.getElement("hurtNumber_beauty");
        this.hurtNumber_fabao = this.elems.getElement("hurtNumber_fabao");
        this.hurtNumber_hero_critic = this.elems.getElement("hurtNumber_hero_critic");
        this.miss_green = this.elems.getElement("miss_green");
        this.miss_grey = this.elems.getElement("miss_grey");
        this.poJi = this.elems.getElement("poJi");
        this.zhenShenYiJi = this.elems.getElement("zhenShenYiJi");
        this.geDang = this.elems.getElement("geDang");
        this.cureNumber_hero = this.elems.getElement("cureNumber_hero");
        this.bubble = this.elems.getElement("bubble");
    }

    protected initListeners() {
    }
    protected onOpen() {
    }
    protected onClose() {
    }

    createHeadContainerRoot(target: UnityEngine.Transform): Game.TransformFollower {
        let obj = UnityEngine.UnityObject.Instantiate(this.headContainerRoot, this.unitBoardRoot, false) as UnityEngine.GameObject;
        let com = obj.GetComponent(Game.TransformFollower.GetType()) as Game.TransformFollower;
        com.selfCamera = G.Uimgr.UICamera;
        com.targetCamera = G.getMainCamera();
        com.offset = G.getCacheV3(0, 3.2, 0);
        com.target = target;
        return com;
    }
    createTextTopTitle(container: TopTitleContainer): UnityEngine.GameObject {
        return UnityEngine.UnityObject.Instantiate(this.textTopTitle, container.transform, false) as UnityEngine.GameObject;
    }
    createBubble(container: TopTitleContainer): UnityEngine.GameObject {
        return UnityEngine.UnityObject.Instantiate(this.bubble, container.transform, false) as UnityEngine.GameObject;
    }
    createBloodTopTitle(container: TopTitleContainer): UnityEngine.GameObject {
        return UnityEngine.UnityObject.Instantiate(this.bloodTopTitle, container.transform, false) as UnityEngine.GameObject;
    }
    createNpcQuestStateTopTitle(container: TopTitleContainer): UnityEngine.GameObject {
        return UnityEngine.UnityObject.Instantiate(this.npcQuestStateTitle, container.transform, false) as UnityEngine.GameObject;
    }
}