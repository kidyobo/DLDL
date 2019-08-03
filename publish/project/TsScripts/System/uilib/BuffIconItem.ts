import { Global as G } from "System/global";

export class BuffIconItem {
    /**buff图标*/
    private m_iconImage: UnityEngine.UI.RawImage;

    private iconName: string;
    private oldIconName: string;

    setUsual(go: UnityEngine.GameObject) {
        let iconTransform = go.transform.Find('icon');
        if (null != iconTransform) {
            this.m_iconImage = iconTransform.GetComponent(UnityEngine.UI.RawImage.GetType()) as UnityEngine.UI.RawImage;
        }

        if (null == this.m_iconImage) {
            this.m_iconImage = go.GetComponent(UnityEngine.UI.RawImage.GetType()) as UnityEngine.UI.RawImage;
        }
    }

    updateByIconName(iconName: string) {
        this.iconName = iconName;
    }

    updateIcon() {
        if (this.oldIconName != this.iconName) {
            this.oldIconName = this.iconName;
            G.ResourceMgr.loadIcon(this.m_iconImage, this.iconName);
        }
    }
}