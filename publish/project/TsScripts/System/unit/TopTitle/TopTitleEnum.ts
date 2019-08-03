//排序从小到大
export enum TopTitleEnum {
    Blood,
    Name,
    FollowedName,
    Partner,
    GuildTitle,
    /**npc头顶的任务标记*/
    QuestState,
    BossOwner, 
    JuYuan,
    NEW_ROLE_TITLE,
    TitleID,
    JisutiaozhanTitle,
    UniqueTitleBase = 1000,//这种称号特殊，同时存在多个，使用偏移量来设计
}
export default TopTitleEnum;