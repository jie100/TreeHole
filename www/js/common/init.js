define([
    "jquery",
    "js/common/flag",
    "js/common/constant",
    "js/common/utils",
    "js/common/ui",
    "js/common/account",
    "js/common/api",
], function ($,
             Flag,
             Constant,
             Utils,
             UI,
             account,
             Api) {

    return function () {
        window.onerror = function (msg, url, line, column) {
            console.error('msg:' + msg + '<br>url:' + url + ',line:' + line + ',line:' + line + ',column:' + column);
        };

        $.ajaxSettings.cache = false;
        // 超时 20000ms
        $.ajaxSettings.timeout = 20000;
        $.ajaxSettings.type = 'GET';
        $.ajaxSettings.dataType = 'json';
        $.ajaxSettings.dataFilter = function (data, type) {
            //过滤JSON格式,参数带有<>进行转义
            return type.toLowerCase() == "json" ? Utils.escape(data) : data;
        };
        $.ajaxSettings.beforeSend = function (xhr, settings) {
            var paramObject = {_: Date.now()},
                loginInfo = Utils.data(Constant.DK.USER_LOGIN_INFO);
            if (loginInfo) {
                paramObject["accountId"] = loginInfo.accountId;
                paramObject["token"] = loginInfo.token;
            }
            if (settings.url.indexOf("?") != -1) {
                settings.url += ("&" + $.param(paramObject));
            } else {
                settings.url += ("?" + $.param(paramObject));
            }
        };
        $.ajaxSettings.error = function(xhr){
            UI.stopLoading();
            UI.error({
                content: '系统繁忙，请稍候再试',
                ok:function(){
                    location.href=location.href;
                }
            });
        };
        $.ajaxSettings.complete = function (xhr, settings) {
            try {
                var res = eval('(' + xhr.responseText + ')');
                // 登录超时的时候跳转到登录页
                if (res.flag == Flag.LOGIN_TIMEOUT || res.flag == Flag.ERROR) {
                    account.logout();
                    Utils.forwrad({
                        url: "login.html?redirectURL=" + encodeURIComponent(location.href)
                    });
                } else {
                    if (res.flag && res.flag != Flag.SUCCESS) {
                        var code = res.flag;
                        // 集合内的code值不提示
                        var whiteCode = [""];

                        if (res.msg && ($.inArray(code, whiteCode) == -1)) {
                            UI.error({
                                content: res.msg
                            });
                        }
                    }
                }
            } catch (e) {
            }
        };
    }
});
