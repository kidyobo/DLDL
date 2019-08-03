package fygame.modules.data
{
	import fygame.modules.net.FyProtocol.UnitPosition;
	import fygame.modules.scene.utils.scenePath.CScenePath;

	public class AstarManager
	{
		public static const MAX_POSITION_NUMBER_IN_PATH: int = 40;
		
		private var m_curScenePath: CScenePath;
		
		/**
		 * 寻路相关的实现 
		 * 
		 */		
		public function AstarManager()
		{
			m_curScenePath = new CScenePath();
		}
		
		/**
		 * 离开场景的时候重置数据 
		 * 
		 */		
		public function reset(): void
		{
			if (m_curScenePath != null)
			{
				m_curScenePath.reset();
			}
		}
		
		/**
		 * 
		 * @param sceneID
		 * @param pathArray
		 * 
		 */		
		public function addPathData(pathArray: Vector.<Vector.<int>>): void
		{
			if (pathArray == null || pathArray.length == 0)
			{
				return;
			}

			m_curScenePath.updateScenePath(pathArray);
		}
		
		public function deepMergeBlocks(onComplete: Function) : void
		{
			m_curScenePath.deepMergeBlocks(onComplete);
		}
		
		/**
		 * 判断两间是否有阻挡
		 * @param sceneID
		 * @param startPosition
		 * @param endPosition
		 * @return 
		 * 
		 */		
		public function isTwoPointBlock(sceneID: int, startPositionX: int, startPositionY: int, endPositionX: int, endPositionY: int): Boolean
		{
			var astar: CScenePath = getAstar();
			if (astar == null)
			{
				return false;
			}
			return !astar.canWalk(startPositionX, startPositionY, endPositionX, endPositionY);
		}
		
		/**
		 * 取得寻路结果
		 * @param sceneID
		 * @param startPos
		 * @param targetPos
		 * @param useNewData 是否使用新创建的寻路集合数据，
		 * 										当是flase时，使用CScenePath中的g_astTempPosition的引用
		 * @return 
		 * 
		 */
		public function findPath(sceneID: int,
								 startPosX: int, startPosY: int, 
								 targetPosX: int, targetPosY: int,
								 useNewData :Boolean = false) : Vector.<UnitPosition>
		{
			var astar: CScenePath = getAstar();
			if (astar == null)
			{
				return null;
			}
			
			var pos1: UnitPosition = new UnitPosition();
			pos1.m_uiX = startPosX;
			pos1.m_uiY = startPosY;
			var pos2: UnitPosition = new UnitPosition();
			pos2.m_uiX = targetPosX;
			pos2.m_uiY = targetPosY;
			
			var result: Vector.<UnitPosition> = astar.findPath(pos1, pos2, useNewData);
			if (result != null && result.length > MAX_POSITION_NUMBER_IN_PATH)//大于等于29的话就取前面的，后面的过滤
			{
				result = result.slice(0, MAX_POSITION_NUMBER_IN_PATH - 1);
			}
			
			return result;
		}
		
		/**
		 * 判断某个场景的某个点的位置是否是合法的，也就是是否是阻挡点 
		 * @param sceneID
		 * @param pos
		 * @return 
		 * 
		 */		
		public function isValidGrid(sceneID: int, posX: int, posY: int):Boolean
		{
			var astar: CScenePath = getAstar();
			if (astar == null)
			{
				return false;
			}
			
			var x:int = int(posX / CScenePath.MIN_SCENE_BLOCK_SIZE);
			var y:int = int(posY / CScenePath.MIN_SCENE_BLOCK_SIZE);
			
			if(astar)
			{
				return astar.isValidXYGrid(x,y);
			}
			
			return false;
		}
		
		public function getAstar(): CScenePath
		{
			return m_curScenePath;
		}
	}
}