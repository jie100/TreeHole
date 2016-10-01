define(['jquery', 'C', 'view'], function ($, C, View) {
	'use strict';

	var Page = View.extend(_.extend({
		/**
		 * 事件及对应的方法
		 */
		events: {
			'click #login': 'login',
			'click #sendCode': 'getCode'
		},

		/* 元素---获取验证码按钮，手机号输入框，验证码输入框 */
		sendCodeEl: $('#sendCode'),
		telEl: $('#tel'),
		codeEl: $('#code'),
		isSendCode: false,
		/**
		 * 初始化数据
		 */
		initialize: function () {
			this.checkMd5();
		},
		/**
		 * 检查全国城市和房产数据的json是否有更新
		 * @param callback
		 */
		checkMd5: function () {
			var self = this;
			$.ajax({
				url: C.Api('MD5'),
				success: function (res) {
					var MD5 = C.Utils.data(C.DK.MD5) || {},
						ADDRESS_CHINA = C.Utils.data(C.DK.ADDRESS_CHINA),
						ADDRESS_HOUSE = C.Utils.data(C.DK.ADDRESS_HOUSE);
					// 全国数据
					if (MD5.chinaMd5 != res.chinaMd5 || !ADDRESS_CHINA) {
						self.reqChina(MD5, res);
					} else {
						self.isLoadChina = true;
					}
					// 城市校验数据
					if (MD5.houseMd5 != res.houseMd5 || !ADDRESS_HOUSE) {
						self.reqHouse(MD5, res);
					} else {
						self.isLoadHouse = true;
					}
				}
			});
		},
		/**
		 * 读取全国省市区信息的json
		 */
		reqChina: function (MD5, data) {
			var self = this;
			$.ajax({
				url: C.Api('ADDRESS_CHINA'),
				success: function (res) {
					self.isLoadChina = true;
					C.Utils.data(C.DK.MD5, $.extend(MD5, {chinaMd5: data.chinaMd5}));
					C.Utils.data(C.DK.ADDRESS_CHINA, res);
				}
			});
		},
		/**
		 * 读取房产校验省市区信息的json
		 */
		reqHouse: function (MD5, data) {
			var self = this;
			$.ajax({
				url: C.Api('ADDRESS_HOUSE'),
				success: function (res) {
					self.isLoadHouse = true;
					C.Utils.data(C.DK.MD5, $.extend(MD5, {houseMd5: data.houseMd5}));
					C.Utils.data(C.DK.ADDRESS_HOUSE, res);
				}
			});
		},
		/**
		 * 立即登录
		 */
		login: function () {
			var self = this;
			//获取手机号码跟验证码，并校验手机号
			C.Validator.element(self.telEl, function () {
				if (!self.isSendCode) {
					C.UI.tip('请先发送验证码');
					return;
				}
				C.Validator.element(self.codeEl, function () {
					C.UI.loading('登录中...');
					$.ajax({
						url: C.Api('PLUGIN_LOGIN'),
						type: 'post',
						data: {
							salesCode: self.codeEl.val(),
							salesPhone: self.telEl.val()
						},
						success: function (res) {
							C.UI.stopLoading();
							if (res.flag == C.Flag.SUCCESS) {
								C.Utils.forward({
									url: 'findOrder.html'
								});
							}
						}
					});
				});
			});
		},

		/* 获取验证码 */
		getCode: function (e) {
			var self = this,
				currEl = $(e.currentTarget);
			if (currEl.hasClass('code-dis')) {
				return;
			}
			C.Validator.element(self.telEl, function () {
				C.UI.loading();
				$.ajax({
					url: C.Api('GET_CODE'),
					type: 'post',
					data: {
						salesPhone: self.telEl.val()
					},
					success: function (res) {
						C.UI.stopLoading();
						if (res.flag == C.Flag.SUCCESS) {
							self.isSendCode = true;
							self.toGet(60, self.sendCodeEl, '重新发送');
						}
					}
				});
			});
		},

		/*
		 * 倒计时方法
		 time:限定的时间；
		 ele:显示时间的元素；
		 tips:时间到了之后的提示（或内容还原）；
		 * */
		toGet: function (time, ele, tips) {
			var self = this;
			ele.addClass('code-dis');
			var t = time;
			(function minius() {
				ele.html(t + 's');
				var timeout = setTimeout(function () {
					--t == 0 ? endTime() : minius();
				}, 1000);
				var endTime = function () {
					clearTimeout(timeout);
					ele.html(tips).removeClass('code-dis');
					self.isSendCode = false;
				};
			})();
		}
	}));

	$(function () {
		new Page({
			el: 'body'
		});
	});
});
