package fygame.modules.scene.utils.scenePath
{
	import flash.geom.Point;
	import flash.utils.setTimeout;
	
	import fygame.assert;
	import fygame.modules.net.FyProtocol.UnitPosition;
	import fygame.utils.UnitPosUtil;
	
	import tools.LogHelper;
	
	/**
	 * 
	 * @author 
	 * 
	 */
	public class CScenePath
	{
		private var anyWalkable: Boolean;
		
		/**
		 * 每行的块数 
		 */		
		private var  m_iWidthBlocks:int;
		
		/**
		 * 地图的行数 
		 */		
		private var  m_iHeightBlocks:int;
		private var  m_iMaxBlockIndex:int;
		
		/**
		 * 一个二维数组，每一个元素TSceneBlock代表某个寻路块
		 */		
		private var m_astSceneBlock:Vector.<Vector.<TSceneBlock>>;
		private var m_stPathMinHeap:CPathMinHeap;
		
		public static const MIN_SCENE_BLOCK_SIZE:int = 20;
		private static const MAX_POSITION_NUMBER_IN_PATH:int = 1000;
		
		private var g_iTempPathNumber:int = 0;
		private static const MAX_TEMP_PATH_NUMBER:int = 1024;
		private var g_astTempPosition:Vector.<UnitPosition>;
		
		private var m_islandIndex: uint = 0;
		
		private var m_leftBlocks: Vector.<int>;
		
		private var m_islandDelegates: Vector.<int>;
		
		private var m_totalCnt: uint;
		
		private var m_leftCnt: uint;
		
		private var m_crtIslandIdx: int;
		
		private var m_scanTimes: int;
		
		private var m_untaggedX: int;
		
		private var m_untaggedY: int;
		
		private var m_mergeMap: Object;
		
		/**
		 * 寻路测试的指针。
		 */		
		private var m_pathMergePtr: int;
		
		private var m_onComplete: Function;
		
		/**
		 * 构造函数
		 * @param acSceneBlock
		 * 
		 */		
		public function CScenePath()
		{
			g_astTempPosition = new Vector.<UnitPosition>(MAX_TEMP_PATH_NUMBER);
			m_stPathMinHeap = new CPathMinHeap();
			m_astSceneBlock = new Vector.<Vector.<TSceneBlock>>();
		}
		
		/**
		 * 重置数据 
		 * 
		 */		
		public function reset(): void
		{
			if (m_stPathMinHeap != null)
			{
				m_stPathMinHeap.reset();
			}
			
			if (g_astTempPosition != null)
			{
				for (var m:int = 0; m < MAX_TEMP_PATH_NUMBER; m++)
				{
					if (g_astTempPosition[m] == null)
					{
						g_astTempPosition[m] = new UnitPosition();
					}
					g_astTempPosition[m].m_uiX = 0;
					g_astTempPosition[m].m_uiY = 0;
				}
			}
		}
		
		public function updateScenePath(acSceneBlock: Vector.<Vector.<int>>): void
		{
			m_iWidthBlocks = acSceneBlock[0].length;
			m_iHeightBlocks = acSceneBlock.length;
			
			m_leftBlocks = new Vector.<int>();
			m_islandDelegates = new Vector.<int>();
			m_mergeMap = {};
			m_totalCnt = m_leftCnt = m_iWidthBlocks * m_iHeightBlocks;
			
			reset();
			
			//初始化地图数据
			m_astSceneBlock.length = m_iHeightBlocks;
			
			var tSceneBlock: TSceneBlock;
			var xVec: Vector.<TSceneBlock>;
			anyWalkable = false;
			for (var x: int = 0; x < m_iHeightBlocks; x++)//逐行遍历
			{
				xVec = m_astSceneBlock[x];
				if(null == xVec)
				{
					m_astSceneBlock[x] = xVec = new Vector.<TSceneBlock>(m_iWidthBlocks);
				}
				else
				{
					xVec.length = m_iWidthBlocks;
				}
				
				for (var y: int = 0; y < m_iWidthBlocks; y++)
				{
					tSceneBlock = xVec[y];
					if(null == tSceneBlock)
					{
						xVec[y] = tSceneBlock = new TSceneBlock();
					}
					else
					{
						tSceneBlock.reset();
					}
					
					tSceneBlock.iWalkable = acSceneBlock[x][y];
					tSceneBlock.iBlockIndex = 0;  
					tSceneBlock.iFirstBlock = x * m_iWidthBlocks + y;
					if(tSceneBlock.iWalkable)
					{
						// 可行走
						tSceneBlock.islandIndex = -1;
						anyWalkable = true;
					}
					else
					{
						// 阻挡
						tSceneBlock.islandIndex = 0;
						m_leftCnt--;
					}
					tSceneBlock.x = y;
					tSceneBlock.y = x;
				}
			}
			
			m_iMaxBlockIndex = 0;
			_mergeSceneBlock();
		}
		
		public function deepMergeBlocks(onComplete: Function) : void
		{
			m_onComplete = onComplete;
			
			if(anyWalkable)
			{
				// 深度合并块
				_deepMergeBlocks();
			}
			else
			{
				// 全部都是阻挡
				_processFinish();
			}
			
		}
		
		public function finalize():void
		{
			m_astSceneBlock = null;
			m_stPathMinHeap.finalize();
			m_stPathMinHeap = null;
		}
		
		/**
		 * 判断某个位置是否合法可行走 
		 * @param pos x y分别是块索引
		 * @return 
		 * 
		 */		
		public function isValidGrid(posX: int, posY: int):Boolean
		{
			if (posX < 0 || posY < 0)
				return false;
			
			if(posY >= m_astSceneBlock.length)
				return false;
			
			if(posX >= m_astSceneBlock[posY].length)
				return false;
			
			return m_astSceneBlock[posY][posX].iWalkable == 1;
		}
		
		/**
		 * 判断某个位置是否合法可行走  
		 * @param x
		 * @param y
		 * @return 
		 * 
		 */		
		public function isValidXYGrid(x: int,y: int): Boolean
		{
			if (x < 0 || y < 0)
				return false;
			
			if(y >= m_astSceneBlock.length)
				return false;
			
			if(x >= m_astSceneBlock[y].length)
				return false;
			
			return m_astSceneBlock[y][x].iWalkable == 1;
		}
		
		/**
		 * 寻找从开始点走向目标点最合适的一点 
		 * @param startPos
		 * @param endPos
		 * @param checkBlock 是否需要检查结果点与起始点直接是否有间隔。如果输入的目标点位于“孤岛”（四周
		 * 被阻挡环绕闭包起来的区域）中，则需要设置为true，但这样会提高计算的繁杂性。需要在使用时推敲是否
		 * 需要检查。通常地图中不会有这样的“孤岛”存在，因此可设置为false。使用跳跃技能时不能跨越阻挡，因此
		 * 必须传递true。
		 * @return 
		 * 
		 */		
		public function searchValidGrid(startPos:UnitPosition, endPos:UnitPosition, checkBlock: Boolean = false):UnitPosition
		{
			// 始终跟原始起点进行阻挡校验 @teppei 2013/12/13
			var tmpPos:UnitPosition = _searchGrid(startPos, endPos, checkBlock ? startPos : null);
			
			if(tmpPos.m_uiX == startPos.m_uiX && tmpPos.m_uiY == startPos.m_uiY)
			{
				return null;
			}
			else
			{
				return tmpPos;
			}
		}
		
		/**
		 * 根据开始点以及目标点找到一个走向目标点的最合适的一个点
		 * 有时候目标点是无效的，需要走到与目标点相比最合适的的那一点
		 * @param startPos
		 * @param endPos
		 * @param checkBlockPos 用来校验阻挡的起点，必须始终跟原始起点进行校验，否则由于斜率计算可能导致累加错误。
		 * @return 
		 * 
		 */		
		private function _searchGrid(startPos:UnitPosition, endPos:UnitPosition, checkBlockPos: UnitPosition = null):UnitPosition
		{
			var sPos: UnitPosition = startPos;
			var ePos: UnitPosition = endPos;
			var tempPos: UnitPosition;
			var temp_x: int;
			var temp_y: int;
			
			//有效:出口1，如果目标点是有效的就直接可以走到目标点那边
			if(isValidGrid(int(ePos.m_uiX/MIN_SCENE_BLOCK_SIZE), int(endPos.m_uiY/MIN_SCENE_BLOCK_SIZE)) && 
				(null == checkBlockPos || canWalk(checkBlockPos.m_uiX, checkBlockPos.m_uiY, endPos.m_uiX, endPos.m_uiY)))
			{
				return ePos;
			}
			else//无效
			{
				//一旦两点小于20像素，不能到达  出口2
				if(UnitPosUtil.subLength(ePos, sPos) < 20)
				{
					return sPos;
				}
				
				//大于20像素，取中点
				temp_x = int((ePos.m_uiX+sPos.m_uiX)/2 + 0.5);
				temp_y = int((ePos.m_uiY+sPos.m_uiY)/2 + 0.5);
				
				tempPos = UnitPosUtil.toUnitPos(temp_x,temp_y);
				
				//中点有效
				if(isValidGrid(int(tempPos.m_uiX/MIN_SCENE_BLOCK_SIZE), int(tempPos.m_uiY/MIN_SCENE_BLOCK_SIZE)) && 
					(null == checkBlockPos || canWalk(checkBlockPos.m_uiX, checkBlockPos.m_uiY, tempPos.m_uiX, tempPos.m_uiY)))
				{
					sPos = tempPos;
				}
				else//中点无效
				{
					ePos = tempPos;
				}
				return _searchGrid(sPos, ePos, checkBlockPos);
			}
		}
		
		/**
		 * 块融合
		 * 
		 */		
		private function _mergeSceneBlock(): void
		{
			var iMerged:int;
			var iBlockSize:int;
			var iWidthBlocks:int;
			var iHeightBlocks:int;
			var y:int;
			var x:int;
			
			/* 融合的块数，如果结果是0，表示融合过程结束 */
			iMerged = 0;
			
			/* 当前层级下块的大小 */
			m_iMaxBlockIndex++;
			iBlockSize = 1 << m_iMaxBlockIndex;
			
			/* 当前层级下的块数目 */
			iWidthBlocks = m_iWidthBlocks / iBlockSize;
			iHeightBlocks = m_iHeightBlocks / iBlockSize;
			
			for (x = 0; x < iHeightBlocks; x++)
			{
				for (y = 0; y < iWidthBlocks; y++)
				{
					/* 尝试融合一个大块 */
					var iFirstBlockX:int = y * iBlockSize;//真实的块索引x
					var iFirstBlockY:int = x * iBlockSize;
					
					var iFirstBlock:int = iFirstBlockY * m_iWidthBlocks + iFirstBlockX;//从左上角开始的块数
					
					var iBlockWalkable:int = 1;
					var iBlockX:int;
					var iBlockY:int;
					
					for (iBlockY = 0; iBlockY < iBlockSize; iBlockY++)
					{
						for (iBlockX = 0; iBlockX < iBlockSize; iBlockX++)
						{
							iBlockWalkable = m_astSceneBlock[iFirstBlockY + iBlockY][iFirstBlockX + iBlockX].iWalkable;
							if (iBlockWalkable == 0)
							{
								break;
							}
						}
						
						if (iBlockWalkable == 0)
						{
							break;
						}
					}
					
					if (iBlockWalkable == 0)
					{
						continue;
					}
					
					/* 融合所有小块到大块 */
					for (iBlockY = 0; iBlockY < iBlockSize; iBlockY++)
					{
						for (iBlockX = 0; iBlockX < iBlockSize; iBlockX++)
						{
							var block:TSceneBlock = m_astSceneBlock[iFirstBlockY + iBlockY][iFirstBlockX + iBlockX];
							block.iBlockIndex = m_iMaxBlockIndex;
							block.iFirstBlock = iFirstBlock;
						}
					}
					
					iMerged++;
				}
			}
			
			if (iMerged >= 4)
			{
				return _mergeSceneBlock();
			}
			return;
		}
		
		private function _deepMergeBlocks() : void
		{
			LogHelper.updateStatus("地图片：" + m_iWidthBlocks + "×" + m_iHeightBlocks + "；总块数：" + m_totalCnt + "，剩余未标记块：" + m_leftCnt + "(" + (m_leftCnt / m_totalCnt * 100).toFixed(2) + "%)");
			
			// 使用十字标记法
			_mergeByCross();
		}
		
		private function _mergeByCross() : void
		{
			LogHelper.updateStatus("进行十字扫描，正在寻找中心点...");
			
			// 先使用年轮检查法进行标记
			// 从地图中间点算起
			var cx: int, cy: int;
			cx = m_iWidthBlocks >> 1;
			cy = m_iHeightBlocks >> 1;
			
			// 找到一个可以走的中心点
			while(!m_astSceneBlock[cy][cx].iWalkable)
			{
				// 不可走，按照十字法找一个可以走的点
				// 按照地图的走向
				var x: int, y: int, pt: Point;
				if(m_iWidthBlocks > m_iHeightBlocks)
				{
					// 宽幅地图，尝试优先横向寻找非阻挡点
					pt = _searchWalkableByCrossX(cx, cy);
					if(null == pt)
					{
						// 水平找不到再找垂直的
						pt = _searchWalkableByCrossY(cx, cy);
					}
				}
				else
				{
					// 窄幅地图，尝试优先竖向寻找非阻挡点
					pt = _searchWalkableByCrossY(cx, cy);
					if(null == pt)
					{
						// 水平找不到再找垂直的
						pt = _searchWalkableByCrossX(cx, cy);
					}
				}
				
				if(null != pt)
				{
					// 已经找到一个可以走的点了
					cx = pt.x;
					cy = pt.y;
					break;
				}
				else
				{
					// 没找到，随机一个
					cx = Math.random() * m_iWidthBlocks;
					cy = Math.random() * m_iHeightBlocks;
				}
			}
			
			// 记录岛块代表点
			m_islandDelegates.push(cy * m_iWidthBlocks + cx);
			
			// 开始按照十字法进行标记
			m_crtIslandIdx = 1;
			_scanByCross(cx, cy, m_crtIslandIdx);
		}
		
		private function _scanLoop() : void
		{
			// 取出一个未被标记的块
			var block: TSceneBlock = _getUntaggedByBigBlock();
			if(null == block)
			{
				block = _getUntaggedRound();
			}
			
			if(null != block)
			{
				// 记录岛块代表点
				m_islandDelegates.push(block.y * m_iWidthBlocks + block.x);
				
				// 每次都假设为一个新的岛
				_scanByCross(block.x, block.y, ++m_crtIslandIdx);
			}
		}
		
		private function _searchWalkableByCrossY(cx: int, cy: int) : Point
		{
			var isCenterOk: Boolean, x: int;
			// 向上寻找
			for(x = cx - 1; x >= 0; x--)
			{
				// 向左寻找
				if(m_astSceneBlock[cy][x].iWalkable)
				{
					return new Point(x, cy);
				}
			}
			
			// 向右寻找
			for(x = cx + 1; x < m_iWidthBlocks; x++)
			{
				// 向左寻找
				if(m_astSceneBlock[cy][x].iWalkable)
				{
					return new Point(x, cy);
				}
			}
			
			return null;
		}
		
		private function _searchWalkableByCrossX(cx: int, cy: int) : Point
		{
			var isCenterOk: Boolean, y: int;
			// 向上寻找
			for(y = cy - 1; y >= 0; y--)
			{
				// 向左寻找
				if(m_astSceneBlock[y][cx].iWalkable)
				{
					return new Point(cx, y);
				}
			}
			
			// 向下寻找
			for(y = cy + 1; y < m_iHeightBlocks; y++)
			{
				// 向左寻找
				if(m_astSceneBlock[y][cx].iWalkable)
				{
					return new Point(cx, y);
				}
			}
			
			return null;
		}
		
		private function _scanByCross(startX: int, startY: int, islandIndex: int) : void
		{
			assert(islandIndex > 0);
			
			m_scanTimes++;
			LogHelper.updateStatus("进行第" + m_scanTimes + "次十字扫描，中心点(" + startX + "," + startY + ")，标记值" + islandIndex);
			
			// 先标记十字中心点
			if(m_astSceneBlock[startY][startX].islandIndex < 0)
			{
				m_astSceneBlock[startY][startX].islandIndex = islandIndex;
				m_leftCnt--;
			}
			else
			{
				assert(m_astSceneBlock[startY][startX].islandIndex == islandIndex);
			}
			
			_scanVertical(startX, startY, islandIndex, true);
			_scanHorizon(startX, startY, islandIndex, true);
			
			var done: uint = m_totalCnt - m_leftCnt;
			LogHelper.updateStatus("扫描结束，共标记块：" + done + "(" + (done / m_totalCnt * 100).toFixed(2) + "%)" + "，剩余未标记块：" + m_leftCnt + "(" + (m_leftCnt / m_totalCnt * 100).toFixed(2) + "%)");
			
			LogHelper.updateStatus("开始标记大块...");
			// 标记大块
			var x: int, y: int, block: TSceneBlock, tmpBlock: TSceneBlock, blockSize: int, firstX: int, firstY: int, bx: int, by: int;
			for(x = 0; x < m_iWidthBlocks; x++)
			{
				for(y = 0; y < m_iHeightBlocks; y++)
				{
					block = m_astSceneBlock[y][x];
					if(block.islandIndex > 0 && block.iBlockIndex > 1)
					{
						// 已经标记且非0级块
						blockSize = 1 << block.iBlockIndex;
						firstX = block.iFirstBlock % m_iWidthBlocks;
						firstY = block.iFirstBlock / m_iWidthBlocks;
						block = m_astSceneBlock[firstY][firstX];
						if(block.islandIndex < 0)
						{
							// 起始块未标记，对整个块进行标记
							for(bx = 0; bx < blockSize; bx++)
							{
								for(by = 0; by < blockSize; by++)
								{
									tmpBlock = m_astSceneBlock[firstY + by][firstX + bx];
									if(tmpBlock.islandIndex < 0)
									{
										tmpBlock.islandIndex = islandIndex;
										m_leftCnt--;
										if(m_leftCnt <= 0)
										{
											break;
										}
									}
									else
									{
										assert(tmpBlock.islandIndex == islandIndex);
									}
								}
								
								if(m_leftCnt <= 0)
								{
									break;
								}
							}
						}
					}
				}
			}
			
			done = m_totalCnt - m_leftCnt;
			LogHelper.updateStatus("大块标记结束：" + done + "(" + (done / m_totalCnt * 100).toFixed(2) + "%)" + "，剩余未标记块：" + m_leftCnt + "(" + (m_leftCnt / m_totalCnt * 100).toFixed(2) + "%)");
			
			_mergeIslands();
			
			if(m_leftCnt > 0)
			{
				setTimeout(_scanLoop, 500);
			}
			else
			{
				// 尝试合并岛块
				_tryMergeAllIslands();
			}
		}
		
		private function _tryMergeAllIslands() : void
		{
			var len: int = m_islandDelegates.length;
			if(len <= 1)
			{
				_processFinish();
				return;
			}
			
			LogHelper.updateStatus("使用寻路测试合并岛块...");
			
			// 充值循环指针
			m_pathMergePtr = (len - 1) * (len - 1);
			_doMergeBySearchPath();
			
			
//			// 通过寻路探测连通性进而合并岛块
//			// 先从各个岛挑出1个代表点
//			var i: int, j: int, dindex: int, tmpIdx: int, dx: int, dy: int, tmpx: int, tmpy: int;
//			var up1: UnitPosition = new UnitPosition(), up2: UnitPosition = new UnitPosition(), path: Vector.<UnitPosition>;
//			for(i = m_islandDelegates.length - 1; i >= 0; i--)
//			{
//				dindex = m_islandDelegates[i];
//				if(dindex < 0)
//				{
//					continue;
//				}
//				dx = dindex % m_iWidthBlocks;
//				dy = dindex / m_iWidthBlocks;
//				up1.m_uiX = dx * MIN_SCENE_BLOCK_SIZE;
//				up1.m_uiY = dy * MIN_SCENE_BLOCK_SIZE;
//				// 与前面的进行寻路测试
//				for(j = i - 1; j >= 0; j--)
//				{
//					tmpIdx = m_islandDelegates[j];
//					tmpx = tmpIdx % m_iWidthBlocks;
//					tmpy = tmpIdx / m_iWidthBlocks;
//					up2.m_uiX = tmpx * MIN_SCENE_BLOCK_SIZE;
//					up2.m_uiY = tmpy * MIN_SCENE_BLOCK_SIZE;
//					path = findPath(up1, up2);
//					if(null != path)
//					{
//						// 可连通，向下合并
//						m_mergeMap[m_astSceneBlock[dy][dx].islandIndex] = m_astSceneBlock[tmpy][tmpx].islandIndex;
//						_mergeIslands();
//					}
//					else
//					{
//						// 不可连通，标记为岛2
//					}
//				}
//			}
		}
		
		private function _doMergeBySearchPath():void
		{
			var len: int = m_islandDelegates.length;
			// 通过指针计算出双重循环的状态
			var i: int = m_pathMergePtr / (len - 1);
			var j: int = m_pathMergePtr % (len - 1);
			
			if(j >= i)
			{
				// 只跟前面的岛块进行寻路测试
				m_pathMergePtr--;
				_nextMergeBySearchPath();
				return;
			}
			
			// 取出i循环的代表点
			var dindex: int = m_islandDelegates[i];
			if(dindex < 0)
			{
				// 代表点-1表示该岛块已经被合并过了
				// 直接进入下一轮i循环
				m_pathMergePtr -= (len - 1);
				_nextMergeBySearchPath();
				return;
			}
			
			// 去除j循环的代表点
			var tmpIdx: int = m_islandDelegates[j];
			if(tmpIdx < 0)
			{
				// 代表点-1表示该岛块已经被合并过了
				// 直接进入下一轮j循环
				m_pathMergePtr--;
				_nextMergeBySearchPath();
				return;
			}
			
			var up1: UnitPosition = new UnitPosition(), up2: UnitPosition = new UnitPosition(), path: Vector.<UnitPosition>;
			var dx: int, dy: int, tmpx: int, tmpy: int;
			
			dx = dindex % m_iWidthBlocks;
			dy = dindex / m_iWidthBlocks;
			up1.m_uiX = dx * MIN_SCENE_BLOCK_SIZE;
			up1.m_uiY = dy * MIN_SCENE_BLOCK_SIZE;
			
			tmpx = tmpIdx % m_iWidthBlocks;
			tmpy = tmpIdx / m_iWidthBlocks;
			up2.m_uiX = tmpx * MIN_SCENE_BLOCK_SIZE;
			up2.m_uiY = tmpy * MIN_SCENE_BLOCK_SIZE;
			path = findPath(up1, up2);
			if(null != path)
			{
				// 可连通，向下合并
				m_mergeMap[m_astSceneBlock[dy][dx].islandIndex] = m_astSceneBlock[tmpy][tmpx].islandIndex;
				_mergeIslands();
				m_pathMergePtr -= (len - 1);
				setTimeout(_nextMergeBySearchPath, 100);
			}
			else
			{
				// 不可连通，继续下一轮循环
				m_pathMergePtr--;
				setTimeout(_nextMergeBySearchPath, 500);
			}
		}
		
		private function _nextMergeBySearchPath() : void
		{
			if(m_pathMergePtr > 0)
			{
				_doMergeBySearchPath();
			}
			else
			{
				_processFinish();
			}
		}
		
		private function _processFinish(): void
		{
			_finishDeepMerge();
			var onComplete: Function = m_onComplete;
			m_onComplete = null;
			if(null != onComplete)
			{
				onComplete.call();
			}
		}
		
		private function _finishDeepMerge() : void
		{
			// 结束合并
			LogHelper.updateStatus("岛块划分完成，剩余未标记块：" + m_leftCnt + "(" + (m_leftCnt / m_totalCnt * 100).toFixed(2) + "%)");
			// 统计各岛块数量
			var x: int, y: int, block: TSceneBlock, islandArr: Vector.<int> = new Vector.<int>(), islandSizeMap: Object = {}, dindex: int;
			for(x = 0; x < m_iWidthBlocks; x++)
			{
				for(y = 0; y < m_iHeightBlocks; y++)
				{
					block = m_astSceneBlock[y][x];
					assert(block.islandIndex >= 0);
					if(block.islandIndex > 0) 
					{
						assert(block.iWalkable > 0, "岛类型与阻挡类型不匹配！");
					}
					if(block.islandIndex <= 0)
					{
						continue;
					}
					if(islandArr.indexOf(block.islandIndex) < 0)
					{
						islandSizeMap[block.islandIndex] = 1;
						islandArr.push(block.islandIndex);
					}
					else
					{
						islandSizeMap[block.islandIndex] = int(islandSizeMap[block.islandIndex]) + 1;
					}
				}
			}
			var statStr: String = "===========统计信息===========";
			islandArr.sort(_sortIslandArr);
			statStr += "\n一共有" + islandArr.length + "个岛：";
			for each(var islandIndex: int in islandArr)
			{
				dindex = m_islandDelegates[islandIndex - 1];
				x = (dindex % m_iWidthBlocks) * MIN_SCENE_BLOCK_SIZE;
				y = int(dindex / m_iWidthBlocks) * MIN_SCENE_BLOCK_SIZE;
				statStr += "\n岛" + islandIndex + "，包含块数量：" + islandSizeMap[islandIndex] + "，代表点：(" + x + "," + y + ")";
			}
			LogHelper.appendLine(statStr);
		}
		
		private function _sortIslandArr(a: int, b: int): int
		{
			return a - b;
		}
		
		private function _mergeIslands() : void
		{
			var mergeFlag: Object = {};
			var x: int, y: int, block: TSceneBlock, toMerge: int;
			for(x = 0; x < m_iWidthBlocks; x++)
			{
				for(y = 0; y < m_iHeightBlocks; y++)
				{
					block = m_astSceneBlock[y][x];
					toMerge = m_mergeMap[block.islandIndex];
					if(toMerge > 0)
					{
						if(!mergeFlag[block.islandIndex])
						{
							LogHelper.updateStatus("合并岛块：" + block.islandIndex + " -> " + toMerge);
							mergeFlag[block.islandIndex] = 1;
							// 清理岛块代表点
							m_islandDelegates[block.islandIndex - 1] = -1;
						}
						block.islandIndex = toMerge;
					}
				}
			}
			
			// 清理合并标记
			m_mergeMap = {};
		}
		
		private function _getUntaggedByBigBlock() : TSceneBlock
		{
			var x: int, y: int, block: TSceneBlock;
			for(x = m_untaggedX; x < m_iWidthBlocks; x++)
			{
				for(y = 0; y < m_iHeightBlocks; y++)
				{
					block = m_astSceneBlock[y][x];
					if(block.islandIndex < 0)
					{
						m_untaggedX = block.x;
						m_untaggedY = block.y;
						return block;
					}
				}
			}
			
			return null;
		}
		
		private function _getUntaggedRound() : TSceneBlock
		{
			// 尝试从地图中心点按照轮式查找法找到一个未标记的点
			
			var cindex: int = m_islandDelegates[0];
			var cx: int = cindex % m_iWidthBlocks;
			var cy: int = cindex / m_iWidthBlocks;
			
			var cMax: int = Math.max(cx, cy);
			var x: int, y: int, block: TSceneBlock, i: int = 1;
			var left: int, right: int, top: int, bottom: int;
			while(i < cMax)
			{
				left = Math.max(0, cx - i);
				right = Math.min(m_iWidthBlocks - 1, cx + i);
				top = Math.max(0, cy - i);
				bottom = Math.min(m_iHeightBlocks - 1, cy + i); 
				// 上边缘外围
				if(cy - i >= 0)
				{
					for(x = left; x <= right; x++)
					{
						block = m_astSceneBlock[cy - i][x];
						if(block.islandIndex < 0)
						{
							return block;
						}
					}
				}
				
				// 下边缘外围
				if(cy + i < m_iHeightBlocks)
				{
					for(x = left; x <= right; x++)
					{
						block = m_astSceneBlock[cy + i][x];
						if(block.islandIndex < 0)
						{
							return block;
						}
					}
				}
				
				// 左边缘外围
				if(cx - i >= 0)
				{
					for(y = top; y <= bottom; y++)
					{
						block = m_astSceneBlock[y][cx - i];
						if(block.islandIndex < 0)
						{
							return block;
						}
					}
				}
				
				// 右边缘外围
				if(cx + i < m_iWidthBlocks)
				{
					for(y = top; y <= bottom; y++)
					{
						block = m_astSceneBlock[y][cx + i];
						if(block.islandIndex < 0)
						{
							return block;
						}
					}
				}
				i++;
			}
			
			return null;
		}
		
		private function _scanVertical(startX: int, startY: int, islandIndex: int, spread: Boolean) : void
		{
			var x: int, y: int, block: TSceneBlock;
			// 再标记上射线，从中心点向上发射一直到阻挡点
			if(startY > 0)
			{
				for(y = startY - 1; y >= 0; y--)
				{
					block = m_astSceneBlock[y][startX];
					if(block.iWalkable)
					{
						if(block.islandIndex < 0)
						{
							// 未标记过
							block.islandIndex = islandIndex;
							m_leftCnt--;
							if(spread)
							{
								// 同时进行水平发射
								_scanHorizon(startX, y, islandIndex, false);
							}
						}
						else if(block.islandIndex != islandIndex)
						{
							// 已经标记过，说明这两个岛是相同的，需要合并
							_markMergeInfo(block.islandIndex, islandIndex);
						}
					}
					else
					{
						// 遇到阻挡点停止发射
						break;
					}
				}
			}
			// 再标记下射线，从中心点向下发射一直到阻挡点
			if(startY + 1 < m_iHeightBlocks)
			{
				for(y = startY + 1; y < m_iHeightBlocks; y++)
				{
					block = m_astSceneBlock[y][startX];
					if(block.iWalkable)
					{
						// 未标记过
						if(block.islandIndex < 0)
						{
							block.islandIndex = islandIndex;
							m_leftCnt--;
							if(spread)
							{
								// 同时进行水平发射
								_scanHorizon(startX, y, islandIndex, false);
							}
						}
						else if(block.islandIndex != islandIndex)
						{
							// 已经标记过，说明这两个岛是相同的，需要合并
							_markMergeInfo(block.islandIndex, islandIndex);
						}
					}
					else
					{
						// 遇到阻挡点停止发射
						break;
					}
				}
			}
		}
		
		private function _scanHorizon(startX: int, startY: int, islandIndex: int, spread: Boolean) : void
		{
			var x: int, y: int, block: TSceneBlock;
			// 再检查左射线，从中心点向左发射一直到阻挡点
			if(startX > 0)
			{
				for(x = startX - 1; x >= 0; x--)
				{
					block = m_astSceneBlock[startY][x];
					if(block.iWalkable)
					{
						// 未标记过
						if(block.islandIndex < 0)
						{
							block.islandIndex = islandIndex;
							m_leftCnt--;
							if(spread)
							{
								// 同时进行垂直发射
								_scanVertical(x, startY, islandIndex, false);
							}
						}
						else if(block.islandIndex != islandIndex)
						{
							// 已经标记过，说明这两个岛是相同的，需要合并
							_markMergeInfo(block.islandIndex, islandIndex);
						}
					}
					else
					{
						// 遇到阻挡点停止发射
						break;
					}
				}
			}
			// 再检查右射线，从中心点向右发射一直到阻挡点
			if(startX + 1 < m_iWidthBlocks)
			{
				for(x = startX + 1; x < m_iWidthBlocks; x++)
				{
					block = m_astSceneBlock[startY][x];
					if(block.iWalkable)
					{
						// 未标记过
						if(block.islandIndex < 0)
						{
							block.islandIndex = islandIndex;
							m_leftCnt--;
							if(spread)
							{
								// 同时进行垂直发射
								_scanVertical(x, startY, islandIndex, false);
							}
						}
						else if(block.islandIndex != islandIndex)
						{
							// 已经标记过，说明这两个岛是相同的，需要合并
							_markMergeInfo(block.islandIndex, islandIndex);
						}
					}
					else
					{
						// 遇到阻挡点停止发射
						break;
					}
				}
			}
		}
		
		private function _markMergeInfo(a: int, b: int) : void
		{
			var min: int, max: int;
			if(a < b)
			{
				min = a;
				max = b;
			}
			else
			{
				min = b;
				max = a;
			}
			// max向下合并为
			var old: int = m_mergeMap[max];
			if(old == min)
			{
				// 已做相同合并标记
				return;
			}
			
			if(0 == old || old > min)
			{
				m_mergeMap[max] = min;
			}
			if(old > 0)
			{
				_markMergeInfo(old, min);
			}
		}
		
		/**
		 *  获得寻路轨迹
		 * @param stStartPosition - 起点
		 * @param stEndPosition - 终点
		 * @param useNewData - 是否使用拷贝的数据 by fygame 2012.1.17
		 * @return 寻路路径
		 * 
		 */		
		public function findPath(stStartPosition :UnitPosition, 
								 stEndPosition :UnitPosition,
								 useNewData :Boolean = false): Vector.<UnitPosition>
		{
			if (canWalk(stStartPosition.m_uiX, stStartPosition.m_uiY, stEndPosition.m_uiX, stEndPosition.m_uiY))//可以直接行走的话就直接把目的点当作此次的路径
			{
				var vector:Vector.<UnitPosition> = new <UnitPosition>[stEndPosition];
				return vector;
			}
			
			/* 使用A*算法寻路 */
			
			if (useNewData)
			{
				// 当场景中有两个以上的对象同时在进行寻路时，不能使用一份缓存的寻路点集合数据（g_astTempPosition）
				// 目前g_astTempPosition的数组存储只用来存储英雄的寻路信息
				return findClonePathSlow(stStartPosition, stEndPosition);
			}
			
			// 注意：这个分支目前只能用于创建英雄的寻路信息
			return findPathSlow(stStartPosition, stEndPosition);
		}
		
		/**
		 * 计算寻路轨迹，该函数会生成一份独立的点集合，不会使用到g_astTempPosition这个临时点集合
		 * by fygame 2012.1.17
		 * @param stStartPosition - 起点位置
		 * @param stEndPosition - 终点位置
		 * @return 寻路点集合
		 * 
		 */		
		public function findClonePathSlow(stStartPosition:UnitPosition, stEndPosition:UnitPosition):Vector.<UnitPosition>
		{
			var iStartBlockX:int = stStartPosition.m_uiX / MIN_SCENE_BLOCK_SIZE;
			var iStartBlockY:int = stStartPosition.m_uiY / MIN_SCENE_BLOCK_SIZE;
			
			var iEndBlockX:int = stEndPosition.m_uiX / MIN_SCENE_BLOCK_SIZE;
			var iEndBlockY:int = stEndPosition.m_uiY / MIN_SCENE_BLOCK_SIZE;
			
			if(iStartBlockY > m_astSceneBlock.length 
				|| iStartBlockX >  m_astSceneBlock[iStartBlockY].length 
				|| iEndBlockY > m_astSceneBlock.length
				|| iEndBlockX > m_astSceneBlock[iEndBlockY].length)
			{
				return null;
			}
			
			var pstStartBlock:TSceneBlock = m_astSceneBlock[iStartBlockY][iStartBlockX];
			var pstEndBlock:TSceneBlock = m_astSceneBlock[iEndBlockY][iEndBlockX];
			
			m_stPathMinHeap.reset();

			var pstCenterBlock:TSceneBlock = pstStartBlock;
			
			if(pstCenterBlock == null) return null;
			
			m_stPathMinHeap.m_astCloseNode[m_stPathMinHeap.m_iCloseNodes++] = pstCenterBlock;
			
			while (1)
			{
				// 将当前节点加入封闭列表
				pstCenterBlock.bClosed = true;

				// 到达终点所属的块
				if (pstCenterBlock.iFirstBlock == pstEndBlock.iFirstBlock)
				{
					break;
				}
				
				var iCenterX:int = pstCenterBlock.x;
				var iCenterY:int = pstCenterBlock.y;

				if (iCenterX - 1 >= 0)
				{
					aStarCountNode(iCenterX - 1, iCenterY, pstCenterBlock, iEndBlockX, iEndBlockY);
				}
				
				if (iCenterX + 1 < m_iWidthBlocks)
				{
					aStarCountNode(iCenterX + 1, iCenterY, pstCenterBlock, iEndBlockX, iEndBlockY);
				}
				
				if (iCenterY - 1 >= 0)
				{
					aStarCountNode(iCenterX, iCenterY - 1, pstCenterBlock, iEndBlockX, iEndBlockY);
				}
				
				if (iCenterY + 1 < m_iHeightBlocks)
				{
					aStarCountNode(iCenterX, iCenterY + 1, pstCenterBlock, iEndBlockX, iEndBlockY);
				}
				
				// 取开放列表中路径最小的作为当前节点
				pstCenterBlock = m_stPathMinHeap.popHeap();
				
				if (pstCenterBlock == null)
				{
					trace("Cannot find valid path");
					return null;
				}
			}
			
			// A* 算法结束, 进行路径优化
			
			// 去掉终点块
			if (pstCenterBlock == pstEndBlock)
			{
				pstCenterBlock = pstCenterBlock.pstCenterNode;
			}
			
			// 统计路径点个数
			var clonePositionNumber: int = 0;
			var pstPathBlock:TSceneBlock = pstCenterBlock;
			while (pstPathBlock != pstStartBlock)
			{
				clonePositionNumber++;
				pstPathBlock = pstPathBlock.pstCenterNode;
			}
			
			if (clonePositionNumber >= MAX_TEMP_PATH_NUMBER - 1)
			{
				return null;
			} 
			
			// 将路径点反向连起来
			
			var clonePositionList :Vector.<UnitPosition> = new Vector.<UnitPosition>();
			for (var i:int = 0; i < MAX_TEMP_PATH_NUMBER; i++)
			{
				clonePositionList[i] = new UnitPosition();
			}

			pstPathBlock = pstCenterBlock;
			for (var j:int = clonePositionNumber - 1; j >= 0; j--)
			{
				iCenterX = pstPathBlock.x * MIN_SCENE_BLOCK_SIZE + MIN_SCENE_BLOCK_SIZE / 2;
				iCenterY = pstPathBlock.y * MIN_SCENE_BLOCK_SIZE + MIN_SCENE_BLOCK_SIZE / 2;
				
				clonePositionList[j].m_uiX = iCenterX;
				clonePositionList[j].m_uiY = iCenterY;
				
				pstPathBlock = pstPathBlock.pstCenterNode;
			}
			
			// 添加终点
			clonePositionNumber++;
			clonePositionList[clonePositionNumber - 1] = stEndPosition;
			
			return optimizeClonePath(stStartPosition, clonePositionList, clonePositionNumber);
		}
		
		/**
		 * 优化寻路路径
		 * by fygame 2012.1.17
		 * @param rstStartPosition - 起点位置
		 * @param clonePositionList - 寻路点集合
		 * @param clonePositionNumber - 集合的点的数量
		 * @return 优化后的点集合
		 * 
		 */		
		protected function optimizeClonePath(rstStartPosition:UnitPosition, 
											 clonePositionList :Vector.<UnitPosition>,
											 clonePositionNumber :int):Vector.<UnitPosition> 
		{
			var iSavedNumber:int = clonePositionNumber;
			
			// 优化起始点
			var iFirstPoint:int = 0;
			var iSecondPoint:int = iFirstPoint + 1;
			while (clonePositionNumber > 1 && canWalk(rstStartPosition.m_uiX, rstStartPosition.m_uiY, clonePositionList[iSecondPoint].m_uiX, clonePositionList[iSecondPoint].m_uiY))
			{       
				iFirstPoint = iSecondPoint;
				iSecondPoint = iFirstPoint + 1;
				clonePositionNumber--;
			}
			
			var iSavedFirstPoint:int = iFirstPoint;
			
			// 优化中间路径点
			var iThirdPoint:int;
			
			while (clonePositionNumber > 2)
			{
				iThirdPoint = iSecondPoint + 1;
				
				if (iThirdPoint >= iSavedNumber)
				{
					break;
				}
				
				if (canWalk(clonePositionList[iFirstPoint].m_uiX, clonePositionList[iFirstPoint].m_uiY, clonePositionList[iThirdPoint].m_uiX, clonePositionList[iThirdPoint].m_uiY))
				{
					clonePositionList[iSecondPoint].m_uiX = 0;
					
					iSecondPoint = iThirdPoint;
					
					clonePositionNumber--;
					continue;
				}
				
				iFirstPoint = iSecondPoint;
				iSecondPoint = iFirstPoint + 1;
			}
			
			// 收集所有有效路径点
			var rstPath:Vector.<UnitPosition> = new Vector.<UnitPosition>(clonePositionNumber);
			var i:int = iSavedFirstPoint; 
			var j:int = 0;
			while (j < clonePositionNumber)
			{
				if (clonePositionList[i].m_uiX != 0)
				{
					rstPath[j] = clonePositionList[i];
					j++;
				}     
				
				i++;
			}
			
			return rstPath;
		}
		
		/* A* 算法寻路 */
		public function findPathSlow(stStartPosition:UnitPosition, stEndPosition:UnitPosition):Vector.<UnitPosition>{
			
			var iStartBlockX:int = stStartPosition.m_uiX / MIN_SCENE_BLOCK_SIZE;
			var iStartBlockY:int = stStartPosition.m_uiY / MIN_SCENE_BLOCK_SIZE;
			
			var iEndBlockX:int = stEndPosition.m_uiX / MIN_SCENE_BLOCK_SIZE;
			var iEndBlockY:int = stEndPosition.m_uiY / MIN_SCENE_BLOCK_SIZE;
			
			if(iStartBlockY > m_astSceneBlock.length 
				|| iStartBlockX >  m_astSceneBlock[iStartBlockY].length 
				|| iEndBlockY > m_astSceneBlock.length 
				|| iEndBlockX > m_astSceneBlock[iEndBlockY].length)
			{
				return null;
			}
			
			var pstStartBlock:TSceneBlock = m_astSceneBlock[iStartBlockY][iStartBlockX];
			var pstEndBlock:TSceneBlock = m_astSceneBlock[iEndBlockY][iEndBlockX];
			
			m_stPathMinHeap.reset();

			var pstCenterBlock:TSceneBlock = pstStartBlock;
			
			if(pstCenterBlock == null) return null;
			
			m_stPathMinHeap.m_astCloseNode[m_stPathMinHeap.m_iCloseNodes++] = pstCenterBlock;
			
			while (1)
			{
				// 将当前节点加入封闭列表
				pstCenterBlock.bClosed = true;

				// 到达终点所属的块
				if (pstCenterBlock.iFirstBlock == pstEndBlock.iFirstBlock)
				{
					break;
				}
				
				var iCenterX:int = pstCenterBlock.x;
				var iCenterY:int = pstCenterBlock.y;

				if (iCenterX - 1 >= 0)
				{
					aStarCountNode(iCenterX - 1, iCenterY, pstCenterBlock, iEndBlockX, iEndBlockY);
				}
				
				if (iCenterX + 1 < m_iWidthBlocks)
				{
					aStarCountNode(iCenterX + 1, iCenterY, pstCenterBlock, iEndBlockX, iEndBlockY);
				}
				
				if (iCenterY - 1 >= 0)
				{
					aStarCountNode(iCenterX, iCenterY - 1, pstCenterBlock, iEndBlockX, iEndBlockY);
				}
				
				if (iCenterY + 1 < m_iHeightBlocks)
				{
					aStarCountNode(iCenterX, iCenterY + 1, pstCenterBlock, iEndBlockX, iEndBlockY);
				}
				
				// 取开放列表中路径最小的作为当前节点
				pstCenterBlock = m_stPathMinHeap.popHeap();
				
				if (pstCenterBlock == null)
				{
					return null;
				}    
			}
			
			// A* 算法结束, 进行路径优化
			
			// 去掉终点块
			if (pstCenterBlock == pstEndBlock)
			{
				if(null != pstCenterBlock.pstCenterNode)
				{
					pstCenterBlock = pstCenterBlock.pstCenterNode;
				}
			}
			
			// 统计路径点个数
			g_iTempPathNumber = 0;
			var pstPathBlock:TSceneBlock = pstCenterBlock;
			while (pstPathBlock != pstStartBlock)
			{
				g_iTempPathNumber++;
				pstPathBlock = pstPathBlock.pstCenterNode;
			}
			
			if (g_iTempPathNumber >= MAX_TEMP_PATH_NUMBER - 1)
			{
				return null;
			} 
			
			// 将路径点反向连起来
			
			pstPathBlock = pstCenterBlock;
			for (var i:int = g_iTempPathNumber - 1; i >= 0; i--)
			{
				iCenterX = pstPathBlock.x * MIN_SCENE_BLOCK_SIZE + MIN_SCENE_BLOCK_SIZE / 2;
				iCenterY = pstPathBlock.y * MIN_SCENE_BLOCK_SIZE + MIN_SCENE_BLOCK_SIZE / 2;
				
				g_astTempPosition[i].m_uiX = iCenterX;
				g_astTempPosition[i].m_uiY = iCenterY;
				
				pstPathBlock = pstPathBlock.pstCenterNode;
			}
			
			// 添加终点
			g_iTempPathNumber++;
			g_astTempPosition[g_iTempPathNumber - 1] = stEndPosition;
			
			return optimizePath(stStartPosition);
		}
		
		private function optimizePath(rstStartPosition:UnitPosition):Vector.<UnitPosition> 
		{
			var iSavedNumber:int = g_iTempPathNumber;
			
			// 优化起始点
			var iFirstPoint:int = 0;
			var iSecondPoint:int = iFirstPoint + 1;
			while (g_iTempPathNumber > 1 && canWalk(rstStartPosition.m_uiX, rstStartPosition.m_uiY, g_astTempPosition[iSecondPoint].m_uiX, g_astTempPosition[iSecondPoint].m_uiY))
			{       
				iFirstPoint = iSecondPoint;
				iSecondPoint = iFirstPoint + 1;
				g_iTempPathNumber--;
			}
			
			var iSavedFirstPoint:int = iFirstPoint;
			
			// 优化中间路径点
			var iThirdPoint:int;
			//var iFourthPoint:int;
			//
			while (g_iTempPathNumber > 2)
			{
				iThirdPoint = iSecondPoint + 1;
				//iFourthPoint = iThirdPoint + 1;
				
				if (iThirdPoint >= iSavedNumber)
				{
					break;
				}
				
				//				if (iFourthPoint < iSavedNumber && canWalk(g_astTempPosition[iFirstPoint], g_astTempPosition[iFourthPoint]))
				//				{
				//					g_astTempPosition[iSecondPoint].m_uiX = -1;
				//					g_astTempPosition[iThirdPoint].m_uiX = -1;
				//					
				//					iSecondPoint = iFourthPoint;
				//					
				//					g_iTempPathNumber--;
				//					g_iTempPathNumber--;
				//					continue;
				//				}
				
				if (canWalk(g_astTempPosition[iFirstPoint].m_uiX, g_astTempPosition[iFirstPoint].m_uiY, g_astTempPosition[iThirdPoint].m_uiX, g_astTempPosition[iThirdPoint].m_uiY))
				{
					g_astTempPosition[iSecondPoint].m_uiX = 0;
					
					iSecondPoint = iThirdPoint;
					
					g_iTempPathNumber--;
					continue;
				}
				
				iFirstPoint = iSecondPoint;
				iSecondPoint = iFirstPoint + 1;
			}
			
			// 收集所有有效路径点
			var rstPath:Vector.<UnitPosition> = new Vector.<UnitPosition>(g_iTempPathNumber);
			var i:int = iSavedFirstPoint; 
			var j:int = 0;
			while (j < g_iTempPathNumber)
			{
				if (g_astTempPosition[i].m_uiX != 0)
				{
					rstPath[j] = g_astTempPosition[i];
					j++;
				}     
				
				i++;
			}
			
			return rstPath;
		}

		private function aStarCountNode(iX:int,iY:int,pstCenterBlock:TSceneBlock,iEndX:int,iEndY:int):void
		{
			var pstNeighborBlock:TSceneBlock = m_astSceneBlock[iY][iX];
			
			// 此块不可行走，忽略
			if (pstNeighborBlock.iWalkable == 0)
			{
				//TRACESVR("Block not walkable\n");
				return;
			}

			// 已经加入封闭列表，忽略
			if (pstNeighborBlock.bClosed)
			{
				//TRACESVR("Block already closed\n");
				return;
			}
			
			var iValueG:int = pstCenterBlock.iValueG + 1;
			
			// 在开放列表中，但路径比现在优先，忽略
			if (pstNeighborBlock.bOpened  && pstNeighborBlock.iValueG < iValueG)
			{
				return;
			}
			
			// 更新当前节点GHF值，并指向新的中心节点
			pstNeighborBlock.iValueG = iValueG;
			pstNeighborBlock.iValueF = iValueG + Math.abs(iEndX-iX) + Math.abs(iEndY-iY);
			//pstNeighborBlock.iValueF = Math.abs(iEndX-iX) + Math.abs(iEndY-iY);
			pstNeighborBlock.pstCenterNode = pstCenterBlock;

			// 加入开放列表
			if (!pstNeighborBlock.bOpened)
			{
				m_stPathMinHeap.pushHeap(pstNeighborBlock);
				pstNeighborBlock.bOpened = true;
				
			}
			
			return;
		}
		
		/**
		 * 判断起始点到目的点是否可直接行走 
		 * @param stStartPosition
		 * @param stEndPosition
		 * @return 
		 * 
		 */		
		public function canWalk(startPosX: int, startPosY: int, endPosX: int, endPosY: int): Boolean
		{
			var iStartBlockX:int = startPosX / MIN_SCENE_BLOCK_SIZE;
			var iStartBlockY:int = startPosY / MIN_SCENE_BLOCK_SIZE;
			
			var iEndBlockX:int = endPosX / MIN_SCENE_BLOCK_SIZE;
			var iEndBlockY:int = endPosY / MIN_SCENE_BLOCK_SIZE;
			
			if (iStartBlockX < 0 || iStartBlockX >= m_iWidthBlocks 
				|| iStartBlockY < 0 || iStartBlockY >= m_iHeightBlocks
				|| iEndBlockX < 0 || iEndBlockX >= m_iWidthBlocks 
				|| iEndBlockY < 0 || iEndBlockY >= m_iHeightBlocks)
			{
				return false;
			}
			
			var len: uint = m_astSceneBlock.length;
			if(iStartBlockY >= len || iEndBlockY >= len)
			{
				return false;
			}
			
			var stEndBlock:TSceneBlock;
			vec = m_astSceneBlock[iEndBlockY];
			if(iEndBlockX >= vec.length)
			{
				return false;
			}
			else
			{
				stEndBlock = vec[iEndBlockX];
			}
			
			/* 只需要判断终点是否可行走 */ 
			if (stEndBlock.iWalkable == 0)
			{
				return false;
			}
			
			var stStartBlock:TSceneBlock;
			var vec: Vector.<TSceneBlock> = m_astSceneBlock[iStartBlockY];
			if(iStartBlockX >= vec.length)
			{
				return false;
			}
			else
			{
				stStartBlock = vec[iStartBlockX];
			}
			
			/* 起点和终点在一个大块中 */
			if (stStartBlock.iFirstBlock == stEndBlock.iFirstBlock)
			{
				return true;
			}
			
			/* 按照直线方程进行检测 */
			return canWalkSlow(startPosX, startPosY, endPosX, endPosY);
		}
		
		/**
		 * 直线方程逼近验证
		 * @param stStartPosition
		 * @param stEndPosition
		 * @return 
		 * 
		 */		
		public function canWalkSlow(startPosX: int, startPosY: int, endPosX: int, endPosY: int):Boolean
		{
			var iStartBlockX:int = startPosX / MIN_SCENE_BLOCK_SIZE;
			var iStartBlockY:int = startPosY / MIN_SCENE_BLOCK_SIZE;
			
			var iEndBlockX:int = endPosX / MIN_SCENE_BLOCK_SIZE;
			var iEndBlockY:int = endPosY / MIN_SCENE_BLOCK_SIZE;

			// 沿着X轴步进还是Y轴步进
			
			var iWidthBlocks:int = Math.abs(iEndBlockX - iStartBlockX);
			var iHeightBlocks:int = Math.abs(iEndBlockY - iStartBlockY);
			var bStepX:Boolean = iWidthBlocks >= iHeightBlocks;
			
			// X，Y坐标增加还是减少
			var bGrowX:Boolean = iEndBlockX > iStartBlockX;
			var bGrowY:Boolean = iEndBlockY > iStartBlockY;
			
			// 设置直线两端点为格子的中心坐标
			var iStartX:int = iStartBlockX * MIN_SCENE_BLOCK_SIZE + MIN_SCENE_BLOCK_SIZE/2;
			var iStartY:int = iStartBlockY * MIN_SCENE_BLOCK_SIZE + MIN_SCENE_BLOCK_SIZE/2;
			
			var iEndX:int = iEndBlockX * MIN_SCENE_BLOCK_SIZE + MIN_SCENE_BLOCK_SIZE/2;
			var iEndY:int = iEndBlockY * MIN_SCENE_BLOCK_SIZE + MIN_SCENE_BLOCK_SIZE/2;
			
			var K:Number;        // 直线斜率
			var offset:Number;   // 坐标偏移
			
			//			trace("Slow check: " + stStartPosition.m_uiX + " x " + stStartPosition.m_uiY + " => " + 
			//						stEndPosition.m_uiX + " x " + stEndPosition.m_uiY);
			
			var i:int;
			if (bStepX)
			{
				K = (iEndY - iStartY) / (iEndX - iStartX);
				offset = (iStartY * iEndX - iEndY * iStartX) / (iEndX - iStartX);

				for (i = 0; i < iWidthBlocks; i++)
				{
					if (bGrowX)
					{
						iStartBlockX++;
					}
					else 
					{
						iStartBlockX--;
					}
					
					iStartX = iStartBlockX * MIN_SCENE_BLOCK_SIZE + MIN_SCENE_BLOCK_SIZE/2;
					
					iStartY = int(K * iStartX + offset + 0.5);

					iStartBlockY = iStartY / MIN_SCENE_BLOCK_SIZE;
					
					if (m_astSceneBlock[iStartBlockY][iStartBlockX].iWalkable == 0)
					{
						return false;
					}
				}
			}
			else
			{
				K = (iEndX - iStartX) / (iEndY - iStartY);
				offset = (iEndY * iStartX - iStartY * iEndX) / (iEndY - iStartY);
				
				for (i = 0; i < iHeightBlocks; i++)
				{
					if (bGrowY)
					{
						iStartBlockY++;
					}
					else 
					{
						iStartBlockY--;
					}
					
					iStartY = iStartBlockY * MIN_SCENE_BLOCK_SIZE + MIN_SCENE_BLOCK_SIZE/2;
					
					iStartX = int(K * iStartY + offset + 0.5);

					iStartBlockX = iStartX / MIN_SCENE_BLOCK_SIZE;
					
					if (m_astSceneBlock[iStartBlockY][iStartBlockX].iWalkable == 0)
					{
						return false;
					}
				}
			}
			
			return true;
		}
		
		public function get sceneBlocks() : Vector.<Vector.<TSceneBlock>>
		{
			return m_astSceneBlock;
		}

		//		/**
		//		 * bool CScenePath::CanWalk(const UnitPosition &stStartPosition, const TUnitPath &stPath)
		//		 * @param stStartPosition
		//		 * @param stPath
		//		 * @return 
		//		 * 
		//		 */
		//		public function canWalkPath(stStartPosition:UnitPosition, stPath:TUnitPath):Boolean
		//		{
		//			 if (stPath.m_iNumber < 0 || stPath.m_iNumber >= MAX_POSITION_NUMBER_IN_PATH)
		//			 {
		//				 return false;
		//			 }
		//			 
		//			 if (!canWalk(stStartPosition, stPath.m_astPosition[0]))
		//			 {
		//				 return false;
		//			 }
		//			 
		//			 for (var i:int = 0; i < stPath.m_iNumber - 1; i++)
		//			 {
		//				 if (!canWalk(stPath.m_astPosition[i], stPath.m_astPosition[i+1]))
		//				 {
		//					 return false;
		//				 }
		//			 }
		//			 return true;
		//		 }
	}
}