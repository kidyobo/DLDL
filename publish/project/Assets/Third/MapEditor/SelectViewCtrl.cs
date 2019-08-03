#if UNITY_EDITOR
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System.IO;
public class SelectViewCtrl : MonoBehaviour
{
    public GameObject back;
    public GameObject view1;
    public InputField sceneIDInput;
    public Button BT_Load;

    public GameObject view2;
    public Button BT_Create;
    public Button BT_Modify;
    public Button BT_Delete;
    public Button BT_Return;
    public Dropdown unityScenes;
    public Text sceneID;

    public GameObject view3;
    private int currentSceneID = 0;
    private MapData data;
    // Use this for initialization
    void Awake()
    {
        view1.SetActive(true);
        view2.SetActive(false);
        view3.SetActive(false);
        BT_Load.onClick.AddListener(OnClickLoad);
        BT_Create.onClick.AddListener(OnClickCreate);
        BT_Modify.onClick.AddListener(OnClickModify);
        BT_Delete.onClick.AddListener(OnClickDelete);
        BT_Return.onClick.AddListener(OnClickReturn);
    }
    void OnClickLoad()
    {
        int id;
        int.TryParse(sceneIDInput.text, out id);
        if (id <= 0)
        {
            return;
        }
        sceneIDInput.text = "";
        currentSceneID = id;
        sceneID.text = id.ToString();
        //分新建和修改二种情况
        data = MapOutput.ReadMapData("ServerMapData/" + id + "/data.rsc");
        view1.SetActive(false);
        view2.SetActive(true);
        view3.SetActive(false);
        view2.GetComponentInChildren<TweenAlpha>().enabled = true;
        var scenes = UnityEditor.EditorBuildSettings.scenes;
        unityScenes.ClearOptions();
        List<string> strs = new List<string>();
        int index = 0;
        int idCount = 0;
        for (int i = 0; i < scenes.Length; i++)
        {
            var name = System.IO.Path.GetFileNameWithoutExtension(scenes[i].path);
            int temp;
            if (name.Length == 4 && int.TryParse(name, out temp))
            {
                strs.Add(name);
                if (data != null && data.sceneID.ToString() == name)
                {
                    index = idCount;
                }
                idCount++;
            }
        }
        unityScenes.AddOptions(strs);
        unityScenes.value = index;
        if (data == null)
        {
            unityScenes.enabled = true;
            //crearte
            BT_Modify.gameObject.SetActive(false);
            BT_Delete.gameObject.SetActive(false);
            BT_Create.gameObject.SetActive(true);

        }
        else
        {
            unityScenes.enabled = false;
            //modify
            BT_Modify.gameObject.SetActive(true);
            BT_Delete.gameObject.SetActive(true);
            BT_Create.gameObject.SetActive(false);

        }
    }
    void OnClickCreate()
    {
        int uid = int.Parse(unityScenes.options[unityScenes.value].text);
        var map = new MapData();
        map.sceneID = uid;
        data = map;
        MapOutput.OutputServerMap(map, "ServerMapData/" + currentSceneID + "/data.rsc");
        EnterScene();
    }
    void OnClickModify()
    {
        EnterScene();
    }
    void OnClickDelete()
    {
        if (Directory.Exists("ServerMapData/" + currentSceneID))
        {
            Directory.Delete("ServerMapData/" + currentSceneID, true);
        }
        var path = "Assets/AssetSources/map/data/" + currentSceneID + ".bytes";
        if (File.Exists(path))
        {
            File.Delete(path);
        }
        OnClickReturn();
    }
    void OnClickReturn()
    {
        view1.SetActive(true);
        view2.SetActive(false);
        view3.SetActive(false);
        view1.GetComponentInChildren<TweenAlpha>().enabled = true;
    }

    void EnterScene()
    {
        view3.SetActive(true);
        SceneEditor.instance.EnterScene(currentSceneID, data);
    }
}
#endif