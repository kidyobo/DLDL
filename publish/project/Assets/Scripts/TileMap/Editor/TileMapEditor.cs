using UnityEngine;
using System.Collections;
using UnityEditor;
[CustomEditor(typeof(TileMap))]
public class TileMapEditor : Editor
{
    private Vector2 hitPosition;
    private bool pressed=false;
    private bool open = false;

    int rows = 2;
    int columns = 2;
    float tileHeight = 100;
    float tileWidth = 100;

    void OnEnable()
    {
        TileMap map = (TileMap)this.target;
        columns = map.Columns;
        rows = map.Rows;
        tileHeight = map.TileHeight;
        tileWidth = map.TileWidth;
        SceneView.RepaintAll();
    }

    public override void OnInspectorGUI()
    {
        EditorGUILayout.BeginHorizontal();
        
        rows=EditorGUILayout.IntField("行(Count)：", rows);
        columns=EditorGUILayout.IntField("列(Count)：", columns);
        EditorGUILayout.EndHorizontal();
        EditorGUILayout.BeginHorizontal();
        tileWidth=EditorGUILayout.FloatField("宽(Single Tile)：", tileWidth);
        tileHeight=EditorGUILayout.FloatField("高(Single Tile)：", tileHeight);
        EditorGUILayout.EndHorizontal();

        GUILayout.Space(5.0f);
        EditorGUILayout.BeginHorizontal();
        if (GUILayout.Button("生成网格"))
        {
            if (rows > 0 && columns > 0 && tileHeight > 0 && tileWidth > 0)
            {
                TileMap map = (TileMap)this.target;
                map.TileHeight = tileHeight;
                map.TileWidth = tileWidth;
                map.Init(rows, columns);
                SceneView.RepaintAll();
            }
            else
            {
                Debug.LogError("输入不合法！");
            }
        }
        if (GUILayout.Button("重置网格"))
        {
            TileMap map = (TileMap)this.target;
            map.Reset();
            columns = map.Columns;
            rows = map.Rows;
            tileHeight = map.TileHeight;
            tileWidth = map.TileWidth;
            SceneView.RepaintAll();
        }
        GUILayout.Space(25.0f);
        if (GUILayout.Button("读取网格数据"))
        {
            TileMap map = (TileMap)this.target;
            string path = EditorUtility.OpenFilePanel("导入文件", Application.dataPath, "bytes");
            if (path != "")
            {
                int index = path.IndexOf("Assets");
                if(index >= 0)
                {
                    path = path.Remove(0, index);
                }
                Debug.Log(path);
                //map.Load(UnityEditor.AssetDatabase.LoadAssetAtPath<TextAsset>(path));
                columns = map.Columns;
                rows = map.Rows;
                tileHeight = map.TileHeight;
                tileWidth = map.TileWidth;
                SceneView.RepaintAll();
            }

        }
        if (GUILayout.Button("保存网格数据"))
        {
            //TileMap map = (TileMap)this.target;
            //string saveFilePath = EditorUtility.SaveFilePanelInProject("保存文件", "mapData", "bytes", "请选择一个路径");
            //if (saveFilePath != "")
            //{
            //    map.Save(saveFilePath);
            //}
        }
        EditorGUILayout.EndHorizontal();
    }

    /// <summary>
    /// 当物体被选择时，Scene视图会发生变化
    /// </summary>
    void OnSceneGUI()
    {
        Draw();
        //绘制tips
        Handles.BeginGUI();
        GUI.Label(new Rect(10, Screen.height - 145, 100, 100), "X:" + hitPosition.x);
        GUI.Label(new Rect(10, Screen.height - 135, 100, 100), "Y:" + hitPosition.y);
        GUI.Label(new Rect(10, Screen.height - 125, 100, 100), "空格键:设置");
        GUI.Label(new Rect(10, Screen.height - 115, 100, 100), "W:增大刷子大小");
        GUI.Label(new Rect(10, Screen.height - 105, 100, 100), "S:减小刷子大小");
        GUI.Label(new Rect(10, Screen.height - 95, 200, 100), "A:显示/隐藏辅助线");
        Handles.EndGUI();
    }
    /// <summary>
    /// 绘制
    /// </summary>
    private void Draw()
    {
        bool rePaint = false;
        if (UpdateHitPosition())
        {
            rePaint = true;
        }

        TileMap map = (TileMap)this.target;
        Event current = Event.current;
        if (current.type == EventType.keyDown)
        {
            if (current.keyCode == KeyCode.Space)
            {
                if (!pressed)
                {
                    pressed = true;
                }
                if (!map.SetTile(open))
                {
                    rePaint = true;
                }
            }
            else if (current.keyCode == KeyCode.W)
            {
                if (map.size < 20)
                {
                    map.size++;
                }
            }
            else if (current.keyCode == KeyCode.S)
            {
                if (map.size > 1)
                {
                    map.size--;
                }
            }
            else if (current.keyCode == KeyCode.A)
            {
                map.showGrid = !map.showGrid;
            }

            current.Use();
        }
        else if (current.type == EventType.keyUp)
        {
            if (current.keyCode == KeyCode.Space)
            {
                pressed = false;
                current.Use();
            }
        }

        if (rePaint)
        {
            SceneView.RepaintAll();
        }

    }
    /// <summary>
    /// 更新碰撞点
    /// </summary>
    /// <returns>是否有发生变化</returns>
    private bool UpdateHitPosition()
    {
        TileMap map = (TileMap)this.target;
        Plane p = new Plane(map.transform.up, map.transform.position);
        Ray ray = HandleUtility.GUIPointToWorldRay(Event.current.mousePosition);
        Vector3 hit = new Vector3();
        float distance;
        if (p.Raycast(ray, out distance))
        {
            hit = ray.origin + (ray.direction.normalized * distance);
        }

        Vector2 pos = map.World2Tile(hit,true);
        pos = map.GetUseAbleTilePos(pos);

        if (hitPosition != pos)
        {
            this.hitPosition = pos;
            map.SelectedTilePos = hitPosition;
            return true;
        }
        return false;
    }
}
