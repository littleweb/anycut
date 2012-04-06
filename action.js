	//读取文件函数
	function doReadFile(vo){
		var f=vo.dir,src=vo.src,defaultData=(vo.defaultData)?(vo.defaultData):"";
		var fpath="list.txt";
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
		//获取文件
		function gotFS(fileSystem) {
			//读文件，如果不存在就创建
			fileSystem.root.getDirectory(f, {create: true, exclusive: false}, function(){
				fileSystem.root.getFile(f + '/' + fpath, {create: true, exclusive: false}, gotFileEntry, fail);
			}, fail);
		} 
		//获取文件信息
		function gotFileEntry(fileEntry){
			fileEntry.file(gotFile, fail); 
		}  
		function gotFile(file){ 
			readDataUrl(file); 
			readAsText(file); 
		}  
		function readDataUrl(file) { 
			var reader = new FileReader(); 
			reader.onloadend = function(evt) { 
				//$("readLog").innerHTML=("Read as data URL"); 
				//$("readLog").innerHTML=(evt.target.result);
				//$("readLog").innerHTML='读取成功';
			}; 
			reader.readAsDataURL(file); 
		}  
		function readAsText(file) { 
			var reader = new FileReader(); 
			reader.onloadend = function(evt) { 
				//$("console").value=("Read as text"); 
				if(evt.target.result==""){
					doWriteFile({dir:f,string:defaultData});
					$(src).innerHTML=defaultData;
					anyListClick[src](src);
				}else{
					$(src).innerHTML = (evt.target.result);
					anyListClick[src](src);
				}
				return false;
			}; 
			reader.readAsText(file);
		}  
		function fail(evt) { 
			//$("readLog").innerHTML=(evt.target.error.code); 
		}
	}
	//写入文本文件
	function doWriteFile(vo){
		var f=vo.dir,string=vo.string;
		var fpath="list.txt";
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail); 
		function gotFS(fileSystem) { 
			//写文件，如果不存在就创建
			fileSystem.root.getDirectory(f, {create: true, exclusive: false}, function(){
				fileSystem.root.getFile(f + '/' + fpath, {create: true, exclusive: false}, gotFileEntry, fail);
			}, fail);
		} 
		function gotFileEntry(fileEntry) { 
			fileEntry.createWriter(gotFileWriter, fail);
		}  
		function gotFileWriter(writer) { 
			writer.onwrite = function(evt) { 
				$("writeLog").innerHTML="写入成功"; 
				return false;;
			}; 
			//writer.write("some sample text"); 
			// 文件当前内容是“some sample text”
			//writer.truncate(11); 
			// 文件当前内容是“some sample” 
			//writer.seek(4); 
			// 文件当前内容依然是“some sample”，但是文件的指针位于“some”的“e”之后
			//追加
			writer.seek(writer.length);
			writer.write(string);
			// 文件的当前内容是“some different text”
		}  
		function fail(error) { 
			$("writeLog").innerHTML='错误号：' + error.code;
		} 
	}