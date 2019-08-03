import { Compatible } from '../Compatible';
import { StringUtil } from '../utils/StringUtil';
import { Global as G } from 'System/global'
import { PinstanceStatView } from 'System/pinstance/PinstanceStatView'
import { EnumMainViewChild } from 'System/main/view/MainView'
import { KeyWord } from 'System/constants/KeyWord'
import { IPool, ObjectPool } from "Common/pool/ObjectPool"
import { TypeCacher } from "System/TypeCacher"
export class AudioManager {
    public root: UnityEngine.GameObject;
    private _source: UnityEngine.AudioSource = null;

    private _enableBgm = true;
    private _enableSound = true;
    private _bgmVolume = 50;
    private _soundVolume = 100;
    private _playingBgmName = null;
    //声音加载后内存故意不释放
    private allClips: { [path: string]: UnityEngine.AudioClip } = {};
    /// <summary>
    /// 是否开启背景音乐
    /// </summary>
    set enableBgm(value: boolean) {
        this._enableBgm = value;
        if (this._source != null) {
            if (value) {
                this._source.Play();
            }
            else {
                this._source.Stop();
            }
        }
    }
    get enableBgm() {
        return this._enableBgm;
    }

    /// <summary>
    /// 当前播放的背景音乐名称
    /// </summary>
    public get playingBgmName() {
        return this._playingBgmName;
    }

    /// <summary>
    /// 游戏背景音乐的声音大小
    /// </summary>
    set bgmVolume(value: number) {
        this._bgmVolume = value;
        if (this._source != null) {
            this._source.volume = this._bgmVolume / 100;
        }
    }
    get bgmVolume() {
        return this._bgmVolume;
    }

    /// <summary>
    /// 是否开启声音(音效)
    /// </summary>
    set enableSound(value: boolean) {
        this._enableSound = value;
    }
    get enableSound() {
        return this._enableSound;
    }

    /// <summary>
    /// 游戏音效声音大小
    /// </summary>
    set soundVolume(value: number) {
        this._soundVolume = value;
    }
    get soundVolume() {
        return this._soundVolume;
    }
    public initialize() {
        this.root = new UnityEngine.GameObject("AudioManager");
        Game.DonotDestroyManager.Add(this.root);
        let source = this.root.AddComponent(TypeCacher.AudioSource) as UnityEngine.AudioSource;
        source.playOnAwake = false;
        source.loop = true;
        this._source = source;
    }

    /// <summary>
    /// 播放背景音乐
    /// </summary>
    /// <param name="name">背景音乐名称</param>
    public playBgm(name: string): void {
        this._playingBgmName = name;
        let clip = this.allClips[name];
        if (clip) {
            this._playBGM(clip);
        }
        else {
            let request = Game.ResLoader.CreateAssetRequest(Game.AssetPriority.Low1, name);
            Game.ResLoader.BeginAssetRequest(request, delegate(this, this.onLoadBGM, name));
        }
    }
    private onLoadBGM(assetRequest: Game.AssetRequest, name: string, loop: boolean) {
        if (assetRequest.error != null) {
            uts.logWarning("背景音乐加载失败:" + "  error:" + assetRequest.error);
            return;
        }
        let asset = assetRequest.mainAsset;
        asset.autoCollect = false;
        let clip = asset.audioClip;
        this.allClips[name] = clip;
        if (this._playingBgmName == name) {
            this._playBGM(clip);
        }
    }
    private _playBGM(clip: UnityEngine.AudioClip) {
        this._source.clip = clip;
        this._source.volume = this._bgmVolume / 100;
        if (this._enableBgm) {
            this._source.Play();
        }
    }

    /// <summary>
    /// 停止播放背景音乐
    /// </summary>
    public stopBgm(): void {
        if (this._playingBgmName != null) {
            this._playingBgmName = null;
            this._source.Stop();
        }
    }

    /// <summary>
    /// 播放游戏声音（音效）
    /// </summary>
    /// <param name="name">声音名称</param>
    public playSound(name: string): void {
        if (G.ModuleMgr.loadingModule.active) {
            return;
        }
        if (this._enableSound == true) {
            let clip = this.allClips[name];
            if (clip) {
                this._playSound(clip);
            }
            else {
                let request = Game.ResLoader.CreateAssetRequest(Game.AssetPriority.Low2, name);
                Game.ResLoader.BeginAssetRequest(request, delegate(this, this.onLoadSound, name));
            }
        }
    }
    private onLoadSound(assetRequest: Game.AssetRequest, name: string) {
        if (assetRequest.error != null) {
            uts.logWarning("音效加载失败:" + "  error:" + assetRequest.error);
            return;
        }
        let asset = assetRequest.mainAsset;
        asset.autoCollect = false;
        let clip = asset.audioClip;
        this.allClips[name] = clip;
        this._playSound(clip);
    }
    private _playSound(clip: UnityEngine.AudioClip) {
        this._source.PlayOneShot(clip);
    }

    /**播放按钮音效*/
    playBtnClickSound() {
        this.playSound('sound/ui/uisound_btClick.mp3');
    }
    /**播放进阶成功音效*/
    playJinJieSucessSound() {
        this.playSound('sound/ui/uisound_jinjieSucess.mp3');
    }
    /**播放星星爆炸音效*/
    playStarBombSucessSound() {
        this.playSound('sound/ui/uisound_starBombSucess.mp3');
    }
    /**播放进阶失败音效*/
    playJinJieFailSound() {
        this.playSound('sound/ui/uisound_jinjieFail.mp3');
    }
    /**播放消息提醒音效*/
    playGetMessageSound() {
        this.playSound('sound/ui/uisound_getMessage.mp3');
    }
}
export default AudioManager;