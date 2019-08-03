package com.fy.apkdownloader;

import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Environment;
import android.util.Log;

import java.io.File;

/**
 * Created by bill on 2017/9/29.
 */
public class InstallApkBroadcast extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        install(context, intent);
    }

    private void install(Context context, Intent intent) {
        DownloadManager manager = (DownloadManager) context.getSystemService(Context.DOWNLOAD_SERVICE);
        long id = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, 0);
        DownloadManager.Query query = new DownloadManager.Query();
        query.setFilterById(id);
        Cursor c = manager.query(query);
        if (c.moveToFirst()) {
            String filename = c.getString(c.getColumnIndex(DownloadManager.COLUMN_LOCAL_FILENAME));
            if (filename == null) {
                return;
            }

            Log.i("ADL", "apk: " + filename);
            Intent installintent = new Intent();
            installintent.setAction(Intent.ACTION_VIEW);
            installintent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            installintent.setDataAndType(Uri.parse("file://" + filename), "application/vnd.android.package-archive");
            context.startActivity(installintent);
        }
    }
}