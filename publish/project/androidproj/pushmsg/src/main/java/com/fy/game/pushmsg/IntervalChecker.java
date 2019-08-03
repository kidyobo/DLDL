package com.fy.game.pushmsg;

/**
 * Created by bill on 2017/7/11.
 */

public class IntervalChecker {
    private long lastTime = -0x7fffffff;
    private long interval = 0;

    public IntervalChecker(long intervalSecond) {
        interval = intervalSecond * 1000;
    }

    public boolean isComing() {
        if (System.currentTimeMillis() - lastTime < interval) {
            return false;
        } else {
            lastTime = System.currentTimeMillis();
            return true;
        }
    }
}
