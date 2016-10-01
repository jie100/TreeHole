/*!
 * 环境变量，是Common模块的一部分
 * @module env
 * @require js/common/env 根据环境变量返回API
 */
define([
    'jquery',
    "js/common/env",
    "js/common/constant",
], function ($, Env, Constant) {
    var prefix = "",
        // 访问JSON
        envUrl = Env == 'PRODUCTION' ? 'http://txt.pingan.com.cn/static/paem/papc/data/' : 'http://test1-puhui-web.pingan.com.cn:10180/manager/stg/papc/online/mortage/data/';
    switch (Env) {
        case 'DEVELOPMENT' :
            prefix = envUrl = './data/';
            break;
        case 'DEV':
            prefix = 'http://10.20.21.60/';
            break;
        case 'STG1':
            prefix = 'http://test-papc-gs.pingan.com.cn:8080/stg1/';
            break;
        case 'STG2':
            prefix = 'http://test-papc-gs.pingan.com.cn:8080/stg2/';
            break;
        case 'TEST1':
            // 内网能访问的stg1环境
            prefix = 'http://test-papc-gs.pingan.com.cn/stg1/';
            break;
        case 'TEST2':
            // 内网能访问的stg2环境
            prefix = 'http://test-papc-gs.pingan.com.cn/stg2/';
            break;
        default:
            prefix = 'https://papc-gs.pingan.com.cn/';
    }

    var api = Env == "DEVELOPMENT" ? {
        //本地开发环境模拟JSON
        PLUGIN_LOGIN: 'V2/login/umLogin.do',
        TEST: 'test.json',
        GET_LOAN_INFO: 'pc-loan-info.json',
        GET_ORDER_INFO: 'custInfo.json',
        PC_SAVE_LOAN_INFO:'save-loan-info.json',
        PC_SEND_LOAN_INFO:'send-loan-info.json'
    } : {
        PLUGIN_LOGIN: 'gs/salesman/login.do',
        GET_CODE:'gs/salesman/getApplyDynaPassword.do',
        //获取订单信息接口
        GET_ORDER_INFO:'/mortgage-salesman/getOrderDetail.do',
        //保存订单信息接口
        SAVA_ORDER_INFO:'/mortgage-salesman/addOrUpdate.do',
        //提交订单信息接口
        UPLOAD_ORDER_INFO:'/mortgage-salesman/uploadOrder.do',
        //获取贷款信息接口
        GET_LOAN_INFO:'mortgage-salesman/getOrderDetail.do',
        //保存贷款信息接口
        PC_SAVE_LOAN_INFO:'/mortgage-salesman/addOrUpdate.do',
        //提交贷款信息接口
        PC_SEND_LOAN_INFO:'/mortgage-salesman/uploadOrder.do'
    };

    // 只需访问本地数据的接口
    var cApi = {
        // 获取MD5
        MD5: envUrl + 'md5.json',
        //中介公司搜索
        SEARCH_COMPANY: envUrl + 'searchCompany.json',
        // 获取全国城市接口
        ADDRESS_CHINA: envUrl + 'address-china.json',
        // 获取全国城市接口
        ADDRESS_HOUSE: envUrl + 'address-house.json'
    };
    $.extend(api, cApi);

    return function (name) {
        return cApi[name] ? api[name] : prefix + api[name];
    };
});
