const xmpp_ws = "wss://im.xpressiot.com/ws"
const domain = "im.xpressiot.com"

function nav(titleText){
	var subpage_style = {
		top: 0,
		bottom: 0,
	}
	//兼容安卓上添加titleNView 和 设置沉浸式模式会遮盖子webview内容
// 	if (mui.os.android) {
// 		if (plus.navigator.isImmersedStatusbar()) {
// 			subpage_style.top += plus.navigator.getStatusbarHeight();
// 			console.log(subpage_style.top)
// 		}
// 		if (plus.webview.currentWebview().getTitleNView()) {
// 			subpage_style.top += 40;
// 		}
// 	}
	subpage_style.titleNView= {titleText: titleText}
	return subpage_style
} 
