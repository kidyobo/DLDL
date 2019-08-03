package com.fy.game.pushmsg;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.SystemClock;
import android.util.Log;

/**
 * Created by bill on 2017/7/10.
 */

public class ShowNotificationReceiver extends BroadcastReceiver {
    private static final String TAG = "FyPush";

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.i(TAG, "onReceive");
        if (intent.getBooleanExtra("startrepeat", false)) {
            NotificaionInfo.getInstance().update(context, intent);
            repeatAlarm(context, intent, AlarmManager.ELAPSED_REALTIME_WAKEUP, SystemClock.elapsedRealtime() + 60 * 1000);
        } else {
            intent.putExtra("startrepeat", true);
            repeatAlarm(context, intent, AlarmManager.ELAPSED_REALTIME_WAKEUP, SystemClock.elapsedRealtime());
        }
    }

    private void repeatAlarm(Context context, Intent intent, int alarmType, long triggerAtTime) {
        PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            am.setExactAndAllowWhileIdle(alarmType, triggerAtTime, pendingIntent);
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            am.setExact(alarmType, triggerAtTime, pendingIntent);
        } else {
            am.set(alarmType, triggerAtTime, pendingIntent);
        }
    }
}
