mui.plusReady(function() {
	//
	new Vue({
		el: "#user",
		data() {
			return {
				uid: '',
				nickName: '',
			}
		},
		mounted() {
			console.log('mount user')
			if (plus.storage.getItem("user")) {
				this.uid = plus.storage.getItem("user");
				this.nickName = plus.storage.getItem("user");
				console.log(this.uid);
			}
			console.log('mounted end')
		},
		watch() {
			console.log('watch user');
		},
		methods: {
			logout: function() {
				console.log("dddd")
				plus.storage.clear()
				var user = plus.storage.getItem("user")
				var pwd = plus.storage.getItem("pwd")
				if (user == "" || user == null || pwd == "" || pwd == null) {
					plus.runtime.quit();
				}
			}
		}
	})
})
