package data
{
	import flash.utils.Dictionary;

	public class FileCacheData
	{
		/**
		 * [变量名字，macro结构体] 
		 */		
		public var macroMap: Dictionary;
		
		/**
		 * [结构体名字，结构体相关数据(数组)] 
		 */		
		public var structMap: Dictionary;
		
		/**
		 *  协议body的名字集合
		 */		
		public var protocolList: Vector.<String>;
		
		/**
		 * [msgID, msgBody Name] 
		 */		
		public var msgBodyMap: Dictionary;
		
		/**
		 * 需要encode的结构体列表 
		 */		
		public var encodeList: Vector.<EnumProtocolInfo>;
		
		/**
		 * 需要decode的列表 
		 */		
		public var decodeList: Vector.<EnumProtocolInfo>;
		
		/**
		 * [结构体名字， true/false]表示是否已经生成过对应的结构体  编码  函数
		 */		
		public var encodeGeneratorMap: Dictionary;
		
		/**
		 * [结构体名字， true/false]表示是否已经生成过对应的结构体   解码  函数
		 */	
		public var decodeGeneratorMap: Dictionary;
		
		/**
		 * 需要生成new文件的结构名字。
		 */		
		public var newStructureList: Vector.<String>;
		
		/**
		 * 构造函数 
		 * 
		 */		
		public function FileCacheData()
		{
			macroMap = new Dictionary();
			structMap = new Dictionary();
			protocolList = new Vector.<String>();
			msgBodyMap = new Dictionary();
			
			encodeGeneratorMap = new Dictionary();
			decodeGeneratorMap = new Dictionary();
			
			encodeList = new Vector.<EnumProtocolInfo>();
			decodeList = new Vector.<EnumProtocolInfo>();
			
			newStructureList = new Vector.<String>();
		}
		
		public function resetMaps() : void
		{
			encodeGeneratorMap = new Dictionary();
			decodeGeneratorMap = new Dictionary();
		}
	}
}