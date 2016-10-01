define(['jquery',"js/common/utils"], function ($,Utils) {
    // 输入框获取焦点时，移除掉p标签（错误提示）
    $("body").off("focus","input").on("focus","input", function(){
        $(this).parents('div.infoBox').next('.errortipbox').remove();
    });
    return {
        // 验证手机号
        mobileNo: function (mobileNo) {
            // 判断非空
            if (!mobileNo) {
                return {result: false, error: "手机号码不能为空"};
            }
            // 判断是否符合规则
            else if (!Utils.RegexMap.MobileNo.test(mobileNo)) {
                return {result: false, error: "手机号码格式错误"};
            }
            return {result: true};
        },
        // 手机验证码
        mobileCode: function (result) {
            if (!result) {
                return {result: false, error: "验证码不能为空"};
            } else if (!Utils.RegexMap.MobileCode.test(result)) {
                return {result: false, error: "请输入6位数字验证码"};
            }
            return {result: true};
        },
        idCard: function (idCard) {
            // 判断非空
            if (!idCard) {
                return {result: false, error: "身份证不能为空"};
            } else if (idCard.length == 15) {
                return {result: false, error: "请输入18位身份证号"};
            }
            else if (!(Utils.RegexMap.idCard.test(idCard) && this.strDateTime(idCard.substr(6, 8)))) {
                return {result: false, error: "身份证格式错误"};
            }
            return {result: true};
        },
        // 检测日期是否有效
        strDateTime: function (str) {
            var r = str.match(/^(\d{1,4})(-|\/)?(\d{1,2})\2(\d{1,2})$/);
            if (r == null)return false;
            var d = new Date(r[1], r[3] - 1, r[4]);
            var now = new Date();
            var minDate = new Date("1900-01-01"), maxDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            // 如果不符合最大当前日期，最小1900年1月1日，则不通过日期校验
            if (d < minDate || d > maxDate) {
                return false;
            }
            return (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]);
        },
        //固定电话
        tel: function (tel) {
            // 判断非空
            if (tel && !Utils.RegexMap.Tel.test(tel)) {
                return {result: false, error: "固定电话格式错误"};
            }
            return {result: true};
        },
        element: function (validatorEl, callback,textEl) {
            var self = this,
                validatorResult = self[validatorEl.attr("name")](validatorEl.val()),
                errorTipbox=validatorEl.parents('div.infoBox').next('.errortipbox');
            if (!validatorEl.is(":hidden") && !validatorResult.result) {
                var validatorElement;
                errorTipbox.length>0?validatorElement='':validatorElement = '<p class="errortipbox" style="color:red;">* ' + validatorResult.error + '</p>';
                textEl?textEl.after(validatorElement):validatorEl.parents('div.infoBox').after(validatorElement);
            } else {
                callback && callback();
            }
        },
        tips:function(ele,tipCont){
   			var tipElement='<p class="errortipbox fl" style="color:red;padding:8px 4px;">* '+ tipCont +'</p>';
   			ele.after(tipElement);
        },
    }
});
