import { Global as G } from 'System/global'
import { FloatTip, FloatShowType } from 'System/floatTip/FloatTip'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'
import { Macros } from 'System/protocol/Macros'

export enum ConfirmCheck {
    /**不带勾选按钮*/
    noCheck = 0,
    /**带勾选按钮*/
    withCheck = 1,
    /**自动勾选按钮*/
    autoCheck = 2
}

export enum MessageBoxConst {
    yes = 0, 
    no = 1,
    /**这里x代表关闭按钮 */
    x = 3,
}

/**
 * 游戏tip管理器。
 */
export class TipManager {
    /**当前确认框的id，从1开始，1表示强制匹配。*/
    private messageBoxId: number = 1;
    /**
	* 
	* @param tipStr 显示内容
	* @param showType 显示样式
	* @param showValue 显示颜色，（0，-红，1-绿）
	* @param isEnter 安全区提示
	*/
    addMainFloatTip(tipStr: string, showType: number = -1, typeValue = 0): void {
        let data = G.DataMgr.sceneData.curSceneID;
        if (data <= 0) {
            return;
        }

        let floatTip: FloatTip;
        if (showType == Macros.PROMPTMSG_TYPE_ROLL || showType == Macros.PROMPTMSG_TYPE_SKILL || showType == Macros.PROMPTMSG_TYPE_LINGBAO) {
            floatTip = G.ViewCacher.belowTip;
        } else {
            floatTip = G.ViewCacher.aboveTip;
        }
        if (!floatTip.isOpened) {
            floatTip.open();
        }
        floatTip.addFloatTip(tipStr, showType);

    }

    /**
    * 添加定点位置的文字提示
    * @param tipStr
    * @param color
    * @param x
    * @param y
    *
    */
    addPosTextMsg(tipStr: string, color: string, target: UnityEngine.Transform, offsetX: number, offsetY: number, isDown: boolean = false): void {
        //因为这个界面已经缓存，所以可同步打开和调用
        let view = G.ViewCacher.posTextTipView;
        if (!view.isOpened) {
            view.open();
        }
        view.showTextAtPosition(tipStr,color,target, offsetX, offsetY);
    }


    /**
     * 显示提示框。
     * @param info
     * @param style
     * @param btnText
     * @param callback
     * @param args
     * @param bindedDialog
     * @param noReplace
     * @param counter
     * @param defaultButton
     * @param offset
     */
    showConfirm(info: string,
        style: ConfirmCheck,
        btnText: string = null,
        deleg: (state: MessageBoxConst, isCheckSelected: boolean)=>void = null, 
        counter: number = 0,
        defaultButton: number = 0, showX = false, isShowBuyCount = false): number {
        let messageBox = G.ViewCacher.messageBox;
        if (null != messageBox) {
            this.messageBoxId++;
            G.ViewCacher.messageBox.open(info, style, btnText, deleg, counter, defaultButton, showX, isShowBuyCount);
            return this.messageBoxId;
        } else {
            return 0;
        }
    }

    /**
	* 检查确认框是否打开。
	* @param id
	* @return
	*
	*/
    isConfirmShowing(id: number): boolean {
        return (1 == id || this.messageBoxId == id) && G.ViewCacher.messageBox.isOpened;
    }

    /**
     * 关闭确认框，需要提供确认框ID，如果确认框ID不正确则无法关闭。特殊情况下，提供1可以强制关闭，但是通常情况下请不要提供1，除非
     * 你是全局逻辑。
     * @param id
     *
     */
    closeConfirm(id: number): void {
        if (1 == id || this.messageBoxId == id) {
            G.ViewCacher.messageBox.close();
        }
    }
}