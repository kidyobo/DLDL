using UnityEngine;
using System.Collections.Generic;
using System.IO;
using System;
using UnityEngine.AI;
[ExecuteInEditMode]
public class TileMap : MonoBehaviour
{

    private static ushort MIN_SCENE_BLOCK_SZIE = 20;

    private static Vector2 INVALID_VEC2 = new Vector3(-1, -1);

    /// <summary>
    /// 网格的行数
    /// </summary>
    public int Rows;
    /// <summary>
    /// 网格的列数
    /// </summary>
    public int Columns;
    /// <summary>
    /// 单个网格的宽度
    /// </summary>
    public float TileWidth;
    /// <summary>
    /// 单个网格的高度
    /// </summary>
    public float TileHeight;
    /// <summary>
    /// 网格的总宽度
    /// </summary>
    public float Width
    {
        get
        {
            return TileWidth * Columns;
        }
    }

    //网格的总高度
    public float Height
    {
        get
        {
            return TileHeight * Rows;
        }
    }

    private int meterScale;
    //private int mapWidthPixel;
    private int mapHeightPixel;

    /// <summary>
    /// 寻路算法过程中使用到的临时节点数组。
    /// </summary>
    private List<Vector2> m_astTmpPathPostions;

    private Cell[,] tiles = null;

    /// <summary>
    /// 传送点信息。
    /// </summary>
    private TeleportInfo[] tpInfos = null;

    private int teleportValidDistance = 70;

    /// <summary>
    /// 初始化网格数据(按照像素)
    /// </summary>
    public void InitByPixel(int mapWidth, int mapHeight, float cellWidth, float cellHeight, int meterSize)
    {
        meterScale = meterSize;
        //mapWidthPixel = mapWidth;
        mapHeightPixel = mapHeight;
        if (null == m_astTmpPathPostions)
        {
            m_astTmpPathPostions = new List<Vector2>();
        }
        var columns = (int)Math.Ceiling(mapWidth / cellWidth);
        var rows = (int)Math.Ceiling(mapHeight / cellHeight);
        if (rows < 1 || columns < 1)
        {
            Debug.LogError("错误的大小定义!");
            return;
        }
        Init(rows, columns);
        TileWidth = cellWidth / meterSize;
        TileHeight = cellHeight / meterSize;
    }

    /// <summary>
    /// 初始化网格数据
    /// </summary>
    public void Init(int rows, int columns)
    {
        if (null == m_astTmpPathPostions)
        {
            m_astTmpPathPostions = new List<Vector2>();
        }
        if (rows < 1 || columns < 1)
        {
            Debug.LogError("错误的大小定义!");
            return;
        }
        this.Rows = rows;
        this.Columns = columns;
        tiles = new Cell[rows, columns];
        for (int i = 0; i < rows; i++)
        {
            for (int j = 0; j < columns; j++)
            {
                tiles[i, j] = new Cell();
                tiles[i, j].walkable = 1;
                tiles[i, j].x = j;
                tiles[i, j].y = i;
            }
        }
        TileWidth = 1;
        TileHeight = 1;
    }

    /// <summary>
    /// 检查一个点是否在网格内
    /// </summary>
    public bool CheckPointInMap(short x, short y)
    {
        if (y < 0 || y >= Rows || x < 0 || x >= Columns)
        {
            return false;
        }
        return true;
    }
    public void SetTileCollision(int x, int y, byte walkable)
    {
        tiles[y, x].walkable = walkable;
    }
    public byte GetIslandIdx(int x, int y)
    {
        int tileY = PixelY2TileY(y);
        int tileX = PixelX2TileX(x);
        return (byte)tiles[tileY, tileX].islandIdx;
    }

    /// <summary>
    /// 判断某个格子是否可行走。
    /// </summary>
    /// <param name="x">格子x序号</param>
    /// <param name="y">格子y序号，如果是不是用像素换算的而是用3d世界坐标换算的，需要垂直翻转</param>
    /// <returns></returns>
    private bool IsValidGrid(int x, int y)
    {
        if (y < 0 || y >= Rows || x < 0 || x >= Columns) return false;
        Cell cell = tiles[y, x];
        return 0 != cell.walkable && false == cell.dynamic;
    }

    /// <summary>
    /// 判断指定坐标（像素）是否可行走。
    /// </summary>
    /// <param name="x">像素坐标x</param>
    /// <param name="y">像素坐标y</param>
    /// <returns></returns>
    public bool IsWalkablePositionPixel(int pixelX, int pixelY)
    {
        Vector2 tile = Pixel2Tile(pixelX, pixelY);
        return IsValidGrid((int)tile.x, (int)tile.y);
    }

    [DonotWrap]
    /// <summary>
    /// 根据tile坐标获取到世界坐标
    /// </summary>
    private Vector3 Tile2World(float x, float y)
    {
        var transform = this.transform;
        return transform.position + transform.right * x * this.TileWidth + transform.forward * y * this.TileHeight;
    }

    [DonotWrap]
    /// <summary>
    /// 根据到3D世界坐标获取tile坐标
    /// </summary>
    public Vector2 World2Tile(Vector3 vec, bool setToInt)
    {
        var transform = this.transform;
        var targetVec = vec - transform.position;
        var x = Vector3.Dot(targetVec / TileWidth, transform.right);
        var y = Vector3.Dot(targetVec / TileHeight, transform.forward);
        if (setToInt)
        {
            x = (int)x;
            y = (int)y;
        }
        return new Vector2(x, y);
    }

    [DonotWrap]
    public Vector2 Pixel2Tile(int pixelX, int pixelY)
    {
        return new Vector2(PixelX2TileX(pixelX), PixelY2TileY(pixelY));
    }

    private int PixelX2TileX(int pixelX)
    {
        return (int)(pixelX / MIN_SCENE_BLOCK_SZIE);
    }
    private int PixelY2TileY(int pixelY)
    {
        return (int)(pixelY / MIN_SCENE_BLOCK_SZIE);
    }

    [DonotWrap]
    public Vector2 Tile2Pixel(int tileX, int tileY, bool center)
    {
        return new Vector2(TileX2PixelX(tileX, center), TileY2PixelY(tileY, center));
    }

    private int TileX2PixelX(int tileX, bool center)
    {
        return center ? (int)((tileX + 0.5f) * MIN_SCENE_BLOCK_SZIE + 0.5f) : (int)(tileX * MIN_SCENE_BLOCK_SZIE + 0.5f);
    }
    private int TileY2PixelY(int tileY, bool center)
    {
        return center ? (int)((tileY + 0.5f) * MIN_SCENE_BLOCK_SZIE + 0.5f) : (int)(tileY * MIN_SCENE_BLOCK_SZIE + 0.5f);
    }

    private void setTileTransparent(int x, int y, bool value)
    {
        tiles[y, x].transparent = value;
    }
    private void setTileTerrain(int x, int y, byte value)
    {
        tiles[y, x].terrainType = value;
    }
    private void setTileSafty(int x, int y, bool value)
    {
        tiles[y, x].isSafety = value;
    }

