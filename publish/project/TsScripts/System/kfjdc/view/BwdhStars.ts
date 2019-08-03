import { ElemFinder } from 'System/uilib/UiUtility'
import { KfjdcData } from 'System/data/KfjdcData'
import { UIUtils } from "System/utils/UIUtils"

class OneStar {
    private gameObject: UnityEngine.GameObject;

    private starl: UnityEngine.GameObject;
    private starr: UnityEngine.GameObject;
    private bomb: UnityEngine.GameObject;
    private crack: UnityEngine.GameObject;
    private light: UnityEngine.GameObject;

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;
        this.starl = ElemFinder.findObject(go, 'starl');
        this.starr = ElemFinder.findObject(go, 'starr');
        this.bomb = ElemFinder.findObject(go, 'bomb');
        this.crack = ElemFinder.findObject(go, 'crack');
        this.light = ElemFinder.findObject(go, 'light');
    }

    showNormal(isGrey: boolean) {
        UIUtils.setGrey(this.starl, isGrey);
        UIUtils.setGrey(this.starr, isGrey);
        this.starl.SetActive(true);
        this.starr.SetActive(true);
        if (this.light != null) {
            this.light.SetActive(!isGrey);
        }
        if (this.bomb) {
            this.bomb.SetActive(false);
        }
        if (this.crack) {
            this.crack.SetActive(false);
        }
        Game.Invoker.EndInvoke(this.gameObject, 'bomb');
        Game.Invoker.EndInvoke(this.gameObject, 'crack');
    }

    showBomb() {
        UIUtils.setGrey(this.starl, false);
        UIUtils.setGrey(this.starr, false);
        this.starl.SetActive(true);
        this.starr.SetActive(true);
        this.crack.SetActive(false);
        this.bomb.SetActive(true);
        Game.Invoker.BeginInvoke(this.gameObject, 'bomb', 1, delegate(this, this.afterBombEffect));
    }

    private afterBombEffect() {
        this.bomb.SetActive(false);
    }

    showCrack() {
        UIUtils.setGrey(this.starl, true);
        UIUtils.setGrey(this.starr, true);
        this.starl.SetActive(false);
        this.starr.SetActive(false);
        this.bomb.SetActive(false);
        this.crack.SetActive(true);
        Game.Invoker.BeginInvoke(this.gameObject, 'crack', 1, delegate(this, this.afterCrackEffect));
    }

    private afterCrackEffect() {
        this.crack.SetActive(false);
        this.starl.SetActive(true);
        this.starr.SetActive(true);
    }
}

export class BwdhStarClip {
    private gameObject: UnityEngine.GameObject;
    private stars: OneStar[] = [];
    private maxCnt = 0;

    constructor(maxCnt: number) {
        this.maxCnt = maxCnt;
    }

    setComponents(go: UnityEngine.GameObject) {
        this.gameObject = go;
        for (let i = 0; i < this.maxCnt; i++) {
            let oneStar = new OneStar();
            oneStar.setComponents(ElemFinder.findObject(go, i.toString()));
            this.stars.push(oneStar);
        }
    }

    setScore(from: number, to: number) {
        if (to >= 0) {
            let starsCnt = this.stars.length;
            if (from == to) {
                for (let i = 0; i < starsCnt; i++) {
                    let star = this.stars[i];
                    star.showNormal(i >= to);
                }
            } else if (from > to) {
                // 掉级了
                for (let i = 0; i < starsCnt; i++) {
                    let star = this.stars[i];
                    if (i < to) {
                        star.showNormal(false);
                    } else if (i < from) {
                        star.showCrack();
                    } else {
                        star.showNormal(true);
                    }
                }
            } else {
                // 升级了
                for (let i = 0; i < starsCnt; i++) {
                    let star = this.stars[i];
                    if (i < from) {
                        star.showNormal(false);
                    } else if (i < to) {
                        star.showBomb();
                    } else {
                        star.showNormal(true);
                    }
                }
            }
            this.gameObject.SetActive(true);
        } else {
            this.gameObject.SetActive(false);
        }
    }
}

export class BwdhStars {

    private stars5clip = new BwdhStarClip(5);
    private stars4clip = new BwdhStarClip(4);
    private stars3clip = new BwdhStarClip(3);

    private bigStage: UnityEngine.UI.Image;
    private smallStage: UnityEngine.UI.Image;
    private bigStageAltas: Game.UGUIAltas;
    private smallStageAltas: Game.UGUIAltas;

    private final: UnityEngine.GameObject;
    private textScore: UnityEngine.UI.Text;

    setComponents(stars5: UnityEngine.GameObject, stars4: UnityEngine.GameObject, stars3: UnityEngine.GameObject,
        bigStage: UnityEngine.UI.Image, smallStage: UnityEngine.UI.Image, bigStageAltas: Game.UGUIAltas, smallStageAltas: Game.UGUIAltas, final: UnityEngine.GameObject) {
        this.stars5clip.setComponents(stars5);
        this.stars4clip.setComponents(stars4);
        this.stars3clip.setComponents(stars3);

        this.bigStage = bigStage;
        this.bigStageAltas = bigStageAltas;
        this.smallStage = smallStage;
        this.smallStageAltas = smallStageAltas;
        this.final = final;
        if (final) {
            this.textScore = ElemFinder.findText(final, 'textScore');
        }
    }

    setGrade(grade: number, score: number) {
        let maxGrade = KfjdcData.RANK_DESC_LIST.length;
        grade = Math.min(maxGrade, grade);
        if (grade < maxGrade) {
            let bigStage = Math.max(1, Math.ceil(grade / 2));
            let smallStage = Math.max(1, (grade - 1) % 2 + 1);
            this.bigStage.sprite = this.bigStageAltas.Get(bigStage.toString());
            this.smallStage.sprite = this.smallStageAltas.Get(smallStage.toString());
            this.bigStage.gameObject.SetActive(true);
            this.smallStage.gameObject.SetActive(true);
            if (this.final) {
                this.final.SetActive(false);
            }
        } else {
            this.bigStage.gameObject.SetActive(false);
            this.smallStage.gameObject.SetActive(false);
            if (this.final) {
                this.final.SetActive(true);
                this.textScore.text = uts.format('积分：{0}', score);
            }
        }
    }

    setScore(from: number, to: number, max: number) {
        to = Math.min(to, max);
        if (max == 3) {
            this.stars3clip.setScore(from, to);
            this.stars4clip.setScore(-1, -1);
            this.stars5clip.setScore(-1, -1);
        } else if (max == 4) {
            this.stars3clip.setScore(-1, -1);
            this.stars4clip.setScore(from, to);
            this.stars5clip.setScore(-1, -1);
        } else if (max == 5) {
            this.stars3clip.setScore(-1, -1);
            this.stars4clip.setScore(-1, -1);
            this.stars5clip.setScore(from, to);
        } else {
            this.stars3clip.setScore(-1, -1);
            this.stars4clip.setScore(-1, -1);
            this.stars5clip.setScore(-1, -1);
        }
    }
}