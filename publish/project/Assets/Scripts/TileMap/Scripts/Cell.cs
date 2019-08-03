internal class Cell
{
    public int F = 0;//最小的优先
    public int G = 0;//目前的移动代价
    public int x;
    public int y;
    /// <summary>
    /// 是否可行走的标记，0代表不可行走（阻挡）。
    /// </summary>
    public byte walkable;
    /// <summary>
    /// 是否动态阻挡。
    /// </summary>
    public bool dynamic = false;
    public bool transparent = false;//是否透明
    public bool isSafety = false;//是否安全区
    public byte terrainType = 0;//地形类型
    public int firstTile = -1;//所在大块的左上角
    public int islandIdx = -1;//岛索引，-1表示没有相关数据
    public Cell father_cell = null;

    public bool closed;//是否在封闭列表中
    public bool opened;//是否在开放列表中
    public void reset()
    {
        F = 0;
        G = 0;
        father_cell = null;
        closed = false;
        opened = false;
    }
    public int SetF(Cell lastcell, Cell endCell, int WalkSize, bool doSet)
    {
        int g = lastcell.G + WalkSize;
        int h = 10 * (System.Math.Abs(endCell.x - this.x) + System.Math.Abs(endCell.y - this.y));
        int f = h + g;
        if (doSet && (father_cell == null || F > f))
        {
            this.father_cell = lastcell;
            G = g;
            F = f;
        }

        return f;
    }
}