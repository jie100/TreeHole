define([], function() {
    var getParam = function(param){
        var reg = new RegExp('[&,?,&amp;]' + param + '=([^\\&]*)', 'i'),
            value = reg.exec(decodeURIComponent(decodeURIComponent(location.search)));
        return value ? value[1] : '';
    }
    return getParam('env') || "DEVELOPMENT";
})
