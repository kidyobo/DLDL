package mapEditor
{
	public class NPCInfo
	{
		public var sceneID: uint;
		
		public var x: uint;
		
		public var y: uint;
		
		public var npcID: int;
		
		public var direction: int;
		
		public function NPCInfo(sceneID: int, x: int, y: int, npcID: int, direction: int)
		{
			this.sceneID = sceneID;
			this.x = x;
			this.y = y;
			this.npcID = npcID;
			this.direction = direction;
		}
	}
}