// 构建时传入的宏
let buildds = Game.BuildDefines.defines.split('.');
for (let d of buildds) {
    defines.add(d);
}

// ts中自定义宏
if (UnityEngine.Application.platform == UnityEngine.RuntimePlatform.WindowsEditor) {
    defines.add('DEVELOP');
    defines.add('TESTUIN');
    defines.add('TEST_APK');
}

// 外网将log日志屏蔽
if (!defines.has('OPEN_OUTPUTPANEL') && defines.has('PUBLISH')) {
    //defines.add('NOLOG');
}