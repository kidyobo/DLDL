package com.fy.game.pushmsg;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Created by bill on 2017/7/12.
 */
class MsgNode {
    public int weekDay;
    public long daysec;
    public String msg;
    public boolean sended;

    public MsgNode(int weekDay, long daysec, String msg) {
        this.weekDay = weekDay;
        this.daysec = daysec;
        this.msg = msg;
        this.sended = false;
    }
}

public class NotificaionInfo {
    static private NotificaionInfo _instance = null;

    static public NotificaionInfo getInstance() {
        if (_instance == null) _instance = new NotificaionInfo();
        return _instance;
    }

    private static final String TAG = "FyPush";
    private static final String url = "http://jd.res.fygame.com/zszl/pushmsg/";
    private static final int effectiveSec = 30 * 60;

    private int _iconid = 0;
    private String _packageName = "";
    private String _productName = "";

    private IntervalChecker verUpdChecker = new IntervalChecker(3600);
    private int lastver = 0;
    private final Lock msgLock = new ReentrantLock();
    private List<MsgNode> msgs = new ArrayList<MsgNode>();

    private NotificaionInfo() {
    }

    public void update(Context context, Intent intent) {
        if (context == null || intent == null)
            return;
        _iconid = intent.getIntExtra("iconId", 0);
        _packageName = intent.getStringExtra("packageName");
        _productName = intent.getStringExtra("productName");
        this.checkVersionUpdate();
        this.checkSendNotify(context);
    }

    private void checkVersionUpdate() {
        if (!verUpdChecker.isComing())
            return;
        Log.i(TAG, "checkVersionUpdate");
        new Thread(new Runnable() {
            @Override
            public void run() {
                String sver = requestGet(url + "ver.txt?v=" + System.currentTimeMillis());
                if (sver == null)
                    return;

                sver = sver.trim();
                boolean ischange = false;
                Log.i(TAG, "cur ver:" + sver + ", last ver:" + lastver);
                try {
                    int ver = Integer.parseInt(sver);
                    if (lastver < ver) {
                        lastver = ver;
                        ischange = true;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    return;
                }

                if (ischange) {
                    Log.i(TAG, "version change to:" + lastver);
                    String pushmsg = requestGet(url + "tuisong.txt?v=" + System.currentTimeMillis());
                    if (pushmsg == null)
                        return;
                    msgLock.lock();
                    try {
                        msgs.clear();
                        String[] lines = pushmsg.split("\n");
                        for (String line : lines) {
                            String[] segments = line.split(" ");
                            int weekDay = Integer.parseInt(segments[0].trim());
                            long daysec = convertToDaySec(segments[1].trim());
                            String msg = segments[2].trim();
                            msgs.add(new MsgNode(weekDay, daysec, msg));
                            Log.i(TAG, "parse msg: weekDay:" + weekDay + ",daysec:" + daysec + ",msg:" + msg);
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    } finally {
                        msgLock.unlock();
                    }
                }
            }
        }).start();
    }

    private long convertToDaySec(String time) {
        String[] daysegs = time.split(":");
        long daysec = 0;
        int fact = 3600;
        for (String seg : daysegs) {
            daysec = daysec + Integer.parseInt(seg.trim()) * fact;
            fact = fact / 60;
        }
        return daysec;
    }

    private String requestGet(String fromurl) {
        String result = null;
        try {
            URL url = new URL(fromurl);
            HttpURLConnection urlConn = (HttpURLConnection) url.openConnection();
            urlConn.setConnectTimeout(5 * 1000);
            urlConn.setReadTimeout(5 * 1000);
            urlConn.setUseCaches(false);
            urlConn.setRequestMethod("GET");
            urlConn.setRequestProperty("Content-Type", "text/plain");
            urlConn.addRequestProperty("Connection", "Keep-Alive");
            urlConn.connect();
            if (urlConn.getResponseCode() == 200) {
                result = streamToString(urlConn.getInputStream());
            } else {
                Log.e(TAG, "Get方式请求失败");
            }
            urlConn.disconnect();
        } catch (Exception e) {
            Log.e(TAG, e.toString());
        }
        return result;
    }

    private String streamToString(InputStream is) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            byte[] buffer = new byte[1024];
            int len = 0;
            while ((len = is.read(buffer)) != -1) {
                baos.write(buffer, 0, len);
            }
            baos.close();
            is.close();
            byte[] byteArray = baos.toByteArray();
            return new String(byteArray, "utf-8");
        } catch (Exception e) {
            Log.e(TAG, e.toString());
            return null;
        }
    }

    private void checkSendNotify(Context context) {
        Log.i(TAG, "checkSendNotify");
        Calendar c = Calendar.getInstance();
        int hour = c.get(Calendar.HOUR);
        int minute = c.get(Calendar.MINUTE);
        int second = c.get(Calendar.SECOND);
        int weekDay = c.get(Calendar.DAY_OF_WEEK);
        int daysec = hour * 3600 + minute * 60 + second;
        Log.i(TAG, "checkSendNotify current: weekDay:" + weekDay + ",hour:" + hour + ",minute:" + minute + ",second:" + second + ",daysec:" + daysec);
        msgLock.lock();
        try {
            for (MsgNode node : msgs) {
                boolean inTimeRange = (node.weekDay == weekDay) && (daysec >= node.daysec && daysec < (node.daysec + effectiveSec));
                Log.i(TAG, "checkSendNotify node: node.weekDay:" + node.weekDay + ",node.daysec:" + node.daysec);
                if (!node.sended && inTimeRange) {
                    sendNotify(context, node.msg);
                    node.sended = true;
                } else if (node.weekDay != weekDay) {
                    node.sended = false;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            msgLock.unlock();
        }
    }

    private void sendNotify(Context context, String msg) {
        Intent broadcastIntent = new Intent(context, NotificationReceiver.class);
        broadcastIntent.putExtra("packageName", _packageName);
        PendingIntent pendingIntent = PendingIntent.
                getBroadcast(context, 0, broadcastIntent, PendingIntent.FLAG_UPDATE_CURRENT);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context);
        builder.setContentTitle(_productName)
                .setTicker(_productName)
                .setContentText(msg)
                .setAutoCancel(true)
                .setPriority(Notification.PRIORITY_HIGH)
                .setWhen(System.currentTimeMillis())
                .setDefaults(Notification.DEFAULT_VIBRATE)
                .setContentIntent(pendingIntent)
                .setSmallIcon(_iconid);

        Log.i(TAG, "sendNotify:icon:" + _iconid);
        Log.i(TAG, "sendNotify:productname:" + _productName);
        Log.i(TAG, "sendNotify:packageName:" + _packageName);
        Log.i(TAG, "sendNotify:msg:" + msg);
        NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        manager.notify(2, builder.build());
    }
}
