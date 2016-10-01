define(['jquery', 'C', 'view'], function ($, C, View) {
    'use strict';

    var Page = View.extend(_.extend({
        /**
         * 元素
         */
        loanTem: _.template($('#loanTem').html()),//贷款模板
        complateOrderTem: _.template($('#complateOrderTem').html()),//完成订单弹出模板
        complateSaveTem:_.template($('#complateSaveTem').html()), //完成保存弹出模板
        loanInfo: $('#loanInfo'),
        complateOrder: $('#complateOrder'),
        select: $('.select-option li'),//还款方式选项
        /**
         * 还款方式
         */
        repaySelectBusiness: { //商贷还款方式
            "1": "等额本金",
            "2": "等息本金",
            "7": "等本双周供",
            "8": "等额双周供"
        },
        repaySelectFunding: { //公积金还款方式
            "1": "等额本金",
            "2": "等息本金"
        },
        /**
         * 事件及对应的方法
         */
        events: {
            'click .sub,.save': 'subOrfer', // 点击保存或者提交订单
            'click .select-option li': 'choosePayment',// 选择还款方式
            'click .radio li': 'chooseLoanWay',// 选择贷款方案
            'mouseenter .select': 'optionShow',  // 鼠标进入展示选项
            'blur .businessLoanDeadline': 'regLoanDeadline', //校验商贷期限
            'focus .businessLoanDeadline': 'focusLoanDeadline' //商贷期限聚焦
        },
        /**
         * 初始化数据
         */
        initialize: function () {
            var self = this;
            self.render();
        },
        //页面初始化
      /*  render: function () {
            var self = this, initData = {};
            $.ajax({
                url: C.Api('GET_LOAN_INFO'),
                type: 'get',
                data: {
                    salesOrderId: 'QD201608302358',
                    salesPhone: '110',
                    token: 'dd001',
                    detailType: '5',
                },
                success: function (res) {
                    if (res && res.flag == 1) {
                        initData.isGroup = res.data.isGroup || '';
                        initData.businessLoanFigure = res.data.businessLoanFigure || '';
                        initData.houseFundingFigure = res.data.houseFundingFigure || '';
                        initData.businessLoanDeadline = res.data.businessLoanDeadline || '';
                        initData.houseFundingDeadline = res.data.houseFundingDeadline ? res.data.houseFundingDeadline : '';
                        initData.custHouseFundingId = res.data.custHouseFundingId || '';
                        initData.repaymentCommercial = res.data.repaymentCommercial || '';
                        initData.repaymentCommercialName = self.repaySelectBusiness[res.data.repaymentCommercial] || '';
                        initData.repaymentFund = res.data.repaymentFund || '';
                        initData.repaymentFundName = self.repaySelectFunding[res.data.repaymentFund] || '';
                        //initData.hasSoupse = res.data.hasSoupse;
                        initData.spouseHouseFundingId = res.data.spouseHouseFundingId || '';
                        self.loanInfo.html(self.loanTem(initData));
                        if (initData.isGroup == '2') {
                            $('#fund').hide();
                        }
                    }
                }
            })
        },*/
        render: function () {
            var _this = this,
                tmpl;
            var tmplAjax = $.ajax({
                url: '../_loanInfo.html', //模板url
                dataType: 'html' //返回类型html
            }).done(function (res) {
                tmpl = res;
            });
            var configAjax = $.ajax({
                type: 'GET',
                url:C.Api('GET_LOAN_INFO'),//'./data/pc-loan-info.json',
                dataType: 'json',
                data: {
                    salesOrderId: 'QD201608302358',
                    salesPhone: '110',
                    token: 'dd001',
                    detailType: '5'
                }
            }).done(function (res) {
                if(!_.size(res.data)){
                    res.data = {
                        "isGroup":null,
                        "businessLoanFigure":null,
                        "houseFundingFigure":null,
                        "businessLoanDeadline":null,
                        "houseFundingDeadline":null,
                        "custHouseFundingId":null,
                        "repaymentCommercial":null,
                        "repaymentFund":null,
                        "spouseHouseFundingId":null
                    }
                }
              var initData = {};
                initData.isGroup = res.data.isGroup;
                initData.businessLoanFigure = res.data.businessLoanFigure;
                initData.houseFundingFigure = res.data.houseFundingFigure;
                initData.businessLoanDeadline = res.data.businessLoanDeadline;
                initData.houseFundingDeadline = res.data.houseFundingDeadline ;
                initData.custHouseFundingId = res.data.custHouseFundingId;
                initData.repaymentCommercial = res.data.repaymentCommercial;
                initData.repaymentCommercialName = _this.repaySelectBusiness[res.data.repaymentCommercial];
                initData.repaymentFund = res.data.repaymentFund || '';
                initData.repaymentFundName = _this.repaySelectFunding[res.data.repaymentFund];
                initData.spouseHouseFundingId = res.data.spouseHouseFundingId;
            });
            $.when(configAjax, tmplAjax).done(function () {
                _this.contentEl.html(_.template(tmpl)(initData));
            });
        },
        liHtml:function(selectObj){
            var html = '';
            for(var key in selectObj){
                html += '<li data-code="'+key+'">'+selectObj[key]+'</li>';
            }
            return html;
        },
        // 选择贷款方案
        chooseLoanWay: function (e) {
            var el = $(e.currentTarget);
            el.attr('data-code') == '1' ? $('#fund').show() : $('#fund').hide();
            el.addClass('checked').siblings('li').removeClass('checked');
        },
        //选择还款方式
        choosePayment: function (e) {
            var el = $(e.currentTarget), spanEl = el.parents('div .mul-line').find('span');
            spanEl.text(el.text()).attr('data-code', el.attr('data-code')).removeClass('gray');
            el.parents('ul').find('li').hide();
        },
        // 鼠标进入展示选项
        optionShow: function (e) {
            var el = $(e.currentTarget);
            el.find('li').show();
        },
        // 校验商贷期限
        regLoanDeadline:function(e){
            var el = $(e.currentTarget);
            if(el.val() > 360){
                $('.tip').show();
            }
        },
        //商贷期限聚焦
        focusLoanDeadline: function () {
            $('.tip').hide();
        },
        // 去掉空格
        deleteSpace: function (currVal) {
            return (currVal + '').replace(/\s/g, '')
        },
        // 点击订单提交按钮
        subOrfer: function (e) {
            var self = this,
                subEl = $(e.currentTarget),
            // 是否为组合贷款 1:是 2:否
                isGroup = $('#choose').find('li.checked').attr('data-code') || '',
            // 商贷金额
                figureMoney = $('.businessLoanFigure').val(),
            // 公积金贷款金额
                fundMoney = $('.houseFundingFigure').val(),
            // 商贷期限
                figureDate = $('.businessLoanDeadline').val(),
            // 公积金贷款期限
                houseFundingDeadline = $('.houseFundingDeadline').attr('data-code') || '',
            // 主借款人公积金账号
                custFundingId = $('.custHouseFundingId').val() || '',
            // 配偶公积金账号
                spouseFundingId = $('.spouseCard').val() || '',
            // 商贷还款方式
                repaymentCommercial = $('.repaymentCommercial').attr('data-code'),
            // 公积金还款方式
                repaymentFund = $('.repaymentFund').attr('data-code');
            // 非组合贷款入数
            var paramFigure = {
                    isGroup: isGroup,
                    businessLoanFigure: figureMoney,
                    businessLoanDeadline: this.deleteSpace(figureDate),
                    repaymentCommercial: repaymentCommercial,
                },
            // 组合贷款入参
                paramGroup = $.extend(true, {
                    houseFundingFigure: fundMoney,
                    houseFundingDeadline: houseFundingDeadline,
                    custHouseFundingId: this.deleteSpace(custFundingId),
                    spouseHouseFundingId: this.deleteSpace(spouseFundingId),
                    repaymentFund: repaymentFund
                }, paramFigure);
            var resParam = isGroup == '1' ? paramGroup : paramFigure;
            //先请求保存接口
            $.ajax({
                url: C.Api('PC_SAVE_LOAN_INFO'),
                type: 'get',
                data: {
                    salesOrderId: 'QD201608302358',
                    salesPhone: '110',
                    token: 'dd001',
                    detailType: '5',
                    loanInfoJsonStr: JSON.stringify(resParam)
                },
                success: function (res) {
                    if (res && res.flag == 1) {
                        if (subEl.text() == '提交订单') {
                            $.ajax({
                                url: C.Api('PC_SEND_LOAN_INFO'),
                                type: 'get',
                                data: {
                                    salesOrderId:res.data.salesOrderId,
                                    token: 'dd001',
                                    salesPhone: '110'
                                },
                                success: function (resParam) {
                                    if (resParam && resParam.flag == 1) {
                                        self.complateOrder.html(self.complateOrderTem(resParam.data));
                                        $('#complateOrder').show();
                                        $('.close').click(function () {
                                            C.Utils.forward({url: 'selectOrder.html'})
                                        });
                                    }
                                }
                            })
                        }
                        self.complateOrder.html(self.complateSaveTem(res.data));
                        $('#complateOrder').show();
                        $('.close').click(function () {
                           $('#complateOrder').hide();
                        });
                    }
                }
            })
        }
    }));
    return Page;
});