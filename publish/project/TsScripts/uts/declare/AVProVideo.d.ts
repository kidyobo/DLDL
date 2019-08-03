declare module AVProVideo
{
	export class MediaPlayer extends UnityEngine.MonoBehaviour
	{
		constructor();
		m_VideoLocation:MediaPlayer.FileLocation;
		m_VideoPath:string;
		m_AutoOpen:boolean;
		m_AutoStart:boolean;
		m_Loop:boolean;
		m_Volume:number;
		m_Muted:boolean;
		m_PlaybackRate:number;
		m_Resample:boolean;
		m_ResampleMode:Resampler.ResampleMode;
		m_ResampleBufferSize:number;
		m_StereoPacking:StereoPacking;
		m_AlphaPacking:AlphaPacking;
		m_DisplayDebugStereoColorTint:boolean;
		m_FilterMode:UnityEngine.FilterMode;
		m_WrapMode:UnityEngine.TextureWrapMode;
		m_AnisoLevel:number;
		readonly FrameResampler:Object;
		Persistent:boolean;
		VideoLayoutMapping:VideoMapping;
		readonly Info:Object;
		readonly Control:Object;
		readonly Player:Object;
		readonly TextureProducer:Object;
		readonly Subtitles:Object;
		readonly Events:Object;
		readonly VideoOpened:boolean;
		AudioHeadTransform:UnityEngine.Transform;
		AudioFocusEnabled:boolean;
		AudioFocusOffLevelDB:number;
		AudioFocusWidthDegrees:number;
		AudioFocusTransform:UnityEngine.Transform;
		readonly PlatformOptionsWindows:Object;
		readonly PlatformOptionsMacOSX:Object;
		readonly PlatformOptionsIOS:Object;
		readonly PlatformOptionsTVOS:Object;
		readonly PlatformOptionsAndroid:Object;
		readonly PlatformOptionsWindowsPhone:Object;
		readonly PlatformOptionsWindowsUWP:Object;
		readonly PlatformOptionsWebGL:Object;
		readonly PlatformOptionsPS4:Object;
		readonly SubtitlesEnabled:boolean;
		readonly SubtitlePath:string;
		readonly SubtitleLocation:MediaPlayer.FileLocation;
		OpenVideoFromFile(location:MediaPlayer.FileLocation,path:string,autoPlay:boolean):boolean;
		OpenVideoFromBuffer(buffer:number[],autoPlay:boolean):boolean;
		StartOpenChunkedVideoFromBuffer(length:number,autoPlay:boolean):boolean;
		AddChunkToVideoBuffer(chunk:number[],offset:number,chunkSize:number):boolean;
		EndOpenChunkedVideoFromBuffer():boolean;
		EnableSubtitles(fileLocation:MediaPlayer.FileLocation,filePath:string):boolean;
		DisableSubtitles():void;
		CloseVideo():void;
		Play():void;
		Pause():void;
		Stop():void;
		Rewind(pause:boolean):void;
		GetCurrentPlatformOptions():Object;
		CreatePlatformMediaPlayer():Object;
		ExtractFrameAsync(target:UnityEngine.Texture2D,callback:(extractedFrame:UnityEngine.Texture2D)=>void,timeSeconds:number,accurateSeek:boolean,timeoutMs:number):void;
		ExtractFrame(target:UnityEngine.Texture2D,timeSeconds:number,accurateSeek:boolean,timeoutMs:number):UnityEngine.Texture2D;
		static GetPlatform():Platform;
		static GetPath(location:MediaPlayer.FileLocation):string;
		static GetFilePath(path:string,location:MediaPlayer.FileLocation):string;
		static GetType():UnityEngine.Type;
	}
	export class MediaPlayerHelper
	{
		constructor();
		static BindEvent(player:MediaPlayer,callback:(arg0:MediaPlayer,arg1:MediaPlayerEvent.EventType,arg2:ErrorCode)=>void):void;
		static GetType():UnityEngine.Type;
	}
	export class DisplayUGUI extends UnityEngine.UI.MaskableGraphic
	{
		constructor();
		_mediaPlayer:MediaPlayer;
		m_UVRect:UnityEngine.Rect;
		_setNativeSize:boolean;
		_scaleMode:ScaleMode;
		_noDefaultDisplay:boolean;
		_displayInEditor:boolean;
		_defaultTexture:UnityEngine.Texture;
		readonly mainTexture:UnityEngine.Texture;
		CurrentMediaPlayer:MediaPlayer;
		uvRect:UnityEngine.Rect;
		HasValidTexture():boolean;
		SetNativeSize():void;
		static GetType():UnityEngine.Type;
	}
	export class ApplyToMaterial extends UnityEngine.MonoBehaviour
	{
		constructor();
		_offset:UnityEngine.Vector2;
		_scale:UnityEngine.Vector2;
		_material:UnityEngine.Material;
		_texturePropertyName:string;
		_media:MediaPlayer;
		_defaultTexture:UnityEngine.Texture2D;
		static GetType():UnityEngine.Type;
	}
	export class ApplyToMesh extends UnityEngine.MonoBehaviour
	{
		constructor();
		Player:MediaPlayer;
		DefaultTexture:UnityEngine.Texture2D;
		MeshRenderer:UnityEngine.Renderer;
		TexturePropertyName:string;
		Offset:UnityEngine.Vector2;
		Scale:UnityEngine.Vector2;
		ForceUpdate():void;
		static GetType():UnityEngine.Type;
	}
	export class AudioOutput extends UnityEngine.MonoBehaviour
	{
		constructor();
		_audioOutputMode:AudioOutput.AudioOutputMode;
		_channelMask:number;
		ChangeMediaPlayer(newPlayer:MediaPlayer):void;
		static GetType():UnityEngine.Type;
	}
	export class CubemapCube extends UnityEngine.MonoBehaviour
	{
		constructor();
		Player:MediaPlayer;
		static GetType():UnityEngine.Type;
	}
	export class DisplayIMGUI extends UnityEngine.MonoBehaviour
	{
		constructor();
		_mediaPlayer:MediaPlayer;
		_displayInEditor:boolean;
		_scaleMode:ScaleMode;
		_color:UnityEngine.Color;
		_alphaBlend:boolean;
		_depth:number;
		_fullScreen:boolean;
		_x:number;
		_y:number;
		_width:number;
		_height:number;
		GetRect():UnityEngine.Rect;
		static GetType():UnityEngine.Type;
	}
	export class UpdateStereoMaterial extends UnityEngine.MonoBehaviour
	{
		constructor();
		_camera:UnityEngine.Camera;
		_renderer:UnityEngine.MeshRenderer;
		_uGuiComponent:UnityEngine.UI.Graphic;
		_material:UnityEngine.Material;
		ForceEyeMode:StereoEye;
		static GetType():UnityEngine.Type;
	}
	export class StreamParser extends UnityEngine.MonoBehaviour
	{
		constructor();
		_url:string;
		_streamType:StreamParser.StreamType;
		_autoLoad:boolean;
		readonly Events:Object;
		readonly Loaded:boolean;
		readonly Root:Object;
		readonly SubStreams:Object;
		readonly Chunks:Object;
		ParseStream():void;
		static GetType():UnityEngine.Type;
	}
	export class DisplayBackground extends UnityEngine.MonoBehaviour
	{
		constructor();
		_source:Object;
		_texture:UnityEngine.Texture2D;
		_material:UnityEngine.Material;
		static GetType():UnityEngine.Type;
	}
	export class DebugOverlay extends UnityEngine.MonoBehaviour
	{
		constructor();
		DisplayControls:boolean;
		CurrentMediaPlayer:MediaPlayer;
		static GetType():UnityEngine.Type;
	}
	export class SubtitlesUGUI extends UnityEngine.MonoBehaviour
	{
		constructor();
		ChangeMediaPlayer(newPlayer:MediaPlayer):void;
		static GetType():UnityEngine.Type;
	}
}