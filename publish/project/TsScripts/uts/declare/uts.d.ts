declare module UnityEngine {
	export enum HideFlags {
		None=0,
		HideInHierarchy=1,
		HideInInspector=2,
		DontSaveInEditor=4,
		NotEditable=8,
		DontSaveInBuild=16,
		DontUnloadUnusedAsset=32,
		DontSave=52,
		HideAndDontSave=61,
	}
	export enum TypeCode {
		Empty=0,
		Object=1,
		DBNull=2,
		Boolean=3,
		Char=4,
		SByte=5,
		Byte=6,
		Int16=7,
		UInt16=8,
		Int32=9,
		UInt32=10,
		Int64=11,
		UInt64=12,
		Single=13,
		Double=14,
		Decimal=15,
		DateTime=16,
		String=18,
	}
	export enum BindingFlags {
		Default=0,
		IgnoreCase=1,
		DeclaredOnly=2,
		Instance=4,
		Static=8,
		Public=16,
		NonPublic=32,
		FlattenHierarchy=64,
		InvokeMethod=256,
		CreateInstance=512,
		GetField=1024,
		SetField=2048,
		GetProperty=4096,
		SetProperty=8192,
		PutDispProperty=16384,
		PutRefDispProperty=32768,
		ExactBinding=65536,
		SuppressChangeType=131072,
		OptionalParamBinding=262144,
		IgnoreReturn=16777216,
	}
	export enum MemberTypes {
		Constructor=1,
		Event=2,
		Field=4,
		Method=8,
		Property=16,
		TypeInfo=32,
		Custom=64,
		NestedType=128,
		All=191,
	}
	export enum CallingConventions {
		Standard=1,
		VarArgs=2,
		Any=3,
		HasThis=32,
		ExplicitThis=64,
	}
	export enum TypeAttributes {
		VisibilityMask=7,
		NotPublic=0,
		Public=1,
		NestedPublic=2,
		NestedPrivate=3,
		NestedFamily=4,
		NestedAssembly=5,
		NestedFamANDAssem=6,
		NestedFamORAssem=7,
		LayoutMask=24,
		AutoLayout=0,
		SequentialLayout=8,
		ExplicitLayout=16,
		ClassSemanticsMask=32,
		Class=0,
		Interface=32,
		Abstract=128,
		Sealed=256,
		SpecialName=1024,
		Import=4096,
		Serializable=8192,
		StringFormatMask=196608,
		AnsiClass=0,
		UnicodeClass=65536,
		AutoClass=131072,
		BeforeFieldInit=1048576,
		ReservedMask=264192,
		RTSpecialName=2048,
		HasSecurity=262144,
		CustomFormatClass=196608,
		CustomFormatMask=12582912,
	}
	export enum GenericParameterAttributes {
		Covariant=1,
		Contravariant=2,
		VarianceMask=3,
		None=0,
		ReferenceTypeConstraint=4,
		NotNullableValueTypeConstraint=8,
		DefaultConstructorConstraint=16,
		SpecialConstraintMask=28,
	}
	export enum SendMessageOptions {
		RequireReceiver=0,
		DontRequireReceiver=1,
	}
	export enum AnisotropicFiltering {
		Disable=0,
		Enable=1,
		ForceEnable=2,
	}
	export enum TextureDimension {
		Unknown=-1,
		None=0,
		Any=1,
		Tex2D=2,
		Tex3D=3,
		Cube=4,
		Tex2DArray=5,
		CubeArray=6,
	}
	export enum FilterMode {
		Point=0,
		Bilinear=1,
		Trilinear=2,
	}
	export enum TextureWrapMode {
		Repeat=0,
		Clamp=1,
	}
	export enum ShadowCastingMode {
		Off=0,
		On=1,
		TwoSided=2,
		ShadowsOnly=3,
	}
	export enum MotionVectorGenerationMode {
		Camera=0,
		Object=1,
		ForceNoMotion=2,
	}
	export enum LightProbeUsage {
		Off=0,
		BlendProbes=1,
		UseProxyVolume=2,
	}
	export enum ReflectionProbeUsage {
		Off=0,
		BlendProbes=1,
		BlendProbesAndSkybox=2,
		Simple=3,
	}
	export enum SpriteMeshType {
		FullRect=0,
		Tight=1,
	}
	export enum SpritePackingMode {
		Tight=0,
		Rectangle=1,
	}
	export enum SpritePackingRotation {
		None=0,
		Any=15,
	}
	export enum WrapMode {
		Once=1,
		Loop=2,
		PingPong=4,
		Default=0,
		ClampForever=8,
		Clamp=1,
	}
	export enum NavMeshPathStatus {
		PathComplete=0,
		PathPartial=1,
		PathInvalid=2,
	}
	export enum MaterialGlobalIlluminationFlags {
		None=0,
		RealtimeEmissive=1,
		BakedEmissive=2,
		EmissiveIsBlack=4,
		AnyEmissive=3,
	}
	export enum TextureFormat {
		Alpha8=1,
		ARGB4444=2,
		RGB24=3,
		RGBA32=4,
		ARGB32=5,
		RGB565=7,
		R16=9,
		DXT1=10,
		DXT5=12,
		RGBA4444=13,
		BGRA32=14,
		RHalf=15,
		RGHalf=16,
		RGBAHalf=17,
		RFloat=18,
		RGFloat=19,
		RGBAFloat=20,
		YUY2=21,
		RGB9e5Float=22,
		BC4=26,
		BC5=27,
		BC6H=24,
		BC7=25,
		DXT1Crunched=28,
		DXT5Crunched=29,
		PVRTC_RGB2=30,
		PVRTC_RGBA2=31,
		PVRTC_RGB4=32,
		PVRTC_RGBA4=33,
		ETC_RGB4=34,
		ATC_RGB4=35,
		ATC_RGBA8=36,
		EAC_R=41,
		EAC_R_SIGNED=42,
		EAC_RG=43,
		EAC_RG_SIGNED=44,
		ETC2_RGB=45,
		ETC2_RGBA1=46,
		ETC2_RGBA8=47,
		ASTC_RGB_4x4=48,
		ASTC_RGB_5x5=49,
		ASTC_RGB_6x6=50,
		ASTC_RGB_8x8=51,
		ASTC_RGB_10x10=52,
		ASTC_RGB_12x12=53,
		ASTC_RGBA_4x4=54,
		ASTC_RGBA_5x5=55,
		ASTC_RGBA_6x6=56,
		ASTC_RGBA_8x8=57,
		ASTC_RGBA_10x10=58,
		ASTC_RGBA_12x12=59,
		ETC_RGB4_3DS=60,
		ETC_RGBA8_3DS=61,
		RG16=62,
		R8=63,
		PVRTC_2BPP_RGB=-127,
		PVRTC_2BPP_RGBA=-127,
		PVRTC_4BPP_RGB=-127,
		PVRTC_4BPP_RGBA=-127,
	}
	export enum RenderTextureFormat {
		ARGB32=0,
		Depth=1,
		ARGBHalf=2,
		Shadowmap=3,
		RGB565=4,
		ARGB4444=5,
		ARGB1555=6,
		Default=7,
		ARGB2101010=8,
		DefaultHDR=9,
		ARGB64=10,
		ARGBFloat=11,
		RGFloat=12,
		RGHalf=13,
		RFloat=14,
		RHalf=15,
		R8=16,
		ARGBInt=17,
		RGInt=18,
		RInt=19,
		BGRA32=20,
		RGB111110Float=22,
		RG32=23,
		RGBAUShort=24,
		RG16=25,
	}
	export enum RenderTextureReadWrite {
		Default=0,
		Linear=1,
		sRGB=2,
	}
	export enum VRTextureUsage {
		None=0,
		OneEye=1,
		TwoEyes=2,
	}
	export enum SkinQuality {
		Auto=0,
		Bone1=1,
		Bone2=2,
		Bone4=4,
	}
	export enum ParticleSystemVertexStream {
		Position=0,
		Normal=1,
		Tangent=2,
		Color=3,
		UV=4,
		UV2=5,
		UV3=6,
		UV4=7,
		AnimBlend=8,
		AnimFrame=9,
		Center=10,
		VertexID=11,
		SizeX=12,
		SizeXY=13,
		SizeXYZ=14,
		Rotation=15,
		Rotation3D=16,
		RotationSpeed=17,
		RotationSpeed3D=18,
		Velocity=19,
		Speed=20,
		AgePercent=21,
		InvStartLifetime=22,
		StableRandomX=23,
		StableRandomXY=24,
		StableRandomXYZ=25,
		StableRandomXYZW=26,
		VaryingRandomX=27,
		VaryingRandomXY=28,
		VaryingRandomXYZ=29,
		VaryingRandomXYZW=30,
		Custom1X=31,
		Custom1XY=32,
		Custom1XYZ=33,
		Custom1XYZW=34,
		Custom2X=35,
		Custom2XY=36,
		Custom2XYZ=37,
		Custom2XYZW=38,
	}
	export enum ParticleSystemRenderMode {
		Billboard=0,
		Stretch=1,
		HorizontalBillboard=2,
		VerticalBillboard=3,
		Mesh=4,
		None=5,
	}
	export enum ParticleSystemRenderSpace {
		View=0,
		World=1,
		Local=2,
		Facing=3,
	}
	export enum ParticleSystemSortMode {
		None=0,
		Distance=1,
		OldestInFront=2,
		YoungestInFront=3,
	}
	export enum PrimitiveType {
		Sphere=0,
		Capsule=1,
		Cylinder=2,
		Cube=3,
		Plane=4,
		Quad=5,
	}
	export enum Space {
		World=0,
		Self=1,
	}
	export enum AvatarIKGoal {
		LeftFoot=0,
		RightFoot=1,
		LeftHand=2,
		RightHand=3,
	}
	export enum AvatarIKHint {
		LeftKnee=0,
		RightKnee=1,
		LeftElbow=2,
		RightElbow=3,
	}
	export enum HumanBodyBones {
		Hips=0,
		LeftUpperLeg=1,
		RightUpperLeg=2,
		LeftLowerLeg=3,
		RightLowerLeg=4,
		LeftFoot=5,
		RightFoot=6,
		Spine=7,
		Chest=8,
		UpperChest=54,
		Neck=9,
		Head=10,
		LeftShoulder=11,
		RightShoulder=12,
		LeftUpperArm=13,
		RightUpperArm=14,
		LeftLowerArm=15,
		RightLowerArm=16,
		LeftHand=17,
		RightHand=18,
		LeftToes=19,
		RightToes=20,
		LeftEye=21,
		RightEye=22,
		Jaw=23,
		LeftThumbProximal=24,
		LeftThumbIntermediate=25,
		LeftThumbDistal=26,
		LeftIndexProximal=27,
		LeftIndexIntermediate=28,
		LeftIndexDistal=29,
		LeftMiddleProximal=30,
		LeftMiddleIntermediate=31,
		LeftMiddleDistal=32,
		LeftRingProximal=33,
		LeftRingIntermediate=34,
		LeftRingDistal=35,
		LeftLittleProximal=36,
		LeftLittleIntermediate=37,
		LeftLittleDistal=38,
		RightThumbProximal=39,
		RightThumbIntermediate=40,
		RightThumbDistal=41,
		RightIndexProximal=42,
		RightIndexIntermediate=43,
		RightIndexDistal=44,
		RightMiddleProximal=45,
		RightMiddleIntermediate=46,
		RightMiddleDistal=47,
		RightRingProximal=48,
		RightRingIntermediate=49,
		RightRingDistal=50,
		RightLittleProximal=51,
		RightLittleIntermediate=52,
		RightLittleDistal=53,
		LastBone=55,
	}
	export enum AvatarTarget {
		Root=0,
		Body=1,
		LeftFoot=2,
		RightFoot=3,
		LeftHand=4,
		RightHand=5,
	}
	export enum AnimatorUpdateMode {
		Normal=0,
		AnimatePhysics=1,
		UnscaledTime=2,
	}
	export enum AnimatorCullingMode {
		AlwaysAnimate=0,
		CullUpdateTransforms=1,
		CullCompletely=2,
		BasedOnRenderers=1,
	}
	export enum AnimatorRecorderMode {
		Offline=0,
		Playback=1,
		Record=2,
	}
	export enum CameraEvent {
		BeforeDepthTexture=0,
		AfterDepthTexture=1,
		BeforeDepthNormalsTexture=2,
		AfterDepthNormalsTexture=3,
		BeforeGBuffer=4,
		AfterGBuffer=5,
		BeforeLighting=6,
		AfterLighting=7,
		BeforeFinalPass=8,
		AfterFinalPass=9,
		BeforeForwardOpaque=10,
		AfterForwardOpaque=11,
		BeforeImageEffectsOpaque=12,
		AfterImageEffectsOpaque=13,
		BeforeSkybox=14,
		AfterSkybox=15,
		BeforeForwardAlpha=16,
		AfterForwardAlpha=17,
		BeforeImageEffects=18,
		AfterImageEffects=19,
		AfterEverything=20,
		BeforeReflections=21,
		AfterReflections=22,
	}
	export enum RenderingPath {
		UsePlayerSettings=-1,
		VertexLit=0,
		Forward=1,
		DeferredLighting=2,
		DeferredShading=3,
	}
	export enum OpaqueSortMode {
		Default=0,
		FrontToBack=1,
		NoDistanceSort=2,
	}
	export enum TransparencySortMode {
		Default=0,
		Perspective=1,
		Orthographic=2,
		CustomAxis=3,
	}
	export enum CameraClearFlags {
		Skybox=1,
		Color=2,
		SolidColor=2,
		Depth=3,
		Nothing=4,
	}
	export enum CameraType {
		Game=1,
		SceneView=2,
		Preview=4,
		VR=8,
	}
	export enum StereoTargetEyeMask {
		None=0,
		Left=1,
		Right=2,
		Both=3,
	}
	export enum DepthTextureMode {
		None=0,
		Depth=1,
		DepthNormals=2,
		MotionVectors=4,
	}
	export enum ParticleSystemCustomData {
		Custom1=0,
		Custom2=1,
	}
	export enum ParticleSystemStopBehavior {
		StopEmittingAndClear=0,
		StopEmitting=1,
	}
	export enum AudioSourceCurveType {
		CustomRolloff=0,
		SpatialBlend=1,
		ReverbZoneMix=2,
		Spread=3,
	}
	export enum FFTWindow {
		Rectangular=0,
		Triangle=1,
		Hamming=2,
		Hanning=3,
		Blackman=4,
		BlackmanHarris=5,
	}
	export enum AudioVelocityUpdateMode {
		Auto=0,
		Fixed=1,
		Dynamic=2,
	}
	export enum AudioRolloffMode {
		Logarithmic=0,
		Linear=1,
		Custom=2,
	}
	export enum AudioClipLoadType {
		DecompressOnLoad=0,
		CompressedInMemory=1,
		Streaming=2,
	}
	export enum AudioDataLoadState {
		Unloaded=0,
		Loading=1,
		Loaded=2,
		Failed=3,
	}
	export enum RenderMode {
		ScreenSpaceOverlay=0,
		ScreenSpaceCamera=1,
		WorldSpace=2,
	}
	export enum AdditionalCanvasShaderChannels {
		None=0,
		TexCoord1=1,
		TexCoord2=2,
		TexCoord3=4,
		Normal=8,
		Tangent=16,
	}
	export enum LogType {
		Error=0,
		Assert=1,
		Warning=2,
		Log=3,
		Exception=4,
	}
	export enum StackTraceLogType {
		None=0,
		ScriptOnly=1,
		Full=2,
	}
	export enum UserAuthorization {
		WebCam=1,
		Microphone=2,
	}
	export enum RuntimePlatform {
		OSXEditor=0,
		OSXPlayer=1,
		WindowsPlayer=2,
		OSXWebPlayer=3,
		OSXDashboardPlayer=4,
		WindowsWebPlayer=5,
		WindowsEditor=7,
		IPhonePlayer=8,
		XBOX360=10,
		PS3=9,
		Android=11,
		NaCl=12,
		FlashPlayer=15,
		LinuxPlayer=13,
		LinuxEditor=16,
		WebGLPlayer=17,
		MetroPlayerX86=18,
		WSAPlayerX86=18,
		MetroPlayerX64=19,
		WSAPlayerX64=19,
		MetroPlayerARM=20,
		WSAPlayerARM=20,
		WP8Player=21,
		BB10Player=22,
		BlackBerryPlayer=22,
		TizenPlayer=23,
		PSP2=24,
		PS4=25,
		PSM=26,
		XboxOne=27,
		SamsungTVPlayer=28,
		WiiU=30,
		tvOS=31,
		Switch=32,
	}
	export enum ApplicationInstallMode {
		Unknown=0,
		Store=1,
		DeveloperBuild=2,
		Adhoc=3,
		Enterprise=4,
		Editor=5,
	}
	export enum ApplicationSandboxType {
		Unknown=0,
		NotSandboxed=1,
		Sandboxed=2,
		SandboxBroken=3,
	}
	export enum SystemLanguage {
		Afrikaans=0,
		Arabic=1,
		Basque=2,
		Belarusian=3,
		Bulgarian=4,
		Catalan=5,
		Chinese=6,
		Czech=7,
		Danish=8,
		Dutch=9,
		English=10,
		Estonian=11,
		Faroese=12,
		Finnish=13,
		French=14,
		German=15,
		Greek=16,
		Hebrew=17,
		Hugarian=18,
		Icelandic=19,
		Indonesian=20,
		Italian=21,
		Japanese=22,
		Korean=23,
		Latvian=24,
		Lithuanian=25,
		Norwegian=26,
		Polish=27,
		Portuguese=28,
		Romanian=29,
		Russian=30,
		SerboCroatian=31,
		Slovak=32,
		Slovenian=33,
		Spanish=34,
		Swedish=35,
		Thai=36,
		Turkish=37,
		Ukrainian=38,
		Vietnamese=39,
		ChineseSimplified=40,
		ChineseTraditional=41,
		Unknown=42,
		Hungarian=18,
	}
	export enum ThreadPriority {
		Low=0,
		BelowNormal=1,
		Normal=2,
		High=4,
	}
	export enum NetworkReachability {
		NotReachable=0,
		ReachableViaCarrierDataNetwork=1,
		ReachableViaLocalAreaNetwork=2,
	}
	export enum ScreenOrientation {
		Unknown=0,
		Portrait=1,
		PortraitUpsideDown=2,
		LandscapeLeft=3,
		LandscapeRight=4,
		AutoRotation=5,
		Landscape=3,
	}
	export enum BatteryStatus {
		Unknown=0,
		Charging=1,
		Discharging=2,
		NotCharging=3,
		Full=4,
	}
	export enum OperatingSystemFamily {
		Other=0,
		MacOSX=1,
		Windows=2,
		Linux=3,
	}
	export enum GraphicsDeviceType {
		OpenGL2=0,
		Direct3D9=1,
		Direct3D11=2,
		PlayStation3=3,
		Null=4,
		Xbox360=6,
		OpenGLES2=8,
		OpenGLES3=11,
		PlayStationVita=12,
		PlayStation4=13,
		XboxOne=14,
		PlayStationMobile=15,
		Metal=16,
		OpenGLCore=17,
		Direct3D12=18,
		N3DS=19,
		Vulkan=21,
	}
	export enum CopyTextureSupport {
		None=0,
		Basic=1,
		Copy3D=2,
		DifferentTypes=4,
		TextureToRT=8,
		RTToTexture=16,
	}
	export enum NPOTSupport {
		None=0,
		Restricted=1,
		Full=2,
	}
	export enum DeviceType {
		Unknown=0,
		Handheld=1,
		Console=2,
		Desktop=3,
	}
	export enum MeshTopology {
		Triangles=0,
		Quads=2,
		Lines=3,
		LineStrip=4,
		Points=5,
	}
	export enum CubemapFace {
		Unknown=-1,
		PositiveX=0,
		NegativeX=1,
		PositiveY=2,
		NegativeY=3,
		PositiveZ=4,
		NegativeZ=5,
	}
	export enum GraphicsTier {
		Tier1=0,
		Tier2=1,
		Tier3=2,
	}
	export enum LightEvent {
		BeforeShadowMap=0,
		AfterShadowMap=1,
		BeforeScreenspaceMask=2,
		AfterScreenspaceMask=3,
		BeforeShadowMapPass=4,
		AfterShadowMapPass=5,
	}
	export enum ShadowMapPass {
		PointlightPositiveX=1,
		PointlightNegativeX=2,
		PointlightPositiveY=4,
		PointlightNegativeY=8,
		PointlightPositiveZ=16,
		PointlightNegativeZ=32,
		DirectionalCascade0=64,
		DirectionalCascade1=128,
		DirectionalCascade2=256,
		DirectionalCascade3=512,
		Spotlight=1024,
		Pointlight=63,
		Directional=960,
		All=2047,
	}
	export enum LightType {
		Spot=0,
		Directional=1,
		Point=2,
		Area=3,
	}
	export enum LightShadows {
		None=0,
		Hard=1,
		Soft=2,
	}
	export enum LightShadowResolution {
		FromQualitySettings=-1,
		Low=0,
		Medium=1,
		High=2,
		VeryHigh=3,
	}
	export enum LightRenderMode {
		Auto=0,
		ForcePixel=1,
		ForceVertex=2,
	}
	export enum ShadowQuality {
		Disable=0,
		HardOnly=1,
		All=2,
	}
	export enum ShadowProjection {
		CloseFit=0,
		StableFit=1,
	}
	export enum ShadowResolution {
		Low=0,
		Medium=1,
		High=2,
		VeryHigh=3,
	}
	export enum ColorSpace {
		Uninitialized=-1,
		Gamma=0,
		Linear=1,
	}
	export enum BlendWeights {
		OneBone=1,
		TwoBones=2,
		FourBones=4,
	}
	export enum LoadSceneMode {
		Single=0,
		Additive=1,
	}
}
declare module UnityEngine.Texture2D {
	export enum EXRFlags {
		None=0,
		OutputAsFloat=1,
		CompressZIP=2,
		CompressRLE=4,
		CompressPIZ=8,
	}
}
declare module UnityEngine.Camera {
	export enum StereoscopicEye {
		Left=0,
		Right=1,
	}
	export enum MonoOrStereoscopicEye {
		Left=0,
		Right=1,
		Mono=2,
	}
}
declare module UnityEngine.RectTransform {
	export enum Edge {
		Left=0,
		Right=1,
		Top=2,
		Bottom=3,
	}
	export enum Axis {
		Horizontal=0,
		Vertical=1,
	}
}
declare module UnityEngine.PointerEventData {
	export enum InputButton {
		Left=0,
		Right=1,
		Middle=2,
	}
}
declare module UnityEngine.UI {
	export enum CanvasUpdate {
		Prelayout=0,
		Layout=1,
		PostLayout=2,
		PreRender=3,
		LatePreRender=4,
		MaxUpdateValue=5,
	}
	export enum TextAnchor {
		UpperLeft=0,
		UpperCenter=1,
		UpperRight=2,
		MiddleLeft=3,
		MiddleCenter=4,
		MiddleRight=5,
		LowerLeft=6,
		LowerCenter=7,
		LowerRight=8,
	}
	export enum HorizontalWrapMode {
		Wrap=0,
		Overflow=1,
	}
	export enum VerticalWrapMode {
		Truncate=0,
		Overflow=1,
	}
	export enum FontStyle {
		Normal=0,
		Bold=1,
		Italic=2,
		BoldAndItalic=3,
	}
	export enum TouchScreenKeyboardType {
		Default=0,
		ASCIICapable=1,
		NumbersAndPunctuation=2,
		URL=3,
		NumberPad=4,
		PhonePad=5,
		NamePhonePad=6,
		EmailAddress=7,
		NintendoNetworkAccount=8,
	}
}
declare module UnityEngine.UI.Selectable {
	export enum Transition {
		None=0,
		ColorTint=1,
		SpriteSwap=2,
		Animation=3,
	}
}
declare module UnityEngine.UI.Image {
	export enum Type {
		Simple=0,
		Sliced=1,
		Tiled=2,
		Filled=3,
	}
	export enum FillMethod {
		Horizontal=0,
		Vertical=1,
		Radial90=2,
		Radial180=3,
		Radial360=4,
	}
}
declare module UnityEngine.UI.Slider {
	export enum Direction {
		LeftToRight=0,
		RightToLeft=1,
		BottomToTop=2,
		TopToBottom=3,
	}
}
declare module UnityEngine.UI.ScrollRect {
	export enum MovementType {
		Unrestricted=0,
		Elastic=1,
		Clamped=2,
	}
	export enum ScrollbarVisibility {
		Permanent=0,
		AutoHide=1,
		AutoHideAndExpandViewport=2,
	}
}
declare module UnityEngine.UI.Scrollbar {
	export enum Direction {
		LeftToRight=0,
		RightToLeft=1,
		BottomToTop=2,
		TopToBottom=3,
	}
}
declare module UnityEngine.UI.InputField {
	export enum ContentType {
		Standard=0,
		Autocorrected=1,
		IntegerNumber=2,
		DecimalNumber=3,
		Alphanumeric=4,
		Name=5,
		EmailAddress=6,
		Password=7,
		Pin=8,
		Custom=9,
	}
	export enum LineType {
		SingleLine=0,
		MultiLineSubmit=1,
		MultiLineNewline=2,
	}
	export enum InputType {
		Standard=0,
		AutoCorrect=1,
		Password=2,
	}
	export enum CharacterValidation {
		None=0,
		Integer=1,
		Decimal=2,
		Alphanumeric=3,
		Name=4,
		EmailAddress=5,
	}
}
declare module Tween.UITweener {
	export enum Method {
		Linear=0,
		EaseIn=1,
		EaseOut=2,
		EaseInOut=3,
		BounceIn=4,
		BounceOut=5,
	}
	export enum Style {
		Once=0,
		Loop=1,
		PingPong=2,
	}
}
declare module Tween {
	export enum Direction {
		Reverse=-1,
		Toggle=0,
		Forward=1,
	}
}
declare module Game.FyScrollRect {
	export enum MovementType {
		Unrestricted=0,
		Elastic=1,
		Clamped=2,
		NoCross=3,
	}
	export enum ScrollbarVisibility {
		Permanent=0,
		AutoHide=1,
		AutoHideAndExpandViewport=2,
	}
}
declare module Game {
	export enum QuakeDirection {
		Left=0,
		Right=1,
		Up=2,
		Down=3,
		LeftUp=4,
		LeftDown=5,
		RightUp=6,
		RightDown=7,
	}
	export enum AssetPriority {
		Low1=0,
		Low2=1,
		Low3=2,
		BelowNormal1=3,
		BelowNormal2=4,
		BelowNormal3=5,
		Normal1=6,
		Normal2=7,
		Normal3=8,
		High1=9,
		High2=10,
		High3=11,
	}
	export enum UrlAssetType {
		Bytes=0,
		Text=1,
		Texture=2,
	}
	export enum KeyCode {
		None=0,
		Backspace=8,
		Delete=127,
		Tab=9,
		Clear=12,
		Return=13,
		Pause=19,
		Escape=27,
		Space=32,
		Keypad0=256,
		Keypad1=257,
		Keypad2=258,
		Keypad3=259,
		Keypad4=260,
		Keypad5=261,
		Keypad6=262,
		Keypad7=263,
		Keypad8=264,
		Keypad9=265,
		KeypadPeriod=266,
		KeypadDivide=267,
		KeypadMultiply=268,
		KeypadMinus=269,
		KeypadPlus=270,
		KeypadEnter=271,
		KeypadEquals=272,
		UpArrow=273,
		DownArrow=274,
		RightArrow=275,
		LeftArrow=276,
		Insert=277,
		Home=278,
		End=279,
		PageUp=280,
		PageDown=281,
		F1=282,
		F2=283,
		F3=284,
		F4=285,
		F5=286,
		F6=287,
		F7=288,
		F8=289,
		F9=290,
		F10=291,
		F11=292,
		F12=293,
		F13=294,
		F14=295,
		F15=296,
		Alpha0=48,
		Alpha1=49,
		Alpha2=50,
		Alpha3=51,
		Alpha4=52,
		Alpha5=53,
		Alpha6=54,
		Alpha7=55,
		Alpha8=56,
		Alpha9=57,
		Exclaim=33,
		DoubleQuote=34,
		Hash=35,
		Dollar=36,
		Ampersand=38,
		Quote=39,
		LeftParen=40,
		RightParen=41,
		Asterisk=42,
		Plus=43,
		Comma=44,
		Minus=45,
		Period=46,
		Slash=47,
		Colon=58,
		Semicolon=59,
		Less=60,
		Equals=61,
		Greater=62,
		Question=63,
		At=64,
		LeftBracket=91,
		Backslash=92,
		RightBracket=93,
		Caret=94,
		Underscore=95,
		BackQuote=96,
		A=97,
		B=98,
		C=99,
		D=100,
		E=101,
		F=102,
		G=103,
		H=104,
		I=105,
		J=106,
		K=107,
		L=108,
		M=109,
		N=110,
		O=111,
		P=112,
		Q=113,
		R=114,
		S=115,
		T=116,
		U=117,
		V=118,
		W=119,
		X=120,
		Y=121,
		Z=122,
		Numlock=300,
		CapsLock=301,
		ScrollLock=302,
		RightShift=303,
		LeftShift=304,
		RightControl=305,
		LeftControl=306,
		RightAlt=307,
		LeftAlt=308,
		LeftCommand=310,
		LeftApple=310,
		LeftWindows=311,
		RightCommand=309,
		RightApple=309,
		RightWindows=312,
		AltGr=313,
		Help=315,
		Print=316,
		SysReq=317,
		Break=318,
		Menu=319,
		Mouse0=323,
		Mouse1=324,
		Mouse2=325,
		Mouse3=326,
		Mouse4=327,
		Mouse5=328,
		Mouse6=329,
		JoystickButton0=330,
		JoystickButton1=331,
		JoystickButton2=332,
		JoystickButton3=333,
		JoystickButton4=334,
		JoystickButton5=335,
		JoystickButton6=336,
		JoystickButton7=337,
		JoystickButton8=338,
		JoystickButton9=339,
		JoystickButton10=340,
		JoystickButton11=341,
		JoystickButton12=342,
		JoystickButton13=343,
		JoystickButton14=344,
		JoystickButton15=345,
		JoystickButton16=346,
		JoystickButton17=347,
		JoystickButton18=348,
		JoystickButton19=349,
		Joystick1Button0=350,
		Joystick1Button1=351,
		Joystick1Button2=352,
		Joystick1Button3=353,
		Joystick1Button4=354,
		Joystick1Button5=355,
		Joystick1Button6=356,
		Joystick1Button7=357,
		Joystick1Button8=358,
		Joystick1Button9=359,
		Joystick1Button10=360,
		Joystick1Button11=361,
		Joystick1Button12=362,
		Joystick1Button13=363,
		Joystick1Button14=364,
		Joystick1Button15=365,
		Joystick1Button16=366,
		Joystick1Button17=367,
		Joystick1Button18=368,
		Joystick1Button19=369,
		Joystick2Button0=370,
		Joystick2Button1=371,
		Joystick2Button2=372,
		Joystick2Button3=373,
		Joystick2Button4=374,
		Joystick2Button5=375,
		Joystick2Button6=376,
		Joystick2Button7=377,
		Joystick2Button8=378,
		Joystick2Button9=379,
		Joystick2Button10=380,
		Joystick2Button11=381,
		Joystick2Button12=382,
		Joystick2Button13=383,
		Joystick2Button14=384,
		Joystick2Button15=385,
		Joystick2Button16=386,
		Joystick2Button17=387,
		Joystick2Button18=388,
		Joystick2Button19=389,
		Joystick3Button0=390,
		Joystick3Button1=391,
		Joystick3Button2=392,
		Joystick3Button3=393,
		Joystick3Button4=394,
		Joystick3Button5=395,
		Joystick3Button6=396,
		Joystick3Button7=397,
		Joystick3Button8=398,
		Joystick3Button9=399,
		Joystick3Button10=400,
		Joystick3Button11=401,
		Joystick3Button12=402,
		Joystick3Button13=403,
		Joystick3Button14=404,
		Joystick3Button15=405,
		Joystick3Button16=406,
		Joystick3Button17=407,
		Joystick3Button18=408,
		Joystick3Button19=409,
		Joystick4Button0=410,
		Joystick4Button1=411,
		Joystick4Button2=412,
		Joystick4Button3=413,
		Joystick4Button4=414,
		Joystick4Button5=415,
		Joystick4Button6=416,
		Joystick4Button7=417,
		Joystick4Button8=418,
		Joystick4Button9=419,
		Joystick4Button10=420,
		Joystick4Button11=421,
		Joystick4Button12=422,
		Joystick4Button13=423,
		Joystick4Button14=424,
		Joystick4Button15=425,
		Joystick4Button16=426,
		Joystick4Button17=427,
		Joystick4Button18=428,
		Joystick4Button19=429,
		Joystick5Button0=430,
		Joystick5Button1=431,
		Joystick5Button2=432,
		Joystick5Button3=433,
		Joystick5Button4=434,
		Joystick5Button5=435,
		Joystick5Button6=436,
		Joystick5Button7=437,
		Joystick5Button8=438,
		Joystick5Button9=439,
		Joystick5Button10=440,
		Joystick5Button11=441,
		Joystick5Button12=442,
		Joystick5Button13=443,
		Joystick5Button14=444,
		Joystick5Button15=445,
		Joystick5Button16=446,
		Joystick5Button17=447,
		Joystick5Button18=448,
		Joystick5Button19=449,
		Joystick6Button0=450,
		Joystick6Button1=451,
		Joystick6Button2=452,
		Joystick6Button3=453,
		Joystick6Button4=454,
		Joystick6Button5=455,
		Joystick6Button6=456,
		Joystick6Button7=457,
		Joystick6Button8=458,
		Joystick6Button9=459,
		Joystick6Button10=460,
		Joystick6Button11=461,
		Joystick6Button12=462,
		Joystick6Button13=463,
		Joystick6Button14=464,
		Joystick6Button15=465,
		Joystick6Button16=466,
		Joystick6Button17=467,
		Joystick6Button18=468,
		Joystick6Button19=469,
		Joystick7Button0=470,
		Joystick7Button1=471,
		Joystick7Button2=472,
		Joystick7Button3=473,
		Joystick7Button4=474,
		Joystick7Button5=475,
		Joystick7Button6=476,
		Joystick7Button7=477,
		Joystick7Button8=478,
		Joystick7Button9=479,
		Joystick7Button10=480,
		Joystick7Button11=481,
		Joystick7Button12=482,
		Joystick7Button13=483,
		Joystick7Button14=484,
		Joystick7Button15=485,
		Joystick7Button16=486,
		Joystick7Button17=487,
		Joystick7Button18=488,
		Joystick7Button19=489,
		Joystick8Button0=490,
		Joystick8Button1=491,
		Joystick8Button2=492,
		Joystick8Button3=493,
		Joystick8Button4=494,
		Joystick8Button5=495,
		Joystick8Button6=496,
		Joystick8Button7=497,
		Joystick8Button8=498,
		Joystick8Button9=499,
		Joystick8Button10=500,
		Joystick8Button11=501,
		Joystick8Button12=502,
		Joystick8Button13=503,
		Joystick8Button14=504,
		Joystick8Button15=505,
		Joystick8Button16=506,
		Joystick8Button17=507,
		Joystick8Button18=508,
		Joystick8Button19=509,
	}
}
declare module UnityEngine {
	export class UnityObject  {
		constructor();
		name: string;
		hideFlags: HideFlags;
		static Destroy(obj: UnityObject, t: number): void;
		static Destroy(obj: UnityObject): void;
		static DestroyImmediate(obj: UnityObject, allowDestroyingAssets: boolean): void;
		static DestroyImmediate(obj: UnityObject): void;
		static FindObjectsOfType(type: Type): UnityObject[];
		static DontDestroyOnLoad(target: UnityObject): void;
		static DestroyObject(obj: UnityObject, t: number): void;
		static DestroyObject(obj: UnityObject): void;
		ToString(): string;
		GetInstanceID(): number;
		GetHashCode(): number;
		Equals(other: Object): boolean;
		static op_Implicit(exists: UnityObject): boolean;
		static Instantiate(original: UnityObject, position: Vector3, rotation: Quaternion): UnityObject;
		static Instantiate(original: UnityObject, position: Vector3, rotation: Quaternion, parent: Transform): UnityObject;
		static Instantiate(original: UnityObject): UnityObject;
		static Instantiate(original: UnityObject, parent: Transform): UnityObject;
		static Instantiate(original: UnityObject, parent: Transform, instantiateInWorldSpace: boolean): UnityObject;
		static FindObjectOfType(type: Type): UnityObject;
		static op_Equality(x: UnityObject, y: UnityObject): boolean;
		static op_Inequality(x: UnityObject, y: UnityObject): boolean;
		static GetType() : UnityEngine.Type;
	}
	export class Type  {
		static readonly Delimiter: number;
		static readonly EmptyTypes: Type[];
		static readonly FilterAttribute: (m: Object, filterCriteria: Object)=>boolean;
		static readonly FilterName: (m: Object, filterCriteria: Object)=>boolean;
		static readonly FilterNameIgnoreCase: (m: Object, filterCriteria: Object)=>boolean;
		static readonly Missing: Object;
		readonly Assembly: Object;
		readonly AssemblyQualifiedName: string;
		readonly Attributes: TypeAttributes;
		readonly BaseType: Type;
		readonly DeclaringType: Type;
		static readonly DefaultBinder: Object;
		readonly FullName: string;
		readonly GUID: Object;
		readonly HasElementType: boolean;
		readonly IsAbstract: boolean;
		readonly IsAnsiClass: boolean;
		readonly IsArray: boolean;
		readonly IsAutoClass: boolean;
		readonly IsAutoLayout: boolean;
		readonly IsByRef: boolean;
		readonly IsClass: boolean;
		readonly IsCOMObject: boolean;
		readonly IsContextful: boolean;
		readonly IsEnum: boolean;
		readonly IsExplicitLayout: boolean;
		readonly IsImport: boolean;
		readonly IsInterface: boolean;
		readonly IsLayoutSequential: boolean;
		readonly IsMarshalByRef: boolean;
		readonly IsNestedAssembly: boolean;
		readonly IsNestedFamANDAssem: boolean;
		readonly IsNestedFamily: boolean;
		readonly IsNestedFamORAssem: boolean;
		readonly IsNestedPrivate: boolean;
		readonly IsNestedPublic: boolean;
		readonly IsNotPublic: boolean;
		readonly IsPointer: boolean;
		readonly IsPrimitive: boolean;
		readonly IsPublic: boolean;
		readonly IsSealed: boolean;
		readonly IsSerializable: boolean;
		readonly IsSpecialName: boolean;
		readonly IsUnicodeClass: boolean;
		readonly IsValueType: boolean;
		readonly MemberType: MemberTypes;
		readonly Module: Object;
		readonly Namespace: string;
		readonly ReflectedType: Type;
		readonly TypeHandle: Object;
		readonly TypeInitializer: Object;
		readonly UnderlyingSystemType: Type;
		readonly ContainsGenericParameters: boolean;
		readonly IsGenericTypeDefinition: boolean;
		readonly IsGenericType: boolean;
		readonly IsGenericParameter: boolean;
		readonly IsNested: boolean;
		readonly IsVisible: boolean;
		readonly GenericParameterPosition: number;
		readonly GenericParameterAttributes: GenericParameterAttributes;
		readonly DeclaringMethod: Object;
		readonly StructLayoutAttribute: Object;
		Equals(o: Object): boolean;
		Equals(o: Type): boolean;
		static GetType(typeName: string): Type;
		static GetType(typeName: string, throwOnError: boolean): Type;
		static GetType(typeName: string, throwOnError: boolean, ignoreCase: boolean): Type;
		static GetTypeArray(args: Object[]): Type[];
		static GetTypeCode(type: Type): TypeCode;
		static GetTypeFromCLSID(clsid: Object): Type;
		static GetTypeFromCLSID(clsid: Object, throwOnError: boolean): Type;
		static GetTypeFromCLSID(clsid: Object, server: string): Type;
		static GetTypeFromCLSID(clsid: Object, server: string, throwOnError: boolean): Type;
		static GetTypeFromHandle(handle: Object): Type;
		static GetTypeFromProgID(progID: string): Type;
		static GetTypeFromProgID(progID: string, throwOnError: boolean): Type;
		static GetTypeFromProgID(progID: string, server: string): Type;
		static GetTypeFromProgID(progID: string, server: string, throwOnError: boolean): Type;
		static GetTypeHandle(o: Object): Object;
		GetType(): Type;
		IsSubclassOf(c: Type): boolean;
		FindInterfaces(filter: (m: UnityEngine.Type, filterCriteria: Object)=>boolean, filterCriteria: Object): Type[];
		GetInterface(name: string): Type;
		GetInterface(name: string, ignoreCase: boolean): Type;
		GetInterfaceMap(interfaceType: Type): Object;
		GetInterfaces(): Type[];
		IsAssignableFrom(c: Type): boolean;
		IsInstanceOfType(o: Object): boolean;
		GetArrayRank(): number;
		GetElementType(): Type;
		GetEvent(name: string): Object;
		GetEvent(name: string, bindingAttr: BindingFlags): Object;
		GetEvents(): Object[];
		GetEvents(bindingAttr: BindingFlags): Object[];
		GetField(name: string): Object;
		GetField(name: string, bindingAttr: BindingFlags): Object;
		GetFields(): Object[];
		GetFields(bindingAttr: BindingFlags): Object[];
		GetHashCode(): number;
		GetMember(name: string): Object[];
		GetMember(name: string, bindingAttr: BindingFlags): Object[];
		GetMember(name: string, type: MemberTypes, bindingAttr: BindingFlags): Object[];
		GetMembers(): Object[];
		GetMembers(bindingAttr: BindingFlags): Object[];
		GetMethod(name: string): Object;
		GetMethod(name: string, bindingAttr: BindingFlags): Object;
		GetMethod(name: string, types: Type[]): Object;
		GetMethod(name: string, types: Type[], modifiers: Object[]): Object;
		GetMethod(name: string, bindingAttr: BindingFlags, binder: Object, types: Type[], modifiers: Object[]): Object;
		GetMethod(name: string, bindingAttr: BindingFlags, binder: Object, callConvention: CallingConventions, types: Type[], modifiers: Object[]): Object;
		GetMethods(): Object[];
		GetMethods(bindingAttr: BindingFlags): Object[];
		GetNestedType(name: string): Type;
		GetNestedType(name: string, bindingAttr: BindingFlags): Type;
		GetNestedTypes(): Type[];
		GetNestedTypes(bindingAttr: BindingFlags): Type[];
		GetProperties(): Object[];
		GetProperties(bindingAttr: BindingFlags): Object[];
		GetProperty(name: string): Object;
		GetProperty(name: string, bindingAttr: BindingFlags): Object;
		GetProperty(name: string, returnType: Type): Object;
		GetProperty(name: string, types: Type[]): Object;
		GetProperty(name: string, returnType: Type, types: Type[]): Object;
		GetProperty(name: string, returnType: Type, types: Type[], modifiers: Object[]): Object;
		GetProperty(name: string, bindingAttr: BindingFlags, binder: Object, returnType: Type, types: Type[], modifiers: Object[]): Object;
		GetConstructor(types: Type[]): Object;
		GetConstructor(bindingAttr: BindingFlags, binder: Object, types: Type[], modifiers: Object[]): Object;
		GetConstructor(bindingAttr: BindingFlags, binder: Object, callConvention: CallingConventions, types: Type[], modifiers: Object[]): Object;
		GetConstructors(): Object[];
		GetConstructors(bindingAttr: BindingFlags): Object[];
		GetDefaultMembers(): Object[];
		FindMembers(memberType: MemberTypes, bindingAttr: BindingFlags, filter: (m: Object, filterCriteria: Object)=>boolean, filterCriteria: Object): Object[];
		InvokeMember(name: string, invokeAttr: BindingFlags, binder: Object, target: Object, args: Object[]): Object;
		InvokeMember(name: string, invokeAttr: BindingFlags, binder: Object, target: Object, args: Object[], culture: Object): Object;
		InvokeMember(name: string, invokeAttr: BindingFlags, binder: Object, target: Object, args: Object[], modifiers: Object[], culture: Object, namedParameters: string[]): Object;
		ToString(): string;
		GetGenericArguments(): Type[];
		GetGenericTypeDefinition(): Type;
		MakeGenericType(typeArguments: Type[]): Type;
		GetGenericParameterConstraints(): Type[];
		MakeArrayType(): Type;
		MakeArrayType(rank: number): Type;
		MakeByRefType(): Type;
		MakePointerType(): Type;
		static ReflectionOnlyGetType(typeName: string, throwIfNotFound: boolean, ignoreCase: boolean): Type;
	}
	export class Component extends UnityObject {
		constructor();
		readonly transform: Transform;
		readonly gameObject: GameObject;
		tag: string;
		GetComponent(type: Type): Component;
		GetComponent(type: string): Component;
		GetComponentInChildren(t: Type, includeInactive: boolean): Component;
		GetComponentInChildren(t: Type): Component;
		GetComponentsInChildren(t: Type): Component[];
		GetComponentsInChildren(t: Type, includeInactive: boolean): Component[];
		GetComponentInParent(t: Type): Component;
		GetComponentsInParent(t: Type): Component[];
		GetComponentsInParent(t: Type, includeInactive: boolean): Component[];
		GetComponents(type: Type): Component[];
		GetComponents(type: Type, results: Component[]): void;
		CompareTag(tag: string): boolean;
		SendMessageUpwards(methodName: string, value: Object, options: SendMessageOptions): void;
		SendMessageUpwards(methodName: string, value: Object): void;
		SendMessageUpwards(methodName: string): void;
		SendMessageUpwards(methodName: string, options: SendMessageOptions): void;
		SendMessage(methodName: string, value: Object, options: SendMessageOptions): void;
		SendMessage(methodName: string, value: Object): void;
		SendMessage(methodName: string): void;
		SendMessage(methodName: string, options: SendMessageOptions): void;
		BroadcastMessage(methodName: string, parameter: Object, options: SendMessageOptions): void;
		BroadcastMessage(methodName: string, parameter: Object): void;
		BroadcastMessage(methodName: string): void;
		BroadcastMessage(methodName: string, options: SendMessageOptions): void;
		static GetType() : UnityEngine.Type;
	}
	export class Behaviour extends Component {
		constructor();
		enabled: boolean;
		readonly isActiveAndEnabled: boolean;
		static GetType() : UnityEngine.Type;
	}
	export class MonoBehaviour extends Behaviour {
		constructor();
		useGUILayout: boolean;
		Invoke(methodName: string, time: number): void;
		InvokeRepeating(methodName: string, time: number, repeatRate: number): void;
		CancelInvoke(): void;
		CancelInvoke(methodName: string): void;
		IsInvoking(methodName: string): boolean;
		IsInvoking(): boolean;
		StartCoroutine(routine: Object): Object;
		StartCoroutine(methodName: string, value: Object): Object;
		StartCoroutine(methodName: string): Object;
		StopCoroutine(methodName: string): void;
		StopCoroutine(routine: Object): void;
		StopCoroutine(routine: Object): void;
		StopAllCoroutines(): void;
		static print(message: Object): void;
		static GetType() : UnityEngine.Type;
	}
	export class Collider extends Component {
		constructor();
		enabled: boolean;
		readonly attachedRigidbody: Object;
		isTrigger: boolean;
		contactOffset: number;
		material: Object;
		sharedMaterial: Object;
		readonly bounds: Bounds;
		ClosestPointOnBounds(position: Vector3): Vector3;
		ClosestPoint(position: Vector3): Vector3;
		Raycast(ray: Object, hitInfo: Object, maxDistance: number): boolean;
		static GetType() : UnityEngine.Type;
	}
	export class Texture extends UnityObject {
		constructor();
		static masterTextureLimit: number;
		static anisotropicFiltering: AnisotropicFiltering;
		width: number;
		height: number;
		dimension: TextureDimension;
		filterMode: FilterMode;
		anisoLevel: number;
		wrapMode: TextureWrapMode;
		mipMapBias: number;
		readonly texelSize: Vector2;
		static SetGlobalAnisotropicFilteringLimits(forcedMin: number, globalMax: number): void;
		GetNativeTexturePtr(): Object;
		static GetType() : UnityEngine.Type;
	}
	export class Renderer extends Component {
		constructor();
		readonly isPartOfStaticBatch: boolean;
		readonly worldToLocalMatrix: Object;
		readonly localToWorldMatrix: Object;
		enabled: boolean;
		shadowCastingMode: ShadowCastingMode;
		receiveShadows: boolean;
		material: Material;
		sharedMaterial: Material;
		materials: Material[];
		sharedMaterials: Material[];
		readonly bounds: Bounds;
		lightmapIndex: number;
		realtimeLightmapIndex: number;
		lightmapScaleOffset: Vector4;
		motionVectorGenerationMode: MotionVectorGenerationMode;
		realtimeLightmapScaleOffset: Vector4;
		readonly isVisible: boolean;
		lightProbeUsage: LightProbeUsage;
		lightProbeProxyVolumeOverride: GameObject;
		probeAnchor: Transform;
		reflectionProbeUsage: ReflectionProbeUsage;
		sortingLayerName: string;
		sortingLayerID: number;
		sortingOrder: number;
		SetPropertyBlock(properties: Object): void;
		GetPropertyBlock(dest: Object): void;
		GetClosestReflectionProbes(result: Object[]): void;
		static GetType() : UnityEngine.Type;
	}
	export class PlayerPrefs  {
		constructor();
		static SetInt(key: string, value: number): void;
		static GetInt(key: string, defaultValue: number): number;
		static GetInt(key: string): number;
		static SetFloat(key: string, value: number): void;
		static GetFloat(key: string, defaultValue: number): number;
		static GetFloat(key: string): number;
		static SetString(key: string, value: string): void;
		static GetString(key: string, defaultValue: string): string;
		static GetString(key: string): string;
		static HasKey(key: string): boolean;
		static DeleteKey(key: string): void;
		static DeleteAll(): void;
		static Save(): void;
		static GetType() : UnityEngine.Type;
	}
	export class Sprite extends UnityObject {
		constructor();
		readonly bounds: Bounds;
		readonly rect: Rect;
		readonly pixelsPerUnit: number;
		readonly texture: Texture2D;
		readonly associatedAlphaSplitTexture: Texture2D;
		readonly textureRect: Rect;
		readonly textureRectOffset: Vector2;
		readonly packed: boolean;
		readonly packingMode: SpritePackingMode;
		readonly packingRotation: SpritePackingRotation;
		readonly pivot: Vector2;
		readonly border: Vector4;
		readonly vertices: Vector2[];
		readonly triangles: number[];
		readonly uv: Vector2[];
		static Create(texture: Texture2D, rect: Rect, pivot: Vector2, pixelsPerUnit: number, extrude: number, meshType: SpriteMeshType, border: Vector4): Sprite;
		static Create(texture: Texture2D, rect: Rect, pivot: Vector2, pixelsPerUnit: number, extrude: number, meshType: SpriteMeshType): Sprite;
		static Create(texture: Texture2D, rect: Rect, pivot: Vector2, pixelsPerUnit: number, extrude: number): Sprite;
		static Create(texture: Texture2D, rect: Rect, pivot: Vector2, pixelsPerUnit: number): Sprite;
		static Create(texture: Texture2D, rect: Rect, pivot: Vector2): Sprite;
		OverrideGeometry(vertices: Vector2[], triangles: number[]): void;
		static GetType() : UnityEngine.Type;
	}
	export class AnimationCurve  {
		constructor(keys: Keyframe[]);
		constructor();
		keys: Keyframe[];
		readonly length: number;
		preWrapMode: WrapMode;
		postWrapMode: WrapMode;
		Evaluate(time: number): number;
		AddKey(time: number, value: number): number;
		AddKey(key: Keyframe): number;
		MoveKey(index: number, key: Keyframe): number;
		RemoveKey(index: number): void;
		SmoothTangents(index: number, weight: number): void;
		static Linear(timeStart: number, valueStart: number, timeEnd: number, valueEnd: number): AnimationCurve;
		static EaseInOut(timeStart: number, valueStart: number, timeEnd: number, valueEnd: number): AnimationCurve;
		static GetType() : UnityEngine.Type;
	}
	export class AsyncOperation  {
		constructor();
		readonly isDone: boolean;
		readonly progress: number;
		priority: number;
		allowSceneActivation: boolean;
		static GetType() : UnityEngine.Type;
	}
	export class NavMesh  {
		static onPreUpdate: ()=>void;
		static readonly AllAreas: number;
		static avoidancePredictionTime: number;
		static pathfindingIterationsPerFrame: number;
		static Raycast(sourcePosition: Vector3, targetPosition: Vector3, hit: Object, areaMask: number): boolean;
		static CalculatePath(sourcePosition: Vector3, targetPosition: Vector3, areaMask: number, path: NavMeshPath): boolean;
		static FindClosestEdge(sourcePosition: Vector3, hit: Object, areaMask: number): boolean;
		static SamplePosition(sourcePosition: Vector3, hit: Object, maxDistance: number, areaMask: number): boolean;
		static SetAreaCost(areaIndex: number, cost: number): void;
		static GetAreaCost(areaIndex: number): number;
		static GetAreaFromName(areaName: string): number;
		static CalculateTriangulation(): Object;
		static AddNavMeshData(navMeshData: Object): Object;
		static AddNavMeshData(navMeshData: Object, position: Vector3, rotation: Quaternion): Object;
		static RemoveNavMeshData(handle: Object): void;
		static AddLink(link: Object): Object;
		static AddLink(link: Object, position: Vector3, rotation: Quaternion): Object;
		static RemoveLink(handle: Object): void;
		static SamplePosition(sourcePosition: Vector3, hit: Object, maxDistance: number, filter: Object): boolean;
		static FindClosestEdge(sourcePosition: Vector3, hit: Object, filter: Object): boolean;
		static Raycast(sourcePosition: Vector3, targetPosition: Vector3, hit: Object, filter: Object): boolean;
		static CalculatePath(sourcePosition: Vector3, targetPosition: Vector3, filter: Object, path: NavMeshPath): boolean;
		static CreateSettings(): Object;
		static RemoveSettings(agentTypeID: number): void;
		static GetSettingsByID(agentTypeID: number): Object;
		static GetSettingsCount(): number;
		static GetSettingsByIndex(index: number): Object;
		static GetSettingsNameFromID(agentTypeID: number): string;
		static GetType() : UnityEngine.Type;
	}
	export class NavMeshHit  {
		position: Vector3;
		normal: Vector3;
		distance: number;
		mask: number;
		hit: boolean;
		static GetType() : UnityEngine.Type;
	}
	export class NavMeshPath  {
		constructor();
		readonly corners: Vector3[];
		readonly status: NavMeshPathStatus;
		GetCornersNonAlloc(results: Vector3[]): number;
		ClearCorners(): void;
		static GetType() : UnityEngine.Type;
	}
	export class BoxCollider extends Collider {
		constructor();
		center: Vector3;
		size: Vector3;
		static GetType() : UnityEngine.Type;
	}
	export class TextAsset extends UnityObject {
		constructor();
		readonly text: string;
		readonly bytes: number[];
		ToString(): string;
		static GetType() : UnityEngine.Type;
	}
	export class Shader extends UnityObject {
		constructor();
		readonly isSupported: boolean;
		maximumLOD: number;
		static globalMaximumLOD: number;
		static globalRenderPipeline: string;
		readonly renderQueue: number;
		static Find(name: string): Shader;
		static EnableKeyword(keyword: string): void;
		static DisableKeyword(keyword: string): void;
		static IsKeywordEnabled(keyword: string): boolean;
		static SetGlobalBuffer(nameID: number, buffer: Object): void;
		static PropertyToID(name: string): number;
		static WarmupAllShaders(): void;
		static SetGlobalFloat(name: string, value: number): void;
		static SetGlobalFloat(nameID: number, value: number): void;
		static SetGlobalInt(name: string, value: number): void;
		static SetGlobalInt(nameID: number, value: number): void;
		static SetGlobalVector(name: string, value: Vector4): void;
		static SetGlobalVector(nameID: number, value: Vector4): void;
		static SetGlobalColor(name: string, value: Color): void;
		static SetGlobalColor(nameID: number, value: Color): void;
		static SetGlobalMatrix(name: string, value: Object): void;
		static SetGlobalMatrix(nameID: number, value: Object): void;
		static SetGlobalTexture(name: string, value: Texture): void;
		static SetGlobalTexture(nameID: number, value: Texture): void;
		static SetGlobalBuffer(name: string, buffer: Object): void;
		static SetGlobalFloatArray(name: string, values: number[]): void;
		static SetGlobalFloatArray(nameID: number, values: number[]): void;
		static SetGlobalFloatArray(name: string, values: number[]): void;
		static SetGlobalFloatArray(nameID: number, values: number[]): void;
		static SetGlobalVectorArray(name: string, values: Vector4[]): void;
		static SetGlobalVectorArray(nameID: number, values: Vector4[]): void;
		static SetGlobalVectorArray(name: string, values: Vector4[]): void;
		static SetGlobalVectorArray(nameID: number, values: Vector4[]): void;
		static SetGlobalMatrixArray(name: string, values: Object[]): void;
		static SetGlobalMatrixArray(nameID: number, values: Object[]): void;
		static SetGlobalMatrixArray(name: string, values: Object[]): void;
		static SetGlobalMatrixArray(nameID: number, values: Object[]): void;
		static GetGlobalFloat(name: string): number;
		static GetGlobalFloat(nameID: number): number;
		static GetGlobalInt(name: string): number;
		static GetGlobalInt(nameID: number): number;
		static GetGlobalVector(name: string): Vector4;
		static GetGlobalVector(nameID: number): Vector4;
		static GetGlobalColor(name: string): Color;
		static GetGlobalColor(nameID: number): Color;
		static GetGlobalMatrix(name: string): Object;
		static GetGlobalMatrix(nameID: number): Object;
		static GetGlobalTexture(name: string): Texture;
		static GetGlobalTexture(nameID: number): Texture;
		static GetGlobalFloatArray(name: string, values: number[]): void;
		static GetGlobalFloatArray(nameID: number, values: number[]): void;
		static GetGlobalFloatArray(name: string): number[];
		static GetGlobalFloatArray(nameID: number): number[];
		static GetGlobalVectorArray(name: string, values: Vector4[]): void;
		static GetGlobalVectorArray(nameID: number, values: Vector4[]): void;
		static GetGlobalVectorArray(name: string): Vector4[];
		static GetGlobalVectorArray(nameID: number): Vector4[];
		static GetGlobalMatrixArray(name: string, values: Object[]): void;
		static GetGlobalMatrixArray(nameID: number, values: Object[]): void;
		static GetGlobalMatrixArray(name: string): Object[];
		static GetGlobalMatrixArray(nameID: number): Object[];
		static GetType() : UnityEngine.Type;
	}
	export class Material extends UnityObject {
		constructor(shader: Shader);
		constructor(source: Material);
		shader: Shader;
		color: Color;
		mainTexture: Texture;
		mainTextureOffset: Vector2;
		mainTextureScale: Vector2;
		readonly passCount: number;
		renderQueue: number;
		shaderKeywords: string[];
		globalIlluminationFlags: MaterialGlobalIlluminationFlags;
		enableInstancing: boolean;
		doubleSidedGI: boolean;
		HasProperty(propertyName: string): boolean;
		HasProperty(nameID: number): boolean;
		GetTag(tag: string, searchFallbacks: boolean, defaultValue: string): string;
		GetTag(tag: string, searchFallbacks: boolean): string;
		SetOverrideTag(tag: string, val: string): void;
		SetShaderPassEnabled(passName: string, enabled: boolean): void;
		GetShaderPassEnabled(passName: string): boolean;
		Lerp(start: Material, end: Material, t: number): void;
		SetPass(pass: number): boolean;
		GetPassName(pass: number): string;
		FindPass(passName: string): number;
		CopyPropertiesFromMaterial(mat: Material): void;
		EnableKeyword(keyword: string): void;
		DisableKeyword(keyword: string): void;
		IsKeywordEnabled(keyword: string): boolean;
		SetFloat(name: string, value: number): void;
		SetFloat(nameID: number, value: number): void;
		SetInt(name: string, value: number): void;
		SetInt(nameID: number, value: number): void;
		SetColor(name: string, value: Color): void;
		SetColor(nameID: number, value: Color): void;
		SetVector(name: string, value: Vector4): void;
		SetVector(nameID: number, value: Vector4): void;
		SetMatrix(name: string, value: Object): void;
		SetMatrix(nameID: number, value: Object): void;
		SetTexture(name: string, value: Texture): void;
		SetTexture(nameID: number, value: Texture): void;
		SetBuffer(name: string, value: Object): void;
		SetBuffer(nameID: number, value: Object): void;
		SetTextureOffset(name: string, value: Vector2): void;
		SetTextureOffset(nameID: number, value: Vector2): void;
		SetTextureScale(name: string, value: Vector2): void;
		SetTextureScale(nameID: number, value: Vector2): void;
		SetFloatArray(name: string, values: number[]): void;
		SetFloatArray(nameID: number, values: number[]): void;
		SetFloatArray(name: string, values: number[]): void;
		SetFloatArray(nameID: number, values: number[]): void;
		SetColorArray(name: string, values: Color[]): void;
		SetColorArray(nameID: number, values: Color[]): void;
		SetColorArray(name: string, values: Color[]): void;
		SetColorArray(nameID: number, values: Color[]): void;
		SetVectorArray(name: string, values: Vector4[]): void;
		SetVectorArray(nameID: number, values: Vector4[]): void;
		SetVectorArray(name: string, values: Vector4[]): void;
		SetVectorArray(nameID: number, values: Vector4[]): void;
		SetMatrixArray(name: string, values: Object[]): void;
		SetMatrixArray(nameID: number, values: Object[]): void;
		SetMatrixArray(name: string, values: Object[]): void;
		SetMatrixArray(nameID: number, values: Object[]): void;
		GetFloat(name: string): number;
		GetFloat(nameID: number): number;
		GetInt(name: string): number;
		GetInt(nameID: number): number;
		GetColor(name: string): Color;
		GetColor(nameID: number): Color;
		GetVector(name: string): Vector4;
		GetVector(nameID: number): Vector4;
		GetMatrix(name: string): Object;
		GetMatrix(nameID: number): Object;
		GetFloatArray(name: string, values: number[]): void;
		GetFloatArray(nameID: number, values: number[]): void;
		GetFloatArray(name: string): number[];
		GetFloatArray(nameID: number): number[];
		GetVectorArray(name: string, values: Vector4[]): void;
		GetVectorArray(nameID: number, values: Vector4[]): void;
		GetColorArray(name: string): Color[];
		GetColorArray(nameID: number): Color[];
		GetColorArray(name: string, values: Color[]): void;
		GetColorArray(nameID: number, values: Color[]): void;
		GetVectorArray(name: string): Vector4[];
		GetVectorArray(nameID: number): Vector4[];
		GetMatrixArray(name: string, values: Object[]): void;
		GetMatrixArray(nameID: number, values: Object[]): void;
		GetMatrixArray(name: string): Object[];
		GetMatrixArray(nameID: number): Object[];
		GetTexture(name: string): Texture;
		GetTexture(nameID: number): Texture;
		GetTextureOffset(name: string): Vector2;
		GetTextureOffset(nameID: number): Vector2;
		GetTextureScale(name: string): Vector2;
		GetTextureScale(nameID: number): Vector2;
		static GetType() : UnityEngine.Type;
	}
	export class Texture2D extends Texture {
		constructor(width: number, height: number);
		constructor(width: number, height: number, format: TextureFormat, mipmap: boolean);
		constructor(width: number, height: number, format: TextureFormat, mipmap: boolean, linear: boolean);
		readonly mipmapCount: number;
		readonly format: TextureFormat;
		static readonly whiteTexture: Texture2D;
		static readonly blackTexture: Texture2D;
		static CreateExternalTexture(width: number, height: number, format: TextureFormat, mipmap: boolean, linear: boolean, nativeTex: Object): Texture2D;
		UpdateExternalTexture(nativeTex: Object): void;
		SetPixel(x: number, y: number, color: Color): void;
		GetPixel(x: number, y: number): Color;
		GetPixelBilinear(u: number, v: number): Color;
		SetPixels(colors: Color[]): void;
		SetPixels(colors: Color[], miplevel: number): void;
		SetPixels(x: number, y: number, blockWidth: number, blockHeight: number, colors: Color[], miplevel: number): void;
		SetPixels(x: number, y: number, blockWidth: number, blockHeight: number, colors: Color[]): void;
		SetPixels32(colors: Color32[]): void;
		SetPixels32(colors: Color32[], miplevel: number): void;
		SetPixels32(x: number, y: number, blockWidth: number, blockHeight: number, colors: Color32[]): void;
		SetPixels32(x: number, y: number, blockWidth: number, blockHeight: number, colors: Color32[], miplevel: number): void;
		LoadImage(data: number[], markNonReadable: boolean): boolean;
		LoadImage(data: number[]): boolean;
		LoadRawTextureData(data: number[]): void;
		LoadRawTextureData(data: Object, size: number): void;
		GetRawTextureData(): number[];
		GetPixels(): Color[];
		GetPixels(miplevel: number): Color[];
		GetPixels(x: number, y: number, blockWidth: number, blockHeight: number, miplevel: number): Color[];
		GetPixels(x: number, y: number, blockWidth: number, blockHeight: number): Color[];
		GetPixels32(miplevel: number): Color32[];
		GetPixels32(): Color32[];
		Apply(updateMipmaps: boolean, makeNoLongerReadable: boolean): void;
		Apply(updateMipmaps: boolean): void;
		Apply(): void;
		Resize(width: number, height: number, format: TextureFormat, hasMipMap: boolean): boolean;
		Resize(width: number, height: number): boolean;
		Compress(highQuality: boolean): void;
		PackTextures(textures: Texture2D[], padding: number, maximumAtlasSize: number, makeNoLongerReadable: boolean): Rect[];
		PackTextures(textures: Texture2D[], padding: number, maximumAtlasSize: number): Rect[];
		PackTextures(textures: Texture2D[], padding: number): Rect[];
		static GenerateAtlas(sizes: Vector2[], padding: number, atlasSize: number, results: Rect[]): boolean;
		ReadPixels(source: Rect, destX: number, destY: number, recalculateMipMaps: boolean): void;
		ReadPixels(source: Rect, destX: number, destY: number): void;
		EncodeToPNG(): number[];
		EncodeToJPG(quality: number): number[];
		EncodeToJPG(): number[];
		EncodeToEXR(flags: Texture2D.EXRFlags): number[];
		EncodeToEXR(): number[];
		static GetType() : UnityEngine.Type;
	}
	export class RenderTexture extends Texture {
		constructor(width: number, height: number, depth: number, format: RenderTextureFormat, readWrite: RenderTextureReadWrite);
		constructor(width: number, height: number, depth: number, format: RenderTextureFormat);
		constructor(width: number, height: number, depth: number);
		width: number;
		height: number;
		depth: number;
		isPowerOfTwo: boolean;
		readonly sRGB: boolean;
		format: RenderTextureFormat;
		useMipMap: boolean;
		autoGenerateMips: boolean;
		dimension: TextureDimension;
		volumeDepth: number;
		antiAliasing: number;
		enableRandomWrite: boolean;
		readonly colorBuffer: Object;
		readonly depthBuffer: Object;
		static active: RenderTexture;
		static GetTemporary(width: number, height: number, depthBuffer: number, format: RenderTextureFormat, readWrite: RenderTextureReadWrite, antiAliasing: number, vrUsage: VRTextureUsage): RenderTexture;
		static GetTemporary(width: number, height: number, depthBuffer: number, format: RenderTextureFormat, readWrite: RenderTextureReadWrite, antiAliasing: number): RenderTexture;
		static GetTemporary(width: number, height: number, depthBuffer: number, format: RenderTextureFormat, readWrite: RenderTextureReadWrite): RenderTexture;
		static GetTemporary(width: number, height: number, depthBuffer: number, format: RenderTextureFormat): RenderTexture;
		static GetTemporary(width: number, height: number, depthBuffer: number): RenderTexture;
		static GetTemporary(width: number, height: number): RenderTexture;
		static ReleaseTemporary(temp: RenderTexture): void;
		Create(): boolean;
		Release(): void;
		IsCreated(): boolean;
		DiscardContents(): void;
		DiscardContents(discardColor: boolean, discardDepth: boolean): void;
		MarkRestoreExpected(): void;
		GenerateMips(): void;
		GetNativeDepthBufferPtr(): Object;
		SetGlobalShaderProperty(propertyName: string): void;
		static SupportsStencil(rt: RenderTexture): boolean;
		static GetType() : UnityEngine.Type;
	}
	export class MeshRenderer extends Renderer {
		constructor();
		additionalVertexStreams: Object;
		static GetType() : UnityEngine.Type;
	}
	export class SkinnedMeshRenderer extends Renderer {
		constructor();
		bones: Transform[];
		rootBone: Transform;
		quality: SkinQuality;
		sharedMesh: Object;
		updateWhenOffscreen: boolean;
		skinnedMotionVectors: boolean;
		localBounds: Bounds;
		BakeMesh(mesh: Object): void;
		GetBlendShapeWeight(index: number): number;
		SetBlendShapeWeight(index: number, value: number): void;
		static GetType() : UnityEngine.Type;
	}
	export class ParticleSystemRenderer extends Renderer {
		constructor();
		renderMode: ParticleSystemRenderMode;
		lengthScale: number;
		velocityScale: number;
		cameraVelocityScale: number;
		normalDirection: number;
		alignment: ParticleSystemRenderSpace;
		pivot: Vector3;
		sortMode: ParticleSystemSortMode;
		sortingFudge: number;
		minParticleSize: number;
		maxParticleSize: number;
		mesh: Object;
		readonly meshCount: number;
		trailMaterial: Material;
		readonly activeVertexStreamsCount: number;
		GetMeshes(meshes: Object[]): number;
		SetMeshes(meshes: Object[]): void;
		SetMeshes(meshes: Object[], size: number): void;
		SetActiveVertexStreams(streams: ParticleSystemVertexStream[]): void;
		GetActiveVertexStreams(streams: ParticleSystemVertexStream[]): void;
		static GetType() : UnityEngine.Type;
	}
	export class GameObject extends UnityObject {
		constructor(name: string);
		constructor();
		constructor(name: string, components: Type[]);
		readonly transform: Transform;
		layer: number;
		readonly activeSelf: boolean;
		readonly activeInHierarchy: boolean;
		isStatic: boolean;
		tag: string;
		readonly scene: Object;
		readonly gameObject: GameObject;
		static CreatePrimitive(type: PrimitiveType): GameObject;
		GetComponent(type: Type): Component;
		GetComponent(type: string): Component;
		GetComponentInChildren(type: Type, includeInactive: boolean): Component;
		GetComponentInChildren(type: Type): Component;
		GetComponentInParent(type: Type): Component;
		GetComponents(type: Type): Component[];
		GetComponents(type: Type, results: Component[]): void;
		GetComponentsInChildren(type: Type): Component[];
		GetComponentsInChildren(type: Type, includeInactive: boolean): Component[];
		GetComponentsInParent(type: Type): Component[];
		GetComponentsInParent(type: Type, includeInactive: boolean): Component[];
		SetActive(value: boolean): void;
		CompareTag(tag: string): boolean;
		static FindGameObjectWithTag(tag: string): GameObject;
		static FindWithTag(tag: string): GameObject;
		static FindGameObjectsWithTag(tag: string): GameObject[];
		SendMessageUpwards(methodName: string, value: Object, options: SendMessageOptions): void;
		SendMessageUpwards(methodName: string, value: Object): void;
		SendMessageUpwards(methodName: string): void;
		SendMessageUpwards(methodName: string, options: SendMessageOptions): void;
		SendMessage(methodName: string, value: Object, options: SendMessageOptions): void;
		SendMessage(methodName: string, value: Object): void;
		SendMessage(methodName: string): void;
		SendMessage(methodName: string, options: SendMessageOptions): void;
		BroadcastMessage(methodName: string, parameter: Object, options: SendMessageOptions): void;
		BroadcastMessage(methodName: string, parameter: Object): void;
		BroadcastMessage(methodName: string): void;
		BroadcastMessage(methodName: string, options: SendMessageOptions): void;
		AddComponent(componentType: Type): Component;
		static Find(name: string): GameObject;
		static GetType() : UnityEngine.Type;
	}
	export class Transform extends Component {
		position: Vector3;
		localPosition: Vector3;
		eulerAngles: Vector3;
		localEulerAngles: Vector3;
		right: Vector3;
		up: Vector3;
		forward: Vector3;
		rotation: Quaternion;
		localRotation: Quaternion;
		localScale: Vector3;
		parent: Transform;
		readonly worldToLocalMatrix: Object;
		readonly localToWorldMatrix: Object;
		readonly root: Transform;
		readonly childCount: number;
		readonly lossyScale: Vector3;
		hasChanged: boolean;
		hierarchyCapacity: number;
		readonly hierarchyCount: number;
		SetParent(parent: Transform): void;
		SetParent(parent: Transform, worldPositionStays: boolean): void;
		SetPositionAndRotation(position: Vector3, rotation: Quaternion): void;
		Translate(translation: Vector3): void;
		Translate(translation: Vector3, relativeTo: Space): void;
		Translate(x: number, y: number, z: number): void;
		Translate(x: number, y: number, z: number, relativeTo: Space): void;
		Translate(translation: Vector3, relativeTo: Transform): void;
		Translate(x: number, y: number, z: number, relativeTo: Transform): void;
		Rotate(eulerAngles: Vector3): void;
		Rotate(eulerAngles: Vector3, relativeTo: Space): void;
		Rotate(xAngle: number, yAngle: number, zAngle: number): void;
		Rotate(xAngle: number, yAngle: number, zAngle: number, relativeTo: Space): void;
		Rotate(axis: Vector3, angle: number): void;
		Rotate(axis: Vector3, angle: number, relativeTo: Space): void;
		RotateAround(point: Vector3, axis: Vector3, angle: number): void;
		LookAt(target: Transform): void;
		LookAt(target: Transform, worldUp: Vector3): void;
		LookAt(worldPosition: Vector3, worldUp: Vector3): void;
		LookAt(worldPosition: Vector3): void;
		TransformDirection(direction: Vector3): Vector3;
		TransformDirection(x: number, y: number, z: number): Vector3;
		InverseTransformDirection(direction: Vector3): Vector3;
		InverseTransformDirection(x: number, y: number, z: number): Vector3;
		TransformVector(vector: Vector3): Vector3;
		TransformVector(x: number, y: number, z: number): Vector3;
		InverseTransformVector(vector: Vector3): Vector3;
		InverseTransformVector(x: number, y: number, z: number): Vector3;
		TransformPoint(position: Vector3): Vector3;
		TransformPoint(x: number, y: number, z: number): Vector3;
		InverseTransformPoint(position: Vector3): Vector3;
		InverseTransformPoint(x: number, y: number, z: number): Vector3;
		DetachChildren(): void;
		SetAsFirstSibling(): void;
		SetAsLastSibling(): void;
		SetSiblingIndex(index: number): void;
		GetSiblingIndex(): number;
		Find(name: string): Transform;
		IsChildOf(parent: Transform): boolean;
		GetEnumerator(): Object;
		GetChild(index: number): Transform;
		static GetType() : UnityEngine.Type;
	}
	export class Animator extends Behaviour {
		constructor();
		readonly isOptimizable: boolean;
		readonly isHuman: boolean;
		readonly hasRootMotion: boolean;
		readonly humanScale: number;
		readonly isInitialized: boolean;
		readonly deltaPosition: Vector3;
		readonly deltaRotation: Quaternion;
		readonly velocity: Vector3;
		readonly angularVelocity: Vector3;
		rootPosition: Vector3;
		rootRotation: Quaternion;
		applyRootMotion: boolean;
		linearVelocityBlending: boolean;
		updateMode: AnimatorUpdateMode;
		readonly hasTransformHierarchy: boolean;
		readonly gravityWeight: number;
		bodyPosition: Vector3;
		bodyRotation: Quaternion;
		stabilizeFeet: boolean;
		readonly layerCount: number;
		readonly parameters: Object[];
		readonly parameterCount: number;
		feetPivotActive: number;
		readonly pivotWeight: number;
		readonly pivotPosition: Vector3;
		readonly isMatchingTarget: boolean;
		speed: number;
		readonly targetPosition: Vector3;
		readonly targetRotation: Quaternion;
		cullingMode: AnimatorCullingMode;
		playbackTime: number;
		recorderStartTime: number;
		recorderStopTime: number;
		readonly recorderMode: AnimatorRecorderMode;
		runtimeAnimatorController: Object;
		readonly hasBoundPlayables: boolean;
		avatar: Object;
		readonly playableGraph: Object;
		layersAffectMassCenter: boolean;
		readonly leftFeetBottomHeight: number;
		readonly rightFeetBottomHeight: number;
		logWarnings: boolean;
		fireEvents: boolean;
		GetFloat(name: string): number;
		GetFloat(id: number): number;
		SetFloat(name: string, value: number): void;
		SetFloat(name: string, value: number, dampTime: number, deltaTime: number): void;
		SetFloat(id: number, value: number): void;
		SetFloat(id: number, value: number, dampTime: number, deltaTime: number): void;
		GetBool(name: string): boolean;
		GetBool(id: number): boolean;
		SetBool(name: string, value: boolean): void;
		SetBool(id: number, value: boolean): void;
		GetInteger(name: string): number;
		GetInteger(id: number): number;
		SetInteger(name: string, value: number): void;
		SetInteger(id: number, value: number): void;
		SetTrigger(name: string): void;
		SetTrigger(id: number): void;
		ResetTrigger(name: string): void;
		ResetTrigger(id: number): void;
		IsParameterControlledByCurve(name: string): boolean;
		IsParameterControlledByCurve(id: number): boolean;
		GetIKPosition(goal: AvatarIKGoal): Vector3;
		SetIKPosition(goal: AvatarIKGoal, goalPosition: Vector3): void;
		GetIKRotation(goal: AvatarIKGoal): Quaternion;
		SetIKRotation(goal: AvatarIKGoal, goalRotation: Quaternion): void;
		GetIKPositionWeight(goal: AvatarIKGoal): number;
		SetIKPositionWeight(goal: AvatarIKGoal, value: number): void;
		GetIKRotationWeight(goal: AvatarIKGoal): number;
		SetIKRotationWeight(goal: AvatarIKGoal, value: number): void;
		GetIKHintPosition(hint: AvatarIKHint): Vector3;
		SetIKHintPosition(hint: AvatarIKHint, hintPosition: Vector3): void;
		GetIKHintPositionWeight(hint: AvatarIKHint): number;
		SetIKHintPositionWeight(hint: AvatarIKHint, value: number): void;
		SetLookAtPosition(lookAtPosition: Vector3): void;
		SetLookAtWeight(weight: number, bodyWeight: number, headWeight: number, eyesWeight: number): void;
		SetLookAtWeight(weight: number, bodyWeight: number, headWeight: number): void;
		SetLookAtWeight(weight: number, bodyWeight: number): void;
		SetLookAtWeight(weight: number): void;
		SetLookAtWeight(weight: number, bodyWeight: number, headWeight: number, eyesWeight: number, clampWeight: number): void;
		SetBoneLocalRotation(humanBoneId: HumanBodyBones, rotation: Quaternion): void;
		GetLayerName(layerIndex: number): string;
		GetLayerIndex(layerName: string): number;
		GetLayerWeight(layerIndex: number): number;
		SetLayerWeight(layerIndex: number, weight: number): void;
		GetCurrentAnimatorStateInfo(layerIndex: number): Object;
		GetNextAnimatorStateInfo(layerIndex: number): Object;
		GetAnimatorTransitionInfo(layerIndex: number): Object;
		GetCurrentAnimatorClipInfoCount(layerIndex: number): number;
		GetCurrentAnimatorClipInfo(layerIndex: number): Object[];
		GetCurrentAnimatorClipInfo(layerIndex: number, clips: Object[]): void;
		GetNextAnimatorClipInfoCount(layerIndex: number): number;
		GetNextAnimatorClipInfo(layerIndex: number): Object[];
		GetNextAnimatorClipInfo(layerIndex: number, clips: Object[]): void;
		IsInTransition(layerIndex: number): boolean;
		GetParameter(index: number): Object;
		MatchTarget(matchPosition: Vector3, matchRotation: Quaternion, targetBodyPart: AvatarTarget, weightMask: Object, startNormalizedTime: number, targetNormalizedTime: number): void;
		MatchTarget(matchPosition: Vector3, matchRotation: Quaternion, targetBodyPart: AvatarTarget, weightMask: Object, startNormalizedTime: number): void;
		InterruptMatchTarget(completeMatch: boolean): void;
		InterruptMatchTarget(): void;
		CrossFadeInFixedTime(stateName: string, transitionDuration: number, layer: number): void;
		CrossFadeInFixedTime(stateName: string, transitionDuration: number): void;
		CrossFadeInFixedTime(stateName: string, transitionDuration: number, layer: number, fixedTime: number): void;
		CrossFadeInFixedTime(stateNameHash: number, transitionDuration: number, layer: number, fixedTime: number): void;
		CrossFadeInFixedTime(stateNameHash: number, transitionDuration: number, layer: number): void;
		CrossFadeInFixedTime(stateNameHash: number, transitionDuration: number): void;
		CrossFade(stateName: string, transitionDuration: number, layer: number): void;
		CrossFade(stateName: string, transitionDuration: number): void;
		CrossFade(stateName: string, transitionDuration: number, layer: number, normalizedTime: number): void;
		CrossFade(stateNameHash: number, transitionDuration: number, layer: number, normalizedTime: number): void;
		CrossFade(stateNameHash: number, transitionDuration: number, layer: number): void;
		CrossFade(stateNameHash: number, transitionDuration: number): void;
		PlayInFixedTime(stateName: string, layer: number): void;
		PlayInFixedTime(stateName: string): void;
		PlayInFixedTime(stateName: string, layer: number, fixedTime: number): void;
		PlayInFixedTime(stateNameHash: number, layer: number, fixedTime: number): void;
		PlayInFixedTime(stateNameHash: number, layer: number): void;
		PlayInFixedTime(stateNameHash: number): void;
		Play(stateName: string, layer: number): void;
		Play(stateName: string): void;
		Play(stateName: string, layer: number, normalizedTime: number): void;
		Play(stateNameHash: number, layer: number, normalizedTime: number): void;
		Play(stateNameHash: number, layer: number): void;
		Play(stateNameHash: number): void;
		SetTarget(targetIndex: AvatarTarget, targetNormalizedTime: number): void;
		GetBoneTransform(humanBoneId: HumanBodyBones): Transform;
		StartPlayback(): void;
		StopPlayback(): void;
		StartRecording(frameCount: number): void;
		StopRecording(): void;
		HasState(layerIndex: number, stateID: number): boolean;
		static StringToHash(name: string): number;
		Update(deltaTime: number): void;
		Rebind(): void;
		ApplyBuiltinRootMotion(): void;
		static GetType() : UnityEngine.Type;
	}
	export class Camera extends Behaviour {
		constructor();
		static onPreCull: (cam: UnityEngine.Camera)=>void;
		static onPreRender: (cam: UnityEngine.Camera)=>void;
		static onPostRender: (cam: UnityEngine.Camera)=>void;
		fieldOfView: number;
		nearClipPlane: number;
		farClipPlane: number;
		renderingPath: RenderingPath;
		readonly actualRenderingPath: RenderingPath;
		allowHDR: boolean;
		forceIntoRenderTexture: boolean;
		allowMSAA: boolean;
		orthographicSize: number;
		orthographic: boolean;
		opaqueSortMode: OpaqueSortMode;
		transparencySortMode: TransparencySortMode;
		transparencySortAxis: Vector3;
		depth: number;
		aspect: number;
		cullingMask: number;
		eventMask: number;
		backgroundColor: Color;
		rect: Rect;
		pixelRect: Rect;
		targetTexture: RenderTexture;
		readonly activeTexture: RenderTexture;
		readonly pixelWidth: number;
		readonly pixelHeight: number;
		readonly cameraToWorldMatrix: Object;
		worldToCameraMatrix: Object;
		projectionMatrix: Object;
		nonJitteredProjectionMatrix: Object;
		useJitteredProjectionMatrixForTransparentRendering: boolean;
		readonly velocity: Vector3;
		clearFlags: CameraClearFlags;
		readonly stereoEnabled: boolean;
		stereoSeparation: number;
		stereoConvergence: number;
		cameraType: CameraType;
		stereoMirrorMode: boolean;
		stereoTargetEye: StereoTargetEyeMask;
		readonly stereoActiveEye: Camera.MonoOrStereoscopicEye;
		targetDisplay: number;
		static readonly main: Camera;
		static readonly current: Camera;
		static readonly allCameras: Camera[];
		static readonly allCamerasCount: number;
		useOcclusionCulling: boolean;
		cullingMatrix: Object;
		layerCullDistances: number[];
		layerCullSpherical: boolean;
		depthTextureMode: DepthTextureMode;
		clearStencilAfterLightingPass: boolean;
		readonly commandBufferCount: number;
		SetTargetBuffers(colorBuffer: Object, depthBuffer: Object): void;
		SetTargetBuffers(colorBuffer: Object[], depthBuffer: Object): void;
		ResetWorldToCameraMatrix(): void;
		ResetProjectionMatrix(): void;
		ResetAspect(): void;
		GetStereoViewMatrix(eye: Camera.StereoscopicEye): Object;
		SetStereoViewMatrix(eye: Camera.StereoscopicEye, matrix: Object): void;
		ResetStereoViewMatrices(): void;
		GetStereoProjectionMatrix(eye: Camera.StereoscopicEye): Object;
		SetStereoProjectionMatrix(eye: Camera.StereoscopicEye, matrix: Object): void;
		CalculateFrustumCorners(viewport: Rect, z: number, eye: Camera.MonoOrStereoscopicEye, outCorners: Vector3[]): void;
		ResetStereoProjectionMatrices(): void;
		ResetTransparencySortSettings(): void;
		WorldToScreenPoint(position: Vector3): Vector3;
		WorldToViewportPoint(position: Vector3): Vector3;
		ViewportToWorldPoint(position: Vector3): Vector3;
		ScreenToWorldPoint(position: Vector3): Vector3;
		ScreenToViewportPoint(position: Vector3): Vector3;
		ViewportToScreenPoint(position: Vector3): Vector3;
		ViewportPointToRay(position: Vector3): Object;
		ScreenPointToRay(position: Vector3): Object;
		static GetAllCameras(cameras: Camera[]): number;
		Render(): void;
		RenderWithShader(shader: Shader, replacementTag: string): void;
		SetReplacementShader(shader: Shader, replacementTag: string): void;
		ResetReplacementShader(): void;
		ResetCullingMatrix(): void;
		RenderDontRestore(): void;
		static SetupCurrent(cur: Camera): void;
		RenderToCubemap(cubemap: Object): boolean;
		RenderToCubemap(cubemap: Object, faceMask: number): boolean;
		RenderToCubemap(cubemap: RenderTexture): boolean;
		RenderToCubemap(cubemap: RenderTexture, faceMask: number): boolean;
		CopyFrom(other: Camera): void;
		AddCommandBuffer(evt: CameraEvent, buffer: Object): void;
		RemoveCommandBuffer(evt: CameraEvent, buffer: Object): void;
		RemoveCommandBuffers(evt: CameraEvent): void;
		RemoveAllCommandBuffers(): void;
		GetCommandBuffers(evt: CameraEvent): Object[];
		CalculateObliqueMatrix(clipPlane: Vector4): Object;
		static GetType() : UnityEngine.Type;
	}
	export class RectTransform extends Transform {
		constructor();
		readonly rect: Rect;
		anchorMin: Vector2;
		anchorMax: Vector2;
		anchoredPosition3D: Vector3;
		anchoredPosition: Vector2;
		sizeDelta: Vector2;
		pivot: Vector2;
		offsetMin: Vector2;
		offsetMax: Vector2;
		GetLocalCorners(fourCornersArray: Vector3[]): void;
		GetWorldCorners(fourCornersArray: Vector3[]): void;
		SetInsetAndSizeFromParentEdge(edge: RectTransform.Edge, inset: number, size: number): void;
		SetSizeWithCurrentAnchors(axis: RectTransform.Axis, size: number): void;
		static GetType() : UnityEngine.Type;
	}
	export class ParticleSystem extends Component {
		constructor();
		readonly isPlaying: boolean;
		readonly isEmitting: boolean;
		readonly isStopped: boolean;
		readonly isPaused: boolean;
		time: number;
		readonly particleCount: number;
		randomSeed: number;
		useAutoRandomSeed: boolean;
		readonly main: Object;
		readonly emission: Object;
		readonly shape: Object;
		readonly velocityOverLifetime: Object;
		readonly limitVelocityOverLifetime: Object;
		readonly inheritVelocity: Object;
		readonly forceOverLifetime: Object;
		readonly colorOverLifetime: Object;
		readonly colorBySpeed: Object;
		readonly sizeOverLifetime: Object;
		readonly sizeBySpeed: Object;
		readonly rotationOverLifetime: Object;
		readonly rotationBySpeed: Object;
		readonly externalForces: Object;
		readonly noise: Object;
		readonly collision: Object;
		readonly trigger: Object;
		readonly subEmitters: Object;
		readonly textureSheetAnimation: Object;
		readonly lights: Object;
		readonly trails: Object;
		readonly customData: Object;
		SetParticles(particles: Object[], size: number): void;
		GetParticles(particles: Object[]): number;
		SetCustomParticleData(customData: Vector4[], streamIndex: ParticleSystemCustomData): void;
		GetCustomParticleData(customData: Vector4[], streamIndex: ParticleSystemCustomData): number;
		Simulate(t: number, withChildren: boolean, restart: boolean): void;
		Simulate(t: number, withChildren: boolean): void;
		Simulate(t: number): void;
		Simulate(t: number, withChildren: boolean, restart: boolean, fixedTimeStep: boolean): void;
		Play(): void;
		Play(withChildren: boolean): void;
		Stop(withChildren: boolean): void;
		Stop(): void;
		Stop(withChildren: boolean, stopBehavior: ParticleSystemStopBehavior): void;
		Pause(): void;
		Pause(withChildren: boolean): void;
		Clear(): void;
		Clear(withChildren: boolean): void;
		IsAlive(): boolean;
		IsAlive(withChildren: boolean): boolean;
		Emit(count: number): void;
		Emit(emitParams: Object, count: number): void;
		static GetType() : UnityEngine.Type;
	}
	export class AudioSource extends Behaviour {
		constructor();
		volume: number;
		pitch: number;
		time: number;
		timeSamples: number;
		clip: AudioClip;
		outputAudioMixerGroup: Object;
		readonly isPlaying: boolean;
		readonly isVirtual: boolean;
		loop: boolean;
		ignoreListenerVolume: boolean;
		playOnAwake: boolean;
		ignoreListenerPause: boolean;
		velocityUpdateMode: AudioVelocityUpdateMode;
		panStereo: number;
		spatialBlend: number;
		spatialize: boolean;
		spatializePostEffects: boolean;
		reverbZoneMix: number;
		bypassEffects: boolean;
		bypassListenerEffects: boolean;
		bypassReverbZones: boolean;
		dopplerLevel: number;
		spread: number;
		priority: number;
		mute: boolean;
		minDistance: number;
		maxDistance: number;
		rolloffMode: AudioRolloffMode;
		Play(delay: number): void;
		Play(): void;
		PlayDelayed(delay: number): void;
		PlayScheduled(time: number): void;
		SetScheduledStartTime(time: number): void;
		SetScheduledEndTime(time: number): void;
		Stop(): void;
		Pause(): void;
		UnPause(): void;
		PlayOneShot(clip: AudioClip, volumeScale: number): void;
		PlayOneShot(clip: AudioClip): void;
		static PlayClipAtPoint(clip: AudioClip, position: Vector3): void;
		static PlayClipAtPoint(clip: AudioClip, position: Vector3, volume: number): void;
		SetCustomCurve(type: AudioSourceCurveType, curve: AnimationCurve): void;
		GetCustomCurve(type: AudioSourceCurveType): AnimationCurve;
		GetOutputData(samples: number[], channel: number): void;
		GetSpectrumData(samples: number[], channel: number, window: FFTWindow): void;
		SetSpatializerFloat(index: number, value: number): boolean;
		GetSpatializerFloat(index: number, value: number): [boolean, number];
		static GetType() : UnityEngine.Type;
	}
	export class AudioClip extends UnityObject {
		constructor();
		readonly length: number;
		readonly samples: number;
		readonly channels: number;
		readonly frequency: number;
		readonly loadType: AudioClipLoadType;
		readonly preloadAudioData: boolean;
		readonly loadState: AudioDataLoadState;
		readonly loadInBackground: boolean;
		LoadAudioData(): boolean;
		UnloadAudioData(): boolean;
		GetData(data: number[], offsetSamples: number): boolean;
		SetData(data: number[], offsetSamples: number): boolean;
		static Create(name: string, lengthSamples: number, channels: number, frequency: number, stream: boolean): AudioClip;
		static Create(name: string, lengthSamples: number, channels: number, frequency: number, stream: boolean, pcmreadercallback: (data: number[])=>void): AudioClip;
		static Create(name: string, lengthSamples: number, channels: number, frequency: number, stream: boolean, pcmreadercallback: (data: number[])=>void, pcmsetpositioncallback: (position: number)=>void): AudioClip;
		static GetType() : UnityEngine.Type;
	}
	export class PointerEventData  {
		constructor(eventSystem: Object);
		hovered: GameObject[];
		pointerEnter: GameObject;
		readonly lastPress: GameObject;
		rawPointerPress: GameObject;
		pointerDrag: GameObject;
		pointerCurrentRaycast: Object;
		pointerPressRaycast: Object;
		eligibleForClick: boolean;
		pointerId: number;
		position: Vector2;
		delta: Vector2;
		pressPosition: Vector2;
		clickTime: number;
		clickCount: number;
		scrollDelta: Vector2;
		useDragThreshold: boolean;
		dragging: boolean;
		button: PointerEventData.InputButton;
		readonly enterEventCamera: Camera;
		readonly pressEventCamera: Camera;
		pointerPress: GameObject;
		IsPointerMoving(): boolean;
		IsScrolling(): boolean;
		ToString(): string;
		static GetType() : UnityEngine.Type;
	}
	export class Canvas extends Behaviour {
		constructor();
		renderMode: RenderMode;
		readonly isRootCanvas: boolean;
		worldCamera: Camera;
		readonly pixelRect: Rect;
		scaleFactor: number;
		referencePixelsPerUnit: number;
		overridePixelPerfect: boolean;
		pixelPerfect: boolean;
		planeDistance: number;
		readonly renderOrder: number;
		overrideSorting: boolean;
		sortingOrder: number;
		targetDisplay: number;
		normalizedSortingGridSize: number;
		sortingLayerID: number;
		readonly cachedSortingLayerValue: number;
		additionalShaderChannels: AdditionalCanvasShaderChannels;
		sortingLayerName: string;
		readonly rootCanvas: Canvas;
		static GetDefaultCanvasMaterial(): Material;
		static GetETC1SupportedCanvasMaterial(): Material;
		static ForceUpdateCanvases(): void;
		static GetType() : UnityEngine.Type;
	}
	export class CanvasGroup extends Component {
		constructor();
		alpha: number;
		interactable: boolean;
		blocksRaycasts: boolean;
		ignoreParentGroups: boolean;
		IsRaycastLocationValid(sp: Vector2, eventCamera: Camera): boolean;
		static GetType() : UnityEngine.Type;
	}
	export class UIBehaviour extends MonoBehaviour {
		IsActive(): boolean;
		IsDestroyed(): boolean;
		static GetType() : UnityEngine.Type;
	}
	export class Application  {
		constructor();
		static readonly streamedBytes: number;
		static readonly isPlaying: boolean;
		static readonly isFocused: boolean;
		static readonly isEditor: boolean;
		static readonly isWebPlayer: boolean;
		static readonly platform: RuntimePlatform;
		static readonly buildGUID: string;
		static readonly isMobilePlatform: boolean;
		static readonly isConsolePlatform: boolean;
		static runInBackground: boolean;
		static readonly dataPath: string;
		static readonly streamingAssetsPath: string;
		static readonly persistentDataPath: string;
		static readonly temporaryCachePath: string;
		static readonly srcValue: string;
		static readonly absoluteURL: string;
		static readonly unityVersion: string;
		static readonly version: string;
		static readonly installerName: string;
		static readonly identifier: string;
		static readonly installMode: ApplicationInstallMode;
		static readonly sandboxType: ApplicationSandboxType;
		static readonly productName: string;
		static readonly companyName: string;
		static readonly cloudProjectId: string;
		static targetFrameRate: number;
		static readonly systemLanguage: SystemLanguage;
		static backgroundLoadingPriority: ThreadPriority;
		static readonly internetReachability: NetworkReachability;
		static readonly genuine: boolean;
		static readonly genuineCheckAvailable: boolean;
		static Quit(): void;
		static CancelQuit(): void;
		static Unload(): void;
		static GetStreamProgressForLevel(levelIndex: number): number;
		static GetStreamProgressForLevel(levelName: string): number;
		static CanStreamedLevelBeLoaded(levelIndex: number): boolean;
		static CanStreamedLevelBeLoaded(levelName: string): boolean;
		static GetBuildTags(): string[];
		static HasProLicense(): boolean;
		static ExternalCall(functionName: string, args: Object[]): void;
		static RequestAdvertisingIdentifierAsync(delegateMethod: (advertisingId: string, trackingEnabled: boolean, errorMsg: string)=>void): boolean;
		static OpenURL(url: string): void;
		static GetStackTraceLogType(logType: LogType): StackTraceLogType;
		static SetStackTraceLogType(logType: LogType, stackTraceType: StackTraceLogType): void;
		static RequestUserAuthorization(mode: UserAuthorization): AsyncOperation;
		static HasUserAuthorization(mode: UserAuthorization): boolean;
		static GetType() : UnityEngine.Type;
	}
	export class Resolution  {
		width: number;
		height: number;
		refreshRate: number;
		ToString(): string;
		static GetType() : UnityEngine.Type;
	}
	export class Screen  {
		constructor();
		static readonly resolutions: Resolution[];
		static readonly currentResolution: Resolution;
		static readonly width: number;
		static readonly height: number;
		static readonly dpi: number;
		static fullScreen: boolean;
		static autorotateToPortrait: boolean;
		static autorotateToPortraitUpsideDown: boolean;
		static autorotateToLandscapeLeft: boolean;
		static autorotateToLandscapeRight: boolean;
		static orientation: ScreenOrientation;
		static sleepTimeout: number;
		static SetResolution(width: number, height: number, fullscreen: boolean, preferredRefreshRate: number): void;
		static SetResolution(width: number, height: number, fullscreen: boolean): void;
		static GetType() : UnityEngine.Type;
	}
	export class Time  {
		constructor();
		static readonly time: number;
		static readonly timeSinceLevelLoad: number;
		static readonly deltaTime: number;
		static readonly fixedTime: number;
		static readonly unscaledTime: number;
		static readonly fixedUnscaledTime: number;
		static readonly unscaledDeltaTime: number;
		static readonly fixedUnscaledDeltaTime: number;
		static fixedDeltaTime: number;
		static maximumDeltaTime: number;
		static readonly smoothDeltaTime: number;
		static maximumParticleDeltaTime: number;
		static timeScale: number;
		static readonly frameCount: number;
		static readonly renderedFrameCount: number;
		static readonly realtimeSinceStartup: number;
		static captureFramerate: number;
		static readonly inFixedTimeStep: boolean;
		static GetType() : UnityEngine.Type;
	}
	export class RectTransformUtility  {
		static RectangleContainsScreenPoint(rect: RectTransform, screenPoint: Vector2): boolean;
		static ScreenPointToWorldPointInRectangle(rect: RectTransform, screenPoint: Vector2, cam: Camera, worldPoint: Object): boolean;
		static ScreenPointToLocalPointInRectangle(rect: RectTransform, screenPoint: Vector2, cam: Camera, localPoint: Object): boolean;
		static ScreenPointToRay(cam: Camera, screenPos: Vector2): Object;
		static WorldToScreenPoint(cam: Camera, worldPoint: Vector3): Vector2;
		static CalculateRelativeRectTransformBounds(root: Transform, child: Transform): Bounds;
		static CalculateRelativeRectTransformBounds(trans: Transform): Bounds;
		static FlipLayoutOnAxis(rect: RectTransform, axis: number, keepPositioning: boolean, recursive: boolean): void;
		static FlipLayoutAxes(rect: RectTransform, keepPositioning: boolean, recursive: boolean): void;
		static RectangleContainsScreenPoint(rect: RectTransform, screenPoint: Vector2, cam: Camera): boolean;
		static PixelAdjustPoint(point: Vector2, elementTransform: Transform, canvas: Canvas): Vector2;
		static PixelAdjustRect(rectTransform: RectTransform, canvas: Canvas): Rect;
		static GetType() : UnityEngine.Type;
	}
	export class SystemInfo  {
		constructor();
		static readonly unsupportedIdentifier: string;
		static readonly batteryLevel: number;
		static readonly batteryStatus: BatteryStatus;
		static readonly operatingSystem: string;
		static readonly operatingSystemFamily: OperatingSystemFamily;
		static readonly processorType: string;
		static readonly processorFrequency: number;
		static readonly processorCount: number;
		static readonly systemMemorySize: number;
		static readonly graphicsMemorySize: number;
		static readonly graphicsDeviceName: string;
		static readonly graphicsDeviceVendor: string;
		static readonly graphicsDeviceID: number;
		static readonly graphicsDeviceVendorID: number;
		static readonly graphicsDeviceType: GraphicsDeviceType;
		static readonly graphicsUVStartsAtTop: boolean;
		static readonly graphicsDeviceVersion: string;
		static readonly graphicsShaderLevel: number;
		static readonly graphicsMultiThreaded: boolean;
		static readonly supportsShadows: boolean;
		static readonly supportsRawShadowDepthSampling: boolean;
		static readonly supportsMotionVectors: boolean;
		static readonly supportsRenderToCubemap: boolean;
		static readonly supportsImageEffects: boolean;
		static readonly supports3DTextures: boolean;
		static readonly supports2DArrayTextures: boolean;
		static readonly supports3DRenderTextures: boolean;
		static readonly supportsCubemapArrayTextures: boolean;
		static readonly copyTextureSupport: CopyTextureSupport;
		static readonly supportsComputeShaders: boolean;
		static readonly supportsInstancing: boolean;
		static readonly supportsSparseTextures: boolean;
		static readonly supportedRenderTargetCount: number;
		static readonly usesReversedZBuffer: boolean;
		static readonly npotSupport: NPOTSupport;
		static readonly deviceUniqueIdentifier: string;
		static readonly deviceName: string;
		static readonly deviceModel: string;
		static readonly supportsAccelerometer: boolean;
		static readonly supportsGyroscope: boolean;
		static readonly supportsLocationService: boolean;
		static readonly supportsVibration: boolean;
		static readonly supportsAudio: boolean;
		static readonly deviceType: DeviceType;
		static readonly maxTextureSize: number;
		static readonly maxCubemapSize: number;
		static SupportsRenderTextureFormat(format: RenderTextureFormat): boolean;
		static SupportsTextureFormat(format: TextureFormat): boolean;
		static GetType() : UnityEngine.Type;
	}
	export class Graphics  {
		constructor();
		static readonly activeColorBuffer: Object;
		static readonly activeDepthBuffer: Object;
		static activeTier: GraphicsTier;
		static DrawMesh(mesh: Object, position: Vector3, rotation: Quaternion, material: Material, layer: number, camera: Camera, submeshIndex: number, properties: Object, castShadows: boolean, receiveShadows: boolean): void;
		static DrawMesh(mesh: Object, position: Vector3, rotation: Quaternion, material: Material, layer: number, camera: Camera, submeshIndex: number, properties: Object, castShadows: boolean): void;
		static DrawMesh(mesh: Object, position: Vector3, rotation: Quaternion, material: Material, layer: number, camera: Camera, submeshIndex: number, properties: Object): void;
		static DrawMesh(mesh: Object, position: Vector3, rotation: Quaternion, material: Material, layer: number, camera: Camera, submeshIndex: number): void;
		static DrawMesh(mesh: Object, position: Vector3, rotation: Quaternion, material: Material, layer: number, camera: Camera): void;
		static DrawMesh(mesh: Object, position: Vector3, rotation: Quaternion, material: Material, layer: number): void;
		static DrawMesh(mesh: Object, position: Vector3, rotation: Quaternion, material: Material, layer: number, camera: Camera, submeshIndex: number, properties: Object, castShadows: boolean, receiveShadows: boolean, useLightProbes: boolean): void;
		static DrawMesh(mesh: Object, position: Vector3, rotation: Quaternion, material: Material, layer: number, camera: Camera, submeshIndex: number, properties: Object, castShadows: ShadowCastingMode, receiveShadows: boolean, probeAnchor: Transform): void;
		static DrawMesh(mesh: Object, position: Vector3, rotation: Quaternion, material: Material, layer: number, camera: Camera, submeshIndex: number, properties: Object, castShadows: ShadowCastingMode, receiveShadows: boolean): void;
		static DrawMesh(mesh: Object, position: Vector3, rotation: Quaternion, material: Material, layer: number, camera: Camera, submeshIndex: number, properties: Object, castShadows: ShadowCastingMode): void;
		static DrawMesh(mesh: Object, position: Vector3, rotation: Quaternion, material: Material, layer: number, camera: Camera, submeshIndex: number, properties: Object, castShadows: ShadowCastingMode, receiveShadows: boolean, probeAnchor: Transform, useLightProbes: boolean): void;
		static DrawMesh(mesh: Object, matrix: Object, material: Material, layer: number, camera: Camera, submeshIndex: number, properties: Object, castShadows: boolean, receiveShadows: boolean): void;
		static DrawMesh(mesh: Object, matrix: Object, material: Material, layer: number, camera: Camera, submeshIndex: number, properties: Object, castShadows: boolean): void;
		static DrawMesh(mesh: Object, matrix: Object, material: Material, layer: number, camera: Camera, submeshIndex: number, properties: Object): void;
		static DrawMesh(mesh: Object, matrix: Object, material: Material, layer: number, camera: Camera, submeshIndex: number): void;
		static DrawMesh(mesh: Object, matrix: Object, material: Material, layer: number, camera: Camera): void;
		static DrawMesh(mesh: Object, matrix: Object, material: Material, layer: number): void;
		static DrawMesh(mesh: Object, matrix: Object, material: Material, layer: number, camera: Camera, submeshIndex: number, properties: Object, castShadows: boolean, receiveShadows: boolean, useLightProbes: boolean): void;
		static DrawMesh(mesh: Object, matrix: Object, material: Material, layer: number, camera: Camera, submeshIndex: number, properties: Object, castShadows: ShadowCastingMode, receiveShadows: boolean, probeAnchor: Transform): void;
		static DrawMesh(mesh: Object, matrix: Object, material: Material, layer: number, camera: Camera, submeshIndex: number, properties: Object, castShadows: ShadowCastingMode, receiveShadows: boolean): void;
		static DrawMesh(mesh: Object, matrix: Object, material: Material, layer: number, camera: Camera, submeshIndex: number, properties: Object, castShadows: ShadowCastingMode): void;
		static DrawMesh(mesh: Object, matrix: Object, material: Material, layer: number, camera: Camera, submeshIndex: number, properties: Object, castShadows: ShadowCastingMode, receiveShadows: boolean, probeAnchor: Transform, useLightProbes: boolean): void;
		static DrawProcedural(topology: MeshTopology, vertexCount: number, instanceCount: number): void;
		static DrawProcedural(topology: MeshTopology, vertexCount: number): void;
		static DrawProceduralIndirect(topology: MeshTopology, bufferWithArgs: Object, argsOffset: number): void;
		static DrawProceduralIndirect(topology: MeshTopology, bufferWithArgs: Object): void;
		static DrawMeshInstanced(mesh: Object, submeshIndex: number, material: Material, matrices: Object[], count: number, properties: Object, castShadows: ShadowCastingMode, receiveShadows: boolean, layer: number): void;
		static DrawMeshInstanced(mesh: Object, submeshIndex: number, material: Material, matrices: Object[], count: number, properties: Object, castShadows: ShadowCastingMode, receiveShadows: boolean): void;
		static DrawMeshInstanced(mesh: Object, submeshIndex: number, material: Material, matrices: Object[], count: number, properties: Object, castShadows: ShadowCastingMode): void;
		static DrawMeshInstanced(mesh: Object, submeshIndex: number, material: Material, matrices: Object[], count: number, properties: Object): void;
		static DrawMeshInstanced(mesh: Object, submeshIndex: number, material: Material, matrices: Object[], count: number): void;
		static DrawMeshInstanced(mesh: Object, submeshIndex: number, material: Material, matrices: Object[]): void;
		static DrawMeshInstanced(mesh: Object, submeshIndex: number, material: Material, matrices: Object[], count: number, properties: Object, castShadows: ShadowCastingMode, receiveShadows: boolean, layer: number, camera: Camera): void;
		static DrawMeshInstanced(mesh: Object, submeshIndex: number, material: Material, matrices: Object[], properties: Object, castShadows: ShadowCastingMode, receiveShadows: boolean, layer: number): void;
		static DrawMeshInstanced(mesh: Object, submeshIndex: number, material: Material, matrices: Object[], properties: Object, castShadows: ShadowCastingMode, receiveShadows: boolean): void;
		static DrawMeshInstanced(mesh: Object, submeshIndex: number, material: Material, matrices: Object[], properties: Object, castShadows: ShadowCastingMode): void;
		static DrawMeshInstanced(mesh: Object, submeshIndex: number, material: Material, matrices: Object[], properties: Object): void;
		static DrawMeshInstanced(mesh: Object, submeshIndex: number, material: Material, matrices: Object[]): void;
		static DrawMeshInstanced(mesh: Object, submeshIndex: number, material: Material, matrices: Object[], properties: Object, castShadows: ShadowCastingMode, receiveShadows: boolean, layer: number, camera: Camera): void;
		static DrawMeshInstancedIndirect(mesh: Object, submeshIndex: number, material: Material, bounds: Bounds, bufferWithArgs: Object, argsOffset: number, properties: Object, castShadows: ShadowCastingMode, receiveShadows: boolean, layer: number): void;
		static DrawMeshInstancedIndirect(mesh: Object, submeshIndex: number, material: Material, bounds: Bounds, bufferWithArgs: Object, argsOffset: number, properties: Object, castShadows: ShadowCastingMode, receiveShadows: boolean): void;
		static DrawMeshInstancedIndirect(mesh: Object, submeshIndex: number, material: Material, bounds: Bounds, bufferWithArgs: Object, argsOffset: number, properties: Object, castShadows: ShadowCastingMode): void;
		static DrawMeshInstancedIndirect(mesh: Object, submeshIndex: number, material: Material, bounds: Bounds, bufferWithArgs: Object, argsOffset: number, properties: Object): void;
		static DrawMeshInstancedIndirect(mesh: Object, submeshIndex: number, material: Material, bounds: Bounds, bufferWithArgs: Object, argsOffset: number): void;
		static DrawMeshInstancedIndirect(mesh: Object, submeshIndex: number, material: Material, bounds: Bounds, bufferWithArgs: Object): void;
		static DrawMeshInstancedIndirect(mesh: Object, submeshIndex: number, material: Material, bounds: Bounds, bufferWithArgs: Object, argsOffset: number, properties: Object, castShadows: ShadowCastingMode, receiveShadows: boolean, layer: number, camera: Camera): void;
		static DrawTexture(screenRect: Rect, texture: Texture, mat: Material): void;
		static DrawTexture(screenRect: Rect, texture: Texture): void;
		static DrawTexture(screenRect: Rect, texture: Texture, mat: Material, pass: number): void;
		static DrawTexture(screenRect: Rect, texture: Texture, leftBorder: number, rightBorder: number, topBorder: number, bottomBorder: number, mat: Material): void;
		static DrawTexture(screenRect: Rect, texture: Texture, leftBorder: number, rightBorder: number, topBorder: number, bottomBorder: number): void;
		static DrawTexture(screenRect: Rect, texture: Texture, leftBorder: number, rightBorder: number, topBorder: number, bottomBorder: number, mat: Material, pass: number): void;
		static DrawTexture(screenRect: Rect, texture: Texture, sourceRect: Rect, leftBorder: number, rightBorder: number, topBorder: number, bottomBorder: number, mat: Material): void;
		static DrawTexture(screenRect: Rect, texture: Texture, sourceRect: Rect, leftBorder: number, rightBorder: number, topBorder: number, bottomBorder: number): void;
		static DrawTexture(screenRect: Rect, texture: Texture, sourceRect: Rect, leftBorder: number, rightBorder: number, topBorder: number, bottomBorder: number, mat: Material, pass: number): void;
		static DrawTexture(screenRect: Rect, texture: Texture, sourceRect: Rect, leftBorder: number, rightBorder: number, topBorder: number, bottomBorder: number, color: Color, mat: Material): void;
		static DrawTexture(screenRect: Rect, texture: Texture, sourceRect: Rect, leftBorder: number, rightBorder: number, topBorder: number, bottomBorder: number, color: Color): void;
		static DrawTexture(screenRect: Rect, texture: Texture, sourceRect: Rect, leftBorder: number, rightBorder: number, topBorder: number, bottomBorder: number, color: Color, mat: Material, pass: number): void;
		static ExecuteCommandBuffer(buffer: Object): void;
		static Blit(source: Texture, dest: RenderTexture): void;
		static Blit(source: Texture, dest: RenderTexture, mat: Material): void;
		static Blit(source: Texture, dest: RenderTexture, mat: Material, pass: number): void;
		static Blit(source: Texture, mat: Material): void;
		static Blit(source: Texture, mat: Material, pass: number): void;
		static BlitMultiTap(source: Texture, dest: RenderTexture, mat: Material, offsets: Vector2[]): void;
		static SetRandomWriteTarget(index: number, uav: RenderTexture): void;
		static SetRandomWriteTarget(index: number, uav: Object): void;
		static SetRandomWriteTarget(index: number, uav: Object, preserveCounterValue: boolean): void;
		static ClearRandomWriteTargets(): void;
		static SetRenderTarget(rt: RenderTexture): void;
		static SetRenderTarget(rt: RenderTexture, mipLevel: number): void;
		static SetRenderTarget(rt: RenderTexture, mipLevel: number, face: CubemapFace): void;
		static SetRenderTarget(rt: RenderTexture, mipLevel: number, face: CubemapFace, depthSlice: number): void;
		static SetRenderTarget(colorBuffer: Object, depthBuffer: Object): void;
		static SetRenderTarget(colorBuffer: Object, depthBuffer: Object, mipLevel: number): void;
		static SetRenderTarget(colorBuffer: Object, depthBuffer: Object, mipLevel: number, face: CubemapFace): void;
		static SetRenderTarget(colorBuffer: Object, depthBuffer: Object, mipLevel: number, face: CubemapFace, depthSlice: number): void;
		static SetRenderTarget(colorBuffers: Object[], depthBuffer: Object): void;
		static SetRenderTarget(setup: Object): void;
		static CopyTexture(src: Texture, dst: Texture): void;
		static CopyTexture(src: Texture, srcElement: number, dst: Texture, dstElement: number): void;
		static CopyTexture(src: Texture, srcElement: number, srcMip: number, dst: Texture, dstElement: number, dstMip: number): void;
		static CopyTexture(src: Texture, srcElement: number, srcMip: number, srcX: number, srcY: number, srcWidth: number, srcHeight: number, dst: Texture, dstElement: number, dstMip: number, dstX: number, dstY: number): void;
		static ConvertTexture(src: Texture, dst: Texture): boolean;
		static ConvertTexture(src: Texture, srcElement: number, dst: Texture, dstElement: number): boolean;
		static DrawMeshNow(mesh: Object, position: Vector3, rotation: Quaternion): void;
		static DrawMeshNow(mesh: Object, position: Vector3, rotation: Quaternion, materialIndex: number): void;
		static DrawMeshNow(mesh: Object, matrix: Object): void;
		static DrawMeshNow(mesh: Object, matrix: Object, materialIndex: number): void;
		static GetType() : UnityEngine.Type;
	}
	export class Light extends Behaviour {
		constructor();
		type: LightType;
		color: Color;
		colorTemperature: number;
		intensity: number;
		bounceIntensity: number;
		shadows: LightShadows;
		shadowStrength: number;
		shadowResolution: LightShadowResolution;
		shadowCustomResolution: number;
		shadowBias: number;
		shadowNormalBias: number;
		shadowNearPlane: number;
		range: number;
		spotAngle: number;
		cookieSize: number;
		cookie: Texture;
		flare: Object;
		renderMode: LightRenderMode;
		alreadyLightmapped: boolean;
		readonly isBaked: boolean;
		cullingMask: number;
		readonly commandBufferCount: number;
		AddCommandBuffer(evt: LightEvent, buffer: Object): void;
		AddCommandBuffer(evt: LightEvent, buffer: Object, shadowPassMask: ShadowMapPass): void;
		RemoveCommandBuffer(evt: LightEvent, buffer: Object): void;
		RemoveCommandBuffers(evt: LightEvent): void;
		RemoveAllCommandBuffers(): void;
		GetCommandBuffers(evt: LightEvent): Object[];
		static GetLights(type: LightType, layer: number): Light[];
		static GetType() : UnityEngine.Type;
	}
	export class QualitySettings extends UnityObject {
		constructor();
		static readonly names: string[];
		static pixelLightCount: number;
		static shadows: ShadowQuality;
		static shadowProjection: ShadowProjection;
		static shadowCascades: number;
		static shadowDistance: number;
		static shadowResolution: ShadowResolution;
		static shadowNearPlaneOffset: number;
		static shadowCascade2Split: number;
		static shadowCascade4Split: Vector3;
		static masterTextureLimit: number;
		static anisotropicFiltering: AnisotropicFiltering;
		static lodBias: number;
		static maximumLODLevel: number;
		static particleRaycastBudget: number;
		static softParticles: boolean;
		static softVegetation: boolean;
		static realtimeReflectionProbes: boolean;
		static billboardsFaceCameraPosition: boolean;
		static maxQueuedFrames: number;
		static vSyncCount: number;
		static antiAliasing: number;
		static readonly desiredColorSpace: ColorSpace;
		static readonly activeColorSpace: ColorSpace;
		static blendWeights: BlendWeights;
		static asyncUploadTimeSlice: number;
		static asyncUploadBufferSize: number;
		static GetQualityLevel(): number;
		static SetQualityLevel(index: number, applyExpensiveChanges: boolean): void;
		static SetQualityLevel(index: number): void;
		static IncreaseLevel(applyExpensiveChanges: boolean): void;
		static IncreaseLevel(): void;
		static DecreaseLevel(applyExpensiveChanges: boolean): void;
		static DecreaseLevel(): void;
		static GetType() : UnityEngine.Type;
	}
	export class SceneManager  {
		constructor();
		static readonly sceneCount: number;
		static readonly sceneCountInBuildSettings: number;
		static GetActiveScene(): Object;
		static SetActiveScene(scene: Object): boolean;
		static GetSceneByPath(scenePath: string): Object;
		static GetSceneByName(name: string): Object;
		static GetSceneByBuildIndex(buildIndex: number): Object;
		static GetSceneAt(index: number): Object;
		static LoadScene(sceneName: string): void;
		static LoadScene(sceneName: string, mode: LoadSceneMode): void;
		static LoadScene(sceneBuildIndex: number): void;
		static LoadScene(sceneBuildIndex: number, mode: LoadSceneMode): void;
		static LoadSceneAsync(sceneName: string): AsyncOperation;
		static LoadSceneAsync(sceneName: string, mode: LoadSceneMode): AsyncOperation;
		static LoadSceneAsync(sceneBuildIndex: number): AsyncOperation;
		static LoadSceneAsync(sceneBuildIndex: number, mode: LoadSceneMode): AsyncOperation;
		static CreateScene(sceneName: string): Object;
		static UnloadSceneAsync(sceneBuildIndex: number): AsyncOperation;
		static UnloadSceneAsync(sceneName: string): AsyncOperation;
		static UnloadSceneAsync(scene: Object): AsyncOperation;
		static MergeScenes(sourceScene: Object, destinationScene: Object): void;
		static MoveGameObjectToScene(go: GameObject, scene: Object): void;
		static GetType() : UnityEngine.Type;
	}
	export class Color  {
		constructor(r: number, g: number, b: number, a: number);
		constructor(r: number, g: number, b: number);
		r: number;
		g: number;
		b: number;
		a: number;
		static readonly red: Color;
		static readonly green: Color;
		static readonly blue: Color;
		static readonly white: Color;
		static readonly black: Color;
		static readonly yellow: Color;
		static readonly cyan: Color;
		static readonly magenta: Color;
		static readonly gray: Color;
		static readonly grey: Color;
		static readonly clear: Color;
		readonly grayscale: number;
		readonly linear: Color;
		readonly gamma: Color;
		readonly maxColorComponent: number;
		ToString(): string;
		ToString(format: string): string;
		GetHashCode(): number;
		Equals(other: Object): boolean;
		static op_Addition(a: Color, b: Color): Color;
		static op_Subtraction(a: Color, b: Color): Color;
		static op_Multiply(a: Color, b: Color): Color;
		static op_Multiply(a: Color, b: number): Color;
		static op_Multiply(b: number, a: Color): Color;
		static op_Division(a: Color, b: number): Color;
		static op_Equality(lhs: Color, rhs: Color): boolean;
		static op_Inequality(lhs: Color, rhs: Color): boolean;
		static Lerp(a: Color, b: Color, t: number): Color;
		static LerpUnclamped(a: Color, b: Color, t: number): Color;
		static op_Implicit(c: Color): Vector4;
		static op_Implicit(v: Vector4): Color;
		static RGBToHSV(rgbColor: Color, H: number, S: number, V: number): [number, number, number];
		static HSVToRGB(H: number, S: number, V: number): Color;
		static HSVToRGB(H: number, S: number, V: number, hdr: boolean): Color;
		static GetType() : UnityEngine.Type;
	}
	export class Color32  {
		constructor(r: number, g: number, b: number, a: number);
		r: number;
		g: number;
		b: number;
		a: number;
		static op_Implicit(c: Color): Color32;
		static op_Implicit(c: Color32): Color;
		static Lerp(a: Color32, b: Color32, t: number): Color32;
		static LerpUnclamped(a: Color32, b: Color32, t: number): Color32;
		ToString(): string;
		ToString(format: string): string;
		static GetType() : UnityEngine.Type;
	}
	export class Vector4  {
		constructor(x: number, y: number, z: number, w: number);
		constructor(x: number, y: number, z: number);
		constructor(x: number, y: number);
		static readonly kEpsilon: number;
		x: number;
		y: number;
		z: number;
		w: number;
		readonly normalized: Vector4;
		readonly magnitude: number;
		readonly sqrMagnitude: number;
		static readonly zero: Vector4;
		static readonly one: Vector4;
		Set(new_x: number, new_y: number, new_z: number, new_w: number): void;
		static Lerp(a: Vector4, b: Vector4, t: number): Vector4;
		static LerpUnclamped(a: Vector4, b: Vector4, t: number): Vector4;
		static MoveTowards(current: Vector4, target: Vector4, maxDistanceDelta: number): Vector4;
		static Scale(a: Vector4, b: Vector4): Vector4;
		Scale(scale: Vector4): void;
		GetHashCode(): number;
		Equals(other: Object): boolean;
		static Normalize(a: Vector4): Vector4;
		Normalize(): void;
		static Dot(a: Vector4, b: Vector4): number;
		static Project(a: Vector4, b: Vector4): Vector4;
		static Distance(a: Vector4, b: Vector4): number;
		static Magnitude(a: Vector4): number;
		static Min(lhs: Vector4, rhs: Vector4): Vector4;
		static Max(lhs: Vector4, rhs: Vector4): Vector4;
		static op_Addition(a: Vector4, b: Vector4): Vector4;
		static op_Subtraction(a: Vector4, b: Vector4): Vector4;
		static op_UnaryNegation(a: Vector4): Vector4;
		static op_Multiply(a: Vector4, d: number): Vector4;
		static op_Multiply(d: number, a: Vector4): Vector4;
		static op_Division(a: Vector4, d: number): Vector4;
		static op_Equality(lhs: Vector4, rhs: Vector4): boolean;
		static op_Inequality(lhs: Vector4, rhs: Vector4): boolean;
		static op_Implicit(v: Vector3): Vector4;
		static op_Implicit(v: Vector4): Vector3;
		static op_Implicit(v: Vector2): Vector4;
		static op_Implicit(v: Vector4): Vector2;
		ToString(): string;
		ToString(format: string): string;
		static SqrMagnitude(a: Vector4): number;
		SqrMagnitude(): number;
		static GetType() : UnityEngine.Type;
	}
	export class Bounds  {
		constructor(center: Vector3, size: Vector3);
		center: Vector3;
		size: Vector3;
		extents: Vector3;
		min: Vector3;
		max: Vector3;
		Contains(point: Vector3): boolean;
		SqrDistance(point: Vector3): number;
		IntersectRay(ray: Object): boolean;
		IntersectRay(ray: Object, distance: number): [boolean, number];
		ClosestPoint(point: Vector3): Vector3;
		GetHashCode(): number;
		Equals(other: Object): boolean;
		static op_Equality(lhs: Bounds, rhs: Bounds): boolean;
		static op_Inequality(lhs: Bounds, rhs: Bounds): boolean;
		SetMinMax(min: Vector3, max: Vector3): void;
		Encapsulate(point: Vector3): void;
		Encapsulate(bounds: Bounds): void;
		Expand(amount: number): void;
		Expand(amount: Vector3): void;
		Intersects(bounds: Bounds): boolean;
		ToString(): string;
		ToString(format: string): string;
		static GetType() : UnityEngine.Type;
	}
	export class Quaternion  {
		constructor(x: number, y: number, z: number, w: number);
		x: number;
		y: number;
		z: number;
		w: number;
		static readonly kEpsilon: number;
		eulerAngles: Vector3;
		static readonly identity: Quaternion;
		static AngleAxis(angle: number, axis: Vector3): Quaternion;
		ToAngleAxis(angle: number, axis: Object): [number];
		static FromToRotation(fromDirection: Vector3, toDirection: Vector3): Quaternion;
		SetFromToRotation(fromDirection: Vector3, toDirection: Vector3): void;
		static LookRotation(forward: Vector3, upwards: Vector3): Quaternion;
		static LookRotation(forward: Vector3): Quaternion;
		static Slerp(a: Quaternion, b: Quaternion, t: number): Quaternion;
		static SlerpUnclamped(a: Quaternion, b: Quaternion, t: number): Quaternion;
		static Lerp(a: Quaternion, b: Quaternion, t: number): Quaternion;
		static LerpUnclamped(a: Quaternion, b: Quaternion, t: number): Quaternion;
		static RotateTowards(from: Quaternion, to: Quaternion, maxDegreesDelta: number): Quaternion;
		static Inverse(rotation: Quaternion): Quaternion;
		static Euler(x: number, y: number, z: number): Quaternion;
		static Euler(euler: Vector3): Quaternion;
		Set(new_x: number, new_y: number, new_z: number, new_w: number): void;
		static op_Multiply(lhs: Quaternion, rhs: Quaternion): Quaternion;
		static op_Multiply(rotation: Quaternion, point: Vector3): Vector3;
		static op_Equality(lhs: Quaternion, rhs: Quaternion): boolean;
		static op_Inequality(lhs: Quaternion, rhs: Quaternion): boolean;
		static Dot(a: Quaternion, b: Quaternion): number;
		SetLookRotation(view: Vector3): void;
		SetLookRotation(view: Vector3, up: Vector3): void;
		static Angle(a: Quaternion, b: Quaternion): number;
		GetHashCode(): number;
		Equals(other: Object): boolean;
		ToString(): string;
		ToString(format: string): string;
		static GetType() : UnityEngine.Type;
	}
	export class Rect  {
		constructor(x: number, y: number, width: number, height: number);
		constructor(position: Vector2, size: Vector2);
		constructor(source: Rect);
		static readonly zero: Rect;
		x: number;
		y: number;
		position: Vector2;
		center: Vector2;
		min: Vector2;
		max: Vector2;
		width: number;
		height: number;
		size: Vector2;
		xMin: number;
		yMin: number;
		xMax: number;
		yMax: number;
		static MinMaxRect(xmin: number, ymin: number, xmax: number, ymax: number): Rect;
		Set(x: number, y: number, width: number, height: number): void;
		Contains(point: Vector2): boolean;
		Contains(point: Vector3): boolean;
		Contains(point: Vector3, allowInverse: boolean): boolean;
		Overlaps(other: Rect): boolean;
		Overlaps(other: Rect, allowInverse: boolean): boolean;
		static NormalizedToPoint(rectangle: Rect, normalizedRectCoordinates: Vector2): Vector2;
		static PointToNormalized(rectangle: Rect, point: Vector2): Vector2;
		static op_Inequality(lhs: Rect, rhs: Rect): boolean;
		static op_Equality(lhs: Rect, rhs: Rect): boolean;
		GetHashCode(): number;
		Equals(other: Object): boolean;
		ToString(): string;
		ToString(format: string): string;
		static GetType() : UnityEngine.Type;
	}
	export class RectOffset  {
		constructor();
		constructor(left: number, right: number, top: number, bottom: number);
		left: number;
		right: number;
		top: number;
		bottom: number;
		readonly horizontal: number;
		readonly vertical: number;
		Add(rect: Rect): Rect;
		Remove(rect: Rect): Rect;
		ToString(): string;
		static GetType() : UnityEngine.Type;
	}
	export class Keyframe  {
		constructor(time: number, value: number);
		constructor(time: number, value: number, inTangent: number, outTangent: number);
		time: number;
		value: number;
		inTangent: number;
		outTangent: number;
		tangentMode: number;
		static GetType() : UnityEngine.Type;
	}
	export class AndroidJavaObject  {
		constructor(className: string, args: Object[]);
		Dispose(): void;
		Call(methodName: string, args: Object[]): void;
		CallStatic(methodName: string, args: Object[]): void;
		GetRawObject(): Object;
		GetRawClass(): Object;
		static GetType() : UnityEngine.Type;
	}
	export class AndroidJavaClass extends AndroidJavaObject {
		constructor(className: string);
		static GetType() : UnityEngine.Type;
	}
}
declare module UnityEngine.UI {
	export class Graphic extends UnityEngine.UIBehaviour {
		static readonly defaultGraphicMaterial: UnityEngine.Material;
		color: UnityEngine.Color;
		raycastTarget: boolean;
		readonly depth: number;
		readonly rectTransform: UnityEngine.RectTransform;
		readonly canvas: UnityEngine.Canvas;
		readonly canvasRenderer: Object;
		readonly defaultMaterial: UnityEngine.Material;
		material: UnityEngine.Material;
		readonly materialForRendering: UnityEngine.Material;
		readonly mainTexture: UnityEngine.Texture;
		SetAllDirty(): void;
		SetLayoutDirty(): void;
		SetVerticesDirty(): void;
		SetMaterialDirty(): void;
		Rebuild(update: CanvasUpdate): void;
		LayoutComplete(): void;
		GraphicUpdateComplete(): void;
		SetNativeSize(): void;
		Raycast(sp: UnityEngine.Vector2, eventCamera: UnityEngine.Camera): boolean;
		PixelAdjustPoint(point: UnityEngine.Vector2): UnityEngine.Vector2;
		GetPixelAdjustedRect(): UnityEngine.Rect;
		CrossFadeColor(targetColor: UnityEngine.Color, duration: number, ignoreTimeScale: boolean, useAlpha: boolean): void;
		CrossFadeColor(targetColor: UnityEngine.Color, duration: number, ignoreTimeScale: boolean, useAlpha: boolean, useRGB: boolean): void;
		CrossFadeAlpha(alpha: number, duration: number, ignoreTimeScale: boolean): void;
		RegisterDirtyLayoutCallback(action: ()=>void): void;
		UnregisterDirtyLayoutCallback(action: ()=>void): void;
		RegisterDirtyVerticesCallback(action: ()=>void): void;
		UnregisterDirtyVerticesCallback(action: ()=>void): void;
		RegisterDirtyMaterialCallback(action: ()=>void): void;
		UnregisterDirtyMaterialCallback(action: ()=>void): void;
		static GetType() : UnityEngine.Type;
	}
	export class MaskableGraphic extends Graphic {
		onCullStateChanged: (arg0: boolean)=>void;
		maskable: boolean;
		GetModifiedMaterial(baseMaterial: UnityEngine.Material): UnityEngine.Material;
		Cull(clipRect: UnityEngine.Rect, validRect: boolean): void;
		SetClipRect(clipRect: UnityEngine.Rect, validRect: boolean): void;
		RecalculateClipping(): void;
		RecalculateMasking(): void;
		static GetType() : UnityEngine.Type;
	}
	export class Selectable extends UnityEngine.UIBehaviour {
		static readonly allSelectables: Selectable[];
		navigation: Object;
		transition: Selectable.Transition;
		colors: Object;
		spriteState: Object;
		animationTriggers: Object;
		targetGraphic: Graphic;
		interactable: boolean;
		image: Image;
		readonly animator: UnityEngine.Animator;
		IsInteractable(): boolean;
		FindSelectable(dir: UnityEngine.Vector3): Selectable;
		FindSelectableOnLeft(): Selectable;
		FindSelectableOnRight(): Selectable;
		FindSelectableOnUp(): Selectable;
		FindSelectableOnDown(): Selectable;
		OnMove(eventData: Object): void;
		OnPointerDown(eventData: UnityEngine.PointerEventData): void;
		OnPointerUp(eventData: UnityEngine.PointerEventData): void;
		OnPointerEnter(eventData: UnityEngine.PointerEventData): void;
		OnPointerExit(eventData: UnityEngine.PointerEventData): void;
		OnSelect(eventData: Object): void;
		OnDeselect(eventData: Object): void;
		Select(): void;
		static GetType() : UnityEngine.Type;
	}
	export class Text extends MaskableGraphic {
		readonly cachedTextGenerator: Object;
		readonly cachedTextGeneratorForLayout: Object;
		readonly mainTexture: UnityEngine.Texture;
		font: Object;
		text: string;
		supportRichText: boolean;
		resizeTextForBestFit: boolean;
		resizeTextMinSize: number;
		resizeTextMaxSize: number;
		alignment: TextAnchor;
		alignByGeometry: boolean;
		fontSize: number;
		horizontalOverflow: HorizontalWrapMode;
		verticalOverflow: VerticalWrapMode;
		lineSpacing: number;
		fontStyle: FontStyle;
		readonly pixelsPerUnit: number;
		readonly minWidth: number;
		readonly preferredWidth: number;
		readonly flexibleWidth: number;
		readonly minHeight: number;
		readonly preferredHeight: number;
		readonly flexibleHeight: number;
		readonly layoutPriority: number;
		FontTextureChanged(): void;
		GetGenerationSettings(extents: UnityEngine.Vector2): Object;
		static GetTextAnchorPivot(anchor: TextAnchor): UnityEngine.Vector2;
		CalculateLayoutInputHorizontal(): void;
		CalculateLayoutInputVertical(): void;
		static GetType() : UnityEngine.Type;
	}
	export class UIText extends Text {
		constructor();
		altas: Object;
		readonly preferredHeight: number;
		readonly preferredWidth: number;
		readonly renderWidth: number;
		readonly renderHeight: number;
		ProcessText(): void;
		GetUrlAtPosition(pos: UnityEngine.Vector2): string;
		static GetType() : UnityEngine.Type;
	}
	export class UITextUrl extends UnityEngine.MonoBehaviour {
		constructor();
		onUrlClick: (obj: string)=>void;
		static GetType() : UnityEngine.Type;
	}
	export class Image extends MaskableGraphic {
		sprite: UnityEngine.Sprite;
		overrideSprite: UnityEngine.Sprite;
		type: Image.Type;
		preserveAspect: boolean;
		fillCenter: boolean;
		fillMethod: Image.FillMethod;
		fillAmount: number;
		fillClockwise: boolean;
		fillOrigin: number;
		alphaHitTestMinimumThreshold: number;
		static readonly defaultETC1GraphicMaterial: UnityEngine.Material;
		readonly mainTexture: UnityEngine.Texture;
		readonly hasBorder: boolean;
		readonly pixelsPerUnit: number;
		material: UnityEngine.Material;
		readonly minWidth: number;
		readonly preferredWidth: number;
		readonly flexibleWidth: number;
		readonly minHeight: number;
		readonly preferredHeight: number;
		readonly flexibleHeight: number;
		readonly layoutPriority: number;
		OnBeforeSerialize(): void;
		OnAfterDeserialize(): void;
		SetNativeSize(): void;
		CalculateLayoutInputHorizontal(): void;
		CalculateLayoutInputVertical(): void;
		IsRaycastLocationValid(screenPoint: UnityEngine.Vector2, eventCamera: UnityEngine.Camera): boolean;
		static GetType() : UnityEngine.Type;
	}
	export class RawImage extends MaskableGraphic {
		readonly mainTexture: UnityEngine.Texture;
		texture: UnityEngine.Texture;
		uvRect: UnityEngine.Rect;
		SetNativeSize(): void;
		static GetType() : UnityEngine.Type;
	}
	export class ActiveToggle extends UnityEngine.UIBehaviour {
		interactable: boolean;
		normalState: Selectable;
		selectedState: Selectable;
		delay: number;
		onValueChanged: (arg0: boolean)=>void;
		group: ActiveToggleGroup;
		isOn: boolean;
		Rebuild(executing: CanvasUpdate): void;
		LayoutComplete(): void;
		GraphicUpdateComplete(): void;
		SetOn(): void;
		OnPointerClick(eventData: UnityEngine.PointerEventData): void;
		OnSubmit(eventData: Object): void;
		static GetType() : UnityEngine.Type;
	}
	export class ActiveToggleGroup extends UnityEngine.UIBehaviour {
		onValueChanged: (obj: number)=>void;
		allowSwitchOff: boolean;
		Selected: number;
		NotifyToggleOn(toggle: ActiveToggle): void;
		UnregisterToggle(toggle: ActiveToggle): void;
		RegisterToggle(toggle: ActiveToggle): void;
		AnyTogglesOn(): boolean;
		ActiveToggles(): Object;
		SetAllTogglesOff(): void;
		GetToggle(index: number): ActiveToggle;
		static GetType() : UnityEngine.Type;
	}
	export class Slider extends Selectable {
		fillRect: UnityEngine.RectTransform;
		handleRect: UnityEngine.RectTransform;
		direction: Slider.Direction;
		minValue: number;
		maxValue: number;
		wholeNumbers: boolean;
		value: number;
		normalizedValue: number;
		onValueChanged: (arg0: number)=>void;
		Rebuild(executing: CanvasUpdate): void;
		LayoutComplete(): void;
		GraphicUpdateComplete(): void;
		OnPointerDown(eventData: UnityEngine.PointerEventData): void;
		OnDrag(eventData: UnityEngine.PointerEventData): void;
		OnMove(eventData: Object): void;
		FindSelectableOnLeft(): Selectable;
		FindSelectableOnRight(): Selectable;
		FindSelectableOnUp(): Selectable;
		FindSelectableOnDown(): Selectable;
		OnInitializePotentialDrag(eventData: UnityEngine.PointerEventData): void;
		SetDirection(direction: Slider.Direction, includeRectLayouts: boolean): void;
		static GetType() : UnityEngine.Type;
	}
	export class ScrollRect extends UnityEngine.UIBehaviour {
		content: UnityEngine.RectTransform;
		horizontal: boolean;
		vertical: boolean;
		movementType: ScrollRect.MovementType;
		elasticity: number;
		inertia: boolean;
		decelerationRate: number;
		scrollSensitivity: number;
		viewport: UnityEngine.RectTransform;
		horizontalScrollbar: Scrollbar;
		verticalScrollbar: Scrollbar;
		horizontalScrollbarVisibility: ScrollRect.ScrollbarVisibility;
		verticalScrollbarVisibility: ScrollRect.ScrollbarVisibility;
		horizontalScrollbarSpacing: number;
		verticalScrollbarSpacing: number;
		onValueChanged: (arg0: UnityEngine.Vector2)=>void;
		velocity: UnityEngine.Vector2;
		normalizedPosition: UnityEngine.Vector2;
		horizontalNormalizedPosition: number;
		verticalNormalizedPosition: number;
		readonly minWidth: number;
		readonly preferredWidth: number;
		readonly flexibleWidth: number;
		readonly minHeight: number;
		readonly preferredHeight: number;
		readonly flexibleHeight: number;
		readonly layoutPriority: number;
		Rebuild(executing: CanvasUpdate): void;
		LayoutComplete(): void;
		GraphicUpdateComplete(): void;
		IsActive(): boolean;
		StopMovement(): void;
		OnScroll(data: UnityEngine.PointerEventData): void;
		OnInitializePotentialDrag(eventData: UnityEngine.PointerEventData): void;
		OnBeginDrag(eventData: UnityEngine.PointerEventData): void;
		OnEndDrag(eventData: UnityEngine.PointerEventData): void;
		OnDrag(eventData: UnityEngine.PointerEventData): void;
		CalculateLayoutInputHorizontal(): void;
		CalculateLayoutInputVertical(): void;
		SetLayoutHorizontal(): void;
		SetLayoutVertical(): void;
		static GetType() : UnityEngine.Type;
	}
	export class Scrollbar extends Selectable {
		handleRect: UnityEngine.RectTransform;
		direction: Scrollbar.Direction;
		value: number;
		size: number;
		numberOfSteps: number;
		onValueChanged: (arg0: number)=>void;
		Rebuild(executing: CanvasUpdate): void;
		LayoutComplete(): void;
		GraphicUpdateComplete(): void;
		OnBeginDrag(eventData: UnityEngine.PointerEventData): void;
		OnDrag(eventData: UnityEngine.PointerEventData): void;
		OnPointerDown(eventData: UnityEngine.PointerEventData): void;
		OnPointerUp(eventData: UnityEngine.PointerEventData): void;
		OnMove(eventData: Object): void;
		FindSelectableOnLeft(): Selectable;
		FindSelectableOnRight(): Selectable;
		FindSelectableOnUp(): Selectable;
		FindSelectableOnDown(): Selectable;
		OnInitializePotentialDrag(eventData: UnityEngine.PointerEventData): void;
		SetDirection(direction: Scrollbar.Direction, includeRectLayouts: boolean): void;
		static GetType() : UnityEngine.Type;
	}
	export class Dropdown extends Selectable {
		template: UnityEngine.RectTransform;
		captionText: Text;
		captionImage: Image;
		itemText: Text;
		itemImage: Image;
		options: Object[];
		onValueChanged: (arg0: number)=>void;
		value: number;
		RefreshShownValue(): void;
		AddOptions(options: Object[]): void;
		AddOptions(options: string[]): void;
		AddOptions(options: UnityEngine.Sprite[]): void;
		ClearOptions(): void;
		OnPointerClick(eventData: UnityEngine.PointerEventData): void;
		OnSubmit(eventData: Object): void;
		OnCancel(eventData: Object): void;
		Show(): void;
		Hide(): void;
		static GetType() : UnityEngine.Type;
	}
	export class InputField extends Selectable {
		shouldHideMobileInput: boolean;
		text: string;
		readonly isFocused: boolean;
		caretBlinkRate: number;
		caretWidth: number;
		textComponent: Text;
		placeholder: Graphic;
		caretColor: UnityEngine.Color;
		customCaretColor: boolean;
		selectionColor: UnityEngine.Color;
		onEndEdit: (arg0: string)=>void;
		onValueChanged: (arg0: string)=>void;
		onValidateInput: (text: string, charIndex: number, addedChar: number)=>number;
		characterLimit: number;
		contentType: InputField.ContentType;
		lineType: InputField.LineType;
		inputType: InputField.InputType;
		keyboardType: TouchScreenKeyboardType;
		characterValidation: InputField.CharacterValidation;
		readOnly: boolean;
		readonly multiLine: boolean;
		asteriskChar: number;
		readonly wasCanceled: boolean;
		caretPosition: number;
		selectionAnchorPosition: number;
		selectionFocusPosition: number;
		readonly minWidth: number;
		readonly preferredWidth: number;
		readonly flexibleWidth: number;
		readonly minHeight: number;
		readonly preferredHeight: number;
		readonly flexibleHeight: number;
		readonly layoutPriority: number;
		MoveTextEnd(shift: boolean): void;
		MoveTextStart(shift: boolean): void;
		OnBeginDrag(eventData: UnityEngine.PointerEventData): void;
		OnDrag(eventData: UnityEngine.PointerEventData): void;
		OnEndDrag(eventData: UnityEngine.PointerEventData): void;
		OnPointerDown(eventData: UnityEngine.PointerEventData): void;
		ProcessEvent(e: Object): void;
		OnUpdateSelected(eventData: Object): void;
		ForceLabelUpdate(): void;
		Rebuild(update: CanvasUpdate): void;
		LayoutComplete(): void;
		GraphicUpdateComplete(): void;
		ActivateInputField(): void;
		OnSelect(eventData: Object): void;
		OnPointerClick(eventData: UnityEngine.PointerEventData): void;
		DeactivateInputField(): void;
		OnDeselect(eventData: Object): void;
		OnSubmit(eventData: Object): void;
		CalculateLayoutInputHorizontal(): void;
		CalculateLayoutInputVertical(): void;
		static GetType() : UnityEngine.Type;
	}
	export class LayoutElement extends UnityEngine.UIBehaviour {
		ignoreLayout: boolean;
		minWidth: number;
		minHeight: number;
		preferredWidth: number;
		preferredHeight: number;
		flexibleWidth: number;
		flexibleHeight: number;
		readonly layoutPriority: number;
		CalculateLayoutInputHorizontal(): void;
		CalculateLayoutInputVertical(): void;
		static GetType() : UnityEngine.Type;
	}
	export class LayoutRebuilder  {
		constructor();
		readonly transform: UnityEngine.Transform;
		IsDestroyed(): boolean;
		static ForceRebuildLayoutImmediate(layoutRoot: UnityEngine.RectTransform): void;
		Rebuild(executing: CanvasUpdate): void;
		static MarkLayoutForRebuild(rect: UnityEngine.RectTransform): void;
		LayoutComplete(): void;
		GraphicUpdateComplete(): void;
		GetHashCode(): number;
		Equals(obj: Object): boolean;
		ToString(): string;
		static GetType() : UnityEngine.Type;
	}
}
declare module Tween {
	export class UITweener extends UnityEngine.MonoBehaviour {
		static current: UITweener;
		method: UITweener.Method;
		style: UITweener.Style;
		delay: number;
		duration: number;
		onFinished: ()=>void;
		eventReceiver: UnityEngine.GameObject;
		callWhenFinished: string;
		timeScaled: boolean;
		animationCurve: UnityEngine.AnimationCurve;
		readonly amountPerDelta: number;
		tweenFactor: number;
		readonly direction: Direction;
		Sample(factor: number, isFinished: boolean): void;
		PlayForward(): void;
		PlayReverse(): void;
		Play(forward: boolean): void;
		ResetToBeginning(): void;
		Toggle(): void;
		SetStartToCurrentValue(): void;
		SetEndToCurrentValue(): void;
		static GetType() : UnityEngine.Type;
	}
	export class TweenAlpha extends UITweener {
		constructor();
		from: number;
		to: number;
		value: number;
		static Begin(go: UnityEngine.GameObject, duration: number, alpha: number): TweenAlpha;
		SetStartToCurrentValue(): void;
		SetEndToCurrentValue(): void;
		static GetType() : UnityEngine.Type;
	}
	export class TweenShaderValue extends UITweener {
		constructor();
		from: number;
		to: number;
		value: number;
		static Begin(go: UnityEngine.GameObject, time: number, materials: UnityEngine.Material[], tweenName: string, fromValue: number, endValue: number): TweenShaderValue;
		static BeginSingle(go: UnityEngine.GameObject, time: number, material: UnityEngine.Material, tweenName: string, fromValue: number, endValue: number): TweenShaderValue;
		static BeginWithSkin(go: UnityEngine.GameObject, time: number, tweenName: string, fromValue: number, endValue: number): TweenShaderValue;
		static BeginWithMesh(go: UnityEngine.GameObject, time: number, tweenName: string, fromValue: number, endValue: number): TweenShaderValue;
		static BeginWithRenderer(go: UnityEngine.GameObject, time: number, tweenName: string, fromValue: number, endValue: number): TweenShaderValue;
		SetStartToCurrentValue(): void;
		SetEndToCurrentValue(): void;
		static GetType() : UnityEngine.Type;
	}
	export class TweenColor extends UITweener {
		constructor();
		from: UnityEngine.Color;
		to: UnityEngine.Color;
		value: UnityEngine.Color;
		static Begin(go: UnityEngine.GameObject, duration: number, color: UnityEngine.Color): TweenColor;
		SetStartToCurrentValue(): void;
		SetEndToCurrentValue(): void;
		static GetType() : UnityEngine.Type;
	}
	export class TweenPath extends UITweener {
		constructor();
		jumpHeightCurve: UnityEngine.AnimationCurve;
		jumpMoveCurve: UnityEngine.AnimationCurve;
		onApproach: (obj: number)=>void;
		readonly wholePath: UnityEngine.Vector3[];
		readonly pathIndex: number;
		readonly To: UnityEngine.Vector3;
		Speed: number;
		readonly cachedTransform: UnityEngine.Transform;
		value: UnityEngine.Vector3;
		static Begin(moveObj: UnityEngine.GameObject, rotateObj: UnityEngine.GameObject, speed: number, path: UnityEngine.Vector3[], jumpHeight: number, delay: number, approachDistanceInWorld: number): TweenPath;
		SetStartToCurrentValue(): void;
		SetEndToCurrentValue(): void;
		static GetType() : UnityEngine.Type;
	}
	export class TweenPosition extends UITweener {
		constructor();
		from: UnityEngine.Vector3;
		to: UnityEngine.Vector3;
		worldSpace: boolean;
		readonly cachedTransform: UnityEngine.Transform;
		value: UnityEngine.Vector3;
		static Begin(go: UnityEngine.GameObject, duration: number, pos: UnityEngine.Vector3): TweenPosition;
		static Begin(go: UnityEngine.GameObject, duration: number, pos: UnityEngine.Vector3, worldSpace: boolean): TweenPosition;
		SetStartToCurrentValue(): void;
		SetEndToCurrentValue(): void;
		static GetType() : UnityEngine.Type;
	}
	export class TweenTarget extends UITweener {
		constructor();
		from: UnityEngine.Vector3;
		targetTrans: UnityEngine.Transform;
		worldSpace: boolean;
		readonly cachedTransform: UnityEngine.Transform;
		value: UnityEngine.Vector3;
		static Begin(go: UnityEngine.GameObject, duration: number, targetTrans: UnityEngine.Transform): TweenTarget;
		static Begin(go: UnityEngine.GameObject, duration: number, targetTrans: UnityEngine.Transform, worldSpace: boolean): TweenTarget;
		SetStartToCurrentValue(): void;
		SetEndToCurrentValue(): void;
		static GetType() : UnityEngine.Type;
	}
	export class TweenRotation extends UITweener {
		constructor();
		from: UnityEngine.Vector3;
		to: UnityEngine.Vector3;
		quaternionLerp: boolean;
		readonly cachedTransform: UnityEngine.Transform;
		value: UnityEngine.Quaternion;
		static Begin(go: UnityEngine.GameObject, duration: number, rot: UnityEngine.Quaternion): TweenRotation;
		static Begin(go: UnityEngine.GameObject, duration: number, v3: UnityEngine.Vector3): TweenRotation;
		SetStartToCurrentValue(): void;
		SetEndToCurrentValue(): void;
		static GetType() : UnityEngine.Type;
	}
	export class TweenScale extends UITweener {
		constructor();
		from: UnityEngine.Vector3;
		to: UnityEngine.Vector3;
		readonly cachedTransform: UnityEngine.Transform;
		value: UnityEngine.Vector3;
		static Begin(go: UnityEngine.GameObject, duration: number, scale: UnityEngine.Vector3): TweenScale;
		static Begin(go: UnityEngine.GameObject, duration: number, from: UnityEngine.Vector3, scale: UnityEngine.Vector3): TweenScale;
		SetStartToCurrentValue(): void;
		SetEndToCurrentValue(): void;
		static GetType() : UnityEngine.Type;
	}
	export class TweenSlider extends UITweener {
		constructor();
		from: number;
		to: number;
		readonly cachedSlider: UnityEngine.UI.Slider;
		value: number;
		static Begin(go: UnityEngine.GameObject, time: number, fromValue: number, endValue: number): TweenSlider;
		SetStartToCurrentValue(): void;
		SetEndToCurrentValue(): void;
		static GetType() : UnityEngine.Type;
	}
	export class TweenImageFillAmount extends UITweener {
		constructor();
		from: number;
		to: number;
		readonly cachedImage: UnityEngine.UI.Image;
		value: number;
		static Begin(go: UnityEngine.GameObject, time: number, value: number): TweenImageFillAmount;
		SetStartToCurrentValue(): void;
		SetEndToCurrentValue(): void;
		static GetType() : UnityEngine.Type;
	}
	export class TweenFov extends UITweener {
		constructor();
		from: number;
		to: number;
		value: number;
		static Begin(c: UnityEngine.Camera, time: number, from: number, to: number): TweenFov;
		SetStartToCurrentValue(): void;
		SetEndToCurrentValue(): void;
		static GetType() : UnityEngine.Type;
	}
	export class TweenTimeScale extends UITweener {
		constructor();
		from: number;
		to: number;
		value: number;
		static Begin(go: UnityEngine.GameObject, time: number, from: number, to: number): TweenTimeScale;
		SetStartToCurrentValue(): void;
		SetEndToCurrentValue(): void;
		static GetType() : UnityEngine.Type;
	}
}
declare module Game {
	export class UIClickListener extends UnityEngine.MonoBehaviour {
		constructor();
		static eventData: UnityEngine.PointerEventData;
		static target: UnityEngine.GameObject;
		delay: number;
		onClick: ()=>void;
		static Get(go: UnityEngine.GameObject): UIClickListener;
		static GetType() : UnityEngine.Type;
	}
	export class UIDragListener extends UnityEngine.MonoBehaviour {
		constructor();
		static eventData: UnityEngine.PointerEventData;
		static target: UnityEngine.GameObject;
		onDrag: ()=>void;
		static Get(go: UnityEngine.GameObject): UIDragListener;
		static GetType() : UnityEngine.Type;
	}
	export class UITouchListener extends UnityEngine.MonoBehaviour {
		constructor();
		static eventData: UnityEngine.PointerEventData;
		static target: UnityEngine.GameObject;
		touchingDelta: number;
		touchingBeginDelta: number;
		pressed: boolean;
		onTouchBegin: ()=>void;
		onTouchEnd: ()=>void;
		onTouching: ()=>void;
		static Get(go: UnityEngine.GameObject): UITouchListener;
		static GetType() : UnityEngine.Type;
	}
	export class InputListener extends UnityEngine.MonoBehaviour {
		constructor();
		onClick: (arg1: UnityEngine.GameObject, arg2: number, arg3: number, arg4: number)=>void;
		onUIClick: ()=>void;
		onGuesture: (arg1: number, arg2: number)=>void;
		fingerActionSensitivity: number;
		maxCount: number;
		static GetType() : UnityEngine.Type;
	}
	export class UnitStateListener extends UnityEngine.MonoBehaviour {
		constructor();
		SetTileMap(tileMap: TileMap): void;
		BindVisibleChangeAction(onVisibleChange: (obj: boolean)=>void): void;
		BindSaftyChangeAction(onSaftyChange: (obj: boolean)=>void): void;
		BindTerrainTypeChangeAction(onTerrainTypeChange: (obj: number)=>void): void;
		BindCheckTeleportAction(onCheckTeleport: (obj: number)=>void): void;
		Reset(): void;
		static GetType() : UnityEngine.Type;
	}
	export class JoystickListener extends UnityEngine.MonoBehaviour {
		constructor();
		arrow: UnityEngine.RectTransform;
		distance: number;
		onJoystickUpdate: (obj: UnityEngine.Vector2)=>void;
		onJoystickEnd: ()=>void;
		Awake(): void;
		OnPointerDown(eventData: UnityEngine.PointerEventData): void;
		OnPointerUp(eventData: UnityEngine.PointerEventData): void;
		OnDrag(eventData: UnityEngine.PointerEventData): void;
		static GetType() : UnityEngine.Type;
	}
	export class UIPointerDownListener extends UnityEngine.MonoBehaviour {
		constructor();
		static eventData: UnityEngine.PointerEventData;
		static target: UnityEngine.GameObject;
		onClick: ()=>void;
		static Get(go: UnityEngine.GameObject): UIPointerDownListener;
		static GetType() : UnityEngine.Type;
	}
	export class UIPointerUpListener extends UnityEngine.MonoBehaviour {
		constructor();
		static eventData: UnityEngine.PointerEventData;
		static target: UnityEngine.GameObject;
		onClick: ()=>void;
		static Get(go: UnityEngine.GameObject): UIPointerUpListener;
		static GetType() : UnityEngine.Type;
	}
	export class UIPointerExitListener extends UnityEngine.MonoBehaviour {
		constructor();
		static eventData: UnityEngine.PointerEventData;
		static target: UnityEngine.GameObject;
		onClick: ()=>void;
		static Get(go: UnityEngine.GameObject): UIPointerExitListener;
		static GetType() : UnityEngine.Type;
	}
	export class UIButtonScale extends UnityEngine.MonoBehaviour {
		constructor();
		tweenTarget: UnityEngine.GameObject;
		pressed: UnityEngine.Vector3;
		duration: number;
		backDeltaFactor: number;
		static DownCurve: UnityEngine.AnimationCurve;
		downCurve: UnityEngine.AnimationCurve;
		useCurve: boolean;
		static UpCurve: UnityEngine.AnimationCurve;
		upCurve: UnityEngine.AnimationCurve;
		static GetType() : UnityEngine.Type;
	}
	export class FyScrollRect extends UnityEngine.UIBehaviour {
		sliceSize: UnityEngine.Vector2;
		content: UnityEngine.RectTransform;
		horizontal: boolean;
		vertical: boolean;
		movementType: FyScrollRect.MovementType;
		elasticity: number;
		inertia: boolean;
		decelerationRate: number;
		scrollSensitivity: number;
		viewport: UnityEngine.RectTransform;
		BeginDragCallback: ()=>void;
		EndDragCallback: ()=>void;
		horizontalScrollbar: UnityEngine.UI.Scrollbar;
		verticalScrollbar: UnityEngine.UI.Scrollbar;
		horizontalScrollbarVisibility: FyScrollRect.ScrollbarVisibility;
		verticalScrollbarVisibility: FyScrollRect.ScrollbarVisibility;
		horizontalScrollbarSpacing: number;
		verticalScrollbarSpacing: number;
		onValueChanged: (arg0: UnityEngine.Vector2)=>void;
		velocity: UnityEngine.Vector2;
		normalizedPosition: UnityEngine.Vector2;
		horizontalNormalizedPosition: number;
		verticalNormalizedPosition: number;
		readonly minWidth: number;
		readonly preferredWidth: number;
		readonly flexibleWidth: number;
		readonly minHeight: number;
		readonly preferredHeight: number;
		readonly flexibleHeight: number;
		readonly layoutPriority: number;
		Rebuild(executing: UnityEngine.UI.CanvasUpdate): void;
		LayoutComplete(): void;
		GraphicUpdateComplete(): void;
		IsActive(): boolean;
		StopMovement(): void;
		OnScroll(data: UnityEngine.PointerEventData): void;
		OnInitializePotentialDrag(eventData: UnityEngine.PointerEventData): void;
		OnBeginDrag(eventData: UnityEngine.PointerEventData): void;
		OnEndDrag(eventData: UnityEngine.PointerEventData): void;
		OnDrag(eventData: UnityEngine.PointerEventData): void;
		CalculateLayoutInputHorizontal(): void;
		CalculateLayoutInputVertical(): void;
		SetLayoutHorizontal(): void;
		SetLayoutVertical(): void;
		static GetType() : UnityEngine.Type;
	}
	export class ArrayHelper  {
		static GetArrayLength(array: Object): number;
		static GetArrayValue(array: Object, index: number): Object;
		static SetArrayValue(array: Object, index: number, obj: Object): void;
		static GetType() : UnityEngine.Type;
	}
	export class ByteArray  {
		constructor(readBytes: number[], writeBytes: number[]);
		readonly IsLittleEndian: boolean;
		useLittleEndian: boolean;
		readonly ReadLength: number;
		ReadPosition: number;
		GetWriteBytes(): number[];
		Dispose(): void;
		ReadBoolean(): boolean;
		ReadByte(): number;
		ReadInt16(): number;
		ReadInt32(): number;
		ReadInt64(): number;
		ReadSingle(): number;
		ReadDouble(): number;
		ReadBytes(count: number): number[];
		ReadString(): string;
		WriteBoolean(value: boolean): void;
		WriteByte(value: number): void;
		WriteInt16(value: number): void;
		WriteInt32(value: number): void;
		WriteInt64(value: number): void;
		WriteSingle(value: number): void;
		WriteDouble(value: number): void;
		WriteBytes(value: number[]): void;
		WriteString(text: string): void;
		WriteVector3(value: UnityEngine.Vector3): void;
		ReadVector3(): UnityEngine.Vector3;
		WriteVector4(value: UnityEngine.Vector4): void;
		ReadVector4(): UnityEngine.Vector4;
		WriteVector2(value: UnityEngine.Vector2): void;
		ReadVector2(): UnityEngine.Vector2;
		WriteColor(value: UnityEngine.Color): void;
		ReadColor(): UnityEngine.Color;
		static GetType() : UnityEngine.Type;
	}
	export class UnitFollower extends UnityEngine.MonoBehaviour {
		constructor();
		yOffset: number;
		target: UnityEngine.Transform;
		Shake(direction: QuakeDirection, quakeTime: number, quakeSize: number, curve: UnityEngine.AnimationCurve): void;
		ClearQuakes(): void;
		static GetType() : UnityEngine.Type;
	}
	export class ParticleFollower extends UnityEngine.MonoBehaviour {
		constructor();
		static onlyMove: boolean;
		target: UnityEngine.Transform;
		static GetType() : UnityEngine.Type;
	}
	export class ResLoader extends UnityEngine.MonoBehaviour {
		constructor();
		static readonly isPublish: boolean;
		static readonly assetbundlePathConfigName: string;
		static isRemote: boolean;
		static clearAllAssetsOnLoad: boolean;
		static readonly urlAssets: Object;
		static readonly urlAssetsNoCache: UrlAsset[];
		static readonly assetbundleVersion: number;
		static readonly isCleaning: boolean;
		static Exist(path: string): boolean;
		static IsDownloaded(path: string): boolean;
		static PrintAllAssets(): void;
		static CreateAssetsRequest(priority: AssetPriority, abList: string[]): AssetRequest;
		static CreateDownloadRequest(priority: AssetPriority, abList: string[], containDownloaded: boolean): DownloadRequest;
		static CreateAssetRequest(priority: AssetPriority, path: string): AssetRequest;
		static BeginAssetRequest(request: AssetRequest, callback: (obj: Game.AssetRequest)=>void): boolean;
		static BeginDownloadRequest(request: DownloadRequest, callback: (obj: Game.DownloadRequest)=>void): boolean;
		static CreateUrlAssetRequest(urlAssetType: UrlAssetType, url: string, cache: boolean): UrlAssetRequest;
		static BeginUrlAssetRequest(request: UrlAssetRequest, callback: (obj: Game.UrlAssetRequest)=>void): boolean;
		static GetAssetLocalPath(path: string): string;
		static LoadAsset(path: string): Asset;
		static LoadTextFromFullUrl(url: string, callback: (arg1: string, arg2: string)=>void): void;
		static LoadTextFromFullUrlByPost(url: string, post: string, callback: (arg1: string, arg2: string)=>void): void;
		static ReleaseAsset(path: string): boolean;
		static ReleaseAsset(asset: Asset): boolean;
		static ClearMemoryInternal(unloadRes: boolean): void;
		static ClearMemory(timeDelta: number, triggerGC: boolean): void;
		static GetAllAssetBundleNameList(): string[];
		static GetAssetBundleNameList(list: string[]): string[];
		static ValidStringList(strList: string[]): string[];
		static GetType() : UnityEngine.Type;
	}
	export class UrlAssetRequest  {
		readonly urlAssetType: UrlAssetType;
		readonly mainAsset: UrlAsset;
		readonly url: string;
		readonly error: string;
		readonly isDone: boolean;
		readonly cache: boolean;
		Abort(): void;
		static GetType() : UnityEngine.Type;
	}
	export class UrlAsset  {
		constructor();
		bytes: number[];
		text: string;
		texture: UnityEngine.Texture2D;
		AddLinkObject(go: UnityEngine.GameObject): void;
		static GetType() : UnityEngine.Type;
	}
	export class Asset  {
		autoCollect: boolean;
		readonly path: string;
		readonly source: UnityEngine.UnityObject;
		readonly loaded: boolean;
		readonly bytes: number[];
		readonly material: UnityEngine.Material;
		readonly shader: UnityEngine.Shader;
		readonly texture: UnityEngine.Texture2D;
		readonly audioClip: UnityEngine.AudioClip;
		readonly textAsset: UnityEngine.TextAsset;
		readonly gameObject: UnityEngine.GameObject;
		readonly CollectTime: number;
		Load(key: string): UnityEngine.UnityObject;
		LoadSubAsset(key: string, type: UnityEngine.Type): UnityEngine.UnityObject;
		Instantiate(parent: UnityEngine.Transform, worldPositionStay: boolean): UnityEngine.GameObject;
		AddLinkObject(target: UnityEngine.GameObject): void;
		RemoveLinkObject(target: UnityEngine.GameObject): void;
		DestroyLinkedGameObject(): void;
		GetLinkedGameObject(name: string): UnityEngine.GameObject;
		ReleaseImmediate(destroyLinkedGameObject: boolean): void;
		ToString(): string;
		static GetType() : UnityEngine.Type;
	}
	export class RequestBase  {
		constructor();
		readonly priority: AssetPriority;
		readonly loadCount: number;
		readonly error: string;
		readonly isDone: boolean;
		readonly maxCount: number;
		readonly progress: number;
		readonly loadSize: number;
		readonly maxSize: number;
		readonly isLoading: boolean;
		Abort(): void;
		static GetType() : UnityEngine.Type;
	}
	export class AssetRequest extends RequestBase {
		readonly mainAsset: Asset;
		readonly maxCount: number;
		readonly loadSize: number;
		readonly hasDownloadAsset: boolean;
		readonly multiLoad: boolean;
		Abort(): void;
		ToString(): string;
		static GetType() : UnityEngine.Type;
	}
	export class DownloadRequest extends RequestBase {
		readonly maxCount: number;
		readonly loadSize: number;
		Abort(): void;
		ToString(): string;
		static GetType() : UnityEngine.Type;
	}
	export class RangeLoader extends UnityEngine.MonoBehaviour {
		constructor();
		frame: number;
		listener: UnityEngine.Transform;
		Add(onChange: (obj: boolean)=>void, pos: UnityEngine.Vector3, checkRangeX: number, checkRangeY: number, url: string): number;
		Remove(dicKey: number): void;
		Clear(): void;
		GetInRangeList(): string[];
		static GetType() : UnityEngine.Type;
	}
	export class TileMap extends UnityEngine.MonoBehaviour {
		constructor();
		Rows: number;
		Columns: number;
		TileWidth: number;
		TileHeight: number;
		readonly Width: number;
		readonly Height: number;
		InitByPixel(mapWidth: number, mapHeight: number, cellWidth: number, cellHeight: number, meterSize: number): void;
		Init(rows: number, columns: number): void;
		CheckPointInMap(x: number, y: number): boolean;
		SetTileCollision(x: number, y: number, walkable: number): void;
		GetIslandIdx(x: number, y: number): number;
		IsWalkablePositionPixel(pixelX: number, pixelY: number): boolean;
		SetTileData(mapWidth: number, mapHeight: number, meterSize: number, byteArray: ByteArray): void;
		MergeTiles(usMaxBlockIdx: number): void;
		SearchValidNabor(curPosPixel: UnityEngine.Vector2, toPosPixel: UnityEngine.Vector2): UnityEngine.Vector2;
		SearchValidGrid(startX: number, startY: number, endX: number, endY: number, checkBlock: boolean, checkConnected: boolean): UnityEngine.Vector2;
		SearchValidGridForJoystick(startX: number, startY: number, endX: number, endY: number): UnityEngine.Vector2;
		IsConnectedPixel(startX: number, startY: number, endX: number, endY: number): boolean;
		TestWalkStraight(startX: number, startY: number, endX: number, endY: number): boolean;
		GetPathInPixel(startX: number, startY: number, endX: number, endY: number): UnityEngine.Vector2[];
		SetTeleportInfos(validDistance: number, teleportPosList: UnityEngine.Vector2[], teleportIdList: number[]): void;
		static GetType() : UnityEngine.Type;
	}
	export class Tools  {
		static version: number;
		static readonly TotalMemorySize: number;
		static ClearChildren(trans: UnityEngine.Transform): void;
		static GetHierarchy(obj: UnityEngine.GameObject): string;
		static SetSortingOrder(root: UnityEngine.GameObject, order: number): void;
		static SetRendererLayer(root: UnityEngine.GameObject, layer: number): void;
		static GetLocalPosition(transform: UnityEngine.Transform, v: Object): void;
		static GetPosition(transform: UnityEngine.Transform, v: Object): void;
		static SetGameObjectPosition(gameObject: UnityEngine.GameObject, v: UnityEngine.Vector3): void;
		static SetGameObjectLocalPosition(gameObject: UnityEngine.GameObject, v: UnityEngine.Vector3): void;
		static GetGameObjectLocalPosition(gameObject: UnityEngine.GameObject, v: Object): void;
		static GetGameObjectPosition(gameObject: UnityEngine.GameObject, v: Object): void;
		static SetGameObjectPosition(gameObject: UnityEngine.GameObject, x: number, y: number, z: number): void;
		static SetGameObjectLocalPosition(gameObject: UnityEngine.GameObject, x: number, y: number, z: number): void;
		static SetLocalPosition(transform: UnityEngine.Transform, x: number, y: number, z: number): void;
		static SetPosition(transform: UnityEngine.Transform, x: number, y: number, z: number): void;
		static SetLocalPosition(transform: UnityEngine.Transform, v3: UnityEngine.Vector3): void;
		static SetPosition(transform: UnityEngine.Transform, v3: UnityEngine.Vector3): void;
		static GetLocalRotation(transform: UnityEngine.Transform, v: Object): void;
		static GetRotation(transform: UnityEngine.Transform, v: Object): void;
		static SetLocalRotation(transform: UnityEngine.Transform, v: UnityEngine.Vector3): void;
		static SetLocalRotation(transform: UnityEngine.Transform, x: number, y: number, z: number): void;
		static SetRotation(transform: UnityEngine.Transform, v: UnityEngine.Vector3): void;
		static SetRotation(transform: UnityEngine.Transform, x: number, y: number, z: number): void;
		static GetAnchoredPosition(transform: UnityEngine.RectTransform, v: Object): void;
		static SetAnchoredPosition(transform: UnityEngine.RectTransform, x: number, y: number): void;
		static GetAnchoredPosition3D(transform: UnityEngine.RectTransform, v: Object): void;
		static SetAnchoredPosition3D(transform: UnityEngine.RectTransform, x: number, y: number, z: number): void;
		static GetRectSize(transform: UnityEngine.RectTransform, v: Object): void;
		static GetAnchorMax(transform: UnityEngine.RectTransform, v: Object): void;
		static SetAnchorMax(transform: UnityEngine.RectTransform, x: number, y: number): void;
		static GetAnchorMin(transform: UnityEngine.RectTransform, v: Object): void;
		static SetAnchorMin(transform: UnityEngine.RectTransform, x: number, y: number): void;
		static GetOffsetMax(transform: UnityEngine.RectTransform, v: Object): void;
		static SetOffsetMax(transform: UnityEngine.RectTransform, x: number, y: number): void;
		static GetOffsetMin(transform: UnityEngine.RectTransform, v: Object): void;
		static SetOffsetMin(transform: UnityEngine.RectTransform, x: number, y: number): void;
		static GetPivot(transform: UnityEngine.RectTransform, v: Object): void;
		static SetPivot(transform: UnityEngine.RectTransform, x: number, y: number): void;
		static GetSizeDelta(transform: UnityEngine.RectTransform, v: Object): void;
		static SetSizeDelta(transform: UnityEngine.RectTransform, x: number, y: number): void;
		static GetGameObjectAnchoredPosition(gameObject: UnityEngine.GameObject, v: Object): void;
		static SetGameObjectAnchoredPosition(gameObject: UnityEngine.GameObject, x: number, y: number): void;
		static GetGameObjectAnchoredPosition3D(gameObject: UnityEngine.GameObject, v: Object): void;
		static SetGameObjectAnchoredPosition3D(gameObject: UnityEngine.GameObject, x: number, y: number, z: number): void;
		static GetGameObjectRectSize(gameObject: UnityEngine.GameObject, v: Object): void;
		static GetGameObjectAnchorMax(gameObject: UnityEngine.GameObject, v: Object): void;
		static SetGameObjectAnchorMax(gameObject: UnityEngine.GameObject, x: number, y: number): void;
		static GetGameObjectAnchorMin(gameObject: UnityEngine.GameObject, v: Object): void;
		static SetGameObjectAnchorMin(gameObject: UnityEngine.GameObject, x: number, y: number): void;
		static GetGameObjectOffsetMax(gameObject: UnityEngine.GameObject, v: Object): void;
		static SetGameObjectOffsetMax(gameObject: UnityEngine.GameObject, x: number, y: number): void;
		static GetGameObjectOffsetMin(gameObject: UnityEngine.GameObject, v: Object): void;
		static SetGameObjectOffsetMin(gameObject: UnityEngine.GameObject, x: number, y: number): void;
		static GetGameObjectPivot(gameObject: UnityEngine.GameObject, v: Object): void;
		static SetGameObjectPivot(gameObject: UnityEngine.GameObject, x: number, y: number): void;
		static GetGameObjectSizeDelta(gameObject: UnityEngine.GameObject, v: Object): void;
		static SetGameObjectSizeDelta(gameObject: UnityEngine.GameObject, x: number, y: number): void;
		static SetGameObjectLocalRotation(gameObject: UnityEngine.GameObject, v: UnityEngine.Vector3): void;
		static SetGameObjectLocalRotation(gameObject: UnityEngine.GameObject, x: number, y: number, z: number): void;
		static SetGameObjectRotation(gameObject: UnityEngine.GameObject, v: UnityEngine.Vector3): void;
		static SetLocalScale(transform: UnityEngine.Transform, x: number, y: number, z: number): void;
		static SetLocalScale(transform: UnityEngine.Transform, v: UnityEngine.Vector3): void;
		static GetLocalScale(transform: UnityEngine.Transform, v: Object): void;
		static GetGameObjectLocalScale(gameObject: UnityEngine.GameObject, v: Object): void;
		static SetGameObjectLocalScale(gameObject: UnityEngine.GameObject, x: number, y: number, z: number): void;
		static GetForward(transform: UnityEngine.Transform, v: Object): void;
		static SetGameObjectLocalScale(gameObject: UnityEngine.GameObject, v: UnityEngine.Vector3): void;
		static GetRenderBounds(renderer: UnityEngine.Renderer, v: Object): void;
		static GetRenderBoundsSize(renderer: UnityEngine.Renderer, v: Object): void;
		static GetMaterialColor(material: UnityEngine.Material, v: Object): void;
		static Md5(str: string): string;
		static SetGameObjectParent(parent: UnityEngine.GameObject, child: UnityEngine.GameObject, worldStay: boolean): void;
		static SetParent(parent: UnityEngine.Transform, child: UnityEngine.GameObject, worldStay: boolean): void;
		static NormalizeGameObject(gameObject: UnityEngine.GameObject, position: boolean, rotation: boolean, scale: boolean): void;
		static NormalizeTransform(transform: UnityEngine.Transform, position: boolean, rotation: boolean, scale: boolean): void;
		static GetChild(gameObject: UnityEngine.GameObject, name: string): UnityEngine.GameObject;
		static GetChild(transform: UnityEngine.Transform, name: string): UnityEngine.GameObject;
		static GetChildElement(gameObject: UnityEngine.GameObject, type: UnityEngine.Type, name: string): UnityEngine.Component;
		static GetChildElement(transform: UnityEngine.Transform, type: UnityEngine.Type, name: string): UnityEngine.Component;
		static CopyRectTransformSize(a: UnityEngine.GameObject, b: UnityEngine.GameObject): void;
		static Instantiate(prefab: UnityEngine.GameObject, parent: UnityEngine.GameObject, worldPositionStays: boolean): UnityEngine.GameObject;
		static GetVector2GroupItem(vList: UnityEngine.Vector2[], index: number, v: Object): void;
		static GetVector3GroupItem(vList: UnityEngine.Vector3[], index: number, v: Object): void;
		static isAnimatorPlaying(animator: UnityEngine.Animator, layer: number, name: string): boolean;
		static AddBesizer(obj: UnityEngine.GameObject, speed: number, angle: number, target: UnityEngine.GameObject, onFinished: ()=>void): UnityEngine.Component;
		static Add2DRectMask(obj: UnityEngine.GameObject): UnityEngine.Component;
		static AddGraphicRaycaster(obj: UnityEngine.GameObject): UnityEngine.Component;
		static GetGraphicRaycaster(obj: UnityEngine.GameObject): UnityEngine.Component;
		static ChangeScene(name: string): void;
		static Vibrate(): void;
		static PlayMovie(path: string): void;
		static AddUIRaycaster(gameObject: UnityEngine.GameObject): void;
		static SetBuglyUserId(userid: string): void;
		static ShowLogPanel(): void;
		static DumpCacheCount(): number;
		static AndroidAssetIsExists(assetName: string): boolean;
		static BytesToStringArray(bytes: number[]): string[];
		static GetAnimLength(animator: UnityEngine.Animator, animName: string): number;
		static GetComponentLayer(com: UnityEngine.Component): number;
		static GetType() : UnityEngine.Type;
	}
	export class ElementsMapper extends UnityEngine.MonoBehaviour {
		constructor();
		Panels: UnityEngine.GameObject[];
		Elements: Object[];
		readonly panelCount: number;
		GetPanel(index: number): UnityEngine.GameObject;
		GetElement(name: string): UnityEngine.GameObject;
		GetElement(type: UnityEngine.Type, name: string): UnityEngine.Component;
		static GetType() : UnityEngine.Type;
	}
	export class MapViewportChecker extends UnityEngine.MonoBehaviour {
		constructor();
		SetCheckDis(dis: number): void;
		SetListener(listener: (arg1: number, arg2: number, arg3: number)=>void): void;
		Reset(): void;
		static GetType() : UnityEngine.Type;
	}
	export class TransformFollower extends UnityEngine.MonoBehaviour {
		constructor();
		target: UnityEngine.Transform;
		selfCamera: UnityEngine.Camera;
		targetCamera: UnityEngine.Camera;
		offset: UnityEngine.Vector3;
		ignoreX: boolean;
		ignoreY: boolean;
		ignoreZ: boolean;
		ForceUpdate(): void;
		static GetType() : UnityEngine.Type;
	}
	export class Timer  {
		constructor(name: string, time: number, loop: number, callback: (obj: Game.Timer)=>void);
		readonly Name: string;
		readonly Dead: boolean;
		readonly MaxTime: number;
		readonly LeftTime: number;
		readonly CallCount: number;
		readonly CallCountDelta: number;
		readonly Loop: number;
		readonly TargetInterval: number;
		SetIntervalCall(interval: number, intervalCallback: (obj: Game.Timer)=>void): void;
		ResetTimer(time: number, loop: number, callback: (obj: Game.Timer)=>void): void;
		Stop(): void;
		static GetType() : UnityEngine.Type;
	}
	export class Profiler  {
		static readonly Ins: Profiler;
		Push(nodeName: string): void;
		Pop(): void;
		static GetType() : UnityEngine.Type;
	}
	export class SpecialAnimationPlayer extends UnityEngine.MonoBehaviour {
		constructor();
		functionName: string;
		funcParams: string[];
		GetDouble(index: number): number;
		GetFloat(index: number): number;
		GetString(index: number): string;
		static GetType() : UnityEngine.Type;
	}
	export class Invoker extends UnityEngine.MonoBehaviour {
		constructor();
		static BeginInvoke(go: UnityEngine.GameObject, key: string, time: number, callback: ()=>void): void;
		static EndInvoke(go: UnityEngine.GameObject, key: string): void;
		static IsInvoking(go: UnityEngine.GameObject, key: string): boolean;
		static AddDestroyInvoke(go: UnityEngine.GameObject, callback: ()=>void): void;
		static GetType() : UnityEngine.Type;
	}
	export class UGUIAltas extends UnityEngine.MonoBehaviour {
		constructor();
		Get(name: string): UnityEngine.Sprite;
		static GetType() : UnityEngine.Type;
	}
	export class SystemSDK extends UnityEngine.MonoBehaviour {
		constructor();
		static onDestroy: ()=>void;
		static onMessage: (obj: string)=>void;
		static onApplicationPause: (obj: boolean)=>void;
		static onPressQuitKey: ()=>void;
		static onKeyDown: (obj: Game.KeyCode)=>void;
		static JavaCaller(className: string, classField: string, classMethod: string, methodName: string, javaMethod: string, genericType: UnityEngine.Type, args: Object[]): Object;
		static GetType() : UnityEngine.Type;
	}
	export class FixedMessageBox  {
		constructor();
		static Show(text: string, callback: (obj: boolean)=>void): void;
		static GetType() : UnityEngine.Type;
	}
	export class BuildDefines  {
		constructor();
		static readonly defines: string;
		static GetType() : UnityEngine.Type;
	}
	export class AfterImageEffects extends UnityEngine.MonoBehaviour {
		constructor();
		life: number;
		interval: number;
		material: UnityEngine.Material;
		autoDisable: boolean;
		useOriginalTexture: boolean;
		animationCurve: UnityEngine.AnimationCurve;
		SetRenderer(r: UnityEngine.SkinnedMeshRenderer): void;
		static GetType() : UnityEngine.Type;
	}
	export class CameraEffect extends UnityEngine.MonoBehaviour {
		constructor();
		onRenderer: ()=>void;
		material: UnityEngine.Material;
		static GetType() : UnityEngine.Type;
	}
	export class IosSdk extends UnityEngine.MonoBehaviour {
		constructor();
		static onIosSdkToTsMessage: (obj: string)=>void;
		static IosCallSDkFunc(type: string, jsonpara: string): void;
		static IosCallUIActiveInit(): void;
		static IosCallStringBySDK(type: string): string;
		static GetType() : UnityEngine.Type;
	}
	export class ItemAppearEffect extends UnityEngine.MonoBehaviour {
		constructor();
		Set(delayTime: number, axis: number, elasticity: number, offset: number, offsetdir: UnityEngine.Vector2): void;
		Stop(): void;
		static GetType() : UnityEngine.Type;
	}
	export class DonotDestroyManager  {
		static Add(go: UnityEngine.GameObject): void;
		static Remove(go: UnityEngine.GameObject): void;
		static Clear(): void;
		static Log(): void;
		static GetType() : UnityEngine.Type;
	}
	export class Config  {
		constructor();
		static readonly remoteResUrl: string;
		static readonly plat: number;
		static readonly gameid: number;
		static readonly apkpath: string;
		static readonly bundleId: string;
		static readonly productName: string;
		static GetType() : UnityEngine.Type;
	}
	export class Log  {
		constructor();
		static svnver: number;
		static log(message: Object): void;
		static logWarning(message: Object): void;
		static logError(message: Object): void;
		static logError(message: Object, context: UnityEngine.UnityObject): void;
		static GetType() : UnityEngine.Type;
	}
	export class CustomBehaviour extends UnityEngine.MonoBehaviour {
		constructor();
		onAwake: ()=>void;
		onStart: ()=>void;
		onReset: ()=>void;
		onApplicationFocus: (obj: boolean)=>void;
		onApplicationPause: (obj: boolean)=>void;
		onApplicationQuit: ()=>void;
		onCollisionEnter: (obj: Object)=>void;
		onCollisionStay: (obj: Object)=>void;
		onCollisionExit: (obj: Object)=>void;
		onCollisionEnter2D: (obj: Object)=>void;
		onCollisionStay2D: (obj: Object)=>void;
		onCollisionExit2D: (obj: Object)=>void;
		onControllerColliderHit: (obj: Object)=>void;
		onDestroy: ()=>void;
		onDisable: ()=>void;
		onEnable: ()=>void;
		onParticleCollision: (obj: UnityEngine.GameObject)=>void;
		onTriggerEnter: (obj: UnityEngine.Collider)=>void;
		onTriggerStay: (obj: UnityEngine.Collider)=>void;
		onTriggerExit: (obj: UnityEngine.Collider)=>void;
		onTriggerEnter2D: (obj: Object)=>void;
		onTriggerStay2D: (obj: Object)=>void;
		onTriggerExit2D: (obj: Object)=>void;
		GetNumber(index: number): number;
		GetNumber(name: string): number;
		GetBool(index: number): boolean;
		GetBool(name: string): boolean;
		GetString(index: number): string;
		GetString(name: string): string;
		GetGameObject(index: number): UnityEngine.GameObject;
		GetGameObject(name: string): UnityEngine.GameObject;
		GetVector2(index: number): UnityEngine.Vector2;
		GetVector2(name: string): UnityEngine.Vector2;
		GetVector3(index: number): UnityEngine.Vector3;
		GetVector3(name: string): UnityEngine.Vector3;
		GetQuaternion(index: number): UnityEngine.Quaternion;
		GetQuaternion(name: string): UnityEngine.Quaternion;
		GetRectOffset(index: number): UnityEngine.RectOffset;
		GetRectOffset(name: string): UnityEngine.RectOffset;
		static GetType() : UnityEngine.Type;
	}
	export class UIFixedList extends CustomBehaviour {
		constructor();
		static GetType() : UnityEngine.Type;
	}
	export class UIList extends CustomBehaviour {
		constructor();
		static GetType() : UnityEngine.Type;
	}
	export class UIListItem extends CustomBehaviour {
		constructor();
		static GetType() : UnityEngine.Type;
	}
	export class UIGroupList extends CustomBehaviour {
		constructor();
		static GetType() : UnityEngine.Type;
	}
	export class UIGroupListItem extends CustomBehaviour {
		constructor();
		static GetType() : UnityEngine.Type;
	}
	export class UIPolygon extends UnityEngine.UI.Graphic {
		constructor();
		GetPercent(index: number): number;
		SetPercent(index: number, value: number): void;
		static GetType() : UnityEngine.Type;
	}
	export class DynCaller  {
		constructor();
		static Invoke(objType: UnityEngine.Type, obj: Object, methodName: string, retGenericType: UnityEngine.Type, args: Object[]): Object;
		static JavaInvoke(objType: UnityEngine.Type, obj: Object, methodName: string, retGenericType: UnityEngine.Type, javaMethod: string, args: Object[]): Object;
		static GetType() : UnityEngine.Type;
	}
	export class MemValueRegister  {
		constructor();
		static GetString(key: string): string;
		static RegString(key: string, val: string): void;
		static GetInt(key: string): number;
		static RegInt(key: string, val: number): void;
		static GetBool(key: string): boolean;
		static RegBool(key: string, val: boolean): void;
		static GetType() : UnityEngine.Type;
	}
	export class PCStreamingSetting  {
		constructor();
		static readonly channelID: string;
		static GetType() : UnityEngine.Type;
	}
	export class EffectBinder extends UnityEngine.MonoBehaviour {
		constructor();
		effectT: UnityEngine.Transform[];
		effects: UnityEngine.GameObject[];
		static GetType() : UnityEngine.Type;
	}
	export class Barcode extends UnityEngine.MonoBehaviour {
		constructor();
		static W: number;
		static H: number;
		imageTransform: UnityEngine.Transform;
		onGetResult: (obj: string)=>void;
		readonly texture: UnityEngine.Texture;
		readonly isFlip: boolean;
		static EncodeString(text: string): UnityEngine.Texture2D;
		static GetType() : UnityEngine.Type;
	}
	export class ThreeDTools  {
		static rayDistance: number;
		static boxRayDistance: number;
		static sampleStep: number;
		static PutOnNavMesh(transform: UnityEngine.Transform, x: number, y: number, z: number): void;
		static PutOnNavMesh(transform: UnityEngine.Transform, v: UnityEngine.Vector3): void;
		static PutOnNavMesh(transform: UnityEngine.Transform): void;
		static GetNavYValue(x: number, z: number): UnityEngine.Vector3;
		static GetNavYValueBySample(source: UnityEngine.Vector3, size: number): UnityEngine.Vector3;
		static GetCacheNavYValueBySample(source: UnityEngine.Vector3, size: number, v3: Object): boolean;
		static GetType() : UnityEngine.Type;
	}
	export class SceneData extends UnityEngine.MonoBehaviour {
		constructor();
		static onAwake: ()=>void;
		static instance: SceneData;
		width: number;
		height: number;
		defaultPos: UnityEngine.Vector3;
		enableDepth: boolean;
		static GetType() : UnityEngine.Type;
	}
	export class FPS extends UnityEngine.MonoBehaviour {
		constructor();
		interval: number;
		guiRect: UnityEngine.Rect;
		fontSize: number;
		color: string;
		showGUI: boolean;
		readonly fps: number;
		static GetType() : UnityEngine.Type;
	}
	export class ModelMaterialPreset  {
		static NewPreset(name: string): void;
		static DeletePreset(name: string): void;
		static UpdateMaterialByPreset(name: string, material: UnityEngine.Material): void;
		static UpdateMaterialsByPreset(name: string, materials: UnityEngine.Material[]): void;
		static SetPresetFloat(name: string, key: string, value: number): void;
		static SetPresetColor(name: string, key: string, value: UnityEngine.Color): void;
		static SetPresetVector(name: string, key: string, value: UnityEngine.Vector4): void;
		static SetPresetTexture(name: string, key: string, value: UnityEngine.Texture): void;
		static GetType() : UnityEngine.Type;
	}
	export class AnimationCurveList extends UnityEngine.MonoBehaviour {
		constructor();
		readonly Names: string[];
		readonly Curves: UnityEngine.AnimationCurve[];
		Init(): void;
		static GetCurve(name: string): UnityEngine.AnimationCurve;
		static GetType() : UnityEngine.Type;
	}
	export class DoubleDefineList extends UnityEngine.MonoBehaviour {
		constructor();
		readonly Names: string[];
		readonly Values: number[];
		Init(): void;
		static GetValue(name: string): number;
		static GetType() : UnityEngine.Type;
	}
	export class ColorDefineList extends UnityEngine.MonoBehaviour {
		constructor();
		readonly Names: string[];
		readonly Values: UnityEngine.Color[];
		Init(): void;
		static GetValue(name: string): UnityEngine.Color;
		static GetType() : UnityEngine.Type;
	}
	export class RadialBlurRenderer extends UnityEngine.MonoBehaviour {
		constructor();
		blurFactor: number;
		ceilToInt: boolean;
		material: UnityEngine.Material;
		curve: UnityEngine.AnimationCurve;
		keyName: string;
		Tween(time: number, from: number, to: number): void;
		static GetType() : UnityEngine.Type;
	}
	export class CameraRec extends UnityEngine.MonoBehaviour {
		constructor();
		onClick: ()=>void;
		target: UnityEngine.Transform;
		cam: UnityEngine.Transform;
		offset: UnityEngine.Vector3;
		sensitivity: number;
		wsadsensitivity: number;
		lockWSAD: boolean;
		yDelta: number;
		hOffset: number;
		vOffset: number;
		LockTarget(target: UnityEngine.GameObject): void;
		static GetType() : UnityEngine.Type;
	}
	export class NiceInvoker extends UnityEngine.MonoBehaviour {
		constructor();
		static Get(go: UnityEngine.GameObject): NiceInvoker;
		SetCall(key: number, callback: ()=>void): void;
		Call(key: number, time: number): void;
		CancelCall(key: number): void;
		CancelAllCall(): void;
		Clear(): void;
		static GetType() : UnityEngine.Type;
	}
}
