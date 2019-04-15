var dbReady = false
var cacheMsg = []

// function storeMsg(msg){
// 	if (dbReady){
// 		insertMsg(msg)
// 	}else{
// 		cacheMsg.push(msg)
// 	}
// }
var dbProfix = ""

mui.plusReady(function() {
	initProfix();
})

function initProfix() {
	dbProfix = plus.storage.getItem("user") + "_"
}

function opendb() {
	plus.sqlite.openDatabase({
		name: 'msg',
		path: '_doc/msg.db',
		success: function(e) {
			plus.sqlite.executeSql({
				name: 'msg',
				//sql: 'drop table djh_msg',
				sql: 'create table if not exists ' + dbProfix +
					'msg("id" CHAR(50),"sid" CHAR(50),"fromJid" CHAR(50),"toJid" CHAR(50),"body" CHAR(4096),"msg_typ" INT(2),"read" INT(1),"time" CHAR(20))',
				success: function(e) {
					dbReady = true
					for (var i = 0; i < cacheMsg.length; i++) {
						var msg = cacheMsg.pop()
						insertMsg(msg)
					}
					console.log(JSON.stringify(e))
				},
				fail: function(e) {
					console.log(JSON.stringify(e))
				}
			})
		},
		fail: function(e) {
			console.log(JSON.stringify(e));
		}
	});
}

function insertMsg(msg) {
	plus.sqlite.executeSql({
		name: 'msg',
		sql: "insert into " + dbProfix + "msg values('" + msg.id + "','" + msg.sid + "','" + msg.fromJid + "','" + msg.toJid +
			"','" + msg.body + "'," + msg.type + "," + msg.read + ",'" + msg.time + "')",
		success: function(e) {
			console.log(JSON.stringify(e))
		},
		fail: function(e) {
			console.log(JSON.stringify(e))
		}
	})
}

function findMsg(sid, offset, success) {
	plus.sqlite.selectSql({
		name: 'msg',
		sql: "select * from " + dbProfix + "msg where sid='" + sid + "' order by time desc limit 15 OFFSET " + offset,
		success: function(e) {
			console.log(JSON.stringify(e));
			if (success) {
				success(e)
			}
		},
		fail: function(e) {
			console.log(JSON.stringify(e));
		}
	});
}

function readAllMsg(sid, success) {
	plus.sqlite.executeSql({
		name: 'msg',
		sql: "update " + dbProfix + "msg set read=1 where read=0 and sid='" + sid + "'",
		success: function(e) {
			console.log(JSON.stringify(e))
			if (success) {
				success(e)
			}
		},
		fail: function(e) {
			console.log(JSON.stringify(e))
		}
	})
}

function findUnreadCount(success) {
	plus.sqlite.selectSql({
		name: 'msg',
		sql: "select sid, count(*) as count from " + dbProfix + "msg where read=0 GROUP BY sid",
		success: function(e) {
			console.log(JSON.stringify(e));
			if (success) {
				success(e)
			}
		},
		fail: function(e) {
			console.log(JSON.stringify(e));
		}
	});
}


function findSession(success, sid) {
	var sql = "select * from " + dbProfix + "msg GROUP BY sid order by time asc";
	if (sid) {
		sql = "select * from " + dbProfix + "msg where sid='" + sid + "' GROUP BY sid order by time asc"
	}
	console.log(sql)
	plus.sqlite.selectSql({
		name: 'msg',
		sql: sql,
		success: function(e) {
			console.log(JSON.stringify(e));
			success(e)
		},
		fail: function(e) {
			console.log(JSON.stringify(e));
		}
	});
}

Date.prototype.format = function(fmt) { //author: meizz   
	var o = {
		"M+": this.getMonth() + 1, //月份   
		"d+": this.getDate(), //日   
		"h+": this.getHours(), //小时   
		"m+": this.getMinutes(), //分   
		"s+": this.getSeconds(), //秒   
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度   
		"S": this.getMilliseconds() //毫秒   
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

function guid() {
	function S4() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}
	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function nowTimestamp() {
	return new Date().getTime();
}

function add0(m){return m<10?'0'+m:m }
function timetrans(date) {
	var time = new Date(parseInt(date));
	var y = time.getFullYear();
	var m = time.getMonth() + 1;
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();
	return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}
