define([
    "jquery",
    "js/common/utils",
    "js/common/ui",
    "js/common/api",
    "js/common/flag",
    "js/common/constant"
], function ($,
             Utils,
             UI,
             Api,
             Flag,
             Constant) {
    var Account = function () {
    };
    // 登录 退出 是否登录

    Account.prototype = {
        login: function (data, callback) {

        },
        isLogin: function () {
            return !!Utils.data(Constant.DataKey.USER_LOGIN_INFO);
        },
        logout: function () {
            $.each([
                Constant.DataKey.USER_LOGIN_INFO
            ], function (i, item) {
                Utils.data(item, null);
            })
        }
    }
    return new Account();
});
