import { UIPathData } from "System/data/UIPathData"
import { TypeCacher } from 'System/TypeCacher';
import { UiElements } from 'System/uilib/UiElements';

export class DownLoadMsgBox {
    public static ins: DownLoadMsgBox = new DownLoadMsgBox();
    
    private form: UnityEngine.GameObject = null;
    private elems: UiElements = null;
    private msg = '';
    private callback: (confirm: boolean) => void = null;
    open(msg: string, callback: (confirm: boolean) => void) {
        this.close();
        this.msg = msg;
        this.callback = callback;
        let req = Game.ResLoader.CreateAssetRequest(Game.AssetPriority.High1, UIPathData.DownLoadMsgBox);
        Game.ResLoader.BeginAssetRequest(req, delegate(this, this.onLoad));
    }
    private onLoad(req: Game.AssetRequest) {
        if (req.error != null) { // 资源加载失败启用fixmsg
            Game.FixedMessageBox.Show(this.msg, this.callback);
            return;
        }
        this.form = req.mainAsset.Instantiate(null, false);
        let elems = this.form.GetComponent(TypeCacher.ElementsMapper) as Game.ElementsMapper;
        this.elems = new UiElements(elems);
        this.onOpen();
    }
    protected onOpen() {
        this.elems.getText('msgtxt').text = this.msg;
        Game.UIClickListener.Get(this.elems.getElement('btnConfirm')).onClick = delegate(this, this.onConfirm);
        Game.UIClickListener.Get(this.elems.getElement('btnCancel')).onClick = delegate(this, this.onCancel);
    }
    private onConfirm() {
        this.delayCall(true);
    }
    private onCancel() {
        this.delayCall(false);
    }
    private delayCall(confirm: boolean) {
        this.form.SetActive(false);
        new Game.Timer('DownLoadMsgBox', 1, 1, delegate(this, this.onDelayCall, confirm));
    }
    private onDelayCall(timer: Game.Timer, confirm: boolean) {
        this.callback(confirm);
        this.close();
    }
    private close() {
        UnityEngine.GameObject.Destroy(this.form);
        this.form = null;
        this.callback = null;
    }
}

