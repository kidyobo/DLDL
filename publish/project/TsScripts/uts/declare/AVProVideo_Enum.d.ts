declare module AVProVideo
{
	module MediaPlayer
	{
		export enum FileLocation
		{
			AbsolutePathOrURL=0,
			RelativeToProjectFolder=1,
			RelativeToStreamingAssetsFolder=2,
			RelativeToDataFolder=3,
			RelativeToPeristentDataFolder=4,
		}

	}
	module Resampler
	{
		export enum ResampleMode
		{
			POINT=0,
			LINEAR=1,
		}

	}
	export enum StereoPacking
	{
		None=0,
		TopBottom=1,
		LeftRight=2,
		CustomUV=3,
	}
	export enum AlphaPacking
	{
		None=0,
		TopBottom=1,
		LeftRight=2,
	}
	export enum VideoMapping
	{
		Unknown=0,
		Normal=1,
		EquiRectangular360=2,
		EquiRectangular180=3,
		CubeMap3x2=4,
	}
	export enum Platform
	{
		Windows=0,
		MacOSX=1,
		iOS=2,
		tvOS=3,
		Android=4,
		WindowsPhone=5,
		WindowsUWP=6,
		WebGL=7,
		PS4=8,
		Count=9,
		Unknown=100,
	}
	export enum ErrorCode
	{
		None=0,
		LoadFailed=100,
		DecodeFailed=200,
	}
	export enum ScaleMode
	{
		StretchToFill=0,
		ScaleAndCrop=1,
		ScaleToFit=2,
	}
	export enum StereoEye
	{
		Both=0,
		Left=1,
		Right=2,
	}
	module MediaPlayerEvent
	{
		export enum EventType
		{
			MetaDataReady=0,
			ReadyToPlay=1,
			Started=2,
			FirstFrameReady=3,
			FinishedPlaying=4,
			Closing=5,
			Error=6,
			SubtitleChange=7,
			Stalled=8,
			Unstalled=9,
			ResolutionChanged=10,
			StartedSeeking=11,
			FinishedSeeking=12,
			StartedBuffering=13,
			FinishedBuffering=14,
		}

	}
	module AudioOutput
	{
		export enum AudioOutputMode
		{
			Single=0,
			Multiple=1,
		}

	}
	module StreamParser
	{
		export enum StreamType
		{
			HLS=0,
		}

	}
}