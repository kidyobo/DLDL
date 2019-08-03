package util
{
	import data.InternalTypeInfo;
	
	import flash.utils.Dictionary;

	/**
	 * 关于变量的一些定义 
	 * @author jacksonqian
	 * 
	 */	
	public class VariableInfoUtil
	{
		private static var m_instance: VariableInfoUtil;
		
		/**
		 * tdr定义的类型对应的as自定义类型
		 */		
		private var m_tdr2AsTypeMap: Dictionary;
		
		/**
		 * 编码对应的操作
		 */		
		private var m_typeEncodeMap: Dictionary;
		
		/**
		 * 解码操作的类型
		 */		
		private var m_typeDecodeMap: Dictionary;
		
		/**
		 * 构造函数 
		 * @param enforcer
		 * 
		 */		
		public function VariableInfoUtil(enforcer: SingletonEnforcer)
		{
			m_tdr2AsTypeMap = new Dictionary();
			m_tdr2AsTypeMap["bigint"] = new InternalTypeInfo("longlong", "");
			m_tdr2AsTypeMap["Bigint"] = new InternalTypeInfo("longlong", "");
			m_tdr2AsTypeMap["longlong"] = new InternalTypeInfo("longlong", "");
			m_tdr2AsTypeMap["biguint"] = new InternalTypeInfo("ulonglong", "");
			m_tdr2AsTypeMap["Biguint"] = new InternalTypeInfo("ulonglong", "");
			m_tdr2AsTypeMap["ulonglong"] = new InternalTypeInfo("ulonglong", "");
			m_tdr2AsTypeMap["byte"] = new InternalTypeInfo("uint", "1");
			m_tdr2AsTypeMap["char"] = new InternalTypeInfo("int", "1");		
			m_tdr2AsTypeMap["Double"] = new InternalTypeInfo("Number", "4");//todo 还未验证
			m_tdr2AsTypeMap["Float"] = new InternalTypeInfo("Number", "4");
			m_tdr2AsTypeMap["float"] = new InternalTypeInfo("Number", "4");
			m_tdr2AsTypeMap["Int32"] = new InternalTypeInfo("int", "4");
			m_tdr2AsTypeMap["Uint32"] = new InternalTypeInfo("int", "4");
			m_tdr2AsTypeMap["Int16"] = new InternalTypeInfo("int", "2");
			m_tdr2AsTypeMap["Uint16"] = new InternalTypeInfo("int", "2");
			m_tdr2AsTypeMap["Int8"] = new InternalTypeInfo("int", "1");
			m_tdr2AsTypeMap["Uint8"] = new InternalTypeInfo("int", "1");
			m_tdr2AsTypeMap["uchar"] = new InternalTypeInfo("uint", "1");
			m_tdr2AsTypeMap["ushort"] = new InternalTypeInfo("uint", "2");
			m_tdr2AsTypeMap["short"] = new InternalTypeInfo("int", "2");
			m_tdr2AsTypeMap["int"] = new InternalTypeInfo("int", "4");
			m_tdr2AsTypeMap["uint"] = new InternalTypeInfo("uint", "4");
			m_tdr2AsTypeMap["Smallint"] = new InternalTypeInfo("int", "4");
			m_tdr2AsTypeMap["smallint"] = new InternalTypeInfo("int", "4");
			m_tdr2AsTypeMap["Smalluint"] = new InternalTypeInfo("int", "4");
			m_tdr2AsTypeMap["smalluint"] = new InternalTypeInfo("int", "4");
			m_tdr2AsTypeMap["Tinyuint"] = new InternalTypeInfo("int", "1");
			m_tdr2AsTypeMap["Tinyint"] = new InternalTypeInfo("int", "1");
			m_tdr2AsTypeMap["String"] = new InternalTypeInfo( "String", "");
			m_tdr2AsTypeMap["string"] = new InternalTypeInfo("String", "");
			
			
			m_typeEncodeMap = new Dictionary();		
			m_typeEncodeMap["byte"] = "writeByte";
			m_typeEncodeMap["char"] = "writeByte";			
			m_typeEncodeMap["Double"] = "writeFloat";
			m_typeEncodeMap["Float"] = "writeFloat";
			m_typeEncodeMap["float"] = "writeFloat";
			m_typeEncodeMap["Int32"] = "writeInt";
			m_typeEncodeMap["Uint32"] = "writeUnsignedInt";
			m_typeEncodeMap["Int16"] = "writeShort";
			m_typeEncodeMap["Uint16"] = "writeShort";
			m_typeEncodeMap["Int8"] = "writeByte";
			m_typeEncodeMap["Uint8"] = "writeByte";
			m_typeEncodeMap["uchar"] = "writeByte";
			m_typeEncodeMap["ushort"] = "writeShort";
			m_typeEncodeMap["short"] = "writeShort";
			m_typeEncodeMap["int"] = "writeInt";
			m_typeEncodeMap["uint"] = "writeUnsignedInt";
			m_typeEncodeMap["Smallint"] = "writeShort";
			m_typeEncodeMap["smallint"] = "writeShort";
			m_typeEncodeMap["Smalluint"] = "writeShort";
			m_typeEncodeMap["smalluint"] = "writeShort";
			m_typeEncodeMap["Tinyuint"] = "writeByte";
			m_typeEncodeMap["Tinyint"] = "writeByte";
			
			
			m_typeDecodeMap = new Dictionary();
			m_typeDecodeMap["byte"] = "readUnsignedByte";
			m_typeDecodeMap["char"] = "readByte";			
			m_typeDecodeMap["Double"] = "readFloat";
			m_typeDecodeMap["Float"] = "readFloat";
			m_typeDecodeMap["float"] = "readFloat";
			m_typeDecodeMap["Int32"] = "readInt";
			m_typeDecodeMap["Uint32"] = "readUnsignedInt";
			m_typeDecodeMap["Int16"] = "readShort";
			m_typeDecodeMap["Uint16"] = "readUnsignedShort";
			m_typeDecodeMap["Int8"] = "readByte";
			m_typeDecodeMap["Uint8"] = "readUnsignedByte";
			m_typeDecodeMap["uchar"] = "readUnsignedByte";
			m_typeDecodeMap["ushort"] = "readUnsignedShort";
			m_typeDecodeMap["short"] = "readShort";
			m_typeDecodeMap["int"] = "readInt";
			m_typeDecodeMap["uint"] = "readUnsignedInt";
			m_typeDecodeMap["Smallint"] = "readShort";
			m_typeDecodeMap["smallint"] = "readShort";
			m_typeDecodeMap["Smalluint"] = "readUnsignedShort";
			m_typeDecodeMap["smalluint"] = "readUnsignedShort";
			m_typeDecodeMap["Tinyuint"] = "readUnsignedByte";
			m_typeDecodeMap["Tinyint"] = "readByte";
		}
		
		/**
		 * 判断是否是字符串类型 
		 * @param tdrType
		 * @return 
		 * 
		 */		
		public function isStringType(tdrType: String): Boolean
		{
			var info: InternalTypeInfo = m_tdr2AsTypeMap[tdrType] as InternalTypeInfo;
			
			if (info != null)
			{
				return info.type.toLocaleLowerCase() == "string";
			}
			return false;
		}
		
		/**
		 * 判断是不是大整数类型
		 * @param tdrType
		 * @return 
		 * 
		 */		
		public function isBigIntType(tdrType: String): Boolean
		{
			var info: InternalTypeInfo = m_tdr2AsTypeMap[tdrType] as InternalTypeInfo;
			
			if (info != null)
			{
				var type: String = info.type.toLocaleLowerCase();
				return type == "bigint" ||
					type == "biguint" ||
					type == "ulonglong" ||
					type == "longlong";
			}
			return false;
		}
		
		public function isulonglongType(tdrType: String): Boolean
		{
			var info: InternalTypeInfo = m_tdr2AsTypeMap[tdrType] as InternalTypeInfo;
			
			if (info != null)
			{
				var type: String = info.type.toLocaleLowerCase();
				return type == "biguint" ||
					type == "ulonglong";
			}
			return false;
		}
		
		public function islonglongType(tdrType: String): Boolean
		{
			var info: InternalTypeInfo = m_tdr2AsTypeMap[tdrType] as InternalTypeInfo;
			
			if (info != null)
			{
				var type: String = info.type.toLocaleLowerCase();
				return type == "bigint" ||
					type == "longlong";
			}
			return false;
		}
		
		/**
		 * 取得as的内置类型 
		 * @param tdrType
		 * @return 
		 * 
		 */		
		public function getASType(tdrType: String): String
		{
			var info: InternalTypeInfo = InternalTypeInfo(m_tdr2AsTypeMap[tdrType]);
			
			if (info != null)
			{
				return info.type;
			}
			return null;
		}
		
		public function getTypeByteCount(tdrType: String): String
		{
			var info: InternalTypeInfo = InternalTypeInfo(m_tdr2AsTypeMap[tdrType]);
			
			if (info != null)
			{
				return info.byteCount;
			}
			return null;
		}
		
		/**
		 * 根据tdr类型判断是不是as的内置类型 
		 * @param tdrType
		 * @return 
		 * 
		 */		
		public function isDefaultType(tdrType: String): Boolean
		{
			return (m_tdr2AsTypeMap[tdrType] != null);
		}
		
		/**
		 * 根据tdr的类型取得一些默认的内置操作 
		 * @param tdrType
		 * @return 
		 * 
		 */		
		public function getDefaultEncodeOper(tdrType: String): String
		{
			var result: String = m_typeEncodeMap[tdrType];
			return result;
		}
		
		/**
		 * 根据tdr类型判断是否是默认的encode操作，不是的话，需要继续生成相应的encode函数 
		 * @param tdrType
		 * @return 
		 * 
		 */		
		public function isDefaultEncodeOper(tdrType: String): Boolean
		{
			if (m_typeEncodeMap[tdrType] != null ||
				VariableInfoUtil.instatce.isBigIntType(tdrType) ||
				VariableInfoUtil.instatce.isStringType(tdrType))
			{
				return true;
			}
			
			return false;
		}
		
		/**
		 * 根据tdr的类型取得as类型的默认操作 
		 * @param tdrType
		 * @return 
		 * 
		 */		
		public function getDefaultDecodeOper(tdrType: String): String
		{
			var result: String = m_typeDecodeMap[tdrType];
			return result;
		}
		
		/**
		 * 根据tdr类型判断是否是as内置的默认decode操作 
		 * @param tdrType
		 * @return 
		 * 
		 */		
		public function isDefaultDecodeOper(tdrType: String): Boolean
		{
			if (m_typeDecodeMap[tdrType] != null ||
				VariableInfoUtil.instatce.isBigIntType(tdrType) ||
				VariableInfoUtil.instatce.isStringType(tdrType))
			{
				return true;
			}
			
			return false;
		}
		
		/**
		 * 取得单例对象的引用 
		 * @return 
		 * 
		 */		
		public static function get instatce(): VariableInfoUtil
		{
			if (m_instance == null)
			{
				m_instance = new VariableInfoUtil(new SingletonEnforcer());
			}
			return m_instance;
		}
	}
}

class SingletonEnforcer{}