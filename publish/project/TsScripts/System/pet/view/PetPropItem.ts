import { Color } from 'System/utils/ColorUtil'
import { KeyWord } from 'System/constants/KeyWord'
import { TextFieldUtil } from 'System/utils/TextFieldUtil'

export class PetPropItem {
    private propNameText: UnityEngine.UI.Text;
    private valueText: UnityEngine.UI.Text;

    gameObject: UnityEngine.GameObject;

    setUsual(go: UnityEngine.GameObject) {
        this.gameObject = go;
        let propNameText = go.transform.GetComponent(UnityEngine.UI.Text.GetType()) as UnityEngine.UI.Text;
        let valueText = go.transform.Find('value').GetComponent(UnityEngine.UI.Text.GetType()) as UnityEngine.UI.Text;
        this.setComponents(propNameText, valueText);
    }

    setComponents(propNameText: UnityEngine.UI.Text, valueText: UnityEngine.UI.Text): void {
        this.propNameText = propNameText;
        this.valueText = valueText;
    }

    update(propId: number, propValue: number, isPercent = false, color: string = null): void {
        if (propId > 0) {
            let name: string = KeyWord.getDesc(KeyWord.GROUP_EQUIP_PROP, propId);
            this.updateByNameAndValue(name, propValue, isPercent, color)
        }
        else {
            this.updateByNameAndValue(null, 0, false, null);
        }
    }

    updateByNameAndValue(propName: string, propValue: number, isPercent = false, color: string = null) {
        if (propName) {
            let nameStr = propName;
            if (null != color) {
                nameStr = TextFieldUtil.getColorText(nameStr, color);
            }
            this.propNameText.text = nameStr;

            let valueStr: string;
            if (propValue > 0) {
                if (isPercent) {
                    valueStr = propValue + '%';
                } else {
                    valueStr = propValue.toString();
                }
            }
            else {
                valueStr = '--';
            }

            if (null != color) {
                valueStr = TextFieldUtil.getColorText(valueStr, color);
            }
            this.valueText.text = valueStr;
            this.propNameText.gameObject.SetActive(true);
            this.valueText.gameObject.SetActive(true);
        }
        else {
            this.propNameText.gameObject.SetActive(false);
            this.valueText.gameObject.SetActive(false);
        }
    }
}
