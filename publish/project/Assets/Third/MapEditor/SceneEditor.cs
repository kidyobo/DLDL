#if UNITY_EDITOR
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
using System.IO;

public class SceneEditor : MonoBehaviour
{
    SceneViewCtrl sceneView = null;
    public OrbitCamera follower;
    public static SceneEditor instance;
    public MapData data;
    private int id;
    private GameObject selection;
    private TileMap tileMap = null;
    public System.Action onEnerScene = null;
    // Use this for initialization
    void Awake()
    {
        instance = this;
        GameObject.DontDestroyOnLoad(gameObject);
        follower = this.gameObject.AddComponent<OrbitCamera>();
        follower.target = new GameObject("target").transform;
        follower.cam = Camera.main.transform;
        follower.sensitivity = 6;
        follower.wsadsensitivity = 0.2f;
        var t = new GameObject("tilemap");
        GameObject.DontDestroyOnLoad(t);
        tileMap = t.AddComponent<TileMap>();
        GameObject.DontDestroyOnLoad(follower.target.gameObject);
        var se = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/AssetSources/effect/other/xuanzhong_blue.prefab");
        selection = GameObject.Instantiate<GameObject>(se);
        selection.SetActive(false);
        GameObject.DontDestroyOnLoad(selection);
        LoadSelectView();
    }

    public void SelectTarget(GameObject go)
    {
        if (go == null)
        {
            selection.transform.SetParent(null, false);
            selection.SetActive(false);
            follower.LockTarget(null);
            GameObject.DontDestroyOnLoad(selection);
        }
        else
        {
            selection.transform.SetParent(go.transform,false);
            selection.SetActive(true);
            follower.LockTarget(go);
        }
    }

    public void SaveScene()
    {
        if (data == null)
        {
            return;
        }
        var npcs = new List<UnitBase>();
        var monsters = new List<UnitBase>();
        var gates = new List<UnitBase>();
        var units = Component.FindObjectsOfType<UnitView>();
        foreach (var u in units)
        {
            if (u.unitType == UnitType.npc)
            {
                npcs.Add(u.GetUnitBase());
            }
            else if (u.unitType == UnitType.monster)
            {
                monsters.Add(u.GetUnitBase());
            }
            else if (u.unitType == UnitType.transport)
            {
                gates.Add(u.GetUnitBase());
            }
        }
        if (sceneView.reborn.isOn)
        {
            var pos = SceneData.instance.defaultPos;
            data.rebornX = (short)(pos.x * 20);
            data.rebornY = (short)(SceneEditor.instance.data.height - Mathf.RoundToInt(pos.z * 20));
        }
        else
        {
            data.rebornX = 0;
            data.rebornY = 0;
        }
        gates.Sort(comp);
        monsters.Sort(comp);
        npcs.Sort(comp);
        data.gates = gates.ToArray();
        data.monsters = monsters.ToArray();
        data.npcs = npcs.ToArray();
        MapOutput.OutputServerMap(data, "ServerMapData/" + id + "/data.rsc");
        MapOutput.OutputMap(data, "Assets/AssetSources/map/data/" + id + ".bytes");
        data = null;
        AssetDatabase.Refresh();
    }

    static int comp(UnitBase a, UnitBase b)
    {
        if (a.id > b.id)
        {
            return 1;
        }
        if (a.id == b.id)
        {
            if (a.index > b.index)
            {
                return 1;
            }
            if (a.index == b.index)
            {
                return 0;
            }
            return -1;
        }
        return -1;
    }

    public void LoadSelectView()
    {
        var view = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Third/MapEditor/Res/SelectView.prefab");
        GameObject.Instantiate<GameObject>(view);
    }

    void LoadSceneView()
    {
        var view = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Third/MapEditor/Res/SceneView.prefab");
        var g=GameObject.Instantiate<GameObject>(view);
        sceneView = g.GetComponent<SceneViewCtrl>();
    }

    public void EnterScene(int id,MapData data)
    {
        SelectTarget(null);
        this.data = data;
        this.id = id;
        this.StartCoroutine(LoadSceneAsync());
    }

    IEnumerator LoadSceneAsync()
    {
        yield return Resources.UnloadUnusedAssets();
        yield return UnityEngine.SceneManagement.SceneManager.LoadSceneAsync(data.sceneID.ToString());
        follower.target.position = SceneData.instance.defaultPos;
        LoadSceneView();
        LoadSceneByDaya(data);
    }

