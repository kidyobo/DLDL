export class SpecialAnimationPlayer {
    static createSpecialAnimation(obj: UnityEngine.GameObject): boolean {
        let animationPlayer = obj.GetComponent(Game.SpecialAnimationPlayer.GetType()) as Game.SpecialAnimationPlayer;
        if (animationPlayer == null) {
            return false;
        }
        let func = SpecialAnimationPlayer[animationPlayer.functionName];
        if (func == null) {
            uts.logError("函数不存在：" + animationPlayer.functionName);
            return false;
        }
        func(animationPlayer);
        return true;
    }
    static ActiveChildren(animationPlayer: Game.SpecialAnimationPlayer) {
        let transform = animationPlayer.transform;
        var count = transform.childCount;
        if (count == 0) {
            return;
        }
        let f = animationPlayer.GetFloat(0) * 1000;
        for (let i = 0; i < count; i++) {
            let gameObject = transform.GetChild(i).gameObject;
            gameObject.SetActive(false);
            new Game.Timer("skill", f * i, 1, delegate(this, SpecialAnimationPlayer.onLateActiveChildren, gameObject));
        }
    }
    private static onLateActiveChildren(timer: Game.Timer, obj: UnityEngine.GameObject) {
        obj.SetActive(true);
    }

    static Play() {

    }
    static RandomActiveChildren(animationPlayer: Game.SpecialAnimationPlayer) {
        let transformList = [];
        let transform = animationPlayer.transform;
        var count = transform.childCount;
        if (count == 0) {
            return;
        }
        for (let i = 0; i < count; i++) {
            let gameObject = transform.GetChild(i).gameObject;
            gameObject.SetActive(false);
            transformList.push(gameObject);
        }
        let f = animationPlayer.GetFloat(0) * 1000;
        let i = 0;
        while (count > 0) {
            var random = Math.floor(Math.random() * count);
            var obj = transformList[random];
            transformList.splice(random, 1);
            new Game.Timer("skill", i*f, 1, delegate(this, SpecialAnimationPlayer.onLateActiveChildren, obj));
            count--;
            i++;
        }
    }
}
export default SpecialAnimationPlayer;