    //new version controlled
    public void SetTileData(int mapWidth, int mapHeight, int meterSize, ByteArray byteArray)
    {
        //地边大数据
        float cellWidth = byteArray.ReadInt16();
        float cellHeight = byteArray.ReadInt16();
        var columns = Mathf.CeilToInt(mapWidth / cellWidth);
        var rows = Mathf.CeilToInt(mapHeight / cellHeight);

        meterScale = meterSize;
        //mapWidthPixel = mapWidth;
        mapHeightPixel = mapHeight;
        if (null == m_astTmpPathPostions)
        {
            m_astTmpPathPostions = new List<Vector2>();
        }
        if (rows < 1 || columns < 1)
        {
            Debug.LogError("错误的大小定义!");
            return;
        }
        this.Rows = rows;
        this.Columns = columns;
        tiles = new Cell[rows, columns];
        for (int i = 0; i < rows; i++)
        {
            for (int j = 0; j < columns; j++)
            {
                var mask = byteArray.ReadByte();
                var island = byteArray.ReadByte();
                var cell = new Cell();
                cell.walkable = (byte)(island > 0 ? 1 : 0);
                cell.x = j;
                cell.y = i;
                cell.isSafety = (mask & 1 << 1) > 0 ? true : false;
                cell.transparent = (mask & 1) > 0 ? true : false;
                cell.islandIdx = island;
                cell.terrainType = (byte)((mask & 1 << 2) > 0 ? 1 : 0);
                tiles[i, j] = cell;
            }
        }
        TileWidth = cellWidth / meterSize;
        TileHeight = cellHeight / meterSize;
        this.MergeTiles(0);
    }

    /// <summary>
    /// 指定的世界坐标是否需要透明。
    /// </summary>
    /// <param name="vec">3D坐标</param>
    /// <returns></returns>
    [DonotWrap]
    public bool IsWorldPosTransparent(Vector3 vec)
    {
        Vector2 tile = World2Tile(vec, true);
        // 由于3d的格子以左下角为远点，而透明数据以左上角为远点，故需要做垂直翻转
        return IsTransparentGrid((int)tile.x, Rows - 1 - (int)tile.y);
    }

    private bool IsTransparentGrid(int x, int y)
    {
        if (y < 0 || y >= Rows || x < 0 || x >= Columns) return false;
        Cell cell = tiles[y, x];
        return cell.transparent;
    }
    /// <summary>
    /// 指定的世界坐标是否在安全区中。
    /// </summary>
    /// <param name="vec">3D坐标</param>
    /// <returns></returns>
    [DonotWrap]
    public bool IsWorldPosSafty(Vector3 vec)
    {
        Vector2 tile = World2Tile(vec, true);
        // 由于3d的格子以左下角为远点，而透明数据以左上角为远点，故需要做垂直翻转
        return IsSaftyGrid((int)tile.x, Rows - 1 - (int)tile.y);
    }
    private bool IsSaftyGrid(int x, int y)
    {
        if (y < 0 || y >= Rows || x < 0 || x >= Columns) return false;
        Cell cell = tiles[y, x];
        return cell.isSafety;
    }
    [DonotWrap]
    public byte getTerrainType(Vector3 vec)
    {
        Vector2 tile = World2Tile(vec, true);
        // 由于3d的格子以左下角为远点，而地形数据以左上角为远点，故需要做垂直翻转
        int x = (int)tile.x;
        int y = Rows - 1 - (int)tile.y;
        if (y < 0 || y >= Rows || x < 0 || x >= Columns) return 0;
        Cell cell = tiles[y, x];
        return cell.terrainType;
    }

    /// <summary>
    /// 尽量将相邻的4个小块合并为大块。
    /// </summary>
    /// <param name="maxBlockIdx">当前大块的层级</param>
    public void MergeTiles(ushort usMaxBlockIdx)
    {
        int nMerged = 0;//已合并的块数量
        usMaxBlockIdx++;
        ushort usBlockSize = (ushort)(1 << usMaxBlockIdx);
        // 计算当前块层级下的格子数量
        int nBlockColumns = this.Columns / usBlockSize;
        int nBlockRows = this.Rows / usBlockSize;
        for (int y = 0; y < nBlockRows; y++)
        {
            for (int x = 0; x < nBlockColumns; x++)
            {
                // 真实的tile索引
                int nFirstBlockX = x * usBlockSize;
                int nFirstBlockY = y * usBlockSize;

                // 从左上角开始的tile索引
                byte byBlockWalkable = 1;
                int nBlockX, nBlockY;
                for (nBlockY = 0; nBlockY < usBlockSize; nBlockY++)
                {
                    for (nBlockX = 0; nBlockX < usBlockSize; nBlockX++)
                    {
                        byBlockWalkable = this.tiles[nFirstBlockY + nBlockY, nFirstBlockX + nBlockX].walkable;
                        if (0 == byBlockWalkable)
                        {
                            break;
                        }
                    }

                    if (0 == byBlockWalkable) break;
                }

                if (0 == byBlockWalkable) continue;

                // 将小块融合为大块
                for (nBlockY = 0; nBlockY < usBlockSize; nBlockY++)
                {
                    for (nBlockX = 0; nBlockX < usBlockSize; nBlockX++)
                    {
                        // 为每个小块标记大索引
                        this.tiles[nFirstBlockY + nBlockY, nFirstBlockX + nBlockX].firstTile = nFirstBlockY * this.Columns + nFirstBlockX;
                    }
                }
                nMerged++;
            }
        }

        if (nMerged >= 4)
        {
            // 继续合并
            MergeTiles(usMaxBlockIdx);
        }
    }

