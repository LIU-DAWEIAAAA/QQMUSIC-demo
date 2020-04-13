// JavaScript Document
//对歌词进行操作


(function(){
	
	
	function Lyric(path){
		
		return new Lyric.prototype.init(path);
	}
	
	Lyric.prototype = {
		constructor:Lyric,
		
		musicList:[],
		//必要的参数
		init:function(path){
			this.path = path;
			
		},
		
		//存放时间的数组
		times:[],
		
		//存放歌词的数组
		lyrics:[],
		
		//定义一个索引 与歌词时间索引来匹配
		index:-1,
		
		loadLyric:function(callBack){
			var $this = this;
			
			$.ajax({
			
				url:$this.path,
				dataType:"text",
				success:function(data){
					//console.log(data);
					
					//解析歌词
					$this.parseLyric(data);
					//解析完歌词执行回调函数
					callBack();

				},
				error:function(e){
					//打印错误内容
					console.log(e);
					
				}
			});	
		},
		
		parseLyric:function(data){
			
			var $this = this;
			//清空歌曲信息 这样方便切歌时候更新信息 清空上一首歌的歌词和时间
			$this.times =[];
			$this.lyrics = [];
			
			var array = data.split("\n");
			//console.log(array);
			
			//利用正则表达式匹配时间[02:02.08]
			var timeReg = /\[(\d*:\d*\.\d*)\]/; //括号（）里面为所需要的时间
			
			//遍历取出每一行歌词
			$.each(array,function(index,ele){
				//存放歌词
				var lrc = ele.split("]")[1];
				//排除空字符串(没有歌词的)
				if(lrc.length <= 1) return true;
				$this.lyrics.push(lrc);
				
				//console.log(ele);
				
				var res = timeReg.exec(ele);
				//console.log(res);
				if(res ==null) return true;
				var timeStr = res[1]; //格式为02:02.08
				
				var res2 = timeStr.split(":");
				var min = parseInt(res2[0])*60;
				var sec = parseFloat(res2[1]);
				var time =parseFloat(Number(min+sec).toFixed(2)); 
				
				//存放当前转化好的时间
				$this.times.push(time);
				
			});
			//console.log($this.times,$this.lyrics);
		},
		
		//获取当前的索引
		currentIndex:function(currentTime){
			//console.log(currentTime);
			if(currentTime>= this.times[0]){
				this.index++;
				this.times.shift();//数组的shift方法是专门来删除数组最前面的一个元素
			}
			
			return this.index;
		}
		
		
	}
	
	//对象初始化 把init的原型转化为player的原型 这样调用player时候就可以默认初始化了，不要单独调用init()了
	Lyric.prototype.init.prototype = Lyric.prototype;
	window.Lyric = Lyric;
	
	
})(window);








