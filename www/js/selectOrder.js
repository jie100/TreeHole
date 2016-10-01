define(['jquery', 'C', 'view', 'turnPage', 'libs/jquery-ui/jquery-ui-datepicker'], function ($, C, View, turnPage) {
    'use strict';

    var Page = View.extend(_.extend({
        /**
         * 事件及对应的方法
         */
        events: {
            'click .btn-creat': 'creatNewOrder',
            'click #logout': 'logout',
            'click .opt-detail,.opt-edit': 'jumPage',//查看或修改页面
           	'click .select .selectedCont': 'selectFn', //select选择功能         	
           	'click .btn-seach':'toSearch' ,//搜索查询
           	'click .changeNumber': 'changeNumber',//改变页面显示条数
        },
        /**
         * 初始化数据
         */
        initialize: function () {
        	var $this=this;
        	//开启日期选择插件
            $('#dateSelect').datepicker({
             	dateFormat: "yy-mm-dd",
                changeYear: true,
                yearRange: '-90:+90',
                onClose: function (e) {
                	var currentDate=e;
                    $('#endDate').val(currentDate).datepicker({
                    	dateFormat: "yy-mm-dd",
		                changeYear: true,		         
		                yearRange: '-0:+90',
                        onClose: function (e) {
                            //如果后面的时间早于前面的时间，那么后面的时间等于前面的时间
                            if(!$this.dateContrast(currentDate,e)){
                            	$('#endDate').val(currentDate);
                            }
                        }
                    });
                }
            });
           	//console.log(this.dateContrast('2016-08-09','2016-08-07'));
           	$this.scanForAjax(true);
        },
        //创建新订单
        creatNewOrder: function () {
            C.Utils.forward({
                url: 'creatOrder.html'
            });
        },       
        //select 功能模拟 
        selectFn: function (e) {
            var _this = $(e.currentTarget);
            _this.next().toggle();
            var liTerm = _this.next().find('li');
            liTerm.on('click',function(){
                _this.next().hide();
               var _target = $(this),
                   code = _target.attr('data-code'),
                   name = _target.text();
                _this.html('<span data-code="'+code+'">'+name+'</span>'+'<a href="javascript:;" class="areat2 icon"></a>');
            });
            var $this = $(e.currentTarget);
            this.selectIn($this);
        },
        selectIn: function (selectCont) {
            var selectOptions = selectCont.next();
            selectCont.parents().siblings().click(function () {
                selectOptions.hide();
                selectOptions.find('ul').removeAttr('id');
            });
        },                
        //查看或修改页面
        jumPage: function (e) {
            var type = $(e.currentTarget).attr('data-value'); //URL传参，1表示查看，2表示可编辑
            	//console.log(type);
            C.Utils.forward({
                url: 'creatOrder.html?type=' + type
            });
        },       
        // 退出登录
        logout: function () {
            C.UI.success({
                content: '您真的要退出登录,请确认',
                btnNum: '2',
                ok: function () {
                    //$.ajax({
                    //    url:'',
                    //    type:'post',
                    //    data:{},
                    //    success:function(res){
                    C.Account.logout();
                    C.Utils.forward({
                        url: 'login.html'
                    });
                    //    }
                    //});
                }
            })
        },                
        //日期对比
        dateContrast:function(a, b) {
		    var arr = a.split("-");
		    var starttime = new Date(arr[0], arr[1], arr[2]);
		    var starttimes = starttime.getTime();		
		    var arrs = b.split("-");
		    var lktime = new Date(arrs[0], arrs[1], arrs[2]);
		    var lktimes = lktime.getTime();		
		    if (starttimes >= lktimes) {		
		        //alert('开始时间大于结束时间，请检查');
		        return false;
		    }else{return true;}
		},		
		//搜索订单
        toSearch:function(){
        	this.scanForAjax(true);
        },
        //改变显示条数
        changeNumber:function(e){
        	var type='showNumber';
        	var arg=$(e.currentTarget).attr('data-code');
        	console.log('type='+type+',arg='+arg);        	
        	this.scanForAjax(true,type,arg);
        },
        //翻页
		creatTurnPage:function(totalPage){
			var $this=this;
			$(".page-list").createPage({
		        pageCount:totalPage,  //总页数
		        current:1,	//当前页
		        backFn:function(p){  //p是当前页码
		           	//console.log('p:'+p);
		           	var type='pageNumber',arg=p;
		           	$this.scanForAjax(false,type,arg);
		        }
			});
		},
        /*
        	 扫描参数与后台交互,
        	 creatPage:是否创建分页；
        	 type：改变的类型，修改了 每页显示数 showNumber还是 页数 pageNumber
        	 argument：showNumber 或者 pageNumber 改变后的值
         * */
        scanForAjax:function(creatPage,type,argument){
        	var $this=this,creatP=creatPage;
        	var obj={};
        		obj.token=1;
        		obj.salesPhone=$('.user').text();
	        	obj.salesOrderStatus=$('#salesOrderStatus span').attr('data-code');
	        	obj.salesCreatedTime=C.Utils.parseDateFormat($('#dateSelect').val(),'yyyyMMdd');
	        	obj.salesCreatedTimeEnd=C.Utils.parseDateFormat($('#endDate').val(),'yyyyMMdd');
	        	obj.salesOrderId=$('#salesOrderId').val();
	        	obj.custName=$('#custName').val();
	        	obj.showNumber=$('#showNumber').text();
	        	obj.pageNumber=1;
	        	if(type=='showNumber'){
	        		obj.showNumber=argument;
	        	}else if(type=='pageNumber'){
	        		obj.pageNumber=argument;
	        	};	        	   
        	console.log(obj);
        	$.ajax({
        		type:"post",
				url:"http://10.20.21.60/mortgage-salesman/getOrderList.do",
        		data:obj,
        		success:function(res){
        			if (res.flag == C.Flag.SUCCESS) {
	        			//总页数
	        			var pageN=res.data.totalPageNumber;
	        			var len=res.data.data.length;
	        			console.log('totalPageNumber='+pageN);
	        			console.log('len='+len);
		        			if(len){
			        			//如果允许重新创建分页（非分页本身变化加载进来的时候）则创建分页       			
			        			if(creatP){$this.creatTurnPage(pageN);}
			        			//渲染页面
			        			console.log(res.data);
			        			$('table').html(_.template($('#template').html())(res.data));
			        			$('.page').show();
		        			}else{
		        				$('.page').hide();
		        				$('table').html(_.template($('#empty').html())(res.data));
		        			}
        			}
         		}
        	});
        }
    }));

    $(function () {
        new Page({
            el: 'body'
        });
    });
});