    public Vector2 SearchValidNabor(Vector2 curPosPixel, Vector2 toPosPixel)
    {
        Vector2 curTile = Pixel2Tile((int)curPosPixel.x, (int)curPosPixel.y);
        if (IsValidGrid((int)curTile.x, (int)curTile.y))
        {
            // 本身就是合法的点
            return curPosPixel;
        }

        float rate = (toPosPixel.y - curPosPixel.y) / (toPosPixel.x - curPosPixel.x);

        Vector2 bestNabor = INVALID_VEC2;
        float bestNaborDis = 0;

        // 首先以目标格子左边界为准
        int curLeftX = TileX2PixelX((int)curTile.x, false);
        int naborY = (int)((curLeftX - curPosPixel.x) * rate + curPosPixel.y);
        if (IsValidGrid((int)curTile.x, PixelY2TileY(naborY)))
        {
            Vector2 tmp = new Vector2(curLeftX, naborY);
            float distance = Vector2.Distance(bestNabor, tmp);
            if (0 == bestNaborDis || distance < bestNaborDis)
            {
                bestNabor = tmp;
                bestNaborDis = distance;
            }
        }
        // 以目标格子右边界为准
        int curRightX = TileX2PixelX((int)curTile.x + 1, false);
        naborY = (int)((curRightX - curPosPixel.x) * rate + curPosPixel.y);
        if (IsValidGrid((int)curTile.x + 1, PixelY2TileY(naborY)))
        {
            Vector2 tmp = new Vector2(curRightX, naborY);
            float distance = Vector2.Distance(bestNabor, tmp);
            if (0 == bestNaborDis || distance < bestNaborDis)
            {
                bestNabor = tmp;
                bestNaborDis = distance;
            }
        }
        // 以目标格子上边界为准
        int curTopY = TileY2PixelY((int)curTile.y, false);
        int naborX = (int)((curTopY - curPosPixel.y) / rate + curPosPixel.x);
        if (IsValidGrid(PixelX2TileX(naborX), (int)curTile.y))
        {
            Vector2 tmp = new Vector2(naborX, curTopY);
            float distance = Vector2.Distance(bestNabor, tmp);
            if (0 == bestNaborDis || distance < bestNaborDis)
            {
                bestNabor = tmp;
                bestNaborDis = distance;
            }
        }
        // 以目标格子下边界为准
        int curBottomY = TileY2PixelY((int)curTile.y + 1, false);
        naborX = (int)((curBottomY - curPosPixel.y) / rate + curPosPixel.x);
        if (IsValidGrid(PixelX2TileX(naborX), (int)curTile.y + 1))
        {
            Vector2 tmp = new Vector2(naborX, curBottomY);
            float distance = Vector2.Distance(bestNabor, tmp);
            if (0 == bestNaborDis || distance < bestNaborDis)
            {
                bestNabor = tmp;
                bestNaborDis = distance;
            }
        }

        if (Vector2.Equals(INVALID_VEC2, bestNabor))
        {
            // 按照已有斜率无法找到，那就以斜率0和1再找
            // 先看左边
            if (IsValidGrid((int)curTile.x - 1, (int)curTile.y))
            {
                Vector2 tmp = new Vector2(curLeftX, curPosPixel.y);
                float distance = Vector2.Distance(bestNabor, tmp);
                if (0 == bestNaborDis || distance < bestNaborDis)
                {
                    bestNabor = tmp;
                    bestNaborDis = distance;
                }
            }
            // 再看右边
            if (IsValidGrid((int)curTile.x + 1, (int)curTile.y))
            {
                Vector2 tmp = new Vector2(curRightX, curPosPixel.y);
                float distance = Vector2.Distance(bestNabor, tmp);
                if (0 == bestNaborDis || distance < bestNaborDis)
                {
                    bestNabor = tmp;
                    bestNaborDis = distance;
                }
            }
            // 再看右边
            if (IsValidGrid((int)curTile.x, (int)curTile.y - 1))
            {
                Vector2 tmp = new Vector2(curPosPixel.x, curTopY);
                float distance = Vector2.Distance(bestNabor, tmp);
                if (0 == bestNaborDis || distance < bestNaborDis)
                {
                    bestNabor = tmp;
                    bestNaborDis = distance;
                }
            }
            // 再看右边
            if (IsValidGrid((int)curTile.x, (int)curTile.y + 1))
            {
                Vector2 tmp = new Vector2(curPosPixel.x, curBottomY);
                float distance = Vector2.Distance(bestNabor, tmp);
                if (0 == bestNaborDis || distance < bestNaborDis)
                {
                    bestNabor = tmp;
                    bestNaborDis = distance;
                }
            }
        }
        return bestNabor;
    }

    #region 寻路相关

