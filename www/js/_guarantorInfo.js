/**
 * Created by EX-ZHONGWEIMING001 on 2016-08-23.
 */
define(['jquery', 'C', 'view', 'js/component/select', 'libs/jquery-ui/jquery-ui-datepicker'], function ($, C, View,Select) {
    'use strict';

    var Page = View.extend(_.extend({
        /**
         * 事件及对应的方法
         */
        events: {
            'click .isMarry li':'selectResult',
            'click .delGuarantor':'deletGuarantor',
            'click #addGuarantor':'addGuarantor'
        },
        contentEl: $('#content'),
        /**
         * 初始化数据
         */
        initialize: function () {
            this.render();
        },
        addGuarantor:function(e){
            var _this=this,
                current = $(e.currentTarget),
                guaEl;
            $('.delGuarantor').show();
            current.parents('.info').before(_.template($('#temp').html())());
            guaEl = $('.guarantor');
            guaEl.each(function(index){
                $(this).find('.msg').html('担保人信息'+(index+1));
            });
            if(_.size(guaEl)==10){
               current.parents('.info').hide();
            }
            $('.custPartnerNationalityUl').html(_this.liHtml(Select['1']));
            $('.custPartnerCardTypeUl').html(_this.liHtml(Select['2']));
            C.Utils.datePicker('.papersDeadline','-30:+30');
        },
        deletGuarantor:function(e){
            var current = $(e.currentTarget),
                guaEl;
            if(_.size($('.guarantor')) == 2){
                $('.delGuarantor').hide();
            }
            current.parents('.guarantor').remove();
            guaEl = $('.guarantor');
            guaEl.each(function(index){
                $(this).find('.msg').html('担保人信息'+(index+1));
            });
            if(_.size(guaEl) != 10){
                $('#addGuarantor').parents('.info').show()
            }
        },
        selectResult:function(e){
            var liEl = $(e.currentTarget),
                liEls = liEl.siblings();
            liEls.removeClass('checked');
            liEl.addClass('checked');
        },
        getParam:function(){
            var paramArr = [];
            $('.guarantor').each(function(index){
                var currEl = $(this),
                    param = {
                        custPartnerName:currEl.find('.custPartnerName').val(),
                        isMarry:currEl.find('.isMarry li.checked').attr('data-code'),
                        custPartnerNationality:currEl.find('.custPartnerNationality span').attr('data-code'),
                        custPartnerCardId:currEl.find('.custPartnerCardId').val(),
                        hkIdCard:currEl.find('.hkIdCard').val(),
                        residenceWarrant:currEl.find('.residenceWarrant').val(),
                        papersDeadline:currEl.find('.papersDeadline').val()? C.Utils.parseDateFormat(currEl.find('.papersDeadline').val(),'yyyyMMdd'):'',
                        custGuarantorPhone:currEl.find('.custGuarantorPhone').val(),
                        custPartnerOrg:currEl.find('.custPartnerOrg').val(),
                        custPartnerEarning:currEl.find('.custPartnerEarning').val(),
                        custPartnerStoctEarning:currEl.find('.custPartnerStoctEarning').val(),
                        custPartnerRentEarning:currEl.find('.custPartnerRentEarning').val(),
                        custPartnerOtherEarning:currEl.find('.custPartnerOtherEarning').val(),
                        custPartnerFamilyExpend:currEl.find('.custPartnerFamilyExpend').val(),
                        custPartnerBeDebtExpend:currEl.find('.custPartnerBeDebtExpend').val()
                    };
                paramArr.push(param);
            });
            paramArr = JSON.stringify(paramArr);
            return paramArr;
            return {
                guarantorInfoJsonStr:paramArr,
                salesPhone:110,
                detailType:'3',
                token:'dd001'
            }
        },
        render: function () {
            var _this = this,
                tmpl,
                products;
            var tmplAjax = $.ajax({
                url: '../_guarantorInfo.html', //模板url
                dataType: 'html' //返回类型html
            }).done(function (res) {
                tmpl = res;
            });
            var configAjax = $.ajax({
                type: 'GET',
                url: './data/guarantorInfo.json',//ajax url
                dataType: 'json',
                data: {}
            }).done(function (res) {
                _.each(res.data,function(item,index){
                    item.custPartnerNationalityName = item.custPartnerNationality?Select['1'][item.custPartnerNationality]:'';
                    item.custPartnerCardTypeName = item.custPartnerCardType?Select['2'][item.custPartnerCardType]:'';
                    item.papersDeadline = item.papersDeadline?C.Utils.parseDateFormat(item.papersDeadline,'yyyy-MM-dd'):'';
                });
                products = res;
            });
            $.when(configAjax, tmplAjax).done(function () {
                _this.contentEl.html(_.template(tmpl)(products));
                $('.custPartnerNationalityUl').html(_this.liHtml(Select['1']));
                $('.custPartnerCardTypeUl').html(_this.liHtml(Select['2']));
                C.Utils.datePicker('.papersDeadline','-30:+30');
            });
        },
        liHtml:function(selectObj){
            var html = '';
            for(var key in selectObj){
                html += '<li data-code="'+key+'">'+selectObj[key]+'</li>';
            }
            return html;
        }
    }));

    return Page;
});
