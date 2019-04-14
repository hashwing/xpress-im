function loginSuccess() {
	initMsg();
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
		initMsg();
	}
})

var a
function initMsg() {
	a=new Vue({
		el: "#msgs",
		data() {
			return {
				msgs: [],
				unread: new Map(),
				password: "",
				isready: false
			}
		},
		mounted() {
			this.initdb()
			this.initConnect()
		},
		methods: {
			chat: function(user, name) {
				var selfUser = plus.storage.getItem("user")
				var self=this
				mui.openWindow({
					url: 'chat1.html',
					id: user.split("@")[0],
					styles: { // 窗口参数 参考5+规范中的WebviewStyle,也就是说WebviewStyle下的参数都可以在此设置
						titleNView: { // 窗口的标题栏控件
							titleText: name, // 标题栏文字,当不设置此属性时，默认加载当前页面的标题，并自动更新页面的标题
							titleColor: "#FFFFFF", // 字体颜色,颜色值格式为"#RRGGBB",默认值为"#000000"
							titleSize: "17px", // 字体大小,默认17px
							backgroundColor: "#007aff", // 控件背景颜色,颜色值格式为"#RRGGBB",默认值为"#F7F7F7"
							autoBackButton: true
						}
					},
					extras: {
						sid: user,
						selfId: selfUser + "@" + domain,
						name: name
					},
					waiting:{
						autoShow:false
					},
					show: {
						duration:300
					}
				});

// 				var msgsSuccess = function(e) {
// 					var chatWs = plus.webview.getWebviewById(user.split("@")[0]);
// 					for (var i = 0; i < e.length; i++) {
// 						record = {
// 							sender: e[i].fromJid,
// 							type: 'text',
// 							content: e[i].body+","+e[i].time
// 						}
// 						VG.method(chatWs, "addMsg", record, function(back) {})
// 					}
// 				}
// 				findMsg(user, msgsSuccess);
				var rFunc=function(){
					self.initSession(user);
				}
				readAllMsg(user,rFunc);
				
			},
			initSession: function(sid) {
				var self = this
				//this.msgs=[]
				getContacts({}, function(back) {
					console.log(JSON.stringify(back))
					var usersMap = new Map()
					for (var i = 0; i < back.length; i++) {
						var name=back[i].name || back[i].jid
						console.log(name);
						usersMap.set(back[i].jid, name)
					}
					var unreadMap=new Map();
					var sum=0
					var sFunc=function(e){
						console.log(e)
						e.forEach(function(v,i){
							unreadMap.set(v.sid,v.count);
							sum+=v.count;
						});
						var sidIndex=-1
						self.msgs.forEach(function(v,i){
							if (v.user==sid){
								sidIndex=i
							}
						});
						if (sidIndex>0){
							self.msgs.splice(sidIndex,1)
						}
						util.addMsgCount(sum)
						var s = function(ss) {
							if (sidIndex==0&& sid){
								self.msgs[0].count=unreadMap.get(ss[0].sid);
								self.msgs[0].first=ss[0].body;
								self.msgs[0].time=ss[0].time;
								return
							}
							ss.forEach(function(s, i) {
								console.log(s.sid)
								var name = usersMap.get(s.sid)
								var item = {
									user: s.sid,
									name: name,
									time: s.time,
									count: unreadMap.get(s.sid),
									first: s.body
								}
								self.msgs.unshift(item)
							});
							self.isready=true
						}
						findSession(s,sid)
					}
					findUnreadCount(sFunc)
				})
			},
			initConnect: function(){
				var self =this
				var onConneted = function() {
					initNav();
					self.initSession();
				}
				var onMsg = function(msg) {
					var jid =msg.from.split("/")[0]
					var read=0
					var chatWs = plus.webview.getWebviewById(jid.split("@")[0]);
					if (chatWs) {
						read=1
						record = {
							sender: jid,
							type: 'text',
							content: msg.body
						}
						VG.method(chatWs, "addMsg", record, function(back) {})
					}
					if (msg.body == "") {
						return
					}
					var t = new Date();
				
					msgdb = {
						id: guid(),
						sid: jid,
						fromJid: jid,
						toJid: '',
						body: msg.body,
						type: 1,
						read: read,
						time: t.format("yyyy-MM-dd hh:mm:ss")
					}
					insertMsg(msgdb);
					if (self.isready){
					self.initSession(jid);
					}

				}
				connect(onConneted, onMsg)
			}
			,
			initdb:function(){
				console.log(guid())
				opendb()
			}
		}
	});
}

var activePage

function initNav() {
	indexPage = plus.webview.currentWebview()

	// 创建子webview窗口 并初始化
	var aniShow = {};
	util.initSubpage(aniShow);

    activePage = plus.webview.currentWebview();
	var nview = plus.nativeObj.View.getViewById('tabBar'),
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

function changeNavIndex(){
	var aniShow = {};
	var targetPage = plus.webview.currentWebview();
	util.toggleNview(0);
	if (targetPage==activePage){
		return
	}
	// 子页面切换
	util.changeSubpage(targetPage, activePage, aniShow,true);
	activePage = targetPage;
	util.setTitle(targetPage, 0)
	//a.chat("zxy@im.xpressiot.com","詹晓云")
}

//function()
