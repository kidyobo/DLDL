import { EnumGuide } from 'System/constants/GameEnum';
import { KeyWord } from 'System/constants/KeyWord';
import { Global as G } from 'System/global';
import { FunctionGuider } from 'System/guide/cases/FunctionGuider';
import { EnumGuideArrowRotation } from 'System/guide/FunctionGuideView';
import { ChatView } from 'System/chat/ChatView';
import { HunGuPanel } from 'System/hunli/HunGuPanel';
import { HunguSelectView } from 'System/hunli/HunguSelectView';

/**世界聊天引导 */
export class ChatWorldGuider extends FunctionGuider {

    constructor() {
        super(EnumGuide.ChatWorld, 0, true);
    }

    protected getCheckViewsExcludeForms(): any[] {
        return [G.Uimgr.getForm(ChatView)];
    }

    processRequiredParams(...args) {

    }

    protected fillSteps() {
        this._addStep(EnumGuide.ChatWorldClickOpenView, this._onStepClickOpenView);
        this._addStep(EnumGuide.ChatWorldClickSendBtn, this._onStepClickSendBtn);
        this.m_activeFrame = EnumGuide.ChatWorldClickOpenView;
    }
    private _onStepClickOpenView(step: EnumGuide) {
        let view = G.Uimgr.getForm<ChatView>(ChatView);
        if (view != null) {
            view.guideSetting();
        } else {
            G.ViewCacher.functionGuideView.guideOn(
                G.ViewCacher.mainView.mainChatCtrl.getChatBack(),
                EnumGuideArrowRotation.top,
                { x: 0, y: 70 },
                [], true,
                { x: 0, y: 0.9 },
                { x: 30, y: 0}
            );
        }
    }

    private _onStepClickSendBtn(step: EnumGuide) {
        let view = G.Uimgr.getForm<ChatView>(ChatView);
        if (view != null && view.isOpened) {
            if (view.btn_send)
                G.ViewCacher.functionGuideView.guideOn(view.btn_send, EnumGuideArrowRotation.right, { x: 0, y: 0 }, [], true, { x: 0, y: 0 }, { x: 0, y: 0 }, true);
        }
    }

    protected _forceStep(step: EnumGuide): boolean {
        if (step == EnumGuide.ChatWorldClickOpenView) {
            G.Uimgr.createForm<ChatView>(ChatView);
            return true;
        }
        else if (step == EnumGuide.ChatWorldClickSendBtn) {
            let view = G.Uimgr.getForm<ChatView>(ChatView);
            if (view != null && view.isOpened) {
                view.onClickSendMessageBt();
                return true;
            }
        }
        return false;
    }
}