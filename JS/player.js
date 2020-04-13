// JavaScript Document

(function(){
	
	
	function Player($audio){
		
		return new Player.prototype.init($audio);
	}
	
	Player.prototype = {
		constructor:Player,
		
		musicList:[],
		//必要的参数
		init:function($audio){
			//获取jquery包装好的对象
			this.$audio = $audio;
			//下面get(0)是获取原生的
			this.audio = $audio.get(0);
		},
		
		//创建一个对象用于记录当前播放音乐的索引
		currentIndex:-1,
		playMusic:function(index,music){
			//判断点击的是否是同一首音乐
			if(this.currentIndex == index){
				//当前点击的是同一首歌
				//所以在播放与暂停间切换
				if(this.audio.paused){//拿到原生的li
					//音乐是暂停的
					this.audio.play();
					
				}else{
					//音乐不是暂停的
					this.audio.pause();
				}
			}else{
				//当前点击的为不是同一首歌
				//更换歌曲地址
				this.$audio.attr("src",music.link_url);
				this.audio.play();
				
				//不是同一首音乐：currentIndex要赋值为传进来的index
				this.currentIndex = index;
				
			}
			
		},
		
		//专门定义一个变量来处理索引
		//上一首
		preIndex:function(){
			var index = this.currentIndex -1;
			if(index<0){
				index = this.musicList.length -1;
			}
			
			return index;
		},
		
 		//下一首
		nextIndex:function(){
			var index = this.currentIndex +1;
			if(index>this.musicList.length-1){
				index = 0;
			}
			return index;
		},
		
		//子菜单删除按钮
		changeMusic:function(index){
			
			//删除对应数据
			this.musicList.splice(index, 1);
			
			//判断删除的数据是否是正在播放音乐的前面音乐
			if(index < this.currentIndex){
				this.currentIndex = this.currentIndex -1;
			}
		},
		
		//获得音乐的播放时间(下面update已经使用 所以删除)
		/*getMusicDuration:function(){
			return this.audio.duration;
		},*/
		
		//获得音乐播放的当前进度(下面update已经使用 所以删除)
		/*getMusicCurrentTime:function(){
			return this.audio.currentTime;
		},*/
		
			musicTimeUpdate:function(callBack){//调用函数时候传递一个函数进来
				var $this = this;

				//8.监听播放的进度
				//ontimeupdate 事件在视频/音频（audio/video）当前的播放位置发送改变时触发。 audio 音频文件特有
				this.$audio.on("timeupdate",function(){

				//console.log(player.getMusicDuration(),player.getMusicCurrentTime());//打印测试成功！
				//总时间
				var duration = $this.audio.duration;
				//当前时间
				var currentTime = $this.audio.currentTime;

				//返回给我们需要的时间格式(默认格式是秒)
					//调用$this的format方法
				var timeStr = $this.formatDate(currentTime,duration);
				//console.log(timeStr); 打印测试 成功！
				//有bug：1.总时间会出现NAN 2.暂停后再次播放会归零后回到时间！！！！！！！！！
				
				callBack(currentTime,duration,timeStr);
			});
		},
		
		//格式化时间的方法
		formatDate:function(currentTime,duration){
			//计算总时长(和格式)
		var endMin = parseInt( duration /60);
		var endSec = parseInt( duration %60);
		
		if(endMin<10){
			endMin = "0"+endMin;
		}
		if(endSec<10){
			endSec = "0"+endSec;
		}
		
		//计算当前时长(和格式)
		var currentMin = parseInt( currentTime /60);
		var currentSec = parseInt( currentTime %60);
		
		if(currentMin<10){
			currentMin = "0"+currentMin;
		}
		if(currentSec<10){
			currentSec = "0"+currentSec;
		}
		
		return currentMin+":"+currentSec+" / "+endMin+":"+endSec;
		},
		
		//进度条拖拽音乐播放的方法
		musicSeekTo:function(value){
			//console.log(value);
			//发现value会有NaN值 
			if(isNaN(value)) return;//屏蔽掉NaN值 不报错
			
			//把当前时间 = 总时间*比例
			this.audio.currentTime = this.audio.duration*value;
			
		},
		
		//控制音量的进度条
		musicVoiceSeekTo:function(value){
			if(isNaN(value)) return;
			
			if(value<0 || value > 1 ) return;
			//设置音量 volum：取值为0-1
			this.audio.volume = value;
			
		},
		
		//键盘控制音量键方法
		musicVoiceUp:function(){
			this.audio.volume +=0.1;
		},
		
		musicVoiceDown:function(){
			this.audio.volume -=0.1;
		},
		
		//键盘音乐快进后退
		musicMoveOn: function(){
			this.audio.currentTime += 5;
		},
		musicMoveBack: function(){
			this.audio.currentTime -= 5;
		},
		
		//8.单曲循环
		music_single_cycle: function(){
			this.audio.currentTime = 0;
			this.audio.play();
		},
		
		
	
		
		
		
		
	}
	
	//对象初始化 把init的原型转化为player的原型 这样调用player时候就可以默认初始化了，不要单独调用init()了
	Player.prototype.init.prototype = Player.prototype;
	window.Player = Player;
	
	
})(window);



