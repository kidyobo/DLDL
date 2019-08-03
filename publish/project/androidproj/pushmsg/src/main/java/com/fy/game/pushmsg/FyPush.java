package com.fy.game.pushmsg;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.util.Log;

/**
 * Created by bill on 2017/7/10.
 */
public class FyPush {
    static private FyPush _instance = null;

    static public FyPush getInstance() {
        if (_instance == null) _instance = new FyPush();
        return _instance;
    }

    private Activity _activity = null;
    private FyPush() {
    }

    public void init(Activity activity) {
        _activity = activity;
        String packageName = _activity.getPackageName();
        String productName = getApplicationName(packageName);
        int iconId = _activity.getResources().getIdentifier("game_icon", "drawable", packageName);
        Log.i("FyPush", "packageName:" + packageName + ", productName:" + productName + ", iconId:" + iconId);

        Intent intent = new Intent(_activity, PushService.class);
        intent.putExtra("iconId", iconId);
        intent.putExtra("packageName", packageName);
        intent.putExtra("productName", productName);
        _activity.startService(intent);
    }

    private String getApplicationName(String packageName) {
        try {
            PackageManager packageManager = _activity.getApplicationContext().getPackageManager();
            ApplicationInfo applicationInfo = packageManager.getApplicationInfo(packageName, 0);
            return (String) packageManager.getApplicationLabel(applicationInfo);
        } catch (PackageManager.NameNotFoundException e) {
            return "";
        }
    }
}
