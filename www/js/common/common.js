define([
    "jquery",
    "js/common/utils",
    "js/common/api",
    "js/common/flag",
    "js/common/constant",
    "js/common/ui",
    // 业务库，组装业务功能
    "js/common/account",
    "js/common/init",
    "js/common/validator",
    "libs/jsencrypt"
], function(
    $,
    Utils,
    Api,
    Flag,
    Constant,
    UI,
    Account,
    init,
    Validator,
    jsencrypt
) {

    // Encrypt with the public key...
    var RSAENCRYPT = new JSEncrypt();
    // encrypt.setPublicKey($("#pubkey").val());
    RSAENCRYPT.setPublicKey("-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDwHQU77tsMBNbKnzVd+OZeINs7\nrPgGdV8owrau1Ox9a5axrJ2nak3dDQiD9Zt/UfkckZhqFYhDmzxYOgkYDmoP4fTM\neqIwY4e0m4+WDTF6Ef74tEW2SeNwUVqBtcKD+DGEx9QTaWjOLu+wIw4f4gRuuro2\n7oSctyNJfiJ625C32QIDAQAB\n-----END PUBLIC KEY-----");


    // 判断是否已经登录
    var C = {
        // API
        Api: Api,
        // API
        Flag: Flag,
        // 常量
        Constant: Constant,
        // 工具类
        Utils: Utils,
        UI: UI,
        // 帐户
        Account: Account,
        //本地储存 键名
        DK:Constant.DK,
        Validator: Validator,
        rsaEncrypt: function(text) {
            return RSAENCRYPT.encrypt(text);
        }
    };
    init.apply(this);
    return C;
})
