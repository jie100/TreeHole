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
            'click .isMarry li,.houseLoanRecord li':'selectResult',
            'click .delPartner':'deletPartner',
            'click #addPartner':'addPartner',
            'click #savePartner':'submit',
            'click #submitPartner':'submit'
        },
        contentEl: $('#content'),
        /**
         * 初始化数据
         */
        initialize: function () {
            this.render();
        },
        getParam:function(){
            var paramArr = [];
            $('.partner').each(function(index){
                var currEl = $(this),
                    curr = currEl.next(),
                    param = {
                        custPartnerName:currEl.find('.custPartnerName').val(),
                        isMarry:currEl.find('.isMarry li.checked').attr('data-code'),
                        custPartnerNationality:currEl.find('.custPartnerNationality span').attr('data-code'),
                        custPartnerCardType:currEl.find('.custPartnerCardType span').attr('data-code'),
                        papersDeadline:currEl.find('.papersDeadline').val()? C.Utils.parseDateFormat(currEl.find('.papersDeadline').val(),'yyyyMMdd'):'',
                        custPartnerCardId:currEl.find('.custPartnerCardId').val(),
                        hkIdCard:currEl.find('.hkIdCard').val(),
                        residenceWarrant:currEl.find('.residenceWarrant').val(),
                        custPartnerPhone:currEl.find('.custPartnerPhone').val(),
                        custPartnerOrg:currEl.find('.custPartnerOrg').val(),
                        custPartnerEarning:currEl.find('.custPartnerEarning').val(),
                        custPartnerStoctEarning:currEl.find('.custPartnerStoctEarning').val(),
                        custPartnerRentEarning:currEl.find('.custPartnerRentEarning').val(),
                        custPartnerOtherEarning:currEl.find('.custPartnerOtherEarning').val(),
                        custPartnerFamilyExpend:currEl.find('.custPartnerFamilyExpend').val(),
                        custPartnerBeDebtExpend:currEl.find('.custPartnerBeDebtExpend').val(),
                        custPartnerHouse:currEl.find('.custPartnerHouse').val(),
                        custPartnerHouseLoan:currEl.find('.custPartnerHouseLoan').val(),
                        houseLoanRecord:currEl.find('.houseLoanRecord li.checked').attr('data-code'),
                    };
                if(param.isMarry == '2'){
                    param.partnerSpouseInfoJsonStr = {
                        custSpouseName:curr.find('.custSpouseName').val(),
                        custSpouseCardId:curr.find('.custSpouseCardId').val(),
                        hkIdCard:curr.find('.spouseHkIdCard').val(),
                        custSpousePhone:curr.find('.custSpousePhone').val(),
                        custSpouseOrg:curr.find('.custSpouseOrg').val(),
                        custSpouseEarning:curr.find('.custSpouseEarning').val(),
                        custSpouseStoctEarning:curr.find('.custSpouseStoctEarning').val(),
                        custSpouseRentEarning:curr.find('.custSpouseRentEarning').val(),
                        custSpouseOtherEarning:curr.find('.custSpouseOtherEarning').val(),
                        residenceWarrant:curr.find('.spouseResidenceWarrant').val(),
                        spousePapersDeadline:curr.find('.spousePapersDeadline').val()? C.Utils.parseDateFormat(curr.find('.spousePapersDeadline').val(),'yyyyMMdd'):null,
                        custSpouseNationality:curr.find('.custSpouseNationality span').attr('data-code'),
                        custSpouseCardType:curr.find('.custSpouseCardType span').attr('data-code')
                    };
                }
                paramArr.push(param);
            });
            console.log(paramArr);
            paramArr = JSON.stringify(paramArr);
            return {
                partnerInfoJsonStr:paramArr,
                salesPhone:110,
                detailType:'2',
                token:'dd001'
            }
        },
        deletPartner:function(e){
            var current = $(e.currentTarget),
                parEl;
            if(_.size($('.partner')) == 2){
                $('.delPartner').hide();
            }
            current.parents('.partner').next('div.info').remove();
            current.parents('.partner').remove();
            parEl = $('.partner');
            parEl.each(function(index){
                $(this).find('.msg').html('共同借款人信息'+(index+1));
                $(this).next('div.info').find('.msgSpouse').html('共同借款人'+(index+1)+'配偶信息');
            });
            if(_.size(parEl) != 10){
                $('#addPartner').parents('.info').show()
            }
        },
        addPartner:function(e){
            var _this=this,
                current = $(e.currentTarget),
                parEl;
            $('.delPartner').show();
            current.parents('.info').before(_.template($('#templ').html())());
            parEl = $('.partner');
            parEl.each(function(index){
                $(this).find('.msg').html('共同借款人信息'+(index+1));
                $(this).next('div.info').find('.msgSpouse').html('共同借款人'+(index+1)+'配偶信息');
            });
            if(_.size(parEl) == 10){
                current.parents('.info').hide();
            }
            $('.custPartnerNationalityUl').html(_this.liHtml(Select['1']))
            $('.partnerSpouseNationalityUl').html(_this.liHtml(Select['1']))
            $('.pattnerCardTypeUl').html(_this.liHtml(Select['2']))
            $('.partnerSpouseCardTypeUl').html(_this.liHtml(Select['2']))
            C.Utils.datePicker('.deadline','-30:+30');
        },
        selectResult:function(e){
            var liEl = $(e.currentTarget),
                liEls = liEl.siblings();
            liEls.removeClass('checked');
            liEl.addClass('checked');
            if(liEl.parents('div.radio').hasClass('isMarry')){
                var spouseEl = liEl.parents('.info').next();
                liEl.attr('data-code') == '2'? spouseEl.show() : spouseEl.hide();
            }
        },
        render: function () {
            var _this = this,
                tmpl,
                products;
            var tmplAjax = $.ajax({
                url: '../_partnerInfo.html', //模板url
                dataType: 'html' //返回类型html
            }).done(function (res) {
                tmpl = res;
            });
            var configAjax = $.ajax({
                type: 'GET',
                url: './data/partnerInfo.json',//ajax url
                dataType: 'json',
                data: {}
            }).done(function (res) {
                _.each(res.data,function(item,index){
                    item.custPartnerNationalityName = item.custPartnerNationality?Select['1'][item.custPartnerNationality]:'';
                    item.custPartnerCardTypeName = item.custPartnerCardType?Select['2'][item.custPartnerCardType]:'';
                    item.papersDeadline = item.papersDeadline?C.Utils.parseDateFormat(item.papersDeadline,'yyyy-MM-dd'):'';
                    if(item.partnerSpouseInfo){
                        item.partnerSpouseInfo.custSpouseNationalityName=item.partnerSpouseInfo.custSpouseNationality?Select['1'][item.partnerSpouseInfo.custSpouseNationality]:'';
                        item.partnerSpouseInfo.custSpouseCardTypeName=item.partnerSpouseInfo.custSpouseCardType?Select['2'][item.partnerSpouseInfo.custSpouseCardType]:'';
                        item.partnerSpouseInfo.spousePapersDeadline = item.partnerSpouseInfo.spousePapersDeadline?C.Utils.parseDateFormat(item.partnerSpouseInfo.spousePapersDeadline,'yyyy-MM-dd'):'';
                    }
                });
                products = res;
            });
            $.when(configAjax, tmplAjax).done(function () {
                _this.contentEl.html(_.template(tmpl)(products));
                $('.custPartnerNationalityUl').html(_this.liHtml(Select['1']))
                $('.partnerSpouseNationalityUl').html(_this.liHtml(Select['1']))
                $('.pattnerCardTypeUl').html(_this.liHtml(Select['2']))
                $('.partnerSpouseCardTypeUl').html(_this.liHtml(Select['2']))
                C.Utils.datePicker('.deadline','-30:+30');
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
