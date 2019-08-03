import { Events } from "System/Events";
import { NetHandler } from "System/protocol/NetHandler";
/**
 * 事件监听器。
 */
export class EventDispatcher {
    static globalEvents = {};

    private myEvents = null;
    private myEventTimes = null;

    private netListeners: Array<{ msgid: number, deleg: () => void, newDeleg: () => void }> = [];

    /**
     * 派发附带参数的事件。
     * @param type 事件类型。
     * @param args 事件参数，可选。
     */
    dispatchEvent(type: Events, ...args): void {
        let whoList: Array<EventDispatcher> = EventDispatcher.globalEvents[type] as Array<EventDispatcher>;
        if (null == whoList) {
            return;
        }

        let len: number = whoList.length;
        let i: number, who: EventDispatcher;
        for (i = 0; i < len; i++) {
            who = whoList[i];
            if (null != who && !who.isToBeDeleted(type)) {
                who.onEvent.call(who, type, args);
            }
        }

        // 删除掉没有次数的监听
        for (i = len - 1; i >= 0; i--) {
            who = whoList[i];
            if (null == who || who.isToBeDeleted(type)) {
                whoList.splice(i, 1);
                this.removeEventInternal(type, false);
            }
        }
    }

    /**
     * 请勿调用。
     * @param type
     * @param argsArr
     */
    onEvent(type: Events, argsArr: any[]): void {
        if (null == this.myEvents) return;
        let deleg = this.myEvents[type];
        if (null == deleg) return;

        if (null != this.myEventTimes) {
            let times: number = this.myEventTimes[type];
            if (0 == times) {
                // 已经没有次数
                return;
            } else {
                // 先减去次数，因回调中可能会再次触发事件
                this.myEventTimes[type] = --times;
            }
        }

        deleg.apply(null, argsArr);
    }

    /**
     * 添加事件侦听。
     * @param type 事件类型。
     * @param deleg 回调委托，不需要使用delegate，函数内部已实现delegate包装
     * @param times 事件生效次数，0或负值表无限次，正值表有限次。
     */
    protected addEvent(type: Events, deleg, times: number = -1): void {
        let whoList: Array<EventDispatcher> = EventDispatcher.globalEvents[type] as Array<EventDispatcher>;
        if (null == whoList) {
            EventDispatcher.globalEvents[type] = whoList = [this];
        } else if (whoList.indexOf(this) < 0) {
            whoList.push(this);
        }
        if (null == this.myEvents) {
            this.myEvents = {};
        }
        this.myEvents[type] = delegate(this, deleg);
        if (times > 0) {
            if (null == this.myEventTimes) {
                this.myEventTimes = {};
            }
            this.myEventTimes[type] = times;
        }
    }

    removeEvent(type: Events): void {
        this.removeEventInternal(type, true);
    }

    private removeEventInternal(type: Events, removeList: boolean): void {
        if (removeList) {
            let whoList: Array<EventDispatcher> = EventDispatcher.globalEvents[type] as Array<EventDispatcher>;
            if (null != whoList) {
                let idx: number = whoList.indexOf(this);
                if (idx >= 0) {
                    // 由于可能在onEvent的时候删除事件监听，因此这里对数组赋null而非删除，防止数组长度被修改
                    whoList[idx] = null;
                }
            }
        }
        if (null != this.myEvents) {
            delete this.myEvents[type];
        }
        if (null != this.myEventTimes) {
            delete this.myEventTimes[type];
        }
    }

    isToBeDeleted(type: Events): boolean {
        return null != this.myEventTimes && 0 == this.myEventTimes[type];
    }

    protected addNetListener(msgid: number, deleg) {
        if (this.hasNetListener(msgid, deleg))
            return;
        let newDeleg = delegate(this, deleg);
        this.netListeners.push({ msgid: msgid, deleg: deleg, newDeleg: newDeleg });
        NetHandler.addListener(msgid, newDeleg);
    }

    protected removeNetListener(deleg) {
        for (let i = this.netListeners.length - 1; i >= 0; i--) {
            let listener = this.netListeners[i];
            if (listener.deleg !== deleg) continue;
            NetHandler.removeListener(listener.msgid, listener.newDeleg);
            this.netListeners.splice(i, 1);
        }
    }

    private hasNetListener(msgid:number, deleg): boolean {
        for (let listener of this.netListeners) {
            if (listener.msgid === msgid && listener.deleg === deleg) return true;
        }
        return false;
    }
}
export default EventDispatcher;