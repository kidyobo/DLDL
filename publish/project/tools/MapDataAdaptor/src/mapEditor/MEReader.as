package mapEditor
{
	import flash.utils.ByteArray;
	import flash.utils.Endian;

	/**
	 * 地编解析。
	 * @author teppei
	 * 
	 */	
	public class MEReader
	{
		public function MEReader()
		{
		}
		
		public function parse(ba: ByteArray): MapInfo
		{
			var i: int;
			var mapInfo: MapInfo = new MapInfo();
			mapInfo.oldData = ba;
			
			ba.endian = Endian.LITTLE_ENDIAN;
			ba.position = 0;
			mapInfo.ver =  ba.readByte();//版本号
			
			mapInfo.sceneID = ba.readInt();//sceneID
			
			// 场景名字
			mapInfo.sceneName = ba.readUTF();
			
			//是否有音乐
			mapInfo.hasMusic = ba.readByte() == 0 ? false : true;
			mapInfo.musicPath = mapInfo.hasMusic ? ba.readUTF() : "";
			
			//地图宽度,高度
			mapInfo.mapWidth = ba.readShort();
			mapInfo.mapHeight = ba.readShort();
			
			//地图切片的宽度和高度
			mapInfo.blockWidth = ba.readShort();
			mapInfo.blockHeight = ba.readShort();
		
			//寻路格子的宽度和高度
			mapInfo.tileWidth = ba.readShort();
			mapInfo.tileHeight = ba.readShort();
			
			//寻路数组的长度,寻路数组应该是个二维数组，这个是纵向的个数，就表示有多少行
			mapInfo.tileCount = Math.ceil(mapInfo.mapWidth / mapInfo.tileWidth);
			mapInfo.rowCount = Math.ceil(mapInfo.mapHeight / mapInfo.tileHeight);
			
			mapInfo.pathLength = ba.readInt();//这个数据是数组所有的个数tileCount*rowCount
			mapInfo.pathArray = new Vector.<Vector.<int>>();
			// 寻路数组
			HaxeHelper.selectShareMem(ba);
			mapInfo.pathArray = HaxeHelper.getByteArray(ba, mapInfo.rowCount, mapInfo.tileCount, mapInfo.pathArray, ba.position, 0);
			
			ba.position += mapInfo.rowCount*mapInfo.tileCount;
			
			// 遮挡数据，已废弃
			var shadowCount: int = ba.readShort();
			for (i = 0; i < shadowCount; ++i)
			{
				ba.readShort();
				ba.readShort();
				ba.readShort();
				ba.readShort();
				ba.readUTF();
			}
			
			// 特效数据，已废弃
			var effectCount: int = ba.readShort();
			for (i = 0; i < effectCount; ++i)
			{
				ba.readByte();	
				ba.readShort();
				ba.readShort();
				ba.readShort();
				ba.readShort();
				ba.readUTF();
			}
			
			// 传送点个数
			var gateCount: int = ba.readShort();
			//传送点配置数组
			mapInfo.gateInfos = new Vector.<GateInfo>();
			var tempGate: GateInfo = null;
			for (i = 0; i < gateCount; ++i)
			{
				tempGate = new GateInfo(ba.readShort(),
					ba.readShort(),
					ba.readInt(),
					ba.readUTF(),
					ba.readInt(),
					ba.readShort(),
					ba.readShort(),
					ba.readByte());
				mapInfo.gateInfos.push(tempGate);
			}
			
			//NPC个数
			var npcCount: int = ba.readShort();
			//npc配置数组
			mapInfo.npcInfos = new Vector.<NPCInfo>();
			var tempNpcInfo: NPCInfo = null;
			for (i = 0; i < npcCount; ++i)
			{
				tempNpcInfo = new NPCInfo(mapInfo.sceneID,
					ba.readShort(),	
					ba.readShort(),
					ba.readInt(),
					ba.readInt());
				mapInfo.npcInfos.push(tempNpcInfo);
			}
			
			// 场景复活点，废弃
			ba.readShort();
			ba.readShort();
			
			// 区域信息，废弃
			var regionCount: int = ba.readShort();
			for (i = 0; i < regionCount; ++i)
			{
				ba.readInt();
				ba.readByte();
				ba.readShort();	
				ba.readShort();
				ba.readShort();
				ba.readShort();
				
				if (mapInfo.ver >= 2)
				{
					ba.readUTF();
				}
			}
			
			//遮挡个数
			//遮挡数组
			var transparentArray:Vector.<Vector.<int>> = mapInfo.transparentArray;
			if(transparentArray == null)
			{
				mapInfo.transparentArray = transparentArray = new Vector.<Vector.<int>>();
			}
			else
			{
				transparentArray.length = 0;
			}
			
			transparentArray = HaxeHelper.getByteArray(ba, mapInfo.rowCount, mapInfo.tileCount, transparentArray, ba.position);
			
			ba.position += mapInfo.rowCount*mapInfo.tileCount;
			
			var hasSafetyData: Boolean;
			
			// 版本号为2以后的版本，在安全区数据前加了标记位
			if(mapInfo.ver <= 2)
			{
				hasSafetyData = true;
			}
			else
			{
				hasSafetyData = Boolean(ba.readByte());
			}
			
			//安全区
			if(hasSafetyData && ba.bytesAvailable > 0)
			{
				var safetyArea:Vector.<Vector.<int>> = mapInfo.safetyArea;
				if(safetyArea == null)
				{
					mapInfo.safetyArea = safetyArea = new Vector.<Vector.<int>>();
				}
				else
				{
					safetyArea.length = 0;
				}
				
				safetyArea = HaxeHelper.getByteArray(ba, mapInfo.rowCount, mapInfo.tileCount, safetyArea, ba.position);
				
				ba.position += mapInfo.rowCount*mapInfo.tileCount;
			}
			else
			{
				if(mapInfo.safetyArea != null)
				{
					mapInfo.safetyArea.length = 0;
				}
			}
			
			// 以下为3版本后的数据内容
			if(mapInfo.ver > 2)
			{
				var hasTerrainData: Boolean = Boolean(ba.readByte());
				
				// 地形数据，比如可行走区域的水面信息
				if(hasTerrainData && ba.bytesAvailable > 0)
				{
					var terrain:Vector.<Vector.<int>> = mapInfo.terrainData;
					if(terrain == null)
					{
						mapInfo.terrainData = terrain = new Vector.<Vector.<int>>();
					}
					else
					{
						terrain.length = 0;
					}
					
					terrain = HaxeHelper.getByteArray(ba, mapInfo.rowCount, mapInfo.tileCount, terrain, ba.position, 0, false);
					
					ba.position += mapInfo.rowCount*mapInfo.tileCount;
				}
				else
				{
					if(mapInfo.terrainData != null)
					{
						mapInfo.terrainData.length = 0;
					}
				}
			}
			
			HaxeHelper.selectShareMem(null);
			
			
			return mapInfo;
		}
	}
}