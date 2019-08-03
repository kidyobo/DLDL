package com.fy.utils;

import android.app.Activity;
import android.content.ClipData;
import android.content.ClipboardManager;

public class Clipboard {
    static private Clipboard instance = null;
    static public Clipboard getInstance() {
        if (instance == null) instance = new Clipboard();
        return instance;
    }

    private Activity activity = null;
    private Clipboard() {
    }

    public int setActivity(Activity activity) {
        this.activity = activity;
        return 0;
    }

    public int copyText(String str) {
        if (this.activity == null) return -1;
        ClipboardManager clipboard = (ClipboardManager) activity.getSystemService(Activity.CLIPBOARD_SERVICE);
        ClipData textCd = ClipData.newPlainText("data", str);
        clipboard.setPrimaryClip(textCd);
        return 0;
    }
}
