/**
 * Created by EX-ZHONGWEIMING001 on 2016-08-23.
 */
define(['jquery', 'C', 'view', 'js/component/select','libs/jquery-ui/jquery-ui-datepicker',], function ($, C, View,Select) {
    'use strict';

    var Page = View.extend(_.extend({
        /**
         * 事件及对应的方法
         */
        events: {
            'click #custGender li,#isMarry li,#isLocalSecurity li,#isChild li,#houseLoanRecord li,#custHireType li':'selectResult'
        },
        contentEl: $('#content'),
        /**
         * 初始化数据
         */
        initialize: function () {
            var _this = this;
            _this.render();
        },
        getParam:function(){
            var $rPro = $('#custRegisterProvince').find('span'),
                $rCity = $('#custRegisterCity').find('span'),
                $rCounty = $('#custRegisterCounty').find('span'),
                rPro = $rPro.attr('data-code')?($rPro.attr('data-code')+'/'+$rPro.text()):'',
                rCity = $rCity.attr('data-code')?($rCity.attr('data-code')+'/'+$rCity.text()):'',
                rCounty = $rCounty.attr('data-code')?($rCounty.attr('data-code')+'/'+$rCounty.text()):'',
                $oPro = $('#custOrgProvince').find('span'),
                $oCity = $('#custOrgCity').find('span'),
                $oCounty = $('#custOrgCounty').find('span'),
                oPro = $oPro.attr('data-code')?($oPro.attr('data-code')+'/'+$oPro.text()):'',
                oCity = $oCity.attr('data-code')?($oCity.attr('data-code')+'/'+$oCity.text()):'',
                oCounty = $oCounty.attr('data-code')?($oCounty.attr('data-code')+'/'+$oCounty.text()):'',
            //主借款人信息
            custInfoJsonStr = {
                custName:$('#custName').val(),
                custGender:$('#custGender').find('li.checked').attr('data-code'),
                custBorn: C.Utils.parseDateFormat($('#custBorn').val(),'yyyyMMdd'),
                custNationality:$('#custNationality').find('span').attr('data-code'),
                custCardType:$('#custCardType').find('span').attr('data-code'),
                papersDeadline:C.Utils.parseDateFormat($('#papersDeadline').val(),'yyyyMMdd'),
                custCardId:$('#custCardId').val(),
                hkIdCard:$('#hkIdCard').val(),
                residenceWarrant:$('#residenceWarrant').val(),
                custPhone:$('#custPhone').val(),
                isMarry:$('#isMarry').find('li.checked').attr('data-code'),
                isLocalSecurity:$('#isLocalSecurity').find('li.checked').attr('data-code'),
                isChild:$('#isChild').find('li.checked').attr('data-code'),
                custRegisterProvince:rPro,
                custRegisterCity:rCity,
                custRegisterCounty:rCounty,
                addressInDetail:$('#addressInDetail').val(),
                custLocalYears:$('#custLocalYears').val(),
                custLocalHouses:$('#custLocalHouses').val(),
                houseLoanRecord:$('#houseLoanRecord').find('li.checked').attr('data-code'),
                unfinishedHouseLoan:$('#unfinishedHouseLoan').val(),
                custHireType:$('#custHireType').find('li.checked').attr('data-code'),
                custOrg:$('#custOrg').val(),
                custOrgProvince:oPro,
                custOrgCity:oCity,
                custOrgCounty:oCounty,
                custOrgAddress:$('#custOrgAddress').val(),
                custOrgPhone:$('#custOrgPhone').val(),
                custOrgGuild:$('#custOrgGuild').find('span').attr('data-code'),
                custJob:$('#custJob').find('span').attr('data-code'),
                custEarning:$('#custEarning').val(),
                custStoctEarning:$('#custStoctEarning').val(),
                custRentEarning:$('#custRentEarning').val(),
                custOtherEarning:$('#custOtherEarning').val(),
                custFamilyExpend:$('#custFamilyExpend').val(),
                custBeDebtExpend:$('#custBeDebtExpend').val(),
                businessManagementFee:$('#businessManagementFee').val()
            };
            //配偶信息
            if(custInfoJsonStr.isMarry == '2'){
                custInfoJsonStr.custSpouseInfoJsonStr = {
                    custSpouseName : $('#custSpouseName').val(),
                    custSpouseNationality : $('#custSpouseNationality').find('span').attr('data-code'),
                    custSpouseCardType : $('#custSpouseCardType').find('span').attr('data-code'),
                    spousePapersDeadline : C.Utils.parseDateFormat($('#spousePapersDeadline').val(),'yyyyMMdd'),
                    custSpouseCardId : $('#custSpouseCardId').val(),
                    hkIdCard : $('#spouseHkIdCard').val(),
                    residenceWarrant : $('#spouseResidenceWarrant').val(),
                    custSpousePhone : $('#custSpousePhone').val(),
                    custSpouseOrg : $('#custSpouseOrg').val(),
                    custSpouseEarning : $('#custSpouseEarning').val(),
                    custSpouseStoctEarning : $('#custSpouseStoctEarning').val(),
                    custSpouseRentEarning : $('#custSpouseRentEarning').val(),
                    custSpouseOtherEarning : $('#custSpouseOtherEarning').val()
                };
            }
            custInfoJsonStr = JSON.stringify(custInfoJsonStr);
            return {
                custInfoJsonStr:custInfoJsonStr,
                salesPhone:110,
                detailType:'1',
                token:'dd001'
            };
        },
        selectResult:function(e){
            var liEl = $(e.currentTarget),
                liEls = liEl.siblings();
            liEls.removeClass('checked');
            liEl.addClass('checked');
            if(liEl.parents('div.radio').attr('id') == 'isMarry' ){
                var spouseEl = $('#spouseInfo');
                liEl.attr('data-code') == '2'? spouseEl.show() : spouseEl.hide();
            }
        },
        render: function () {
            var _this = this,
                tmpl,
                products;
            var tmplAjax = $.ajax({
                url: '../_custInfo.html', //模板url
                dataType: 'html' //返回类型html
            }).done(function (res) {
                tmpl = res;
            });
            var configAjax = $.ajax({
                type: 'GET',
                url:C.Api('GET_ORDER_INFO'),//'./data/custInfo.json',
                dataType: 'json',
                data: {
                    'salesPhone':110,
                    'salesOrderId':'QD201608302358',
                    'token':'dd001',
                    'detailType':1
                    }
            }).done(function (res) {
                if(!_.size(res.data)){
                    res.data = {
                        "addressInDetail": null,
                        "businessManagementFee": null,
                        "custBeDebtExpend": null,
                        "custBorn": null,
                        "custCardId": null,
                        "custCardType": null,
                        "custEarning": null,
                        "custFamilyExpend": null,
                        "custGender": null,
                        "custHireType": null,
                        "custJob": null,
                        "custLocalHouses": null,
                        "custLocalYears": null,
                        "custName": null,
                        "custNationality": null,
                        "custOrg": null,
                        "custOrgAddress": null,
                        "custOrgCity": null,
                        "custOrgCounty": null,
                        "custOrgGuild": null,
                        "custOrgPhone": null,
                        "custOrgProvince": null,
                        "custOtherEarning": null,
                        "custPhone": null,
                        "custRegisterCity": null,
                        "custRegisterCounty": null,
                        "custRegisterProvince": null,
                        "custRentEarning": null,
                        "custSpouseInfo": null,
                        "custStoctEarning": null,
                        "custTotalEarning": null,
                        "hasSpouse": null,
                        "hkIdCard": null,
                        "houseLoanNum": null,
                        "houseLoanRecord": null,
                        "isChild": null,
                        "isLocalSecurity": null,
                        "isLongTerm": null,
                        "isMarry": null,
                        "isPartner": null,
                        "isPingan": null,
                        "papersDeadline": null,
                        "residenceWarrant": null,
                        "unfinishedHouseLoan": null
                    }
                }
                var rPro = res.data.custRegisterProvince?res.data.custRegisterProvince.split('/'):[],
                    rCity = res.data.custRegisterCity?res.data.custRegisterCity.split('/'):[],
                    rCounty = res.data.custRegisterCounty?res.data.custRegisterCounty.split('/'):[],
                    oPro = res.data.custOrgProvince?res.data.custOrgProvince.split('/'):[],
                    oCity = res.data.custOrgCity?res.data.custOrgCity.split('/'):[],
                    oCounty = res.data.custOrgCounty?res.data.custOrgCounty.split('/'):[];
                res.data.rProCode = rPro[0];
                res.data.rProName = rPro[1];
                res.data.rCityCode = rCity[0];
                res.data.rCityName = rCity[1];
                res.data.rCountyCode = rCounty[0];
                res.data.rCountyName = rCounty[1];
                res.data.oProCode = oPro[0];
                res.data.oProName = oPro[1];
                res.data.oCityCode = oCity[0];
                res.data.oCityName = oCity[1];
                res.data.oCountyCode = oCounty[0];
                res.data.oCountyName = oCounty[1];
                res.data.custBorn = res.data.custBorn?C.Utils.parseDateFormat(res.data.custBorn,'yyyy-MM-dd'):'';
                res.data.papersDeadline = res.data.papersDeadline?C.Utils.parseDateFormat(res.data.papersDeadline,'yyyy-MM-dd'):'';
                res.data.custOrgGuildName = res.data.custOrgGuild?Select['7'][res.data.custOrgGuild]:'';
                res.data.custJobName = res.data.custJob?Select['8'][res.data.custJob]:'';
                res.data.custCardTypeName = res.data.custCardType?Select['2'][res.data.custCardType]:'';
                res.data.custNationalityName = res.data.custNationality?Select['1'][res.data.custNationality]:'';
                if(res.data.custSpouseInfo){
                    res.data.custSpouseInfo.custSpouseNationalityName = res.data.custSpouseInfo.custSpouseNationality?Select['1'][res.data.custSpouseInfo.custSpouseNationality]:'';
                    res.data.custSpouseInfo.custSpouseCardTypeName = res.data.custSpouseInfo.custSpouseCardType?Select['2'][res.data.custSpouseInfo.custSpouseCardType]:'';
                    res.data.custSpouseInfo.spousePapersDeadline = res.data.custSpouseInfo.spousePapersDeadline? C.Utils.parseDateFormat(res.data.custSpouseInfo.spousePapersDeadline,'yyyy-MM-dd'):'';
                }
                products = res.data;
            });
            $.when(configAjax, tmplAjax).done(function () {
                _this.contentEl.html(_.template(tmpl)(products));
                $('.w-short').css('width','116px');
                $('#custNationalityUl').html(_this.liHtml(Select['1']));
                $('#custCardTypeUl').html(_this.liHtml(Select['2']));
                $('#custJobUl').html(_this.liHtml(Select['8']));
                $('#custOrgGuildUl').html(_this.liHtml(Select['7']));
                $('#custSpouseNationalityUl').html(_this.liHtml(Select['1']));
                $('#custSpouseCardTypeUl').html(_this.liHtml(Select['2']));
                C.Utils.datePicker('#custBorn','-90:+0');
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
