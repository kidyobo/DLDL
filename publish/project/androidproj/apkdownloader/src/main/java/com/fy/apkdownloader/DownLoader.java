package com.fy.apkdownloader;

import android.app.Activity;
import android.app.DownloadManager;
import android.os.Handler;
import android.os.Message;
import android.widget.Toast;

/**
 * Created by bill on 2017/9/27.
 */

public class DownLoader {
    static private DownLoader instance = null;
    static public DownLoader getInstance() {
        if (instance == null) instance = new DownLoader();
        return instance;
    }

    private Activity activity = null;
    private DownloadDialog downloadDialog = null;
    private DownloadManager mDownloadManager = null;
    private Handler handler = null;

    private DownLoader() {
    }

    public void init(final Activity activity) {
        this.activity = activity;
        handler = new Handler() {
            @Override
            public void handleMessage(Message msg) {
                switch (msg.what) {
                    case DownloadManager.STATUS_SUCCESSFUL:
                        downloadDialog.setProgress(100);
                        canceledDialog();
                        break;

                    case DownloadManager.STATUS_RUNNING:
                        downloadDialog.setProgress((int) msg.obj);
                        break;

                    case DownloadManager.STATUS_FAILED:
                        canceledDialog();
                        break;

                    case DownloadManager.STATUS_PENDING:
                        showDialog();
                        break;
                }
            }
        };
    }

    public boolean download(String url, String defaultTotalSize) {
        //最好是用单线程池，或者intentService取代
        new Thread(new DownLoadRunnable(activity, url, handler, Integer.parseInt(defaultTotalSize))).start();
        return true;
    }

    private void showDialog() {
        if (downloadDialog == null) {
            downloadDialog = new DownloadDialog(activity);
        }

        if (!downloadDialog.isShowing()) {
            downloadDialog.show();
        }
    }

    private void canceledDialog() {
        if (downloadDialog != null && downloadDialog.isShowing()) {
            downloadDialog.dismiss();
        }
    }
}
