	var $=function(id){return document.getElementById(id);}
	// 等待加载PhoneGap
	document.addEventListener("deviceready", onDeviceReady, false); 
	// PhoneGap加载完毕
	function onDeviceReady(){
		window.DB = window.openDatabase("faceguoAnyPai", "1.0","非时香果-随身拍",20000);
		//window.openDatabase("数据库名字", "版本","数据库描述",数据库大小);
		if(DB){
			DB.transaction(function(tx) {
				tx.executeSql("CREATE TABLE IF NOT EXISTS cats (id int UNIQUE, icon TEXT, name TEXT)");
				tx.executeSql("CREATE TABLE IF NOT EXISTS notes (id int UNIQUE,photo TEXT,word TEXT,cats TEXT)");
			});
			DB.transaction(function(tx) {
				tx.executeSql("SELECT * FROM cats", [],
					function(tx, result) {
						if(result.rows.length==0){
							var _defaultData=[['img','消费票'],['img','路标记']];
							var _dl=_defaultData.length;
							for(var i=0;i<_dl;i++){
								tx.executeSql("INSERT INTO cats (id,icon, name) values(?,?,?)", [rnd_str(9,true,true,true),_defaultData[i][0],_defaultData[i][1]], function(tx){
									tx.executeSql("SELECT * FROM cats", [],
										function(tx, result){
											$("fListData").innerHTML="";
											for(var i = 0; i < result.rows.length; i++){
												$("fListData").innerHTML+='<li><p class="icon"><img sr="' + result.rows.item(i)['icon'] + '"/></p><p class="name">' + result.rows.item(i)['name'] + '</p></li>';
											}
											anyListClick["fListData"]("fListData");										
										},null);
								}, null);
							}
						}else{							
							for(var i = 0; i < result.rows.length; i++){
								$("fListData").innerHTML+='<li><p class="icon"><img sr="' + result.rows.item(i)['icon'] + '"/></p><p class="name">' + result.rows.item(i)['name'] + '</p></li>';
							}
							anyListClick["fListData"]("fListData");
						}
					},
					function(){
						alert("error");
					}
				); 
			});
		}
	}
//从相机获取图像，返回的是URI
function getCamera(){
	var m_imageURI;//选择的图像文件
	navigator.camera.getPicture(
		//获取图像成功
		function (imageURI) {
			//var image = document.getElementById('myImage');
			//image.src = imageURI;
			//alert("pic: "+ imageURI);
			m_imageURI = imageURI;
			//转换URI到全路径
			window.resolveLocalFileSystemURI(
				imageURI,
				//转换URI到全路径
				function(fileEntry){
					fpath = fileEntry.fullPath;
					moveFile(rnd_str(12,true,true,true) + ".jpg","随身拍");
				},
				//文件操作失败
				function(error) { 
					//alert("错误号: "+ error.code);
				}
			);
		},
		//获取图像失败
		function (message) {
			//alert('Failed because: ' + message);
			//alert(message);
		}, 
		//相机参数
		{
			quality: 50,
			destinationType: navigator.camera.DestinationType.FILE_URI,
			sourceType : Camera.PictureSourceType.CAMERA,
			allowEdit : false,
			encodingType : Camera.EncodingType.JPEG,
			targetWidth : 480,
			targetHeight : 640
		}
	);
	function moveFile(fname,dirname){
		//开始操作文件
		//通过本地URI参数检索DirectoryEntry或FileEntry
		window.resolveLocalFileSystemURI(m_imageURI,function(fileEntry){
		//请求持久化的文件系统
			window.requestFileSystem(LocalFileSystem.PERSISTENT,0,function(fileSystem){
				//如果目录不存在就创建
				var direc = fileSystem.root.getDirectory(dirname, {create: true},function( parent ){
					//toLog("Parent Name:" + parent.name +"<br/>Full Path:"+ parent.fullPath);
					//移动文件
					fileEntry.moveTo(parent/*fileSystem.root*/, fname,function(){
						//toLog("Move OK: "+ parent.fullPath +"/"+ fname );
						$("nEdit-content-photo").innerHTML='<img src="' + parent.fullPath +"/"+ fname + '" />';
					}, function(){alert("失败");});			
				},function(){alert("失败");});
			}, function(){alert("失败");});
		},function(){alert("失败");});
	}
}
//随机数
function rnd_str(str_0,str_1,str_2,str_3){
//str_0 长度
//str_1 是否大写字母
//str_2 是否小写字母
//str_3 是否数字
	var Seed_array=new Array();
	var seedary;
	var i;
	Seed_array[0]=""
	Seed_array[1]= "a b c d e f g h i j k l m n o p q r s t u v w x y z";
	Seed_array[2]= "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z";
	Seed_array[3]= "A";
	if (!str_1&&!str_2&&!str_3){str_1=true;str_2=true;str_3=true;}
	if (str_1){Seed_array[0]+=Seed_array[1];}
	if (str_2){Seed_array[0]+=" "+Seed_array[2];}
	if (str_3){Seed_array[0]+=" "+Seed_array[3];}
	Seed_array[0]= Seed_array[0].split(" ");
	seedary=""
	for (i=0;i<str_0;i++)
	{
	seedary+=Seed_array[0][Math.round(Math.random( )*(Seed_array[0].length-1))]
	}
	return(seedary);
}