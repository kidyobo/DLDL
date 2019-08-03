export enum Events {
    none = 0,

    /**转场成功*/
    ChangeScene,
    /**主角各种数据改变*/
    HeroDataChange,

    HeroAliveDeadChange,
    QuestChange,

    /**服务器过天*/
    ServerOverDay,

    /**时装数据发生变化*/
    DressChange,

    /** 更新神力信息 */
    updateJuYanInfo,

    /** 背包数据变化 */
    roleBagChange,
}