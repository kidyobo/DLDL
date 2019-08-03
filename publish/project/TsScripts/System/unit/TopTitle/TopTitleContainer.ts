import { Global as G } from "System/global";
import { TextTopTitle } from "System/unit/TopTitle/TextTopTitle"
import { BubbleTopTitle } from "System/unit/TopTitle/BubbleTopTitle"
import { BloodTopTitle } from "System/unit/TopTitle/BloodTopTitle"
import { ImageTopTitle } from "System/unit/TopTitle/ImageTopTitle"
import { NpcQuestStateTopTitle } from 'System/unit/TopTitle/NpcQuestStateTopTitle'
import { WorldUIElementView } from 'System/main/view/WorldUIElementView';
import { NPCQuestState, EnumBloodType } from 'System/constants/GameEnum'
import { TopTitleEnum } from "System/unit/TopTitle/TopTitleEnum"
/**
* 头顶显示容器,该容器可能被任意一个单位使用
*/
export class TopTitleContainer {
    private m_containerRoot: Game.TransformFollower;
    public get containerRoot() {
        return this.m_containerRoot;
    }
    public gameObject: UnityEngine.GameObject;
    public transform: UnityEngine.Transform;
    private _active: boolean = false;
    //拥有多个TextTopTitle
    private textTitles: TextTopTitle[] = [];
    //最多拥有1个blood top title
    private bloodTitle: BloodTopTitle = new BloodTopTitle();
    //最多拥有1个npc top title
    private npcTitle: NpcQuestStateTopTitle = new NpcQuestStateTopTitle();
    //拥有多个ImageTopTile
    private imageTitles: ImageTopTitle[] = [];
    //最多拥有1个bubble top title
    private bubbleTitle: BubbleTopTitle = new BubbleTopTitle();
    public get imageTitleCount() {
        return this.imageTitles.length;
    }
    private unusedImageTops: ImageTopTitle[] = [];
    private unusedTextTops: TextTopTitle[] = [];
    //必须赋予一个容器根节点，存在于2D面板上，会跟随一个3D对象
    constructor(target: UnityEngine.Transform) {
        this.m_containerRoot = G.ViewCacher.worldUIElementView.createHeadContainerRoot(target);
        this.transform = this.m_containerRoot.transform;
        this.gameObject = this.m_containerRoot.gameObject;
        this.bloodTitle.init(this);
        this.npcTitle.init(this);
        this.bubbleTitle.init(this);
    }
    private onSort(a: any, b: any) {
        if (a.id > b.id) {
            return 1;
        }
        return -1;
    }
    public setActive(active: boolean) {
        if (this._active != active) {
            this._active = active;
            this.gameObject.SetActive(active);
        }
    }
    public setBubbleTopTitleValue(text: string): void {
        this.bubbleTitle.text = text;
        this.refreshPosition();
    }
    //保证id=0为名字，因为内部有特殊排版关系
    public setTextTopTitleValue(id: number, text: string): void {
        let textTitle: TextTopTitle = null;
        let textTitles = this.textTitles;
        for (let t of textTitles) {
            if (t.id == id) {
                textTitle = t;
                break;
            }
        }
        if (textTitle) {
            textTitle.text = text;
            if (text == null) {
                textTitles.splice(textTitles.indexOf(textTitle), 1);
                this.unusedTextTops.push(textTitle);
            }
        }
        else {
            if (text != null) {
                if (this.unusedTextTops.length > 0) {
                    textTitle = this.unusedTextTops.splice(0, 1)[0];
                }
                else {
                    textTitle = new TextTopTitle();
                    textTitle.init(this);
                }
                textTitle.id = id;
                textTitles.push(textTitle);
                textTitle.text = text;
            }
        }
        this.refreshPosition();
    }
    public setBloodTopTitleValue(value: number, type: EnumBloodType): void {
        this.bloodTitle.value = value;
        this.bloodTitle.setBloodType(type);
        this.refreshPosition();
    }
    public setNpcQuestStateTopTitle(state: NPCQuestState): void {
        this.npcTitle.state = state;
        this.refreshPosition();
    }
    public setImageTopTitleValue(id: number, path: string, align: number): void {
        let imageTitle: ImageTopTitle = null;
        let imageTitles = this.imageTitles;
        for (let image of imageTitles) {
            if (image.id == id) {
                imageTitle = image;
                break;
            }
        }
        if (imageTitle) {
            if (path) {
                imageTitle.load(path);
            }
            else {
                imageTitles.splice(imageTitles.indexOf(imageTitle), 1);
                this.unusedImageTops.push(imageTitle);
                imageTitle.load(null);
                this.refreshPosition();
            }
        }
        else {
            if (path) {
                if (this.unusedImageTops.length > 0) {
                    imageTitle = this.unusedImageTops.splice(0, 1)[0];
                }
                else {
                    imageTitle = new ImageTopTitle();
                    imageTitle.container = this;
                }
                imageTitle.id = id;
                imageTitle.align = align;
                imageTitles.push(imageTitle);
                imageTitle.load(path);
            }
        }
    }
    public destroy(remainLink: boolean = true) {
        let textTitles = this.textTitles;
        for (let t of textTitles) {
            if (remainLink) {
                t.text = null;
                this.unusedTextTops.push(t);
            }
            else {
                t.container = null;
            }
        }

        let images = this.imageTitles;
        for (let image of images) {
            if (remainLink) {
                this.unusedImageTops.push(image);
            }
            else {
                image.container = null;
            }
            image.load(null);
        }
        if (remainLink) {
            this.imageTitles = [];
            this.textTitles = [];
            this.bubbleTitle.text = null;
            this.bloodTitle.value = -1;
            this.npcTitle.state = NPCQuestState.noQuest;
            this.setActive(false);
        }
        else {
            this.bubbleTitle.container = null;
            this.bloodTitle.container = null;
            this.npcTitle.container = null;
            this.unusedTextTops = null;
            this.unusedImageTops = null;
            UnityEngine.UnityObject.DestroyImmediate(this.gameObject);
            this.gameObject = null;
            this.transform = null;
            this.m_containerRoot = null;
        }
    }

