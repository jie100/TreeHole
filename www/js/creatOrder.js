/**
 * Created by EX-ZHONGWEIMING001 on 2016-08-19.
 */
define(['jquery', 'C', 'view', 'js/_custInfo', 'js/_partnerInfo', 'js/_guarantorInfo','js/_houseInfo','js/component/select'], function ($, C, View, CustInfo, PartnerInfo, GuarantorInfo,HouseInfo,Select) {
    'use strict';

    var Page = View.extend(_.extend({
        /**
         * 事件及对应的方法
         */
        events: {
            'click .spread': 'spread',
            'click #logout': 'logout',
            'click #selectInfo li': 'toDetailsInfo',//去详情信息页面
            'click .select .selectedCont': 'selectFn',
            'click #custRegisterProvince':'selectProvince',//选择户籍所在省
            'click #custRegisterCity':'selectCity',//选择户籍所在市
            'click #custRegisterCounty':'selectCounty',//选择户籍所在区
            'click #custOrgProvince':'selectOrgPro',//选择单位所在省
            'click #custOrgCity':'selectOrgCity',//选择单位所在市
            'click #custOrgCounty':'selectOrgCounty',//选择单位所在区
            'click #saveBtn,#submitBtn':'submit'  //保存与提交
        },        
        type:null,
        /**
         * 初始化数据
         */
        initialize: function () {
            var _this = this;
            _this.selectedPCZ = C.Utils.data(C.DK.ADDRESS_CHINA) || {};
            _this.render();
            // 主借款人渲染
            _this.type = new CustInfo({
                el: 'body'
            });
        },
        //选择单位所在省,市,区
        selectOrgPro:function(e){
            var _this = this;
            _this.findProvince('custOrgProvince','custOrgCity','custOrgCounty',e);
        },
        selectOrgCity:function(e){
            var _this = this;
            _this.findCity('custOrgProvince','custOrgCity','custOrgCounty',e);
        },
        selectOrgCounty:function(e){
            var _this = this;
            _this.findCounty('custOrgCity','custOrgCounty',e);
        },
        //选择户籍所在省,市,区
        selectProvince:function(e){
            var _this = this;
            _this.findProvince('custRegisterProvince','custRegisterCity','custRegisterCounty',e);
        },
        selectCity:function(e){
            var _this = this;
            _this.findCity('custRegisterProvince','custRegisterCity','custRegisterCounty',e);
        },
        selectCounty:function(e){
            var _this = this;
            _this.findCounty('custRegisterCity','custRegisterCounty',e);
        },
        //选择省份
        findProvince:function(pro,cit,count,e){
            var _this = this;
            C.UI.select({
                eleId:pro,
                selectArray:_this.selectedPCZ.province,
                callback:function(res){
                    $(e.currentTarget).html(res.html).next().hide();
                    var city = _this.selectedPCZ.city[res.code][0],
                        county = _this.selectedPCZ.zone[city['k']][0];
                    $('#'+cit).html('<span data-code="'+city['k']+'">'+city['v']+'</span><a href="javascript:;" class="areat icon"></a>')
                    $('#'+count).html('<span data-code="'+county['k']+'">'+county['v']+'</span><a href="javascript:;" class="areat icon"></a>')
                    var isShangHai=$('#'+pro).children('span').attr('data-code');
                    //console.log(isShangHai);
                    if(isShangHai=='310000'){
                    	$('dl.houseAddressBox').removeClass('dn');
                    }else{
                    	$('dl.houseAddressBox').addClass('dn');
                    }
                }
            },e);
        },
        //选择市
        findCity:function(pro,cit,count,e){
            var _this = this,
                provinceCode = $('#'+pro).find('span').attr('data-code');
            if(provinceCode){
                C.UI.select({
                    eleId:cit,
                    selectArray:_this.selectedPCZ.city[provinceCode],
                    callback:function(res){
                        $(e.currentTarget).html(res.html).next().hide();
                        var county = _this.selectedPCZ.zone[res.code][0];
                        $('#'+count).html('<span data-code="'+county['k']+'">'+county['v']+'</span><a href="javascript:;" class="areat icon"></a>')
                    }
                },e);
            }
        },
        //选择区
        findCounty:function(cit,count,e){
            var _this = this,
                cityCode = $('#'+cit).find('span').attr('data-code');
            if(cityCode){
                C.UI.select({
                    eleId:count,
                    selectArray:_this.selectedPCZ.zone[cityCode],
                    callback:function(res){
                        $(e.currentTarget).html(res.html).next().hide();
                    }
                },e);
            }
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
        submit:function(e){
            var _this = this,
                data = _this.type.getParam(),
                type = $(e.currentTarget).attr('data-type');
            $.ajax({
                url: C.Api('SAVA_ORDER_INFO'),
                type:'POST',
                data:data,
                success:function(res){
                    if(res.flag == C.Flag.SUCCESS){
                        if(type == 1){
                            C.UI.success({
                                content:'您确定要提交订单吗?',
                                btnNum:'2',
                                ok:function(){
                                    $.ajax({
                                        url: C.Api('UPLOAD_ORDER_INFO') ,
                                        type:'POST',
                                        data:{
                                            salesOrderId:res.data.salesOrderId,
                                            token:'dd001',
                                            salesPhone:110
                                        },
                                        success:function(res){
                                            if(res.flag == C.Flag.SUCCESS){
                                                console.log('提交成功')
                                            }
                                        }
                                    });
                                }
                            });
                        }
                        C.UI.tip('保存成功')
                    }
                }
            });
        },
        render: function () {
        },
        /**
         * 按钮展开与收起
         * @param e
         */
        spread: function (e) {
            var current = $(e.currentTarget),
                type = current.find('span').attr('data-type'),
                infoEl = current.parent().next('div'),
                mark = current.parents('div.info');
            current.find('span').html(type == '1' ? '展开' : '收起');
            type == '1' ? infoEl.hide() : infoEl.show();
            type == '1' ? current.find('span').attr('data-type', 2) : current.find('span').attr('data-type', 1);
            type == '1' ? mark.addClass('spread-info') : mark.removeClass('spread-info');
        },
        toDetailsInfo: function (e) {
        	var _this=this;
            var liEl = $(e.currentTarget),
                liText = liEl.attr('data-type'),
                liEls = liEl.siblings();
            liEls.removeClass('curr');
            liEl.addClass('curr');
            switch (liText) {
                case 'custInfo':
                    _this.type = new CustInfo({
                        el: 'body'
                    });
                    break;
                case 'partnerInfo':
                    _this.type = new PartnerInfo({
                        el: 'body'
                    });
                    break;
                case 'guarantorInfo':
                    _this.type=new GuarantorInfo({
                        el: 'body'
                    });
                    break;
                case 'houseInfo':
                    _this.type=new HouseInfo({
                        el: 'body'
                    });
                    break;
                default :
                    new LoanInfo({});
            }
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
                	_this.html('<span data-code="'+code+'">'+name+'</span>'+'<a href="javascript:;" class="areat icon"></a>');
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
            
        }
    }));

    $(function () {
        new Page({
            el: 'body'
        });
    });
});