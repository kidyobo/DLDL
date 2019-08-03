import { EnumKfhdBossStatus } from 'System/constants/GameEnum'

export class KfhdBossVo {
    cfg: GameConfig.ChallengeBossCfgM;
    status: EnumKfhdBossStatus = 0;
    minLv = 0;
}