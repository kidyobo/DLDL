import { Global as G } from 'System/global'
import { Macros } from 'System/protocol/Macros'
import { KeyWord } from 'System/constants/KeyWord'
export class VideoPlayer {
    private gameObject: UnityEngine.GameObject;
    private mediaPlayer: AVProVideo.MediaPlayer;
    private jump: UnityEngine.GameObject;
    private onplayovercallback: () => void;
    initPlayer() {
        if (!Game.ResLoader.GetAssetLocalPath) {
            return;
        }
        let asset = Game.ResLoader.LoadAsset('ui/VideoPlayer.prefab');
        let playerObj = asset.Instantiate(null, true);
        Game.DonotDestroyManager.Add(playerObj);
        this.jump = Game.Tools.GetChild(playerObj, "jump");
        Game.UIClickListener.Get(this.jump).onClick = delegate(this, this.onPlayOver);
        this.gameObject = playerObj;
        this.mediaPlayer = Game.Tools.GetChildElement(playerObj, AVProVideo.MediaPlayer.GetType(), "MediaPlayer") as AVProVideo.MediaPlayer;
        AVProVideo.MediaPlayerHelper.BindEvent(this.mediaPlayer, delegate(this, this.onEvent));
        this.gameObject.SetActive(false);
    }
    play(path: string, onplayovercallback: () => void): boolean {
        if (!Game.ResLoader.GetAssetLocalPath) {
            onplayovercallback();
            return;
        }
        G.Uimgr.UICamera.enabled = false;
        this.jump.SetActive(false);
        this.gameObject.SetActive(true);
        this.onplayovercallback = onplayovercallback;
        this.mediaPlayer.m_VideoPath = Game.ResLoader.GetAssetLocalPath(path);
        this.mediaPlayer.OpenVideoFromFile(this.mediaPlayer.m_VideoLocation, this.mediaPlayer.m_VideoPath, true);
    }

    private onEvent(player: AVProVideo.MediaPlayer, eventType: AVProVideo.MediaPlayerEvent.EventType, errorCode: AVProVideo.ErrorCode) {
        if (errorCode == AVProVideo.ErrorCode.DecodeFailed) {
            uts.logErrorReport("DecodeFailed");
            this.onPlayOver();
            return;
        }
        if (errorCode == AVProVideo.ErrorCode.LoadFailed) {
            uts.logErrorReport("LoadFailed");
            this.onPlayOver();
            return;
        }
        switch (eventType) {
            case AVProVideo.MediaPlayerEvent.EventType.Started:
                this.jump.SetActive(true);
                break;
            case AVProVideo.MediaPlayerEvent.EventType.FinishedPlaying:
                this.onPlayOver();
                break;
            case AVProVideo.MediaPlayerEvent.EventType.Error:
                this.onPlayOver();
                break;
        }
    }
    private onPlayOver() {
        Game.Invoker.BeginInvoke(this.gameObject, "close", 0.01, delegate(this, this.lateClose));
    }
    private lateClose() {
        uts.log("play again2");
        this.mediaPlayer.CloseVideo();
        G.Uimgr.UICamera.enabled = true;
        this.gameObject.SetActive(false);
        if (this.onplayovercallback) {
            let c = this.onplayovercallback;
            this.onplayovercallback = null;
            c();
        }
    }
}