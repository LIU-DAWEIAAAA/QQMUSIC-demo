// JavaScript Document


(function(){
	
	
	function Progress($progressBar,$progressLine,$progressDot){
		
		return new Progress.prototype.init($progressBar,$progressLine,$progressDot);
	}
	
	Progress.prototype = {
		constructor:Progress,
		
		musicList:[],
		//必要的参数
		init:function($progressBar,$progressLine,$progressDot){
			
			this.$progressBar = $progressBar;
			this.$progressLine = $progressLine;
			this.$progressDot = $progressDot;
		},
		
		//由于当前有两个第方可以控制进度条，一个是播放时自己不断刷新，一个是拖拽时会控制进度条，所有会产生冲突，所有创造一个新的类来解决
		isMove:false,//默认情况关闭
		
		
		//进度条的点击事件
		progressClick:function(callBack){
			//本质是设置前景高亮白色的宽度和设置小圆点的位置
			console.log("click事件-----------------");
			
			var $this = this;//此时此刻的this是progress
			
			//监听背景的点击(不能拖动)
			this.$progressBar.click(function(event){ //以下的this是progressBar 所以谁调用这个方法，谁就是this
				//获取背景距离窗口默认的位置
				var normalLeft = $(this).offset().left;
				//console.log(normalLeft);
				
				//获取点击的位置距离窗口默认的位置
				var eventLeft = event.pageX;
				//console.log(eventLeft);
				
				//设置前景的宽度
				$this.$progressLine.css("width",eventLeft-normalLeft);
				
				//设置小圆点的位置
				$this.$progressDot.css("left",eventLeft-normalLeft);
				
				//---------------------------------------------------------
				//由此开始设置手动拖拽进度条的方法
				//计算进度条的比例
				var value = (eventLeft-normalLeft)/$(this).width();
				//回调函数
				callBack(value);
			
				$(document).off("mousedown");
				$(document).off("mouseup");
				$(document).off("click");
			});
			
			
		},
		
		//进度条移动事件
		progressMove:function(callBack){
			
			var $this = this;
			//获取背景值的默认距离
			var normalLeft = this.$progressBar.offset().left;
			var eventLeft;
			//获取进度条宽度
			var barWidth = this.$progressBar.width();
			
			
			
			
			//拖拽事件：按下鼠标---鼠标移动---鼠标抬起
			//1.监听鼠标的按下事件
			this.$progressBar.mousedown(function(){
					
					//$(document).off("mouseup");
					
					//正在拖动进度条 （下面自动刷新进度条方法不执行）
					$this.isMove = true;
					
					//获取背景距离窗口默认的位置
					var normalLeft = $(this).offset().left;
				
					//获取点击时间
					firstTime = new Date().getTime();

					//2.监听鼠标的移动事件 (移动事件必须在按下事件中进行)
					//为了使交互更好，所以要在用户界面上都可以拖动 不仅仅局限于进度条范围内
					$(document).mousemove(function(event){

						//获取点击的位置距离窗口默认的位置
						eventLeft = event.pageX;

						//设置进度条的拖拽合法性
						var offset = eventLeft-normalLeft;
						//判断拖拽是否超出宽度
						if(offset >=0 && offset<= barWidth){

							//设置前景的宽度
							$this.$progressLine.css("width",eventLeft-normalLeft);

							//设置小圆点的位置
							$this.$progressDot.css("left",eventLeft-normalLeft);
						}
						
				//3.监听鼠标的抬起事件  //此处产生新问题  click事件会与mouseup事件产生冲突(解决：放在mousemove状态下 最后加上事件$(document).off("mouseup");)	
				$(document).mouseup(function(){
				//就是移除鼠标移动的事件
				$(document).off("mousemove");
				//注意要去css里面修改一下样式 不然拖拽到外部会选中内容 user-select：none；
				
				//抬起鼠标重新改为false
				$this.isMove = false;
					//---------------------------------------------------------
					//由此开始设置手动拖拽进度条的方法
					//计算进度条的比例
					var value = (eventLeft-normalLeft)/$this.$progressBar.width();
					//回调函数
					callBack(value);
					//结束鼠标抬起事件 释放鼠标：不然点击一次界面就会一直重复调用
					$(document).off("mouseup");
				});
					
				});
				console.log("mousemove工具");
				
			});
			
			
			//3.监听鼠标的抬起事件  //此处产生新问题  click事件会与mouseup事件产生冲突
			$(document).mouseup(function(){
			
				
				//就是移除鼠标移动的事件
				$(document).off("mousemove");
				//注意要去css里面修改一下样式 不然拖拽到外部会选中内容 user-select：none；
				
				//抬起鼠标重新改为false
				$this.isMove = false;
					//---------------------------------------------------------
					//由此开始设置手动拖拽进度条的方法
					//计算进度条的比例
					var value = (eventLeft-normalLeft)/$this.$progressBar.width();
					//回调函数
					callBack(value);

			});
			
			
	
		},
		
		
		
		//监听进度条百分比
		setProgress:function(value){
			
			//判断是否存在拖拽行为 
			if(this.isMove) return;//如果正在进行拖拽就不执行自动刷新进度条功能
			
			//不符合需求时
			if(value<0 || value>100) return;
			
			//符合需求时
			//进度条前景高亮部分设置
			this.$progressLine.css({
				
				width:value+"%",
				
			});
			
			//进度条圆点
			this.$progressDot.css({
				
				left:value+"%",
				
			});
		
		}
		
	}
	
		
	//对象初始化 把init的原型转化为player的原型 这样调用player时候就可以默认初始化了，不要单独调用init()了
	Progress.prototype.init.prototype = Progress.prototype;
	window.Progress = Progress;
	
	
})(window);









