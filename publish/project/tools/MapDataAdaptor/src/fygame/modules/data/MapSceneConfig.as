package fygame.modules.data
{
	import flash.geom.Point;
	
	import fygame.assert;
	import fygame.math.FyPoint;
	import fygame.modules.scene.struct.EffectInfo;
	import fygame.modules.scene.struct.GateInfo;
	import fygame.modules.scene.struct.NPCInfo;
	import fygame.modules.scene.struct.RegionInfo;
	import fygame.modules.scene.struct.ShadeInfo;

	/**
	 * 地图bin数据
	 * @author fygame
	 * 
	 */	
	public class MapSceneConfig
	{
		public var sceneID: int;
		
		/**
		 * 当前地图寻路格子的宽度 
		 */		
		public var tileWidth:int = 20;
		
		/**
		 * 当前地图寻路格子的高度 
		 */		
		public var tileHeight:int = 20;
		
		/**
		 * 当前地图地图切片的大小，宽度和高度都是300 
		 */		
		public var blockSize:int = 256;
		
		/**
		 * 当前地图地图纵向切片的数目 
		 */		
		public var blockCountV:int;
		
		/**
		 *  当前地图地图横向切片的数目 
		 */		
		public var blockCountH:int;
		
		/**
		 * 当前地图地图高度 
		 */		
		public var curMapHeight:int;
		
		/**
		 * 当前地图地图宽度 
		 */		
		public var curMapWidth:int;
		
		/**
		 * 遮挡数组配置 
		 */		
		public var shadeInfos: Vector.<ShadeInfo>;
		
		/**
		 * 特效的配置数组 
		 */		
		public var effectInfos: Vector.<EffectInfo>;
		
		/**
		 * 传送点配置数组 
		 */		
		public var gateInfos: Vector.<GateInfo>;
		
		/**
		 * npc配置数组 
		 */		
		public var npcInfos: Vector.<NPCInfo>;
		
		/**
		 * 复活点信息 
		 */		
		public var revivalPos: Point;
		
		/**
		 * 区域信息配置 
		 */		
		public var regionInfos: Vector.<RegionInfo>;
		
		/**
		 * 场景音效 
		 */		
		public var musicPath: String;
		
		/**
		 * 寻路数组 
		 */
		public var pathArray: Vector.<Vector.<int>>;
        /**
         * 遮挡点数据  
         */        
        public var transparentInfo:Vector.<Vector.<int>>;
        /**
         *安全区数据  
         */        
        public var safetyArea:Vector.<Vector.<int>>;
        /**
         * 地图中心点坐标 x
         */        
        public var pivotX: Number = 0.0;
        /**
         * 地图中心点坐标y 
         */        
        public var pivotY: Number = 0.0;
		
		/**
		 * 构造函数 
		 * 
		 */		
		public function MapSceneConfig()
		{
			shadeInfos = new Vector.<ShadeInfo>();
			regionInfos = new Vector.<RegionInfo>();
			gateInfos = new Vector.<GateInfo>();
			npcInfos = new Vector.<NPCInfo>();
			effectInfos = new Vector.<EffectInfo>();
			pathArray = new Vector.<Vector.<int>>();
            transparentInfo = new Vector.<Vector.<int>>();
            safetyArea = new Vector.<Vector.<int>>();
		}
		
		/**
		 * 更新数据 
		 * @param data
		 * 
		 */		
		public function updateData(data: MapSceneConfig): void
		{
			this.blockCountH = Math.ceil(data.curMapWidth / 256);
			this.blockCountV = Math.ceil(data.curMapHeight / 256);
			this.blockSize = 256//;data.blockSize;
			this.curMapHeight = data.curMapHeight;
			this.curMapWidth = data.curMapWidth;
			this.musicPath = data.musicPath;
			this.tileHeight = data.tileHeight;
			this.tileWidth = data.tileWidth;
			this.revivalPos = data.revivalPos;
			
            this.pivotX = this.curMapWidth / 2;
            this.pivotY = this.curMapHeight / 2;
            
			_copyArray(data.effectInfos, this.effectInfos);
			_copyArray(data.gateInfos, this.gateInfos);
			_copyArray(data.regionInfos, this.regionInfos);
			_copyArray(data.npcInfos, this.npcInfos);
            _copyArray(data.transparentInfo, this.transparentInfo);
            _copyArray(data.safetyArea, this.safetyArea);
			_copyPathData(data.pathArray, this.pathArray);
		}
		
		/**
		 * 拷贝寻路数据 
		 * @param src
		 * @param dest
		 * 
		 */		
		private function _copyPathData(src: Vector.<Vector.<int>>, dest: Vector.<Vector.<int>>): void
		{
			CONFIG::debug
			{
				assert(src != null && dest != null, "数组不能为空");
			}
			clearPath();
			
			var len1: int = src.length;
			var len2: int = 0;
			for (var i: int = 0; i < len1; ++i)
			{
				dest[i] = new Vector.<int>();
				len2 = src[i].length;
				for (var j: int = 0; j < len2; ++j)
				{
					dest[i].push(src[i][j]);
				}
			}
		}
		
		/**
		 * 拷贝数组 
		 * @param src
		 * @param dest
		 * 
		 */		
		private function _copyArray(src: *, dest: *): void
		{
			CONFIG::debug
			{
				assert(src != null && dest != null, "数组不能为空");
			}
			dest.length = 0;
			var len: int = src.length;
			for (var i: int = 0; i < len; ++i)
			{
				dest.push(src[i]);
			}
		}
		
		/**
		 * 清除路径数组 
		 * 
		 */		
		public function clearPath(): void
		{
			CONFIG::debug
			{
				assert(pathArray != null, "不能为空");
			}
			var len1: int = pathArray.length;
			for (var i: int = 0; i < len1; ++i)
			{
				if (pathArray[i] != null)
				{
                    pathArray[i].fixed = false;
					pathArray[i].length = 0;
					pathArray[i] = null;
				}
			}
			pathArray.length = 0;
		}
		
		/**
		 * 根据传送点ID获取传送点信息。
		 * @param id 传送点ID。
		 * @return 
		 * 
		 */		
		public function getGateInfoByID(id: int) : GateInfo
		{
			for each(var gateInfo: GateInfo in gateInfos)
			{
				if(id == gateInfo.gateID)
				{
					return gateInfo;
				}
			}
			
			return null;
		}
        
        /**
         * 获取是否透明 
         * @param x
         * @param y
         * @return 
         * 
         */        
        public function getIsTransparent(pos: FyPoint):Boolean
        {
            var x: int = int(pos.x/20);
            var y: int = int(pos.y/20);
            
            if (x < 0 || y < 0)
                return false;
            
            if(y >= transparentInfo.length)
                return false;
            
            if(x >= transparentInfo[y].length)
                return false;
            
            return transparentInfo[y][x] == 1;
        }
        
        /**
         * 是否在安全区 
         * @param pos
         * @return 
         * 
         */        
        public function getIsSafe(pos: FyPoint): Boolean
        {
            if(safetyArea == null)
                return false;
            
            var len: int = safetyArea.length;
            
            if(len == 0)
                return false;
            
            var x: int = int(pos.x/20);
            var y: int = int(pos.y/20);
            
            if (x < 0 || y < 0)
                return false;
            
            if(y >= len)
                return false;
            
            if(x >= safetyArea[y].length)
                return false;
            
            return safetyArea[y][x] == 1;
        }

	}
}