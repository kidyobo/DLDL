import { Global as G } from "System/global"
import { Macros } from 'System/protocol/Macros'
import { EnumChoice } from 'System/constants/GameEnum'
import { WeatherSystem } from "System/WeatherSystem"
export enum SettingKey {
    isBgmOn = 100,
    isSndOn,
    highFrame,
    hideMonsters,
    hideFollowers,
    hidePlayerEffect,
    hideSelfSkillEffect,
    hideSkillEffects,
    playerCount,

    autoAcceptTeamInvitation,
    isAcceptAnomous,
    hidePlayerModel,
    hideSkillShake,
}

export class SettingData {
    public hideMonstersForce: boolean = false;
    public hideNPCsForce: boolean = false;
    public hidePlayerEffectForce: boolean = false;
    public hideFollowsForce: boolean = false;
    public sceneHideFlag: number = 0;
    private isBgmOn = true;
    get IsBgmOn(): boolean {
        return this.isBgmOn;
    }

    set IsBgmOn(value: boolean) {
        if (this.isBgmOn == value) {
            return;
        }
        this.isBgmOn = value;

        G.AudioMgr.enableBgm = value;
    }

    private isSndOn = true;
    get IsSndOn(): boolean {
        return this.isSndOn;
    }

    set IsSndOn(value: boolean) {
        if (this.isSndOn == value) {
            return;
        }
        this.isSndOn = value;
        G.AudioMgr.enableSound = value;
    }

    private bgmVolume = -1;
    get BgmVolume(): number {
        return this.bgmVolume;
    }

    set BgmVolume(value: number) {
        if (this.bgmVolume == value) {
            return;
        }
        this.bgmVolume = value;
        G.AudioMgr.bgmVolume = value;
    }

    private sndVolume = -1;
    get SndVolume(): number {
        return this.sndVolume;
    }

    set SndVolume(value: number) {
        if (this.sndVolume == value) {
            return;
        }
        this.sndVolume = value;
        G.AudioMgr.soundVolume = value;
    }

    private hidePlayerModel = false;
    get HidePlayerModel(): boolean {
        return this.hidePlayerModel;
    }

    set HidePlayerModel(value: boolean) {
        if (this.hidePlayerModel == value) {
            return;
        }
        this.hidePlayerModel = value;
        G.UnitMgr.processHideRole();
    }

    private hideSkillShake = true;
    get HideSkillShake(): boolean {
        return this.hideSkillShake;
    }

    set HideSkillShake(value: boolean) {
        if (this.hideSkillShake == value) {
            return;
        }
        this.hideSkillShake = value;
    }

    private frameLevel = 1;
    get FrameLevel(): number {
        return this.frameLevel;
    }

    set FrameLevel(value: number) {
        if (Game.ResLoader.isPublish) {
            if (G.IsWindowsPlatForm) {
                if (value == 0) {
                    UnityEngine.Application.targetFrameRate = 45;
                }
                else if (value == 1) {
                    UnityEngine.Application.targetFrameRate = 60;
                }
                else {
                    UnityEngine.Application.targetFrameRate = 0;
                }
            }
            else {
                if (value == 0) {
                    UnityEngine.Application.targetFrameRate = 30;
                }
                else if (value == 1) {
                    UnityEngine.Application.targetFrameRate = 35;
                }
                else {
                    UnityEngine.Application.targetFrameRate = 50;
                }
            }
        }
        else {
            UnityEngine.Application.targetFrameRate = 0;
        }
        this.frameLevel = value;
    }

    private autoAcceptTeamInvitation: boolean = true;
    get AutoOtherTeamInvitation(): boolean {
        return this.autoAcceptTeamInvitation;
    }

    set AutoOtherTeamInvitation(value: boolean) {
        if (this.autoAcceptTeamInvitation == value) {
            return;
        }
        this.autoAcceptTeamInvitation = value;
        G.DataMgr.systemData.systemSettingList[Macros.SYSTEM_SETTING_TEAM_INVITE] = value ? 0 : 1;
    }

    private hideMonsters: EnumChoice = EnumChoice.undefined;
    get HideMonsters(): boolean {
        return EnumChoice.yes == this.hideMonsters;
    }

    set HideMonsters(value: boolean) {
        let c = value ? EnumChoice.yes : EnumChoice.no;
        if (this.hideMonsters == c) {
            return;
        }
        this.hideMonsters = c;
        G.UnitMgr.processHideMonster();
    }

