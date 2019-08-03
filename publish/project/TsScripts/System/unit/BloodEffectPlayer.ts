import { WorldUIElementView } from 'System/main/view/WorldUIElementView';
import { UnitController } from "System/unit/UnitController";
import { UnitCtrlType } from "System/constants/GameEnum"
import { Global as G } from 'System/global'
import { Macros } from "System/protocol/Macros";
import { IPool, ObjectPool } from "Common/pool/ObjectPool"
import { TypeCacher } from "System/TypeCacher"
import { KeyWord } from "System/constants/KeyWord";
export class BloodEffectPlayer {
    static titleV3: UnityEngine.Vector3 = new UnityEngine.Vector3(0, 0, 0);
    static play(caster: UnitController, target: UnitController, uac: Protocol.UnitAttributeChanged, deltaMap: { [euai: number]: number }, skillBranch: number) {
        let casterType = caster.Data.unitType;
        let targetType = target.Data.unitType;

        let casterIsMonster = casterType == UnitCtrlType.monster;
        let casterIsHero = casterType == UnitCtrlType.hero;
        let targetIsHero = targetType == UnitCtrlType.hero;

        let hurt = false;
        //筛选要飘的字
        let mask = uac.m_uiMask;
        let mask64 = uac.m_uiMask64;
        let valueList = uac.m_allDeltaValue;
        let valueCnt = valueList.length;
        let j = 0;
        let list: EffectUnit[] = [];
        if (Macros.EffectMask_Miss == uac.m_uiEffectMask) //miss
        {
            if (casterIsMonster) {
                list.push(EffectUnit_MISS_HERO.create());
            }
            else {
                list.push(EffectUnit_MISS_MONSTER.create());
            }
        }

        let hpDelta = 0;
        let curHpDelta = deltaMap[Macros.EUAI_CURHP];
        if (undefined != curHpDelta) {
            if (curHpDelta < 0) {
                hpDelta = curHpDelta;
            }
            else if (curHpDelta > 0) {
                if (targetIsHero) {
                    list.push(EffectUnit_HPUP.create(curHpDelta));
                }
            }
        }

        let xxshShowDelta = deltaMap[Macros.EUAI_XSSHSHOW];
        if (undefined != xxshShowDelta) {
            hpDelta = xxshShowDelta;
        }

        if (hpDelta < 0) {
            if (uac.m_uiEffectMask == Macros.EffectMask_Critical) {
                list.push(EffectUnit_HPDOWN_CRIT.create(hpDelta));
            }
            else {
                if (casterIsHero && targetType != UnitCtrlType.collection) {
                    if (skillBranch == KeyWord.SKILL_BRANCH_FABAO) {
                        list.push(EffectUnit_HPDOWN_FABAO.create(hpDelta));
                    }
                    else {
                        list.push(EffectUnit_HPDOWN_HERO.create(hpDelta));
                    }
                }
                else if (casterType == UnitCtrlType.pet) {
                    if (targetIsHero) {
                        list.push(EffectUnit_HPDOWN_MONSTER.create(hpDelta));
                    }
                    else {
                        list.push(EffectUnit_HPDOWN_BEAUTY.create(hpDelta));
                    }
                }
                else if (casterIsMonster) {
                    list.push(EffectUnit_HPDOWN_MONSTER.create(hpDelta));
                }
                else if (casterType == UnitCtrlType.role) {
                    if (targetIsHero) {
                        list.push(EffectUnit_HPDOWN_MONSTER.create(hpDelta));
                    }
                }
            }
            hurt = true;
        }

        let pjshShowDelta = deltaMap[Macros.EUAI_PJSHSHOW];
        if (undefined != pjshShowDelta) {
            // 显示破击 破击计算结果不是0的时候显示飘字 施法者自己可见
            if (pjshShowDelta > 0 && casterIsHero) {
                list.push(EffectUnit_PoJi.create(pjshShowDelta));
            }
        }

        let gdDelta = deltaMap[Macros.EUAI_GDSHOW];
        if (undefined != gdDelta) {
            // 显示格挡
            if (gdDelta > 0 && (casterIsHero || targetIsHero)) {
                list.push(EffectUnit_GeDang.create(gdDelta));
            }
        }

        let zsshDelta = deltaMap[Macros.EUAI_ZSSHSHOW];
        if (undefined != zsshDelta) {
            // 显示真神 真神pvp只播放在他选中哪个目标上
            if (zsshDelta > 0 && (casterIsHero || targetIsHero)) {
                list.push(EffectUnit_ZhenShenYiJi.create(zsshDelta));
            }
        }
        let container = target.model.topTitleContainer;
        Game.Tools.GetPosition(container.transform, this.titleV3);
        let targetPixelPos = target.getPixelPosition();
        if (list.length > 0) {
            let casterPosPixel = caster.getPixelPosition();
            let offsetY = 30 + Math.random() * 30;
            for (let eu of list) {
                this.createEffect(casterPosPixel, target, eu, targetPixelPos, offsetY);
                offsetY += 20;
            }
        }
        if (hurt) {
            target.onHit();
        }
    }

