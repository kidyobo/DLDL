import { UiElements } from 'System/uilib/UiElements'
import { Global as G } from "System/global"
import { Macros } from 'System/protocol/Macros'
import { RichTextUtil } from 'System/utils/RichTextUtil'
import { Color } from 'System/utils/ColorUtil'
import { ChannelData } from 'System/chat/ChannelData'
import { ElemFinder } from 'System/uilib/UiUtility'
import { KeyWord } from 'System/constants/KeyWord'
import { CommonForm, UILayer, GameObjectGetSet, TextGetSet } from "System/uilib/CommonForm"
import { NewFuncPreView } from "System/main/view/NewFuncPreView"
export class NewFuncPreCtrl {
    private gameObject: GameObjectGetSet;
    private icon: UnityEngine.UI.Image;
    private level: TextGetSet;
    private canget: GameObjectGetSet;
    private lastlevel: number = -1;
    private funcName: TextGetSet;
    setView(uiElems: UiElements) {
        let newfuncpre = uiElems.getUiElements('newfuncpre');
        this.gameObject = new GameObjectGetSet(uiElems.getElement('newfuncpre'));
        this.canget = new GameObjectGetSet(newfuncpre.getElement('canget'));
        this.funcName = new TextGetSet(newfuncpre.getText('funcName'));
        this.icon = newfuncpre.getImage("icon");
        this.level = new TextGetSet(newfuncpre.getText("level"));
        Game.UIClickListener.Get(newfuncpre.getElement("bg")).onClick = delegate(this, this.onClick);
    }
    public updateView() {
        if (G.DataMgr.sceneData.curPinstanceID <= 0) {
            let checkLevel = G.DataMgr.heroData.level;
            let cfg = G.DataMgr.newFuncPreData.getCurLevelSuitConfig(checkLevel);
            if (cfg) {
                if (this.lastlevel != checkLevel) {
                    this.lastlevel = checkLevel;
                    this.funcName.text = cfg.m_szName;
                    let sprite = G.AltasManager.getActIcon(cfg.m_iFunctionName);
                    if (null == sprite) {
                        // 看看父功能有木有图标
                        let funcCfg = G.DataMgr.funcLimitData.getFuncLimitConfig(cfg.m_iFunctionName);
                        if (funcCfg.m_iParentName > 0) {
                            if (funcCfg.m_iParentName == 541) {//boss大图标的话,要换成bossFuncIcon
                                sprite = G.AltasManager.getActIconByName("bossFuncIcon");
                            } else {
                                sprite = G.AltasManager.getActIcon(funcCfg.m_iParentName);
                            }
                        }
                    }
                    this.icon.sprite = sprite;
                    this.level.text = uts.format("{0}级开启", cfg.m_iLevel);
                }
                this.gameObject.SetActive(true);
            }
            else {
                this.gameObject.SetActive(false);
            }
            let info = G.DataMgr.activityData.m_stPreviewRewardInfo;
            let ok = true;
            if (info) {
                for (let config of G.DataMgr.newFuncPreData.list) {
                    if (config.m_iItemID > 0 && config.m_iLevel <= checkLevel) {
                        if (info.m_stRewardList.indexOf(config.m_iFunctionName) == -1) {
                            ok = false;
                            break;
                        }
                    }
                }
            }
            this.canget.SetActive(!ok);
        }
        else {
            this.gameObject.SetActive(false);
        }
        let view = G.Uimgr.getForm<NewFuncPreView>(NewFuncPreView);
        if (view != null) {
            view.updateView();
        }
    }
    private onClick() {
        G.Uimgr.createForm<NewFuncPreView>(NewFuncPreView).open();
    }
}