import { Global as G } from 'System/global'
import { FuncBtnState } from 'System/constants/GameEnum'

/**
 *主ui右上角快捷功能入口数据
 *
 */
export class ScfItemData {
    /**按钮id*/
    id: number = 0;

    subTabs: number[];

    /**红点提示数字，大于0显示红点*/
    tipCount: number = 0;

    /**按钮状态，正常，闪烁，不可见等，
    1.第一排图标默认无特效显示。
2.第二排、第三排普通图标、子图标，每次激活新的功能页签、每次重新上线时，显示特效环绕。玩家点击该图标后，特效消失。
3.第二排、第三排父图标，当其下有子图标有环绕特效时，父图标也环绕特效。*/
    state: FuncBtnState = FuncBtnState.Normal;

    /**是否新开放的功能，新功能需要转圈特效*/
    systemEffect = false;

    /**是否需要有宗门*/
    needGuild = false;

    /**需要检查活动状态的id，对于非时段活动按钮，如果关联了活动id，则只有活动运行时才显示按钮*/
    checkActivityIds: number[];

    /**需要检查活动场景的id*/
    checkSceneId = 0;

    /**描述字段*/
    desc: string;

    time = 0;

    needBg = true;

    private m_actName: string = null;

    constructor(id) {
        this.id = id;
    }

    setDisplayName(value: string) {
        this.m_actName = value;
    }

    getDisplayName(): string {
        if (null == this.m_actName || '' == this.m_actName) {
            this.m_actName = '未知';
        }
        return this.m_actName;
    }
}
