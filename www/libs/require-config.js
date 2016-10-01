(function () {
    var map, ts, env;
    try {
        var getParameter = function (param) {
            var reg = new RegExp('[&,?]' + param + '=([^\\&]*)', 'i');
            var value = reg.exec(location.search);
            return value ? value[1] : '';
        };
        var debug = getParameter("DEBUG");
        ts = _WEB.env == 'DEVELOPMENT' ? (new Date()).getTime() : _WEB.ts;
        if (debug) {
            map = {
                "*": {
                    "js": "src/js"
                }
            }
        }
    } catch (e) {
    }
    requirejs.config({
        urlArgs: "v=" + ts,
        baseUrl: "",
        map: map,
        paths: {
            // jquery
            C: 'js/common/common',
            jquery: 'libs/jquery-1.11.1.min',
            "jquery-ui": 'libs/jquery-ui/jquery-ui.min',
            // underscore
            underscore: 'libs/underscore-min',
            view: 'js/common/view',
            turnPage:'libs/turnPage'
            
        },
        shim: {
        	'turnPage': {
                deps: ['jquery'],
                exports: '$'
            },
            'jquery-ui': {
                deps: ['jquery'],
                exports: '$'
            },
        }
    });
})();
