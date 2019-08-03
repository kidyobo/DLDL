package ui
{
	public class CbItemData
	{
		public static const STATUS_NONE: int = 0;
		public static const STATUS_PROCCESSING: int = 1;
		public static const STATUS_PROCESSED: int = 2;
		
		[Bindable]
		public var resourceID: int;
		
		[Bindable]
		public var sceneID: int;
		
		[Bindable]
		public var label: String;
		
		[Bindable]
		public var url: String;
		
		[Bindable]
		public var path: String;
		
		[Bindable]
		public var hasProcessed: int;
		
		[Bindable]
		public var ck: Boolean;
		
		public function CbItemData()
		{
		}
	}
}