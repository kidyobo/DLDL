using System;
using System.IO;
using System.Net;
/// <summary>
/// 二进制数据流与基本类型转换处理类
/// </summary>
public class ByteArray : IDisposable
{
    public readonly bool IsLittleEndian = System.BitConverter.IsLittleEndian;
    /// <summary>
    /// 指定是否采用小端读写。
    /// </summary>
    public bool useLittleEndian;

    public long ReadLength
    {
        get
        {
            if (null == reader)
            {
                return 0;
            }
            return reader.BaseStream.Length;
        }
    }

    public long ReadPosition
    {
        set
        {
            if (null == reader)
            {
                return;
            }
            reader.BaseStream.Position = value;
        }
        get
        {
            if (null == reader)
            {
                return 0;
            }
            return reader.BaseStream.Position;
        }
    }

    BinaryReader reader = null;
    BinaryWriter writer = null;
    Stream readStream = null;
    Stream writeStream = null;
    byte[] writeBytes = null;
    public ByteArray(byte[] readBytes, byte[] writeBytes)
    {
        this.writeBytes = writeBytes;
        if (readBytes != null)
        {
            readStream = new MemoryStream(readBytes);
            reader = new BinaryReader(readStream);
        }

        if (writeBytes != null)
        {
            writeStream = new MemoryStream(writeBytes);
            writer = new BinaryWriter(writeStream);
        }
    }

    [DonotWrap]
    public ByteArray(Stream readStream, Stream writeStream)
    {
        this.readStream = readStream;
        this.writeStream = writeStream;
        if (readStream != null)
        {
            reader = new BinaryReader(readStream);
        }
        if (writeStream != null)
        {
            writer = new BinaryWriter(writeStream);
        }
    }

    /// <summary>
    /// 必须是MemoryStream
    /// </summary>
    /// <returns>返回写入的数组大小</returns>
    public byte[] GetWriteBytes()
    {
        int length = (int)writer.BaseStream.Position;
        System.Array.Resize<byte>(ref writeBytes, length);
        return writeBytes;
    }


    public void Dispose()
    {
        if (reader != null)
        {
            readStream.Close();
            readStream = null;
            reader.Close();
            reader = null;
        }

        if (writer != null)
        {
            writeStream.Close();
            writeStream = null;
            writer.Close();
            writer = null;
            writeBytes = null;
        }
    }

    public bool ReadBoolean()
    {
        bool value = reader.ReadBoolean();
        return value;
    }

    public byte ReadByte()
    {
        byte value = reader.ReadByte();
        return value;
    }

    public short ReadInt16()
    {
        short value = reader.ReadInt16();
        if (IsLittleEndian != useLittleEndian)
        {
            value = IPAddress.NetworkToHostOrder(value);
        }
        return value;
    }
    public int ReadInt32()
    {
        int value = reader.ReadInt32();
        if (IsLittleEndian != useLittleEndian)
        {
            value = IPAddress.NetworkToHostOrder(value);
        }
        return value;
    }
    public long ReadInt64()
    {
        long value = reader.ReadInt64();
        if (IsLittleEndian != useLittleEndian)
        {
            value = IPAddress.NetworkToHostOrder(value);
        }
        return value;
    }
    public float ReadSingle()
    {
        float value = reader.ReadSingle();
        return value;
    }

    public double ReadDouble()
    {
        double value = reader.ReadDouble();
        return value;
    }

    public byte[] ReadBytes(int count)
    {
        byte[] value = reader.ReadBytes(count);
        return value;
    }

    public string ReadString()
    {
        short len = ReadInt16();
        if (len > 0)
        {
            return System.Text.Encoding.UTF8.GetString(reader.ReadBytes(len));
        }
        return null;
    }
    public void WriteBoolean(bool value)
    {
        writer.Write(value);
    }

    public void WriteByte(byte value)
    {
        writer.Write(value);
    }

    public void WriteInt16(short value)
    {
        if (IsLittleEndian != useLittleEndian)
        {
            value = IPAddress.HostToNetworkOrder(value);
        }
        writer.Write(value);
    }

    public void WriteInt32(int value)
    {
        if (IsLittleEndian != useLittleEndian)
        {
            value = IPAddress.HostToNetworkOrder(value);
        }
        writer.Write(value);
    }

    public void WriteInt64(long value)
    {
        if (IsLittleEndian != useLittleEndian)
        {
            value = IPAddress.HostToNetworkOrder(value);
        }
        writer.Write(value);
    }

    public void WriteSingle(float value)
    {
        writer.Write(value);
    }

    public void WriteDouble(double value)
    {
        writer.Write(value);
    }

    public void WriteBytes(byte[] value)
    {
        writer.Write(value);
    }

    public void WriteString(string text)
    {
        if (text == null)
        {
            WriteInt16(0);
        }
        else
        {
            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(text);
            WriteInt16((short)(bytes.Length));
            writer.Write(bytes);
        }
    }

    public void WriteVector3(UnityEngine.Vector3 value)
    {
        writer.Write(value.x);
        writer.Write(value.y);
        writer.Write(value.z);
    }

    public UnityEngine.Vector3 ReadVector3()
    {
        return new UnityEngine.Vector3(
            reader.ReadSingle(),
            reader.ReadSingle(),
            reader.ReadSingle()
            );
    }

    public void WriteVector4(UnityEngine.Vector4 value)
    {
        writer.Write(value.x);
        writer.Write(value.y);
        writer.Write(value.z);
        writer.Write(value.w);
    }

    public UnityEngine.Vector4 ReadVector4()
    {
        return new UnityEngine.Vector4(
            reader.ReadSingle(),
            reader.ReadSingle(),
            reader.ReadSingle(),
            reader.ReadSingle()
            );
    }
    public void WriteVector2(UnityEngine.Vector2 value)
    {
        writer.Write(value.x);
        writer.Write(value.y);
    }

    public UnityEngine.Vector2 ReadVector2()
    {
        return new UnityEngine.Vector2(
            reader.ReadSingle(),
            reader.ReadSingle()
            );
    }
    public void WriteColor(UnityEngine.Color value)
    {
        writer.Write(value.r);
        writer.Write(value.g);
        writer.Write(value.b);
        writer.Write(value.a);
    }

    public UnityEngine.Color ReadColor()
    {
        return new UnityEngine.Color(
            reader.ReadSingle(),
            reader.ReadSingle(),
            reader.ReadSingle(),
            reader.ReadSingle()
            );
    }
}