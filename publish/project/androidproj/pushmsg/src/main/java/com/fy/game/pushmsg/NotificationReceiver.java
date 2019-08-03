package com.fy.game.pushmsg;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

/**
 * Created by bill on 2017/7/10.
 */
public class NotificationReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        String packageName = intent.getStringExtra("packageName");
        Log.i("FyPush", "NotificationReceiver:packageName" + packageName);
        Intent launchIntent = context.getPackageManager().getLaunchIntentForPackage(packageName);
        context.startActivity(launchIntent);
    }
}