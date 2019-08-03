import { Global as G } from 'System/global'
export enum EffectType {
    /**没类型表示常显*/
    Effect_None,
    /**正常*/
    Effect_Normal,
}

export class UIEffect {

    private initOBJ: UnityEngine.GameObject;

    setEffectPrefab(prefab: UnityEngine.GameObject, root: UnityEngine.GameObject, scale: number = 1, offsetX: number = 0, offsetY: number = 0) {
        if (prefab == null) {
            uts.logError("特效不存在，请检查！");
        }
        else {
            let effect = UnityEngine.GameObject.Instantiate(prefab) as UnityEngine.GameObject;
            let rect = effect.transform as UnityEngine.RectTransform;
            rect.SetParent(root.transform, false);
            if (offsetX != 0 || offsetY != 0) {
                Game.Tools.SetAnchoredPosition(rect, offsetX, offsetY);
            }
            if (scale != 1) {
                Game.Tools.SetGameObjectLocalScale(effect, G.getCacheV3(scale, scale, scale));
            }
            effect.SetActive(false);
            this.initOBJ = effect;
        }
    }

    setEffectObject(obj: UnityEngine.GameObject) {
        if (obj == null) {
            uts.logError("特效不存在，请检查！");
        }
        else {
            this.initOBJ = obj;
            obj.SetActive(false);
        }
    }

    //特效播放了却没显示，父节点不能隐藏。。移除回调，用timer
    playEffect(type: EffectType, isCanShow: boolean = true, timeInSeconds = 1) {
        if (this.initOBJ) {
            this.initOBJ.SetActive(isCanShow);
            if (type != EffectType.Effect_None && isCanShow) {
                Game.Invoker.BeginInvoke(this.initOBJ, '1', timeInSeconds, delegate(this, this.onAnimationEnd));
            }
        }
    }

    stopEffect() {
        if (this.initOBJ)
        this.initOBJ.SetActive(false);
    }

    private onAnimationEnd() {
        this.stopEffect();
    }
}