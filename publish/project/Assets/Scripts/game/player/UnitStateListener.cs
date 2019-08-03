using UnityEngine;
using System.Collections;

public class UnitStateListener : MonoBehaviour
{
    private TileMap tileMap;
    private bool visible = true;
    private bool isSafty = false;
    private byte terrainType = 0;
    private System.Action<bool> onVisibleChange = null;
    private System.Action<bool> onSaftyChange = null;
    private System.Action<int> onCheckTeleport = null;
    private System.Action<int> onTerrainTypeChange = null;
    public void SetTileMap(TileMap tileMap)
    {
        this.tileMap = tileMap;
    }
    public void BindVisibleChangeAction(System.Action<bool> onVisibleChange)
    {
        this.onVisibleChange = onVisibleChange;
        if(null != onVisibleChange)
        {
            bool visible = !tileMap.IsWorldPosTransparent(this.transform.position);
            this.visible = visible;
            onVisibleChange(visible);
        }        
    }
    public void BindSaftyChangeAction(System.Action<bool> onSaftyChange)
    {
        this.onSaftyChange = onSaftyChange;
        CheckSafty();        
    }

    public void BindTerrainTypeChangeAction(System.Action<int> onTerrainTypeChange)
    {
        this.onTerrainTypeChange = onTerrainTypeChange;
        if(null != onTerrainTypeChange)
        {
            byte terrainType = tileMap.getTerrainType(this.transform.position);
            this.terrainType = terrainType;
            onTerrainTypeChange(terrainType);
        }        
    }

    public void BindCheckTeleportAction(System.Action<int> onCheckTeleport)
    {
        this.onCheckTeleport = onCheckTeleport;
    }

    public void Reset()
    {
        this.visible = true;
        this.isSafty = false;
        this.terrainType = 0;
        this.tileMap = null;
        this.onVisibleChange = null;
        this.onCheckTeleport = null;
        this.onTerrainTypeChange = null;
        this.onSaftyChange = null;
    }

    // Update is called once per frame
    void Update()
    {
        if (tileMap == null)
        {
            Debug.LogWarning("请设置tileMap");
            return;
        }

        if (this.onVisibleChange != null)
        {
            bool visible = !tileMap.IsWorldPosTransparent(this.transform.position);
            if (visible != this.visible)
            {
                this.visible = visible;
                onVisibleChange(visible);
            }
        }

        if (this.onTerrainTypeChange != null)
        {
            byte terrainType = tileMap.getTerrainType(this.transform.position);
            if (terrainType != this.terrainType)
            {
                this.terrainType = terrainType;
                onTerrainTypeChange(terrainType);
            }
        }
            
        if (null != onCheckTeleport)
        {
            // 检查是否踩在传送点上
            int tpId = tileMap.CheckTeleport(this.transform.position);
            if(tpId > 0)
            {
                onCheckTeleport(tpId);
            }
        }

        CheckSafty();
    }

    void CheckSafty()
    {
        if (null != onSaftyChange)
        {
            // 检查是否踩在传送点上
            bool safty = tileMap.IsWorldPosSafty(this.transform.position);
            if (safty != this.isSafty)
            {
                this.isSafty = safty;
                onSaftyChange(safty);
            }
        }
    }
}
