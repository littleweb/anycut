	var $=function(id){return document.getElementById(id);}
	// 等待加载PhoneGap
	document.addEventListener("deviceready", onDeviceReady, false); 
	// PhoneGap加载完毕
	function onDeviceReady(){
		/*
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, function(){}); 
		function gotFS(fileSystem) { 
			//写文件，如果不存在就创建
			fileSystem.root.getDirectory('随身拍', {create: true, exclusive: false},null, null);
		}
		alert("ok");
		*/
		doReadFile({
			dir:'随身拍',
			src:"fListData",
			defaultData:'<li><p class="icon"></p><p class="name">消费小票</p></li>'
		});
	}