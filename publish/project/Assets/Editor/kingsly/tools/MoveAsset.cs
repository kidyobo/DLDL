using System.Collections.Generic;
using UnityEditor;
using UnityEngine;

namespace kingsly
{
    /// <summary>
    /// 在Project面板右键移动资源（注意该操作不可撤销）
    /// 操作步骤：
    /// 1.选中需要移动的文件或者文件夹（支持多个）
    /// 2.右键 -- 设为*需移动*对象
    /// 3.选择要移动要的新目录
    /// 4.右键 -- *移动*到该目录
    /// </summary>
    public class MoveAsset
    {
        static List<string> needMoveObjectPathList = new List<string>();
        [MenuItem("Assets/设为*需移动*对象")]
        static void needMoveObjects()
        {
            if (needMoveObjectPathList.Count > 0)
                needMoveObjectPathList.Clear();
            UnityEngine.Object[] objs = Selection.objects;
            int len = objs.Length;
            for (int i = 0; i < len; i++)
            {
                needMoveObjectPathList.Add(AssetDatabase.GetAssetPath(objs[i]));
            }
        }

        [MenuItem("Assets/*移动*到该目录")]
        static void moveTo()
        {
            if (needMoveObjectPathList.Count > 0)
            {
                bool isOK = false;
                string path = AssetDatabase.GetAssetPath(Selection.activeObject);
                if (path.Contains(".") || path == "")
                {
                    Debug.LogError("请选择要移动到的文件夹！！！");
                }
                else
                {
                    string oldPath = "";
                    for (int i = 0; i < needMoveObjectPathList.Count; i++)
                    {
                        oldPath = path + needMoveObjectPathList[i].Substring(needMoveObjectPathList[i].LastIndexOf("/"));
                        string isSuccess = AssetDatabase.MoveAsset(needMoveObjectPathList[i], oldPath);
                        if (isSuccess == "")
                        {
                            Debug.Log(needMoveObjectPathList[i] + " 移动到："+oldPath+"成功！！！");
                            isOK = true;
                        }
                        else
                        {
                            Debug.Log(needMoveObjectPathList[i] + " 移动到"+oldPath+"失败！！！");
                        }
                    }
                    AssetDatabase.Refresh();
                }
                if(isOK)
                needMoveObjectPathList.Clear();
            }
        }
    }
}
