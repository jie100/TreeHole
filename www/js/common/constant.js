define([
	"js/common/flag"
	], function(
		Flag
	) {

    var Constant = {
    	Flag:Flag,
    	DK:{
            // 用户登录数据
            USER_LOGIN_INFO:"WEB_USER_LOGIN_INFO",
			//MD5
			MD5: 'PAPC_MD5',
			// 全国数据 china
			ADDRESS_CHINA: 'PAPC_ADDRESS_CHINA',
			// 房产信息地区数据
			ADDRESS_HOUSE: 'PAPC_ADDRESS_HOUSE'
    	}
    };
    return Constant;
});
