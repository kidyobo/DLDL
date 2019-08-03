#if UNITY_EDITOR
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.AI;
public class UnitView : MonoBehaviour
{
    public UnitType unitType = UnitType.npc;
    private UnitBase unit;
    public int id
    {
        set
        {
            unit.id = value;
        }
        get
        {
            return unit.id;
        }
    }
    public byte direction
    {
        set
        {
            unit.direction = value;
        }
        get
        {
            return unit.direction;
        }
    }
    // Update is called once per frame
    void Update()
    {
        //寻找导航网格上，距离玩家最近的点,然后把玩家设置为点的坐标，就脱离卡死了。
        var t = transform.position;
        transform.position = ThreeDTools.GetNavYValue(t.x, t.z);
    }
    public UnitBase GetUnitBase()
    {
        return unit;
    }
    public void SetUnitBase(UnitBase unit)
    {
        this.unit = unit;
        var pos = unit.GetWorldPosition();
        transform.position = ThreeDTools.GetNavYValue(pos.x, pos.z);
    }
    public void DirtyPosition()
    {
        unit.SetWorldPosition(transform.position);
    }
}
public enum UnitType
{
    npc = 0,
    monster,
    transport,
}
#endif