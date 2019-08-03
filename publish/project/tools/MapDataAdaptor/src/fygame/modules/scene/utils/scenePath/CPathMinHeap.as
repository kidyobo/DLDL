package fygame.modules.scene.utils.scenePath
{
	public class CPathMinHeap
	{
		public static const MIN_SCENE_BLOCK_SIZE:int =20;
		
		public var  m_iOpenNodes:int;
		
		public var m_iCloseNodes:int;
		
		public var m_astOpenNode:Vector.<TSceneBlock>;
		
		public var m_astCloseNode:Vector.<TSceneBlock>;
		
		public function CPathMinHeap()
		{
			
			m_astOpenNode = new Vector.<TSceneBlock>();
			m_astCloseNode = new Vector.<TSceneBlock>();
			
			m_iOpenNodes = 0;
			m_iCloseNodes = 0;
		}
		
		public function reset(): void
		{
			var len: int = 0;
			if (m_astOpenNode != null)
			{
				len = m_astOpenNode.length;
				for (var i: int = 0; i < len; ++i)
				{
					m_astOpenNode[i].reset();
					m_astOpenNode[i] = null;
				}
				m_astOpenNode.length = 0;
			}
			
			if (m_astCloseNode != null)
			{
				len = m_astCloseNode.length;
				for (var j: int = 0; j < len; ++j)
				{
					m_astCloseNode[j].reset();
					m_astCloseNode[j] = null;
				}
				m_astCloseNode.length = 0;
			}
			
			m_iOpenNodes = 0;
			m_iCloseNodes = 0;
		}

		public function finalize():void
		{
			m_astOpenNode = null;
			m_astCloseNode = null;
		}
		
		/* 弹出路径最小的点 */
		public function  popHeap():TSceneBlock{
			
			if (m_iOpenNodes <= 0)
			{
				return null;
			}
			
			// 保存最小值
			var pstMinBlock:TSceneBlock = m_astOpenNode[0];
			m_astCloseNode[m_iCloseNodes++] = pstMinBlock;
			
			// 比较两个子节点，将小的提升为父节点
			var iParent:int = 0;
			var iLeftChild:int, iRightChild:int;
			for (iLeftChild = 2 * iParent + 1, iRightChild = iLeftChild + 1;
				iRightChild < m_iOpenNodes;
				iLeftChild = 2 * iParent + 1, iRightChild = iLeftChild + 1)
			{
				if (m_astOpenNode[iLeftChild].iValueF < m_astOpenNode[iRightChild].iValueF)
				{
					m_astOpenNode[iParent] = m_astOpenNode[iLeftChild];
					iParent = iLeftChild;
				}
				else
				{
					m_astOpenNode[iParent] = m_astOpenNode[iRightChild];
					iParent = iRightChild;
				}
			}
			
			// 将最后一个节点填在空出来的节点上, 防止数组空洞
			if (iParent != m_iOpenNodes - 1)
			{
				insertHeap(m_astOpenNode[--m_iOpenNodes], iParent);
			}
			
			m_iOpenNodes--;
			
			return pstMinBlock;
			
		}
		
		/* 压入一个路径点 */
		public function  pushHeap(pstSceneBlock:TSceneBlock):Boolean{
			
//			if (m_iOpenNodes >= MAX_PATH_NODE)
//			{
//				return false;
//			}
			
			return insertHeap(pstSceneBlock, m_iOpenNodes);
		}
		
		/**
		 *插入堆 
		 * @param pstSceneBlock
		 * @param iPosition
		 * @return 
		 * 
		 */
		private function insertHeap(pstSceneBlock:TSceneBlock,iPosition:int):Boolean{
			
			m_astOpenNode[iPosition] = pstSceneBlock;
			
			// 依次和父节点比较，如果比父节点小，则上移
			var iChild:int, iParent:int;
			
			for (iChild = iPosition, iParent = (iChild - 1) / 2;
				iChild > 0;
				iChild = iParent, iParent = (iChild - 1) / 2)
			{
				//进行替换
				if (m_astOpenNode[iChild].iValueF < m_astOpenNode[iParent].iValueF)
				{
					var tmp:TSceneBlock = m_astOpenNode[iParent];
					m_astOpenNode[iParent] = m_astOpenNode[iChild];
					m_astOpenNode[iChild] = tmp;
				}
				else
				{
					break;
				}
			}
			
			m_iOpenNodes++;
			
			return true;
		}
		
	}
}