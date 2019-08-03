namespace Builder
{
    class Platform
    {
        public static bool isWindows { get; private set; }
        public static bool isLinux { get; private set; }
        public static bool isAndroid { get; private set; }
        public static bool isOsx { get; private set; }
        public static bool isiOS { get; private set; }
        public static bool isEditorOsx { get; private set; }  
        public static bool isEditorWin { get; private set; }

        static Platform()
        {
#if UNITY_STANDALONE_WIN
            isWindows = true;
#endif
#if UNITY_STANDALONE_OSX
            isOsx = true;
#endif
#if UNITY_STANDALONE_LINUX
            isLinux = true;
#endif
#if UNITY_ANDROID
            isAndroid = true;
#endif
#if UNITY_IOS
            isiOS = true;
#endif
#if UNITY_EDITOR_OSX
            isEditorOsx = true;
#endif
#if UNITY_EDITOR_WIN
            isEditorWin = true;
#endif
        }
    }
}
