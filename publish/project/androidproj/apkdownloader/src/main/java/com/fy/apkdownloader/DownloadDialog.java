package com.fy.apkdownloader;

import android.app.AlertDialog;
import android.content.Context;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.widget.ProgressBar;
import android.widget.TextView;

public class DownloadDialog extends AlertDialog {
    private Context mContext;
    private TextView mTextView;
    private ProgressBar mProgressBar;
    private View view;

    protected DownloadDialog(Context context) {
        super(context);
        this.mContext = context;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setStyle();
        initView();
    }

    private void initView() {
        int dialogresid = getResourseIdByName(this.mContext.getPackageName(), "layout", "download_dialog");
        int textid = getResourseIdByName(this.mContext.getPackageName(), "id", "mTextView");
        int progressid = getResourseIdByName(this.mContext.getPackageName(), "id", "mProgressBar");
        view = View.inflate(mContext, dialogresid, null);
        mTextView = (TextView) view.findViewById(textid);
        mProgressBar = (ProgressBar) view.findViewById(progressid);
        setContentView(view);
    }

    private void setStyle() {
        //设置对话框不可取消
        this.setCancelable(false);
        //设置触摸对话框外面不可取消
        this.setCanceledOnTouchOutside(false);
        DisplayMetrics displaymetrics = new DisplayMetrics();
        getWindow().getWindowManager().getDefaultDisplay().getMetrics(displaymetrics);
        //获得应用窗口大小
        WindowManager.LayoutParams layoutParams = this.getWindow().getAttributes();
        //设置对话框居中显示
        layoutParams.gravity = Gravity.CENTER;
        //设置对话框宽度为屏幕的3/5
        layoutParams.width = (displaymetrics.widthPixels / 5) * 3;
    }

    //设置进度条
    public void setProgress(int progress) {
        mTextView.setText(progress + "%");
        mProgressBar.setProgress(progress);
    }

    private static int getResourseIdByName(String packageName, String className, String name) {
        Class r = null;
        int id = 0;
        try {
            r = Class.forName(packageName + ".R");
            Class[] classes = r.getClasses();
            Class desireClass = null;

            for (int i = 0; i < classes.length; i++) {
                if (classes[i].getName().split("\\$")[1].equals(className)) {
                    desireClass = classes[i];
                    break;
                }
            }

            if (desireClass != null) {
                id = desireClass.getField(name).getInt(desireClass);
            }
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
        } catch (SecurityException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (NoSuchFieldException e) {
            e.printStackTrace();
        }
        return id;
    }
}