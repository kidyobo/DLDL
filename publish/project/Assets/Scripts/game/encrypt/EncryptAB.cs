using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Collections.Generic;

public class EncryptAB
{
	private static byte[] bKeys = null;

	public static void encrypt(byte[] bytes, string key)
	{
		//将随机数拆开，转换成字符串，读取对应的ascii值，保存成数组
		if(bKeys == null) bKeys = Encoding.ASCII.GetBytes(key);

		//将bytes与上面的数组轮流异或
		for(int i = 0; i < bytes.Length; i ++)
		{
			bytes[i] = (byte)(bytes[i] ^ bKeys[i % bKeys.Length]);
		}
	}
	
	public static void decrypt(byte[] bytes, string key)
	{
		//检查bytes的结尾是否与key一致
		encrypt(bytes, key);
	}
}