function loginSuccess() {
	initNav()
	initMsg()
}
mui.init({
	keyEventBind: {
		backbutton: false //关闭back按键监听
	}
});
mui.plusReady(function() {
	//
	//plus.storage.clear();
	var user = plus.storage.getItem("user")
	var pwd = plus.storage.getItem("pwd")
	if (user == "" || user == null || pwd == "" || pwd == null) {
		mui.openWindow({
			url: "../login/login.html",
			id: "login",
		})
	} else {
		console.log(user + "," + pwd)
		initNav();
		initMsg()
	}
})

function initMsg(){
	new Vue({
		el: "#msgs-list",
		data() {
			return {
				msgs: [{
					user: "hym",
					name: "韩一敏",
					time: "昨天12:35",
					count: 1,
					first: "测试"
				}],
				password: "",
			}
		},
		methods: {
			chat: function(user,name) {
				console.log(user)
				mui.openWindow({
					url: 'chat.html',
					id: 'chat.html',
					styles: { // 窗口参数 参考5+规范中的WebviewStyle,也就是说WebviewStyle下的参数都可以在此设置
						titleNView: { // 窗口的标题栏控件
							titleText: name, // 标题栏文字,当不设置此属性时，默认加载当前页面的标题，并自动更新页面的标题
							titleColor: "#FFFFFF", // 字体颜色,颜色值格式为"#RRGGBB",默认值为"#000000"
							titleSize: "17px", // 字体大小,默认17px
							backgroundColor: "#007aff", // 控件背景颜色,颜色值格式为"#RRGGBB",默认值为"#F7F7F7"
							autoBackButton: true
						}
					}
				});
			}
		}
	});
	util.addMsgCount(10)
}

function initNav() {
	indexPage = plus.webview.currentWebview()

	// 创建子webview窗口 并初始化
	var aniShow = {};
	util.initSubpage(aniShow);

	var nview = plus.nativeObj.View.getViewById('tabBar'),
		activePage = plus.webview.currentWebview(),
		targetPage,
		subpages = util.options.subpages,
		pageW = window.innerWidth,
		currIndex = 0;

	/**
	 * 根据判断view控件点击位置判断切换的tab
	 */
	nview.addEventListener('click', function(e) {
		var clientX = e.clientX;
		if (clientX > 0 && clientX <= parseInt(pageW * 0.33)) {
			currIndex = 0;

		} else if (clientX > parseInt(pageW * 0.33) && clientX <= parseInt(pageW * 0.66)) {
			currIndex = 1;
		} else {
			currIndex = 2;
		}
		// 匹配对应tab窗口	
		if (currIndex > 0) {
			targetPage = plus.webview.getWebviewById(subpages[currIndex - 1]);
		} else {
			targetPage = plus.webview.currentWebview();
		}

		if (targetPage == activePage) {
			return;
		}
		//底部选项卡切换
		util.toggleNview(currIndex);
		// 子页面切换
		util.changeSubpage(targetPage, activePage, aniShow);
		//更新当前活跃的页面
		activePage = targetPage;
		util.setTitle(indexPage, currIndex)
	});
}
