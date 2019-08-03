import { Global as G } from 'System/global'
import { EnumGuide } from 'System/constants/GameEnum'
import { FunctionGuider } from 'System/guide/cases/FunctionGuider'
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView'
import { GuildView } from 'System/guild/view/GuildView'
import { GuildEnterPanel } from 'System/guild/view/GuildEnterPanel'
import { KeyWord } from 'System/constants/KeyWord'
import { Constants } from 'System/constants/Constants'

export class GuildGuider extends FunctionGuider {

    constructor() {
        super(EnumGuide.Guild, 0, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(GuildView)];
    }

    protected fillSteps(): void {
        this._addStep(EnumGuide.Guild_OpenGuildView, this._onStepOpenGuildView);
        this._addStep(EnumGuide.Guild_ClickApply, this._onStepClickApply);
        this._addStep(EnumGuide.Guild_ClickClose, this._onStepClickClose);
    }

    private _onStepOpenGuildView(step: EnumGuide) {
        if (G.DataMgr.heroData.guildId > 0) {//有宗门了就跳过指引
            G.GuideMgr.cancelGuide(EnumGuide.HunGuDecompose);
        } else {
            let view = G.Uimgr.getForm<GuildView>(GuildView);
            if (view != null) {
                let enterView = view.getTabFormByID(KeyWord.OTHER_FUNCTION_GUILD_ENTER) as GuildEnterPanel;
                if (enterView != null && enterView.isOpened) {
                    enterView.guideSetting();
                }
            } else {
                if (!G.MainBtnCtrl.IsOpened) {
                    G.MainBtnCtrl.onClickBtnSwitcher();
                }
                G.ViewCacher.functionGuideView.guideOn(
                    G.MainBtnCtrl.getFuncBtn(KeyWord.BAR_FUNCTION_GUILD),
                    EnumGuideArrowRotation.left,
                    { x: 20, y: 0 },
                    [], true,
                    { x: 0, y: 0 },
                    { x: 70, y: 70 }
                );
            }
        }
    }
    private _onStepClickApply(step: EnumGuide): void {
        let enterView = G.Uimgr.getSubFormByID<GuildEnterPanel>(GuildView, KeyWord.OTHER_FUNCTION_GUILD_ENTER);
        if (enterView != null)
            G.ViewCacher.functionGuideView.guideOn(enterView.btnOnekey, EnumGuideArrowRotation.top, { x: 0, y: 30 });
    }

    private _onStepClickClose(step: EnumGuide): void {
        this.guideOnBtnReturn(G.Uimgr.getForm<GuildView>(GuildView).btnReturn);
    }

    protected _forceStep(step: EnumGuide): boolean {
        if (EnumGuide.Guild_OpenGuildView == step) {
            G.Uimgr.createForm<GuildView>(GuildView).open(KeyWord.OTHER_FUNCTION_GUILD_ENTER);
            return true;
        }
        let view = G.Uimgr.getForm<GuildView>(GuildView);
        if (null != view) {
            if (EnumGuide.Guild_ClickApply == step) {
                let enterView = view.getTabFormByID(KeyWord.OTHER_FUNCTION_GUILD_ENTER) as GuildEnterPanel;
                if (null != enterView && enterView.isOpened) {
                    return enterView.force(this.type, step);
                }
            } else if (EnumGuide.Guild_ClickClose == step) {
                return view.force(this.type, step);
            }
        }
        return false;
    }
}