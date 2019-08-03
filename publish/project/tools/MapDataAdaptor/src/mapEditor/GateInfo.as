package mapEditor
{
	import fygame.math.FyPoint;

	public class GateInfo
	{
		public var position: FyPoint;
		
		public var gateID: int;
		
		public var gateName: String;
		
		public var destSceneID: int;
		
		public var destX: int;
		
		public var destY: int;
		
		public var direction: int;
		
		
		public function GateInfo(x: int, y: int, gateID: int, gateName: String,
								 destSceneID: int, destX: int, destY: int, dir: int)
		{
			position = new FyPoint();
			position.x = x;
			position.y = y;
			this.gateID = gateID;
			this.gateName = gateName;
			this.destSceneID = destSceneID;
			this.destX = destX;
			this.destY = destY;
			this.direction = dir;
		}
	}
}