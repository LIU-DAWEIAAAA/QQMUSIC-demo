// JavaScript Document
$(function(){
	
	
	//利用外部模块自定义滚动条
	//0.给自己的类定义
	$(".content_list").mCustomScrollbar();
	
	//设置变量
	var $audio = $("audio");
	var player = new Player($audio);
	//歌曲进度条
	var progress;
	//声音进度条
	var voiceProgress
	//歌词信息
	var lyric;
	
	
	//1.首先加载歌曲列表
	getPlayerList();
	function getPlayerList(){
		$.ajax({
			//注意！！！！！！！！！！！！
			//个人练习时候可以使用：chrome 浏览器版本在49以后都需要使用 open -a Google\ Chrome: --args --disable-web-security --user-data-dir 这个命令来实现跨域。
			//企业开发不推荐，请去学习服务器的“跨域”知识
			
			url:"./source/musiclist.json",
			dataType:"json",
			success:function(data){
				player.musicList = data;
				
				//遍历获取到的数据，创造每一首歌曲
				var $musicList = $(".content_list ul");
				$.each(data,function(index,ele){
					var $item = createMusicItem(index,ele);
					$musicList.append($item);
				});
				
				//加载完歌曲列表就要初始化歌曲信息
				//默认加载第1首歌曲信息
				initMusicInfo(data[0]);
				
				//加载歌词信息
				initMusicLyric(data[0]);
				
			},
			error:function(e){
				//打印错误内容
				console.log(e);
				console.log("2");
			}
		});	
	}
	
	//2.初始化歌曲信息
	function initMusicInfo(music){
		//1.获取对应元素
		//右侧界面歌曲信息
		var $musicImage = $(".song_info_pic img");
		var $musicName = $(".song_info_name a");
		var $musicSinger = $(".song_info_singer a");
		var $musicAlbum = $(".song_info_album a");
		
		//底部进度条歌曲信息
		var $musicProgressName = $(".music_progress_name");
		var $musicProgressTime = $(".music_progress_time");
		
		//背景图片信息
		var $musicBg = $(".mask_bg");
		
		//顶部title的播放歌名
		var $musicTitle = $(".MusicTitle");
		
		//2.给对应元素赋值
		$musicImage.attr("src",music.cover);
		$musicName.text(music.name);
		$musicSinger.text(music.singer);
		$musicAlbum.text(music.album);
		$musicProgressName.text(music.name+" / "+music.singer);
		$musicProgressTime.text("00:00 / "+music.time);
		$musicBg.css("background","url( '"+music.cover+"')");
		$musicTitle.text("QQ音乐："+music.name+" / "+music.singer);
		
	}
	
	//3.初始化歌词信息
	
	function initMusicLyric(music){
		lyric = new Lyric(music.link_lrc); 
		var $lyricContainer = $(".song_lyric");
		
		//清空上一首音乐歌词
		$lyricContainer.html("");
		
		lyric.loadLyric(function(){
			//创建歌词列表(遍历创建)
			$.each(lyric.lyrics,function(index,ele){
				var $item = $("<li>"+ele+"</li>");
				$lyricContainer.append($item);
				
			});
			
		});
		
	}
	
	
	//3.初始化进度条
		initProgress();
		function initProgress(){
			//进度条变量
			var $progressBar = $(".music_progress_bar")
			var $progressLine = $(".music_progress_line")
			var $progressDot = $(".music_progress_dot")
			
			console.log("进度条初始化");
			
			
			progress = Progress($progressBar,$progressLine,$progressDot);
			//点击进度条事件
			progress.progressClick(function(value){

				player.musicSeekTo(value);
				console.log("1");
				
			});
			
			
			//拖拽进度条事件
			progress.progressMove(function(value){
				
				player.musicSeekTo(value);
				//初始歌词
				
				console.log("2");
				
			});
			
			
			
			//--------------------------设置音量进度条
			//音量进度条变量
			var $voiceBar = $(".music_voice_bar");
			var $voiceLine = $(".music_voice_line");
			var $voiceDot = $(".music_voice_dot");

			voiceProgress = Progress($voiceBar,$voiceLine,$voiceDot);
			//点击声音进度条事件
			voiceProgress.progressClick(function(value){

				player.musicVoiceSeekTo(value);
			});

			//拖拽声音进度条事件
			voiceProgress.progressMove(function(value){
				player.musicVoiceSeekTo(value);
				if(value >0 ){
					//增加事件 拖拽进度条使静音失效
					$(".music_voice_icon").removeClass("music_voice_icon2");
				}
			});
			
		}
	
	
	//将监听事件都整合到一个功能里面
	//2.初始化事件监听
	initEvents();
	function initEvents(){
		
		//1.监听歌曲的移入移出事件
		//动态创建的列表需要事件委托
		$(".content_list").delegate(".list_music","mouseenter",function(){
			//显示子菜单
			//一般找元素用find
			$(this).find(".list_menu").stop().fadeIn(100);
			$(this).find(".list_time a").stop().fadeIn(100);
			//隐藏时长
			$(this).find(".list_time span").stop().fadeOut(100);

		});

		$(".content_list").delegate(".list_music","mouseleave",function(){
			//隐藏子菜单
			$(this).find(".list_menu").stop().fadeOut(100);
			$(this).find(".list_time a").stop().fadeOut(100);
			//显示时长
			$(this).find(".list_time span").stop().fadeIn(100);

		});

		//注释直接添加的代码
		/*$(".list_music").hover(function(){
			//显示子菜单
			//一般找元素用find
			$(this).find(".list_menu").stop().fadeIn(100);
			$(this).find(".list_time a").stop().fadeIn(100);
			//隐藏时长
			$(this).find(".list_time span").stop().fadeOut(100);
		},function(){
			//隐藏子菜单
			$(this).find(".list_menu").stop().fadeOut(100);
			$(this).find(".list_time a").stop().fadeOut(100);
			//显示时长
			$(this).find(".list_time span").stop().fadeIn(100);
		});
		*/

		//2.监听复选框的点击事件
		//动态添加：事件委托
		$(".content_list").delegate(".list_check","click",function(){
			$(this).toggleClass("list_checked");
		});
		
		$(".content_list_title .list_title").delegate(".list_check","click",function(){
			$(this).toggleClass("list_checked");
		});

		/*//测试直接添加
		$(".list_check").click(function(){
			$(this).toggleClass("list_checked");

		});*/

		

		//3.添加子菜单播放按钮的监听
		var $musicPlay = $(".music_play");
		$(".content_list").delegate(".list_menu_play","click",function(){
			//优化代码
			var $item = $(this).parents(".list_music");
			
			/*//拿到原生的存放歌曲信息的li 打印出来！
			console.log($item.get(0).index);
			console.log($item.get(0).music);*/
			
			//3.1切换播放的图标
			$(this).toggleClass("list_menu_play2");
			//3.2复原其他播放的图标
			$item.siblings().find(".list_menu_play").removeClass("list_menu_play2");

			//3.3同步底部的播放按钮
			//判断当前点击的按钮是否包含所选类名
			if($(this).attr("class").indexOf("list_menu_play2") != -1){
				//包含
				//当前子菜单播放按钮是播放的状态
				$musicPlay.addClass("music_play2");
				//让文字高亮
				$item.find("div").css("color","#fff");
				$item.siblings().find("div").css("color","rgba(255,255,255,0.5)");

			}else{
				//当前子菜单按钮不是播放状态
				$musicPlay.removeClass("music_play2");
				//让文字不高亮
				$item.find("div").css("color","rgba(255,255,255,0.5)");

			}

			//3.4切换序号的状态
			$(this).parents(".list_music").find(".list_number").toggleClass("list_number2");
			$(this).parents(".list_music").siblings().find(".list_number").removeClass("list_number2");
			
			//3.5播放音乐
			player.playMusic($item.get(0).index,$item.get(0).music);
			
			//3.6切换歌曲信息(见第二步)
			initMusicInfo($item.get(0).music);
			
			//3.7切换歌词信息
			initMusicLyric($item.get(0).music);
			
					
		});
		
		//4.监听底部控制区域播放按钮的点击
		$musicPlay.click(function(){
			//判断有没有播放过音乐
			if(player.currentIndex == -1){
				//没有播放过音乐
				$(".list_music").eq(0).find(".list_menu_play").trigger("click");
				
			}else{
				//已经播放过音乐
				$(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
			}
			
		});
		
		//一般情况:下一首就是currentIndex+1 上一首就是currentIndex-1
		//特殊情况：第一首的上一首就是最后一首  最后一首的下一首就是第一首
		//5.监听底部控制区域上一首按钮的点击
		$(".music_pre").click(function(){
			$(".list_music").eq(player.preIndex()).find(".list_menu_play").trigger("click");
			
		});
		
		//6.监听底部控制区域下一首按钮的点击
		$(".music_next").click(function(){
			$(".list_music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");
			
		});
		
		//7监听删除按钮的点击
		$(".content_list").delegate(".list_menu_del","click",function(){
			//删除一个是从界面上删除  后台的music[]也要删除
			//找到被点击的音乐
			var $item = $(this).parents(".list_music");
			
			//还要判断删除的音乐是否为当前播放的 如果当前正在播放应该立即停止 并且自动切换播放到下一首
			if($item.get(0).index == player.currentIndex){
					//当前删的是播放的
					//等于点击一下：下一首
					$(".music_next").trigger("click");
				
			}
			
			//设置删除的函数
			$item.remove();
			player.changeMusic($item.get(0).index);
			
			
			//进行重新排序
			//1.歌曲的序号需要重新排序   2.后面原生的li里面的索引也要重新排序
			$(".list_music").each(function(index,ele){
				//当前变量的li的索引 改成最新的index
				ele.index = index;
				//把对应的number改一改
				$(ele).find(".list_number").text(index+1);
				
			});
		});
		
		musicTimeUD();
		function musicTimeUD(){
		//8.监听播放的进度
		player.musicTimeUpdate(function(currentTime,duration,timeStr){
			
			//1.同步时间
			$(".music_progress_time").text(timeStr);
			
			//2.同步进度条
			//计算播放的比例
			var value = currentTime/duration * 100;
			//在进度条类里面新增一个方法
			
			progress.setProgress(value);//同步进度条的位置！！！！！！！-----所以暂停时也要同步一下
			
			//实现歌词的同步
			var index = lyric.currentIndex(currentTime);
			//找到歌词容器，将当前索引歌词标位高亮
			var $item = $(".song_lyric li").eq(index);
			$item.addClass("cur");
			$item.siblings().removeClass("cur");
			
			//设置歌词滚动
			//滚动ul
			if(index<= 2) return; //此时ul会向上滚 但是是整个向上 所以需要去结构中增加一个范围div
			$(".song_lyric_container .song_lyric").css({
				marginTop:(-index+2)*30,
				
			});
			$(".only_song_lyric .song_lyric").css({
					marginTop:(-index+3)*60,
			});
			
		});
			};
		
		//9.监听声音按钮的点击
		$(".music_voice_icon").click(function(){
			//更改图标
			$(this).toggleClass("music_voice_icon2");
			//音量进度条变量
			//高亮范围
			var $voiceLine = $(".music_voice_bar .music_voice_line");
			//圆点位置
			var $voiceDot = $(".music_voice_line .music_voice_dot");
			//声音的切换
			if($(this).attr("class").indexOf("music_voice_icon2") != -1){
				//变为没有声音
				player.musicVoiceSeekTo(0);
				$voiceLine.css("width","0");
				$voiceDot.css("left","0");
				//$(this).addClass("music_voice_icon2");
				console.log("1");
				
			}
			else //if($(this).attr("class").indexOf("music_voice_icon2"))
			{
				//变为有声音
				player.musicVoiceSeekTo(1);
				$voiceLine.css("width","70");
				$voiceDot.css("left","70px");
				//$(this).removeClass("music_voice_icon2");
				console.log("2");
			}
			
		});
		
		//10.喜欢按钮点击事件
		$(".music_fav").click(function(){
			//判断当前歌曲喜欢状态
			$(this).toggleClass("music_fav2");
		
		});
		
		//11.点击纯净模式标签切换
		$(".music_only").click(function(){
			$(this).toggleClass("music_only2");
			$(".content_in").toggleClass('content_in_hide');
			$(".content_only_in").toggleClass('content_only_in2');
			
			//监听播放进度 同步歌词
			player.musicTimeUpdate(function(currentTime,duration,timeStr){
				//实现歌词的同步
				var index = lyric.currentIndex(currentTime);
				//找到歌词容器，将当前索引歌词标位高亮
				var $item = $(".only_song_lyric .song_lyric li").eq(index);
				$item.addClass("cur");
				$item.siblings().removeClass("cur");

				//设置歌词滚动
				//滚动ul
				if(index<= 2) return; //此时ul会向上滚 但是是整个向上 所以需要去结构中增加一个范围div
				$(".only_song_lyric .song_lyric").css({
					marginTop:(-index+3)*60,
				});
			});
			
		});
		
		//12空格点击播放暂停
		$(document).keydown(function(e){
			var e = e || window.event; //Space（空格键）	32
			if(e.keyCode == 32){
					//判断有没有播放过音乐
				if(player.currentIndex == -1){
					//没有播放过音乐
					$(".list_music").eq(0).find(".list_menu_play").trigger("click");

				}else{
					//已经播放过音乐
					$(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
				}
			}
		});
		
		//13上下键控制音量
		$(document).keydown(function(e){
			var e = e || window.event;
			if(e.keyCode == 38){
				var width = $(".music_voice_line").width();
				if(width >= 70) return;
				width += 7;
				player.musicVoiceUp();//player里面增加函数
				$(".music_voice_line").css("width",width);
				$(".music_voice_dot").css("left",width);
			}
			if(e.keyCode == 40){
				var width = $(".music_voice_line").width();
				if(width <= 0) return;
				width -= 7;
				player.musicVoiceDown();
				$(".music_voice_line").css("width",width);
				$(".music_voice_dot").css("left",width);
			}
		});
		
		//14左右键控制进度条移动
		$(document).keydown(function(e){
			var e = e || window.event;
			if(e.keyCode == 37){
				player.musicMoveBack();
			}
			if(e.keyCode == 39){
				player.musicMoveOn();
			}
		});
		
		//15清除列表点击事件
		var clear_btn = $(".content_toolbar").find(".clear_musicList");
		clear_btn.click(function(){
			$(".content_list").remove();
		});

		//16全选按钮点击事件
		var check_all = $(".content_list_title .list_title .list_check");
		check_all.click(function(){
			//全选
			var $select_all = $(".list_music .list_check");
			$select_all.addClass("list_checked");
			
			if(check_all.attr("class").indexOf("list_checked") != -1){
				//全不选
				$select_all.removeClass("list_checked");
				
			}
		});
		
		//17顶部菜单栏的删除按钮点击事件
		$(".delete_music").click(function(){
			
			//删除一个是从界面上删除  后台的music[]也要删除
			//找到被选中的音乐
			var selected = $(".list_checked").parents(".list_music");
			//获取选中音乐的删除事件
			var del_select = selected.find(".list_menu_del");

			//还要判断删除的音乐是否为当前播放的 如果当前正在播放应该立即停止 并且自动切换播放到下一首
			//此处等于同时点击删除选中的歌曲
			//console.log(selected.length);
			for(var i=0;i<selected.length;i++){
				//判断是否有选中的歌
				if(selected.get(i).index==player.currentIndex){
					//当前删的是播放的
					//等于点击一下：下一首
					$(".music_next").trigger("click");
				}
				//删除对应索引的歌曲信息
				selected.get(i).remove();
				//歌曲列表删除
				player.changeMusic(selected.get(i).index);
			}
			
			
			//重新排序
			$(".list_music").each(function(index,ele){
				ele.index = index;
				$(ele).find(".list_number").text(index+1);
			});
			
		});
		
		//18音乐播放模式切换
		$(".music_mode").click(function(){
			if($(this).attr("class") == "music_mode"){
				$(this).removeClass("music_mode").addClass("music_mode2");
			}else if($(this).attr("class") == "music_mode2"){
				$(this).removeClass("music_mode2").addClass("music_mode3");
			}else if($(this).attr("class") == "music_mode3"){
				$(this).removeClass("music_mode3").addClass("music_mode4");
			}else if($(this).attr("class") == "music_mode4"){
				$(this).removeClass("music_mode4").addClass("music_mode");
			}
		});
		//播放模式方法
		player.musicTimeUpdate(function(currentTime,duration,timeStr){
				//循环播放
				if($("#MODE").attr("class") == "music_mode"){
					if(currentTime == duration){
						$(".list_music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");
					}
				}
				//顺序播放
				if($("#MODE").attr("class") == "music_mode2"){
					if(currentTime == duration){
						//最后一首不循环获取当前索引与列表最后一首比较
						var Cycleindex = player.currentIndex+1;
						//暂停播放
						if(Cycleindex<player.musicList.length)
							{
								$(".list_music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");
							}
					}
				}
				//随机播放
				if($("#MODE").attr("class") == "music_mode3"){
					if(currentTime == duration){
						var random = parseInt(Math.round(Math.random()*(player.musicList.length-1)));
						$(".list_music").eq(random).find(".list_menu_play").trigger("click");
						// console.log(random);
					}
				}
				//单曲循环
				if($("#MODE").attr("class") == "music_mode4"){
					if(currentTime == duration){
						player.music_single_cycle();
					}
				}
		});
		
		
	}

	
	//定义一个方法创建一个音乐(注意格式)
	function createMusicItem(index,music){
		var $item = $("<li class=\"list_music\">\n"+
							"<div class=\"list_check\"><i></i></div>\n"+
							"<div class=\"list_number\">"+(index+1)+"</div>\n"+
							"<div class=\"list_name\">"+music.name+"\n"+
								"<div class=\"list_menu\">\n"+
									"<a href=\"javascript:;\" title=\"播放\" class=\"list_menu_play\"></a>\n"+
									"<a href=\"javascript:;\" title=\"添加\"></a>\n"+
									"<a href=\"javascript:;\" title=\"下载\"></a>\n"+
									"<a href=\"javascript:;\" title=\"分享\"></a>\n"+
								"</div>\n"+
							"</div>\n"+
							"<div class=\"list_singer\">"+music.singer+"</div>\n"+
							"<div class=\"list_time\">\n"+
								"<span>"+music.time+"</span>\n"+
								"<a href=\"javascript:;\" title=\"删除\" class=\"list_menu_del\"></a>\n"+
							"</div>\n"+
						"</li>");
		
		//拿到原生的li
		//把每次传进来的对应的索引和音乐都绑定到原生的里上面
		$item.get(0).index = index;
		$item.get(0).music = music;
		
		return $item;
	}
	
	
	
	
	
	
	
	
});