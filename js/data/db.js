var dbReady=false
var cacheMsg=[]

function storeMsg(msg){
	if (dbReady){
		insertMsg(msg)
	}else{
		cacheMsg.push(msg)
	}
}

mui.plusReady(function() {
	plus.sqlite.openDatabase({
		name: 'msg',
		path: '_doc/msg.db',
		success: function(e) {
			plus.sqlite.executeSql({
				name: 'msg',
				//sql: 'drop table msg',
				sql: 'create table if not exists msg("sid" CHAR(50),"fromJid" CHAR(50),"toJid" CHAR(50),"body" CHAR(4096),"msg_typ" INT(2),"read" INT(1),"time" CHAR(20))',
				success: function(e) {
					dbReady=true
					for (var i=0;i<cacheMsg.length;i++){
						var msg=cacheMsg.pop()
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
})

function insertMsg(msg){
	plus.sqlite.executeSql({
			name: 'msg',
			sql: "insert into msg values('"+msg.sid+"','"+msg.fromJid+"','"+msg.toJid+"','"+msg.body+"',"+msg.type+","+msg.read+",'"+msg.time+"')",
			success: function(e){
				console.log(JSON.stringify(e))
			},
			fail: function(e){
				console.log(JSON.stringify(e))
			}
		})
}

function findMsg(sid,success){
	plus.sqlite.selectSql({
		name: 'msg',
		sql: "select * from msg where sid='"+sid+"'",
		success: function(e){
			console.log(JSON.stringify(e));
			success(e)
		},
		fail: function(e){
			console.log(JSON.stringify(e));
		}
	});
}

function readAllMsg(sid,success){
	plus.sqlite.executeSql({
			name: 'msg',
			sql: "update msg set read=1 where read=0 and sid='"+sid+"'",
			success: function(e){
				console.log(JSON.stringify(e))
				if (success){
					success()
				}
			},
			fail: function(e){
				console.log(JSON.stringify(e))
			}
	})
}

function findUnreadCount(success){
	plus.sqlite.selectSql({
		name: 'msg',
		sql: "select sid, count(*) as count from msg where read=0 GROUP BY sid",
		success: function(e){
			console.log(JSON.stringify(e));
			success(e)
		},
		fail: function(e){
			console.log(JSON.stringify(e));
		}
	});
}


function findSession(success){
	plus.sqlite.selectSql({
		name: 'msg',
		sql: "select * from msg GROUP BY sid",
		success: function(e){
			console.log(JSON.stringify(e));
			success(e)
		},
		fail: function(e){
			console.log(JSON.stringify(e));
		}
	});
}

Date.prototype.format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}  