define([], function () {
    var Utils = {
        RegexMap: {
            //身份证
            idCard: /^\d{15}$|^\d{18}$|^\d{17}(\d|X|x)$/,
            // 手机号码
            MobileNo: /^1[34587]\d{9}$/,
            // 银行卡号（大于或等于16位的数字）
            CardNo: /^\d{16,}$/,
            // 短验证码（6位数字以上）
            MobileCode: /^\d{6,}$/,
            // 交易密码(6-16位数字或字母)
            OrderPassword: /^\S{6,16}$/,
            //千分位正则
            parseThousands: /(\d{1,3})(?=(\d{3})+(?:$|\.))/g,
            //日期格式检测
            parseDateFormat: /\b(\d{4})\b[^\d]+(\d{1,2})\b[^\d]+(\d{1,2})\b(\s(\d{1,2})\:(\d{1,2})\:(\d{1,2}))?[^\d]?/
        },
        RegexReplacement: {
            parseThousands: '$1,'
        },
        /**
         * 日志打印方法
         * @param text 需要打印的日志内容
         */
        logs: function (text) {
            window.console && console.log && console.log(text);
        },
        parseThousands: function (priceVal) {
            return ((priceVal || '0') + '').replace(Utils.RegexMap.parseThousands, Utils.RegexReplacement.parseThousands);
        },
        /**
         *
         * @param obj
         * @returns {Array}
         */
        allKeys:function(obj) {
        if (!_.isObject(obj)) return [];
        var keys = [];
        for (var key in obj) keys.push(key);
        // Ahem, IE < 9.
        //if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
        },
        /**
         * 数组转对象
         * @param array {'090':'n','092':'N'}或[{'k':'n','v':'090'},{'k':'092','v':'N'}]或[2016,2015,2014]
         * @returns {{}} {'090':'n','092':'N'}或{'090':'n','092':'N'}或{2016: 2016, 2015: 2015, 2014: 2014}
         */
        arrayOfObject: function (array, type) {
            var _this = this,
                object = {};
            if (!_.isArray(array)) {
                return array;
            }
            _.each(array, function (item, i) {
                // 不是对象
                if (!_.isObject(item)) {
                    // type为true时，翻转选项框显示顺序。
                    // 小于10，在前加0。日期控件需要
                    object[type ? 10000 - i : item] = item < 10 && item >= 1 ? '0' + item : item;
                } else {
                    if (!isNaN(item[_this.allKeys(item)[0]])) {
                        object[item[_this.allKeys(item)[0]]] = item[_this.allKeys(item)[1]];
                    } else {
                        object[item[_this.allKeys(item)[1]]] = item[_this.allKeys(item)[0]];
                    }
                }
            });
            return object;
        },
        /**
         * 本地数据操作
         * @param key
         * @param value
         */
        data: function (key, value) {
            var _this = this;
            // 处理localStorage兼容
            var copylocalStorage = window.localStorage || {
                    getItem: function (itemKey) {
                        _this._cookie(itemKey);
                    },
                    setItem: function (itemKey, itemValue) {
                        _this._cookie(itemKey, itemValue);
                    },
                    removeItem: function (itemKey) {
                        _this._cookie(itemKey, itemValue, -1);
                    }
                };
            var getItemValue = function () {
                var data = copylocalStorage.getItem(key);
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    Utils.logs(e.message);
                }
                return data;
            };
            if (key && value === undefined) {
                return getItemValue();
            }
            switch (toString.call(value)) {
                case '[object Undefined]':
                    return getItemValue();
                case '[object Null]':
                    copylocalStorage.removeItem(key);
                    break;
                default :
                    copylocalStorage.setItem(key, JSON.stringify(value));
                    break;
            }
        },
        _cookie: function (name, value, hours) {
            if (arguments.length > 1) {
                /**
                 * 设置cookie
                 * @param name
                 * @param value
                 * @param hour
                 */
                var expires = '';
                if (hours) {
                    var date = new Date();
                    date.setTime(date.getTime() + (hours * 24 * 60 * 60 * 1000));
                    expires = "; expires=" + date.toGMTString();
                }

                var _domain = location.host;
                return document.cookie = name + "=" + encodeURI(value) + expires + "; path=/;domain=" + _domain;
            }
            /**
             * 读取Cookie
             * @param name
             * @returns {*}
             */
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0)
                    return c.substring(nameEQ.length, c.length);
            }
            return null;
        },
        /**
         * 公共方法定义
         * @example: http://xxx.com/a.do?productCode=P001
         *     Result:  C.getParameter('productCode')  // 'P001'
         */
        getParameter: function (param) {
            var reg = new RegExp('[&,?,&amp;]' + param + '=([^\\&]*)', 'i');
            var value = reg.exec(decodeURIComponent(decodeURIComponent(location.search)));
            return value ? value[1] : '';
        },
        /**
         * 获取URL参数对象
         * @param url 当无值代表当前页面
         * @example: http://xxx.com/a.do?productCode=P001
         * @returns {{productCode:'P001'}}
         */
        getQueryMap: function (url) {
            var reg_url = /^[^\?]+\?([\w\W]+)$/,
                reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
                arr_url = reg_url.exec(url || location.href),
                ret = {};
            if (arr_url && arr_url[1]) {
                var str_para = arr_url[1], result;
                while ((result = reg_para.exec(str_para)) != null) {
                    ret[result[1]] = result[2];
                }
            }
            return ret;
        },
        /** 转换日期格式
         * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
         * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
         * @param date : 日期格式|String类型 (如：'2012-12-12' | '2012年12月12日' | new Date())
         * @param format : String类型 （如: 'yyyy年MM月dd日'或'yyyy年MM月dd日 hh时mm分ss秒',默认'yyyy-MM-dd'）
         * @example C.Utils.parseDateFormat(new Date(), 'yyyy年MM月dd日') 输出：'2014年04月29日'
         * @example C.Utils.parseDateFormat(new Date()) 输出：'2014-04-29'
         * @exmaple C.Utils.parseDateFormat('2014-05-07 16:09:47','yyyy年MM月dd日 hh时mm分ss秒')
         *          输出：'2014年05月07日 16时09分47秒'
         * @exmaple C.Utils.parseDateFormat('2014-05-07 16:09:47',"yyyy-MM-dd hh:mm:ss.S")
         *          输出：'2014-05-07 16:09:47.0'
         **/
        parseDateFormat: function (str, fmt) {
            if (!str)return str;
            if (!isNaN(str) && String(str).length == 8) {
                str = (str + '').replace(/^(\d{4})(\d{2})(\d{2})$/, '$1/$2/$3');
            }
            var date = typeof str == 'string' ? new Date(str) : str,
                fmt = fmt || 'yyyy年MM月dd日',
                o = {
                    'M+': date.getMonth() + 1, //月份
                    'd+': date.getDate(), //日
                    'h+': date.getHours(), //小时
                    'm+': date.getMinutes(), //分
                    's+': date.getSeconds(), //秒
                    'q+': Math.floor((date.getMonth() + 3) / 3), //季度
                    'S': date.getMilliseconds() //毫秒
                };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
            return fmt;
        },
        /**
         * 日期插件规划：ele 调用的元素id或者class，yearRange，年限时间范围
         */
        datePicker: function (ele, yearRange) {
            $(ele).datepicker({
                dateFormat: "yy-mm-dd",
                changeMonth: false,
                changeYear: true,
                yearRange: yearRange
            });
        },
        /**
         * 跳转页面
         */
        forward: function (opt) {
            var env = this.getParameter('env'),
                url = opt.url || '';
            location.href = url + (env && (url.indexOf('?') > -1 ? '&env=' + env : '?env=' + env));
        },
        /**
         * 转义<>, 页面带出数据时需先调用该方法替换，避免跨站脚本攻击
         * @param  {[type]} str [description]
         * @return {[type]}     [description]
         */
        escape: function (str) {
            return str ? str.toString().replace(/[<]/g, '&lt;').replace(/[>]/g, '&gt;').replace(/\\"/g, '&quot;') : '';
        }
    };
    return Utils;
});
