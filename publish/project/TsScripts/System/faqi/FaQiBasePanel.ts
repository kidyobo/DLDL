import { TabSubForm } from 'System/uilib/TabForm'

export abstract class FaQiBasePanel extends TabSubForm {
    abstract onContainerChange(type: number);
}