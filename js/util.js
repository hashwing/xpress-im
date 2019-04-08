var util = {
	options: {
		ACTIVE_COLOR: "#007aff",
		NORMAL_COLOR: "#000",
		subpages: ["../contact/contact.html", "../me/me.html"],
		titles: ["消息","联系人", "我"]
	},
	/**
	 *  简单封装了绘制原生view控件的方法
	 *  绘制内容支持font（文本，字体图标）,图片img , 矩形区域rect
	 */
	drawNative: function(id, styles, tags) {
		var view = new plus.nativeObj.View(id, styles, tags);
		return view;
	},
	/**
	 * 初始化首个tab窗口 和 创建子webview窗口 
	 */
	initSubpage: function(aniShow) {
		var subpage_style = {
				top: 0,
				bottom: 51,
			},
			subpages = util.options.subpages,
			self = plus.webview.currentWebview(),
			temp = {};

		//兼容安卓上添加titleNView 和 设置沉浸式模式会遮盖子webview内容
		if (mui.os.android) {
			if (plus.navigator.isImmersedStatusbar()) {
				subpage_style.top += plus.navigator.getStatusbarHeight();
				console.log(subpage_style.top)
			}
			if (self.getTitleNView()) {
				subpage_style.top += 40;
			}

		}

		// 初始化第一个tab项为首次显示
		temp[self.id] = "true";
		mui.extend(aniShow, temp);
		// 初始化绘制首个tab按钮
		util.toggleNview(0);
		util.addAddIcon(self)
		//subpage_style.titleNView= {titleText: util.options.titles[0]}

		for (var i = 0, len = subpages.length; i < len; i++) {

			if (!plus.webview.getWebviewById(subpages[i])) {
				//subpage_style.titleNView= {titleText: util.options.titles[i]}
				var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
				// append到当前父webview
				self.append(sub);
				// 初始化隐藏
				sub.hide();
			}
		}
	},
	/**	
	 * 点击切换tab窗口 
	 */
	changeSubpage: function(targetPage, activePage, aniShow) {
		//若为iOS平台或非首次显示，则直接显示
		if (mui.os.ios || aniShow[targetPage]) {
			plus.webview.show(targetPage);
		} else {
			//否则，使用fade-in动画，且保存变量
			var temp = {};
			temp[targetPage] = "true";
			mui.extend(aniShow, temp);
			plus.webview.show(targetPage, "fade-in", 300);
		}
		//隐藏当前 除了第一个父窗口
		if (activePage !== plus.webview.getLaunchWebview()) {
			plus.webview.hide(activePage);
		}
	},
	/**
	 * 点击重绘底部tab （view控件）
	 */
	toggleNview: function(currIndex) {
		currIndex = currIndex * 2;
		// 重绘当前tag 包括icon和text，所以执行两个重绘操作
		util.updateSubNView(currIndex, util.options.ACTIVE_COLOR);
		util.updateSubNView(currIndex + 1, util.options.ACTIVE_COLOR);
		// 重绘兄弟tag 反之排除当前点击的icon和text
		for (var i = 0; i < 6; i++) {
			if (i !== currIndex && i !== currIndex + 1) {
				util.updateSubNView(i, util.options.NORMAL_COLOR);
			}
		}
	},
	/*
	 * 改变颜色
	 */
	changeColor: function(obj, color) {
		obj.color = color;
		return obj;
	},
	/*
	 * 利用 plus.nativeObj.View 提供的 drawText 方法更新 view 控件
	 */
	updateSubNView: function(currIndex, color) {
		var self = plus.webview.currentWebview(),
			nviewEvent = plus.nativeObj.View.getViewById("tabBar"), // 获取nview控件对象
			nviewObj = self.getStyle().subNViews[0], // 获取nview对象的属性
			currTag = nviewObj.tags[currIndex]; // 获取当前需重绘的tag

		nviewEvent.drawText(currTag.text, currTag.position, util.changeColor(currTag.textStyles, color), currTag.id);
	},
	setTitle: function(wv, currIndex) {
		if (currIndex==2){
				var headView = wv.getNavigationbar();
				headView.reset();
		}else{
			util.addAddIcon(wv)
		}
		
		wv.setStyle({
			titleNView: {
				titleText: util.options.titles[currIndex]
			}
		});
	},
	addAddIcon:function(wv){
		var headView = wv.getNavigationbar();
		var addIcon = new plus.nativeObj.Bitmap('icon_add');
		addIcon.loadBase64Data(ADD_BASE, function() {  
		headView.drawBitmap(addIcon, {}, {  
				width: '25px',  
				height: '25px',  
				top: '10px',  
				right: '15px'  
			});  
		});  
	},
	addMsgCount: function(num) {
		var Rheight = '18px';
		var Rwith = '20px';
		if (num == 0 || num == null) {
			Rheight = '0px';
			Rwith = '0px';
		}
		if (num > 10 && num < 100) {
			Rwith = '25px';
		}
		if (num > 99) {
			Rwith = '28px';
			num = '99+';
		}
		nviewEvent = plus.nativeObj.View.getViewById("tabBar"), // 获取nview控件对象
		// 绘制空心圆角矩形,borderColor设置为导航背景色，就变成圆形
		nviewEvent.drawRect({
				color: '#f74c31',
				borderWidth: '0px',
				radius: '50px',
				borderColor: "#FFFFFF"
			}, {
				top: '2px',
				left: '17%',
				width: Rwith,
				height: Rheight
			});
		//绘制数字
		nviewEvent.drawText(num, {
			top: '3px',
			left: '17%',
			width: Rwith,
			height: Rheight
		}, {
			color: '#FFFFF',
			size: '13px'
		});
	}
};

var ADD_BASE = 'data:image/png;base64,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';  