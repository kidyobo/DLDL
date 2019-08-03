using System.Collections;
using System.Collections.Generic;
using UnityEngine;
//根据指定范围加载或者隐藏模型的脚本
public class RangeLoader : MonoBehaviour
{
    List<System.Action<bool>> onChangeList = new List<System.Action<bool>>(100);
    List<Vector3> posList = new List<Vector3>(100);
    List<Vector2> rangeList = new List<Vector2>(100);
    List<bool> stateList = new List<bool>(100);
    List<string> urlList = new List<string>(100);
    List<int> dicKeyList = new List<int>(100);
    int count = 0;
    public int frame = 1;
    private int _frame = 0;
    public Transform listener;
    public int Add(System.Action<bool> onChange, Vector3 pos, float checkRangeX, float checkRangeY, string url)
    {
        var index = onChange.GetHashCode();
        dicKeyList.Add(index);
        onChangeList.Add(onChange);
        posList.Add(pos);
        rangeList.Add(new Vector2(checkRangeX, checkRangeY));
        stateList.Add(false);
        urlList.Add(url);
        count++;
        return index;
    }
    public void Remove(int dicKey)
    {
        var index = dicKeyList.IndexOf(dicKey);
        if (index >= 0)
        {
            dicKeyList.RemoveAt(index);
            onChangeList.RemoveAt(index);
            posList.RemoveAt(index);
            rangeList.RemoveAt(index);
            stateList.RemoveAt(index);
            urlList.RemoveAt(index);
            count--;
        }
    }
    public void Clear()
    {
        dicKeyList.Clear();
        onChangeList.Clear();
        posList.Clear();
        rangeList.Clear();
        stateList.Clear();
        urlList.Clear();
        count = 0;
        _frame = 0;
    }
    public string[] GetInRangeList()
    {
        List<string> strList = new List<string>(count);
        var checkPos = listener.position;
        //检查
        for (int i = 0; i < count; i++)
        {
            var pos = posList[i];
            var range = rangeList[i];
            var newState = Mathf.Abs(pos.x - checkPos.x) < range.x || Mathf.Abs(pos.z - checkPos.z) < range.y;
            if (newState)
            {
                stateList[i] = newState;
                var url = urlList[i];
                if (!string.IsNullOrEmpty(url))
                {
                    strList.Add(url);
                }
            }
        }
        return strList.ToArray();
    }
    // Update is called once per frame
    void Update()
    {
        if (listener == null || count == 0)
        {
            return;
        }
        _frame++;
        if (_frame >= frame)
        {
            _frame = 0;
            var checkPos = listener.position;
            //检查
            for (int i = count - 1; i >= 0; i--)
            {
                var caller = onChangeList[i];
                var pos = posList[i];
                var range = rangeList[i];
                var state = stateList[i];
                var newState = Mathf.Abs(pos.x - checkPos.x) < range.x && Mathf.Abs(pos.z - checkPos.z) < range.y;
                if (state != newState)
                {
                    stateList[i] = newState;
                    caller(newState);
                }
            }
        }
    }
}