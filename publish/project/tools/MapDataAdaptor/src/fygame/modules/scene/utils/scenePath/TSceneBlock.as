package fygame.modules.scene.utils.scenePath
{
	/**
	 * 每个地图块的数据
	 * @author leo/fygame
	 * 
	 */	
	public class TSceneBlock
	{
		/**
		 * 是否可行走 ，1表示能行走，0表示不能行走
		 */		
		public var iWalkable:int;
		
		/**
		 * 块层级, 第0级即最小可行走单位, 第1级包含4个0级块, 第2级包含4个1级块, 依次类推 
		 */		
		public var iBlockIndex:int;
		
		public var islandIndex: int;
		
		/**
		 * 起始的0级块序号 
		 */		
		public var iFirstBlock:int;
		
		/**
		 * 相对于原点的块索引x 
		 */		
		public var x:int;
		
		/**
		 * 相对于远点的块索引y 
		 */		
		public var y:int;
		
		public var iValueF:int;// F = G + H
		public var iValueG:int;
//		public var iValueH:int;
		public var bClosed:Boolean;// 是否在封闭链表
		public var bOpened:Boolean;// 是否在开放链表
		public var pstCenterNode:TSceneBlock; // 中心节点
		
		public function reset():void
		{
			iValueF = 0;
			iValueG = 0;
//			iValueH = 0;
			bClosed = false;
			bOpened = false;
			pstCenterNode = null;
		}
	}
}