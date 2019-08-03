package com.fy.game.pushmsg;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import android.os.SystemClock;
import android.support.annotation.Nullable;
import android.util.Log;

/**
 * Created by bill on 2017/7/10.
 */
public class PushService extends Service {
    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    public int onStartCommand(Intent pintent, int flags, int startId) {
        if (pintent == null) {
            return super.onStartCommand(pintent, flags, startId);
        }

        int iconId = pintent.getIntExtra("iconId", 0);
        String packageName = pintent.getStringExtra("packageName");
        String productName = pintent.getStringExtra("productName");
        Log.i("FyPush", "PushService:onStartCommand1, iconid:" + iconId + ", packageName:" + packageName + " ,productName:" + productName);

        Intent intent = new Intent(this, ShowNotificationReceiver.class);
        intent.putExtra("iconId", iconId);
        intent.putExtra("packageName", packageName);
        intent.putExtra("productName", productName);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(this, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        startAlarm(pendingIntent);
        return super.onStartCommand(pintent, flags, startId);
    }

    private void startAlarm(PendingIntent pendingIntent) {
        long triggerAtTime = SystemClock.elapsedRealtime();
        AlarmManager am = (AlarmManager) getSystemService(Context.ALARM_SERVICE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            am.setExactAndAllowWhileIdle(AlarmManager.ELAPSED_REALTIME_WAKEUP, triggerAtTime, pendingIntent);
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            am.setExact(AlarmManager.ELAPSED_REALTIME_WAKEUP, triggerAtTime, pendingIntent);
        } else {
            am.set(AlarmManager.ELAPSED_REALTIME_WAKEUP, triggerAtTime, pendingIntent);
        }
    }
}