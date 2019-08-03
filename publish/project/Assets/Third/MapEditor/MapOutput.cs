#if UNITY_EDITOR
using UnityEngine;
using System.Collections.Generic;
using System.IO;
using System;
public class MapOutput
{
    public static void OutputMap(MapData data, string outputPath)
    {
        var path = Path.GetDirectoryName(outputPath);
        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }
        var fileStream = new FileStream(outputPath, FileMode.Create);
        var byteArray = new ByteArray(null, fileStream);
        byteArray.useLittleEndian = true;
        byteArray.WriteInt32(data.sceneID);//场景ID
        byteArray.WriteInt16(data.width);//场景像素宽
        byteArray.WriteInt16(data.height);//场景像素高
        //循环写入场景中传送点信息
        byteArray.WriteInt16(data.gates == null ? (short)0 : (short)data.gates.Length);
        //Debug.Log("(short)data.gates.Count:"+ (short)data.gates.Count);
        if (data.gates != null)
        {
            for (int i = 0, len = data.gates.Length; i < len; i++)
            {
                var gate = data.gates[i];
                byteArray.WriteInt32(gate.id);
                //Debug.Log("gate.id:" + gate.id);
                byteArray.WriteString(null);
                byteArray.WriteByte(gate.direction);
                //Debug.Log("gate.direction:" + gate.direction);
                byteArray.WriteInt16(gate.x);
                byteArray.WriteInt16(gate.y);
                //Debug.Log("gate.pixelX:" + gate.pixelX);
                //Debug.Log("gate.pixelY:" + gate.pixelY);
                byteArray.WriteInt32(0);
                byteArray.WriteInt16(0);
                byteArray.WriteInt16(0);
            }
        }

