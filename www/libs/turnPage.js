//分页插件
/**
2014-08-05 ch
**/
(function($){
	var ms = {
		init:function(obj,args){
			return (function(){
				ms.fillHtml(obj,args);
				ms.bindEvent(obj,args);
			})();
		},
		//填充html
		fillHtml:function(obj,args){
			return (function(){
				obj.empty();
				//上一页
				if(args.current > 1){
					obj.append('<a href="javascrpit:void(0)" class="prevPage"><span class="icon prev"></span></a>');
				}else{
					obj.remove('.prevPage');
					obj.append('<a class="disabled"><span class="icon prev"></span></a>');
				}
				//中间页码
				if(args.current != 1 && args.current >= 4 && args.pageCount != 4){
					obj.append('<a href="javascrpit:void(0)" class="tcdNumber">'+1+'</a>');
				}
				if(args.current-2 > 2 && args.current <= args.pageCount && args.pageCount > 5){
					obj.append('<span class="omit">...</span>');
				}
				var start = args.current -2,end = args.current+2;
				if((start > 1 && args.current < 4)||args.current == 1){
					end++;
				}
				if(args.current > args.pageCount-4 && args.current >= args.pageCount){
					start--;
				}
				for (;start <= end; start++) {
					if(start <= args.pageCount && start >= 1){
						if(start != args.current){
							obj.append('<a href="javascrpit:void(0)" class="tcdNumber">'+ start +'</a>');
						}else{
							obj.append('<a class="curr">'+ start +'</a>');
						}
					}
				}
				if(args.current + 2 < args.pageCount - 1 && args.current >= 1 && args.pageCount > 5){
					obj.append('<span class="omit">...</span>');
				}
				if(args.current != args.pageCount && args.current < args.pageCount -2  && args.pageCount != 4){
					obj.append('<a href="javascrpit:void(0)" class="tcdNumber">'+args.pageCount+'</a>');
				}
				//下一页
				if(args.current < args.pageCount){
					obj.append('<a href="javascrpit:void(0)" class="nextPage"><span class="icon next"></span></a>');
				}else{
					obj.remove('.nextPage');
					obj.append('<a class="disabled"><span class="icon next"></span></a>');
				}
				//跳页
				obj.append('<span class="jump">跳转到 <input type="text" class="jumpNumber"/><a class="go">GO</a></span>');
			})();
		},
		//绑定事件
		bindEvent:function(obj,args){
			return (function(){
				obj.on("click","a.tcdNumber",function(){
					var current = parseInt($(this).text());
					ms.fillHtml(obj,{"current":current,"pageCount":args.pageCount});
					if(typeof(args.backFn)=="function"){
						args.backFn(current);
					}
				});
				//上一页
				obj.on("click","a.prevPage",function(){
					var current = parseInt(obj.children("a.curr").text());
					ms.fillHtml(obj,{"current":current-1,"pageCount":args.pageCount});
					if(typeof(args.backFn)=="function"){
						args.backFn(current-1);
					}
				});
				//下一页
				obj.on("click","a.nextPage",function(){
					var current = parseInt(obj.children("a.curr").text());
					ms.fillHtml(obj,{"current":current+1,"pageCount":args.pageCount});
					if(typeof(args.backFn)=="function"){
						args.backFn(current+1);
					}
				});
				//跳页
				obj.on("click","a.go",function(){
					var current=parseInt(obj.find(".jumpNumber").val());
					//console.log('current='+current+',len='+args.pageCount);
					//判断要跳转的页面是否在总页数里面
					if(current>0&&current<=args.pageCount){
						ms.fillHtml(obj,{"current":current,"pageCount":args.pageCount});
						if(typeof(args.backFn)=="function"){
							args.backFn(current);
						}
					}
				});
			})();
		}
	}
	$.fn.createPage = function(options){
		var args = $.extend({
			pageCount : 10,
			current : 1,
			backFn : function(){}
		},options);
		ms.init(this,args);
	}
})(jQuery);