    /// <summary>
    /// 寻找从起始点到目标点间最合适的一点。
    /// </summary>
    /// <param name="startX">起始点x，像素坐标</param>
    /// <param name="startY">起始点y，像素坐标</param>
    /// <param name="endX">目的点x，像素坐标</param>
    /// <param name="endY">目的点y，像素坐标</param>
    /// <param name="methord">0表示不使用二分法直线逼近，仅寻找目标点周边。1表示仅使用二分法直线逼近，不寻找目标点周边。2表示优先使用二分法直线逼近，再次寻找目标点周边</param>
    /// <returns></returns>
    public Vector2 SearchValidGrid(int startX, int startY, int endX, int endY, bool checkBlock, bool checkConnected)
    {
        Vector2 endTile = Pixel2Tile(endX, endY);
        if (IsValidGrid((int)endTile.x, (int)endTile.y) && (!checkConnected || IsConnectedPixel(startX, startY, endX, endY)))
        {
            // 目标点本身就可以走
            return new Vector2(endX, endY);
        }

        if (checkBlock)
        {
            // 需要检测阻挡
            Vector2 startPos = new Vector2(startX, startY);
            Vector2 tmpPos = SearchValidGridInternal(startX, startY, endX, endY, checkBlock ? startPos : INVALID_VEC2);
            if (!tmpPos.Equals(startPos))
            {
                // 与起始点不重合，说明无法寻找到有效点
                return tmpPos;
            }
        }

        // 寻找周围的可行走点
        int max = (int)System.Math.Max(System.Math.Max(endTile.x, Columns - endTile.x), System.Math.Max(endTile.y, Rows - endTile.y));
        int targetX, targetY;
        bool found = false;
        for (int i = 1; i < max; i++)
        {
            for (int j = 0; j <= i; j++)
            {
                targetX = (int)(endTile.x - j);
                targetY = (int)(endTile.y - i);
                if (IsValidGrid(targetX, targetY) && (!checkConnected || IsConnectedPixel(startX, startY, TileX2PixelX(targetX, true), TileY2PixelY(targetY, true))))
                {
                    found = true;
                }
                else
                {
                    targetX = (int)(endTile.x + j);
                    targetY = (int)(endTile.y - i);

                    if (IsValidGrid(targetX, targetY) && (!checkConnected || IsConnectedPixel(startX, startY, TileX2PixelX(targetX, true), TileY2PixelY(targetY, true))))
                    {
                        found = true;
                    }
                    else
                    {
                        targetX = (int)(endTile.x - j);
                        targetY = (int)(endTile.y + i);

                        if (IsValidGrid(targetX, targetY) && (!checkConnected || IsConnectedPixel(startX, startY, TileX2PixelX(targetX, true), TileY2PixelY(targetY, true))))
                        {
                            found = true;
                        }
                        else
                        {
                            targetX = (int)(endTile.x + j);
                            targetY = (int)(endTile.y + i);

                            if (IsValidGrid(targetX, targetY) && (!checkConnected || IsConnectedPixel(startX, startY, TileX2PixelX(targetX, true), TileY2PixelY(targetY, true))))
                            {
                                found = true;
                            }
                            else
                            {
                                targetX = (int)(endTile.x - i);
                                targetY = (int)(endTile.y - j);

                                if (IsValidGrid(targetX, targetY) && (!checkConnected || IsConnectedPixel(startX, startY, TileX2PixelX(targetX, true), TileY2PixelY(targetY, true))))
                                {
                                    found = true;
                                }
                                else
                                {
                                    targetX = (int)(endTile.x + i);
                                    targetY = (int)(endTile.y - j);

                                    if (IsValidGrid(targetX, targetY) && (!checkConnected || IsConnectedPixel(startX, startY, TileX2PixelX(targetX, true), TileY2PixelY(targetY, true))))
                                    {
                                        found = true;
                                    }
                                    else
                                    {
                                        targetX = (int)(endTile.x - i);
                                        targetY = (int)(endTile.y + j);

                                        if (IsValidGrid(targetX, targetY) && (!checkConnected || IsConnectedPixel(startX, startY, TileX2PixelX(targetX, true), TileY2PixelY(targetY, true))))
                                        {
                                            found = true;
                                        }
                                        else
                                        {
                                            targetX = (int)(endTile.x + i);
                                            targetY = (int)(endTile.y + j);

                                            if (IsValidGrid(targetX, targetY) && (!checkConnected || IsConnectedPixel(startX, startY, TileX2PixelX(targetX, true), TileY2PixelY(targetY, true))))
                                            {
                                                found = true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if (found)
                {
                    if (targetX == (int)endTile.x && targetY == (int)endTile.y)
                    {
                        return new Vector2(endX, endY);
                    }
                    else
                    {
                        return Tile2Pixel(targetX, targetY, true);
                    }
                }
            }
        }

        return INVALID_VEC2;
    }

    private Vector2 lastForwardDesc;

    public Vector2 SearchValidGridForJoystick(int startX, int startY, int endX, int endY)
    {
        Vector2 endTile = Pixel2Tile(endX, endY);
        if (IsValidGrid((int)endTile.x, (int)endTile.y) && IsConnectedPixel(startX, startY, endX, endY))
        {
            // 目标点本身就可以走
            lastForwardDesc = new Vector2(endX, endY);
            return lastForwardDesc;
        }

        // 通过直线方程进行查找
        Vector2 startPos = new Vector2(startX, startY);
        Vector2 tmpPos = SearchValidGridInternal(startX, startY, endX, endY, startPos);
        if (!tmpPos.Equals(startPos))
        {
            // 与起始点不重合，说明寻找到有效点
            lastForwardDesc = tmpPos;
            return tmpPos;
        }

        return INVALID_VEC2;
    }

    //public Vector2 SearchValidGridForJoystick(int startX, int startY, int endX, int endY, bool isMoving, bool checkBlock)
    //{
    //    Vector2 endTile = Pixel2Tile(endX, endY);
    //    if (IsValidGrid((int)endTile.x, (int)endTile.y) && IsConnectedPixel(startX, startY, endX, endY))
    //    {
    //        // 目标点本身就可以走
    //        lastForwardDesc = new Vector2(endX, endY);
    //        return lastForwardDesc;
    //    }

    //    // 通过直线方程进行查找
    //    Vector2 startPos = new Vector2(startX, startY);
    //    Vector2 tmpPos = SearchValidGridInternal(startX, startY, endX, endY, startPos);
    //    if (!tmpPos.Equals(startPos))
    //    {
    //        // 与起始点不重合，说明寻找到有效点
    //        lastForwardDesc = tmpPos;
    //        return tmpPos;
    //    }

    //    //if(null != lastForwardDesc && !lastForwardDesc.Equals(INVALID_VEC2))
    //    //{
    //    //    return INVALID_VEC2;
    //    //}

    //    if (isMoving)
    //    {
    //        return INVALID_VEC2;
    //    }

    //    // 直线方程找不到，那就寻找当前立点周围的点
    //    Vector2 startTile = Pixel2Tile(startX, startY);
    //    int max = (int)System.Math.Max(System.Math.Max(endTile.x, Columns - endTile.x), System.Math.Max(endTile.y, Rows - endTile.y));
    //    // 优先寻找前进方向两边的
    //    float angle = GetAngle(startTile.x, startTile.y, endTile.x, endTile.y);
    //    int[] seqX;
    //    int[] seqY;

    //    int targetX, targetY;
    //    for (int i = 1; i < max; i++)
    //    {
    //        int maxCnt = i * 8;
    //        seqX = new int[maxCnt];
    //        seqY = new int[maxCnt];
    //        int cnt = 0;
    //        if (angle <= 0 && angle >= -18)
    //        {
    //            // 右边
    //            seqX[cnt++] = i;
    //            seqY[cnt] = 0;

    //            seqX[maxCnt - 1] = -i;
    //            seqY[maxCnt - 1] = 0;

    //            for (int j = 1; j <= i; j++)
    //            {
    //                seqX[cnt++] = i;
    //                seqY[cnt] = j;

    //                seqX[maxCnt - 1 - cnt] = -i;
    //                seqY[maxCnt - 1 - cnt] = j;

    //                seqX[cnt++] = i;
    //                seqY[cnt] = -j;

    //                seqX[maxCnt - 1 - cnt] = -i;
    //                seqY[maxCnt - 1 - cnt] = -j;
    //            }

    //            for (int j = 0; j < 2 * i - i; j++)
    //            {
    //                seqX[cnt++] = i - 1 - j;
    //                seqY[cnt] = -i;

    //                seqX[cnt++] = i - 1 - j;
    //                seqY[cnt] = i;
    //            }
    //        }
    //        else if (angle < -18 && angle > -72)
    //        {
    //            // 右上
    //            seqX[cnt++] = i;
    //            seqY[cnt] = -i;

    //            seqX[maxCnt - 1] = -i;
    //            seqY[maxCnt - 1] = i;

    //            for (int j = 1; j <= 2 * i; j++)
    //            {
    //                seqX[cnt++] = i - j;
    //                seqY[cnt] = -i;

    //                seqX[cnt++] = i;
    //                seqY[cnt] = -i + j;
    //            }

    //            for (int j = 0; j < 2 * i - i; j++)
    //            {
    //                seqX[cnt++] = -i + 1 + j;
    //                seqY[cnt] = j;

    //                seqX[cnt++] = i - 1 - j;
    //                seqY[cnt] = i;
    //            }
    //        }
    //        else if (angle <= -72 && angle >= -108)
    //        {
    //            // 上边
    //            seqX[cnt++] = 0;
    //            seqY[cnt] = -i;

    //            seqX[maxCnt - 1] = 0;
    //            seqY[maxCnt - 1] = i;

    //            for (int j = 1; j <= i; j++)
    //            {
    //                seqX[cnt++] = -j;
    //                seqY[cnt] = -i;

    //                seqX[maxCnt - 1 - cnt] = -j;
    //                seqY[maxCnt - 1 - cnt] = i;

    //                seqX[cnt++] = j;
    //                seqY[cnt] = -i;

    //                seqX[maxCnt - 1 - cnt] = j;
    //                seqY[maxCnt - 1 - cnt] = i;
    //            }

    //            for (int j = 0; j < 2 * i - 1; j++)
    //            {
    //                seqX[cnt++] = -i;
    //                seqY[cnt] = -i + 1 + j;

    //                seqX[cnt++] = i;
    //                seqY[cnt] = -i + 1 + j;
    //            }
    //        }
    //        else if (angle < -108 && angle > -162)
    //        {
    //            // 左上
    //            seqX[cnt++] = -i;
    //            seqY[cnt] = -i;

    //            seqX[maxCnt - 1] = i;
    //            seqY[maxCnt - 1] = i;

    //            for (int j = 1; j <= 2 * i; j++)
    //            {
    //                seqX[cnt++] = -i;
    //                seqY[cnt] = -i + j;

    //                seqX[cnt++] = -i + j;
    //                seqY[cnt] = -i;
    //            }

    //            for (int j = 0; j < 2 * i - 1; j++)
    //            {
    //                seqX[cnt++] = -i + 1 + j;
    //                seqY[cnt] = i;

    //                seqX[cnt++] = i;
    //                seqY[cnt] = -i + 1 + j;
    //            }
    //        }
    //        else if ((angle <= -162 && angle >= -180) || (angle >= 162 && angle <= 180))
    //        {
    //            // 左边
    //            seqX[cnt++] = -i;
    //            seqY[cnt] = 0;

    //            seqX[maxCnt - 1] = i;
    //            seqY[maxCnt - 1] = 0;

    //            for (int j = 1; j <= i; j++)
    //            {
    //                seqX[cnt++] = -i;
    //                seqY[cnt] = j;

    //                seqX[maxCnt - 1 - cnt] = i;
    //                seqY[maxCnt - 1 - cnt] = j;

    //                seqX[cnt++] = -i;
    //                seqY[cnt] = -j;

    //                seqX[maxCnt - 1 - cnt] = i;
    //                seqY[maxCnt - 1 - cnt] = -j;
    //            }

    //            for (int j = 0; j < 2 * i - i; j++)
    //            {
    //                seqX[cnt++] = -i + 1 + j;
    //                seqY[cnt] = i;

    //                seqX[cnt++] = -i + 1 + j;
    //                seqY[cnt] = -i;
    //            }
    //        }
    //        else if (angle > 108 && angle < 162)
    //        {
    //            // 左下
    //            seqX[cnt++] = -i;
    //            seqY[cnt] = i;

    //            seqX[maxCnt - 1] = i;
    //            seqY[maxCnt - 1] = -i;

    //            for (int j = 1; j <= 2 * i; j++)
    //            {
    //                seqX[cnt++] = -i + j;
    //                seqY[cnt] = i;

    //                seqX[cnt++] = -i;
    //                seqY[cnt] = i - j;
    //            }

    //            for (int j = 0; j < 2 * i - 1; j++)
    //            {
    //                seqX[cnt++] = i;
    //                seqY[cnt] = i - 1 - j;

    //                seqX[cnt++] = -i + 1 + j;
    //                seqY[cnt] = -i;
    //            }
    //        }
    //        else if (angle >= 72 && angle <= 108)
    //        {
    //            // 下边
    //            seqX[cnt++] = 0;
    //            seqY[cnt] = i;

    //            seqX[maxCnt - 1] = 0;
    //            seqY[maxCnt - 1] = -i;

    //            for (int j = 1; j <= i; j++)
    //            {
    //                seqX[cnt++] = j;
    //                seqY[cnt] = i;

    //                seqX[maxCnt - 1 - cnt] = j;
    //                seqY[maxCnt - 1 - cnt] = -i;

    //                seqX[cnt++] = -j;
    //                seqY[cnt] = i;

    //                seqX[maxCnt - 1 - cnt] = -j;
    //                seqY[maxCnt - 1 - cnt] = -i;
    //            }

    //            for (int j = 0; j < 2 * i - 1; j++)
    //            {
    //                seqX[cnt++] = i;
    //                seqY[cnt] = i - 1 - j;

    //                seqX[cnt++] = -i;
    //                seqY[cnt] = i - 1 - j;
    //            }
    //        }
    //        else if (angle > 18 && angle < 72)
    //        {
    //            // 右下
    //            seqX[cnt++] = i;
    //            seqY[cnt] = i;

    //            seqX[maxCnt - 1] = -i;
    //            seqY[maxCnt - 1] = -i;

    //            for (int j = 1; j <= 2 * i; j++)
    //            {
    //                seqX[cnt++] = i;
    //                seqY[cnt] = i - j;

    //                seqX[cnt++] = i - j;
    //                seqY[cnt] = i;
    //            }

    //            for (int j = 0; j < 2 * i - i; j++)
    //            {
    //                seqX[cnt++] = i - 1 - j;
    //                seqY[cnt] = j;

    //                seqX[cnt++] = -i;
    //                seqY[cnt] = i - 1 - j;
    //            }
    //        }

    //        for (int k = 0; k < maxCnt; k++)
    //        {
    //            targetX = (int)(endTile.x + seqX[k]);
    //            targetY = (int)(endTile.y + seqY[k]);
    //            if (IsValidGrid(targetX, targetY) && IsConnectedPixel(startX, startY, TileX2PixelX(targetX, true), TileY2PixelY(targetY, true)))
    //            {
    //                if (targetX == (int)endTile.x && targetY == (int)endTile.y)
    //                {
    //                    lastForwardDesc = new Vector2(endX, endY);
    //                }
    //                else
    //                {
    //                    lastForwardDesc = Tile2Pixel(targetX, targetY, true);
    //                }
    //                return lastForwardDesc;
    //            }
    //        }
    //    }

    //    return INVALID_VEC2;
    //}


    private float GetAngle(float px1, float py1, float px2, float py2)
    {
        //两点的x、y值
        float x = px2 - px1;
        float y = py2 - py1;
        double hypotenuse = Math.Sqrt(Math.Pow(x, 2) + Math.Pow(y, 2));
        //斜边长度
        double cos = x / hypotenuse;
        double radian = Math.Acos(cos);
        //求出弧度
        double angle = 180 / (Math.PI / radian);
        //用弧度算出角度        
        if (y < 0)
        {
            angle = -angle;
        }
        else if ((y == 0) && (x < 0))
        {
            angle = 180;
        }
        return (float)angle;
    }


    private Vector3 SearchValidGridInternal(int startX, int startY, int endPosX, int endPosY, Vector2 checkBlockPos)
    {
        Vector2 sPos = new Vector2(startX, startY);
        Vector2 ePos = new Vector2(endPosX, endPosY);

        Vector2 endTile = Pixel2Tile(endPosX, endPosY);
        if (IsValidGrid((int)endTile.x, (int)endTile.y) && (checkBlockPos.Equals(INVALID_VEC2) || TestWalkStraight((int)checkBlockPos.x, (int)checkBlockPos.y, endPosX, endPosY)))
        {
            // 目标点有效则直接走到目标点
            return ePos;
        }

        // 两点间距小于20像素直接返回起始点
        if (Vector2.Distance(ePos, sPos) < MIN_SCENE_BLOCK_SZIE)
        {
            return sPos;
        }

        // 大于20像素取中点进行2分法检测
        Vector2 tmpPos = new Vector2((int)((ePos.x + sPos.x) / 2 + 0.5f), (int)((ePos.y + sPos.y) / 2 + 0.5f));
        Vector2 tmpTile = Pixel2Tile((int)tmpPos.x, (int)tmpPos.y);
        if (IsValidGrid((int)tmpTile.x, (int)tmpTile.y) && (checkBlockPos.Equals(INVALID_VEC2) || TestWalkStraight((int)checkBlockPos.x, (int)checkBlockPos.y, (int)tmpPos.x, (int)tmpPos.y)))
        {
            // 中点有效，继续对后半段进行2分法
            sPos = tmpPos;
        }
        else
        {
            // 中点无效，对前半段进行2分法
            ePos = tmpPos;
        }
        return SearchValidGridInternal((int)sPos.x, (int)sPos.y, (int)ePos.x, (int)ePos.y, checkBlockPos);
    }

    /// <summary>
    /// 检测指定的两点是否联通。
    /// </summary>
    /// <param name="startX"></param>
    /// <param name="startY"></param>
    /// <param name="endX"></param>
    /// <param name="endY"></param>
    /// <returns></returns>
    public bool IsConnectedPixel(int startX, int startY, int endX, int endY)
    {
        Vector2 stStartTile = Pixel2Tile(startX, startY);
        Vector2 stEndTile = Pixel2Tile(endX, endY);

        if (stStartTile.x < 0 || stStartTile.x >= Columns || stStartTile.y < 0 || stStartTile.y >= Rows || stEndTile.x < 0 || stEndTile.x >= Columns || stEndTile.y < 0 || stEndTile.y >= Rows)
        {
            return false;
        }

        Cell startCell = tiles[(int)stStartTile.y, (int)stStartTile.x];
        Cell endCell = tiles[(int)stEndTile.y, (int)stEndTile.x];
        if (startCell.islandIdx >= 0)
        {
            // 如果有岛区域数据，则同一个岛区域内均可联通
            return startCell.islandIdx > 0 && startCell.islandIdx == endCell.islandIdx;
        }
        else
        {
            // 没有岛分块数据，通过寻路确定
            Vector2[] path = GetPathInPixel(startX, startY, endX, endY);
            return null != path;
        }
    }

    /// <summary>
    /// 测试指定的两点间是否可以直线行走。
    /// </summary>
    /// <param name="startX">起始点x，世界坐标</param>
    /// <param name="startY">起始点y，世界坐标</param>
    /// <param name="endX">终点x，世界坐标</param>
    /// <param name="endY">终点y，世界坐标</param>
    /// <returns></returns>
    public bool TestWalkStraight(int startX, int startY, int endX, int endY)
    {
        Vector2 stStartTile = Pixel2Tile(startX, startY);
        int nStartTileX = (int)stStartTile.x;
        int nStartTileY = (int)stStartTile.y;

        Vector2 stEndTile = Pixel2Tile(endX, endY);
        int nEndTileX = (int)stEndTile.x;
        int nEndTileY = (int)stEndTile.y;

        if (nStartTileX < 0 || nStartTileX >= Columns || nStartTileY < 0 || nStartTileY >= Rows || nEndTileX < 0 || nEndTileX >= Columns || nEndTileY < 0 || nEndTileY >= Rows)
        {
            return false;
        }

        // 防止越界
        int tilesLen0 = tiles.GetLength(0);
        int tilesLen1 = tiles.GetLength(1);
        if (nStartTileY >= tilesLen0 || nStartTileX >= tilesLen1 || nEndTileY >= tilesLen0 || nEndTileX >= tilesLen1)
        {
            return false;
        }

        Cell endCell = tiles[nEndTileY, nEndTileX];

        // 先判断终点是否可行走
        if (0 == endCell.walkable)
        {
            return false;
        }

        Cell startCell = tiles[nStartTileY, nStartTileX];
        if (startCell.firstTile >= 0 && startCell.firstTile == endCell.firstTile)
        {
            // 起点和终点在同一个大块中
            return true;
        }

        if (startCell.islandIdx > 0 && startCell.islandIdx != endCell.islandIdx)
        {
            // 不在同一个岛中不可直线行走
            return false;
        }

        /////////////////////////////////////////////
        // 下面使用直线2分法检测
        int nBlockWidth = System.Math.Abs(nEndTileX - nStartTileX);
        int nBlockHeight = System.Math.Abs(nEndTileY - nStartTileY);
        int nGrowX = nEndTileX > nStartTileX ? 1 : -1;
        int nGrowY = nEndTileY > nStartTileY ? 1 : -1;

        // 设置直线两端点为格子的中心坐标
        Vector2 stStartCenter = Tile2Pixel(nStartTileX, nStartTileY, true);
        int nStartCenterX = (int)stStartCenter.x;
        int nStartCenterY = (int)stStartCenter.y;

        Vector2 stEndCenter = Tile2Pixel(nEndTileX, nEndTileY, true);
        float nEndCenterX = (int)stEndCenter.x;
        float nEndCenterY = (int)stEndCenter.y;

        float fK;// 直线斜率
        float fOffset;// 坐标偏移

        int i;
        if (nBlockWidth >= nBlockHeight)
        {
            // 沿着x轴
            fK = (nEndCenterY - nStartCenterY * 1.0f) / (nEndCenterX - nStartCenterX);
            fOffset = (nStartCenterY * nEndCenterX - nEndCenterY * nStartCenterX) / (nEndCenterX - nStartCenterX);

            for (i = 0; i < nBlockWidth; i++)
            {
                nStartTileX += nGrowX;
                nStartCenterX = (int)((nStartTileX + 0.5f) * MIN_SCENE_BLOCK_SZIE);
                nStartCenterY = (int)(fK * nStartCenterX + fOffset + 0.5f);
                nStartTileY = (int)(nStartCenterY / MIN_SCENE_BLOCK_SZIE);

                if (0 == tiles[nStartTileY, nStartTileX].walkable)
                {
                    return false;
                }
            }
        }
        else
        {
            fK = (nEndCenterX - nStartCenterX * 1.0f) / (nEndCenterY - nStartCenterY);
            fOffset = (nEndCenterY * nStartCenterX - nStartCenterY * nEndCenterX) / (nEndCenterY - nStartCenterY);

            for (i = 0; i < nBlockHeight; i++)
            {
                nStartTileY += nGrowY;
                nStartCenterY = (int)((nStartTileY + 0.5f) * MIN_SCENE_BLOCK_SZIE);
                nStartCenterX = (int)(fK * nStartCenterY + fOffset + 0.5f);
                nStartTileX = (int)(nStartCenterX / MIN_SCENE_BLOCK_SZIE);

                if (0 == tiles[nStartTileY, nStartTileX].walkable)
                {
                    return false;
                }
            }
        }

        return true;
    }
    /// <summary>
    /// 寻路路径(像素)
    /// </summary>
    public Vector2[] GetPathInPixel(int startX, int startY, int endX, int endY)
    {
        //Debug.Log("start=" + start.ToString() + ", end=" + end.ToString());        
        // 先判断是否可以直线到达，可以则直接以终点构建路径
        //start = new Vector3(14.239999771118164f, 0, 24.979999542236328f);
        //end = new Vector3(14.002195358276367f, 0, 30.967761993408203f);
        if (TestWalkStraight(startX, startY, endX, endY))
        {
            return Get3DPath(new Vector2(startX, startY), new Vector2(endX, endY));
        }
        else
        {
            Vector2 stStartTilePos = this.Pixel2Tile(startX, startY);
            Vector2 stEndTilePos = this.Pixel2Tile(endX, endY);
            if (stStartTilePos.x < 0 || stStartTilePos.x >= Columns || stStartTilePos.y < 0 || stStartTilePos.y >= Rows)
            {
                return null;
            }
            if (stEndTilePos.x < 0 || stEndTilePos.x >= Columns || stEndTilePos.y < 0 || stEndTilePos.y >= Rows)
            {
                return null;
            }
            Cell startCell = tiles[(int)stStartTilePos.y, (int)stStartTilePos.x];
            Cell endCell = tiles[(int)stEndTilePos.y, (int)stEndTilePos.x];
            if (0 == startCell.walkable || 0 == endCell.walkable)
            {
                return null;
            }

            if (startCell.islandIdx >= 0 && startCell.islandIdx != endCell.islandIdx)
            {
                // 不在一个岛中，不可联通
                return null;
            }
            return Get3DPath(new Vector2(startX, startY), new Vector2(endX, endY));
        }
    }
    private Vector2[] Get3DPath(Vector2 start, Vector2 end)
    {
        //这里的A*算法替换为unity的寻路算法
        var startWorldPos = PixelPosToWorldPos(start);
        var endWorldPos = PixelPosToWorldPos(end);
        var navPath = new NavMeshPath();
        NavMesh.CalculatePath(ThreeDTools.GetNavYValue(startWorldPos.x, startWorldPos.z),
            ThreeDTools.GetNavYValue(endWorldPos.x, endWorldPos.z), -1, navPath);
        var localPath = navPath.corners;
        var len = localPath.Length;
        if (navPath.status != NavMeshPathStatus.PathComplete || len <= 1)
        {
            return null;
        }
        UnityEngine.Vector2[] serverPath = new Vector2[len - 1];
        for (int i = 1; i < len; i++)
        {
            var worldPos = localPath[i];
            serverPath[i - 1] = WorldPosToPixelPos(worldPos);
        }
        return serverPath;
    }

    private List<Vector2> OptimizePath(int startX, int startY, ushort tmpPathNum)
    {
        // 先将节点数量保存下来
        ushort usPathNum = tmpPathNum;
        // 优化起始点，先找到可以从起点直线到达的第一个点
        int nFirstPoint = 0;
        int nSecondPoint = nFirstPoint + 1;
        while (tmpPathNum > 1 && TestWalkStraight(startX, startY, (int)m_astTmpPathPostions[nSecondPoint].x, (int)m_astTmpPathPostions[nSecondPoint].y))
        {
            nFirstPoint = nSecondPoint;
            nSecondPoint = nFirstPoint + 1;
            tmpPathNum--;
        }

        int nSavedFirstPoint = nFirstPoint;

        // 优化中间路径点
        int nThirdPoint;
        while (tmpPathNum > 2)
        {
            nThirdPoint = nSecondPoint + 1;
            if (nThirdPoint >= usPathNum)
            {
                // 到达最后一个点了
                break;
            }

            if (TestWalkStraight((int)m_astTmpPathPostions[nFirstPoint].x, (int)m_astTmpPathPostions[nFirstPoint].y, (int)m_astTmpPathPostions[nThirdPoint].x, (int)m_astTmpPathPostions[nThirdPoint].y))
            {
                // 两个点可以直线行走，直接将前面的点去掉
                m_astTmpPathPostions[nSecondPoint] = new Vector2(INVALID_VEC2.x, INVALID_VEC2.y);// 标记为0代表此节点不需要
                nSecondPoint = nThirdPoint;
                tmpPathNum--;
                continue;
            }

            nFirstPoint = nSecondPoint;
            nSecondPoint = nFirstPoint + 1;
        }

        // 收集所有有效节点
        List<Vector2> path = new List<Vector2>(tmpPathNum);
        int i = nSavedFirstPoint;
        int j = 0;
        while (j < tmpPathNum)
        {
            if (!m_astTmpPathPostions[i].Equals(INVALID_VEC2))
            {
                path.Add(m_astTmpPathPostions[i]);
                j++;
            }
            i++;
        }
        return path;
    }
    private void CheckCellCanAdd(List<Cell> openList, List<Cell> closeList, int x, int y, Cell cell, Cell endCell, int walkSize)
    {
        if (x >= 0 && x < Columns && y >= 0 && y < Rows)
        {
            Cell naighborCell = tiles[y, x];
            if (!naighborCell.closed && 0 != naighborCell.walkable)
            {
                int g = cell.G + walkSize;
                if (naighborCell.opened && naighborCell.G < g)
                {
                    //已经在开放列表中了，但路径比现在优先，忽略
                    return;
                }
                naighborCell.SetF(cell, endCell, walkSize, true);
                if (!naighborCell.opened)
                {
                    //加入开放列表
                    naighborCell.opened = true;
                    InsertHeap(openList, naighborCell, openList.Count);
                }
            }
        }
    }
    /// <summary>
    /// 将堆顶点弹出并排序。
    /// </summary>
    private Cell popHeap(List<Cell> openList, List<Cell> closeList)
    {
        int length = openList.Count;
        if (length <= 0)
        {
            return null;
        }
        // 取出最小值
        Cell minCell = openList[0];
        // 加入封闭列表
        closeList.Add(minCell);
        minCell.closed = true;
        // 比较两个子节点，将小的提升为父节点
        int iParent = 0;
        int leftChild, rightChild;
        for (leftChild = (iParent << 1) + 1, rightChild = leftChild + 1; rightChild < length; leftChild = (iParent << 1) + 1, rightChild = leftChild + 1)
        {
            if (openList[leftChild].F < openList[rightChild].F)
            {
                openList[iParent] = openList[leftChild];
                iParent = leftChild;
            }
            else
            {
                openList[iParent] = openList[rightChild];
                iParent = rightChild;
            }
        }
        //如果最后一个节点不是right child，将其填在空出来的节点上，防止数组空洞
        Cell lastCell = openList[length - 1];
        openList.RemoveAt(length - 1);
        if (iParent != length - 1)
        {
            InsertHeap(openList, lastCell, iParent);
        }
        return minCell;
    }
    /// <summary>
    /// 插入堆操作。
    /// </summary>
    private void InsertHeap(List<Cell> openList, Cell cell, int position)
    {
        //先将cell插入指定的位置
        int length = openList.Count;
        if (position >= length)
        {
            openList.Add(cell);
        }
        else
        {
            openList[position] = cell;
        }
        //依次和父节点进行比较，如果比父节点小则上移
        int iChild;
        int iParent;
        for (iChild = position, iParent = (iChild - 1) >> 1; iChild > 0; iChild = iParent, iParent = (iChild - 1) >> 1)
        {
            //交换节点
            if (openList[iChild].F < openList[iParent].F)
            {
                Cell tmpCell = openList[iParent];
                openList[iParent] = openList[iChild];
                openList[iChild] = tmpCell;
            }
            else
            {
                break;
            }
        }
    }
    #endregion


#if UNITY_EDITOR
    //在非编辑器模式下无用的属性和函数

    /// <summary>
    /// 选中格子区域的大小
    /// </summary>
    [HideInInspector]
    [DonotWrap]
    public int size = 1;
    /// <summary>
    /// 是否显示网格
    /// </summary>
    [DonotWrap]
    public bool showGrid = true;
    [HideInInspector]
    [DonotWrap]
    public Vector2 SelectedTilePos;

    /// <summary>
    /// 绘制网格
    /// </summary>
    void OnDrawGizmosSelected()
    {
        if (tiles == null)
        {
            return;
        }
        float mapWidth = Columns * TileWidth;
        float mapHeight = Rows * TileHeight;

        var transform = this.transform;
        Vector3 position = transform.position;
        Gizmos.color = Color.white;
        //绘制整体的矩形区域
        Vector3 bottomLeft = position;
        Vector3 bottomRight = bottomLeft + transform.right * mapWidth;
        Vector3 topLeft = bottomLeft + transform.forward * mapHeight;
        Vector3 topRight = bottomLeft + transform.right * mapWidth + transform.forward * mapHeight;

        Gizmos.DrawLine(bottomLeft, bottomRight);
        Gizmos.DrawLine(bottomLeft, topLeft);
        Gizmos.DrawLine(topLeft, topRight);
        Gizmos.DrawLine(topRight, bottomRight);
        //绘制普通网格
        Gizmos.color = Color.grey;

        if (showGrid)
        {
            for (int i = 1; i < Columns; i++)
            {
                Vector3 left = Tile2World(i, 0);
                Vector3 right = Tile2World(i, Rows);
                Gizmos.DrawLine(left, right);
            }
            for (int i = 1; i < Rows; i++)
            {
                Vector3 left = Tile2World(0, i);
                Vector3 right = Tile2World(Columns, i);
                Gizmos.DrawLine(left, right);
            }
        }


        //绘制关闭的网格
        for (short i = 0; i < Rows; i++)
        {
            for (short j = 0; j < Columns; j++)
            {
                if (!IsValidGrid(j, Rows - 1 - i))
                {
                    FillTile(new Vector2(j, i), Color.yellow);
                }
            }
        }

        //绘制当前被选中的网格
        DrawTile(SelectedTilePos, Color.green, size);
    }
    /// <summary>
    /// 绘制某个网格
    /// </summary>
    /// <param name="vector">需要绘制的坐标</param>
    /// <param name="color">绘制使用的颜色</param>
    void DrawTile(Vector2 vector, Color color, int Scale)
    {
        Gizmos.color = color;
        //向4个方向取1-scale个格子
        int offset = Scale - 1;
        Vector2 _bottomLeft = GetUseAbleTilePos(new Vector2(vector.x - offset, vector.y - offset));
        Vector2 _bottomRight = GetUseAbleTilePos(new Vector2(vector.x + offset, vector.y - offset));
        Vector2 _topLeft = GetUseAbleTilePos(new Vector2(vector.x - offset, vector.y + offset));
        Vector2 _topRight = GetUseAbleTilePos(new Vector2(vector.x + offset, vector.y + offset));

        Vector3 bottomLeft = Tile2World(_bottomLeft.x, _bottomLeft.y);

        _bottomRight.x += 1;
        Vector3 bottomRight = Tile2World(_bottomRight.x, _bottomRight.y);

        _topLeft.y += 1;
        Vector3 topLeft = Tile2World(_topLeft.x, _topLeft.y);

        _topRight.x += 1;
        _topRight.y += 1;
        Vector3 topRight = Tile2World(_topRight.x, _topRight.y);

        Gizmos.DrawLine(bottomLeft, bottomRight);
        Gizmos.DrawLine(bottomLeft, topLeft);
        Gizmos.DrawLine(topLeft, topRight);
        Gizmos.DrawLine(topRight, bottomRight);
    }
    /// <summary>
    /// 绘制某个网格
    /// </summary>
    /// <param name="vector">需要绘制的坐标</param>
    /// <param name="color">绘制使用的颜色</param>
    void DrawPath(Color color, Vector2[] path, float dotRadius)
    {
        Gizmos.color = color;
        Vector2 tilePos1, tilePos2;
        Vector3 worldPos1, worldPos2;
        for (int i = 0, length = path.Length; i < length; i++)
        {
            tilePos1 = Pixel2Tile((int)path[i].x, (int)path[i].y);
            worldPos1 = Tile2World(tilePos1.x, tilePos1.y);
            if (i < length - 1)
            {
                tilePos2 = Pixel2Tile((int)path[i + 1].x, (int)path[i + 1].y);
                worldPos2 = Tile2World(tilePos2.x, tilePos2.y);
                Gizmos.DrawLine(worldPos1, worldPos2);
            }
            Gizmos.DrawWireSphere(worldPos1, dotRadius);
        }
    }
    /// <summary>
    /// 绘制某个网格
    /// </summary>
    /// <param name="vector">需要绘制的坐标</param>
    /// <param name="color">绘制使用的颜色</param>
    void FillTile(Vector2 vector, Color color)
    {
        Gizmos.color = color;

        Vector2 _bottomLeft = GetUseAbleTilePos(new Vector2(vector.x, vector.y));
        Vector2 _bottomRight = GetUseAbleTilePos(new Vector2(vector.x, vector.y));
        Vector2 _topLeft = GetUseAbleTilePos(new Vector2(vector.x, vector.y));
        Vector2 _topRight = GetUseAbleTilePos(new Vector2(vector.x, vector.y));

        Vector3 bottomLeft = Tile2World(_bottomLeft.x, _bottomLeft.y);

        _bottomRight.x += 1;
        Vector3 bottomRight = Tile2World(_bottomRight.x, _bottomRight.y);

        _topLeft.y += 1;
        Vector3 topLeft = Tile2World(_topLeft.x, _topLeft.y);

        _topRight.x += 1;
        _topRight.y += 1;
        Vector3 topRight = Tile2World(_topRight.x, _topRight.y);

        Gizmos.DrawLine(bottomLeft, topRight);
        Gizmos.DrawLine(bottomRight, topLeft);
    }
    /// <summary>
    /// 设置单个网格
    /// </summary>
    /// <param name="vec">网格坐标</param>
    /// <param name="open">网格是否开启</param>
    [DonotWrap]
    public bool SetTile(bool open)
    {
        if (tiles == null)
        {
            return false;
        }
        bool old = IsValidGrid(Rows - 1 - (int)SelectedTilePos.y, (int)SelectedTilePos.x);

        for (short i = (short)((short)SelectedTilePos.y - size + 1); i < (short)SelectedTilePos.y + size; i++)
        {
            for (short j = (short)((short)SelectedTilePos.x - size + 1); j < (short)SelectedTilePos.x + size; j++)
            {
                if (i < tiles.GetLength(0) && j < tiles.GetLength(1) && i >= 0 && j >= 0)
                {
                    SetTileCollision(j, i, (byte)(open == true ? 1 : 0));
                }
            }
        }

        return old == open;
    }
    /// <summary>
    /// 重置网格数据
    /// </summary>
    [DonotWrap]
    public void Reset()
    {
        if (tiles != null)
        {
            for (int i = 0, xlength = tiles.GetLength(0); i < xlength; i++)
            {
                for (int j = 0, ylength = tiles.GetLength(1); j < ylength; j++)
                {
                    SetTileCollision(j, i, 1);
                }
            }
        }
    }

    /// <summary>
    /// 获取一个在区域内的点
    /// </summary>
    /// <param name="vector"></param>
    /// <returns></returns>
    [DonotWrap]
    public Vector2 GetUseAbleTilePos(Vector2 vector)
    {
        int x = (int)vector.x;
        int y = (int)vector.y;
        if (x < 0)
        {
            x = 0;
        }
        else if (x > Columns - 1)
        {
            x = Columns - 1;
        }
        if (y < 0)
        {
            y = 0;
        }
        else if (y > Rows - 1)
        {
            y = Rows - 1;
        }
        return new Vector2(x, y);
    }
#endif

    #region 传送点相关

    public void SetTeleportInfos(int validDistance, Vector2[] teleportPosList, int[] teleportIdList)
    {
        teleportValidDistance = validDistance;

        int tpCnt = teleportPosList.Length;
        tpInfos = new TeleportInfo[tpCnt];
        TeleportInfo tpInfo;
        for (int i = 0; i < tpCnt; i++)
        {
            tpInfo = new TeleportInfo();
            tpInfo.pos = new Vector2(teleportPosList[i].x, teleportPosList[i].y);
            tpInfo.id = teleportIdList[i];
            tpInfos[i] = tpInfo;
        }
    }

    /// <summary>
    /// 检查是否踩在某个传送点上，是则返回其id。
    /// </summary>
    /// <param name="posWorld">世界坐标</param>
    /// <returns></returns>
    [DonotWrap]
    public int CheckTeleport(Vector3 posWorld)
    {
        if (null != tpInfos)
        {
            Vector2 posPixel = WorldPosToPixelPos(posWorld);
            int tpCnt = tpInfos.Length;
            TeleportInfo tpInfo;
            for (int i = 0; i < tpCnt; i++)
            {
                tpInfo = tpInfos[i];
                if (Vector2.Distance(posPixel, tpInfo.pos) < teleportValidDistance)
                {
                    return tpInfo.id;
                }
            }
        }
        return 0;
    }
    //扩展2个坐标转换函数
    private Vector2 WorldPosToPixelPos(Vector3 v)
    {
        Vector2 posPixel = new Vector2((int)Math.Floor(meterScale * v.x + 0.001f),
(int)(mapHeightPixel - Math.Round(v.z * meterScale)));
        return posPixel;
    }
    private Vector3 PixelPosToWorldPos(Vector2 v)
    {
        Vector3 posWorld = new Vector3(v.x / meterScale, 0,
            (mapHeightPixel - v.y) / meterScale);
        return posWorld;
    }
    #endregion
}