        //循环写入场景中NPC信息
        byteArray.WriteInt16(data.npcs == null ? (short)0 : (short)data.npcs.Length);
        if (data.npcs != null)
        {
            for (int i = 0, len = data.npcs.Length; i < len; i++)
            {
                var npc = data.npcs[i];
                byteArray.WriteInt32(npc.id);
                byteArray.WriteByte(npc.direction);

                byteArray.WriteInt16(npc.x);
                byteArray.WriteInt16(npc.y);
            }
        }
        // 写入格子信息
        byteArray.WriteInt16(data.cellWidth);
        byteArray.WriteInt16(data.cellHeight);
        var columns = Mathf.CeilToInt(1.0f * data.width / data.cellWidth);
        var rows = Mathf.CeilToInt(1.0f * data.height / data.cellHeight);
        for (int i = 0; i < rows; i++)
        {
            for (int j = 0; j < columns; j++)
            {
                byte mask = 0;
                byte island = 0;
                if (data.safetyData[i * columns + j] == 1)
                {
                    mask = (byte)(mask | 1 << 1);
                }
                island = data.walkableData[i * columns + j];
                byteArray.WriteByte(mask);
                byteArray.WriteByte(island);
            }
        }
        byteArray.Dispose();
    }
    public static void OutputServerMap(MapData data, string outputPath)
    {
        File.WriteAllText("D://o.js", JsonUtility.ToJson(data));

        var path = Path.GetDirectoryName(outputPath);
        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }
        var fileStream = new FileStream(outputPath, FileMode.Create);
        var byteArray = new ByteArray(null, fileStream);
        byteArray.useLittleEndian = true;
        byteArray.WriteInt32(data.sceneID);//场景ID
        byteArray.WriteString("");
        byteArray.WriteInt16(data.width);
        byteArray.WriteInt16(data.height);
        byteArray.WriteInt16(data.cellWidth);
        byteArray.WriteInt16(data.cellHeight);

        var size = 0;
        if (data.cellWidth > 0 && data.cellHeight > 0)
        {
            size = (data.width / data.cellWidth) * (data.height / data.cellHeight);
        }
        byteArray.WriteInt32(size);
        for (int i = 0; i < size; i++)
        {
            byteArray.WriteByte(data.walkableData[i]);
        }
        //循环写入场景中传送点信息
        byteArray.WriteInt16(data.gates == null ? (short)0 : (short)data.gates.Length);
        if (data.gates != null)
        {
            for (int i = 0, len = data.gates.Length; i < len; i++)
            {
                var gate = data.gates[i];
                byteArray.WriteInt16(gate.x);
                byteArray.WriteInt16(gate.y);

                byteArray.WriteInt32(gate.id);
                byteArray.WriteString(null);
                byteArray.WriteInt32(0);
                byteArray.WriteInt16(0);
                byteArray.WriteInt16(0);
                byteArray.WriteByte(gate.direction);
            }
        }
        //循环写入场景中NPC信息
        byteArray.WriteInt16(data.npcs == null ? (short)0 : (short)data.npcs.Length);
        if (data.npcs != null)
        {
            for (int i = 0, len = data.npcs.Length; i < len; i++)
            {
                var npc = data.npcs[i];
                byteArray.WriteInt16(npc.x);
                byteArray.WriteInt16(npc.y);
                byteArray.WriteInt32(npc.id);
                byteArray.WriteInt32(npc.direction);
            }
        }
        //monster
        byteArray.WriteInt16(data.monsters == null ? (short)0 : (short)data.monsters.Length);
        if (data.monsters != null)
        {
            for (int i = 0, len = data.monsters.Length; i < len; i++)
            {
                var monster = data.monsters[i];
                byteArray.WriteInt16(monster.x);
                byteArray.WriteInt16(monster.y);
                byteArray.WriteInt32(monster.id);
            }
        }
        //monster
        byteArray.WriteInt16(0);

        //reborn position
        byteArray.WriteInt16(data.rebornX);
        byteArray.WriteInt16(data.rebornY);
        //reborn sceneID
        byteArray.WriteInt32(data.rebornSceneID);

        //collection
        byteArray.WriteInt16(0);

        //event
        byteArray.WriteInt16(0);

        //safety
        for (int i = 0; i < size; i++)
        {
            byteArray.WriteByte(data.safetyData[i]);
        }
        byteArray.Dispose();
    }

    public static MapData ReadMapData(string readPath)
    {
        if (!File.Exists(readPath))
        {
            return null;
        }
        MapData data = new MapData();
        var fileStream = new FileStream(readPath, FileMode.Open);
        var byteArray = new ByteArray(fileStream, null);
        byteArray.useLittleEndian = true;
        data.sceneID = byteArray.ReadInt32();//场景ID
        byteArray.ReadString();
        data.width = byteArray.ReadInt16();
        data.height = byteArray.ReadInt16();
        data.cellWidth = byteArray.ReadInt16();
        data.cellHeight = byteArray.ReadInt16();
        var size = byteArray.ReadInt32();
        data.walkableData = new byte[size];
        for (int i = 0; i < size; i++)
        {
            data.walkableData[i] = byteArray.ReadByte();
        }
        //循环写入场景中传送点信息
        var length = byteArray.ReadInt16();
        data.gates = new UnitBase[length];
        for (int i = 0; i < length; i++)
        {
            var x = byteArray.ReadInt16();
            var y = byteArray.ReadInt16();
            var id = byteArray.ReadInt32();
            byteArray.ReadString();
            byteArray.ReadInt32();
            byteArray.ReadInt16();
            byteArray.ReadInt16();
            var dir = byteArray.ReadByte();
            var gate = new UnitBase(id, dir, x, y);
            gate.index = i;
            data.gates[i] = gate;
        }
        //循环写入场景中NPC信息
        length = byteArray.ReadInt16();
        data.npcs = new UnitBase[length];
        for (int i = 0; i < length; i++)
        {
            var x = byteArray.ReadInt16();
            var y = byteArray.ReadInt16();
            var id = byteArray.ReadInt32();
            var dir = (byte)byteArray.ReadInt32();
            var npc = new UnitBase(id, dir, x, y);
            npc.index = i;
            data.npcs[i] = npc;
        }
        //monster
        length = byteArray.ReadInt16();
        data.monsters = new UnitBase[length];
        for (int i = 0; i < length; i++)
        {
            var x = byteArray.ReadInt16();
            var y = byteArray.ReadInt16();
            var id = byteArray.ReadInt32();
            var monster = new UnitBase(id, 0, x, y);
            monster.index = i;
            data.monsters[i] = monster;
        }
        //monster
        byteArray.ReadInt16();

        //reborn position
        data.rebornX = byteArray.ReadInt16();
        data.rebornY = byteArray.ReadInt16();
        //reborn sceneID
        data.rebornSceneID = byteArray.ReadInt32();

        //collection
        byteArray.ReadInt16();

        //event
        byteArray.ReadInt16();

        //safety
        if (byteArray.ReadPosition < byteArray.ReadLength)
        {
            size = byteArray.ReadInt32();
            data.safetyData = new byte[size];
            for (int i = 0; i < size; i++)
            {
                data.safetyData[i] = byteArray.ReadByte();
            }
        }
       
        byteArray.Dispose();
        return data;
    }
}
public class MapData
{
    public int sceneID = 0;
    public short width = 0;
    public short height = 0;
    public UnitBase[] gates = null;
    public UnitBase[] npcs = null;
    public UnitBase[] monsters = null;

    public short cellWidth = 0;
    public short cellHeight = 0;
    public byte[] walkableData = null;
    public byte[] safetyData = null;

    public int rebornSceneID = 0;
    public short rebornX = 0;
    public short rebornY = 0;
}
[Serializable]
public class UnitBase
{
    [NonSerialized]
    public int index = -1;
    public int id;
    public byte direction;
    public short x;
    public short y;
    public UnitBase(int id, byte direction, short x, short y)
    {
        this.id = id;
        this.direction = direction;
        this.x = x;
        this.y = y;
    }
    public Vector3 GetWorldPosition()
    {
        return new Vector3(x / 20.0f, 0, (SceneEditor.instance.data.height - y) / 20.0f);
    }
    public void SetWorldPosition(Vector3 v)
    {
        x = (short)Mathf.RoundToInt(v.x * 20);
        y = (short)Mathf.RoundToInt(SceneEditor.instance.data.height - v.z * 20);
    }
}
#endif