    private static createEffect(casterPosPixel: UnityEngine.Vector2, target: UnitController, effect: EffectUnit, targetPixelPos: UnityEngine.Vector2, offsetY: number) {
        let v3 = G.cacheVec3;
        v3.Set(this.titleV3.x, this.titleV3.y, this.titleV3.z);
        v3.y -= 1;
        Game.Tools.SetGameObjectPosition(effect.gameObject, v3);
        Game.Tools.GetGameObjectLocalPosition(effect.gameObject, v3);
        if (target.Data.unitType != UnitCtrlType.hero) {
            if (Math.random() > 0.5) {
                v3.x += Math.random() * 100;
            } else {
                v3.x -= Math.random() * 100;
            }
            v3.y -= offsetY;
            Game.Tools.SetGameObjectLocalPosition(effect.gameObject, v3);
            let len = Math.random() * 50 + 120;
            let v2 = G.cacheVec2;
            v2.Set(casterPosPixel.x - targetPixelPos.x, casterPosPixel.y - targetPixelPos.y);
            v2.Normalize();
            v3.x -= v2.x * len;
            v3.y += v2.y * len;
        }
        else {
            Game.Tools.SetGameObjectLocalPosition(effect.gameObject, v3);
            v3.y += 60;
        }
        //step1
        effect.start(v3);
    }

    public static cacheAll() {
        for (let i = 0; i < 15; i++) {
            let effect = new EffectUnit_HPDOWN_HERO();
            effect.pushToPool();
        }
        for (let i = 0; i < 10; i++) {
            let effect = new EffectUnit_HPDOWN_BEAUTY();
            effect.pushToPool();
        }
        for (let i = 0; i < 5; i++) {
            let effect = new EffectUnit_HPDOWN_CRIT();
            effect.pushToPool();
        }
        for (let i = 0; i < 5; i++) {
            let effect = new EffectUnit_HPDOWN_MONSTER();
            effect.pushToPool();
        }
    }
}

abstract class EffectUnit {
    public effectType: EffetType = EffetType.HPUP;
    public value: number = 0;
    public gameObject: UnityEngine.GameObject;
    private valueText: UnityEngine.UI.Text;
    private positionTween: Tween.TweenPosition;
    private niceInvoker: Game.NiceInvoker;
    public createGameObject(prefab: UnityEngine.GameObject, hasValue: boolean = true) {
        this.gameObject = UnityEngine.GameObject.Instantiate(prefab, G.ViewCacher.worldUIElementView.effectRoot, true) as UnityEngine.GameObject;
        if (hasValue) {
            this.valueText = Game.Tools.GetChildElement(this.gameObject, TypeCacher.Text, "moveanim/number") as UnityEngine.UI.Text;
        }
        this.niceInvoker = Game.NiceInvoker.Get(this.gameObject);
        this.niceInvoker.SetCall(1, delegate(this, this.pushToPool));
    }
    setValue(value: number) {
        if (value < 0) {
            value = -value;
        }
        if (this.valueText != null) {
            this.valueText.text = value.toString();
        }
    }
    start(v3: UnityEngine.Vector3) {
        this.positionTween = Tween.TweenPosition.Begin(this.gameObject, 0.2, v3, false);
        this.niceInvoker.Call(1, 1);
        this.gameObject.SetActive(true);
    }
    public pushToPool() {
        this.gameObject.SetActive(false);
    }
    onDestroy() {
        UnityEngine.GameObject.Destroy(this.gameObject);
        this.gameObject = null;
        this.valueText = null;
        this.positionTween = null;
        this.niceInvoker.Clear();
        this.niceInvoker = null;
    }
}
class EffectUnit_HPUP extends EffectUnit implements IPool {
    public static pool = new ObjectPool();
    constructor() {
        super();
        this.effectType = EffetType.HPUP;
        this.createGameObject(G.ViewCacher.worldUIElementView.cureNumber_hero);
    }

