//工作场景列表
var states=[
	{
		index:0,
		name:"fList",
		title:"随身拍",
		tailData:'<input onclick="newDir()" class="Abutton" type="button" value="+" />'
	},
	{
		index:1,
		name:"nList",
		tailData:'<input onclick="newNote()" class="Abutton" type="button" value="+" />'
	},
	{
		index:2,
		name:"nShow",
		tailData:'<input onclick="edit()" class="Abutton" type="button" value="编辑" />'
	},
	{
		index:3,
		name:"nEdit",
		tailData:''
	}
];
//定义当前场景索引
var StateIndex=0;
var EditKey=false;
var EditId="";
var anyListClick={
	//加载文件夹列表点击事件
	"fListData":function(id){
		var fs=$(id).getElementsByTagName("li");
		for(var i=0;i<fs.length;i++){
			fs[i].onmousedown=function(){
				this.className="down";
				(function(me){
					setTimeout(function(){
						me.className="";
						StateIndex=1;
						states[StateIndex].title=me.getElementsByTagName("p")[1].innerHTML;
						//加载数据
						$("nListData").innerHTML="";
						DB.transaction(function(tx) {
							tx.executeSql("SELECT * FROM notes where cats='" + states[StateIndex].title + "'", [],
								function(tx, result) {
									if(result.rows.length==0){
										alert("木有数据哈!");
									}else{					
										for(var i = 0; i < result.rows.length; i++){
											$("nListData").innerHTML+='<li id="' + result.rows.item(i)['id'] + '"><div class="photo"><img src="' + result.rows.item(i)['photo'] + '"/></div><div class="word">' + result.rows.item(i)['word'] + '</div></li>';
										}
										anyListClick["nListData"]("nListData");
									}
								},
								function(){
									alert("error");
								}
							); 
						})
						reState(states,"nList");
					},500)
				})(this);
			}
		}
	},
	//加载记事点击事件
	"nListData":function(id){
		var fs=$(id).getElementsByTagName("li");
		for(var i=0;i<fs.length;i++){
			fs[i].onmousedown=function(){
				this.className="down";
				(function(me){
					setTimeout(function(){
						me.className="";
						StateIndex=2;
						states[StateIndex].title=states[StateIndex-1].title;
						reState(states,"nShow");
						$("nShow-content-photo").innerHTML=me.getElementsByTagName("div")[0].innerHTML;
						$("nShow-content-word").getElementsByTagName("span")[0].innerHTML=me.getElementsByTagName("div")[1].innerHTML;
						EditId=me.id;
					},500);
				})(this);
			}
		}	
	}
}
//场景切换
var reState=function(targets,id){
	for(var n=0;n<targets.length;n++){
		$(targets[n].name).style.display="none";
	}
	$(id).style.display="block";
	loadTitleBar(states[StateIndex].title,states[StateIndex].tailData);
}
//标签切换
var reTab=function(targets,id){
	for(var n=0;n<targets.length;n++){
		$(targets[n]).style.display="none";
	}
	$(id).style.display="block";
}
//加载标题栏数据
var loadTitleBar=function(title,actionBar){
	$("Title").innerHTML=title;
	$("Action-bar").innerHTML=actionBar;
}
//新建目录事件
var newDir=function(){
	$("newDir").style.display="block";
}
//编辑当前记录
var edit=function(){
	EditKey=true;
	console.log(EditKey);
	StateIndex=3;
	states[StateIndex].title=states[StateIndex-2].title;
	reState(states,"nEdit");
	$("nEdit-content-word").getElementsByTagName("textarea")[0].value=$("nShow-content-word").getElementsByTagName("span")[0].innerHTML;
}
//新建目录
var saveNewDir=function(){
	var _fs=$("fListData").getElementsByTagName("li");
	var _sameKey=false;
	var _dirName=$("dirName").value;
	//判断重名
	for(var i=0;i<_fs.length;i++){
		if(_fs[i].getElementsByTagName("p")[1].innerHTML==_dirName){
			_sameKey=true;
		}
	}
	if(!_sameKey){
		//写入新分类名
		DB.transaction(function(tx) {
			tx.executeSql(
				"INSERT INTO cats (id,icon,name) values(?,?,?)",
				[rnd_str(9,true,true,true),'imgsrc',_dirName],
				null, null
			);
		});
		//重新渲染数据
	 	DB.transaction(function(tx){
			tx.executeSql("SELECT * FROM cats", [],
				function(tx, result) {
					$("fListData").innerHTML="";
					for(var i = 0; i < result.rows.length; i++){
						$("fListData").innerHTML+='<li><p class="icon"><img sr="' + result.rows.item(i)['icon'] + '"/></p><p class="name">' + result.rows.item(i)['name'] + '</p></li>';
					}
					anyListClick["fListData"]("fListData");
				},
				function(){
					alert("error");
				}
			); 
		}); 
		$("newDir").style.display="none";
	}else{
		alert('已存在"' + $("dirName").value + '"，请重新输入！' );
	}
	$("dirName").value="";
}
//新建记事
var newNote=function(){
	StateIndex=2;
	states[StateIndex].title=states[StateIndex-1].title;
	reState(states,"nEdit");
}
//保存记事
var saveNewNote=function(){//nid：记事id
	//获取描述信息
	var _photo=$("nEdit-content-photo").getElementsByTagName("img")[0].src;
	var _word=$("nEdit-content-word").getElementsByTagName("textarea")[0].value;
	//写新记录
	DB.transaction(function(tx) {
		if(EditKey){
			tx.executeSql(
				"update notes set photo=?,word=? where id='" + EditId + "'",
				[_photo,_word],
				null, null
			);
		}else{
			tx.executeSql(
				"INSERT INTO notes (id,photo,word,cats) values(?,?,?,?)",
				[rnd_str(9,true,true,true),_photo,_word,states[StateIndex].title],
				null, null
			);			
		}
	});
	//重新渲染数据
	DB.transaction(function(tx) {
		tx.executeSql("SELECT * FROM notes where cats='" + states[StateIndex].title + "'", [],
			function(tx, result) {
				$("nListData").innerHTML="";
				for(var i = 0; i < result.rows.length; i++){
					$("nListData").innerHTML+='<li id="' + result.rows.item(i)['id'] + '"><div class="photo"><img src="' + result.rows.item(i)['photo'] + '"/></div><div class="word">' + result.rows.item(i)['word'] + '</div></li>';
				}
				anyListClick["nListData"]("nListData");
				GoBack();
			},
			function(){
				alert("error");
			}
		); 
	});
}
//回到首页事件
var goHome=function(){
	StateIndex=0;
	reState(states,"fList");
}
//返回按钮事件
var GoBack=function(){
	StateIndex--;
	reState(states,states[StateIndex].name);
	EditKey=false;
}
//初始化显示文件夹列表
reState(states,"fList");
//$("fList").style.display="block";