    void LoadSceneByDaya(MapData data)
    {
        //读取mesh的path
        var width = SceneData.instance.width;
        var height = SceneData.instance.height;
        data.width = width;
        data.height = height;
        data.cellWidth = 20;
        data.cellHeight = 20;
        var columns = Mathf.CeilToInt(width / 20.0f);
        var rows = Mathf.CeilToInt(height / 20.0f);
        data.walkableData = new byte[columns * rows];
        data.safetyData = new byte[columns * rows];
        tileMap.Init(rows, columns);
        for (int i = 0; i < rows; i++)
        {
            var rowStart = (rows - i - 1) * columns;
            for (int j = 0; j < columns; j++)
            {
                RaycastHit hit;
                var start = new Vector3(j + 0.5f, 1000, i + 0.5f);
                if (Physics.BoxCast(start, new Vector3(0.5f, 0.01f, 0.5f), Vector3.down, out hit, Quaternion.identity, 2000, 1 << 9))
                {
                    data.walkableData[rowStart + j] = (byte)(hit.collider.transform.GetSiblingIndex() + 1);
                }
                else
                {
                    data.walkableData[rowStart + j] = 0;
                    tileMap.SetTileCollision(j, rows - i - 1, 0);
                }

                if (Physics.BoxCast(start, new Vector3(0.5f, 0.01f, 0.5f), Vector3.down, out hit, Quaternion.identity, 2000, 1 << 10))
                {
                    data.safetyData[rowStart + j] = 1;
                }
                else
                {
                    data.safetyData[rowStart + j] = 0;
                }
            }
        }
        foreach (var gate in data.gates)
        {
            CreateNewTransport(gate);
        }
        foreach (var npc in data.npcs)
        {
            CreateNewNPC(npc);
        }
        foreach (var monster in data.monsters)
        {
            CreateNewMonster(monster);
        }
        sceneView.reborn.isOn = (data.rebornX != 0 && data.rebornX != 0);
        if (onEnerScene != null)
        {
            onEnerScene();
        }
    }
    public UnitView CreateNewTransport(UnitBase unit)
    {
        var obj = new GameObject(unit.id.ToString());
        var view = obj.AddComponent<UnitView>();
        view.unitType = UnitType.transport;
        view.SetUnitBase(unit);
        RebuildUnit(view);
        return view;
    }
    public UnitView CreateNewNPC(UnitBase unit)
    {
        var obj = new GameObject(unit.id.ToString());
        var view = obj.AddComponent<UnitView>();
        view.unitType = UnitType.npc;
        view.SetUnitBase(unit);
        RebuildUnit(view);
        return view;
    }
    public UnitView CreateNewMonster(UnitBase unit)
    {
        var obj = new GameObject(unit.id.ToString());
        var view = obj.AddComponent<UnitView>();
        view.unitType = UnitType.monster;
        view.SetUnitBase(unit);
        RebuildUnit(view);
        return view;
    }
    public void RebuildUnit(UnitView unit)
    {
        unit.gameObject.layer = LayerMask.NameToLayer("Unit");
        var rot = 0;
        switch (unit.direction)
        {
            case 1:
                rot = 135;
                break;
            case 2:
                rot = 90;
                break;
            case 3:
                rot = 45;
                break;
            case 4:
                rot = 0;
                break;
            case 5:
                rot = -45;
                break;
            case 6:
                rot = -90;
                break;
            case 7:
                rot = -135;
                break;
            case 8:
                rot = 180;
                break;
        }
        unit.transform.rotation = Quaternion.Euler(0, rot, 0);
        var old = unit.transform.Find("model");
        if (old != null)
        {
            GameObject.Destroy(old.gameObject);
        }
        GameObject source = null;
        switch (unit.unitType)
        {
            case UnitType.monster:
                source = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/AssetSources/model/monster/210007/210007.prefab");
                break;
            case UnitType.npc:
                source = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/AssetSources/model/npc/200311/200311.prefab");
                break;
            case UnitType.transport:
                if (unit.id > 999)
                {
                    source = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/AssetSources/effect/other/waypoint_02.prefab");
                }
                else
                {
                    source = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/AssetSources/effect/other/waypoint_01.prefab");
                }
                break;
        }
        var go=GameObject.Instantiate<GameObject>(source, unit.transform, false);
        go.name = "model";
        var box = unit.gameObject.GetComponent<BoxCollider>();
        if (box == null)
        {
            box= unit.gameObject.AddComponent<BoxCollider>();
        }
        var r = unit.gameObject.GetComponentInChildren<Renderer>();
        var size = r.bounds.size;
        if (size != Vector3.zero)
        {
            box.size = size;
            box.center = new Vector3(0, box.size.y / 2, 0);
        }
        else
        {
            box.size = new Vector3(2,2,2);
            box.center = new Vector3(0,1,0);
        }
    }
}
#endif