    private hideSelfSkillEffect = false;
    get HideSelfSkillEffect(): boolean {
        return this.hideSelfSkillEffect;
    }

    set HideSelfSkillEffect(value: boolean) {
        if (this.hideSelfSkillEffect == value) {
            return;
        }
        this.hideSelfSkillEffect = value;
    }

    private hideSkillEffects = false;
    get HideSkillEffects(): boolean {
        return this.hideSkillEffects;
    }

    set HideSkillEffects(value: boolean) {
        if (this.hideSkillEffects == value) {
            return;
        }
        this.hideSkillEffects = value;
    }

    private hideFollowers: EnumChoice = EnumChoice.undefined;
    get HideFollowers(): boolean {
        return EnumChoice.yes == this.hideFollowers;
    }

    set HideFollowers(value: boolean) {
        let c = value ? EnumChoice.yes : EnumChoice.no;
        if (this.hideFollowers == c) {
            return;
        }
        this.hideFollowers = c;
        G.UnitMgr.processHideRole();
    }

    private hidePlayerEffect: EnumChoice = EnumChoice.undefined;
    get HidePlayerEffect(): boolean {
        return EnumChoice.yes == this.hidePlayerEffect;
    }

    set HidePlayerEffect(value: boolean) {
        let c = value ? EnumChoice.yes : EnumChoice.no;
        if (this.hidePlayerEffect == c) {
            return;
        }
        this.hidePlayerEffect = c;
        G.UnitMgr.processHideRole();
    }

    private maxPlayerCount: number = 5;
    get MaxPlayerCount(): number {
        return this.maxPlayerCount;
    }

    set MaxPlayerCount(value: number) {
        if (this.maxPlayerCount == value) {
            return;
        }
        this.maxPlayerCount = value;
        G.UnitMgr.processHideRole();
    }


    private isAcceptAnomous = true;
    /**是否接收陌生人消息*/
    get IsAcceptAnomous(): boolean {
        return this.isAcceptAnomous;
    }
    set IsAcceptAnomous(value: boolean) {
        if (this.isAcceptAnomous == value) {
            return;
        }
        this.isAcceptAnomous = value;
    }
    private channelFlag: number;
    private channelPassData: { [id: number]: number } = {};
    public allChannels = [Macros.CHANNEL_WORLD, Macros.CHANNEL_NEARBY, Macros.CHANNEL_TEAM_NOTIFY, Macros.CHANNEL_GUILD, Macros.CHANNEL_SYSTEM, Macros.CHANNEL_TEAM];

    private isEnableSaoma = false;
    /**是否开启扫码*/
    get IsEnableSaoma(): boolean {
        return this.isEnableSaoma;
    }
    set IsEnableSaoma(value: boolean) {
        if (this.isEnableSaoma == value) {
            return;
        }
        this.isEnableSaoma = value;
    }
    constructor() {
        this.IsEnableSaoma = 0 != UnityEngine.PlayerPrefs.GetInt("SaoMa", 0);
    }

