import { CommonForm, UILayer } from "System/uilib/CommonForm"

export abstract class NestedSubForm extends CommonForm {
    layer(): UILayer {
        return UILayer.Normal;
    }

    __setId(id: number) {
        this.id = id;
    }

    __setRoot(rootPath: string) {
        this.rootPath = rootPath;
    }
}

/**
 * 具有添加子界面能力的抽象类,默认寻找panelRoot子节点（没有则使用根节点作为子界面的父节点）
 */
export abstract class NestedForm extends CommonForm {
    private children: { [id: number]: NestedSubForm } = {};
    private childrenLen = 0;
    createChildForm<T>(formclass, id: number, cacheForm = false, rootPath: string = null): T {
        let form = this.children[id] as NestedSubForm;
        if (form == null) {
            form = new formclass;
            if (null != rootPath) {
                form.__setRoot(rootPath);
            }
            if (id > 0) {
                form.__setId(id);
            }
            uts.assert(form.Id > 0, '请为ChildForm定义一个唯一的id');

            form.setParentView(this);
            this.children[form.Id] = form;
            form.createForm(cacheForm);
        }
        return form as any;
    }
    getChildForm<T>(id: number): T {
        let form = this.children[id];
        return form as any;
    }
    closeChildForm(id: number) {
        let form = this.children[id] as NestedSubForm;
        if (form != null) {
            form.close();
            if (!form.CacheForm) {
                delete this.children[id];
            }
        }
    }
    protected onDestroy() {
        for (let i in this.children) {
            this.children[i].destroy();
        }
    }
    protected onRelease() {
        this.children = null;
    }
}
export default NestedForm;