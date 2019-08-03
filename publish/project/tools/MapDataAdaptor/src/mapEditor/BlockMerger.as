package mapEditor
{
	import flash.filesystem.File;
	import flash.utils.ByteArray;
	
	import fygame.modules.data.AstarManager;
	import fygame.modules.scene.utils.scenePath.TSceneBlock;

	/**
	 * 地图块合并工具。
	 * @author teppei
	 * 
	 */	
	public final class BlockMerger
	{
		private var main: MapDataAdaptor;
		
		/**
		 * 地编解析器。
		 */		
		private var m_reader: MEReader;
		
		private var m_files: Vector.<File>;
		
		private var m_datas: Vector.<ByteArray>;
		
		private var m_mapInfos: Vector.<MapInfo>;
		
		private var m_astar: AstarManager;
		
		private var m_crtMergeIdx: int;
		
		public function BlockMerger(main: MapDataAdaptor)
		{
			this.main = main;
			m_reader = new MEReader();
			m_astar = new AstarManager();
			m_mapInfos = new Vector.<MapInfo>();
		}
		
		public function begin(files: Vector.<File>, datas: Vector.<ByteArray>) : void
		{
			m_files = files;
			m_datas = datas;
			
			var len: int = m_files.length;
			m_mapInfos.length = len;
			
			m_crtMergeIdx = 0;
			_mergeNext();
		}
		
		private function _mergeNext():void
		{
			if(m_crtMergeIdx >= 0 && m_crtMergeIdx < m_files.length)
			{
				var info: MapInfo;
				var file: File = m_files[m_crtMergeIdx];
				var ba: ByteArray = m_datas[m_crtMergeIdx];
				if(null != ba)
				{
					info = m_reader.parse(ba);
					m_mapInfos[m_crtMergeIdx] = info;
					m_astar.addPathData(info.pathArray);
					main.beforeMerge(m_crtMergeIdx, info);
					m_astar.deepMergeBlocks(_onComplete);
				}
				else
				{
					_afterMergeOne();
				}
			}
		}
		
		private function _onComplete() : void
		{
			var info: MapInfo = m_mapInfos[m_crtMergeIdx];
			var blocks: Vector.<Vector.<TSceneBlock>> = m_astar.getAstar().sceneBlocks;
			// 整理块编码
			var islandIdxMap: Object = {};
			var nextIdx: int = 1, curIslandIdx: int;
			for(var y: int = 0; y < info.rowCount; y++)
			{
				for(var x: int = 0; x < info.tileCount; x++)
				{
					curIslandIdx = blocks[y][x].islandIndex;
					if(curIslandIdx > 0)
					{
						// 合出来的islandIndex不是连续的，而且可能超过127，需要将其映射到连续的
						if(!islandIdxMap.hasOwnProperty(curIslandIdx))
						{
							islandIdxMap[curIslandIdx] = nextIdx++;
						}
						blocks[y][x].islandIndex = islandIdxMap[curIslandIdx];
					}
				}
			}
			
			main.afterMerge(m_crtMergeIdx, info);
			_afterMergeOne();
		}
		
		private function _afterMergeOne(): void
		{
			if(m_crtMergeIdx + 1 < m_files.length)
			{
				m_crtMergeIdx++;
				_mergeNext();
			}
			else
			{
				main.finishAll();
			}
		}
		
		public function getAstar() : AstarManager
		{
			return m_astar;
		}
	}
}