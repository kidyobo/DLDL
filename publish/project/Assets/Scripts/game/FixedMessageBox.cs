using UnityEngine;
using System.Collections;

public class FixedMessageBox
{
    public static void Show(string text, System.Action<bool> callback)
    {
        var fixedAsset = ResLoader.LoadAsset("ui/FixedMessageBox.prefab");
        var obj = fixedAsset.Instantiate(null, false);
        GameObject.DontDestroyOnLoad(obj);
        obj.SetActive(true);
        var mapper = obj.GetComponent<ElementsMapper>();
        var btnConfirm = mapper.GetElement("btnConfirm");
        var btnCancel = mapper.GetElement("btnCancel");
        var infoText = mapper.GetElement<UnityEngine.UI.Text>("infoText");
        infoText.text = text;
        UIClickListener.Get(btnConfirm).onClick = () =>
        {
            GameObject.Destroy(obj);
            obj = null;
            callback(true);
        };
        UIClickListener.Get(btnCancel).onClick = () =>
        {
            GameObject.Destroy(obj);
            obj = null;
            callback(false);
        };
    }
}