    public static create(value: number): EffectUnit_HPUP {
        let effect = EffectUnit_HPUP.pool.pop() as EffectUnit_HPUP;
        if (effect == null) {
            effect = new EffectUnit_HPUP();
        }
        effect.setValue(value);
        return effect;
    }
    public pushToPool() {
        super.pushToPool();
        EffectUnit_HPUP.pool.push(this);
    }
}
class EffectUnit_HPDOWN_CRIT extends EffectUnit implements IPool {
    public static pool = new ObjectPool();
    constructor() {
        super();
        this.effectType = EffetType.HPDOWN_CRIT;
        this.createGameObject(G.ViewCacher.worldUIElementView.hurtNumber_hero_critic);
    }
    public static create(value: number): EffectUnit_HPDOWN_CRIT {
        let effect = EffectUnit_HPDOWN_CRIT.pool.pop() as EffectUnit_HPDOWN_CRIT;
        if (effect == null) {
            effect = new EffectUnit_HPDOWN_CRIT();
        }
        effect.setValue(value);
        return effect;
    }
    public pushToPool() {
        super.pushToPool();
        EffectUnit_HPDOWN_CRIT.pool.push(this);
    }
}
class EffectUnit_HPDOWN_HERO extends EffectUnit implements IPool {
    public static pool = new ObjectPool();
    constructor() {
        super();
        this.effectType = EffetType.HPDOWN_HERO;
        this.createGameObject(G.ViewCacher.worldUIElementView.hurtNumber_hero);
    }
    public static create(value: number): EffectUnit_HPDOWN_HERO {
        let effect = EffectUnit_HPDOWN_HERO.pool.pop() as EffectUnit_HPDOWN_HERO;
        if (effect == null) {
            effect = new EffectUnit_HPDOWN_HERO();
        }
        effect.setValue(value);
        return effect;
    }
    public pushToPool() {
        super.pushToPool();
        EffectUnit_HPDOWN_HERO.pool.push(this);
    }
}
class EffectUnit_HPDOWN_BEAUTY extends EffectUnit implements IPool {
    public static pool = new ObjectPool();
    constructor() {
        super();
        this.effectType = EffetType.HPDOWN_BEAUTY;
        this.createGameObject(G.ViewCacher.worldUIElementView.hurtNumber_beauty);
    }
    public static create(value: number): EffectUnit_HPDOWN_BEAUTY {
        let effect = EffectUnit_HPDOWN_BEAUTY.pool.pop() as EffectUnit_HPDOWN_BEAUTY;
        if (effect == null) {
            effect = new EffectUnit_HPDOWN_BEAUTY();
        }
        effect.setValue(value);
        return effect;
    }
    public pushToPool() {
        super.pushToPool();
        EffectUnit_HPDOWN_BEAUTY.pool.push(this);
    }
}
class EffectUnit_HPDOWN_FABAO extends EffectUnit implements IPool {
    public static pool = new ObjectPool();
    constructor() {
        super();
        this.effectType = EffetType.HPDOWN_FABAO;
        this.createGameObject(G.ViewCacher.worldUIElementView.hurtNumber_fabao);
    }
    public static create(value: number): EffectUnit_HPDOWN_BEAUTY {
        let effect = EffectUnit_HPDOWN_FABAO.pool.pop() as EffectUnit_HPDOWN_FABAO;
        if (effect == null) {
            effect = new EffectUnit_HPDOWN_FABAO();
        }
        effect.setValue(value);
        return effect;
    }
    public pushToPool() {
        super.pushToPool();
        EffectUnit_HPDOWN_FABAO.pool.push(this);
    }
}
class EffectUnit_PoJi extends EffectUnit implements IPool {
    public static pool = new ObjectPool();
    constructor() {
        super();
        this.effectType = EffetType.PoJi;
        this.createGameObject(G.ViewCacher.worldUIElementView.poJi);
    }
    public static create(value: number): EffectUnit_PoJi {
        let effect = EffectUnit_PoJi.pool.pop() as EffectUnit_PoJi;
        if (effect == null) {
            effect = new EffectUnit_PoJi();
        }
        effect.setValue(value);
        return effect;
    }
    public pushToPool() {
        super.pushToPool();
        EffectUnit_PoJi.pool.push(this);
    }
}
class EffectUnit_ZhenShenYiJi extends EffectUnit implements IPool {
    public static pool = new ObjectPool();
    constructor() {
        super();
        this.effectType = EffetType.ZhenShenYiJi;
        this.createGameObject(G.ViewCacher.worldUIElementView.zhenShenYiJi);
    }
    public static create(value: number): EffectUnit_ZhenShenYiJi {
        let effect = EffectUnit_ZhenShenYiJi.pool.pop() as EffectUnit_ZhenShenYiJi;
        if (effect == null) {
            effect = new EffectUnit_ZhenShenYiJi();
        }
        effect.setValue(value);
        return effect;
    }
    public pushToPool() {
        super.pushToPool();
        EffectUnit_ZhenShenYiJi.pool.push(this);
    }
}
class EffectUnit_GeDang extends EffectUnit implements IPool {
    public static pool = new ObjectPool();
    constructor() {
        super();
        this.effectType = EffetType.GeDang;
        this.createGameObject(G.ViewCacher.worldUIElementView.geDang);
    }
    public static create(value: number): EffectUnit_GeDang {
        let effect = EffectUnit_GeDang.pool.pop() as EffectUnit_GeDang;
        if (effect == null) {
            effect = new EffectUnit_GeDang();
        }
        effect.setValue(value);
        return effect;
    }
    public pushToPool() {
        super.pushToPool();
        EffectUnit_GeDang.pool.push(this);
    }
}
class EffectUnit_HPDOWN_MONSTER extends EffectUnit implements IPool {
    public static pool = new ObjectPool();
    constructor() {
        super();
        this.effectType = EffetType.HPDOWN_MONSTER;
        this.createGameObject(G.ViewCacher.worldUIElementView.hurtNumber_monster);
    }
    public static create(value: number): EffectUnit_HPDOWN_MONSTER {
        let effect = EffectUnit_HPDOWN_MONSTER.pool.pop() as EffectUnit_HPDOWN_MONSTER;
        if (effect == null) {
            effect = new EffectUnit_HPDOWN_MONSTER();
        }
        effect.setValue(value);
        return effect;
    }
    public pushToPool() {
        super.pushToPool();
        EffectUnit_HPDOWN_MONSTER.pool.push(this);
    }
}
class EffectUnit_MISS_HERO extends EffectUnit implements IPool {
    public static pool = new ObjectPool();
    constructor() {
        super();
        this.effectType = EffetType.MISS_HERO;
        this.createGameObject(G.ViewCacher.worldUIElementView.miss_green, false);
    }
    public static create(): EffectUnit_MISS_HERO {
        let effect = EffectUnit_MISS_HERO.pool.pop() as EffectUnit_MISS_HERO;
        if (effect == null) {
            effect = new EffectUnit_MISS_HERO();
        }
        effect.setValue(0);
        return effect;
    }
    public pushToPool() {
        super.pushToPool();
        EffectUnit_MISS_HERO.pool.push(this);
    }
}
class EffectUnit_MISS_MONSTER extends EffectUnit implements IPool {
    public static pool = new ObjectPool();
    constructor() {
        super();
        this.effectType = EffetType.MISS_MONSTER;
        this.createGameObject(G.ViewCacher.worldUIElementView.miss_grey, false);
    }
    public static create(): EffectUnit_MISS_MONSTER {
        let effect = EffectUnit_MISS_MONSTER.pool.pop() as EffectUnit_MISS_MONSTER;
        if (effect == null) {
            effect = new EffectUnit_MISS_MONSTER();
        }
        effect.setValue(0);
        return effect;
    }
    public pushToPool() {
        super.pushToPool();
        EffectUnit_MISS_MONSTER.pool.push(this);
    }
}
enum EffetType {
    HPUP,
    HPDOWN_CRIT,
    HPDOWN_HERO,
    HPDOWN_BEAUTY,
    HPDOWN_FABAO,
    HPDOWN_MONSTER,
    MISS_HERO,
    MISS_MONSTER, 
    PoJi, 
    ZhenShenYiJi, 
    GeDang, 
}