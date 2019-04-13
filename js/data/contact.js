mui.plusReady(function() {
	console.log(window.innerHeight+"")

	
	//
	var indexPage = plus.webview.getLaunchWebview();
	VG.method(indexPage, "getContacts", { }, function(back) {
		var usersMap=new Map()
		for (var i=0;i<back.length;i++){
			var value=back[i];
			var firstChar
			if (value.name){
				var reg = /^[A-Za-z]+$/;
				if (reg.test(value.name[0])){
					firstChar=value.name[0].toUpperCase();
				}else{
					var obj=charToCode(value.name[0])
					firstChar=obj.zimu
				}
			}else{
				firstChar=value.jid[0].toUpperCase()
				back[i].name=value.jid;
			}
			if (usersMap.has(firstChar)){
				usersMap.get(firstChar).push(value)
			}else{
				usersMap.set(firstChar,[value])
			}
			
		};
		
		var html=''
		 for(var map of usersMap){
				html+='<li data-group="'+map[0]+'" class="mui-table-view-divider mui-indexed-list-group">'+map[0]+'</li>'
				map[1].forEach(function(v,i){
					html+='<li data-value="AKU" data-tags="AKeSu" class="mui-table-view-cell mui-indexed-list-item" onclick="gotoChat(\''+v.jid+'\',\''+v.name+'\')">'+v.name+'</li>'
				})
				//console.log("属性：" + map[0] + ",值：" + map[1][0].jid);
		}
		console.log(html)
		document.getElementById("contact-list").innerHTML=html
	});
});

function gotoChat(jid,name){
	console.log(jid)
	var indexPage=plus.webview.getLaunchWebview()
	indexPage.evalJS('a.chat("'+jid+'","'+name+'")')
	//indexPage.evalJS("changeNavIndex()")
}
	
function initHeight(){
	var list = document.getElementById('list');
	//calc hieght
	list.style.height = document.body.offsetHeight+ 'px';
	console.log(window.innerHeight+","+document.body.offsetHeight)
	//create1
	window.indexedList = new mui.IndexedList(list);
}
