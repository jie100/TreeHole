define(["jquery",'js/common/utils'], function ($,Utils) {
    var ui = {};
    /**
     * 添加loading方法
     */
    (function ($) {
        $.fn.addLoading = function (text) {
            var width = (this[0] == document.body) ? $(window).width() : this.width();
            var height = (this[0] == document.body) ? $(window).height() : this.height();
            text = text || "请稍候...";
            if (!this.find(".ui-loading")[0]) {
                this.append('<div class="ui-loading" style="display:none;width:' + width + 'px;height:' + height + 'px;' + (this[0] == document.body ? '' : 'position:absolute;') + '"><div  class="ui-loading-mask"></div><div class="ui-loading-img-wrap"><div class="ui-loading-img"><img src="../../images/loading.gif" alt="" /></div><span id="text">' + text + '</span></div></div>');
            }
            var self = this;
            setTimeout(function () {
                if (self.find(".ui-loading")[0])
                    self.find(".ui-loading").fadeIn(100)
            }, 200);
        };
        $.fn.removeLoading = function () {
            if (this.find(".ui-loading")[0]) {
                this.find(".ui-loading").remove();
            }
        };
        $.addLoading = function (text) {
            $(document.body).addLoading(text);
        };
        $.removeLoading = function () {
            $(document.body).removeLoading();
        };
    })($);

    // content 第一行说明
    // content2 第二行说明
    $.extend(ui, {
        loading: function (text) {
            $.addLoading(text);
        },
        stopLoading: function () {
            $.removeLoading();
        },
        error: function (opt) {
            ui.dialog(opt);
        },
        success: function (opt) {
            ui.dialog(opt);
        },
        tip: function (text) {
            ui.dialog({
                content: text,
                btnNum: '0'
            });
        },
        select: function (opt, e) {
            return ui.selectDialog(opt, e);
        },
        timeTimer: null,
        /**
         * 发送手机验证码
         * @param options
         * el 元素 jquery元素
         * attr 添加属性 默认text
         * disClass 失效样式
         */
        sendTimeDown: function (options) {
            var self = this,
                t = options.el,
                setMethodName = options.attr || 'text',
                startTime = new Date().getTime(),
                tipSpeedTime = options.time || 60,
                _time = tipSpeedTime,
                disClass = options.disClass || "sendDisabled";

            clearInterval(self.timeTimer);
            t.addClass(disClass);

            self.timeTimer = setInterval(function () {
                var milliseconds = new Date().getTime() - startTime,
                    seconds = Math.floor(milliseconds / 1000);
                _time = tipSpeedTime - seconds;
                if (_time <= 0) {
                    t[setMethodName]("重新获取").removeClass(disClass);
                    t.removeClass(disClass);
                    clearInterval(self.timeTimer);
                } else {
                    t[setMethodName](_time + "s");
                    _time--;
                }
            }, 1000);
        }
    });

    // 选项框
    ui.selectDialog = function (opt) {
        var selectWrap, optionHtml = '';
        opt = opt || {};
        opt.selectArray = Utils.arrayOfObject(opt.selectArray, opt.type);
        if (!document.getElementById('sel-opt')) {
            selectWrap = document.createElement('ul');
            selectWrap.id = 'sel-opt';
            if (!_.size(opt.selectArray)) {
                return;
            }
            if (opt.selectArray) {
                for (var key in opt.selectArray) {
                    optionHtml += '<li data-code="' + key + '">' + opt.selectArray[key] + '</li>';
                }
                selectWrap.innerHTML =optionHtml;
                $('#'+opt.eleId).next().html(selectWrap);
            }
            var $liTerm = $('#sel-opt').find('li');
            if ($liTerm) {
                $liTerm.on('click', function () {
                    var $target = $(this), code = $target.attr('data-code'), name = $target.text();
                    $target.parents("#sel-opt").remove();
                    opt.callback && opt.callback({
                        html: '<span data-code="' + code + '">' + name + '</span><a href="javascript:;" class="areat icon"></a>',
                        name: name,
                        code: code
                    });
                });
            }
        }
        $(selectWrap).show();
    };

    // 弹出框
    ui.dialog = (function () {
        var okBtn, cancelBtn, wrap, active = false, textHtml;
        return function (opt) {
            if (active) return;
            active = true;
            opt = opt || {};
            // 按钮个数，默认0个 tip
            opt.btnNum = opt.btnNum || '1';
            opt.content = opt.content || '';
            opt.okText = opt.okText || '确定';
            opt.cancelText = opt.cancelText || '取消';
            opt.TD = opt.TD || '';
            if (!document.getElementById('_papc_confirm_box')) {
                wrap = document.createElement('div');
                wrap.id = '_papc_confirm_box';
                wrap.style.display = 'none';
                wrap.style.marginTop = '-203px';
                wrap.className = 'dialog';
                textHtml = '<div class="dialog-body"><div class="order-finish">' +
                '<p class="p">' + opt.content + '</p>';
                if (opt.btnNum == '2') {
                    textHtml += [
                        '<p class="p"></p><div class="btn-box"><div class="btn code-dis" id="_papc_confirm_box_cancel">' + opt.cancelText + '</div>' +
                        '<div class="btn" id="_papc_confirm_box_ok">' + opt.okText + '</div>' +
                        '</div></div></div>'].join('');
                } else {
                    textHtml += (opt.btnNum == '1' ? ('<p class="p"></p><div class="btn-box"><div class="btn" id="_papc_confirm_box_ok">' + opt.okText + '</div></div>') : '' ) + '</div></div>';
                }
                wrap.innerHTML = textHtml;
                document.body.appendChild(wrap);
                okBtn = $('#_papc_confirm_box_ok');
                cancelBtn = $('#_papc_confirm_box_cancel');
                if (okBtn) {
                    okBtn.click(function () {
                        $(wrap).remove();
                        active = false;
                        opt.ok && opt.ok();
                    });
                }
                if (cancelBtn) {
                    cancelBtn.click(function () {
                        $(wrap).remove();
                        active = false;
                        opt.cancel && opt.cancel();
                    });
                }
            }
            $(wrap).show();
            if (opt.btnNum == '0') {
                setTimeout(function () {
                    $(wrap).remove();
                    active = false;
                    opt.auto && opt.auto();
                }, 3000);
            }
        }
    })();
    return window.ui = ui;
});