    readSetting() {
        this.IsBgmOn = 0 != UnityEngine.PlayerPrefs.GetInt(this.makeKey(SettingKey.isBgmOn), 1);
        this.IsSndOn = 0 != UnityEngine.PlayerPrefs.GetInt(this.makeKey(SettingKey.isSndOn), 1);
        this.FrameLevel = UnityEngine.PlayerPrefs.GetInt("FrameLevel", 1);
        this.HideMonsters = EnumChoice.yes == UnityEngine.PlayerPrefs.GetInt(this.makeKey(SettingKey.hideMonsters), EnumChoice.no);
        this.HideFollowers = EnumChoice.yes == UnityEngine.PlayerPrefs.GetInt(this.makeKey(SettingKey.hideFollowers), EnumChoice.no);
        this.HidePlayerEffect = EnumChoice.yes == UnityEngine.PlayerPrefs.GetInt(this.makeKey(SettingKey.hidePlayerEffect), EnumChoice.no);
        this.HideSelfSkillEffect = 0 != UnityEngine.PlayerPrefs.GetInt(this.makeKey(SettingKey.hideSelfSkillEffect), 0);
        this.HideSkillEffects = 0 != UnityEngine.PlayerPrefs.GetInt(this.makeKey(SettingKey.hideSkillEffects), 1);
        this.HidePlayerModel = 0 != UnityEngine.PlayerPrefs.GetInt(this.makeKey(SettingKey.hidePlayerModel), 0);
        this.HideSkillShake = 0 != UnityEngine.PlayerPrefs.GetInt(this.makeKey(SettingKey.hideSkillShake), 1);

        this.AutoOtherTeamInvitation = UnityEngine.PlayerPrefs.GetInt(this.makeKey(SettingKey.autoAcceptTeamInvitation), 0) == 0;
        //好友拒绝接受消息，不显示离线
        this.IsAcceptAnomous = 0 != UnityEngine.PlayerPrefs.GetInt(this.makeKey(SettingKey.isAcceptAnomous), 1);
        this.MaxPlayerCount = UnityEngine.PlayerPrefs.GetInt(this.makeKey(SettingKey.playerCount), 10);

        //加一个热更的标记 重新设置一下聊天初始数据
        this.channelFlag = UnityEngine.PlayerPrefs.GetInt("channelFlag", 0);
        if (this.channelFlag == 0) {
            //热更之后第一次登陆
            this.channelFlag++;
            for (let i = 0, len = this.allChannels.length; i < len; i++) {
                let id = this.allChannels[i];
                this.channelPassData[id] = UnityEngine.PlayerPrefs.GetInt("channel" + id, 1);
                this.channelPassData[id] = id == Macros.CHANNEL_SYSTEM ? 2 : 1;
            }
        }
        else {
            for (let i = 0, len = this.allChannels.length; i < len; i++) {
                let id = this.allChannels[i];
                this.channelPassData[id] = UnityEngine.PlayerPrefs.GetInt("channel" + id, 1);
            }
        }
    }

    writeSetting() {
        UnityEngine.PlayerPrefs.SetInt(this.makeKey(SettingKey.isBgmOn), this.isBgmOn ? 1 : 0);
        UnityEngine.PlayerPrefs.SetInt(this.makeKey(SettingKey.isSndOn), this.isSndOn ? 1 : 0);
        UnityEngine.PlayerPrefs.SetInt("FrameLevel", this.frameLevel);
        UnityEngine.PlayerPrefs.SetInt(this.makeKey(SettingKey.hideMonsters), this.hideMonsters);
        UnityEngine.PlayerPrefs.SetInt(this.makeKey(SettingKey.hideFollowers), this.hideFollowers);
        UnityEngine.PlayerPrefs.SetInt(this.makeKey(SettingKey.hidePlayerEffect), this.hidePlayerEffect);
        UnityEngine.PlayerPrefs.SetInt(this.makeKey(SettingKey.hideSelfSkillEffect), this.hideSelfSkillEffect ? 1 : 0);
        UnityEngine.PlayerPrefs.SetInt(this.makeKey(SettingKey.hideSkillEffects), this.hideSkillEffects ? 1 : 0);
        UnityEngine.PlayerPrefs.SetInt(this.makeKey(SettingKey.hidePlayerModel), this.hidePlayerModel ? 1 : 0);
        UnityEngine.PlayerPrefs.SetInt(this.makeKey(SettingKey.hideSkillShake), this.hideSkillShake ? 1 : 0);

        UnityEngine.PlayerPrefs.SetInt(this.makeKey(SettingKey.autoAcceptTeamInvitation), this.autoAcceptTeamInvitation ? 0 : 1);

        UnityEngine.PlayerPrefs.SetInt(this.makeKey(SettingKey.isAcceptAnomous), this.isAcceptAnomous ? 1 : 0);
        UnityEngine.PlayerPrefs.SetInt(this.makeKey(SettingKey.playerCount), this.maxPlayerCount);
        UnityEngine.PlayerPrefs.SetInt("SaoMa", this.isEnableSaoma ? 1 : 0);
        for (let i = 0, len = this.allChannels.length; i < len; i++) {
            let id = this.allChannels[i];
            UnityEngine.PlayerPrefs.SetInt("channel" + id, this.channelPassData[id]);
        }
        UnityEngine.PlayerPrefs.SetInt("channelFlag", this.channelFlag);
    }

    private makeKey(keyEnum: SettingKey): string {
        return uts.format('Setting_{0}_{1}', G.DataMgr.gameParas.uin, keyEnum);
    }

    public isChannelPass(id: number) {
        let data = this.channelPassData[id];
        if (data) {
            return data == 1;
        }
        return false;
    }
    public setChannelPass(id: number, value: boolean) {
        this.channelPassData[id] = value ? 1 : 2;
    }
}