    public refreshPosition() {
        let height = 0;
        let bloodTitle = this.bloodTitle;
        if (bloodTitle.value >= 0) {
            let itemHeight = bloodTitle.height;
            bloodTitle.setPosition(0, height + itemHeight / 2);
            height += itemHeight;
        }
        let maxTextWidth = 0;
        let lastTextHeight = 0;
        let textTitles = this.textTitles;
        textTitles.sort(this.onSort);
        let txtcount = textTitles.length;
        for (let i = 0; i < txtcount; i++) {
            let textTitle = textTitles[i];
            let itemHeight = textTitle.height;
            textTitle.cacheX = 0;
            textTitle.cacheY = height + itemHeight / 2;
            height += itemHeight;
            if (maxTextWidth < textTitle.width) {
                maxTextWidth = textTitle.width;
            }
            lastTextHeight = height;
        }

        let npcTitle = this.npcTitle;
        if (npcTitle.state != NPCQuestState.noQuest) {
            let itemHeight = npcTitle.height;
            npcTitle.setPosition(0, height + itemHeight / 2);
            height += itemHeight;
        }

        let imageTitles = this.imageTitles;
        imageTitles.sort(this.onSort);
        let count = imageTitles.length;
        for (let i = 0; i < count; i++) {
            let imageTitle = imageTitles[i];
            if (imageTitle.loaded) {
                if (imageTitle.align > 0) {
                    //这个在第二次遍历中才能确定
                }
                else if (imageTitle.align < 0) {
                    //此类称号摆在text的左侧同时和名字保持居中关系
                    if (textTitles.length > 0) {
                        let alighName = textTitles[0];
                        alighName.cacheX += imageTitle.width / 2;
                        let width = alighName.width / 2;
                        imageTitle.setPosition(-width, 10);
                        if (maxTextWidth < (alighName.width + imageTitle.width)) {
                            maxTextWidth = alighName.width + imageTitle.width;
                        }
                    }
                }
                else {
                    let itemHeight = imageTitle.height;
                    imageTitle.setPosition(0, height + itemHeight / 2);
                    height += itemHeight;
                }
            }
        }
        //因为策划的名字排版需求，必须遍历二次才能确定位置
        for (let i = 0; i < count; i++) {
            let imageTitle = imageTitles[i];
            if (imageTitle.loaded) {
                if (imageTitle.align > 0) {
                    //此类称号摆在text的右侧
                    let width = maxTextWidth / 2 + 30;
                    let height = lastTextHeight - 11;
                    imageTitle.setPosition(width, height);
                }
            }
        }

        for (let i = 0; i < txtcount; i++) {
            let textTitle = textTitles[i];
            textTitle.setPosition(textTitle.cacheX, textTitle.cacheY);
        }

        let bubbleTitle = this.bubbleTitle;
        if (bubbleTitle.text) {
            let itemHeight = bubbleTitle.height;
            bubbleTitle.setPosition(0, height + itemHeight / 2);
            height += itemHeight;
        }
    }
}
export default TopTitleContainer;