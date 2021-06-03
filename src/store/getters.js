const getters = {
    sidebar: state => state.app.sidebar,
    size: state => state.app.size,
    device: state => state.app.device,
    visitedViews: state => state.tagsView.visitedViews,
    cachedViews: state => state.tagsView.cachedViews,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    introduction: state => state.user.introduction,
    roles: state => state.user.roles,
    content: state => state.user.content,
    id:    state => state.user.id,
    is_server:    state => state.user.is_server,
    permission_routes: state => state.permission.routes,
    errorLogs: state => state.errorLog.logs,
    client_id:state=>state.websock.client_id,
    menus: state => state.user.menus,
    routenumber: state => state.user.routenumber,
    jumplink: state => state.user.jumplink,
    title: state => state.user.title,
    music: state => state.user.music,
    num: state => state.user.num,
    SET_ISLOGOUT: state => state.user.islogout

}
export default getters
