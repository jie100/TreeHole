/**
 * 创建人 by xiaochaofeng090 on 16/8/20.
 */
define(['jquery', 'C', 'view', 'libs/jquery-ui/jquery-ui-datepicker'], function ($, C, View) {
    'use strict';

    var Page = View.extend(_.extend({
        /**
         * 事件及对应的方法
         */
        events: {
            'click #timeDown': 'timeDown'
        },
        /**
         * 初始化数据
         */
        initialize: function () {
            $('#date').val(C.Utils.parseDateFormat(new Date(),'yyyy-MM-dd')).datepicker({
                changeMonth: true,
                changeYear: true,
                yearRange : '-40:+40'
            });
            this.render();
        },
        render: function () {
            $.ajax({
                url: C.Api('TEST'),
                type: 'get',
                data: {},
                dataType: 'json',
                success: function (res) {
                    $('#ajax').html(JSON.stringify(res));
                }
            })
        },
        timeDown: function (e) {
            var $el = $(e.currentTarget);
            if (!$el.hasClass('disable')) {
                C.UI.sendTimeDown({
                    el: $el,
                    time: 120,
                    disClass: 'disable'
                });
            }
        }
    }));

    $(function () {
        new Page({
            el: 'body'
        });
    });
});
