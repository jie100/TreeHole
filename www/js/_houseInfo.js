/**
 * Created by EX-ZHONGWEIMING001 on 2016-08-23.
 */
define(['jquery', 'C', 'view','js/component/select', 'libs/jquery-ui/jquery-ui-datepicker'], function ($, C, View,Select) {
    'use strict';

    var Page = View.extend(_.extend({
        /**
         * 事件及对应的方法
         */
        events: {
            'click .spread': 'spread', //收缩
        },
        contentEl: $('#content'),
        
        
        isError:false,//是否报错，false表示没有报错！
        /**
         * 初始化数据
         */
        initialize: function () {
            this.render();
        },
               
        render: function () {
            var _this = this,
                tmpl,
                products;
            var tmplAjax = $.ajax({
                url: '../_houseInfo.html', //模板url
                dataType: 'html' //返回类型html
            }).done(function (res) {
                tmpl = res;                  
                //console.log(tmpl)
            });
            var configAjax = $.ajax({
                type: 'GET',
                url: './data/houseInfo.json',//ajax url
                dataType: 'json',
                data: {}
            }).done(function (res) {
                products = res.data;
                //console.log(products);
            });
            $.when(configAjax, tmplAjax).done(function () {
                _this.contentEl.html(_.template(tmpl)(products));
                
        		//TODO:内容架构加载完以后的操作
        		//开启日期插件
                C.Utils.datePicker('#endDate,#startDate','-40:+40');
                C.Utils.datePicker('#deadline','-0:+100');
                
                //重置省市联动select框的宽度
                $('.w-short').css('width','140px');
                //添加房产所在位置信息（针对上海）
				$('#houseAddressCont').html(_this.liHtml(Select['20']));
                                
                //根据URL参数判断是‘查看’还是‘修改   ’('0'查看，'1'修改)；
                var type=C.Utils.getParameter('type');
                //console.log(type);
                type&&type=='0'?$('.btn-box').hide():$('.btn-box').show();

               	
               	/* input获取焦点与失去焦点动作  */
               	var inputEl=$('input');
               	inputEl.focus(function(){
               		$(this).next('.errortipbox').remove();
               	}).blur(function(){
               		var $this=$(this);
               		var inputName=$(this).attr('name');
               		var inputVal=$(this).val();
               		//console.log('inputName='+inputName+',inputVal='+inputVal);
               		switch(inputName){
               			//物业地址
               			case 'propertyAddress':break;
               			//楼层/总层高
               			case 'floor':
               					//console.log(typeof inputVal);
               					//非空才校验，否则不做任何处理（下同）
               					if(inputVal){
	               					var inp=inputVal.match(/^(\d+)\/(\d+)$/);
	 								inp==null?(function(){
	 									C.Validator.tips($this,'请以"X/Y"格式输入');
	 									_this.isError=true;
	 								})():(function(){
	 									var numerator=parseInt(inp[1]),
	 									denominator=parseInt(inp[2]);
	 									if(denominator<1){
	 										C.Validator.tips($this,'总楼层数不能小于1');
	 										_this.isError=true;
	 									}else if(numerator>denominator){ 											
	 										C.Validator.tips($this,'所选楼层数不得大于总楼层数');
	 										_this.isError=true;
	 									}
	 								})();
               					}
               					break;
               			//物业名称
               			case 'propertyName':break;
               			//物业地址详细地址
               			case 'detailAddress':break;
               			//房产所在位置
               			case 'houseAddress':break;
               			//房产证号
               			case 'houseCardNumber':break;
               			//建筑面积
               			case 'coveredArea':
               					//console.log(typeof inputVal);
               					if(inputVal){
	               					inputVal=Number(inputVal);
	               					if(!isNaN(inputVal)){			
		               					inputVal>=25?false:(function(){
		               						C.Validator.tips($this,'建筑面积不能小于25平米');
		               						_this.isError=true;
		               					})();
	               					}else{
	               						C.Validator.tips($this,'请输入数字');
	               						_this.isError=true;
	               					}
               					}
               					break;
               			//成交价
               			case 'currentRate':break;
               			//新产证总人数
               			case 'totalPeople':
               					//console.log(typeof inputVal);
               					if(inputVal){
	               					var re = /^[0-9]*[1-9][0-9]*$/ ; 
	               					var isInt=re.test(inputVal);	               					
	               					//console.log(isInt);
	               					if(isInt){
	               						inputVal=parseInt(inputVal);
	               						inputVal>=1?false:(function(){
			               					C.Validator.tips($this,'建筑面积不能小于25平米');
			               					_this.isError=true;
			               				})();	               						
	               					}else{
	               						C.Validator.tips($this,'人数必须为正整数');
	               						_this.isError=true;
	               					}
               					}
               					break;
               		}
               	})
            });
        },
        //导入select选项
        liHtml:function(selectObj){
            var html = '';
            for(var key in selectObj){
                html += '<li data-code="'+key+'">'+selectObj[key]+'</li>';
            }
            return html;
        },       
        //整页扫描
        getParam:function(){
        	var _this=this;
        	var obj={
        		data:{
	        		token:1,
	        		salesPhone:$('.user').text(),
	        		detailType:'4',
	        		province:$('#custRegisterProvince span').text(),
	        		city:$('#custRegisterCity span').text(),
	        		county:$('#custRegisterCounty span').text(),
	        		floor:$('input[name=floor]').val(),
	        		propertyName:$('input[name=propertyName]').val(),
	        		detailAddress:$('input[name=detailAddress]').val(),
	        		endDate:$('#endDate').val(),
	        		houseAddress:$('#houseAddress span').text(),
	        		houseCardNumber:$('input[name=houseCardNumber]').val(),
	        		coveredArea:$('input[name=coveredArea]').val(),
	        		currentRate:$('input[name=currentRate]').val(),
	        		totalPeople:$('input[name=totalPeople]').val(),
	        		deadline:C.Utils.parseDateFormat($('#deadline').val(),'yyyyMMdd'),
	        		startDate:$('#startDate').val(),
        		}
        		//isError:false,
        	}; 
        	if(obj.data.endDate&&obj.data.startDate){
	        	if(_this.dateContrast(obj.data.endDate,obj.data.startDate)){
	        		C.Validator.tips($('#startDate'),'使用日期不能大于竣工日期！');
	        		_this.isError=_this.dateContrast(obj.data.endDate,obj.data.startDate);
	        	}
        	}else{
        		obj.startDate=C.Utils.parseDateFormat(obj.startDate,'yyyyMMdd');
        		obj.endDate=C.Utils.parseDateFormat(obj.endDate,'yyyyMMdd');
        	}
        	obj.isError=_this.isError;
        	return obj;
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
    }));
    return Page;
});