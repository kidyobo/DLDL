package mapEditor
{
	import flash.utils.ByteArray;

	public final class MapInfo
	{
		public var ver: int;
		
		public var sceneID: int;
		// 场景名字
		public var sceneName: String;
		
		//是否有音乐
		public var hasMusic: Boolean;
		public var musicPath: String;
		
		//地图宽度,高度
		public var mapWidth: uint;
		public var mapHeight: uint;
		
		//地图切片的宽度和高度
		public var blockWidth: uint;
		public var blockHeight: uint;
		
		//寻路格子的宽度和高度
		public var tileWidth: uint;
		public var tileHeight: uint;
		
		//寻路数组的长度,寻路数组应该是个二维数组，这个是纵向的个数，就表示有多少行
		public var tileCount: int;
		public var rowCount: int;
		
		public var pathLength: int;//这个数据是数组所有的个数tileCount*rowCount
		public var pathArray: Vector.<Vector.<int>>;
		
		public var gateInfos: Vector.<GateInfo>;
		
		public var npcInfos: Vector.<NPCInfo>;
		
		public var transparentArray: Vector.<Vector.<int>>;
		
		public var safetyArea: Vector.<Vector.<int>>;
		
		public var terrainData: Vector.<Vector.<int>>;
		
		
		public var oldData: ByteArray;
		
		public function dispose(): void
		{
			pathArray = null;
			gateInfos = null;
			npcInfos = null;
			transparentArray = null;
			safetyArea = null;
			terrainData = null;
			oldData = null;
		}
	}
}