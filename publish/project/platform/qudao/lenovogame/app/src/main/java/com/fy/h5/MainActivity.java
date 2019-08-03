package com.fy.h5;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class MainActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = (WebView) findViewById(R.id.webview);
        webView.setVerticalScrollBarEnabled(false);
        WebSettings webSettings=webView.getSettings();
        webSettings.setJavaScriptEnabled(true);

        webView.loadUrl("http://luckydraw.lenovogame.com/luckydraw/reserve/detail.xhtml?id=2c9a41935dc1ca73015f0e9bc7c537a0&status=1");
    }
}
