$(document).ready(function() {
	var str = "<div id='put_btn'><input id='time' type='text' value='2016/07/08 18:00:00'/ title='按照这个格式:2016/07/08 18:00:00'>";
	str += '<select id="time_select"><option value="select_null">没有设定值</option><option value="a_min">1分钟后发布</option><option value="a_day">0点发布</option></select>'
	str += "<a id='set_time'>获取时间</a><a id='time_post'>定时发布</a><a id='clear_time'>删除定时</a></div>"
	var message = "<div class='message_box plug_hide'><p id='message' ></p><span class='message_close'>x</span></div>";
	$('#page').append(message);
	var time_box = "<div class='time_box'><p>发布倒计时:</p><p id='time_d'>00</p><p>天</p><p id='time_h'>00</p><p>时</p><p id='time_m'>00</p><p>分</p><p id='time_s'>00</p><p>秒</p></div>";
	$("#v3-header").append(time_box);
	//<a id='nol_post'>发布（插件发布）</a>
	$('.design-navigation-wrap').append(str);
	//	var box = "<div id='will_post' class='plug_hide'><p style='font-size:16px;color:red;'>你确定发布吗？</p><p class='tmall_put_message'></p><a class='fire'>确认发布（插件发布）</a><a class='tmall_put_cancel'>取消</a></div>"
	//	$('#page').append(box);
	//查看默认倒计时是否有值
	var time = localStorage.getItem('time');
	var time_start = new Date().getTime(); //设定当前时间
	var time_end = new Date(time).getTime(); //设定目标时间
	// 计算时间差 
	var time_distance = time_end - time_start;
	if(time_distance < 0) {
		return;
	} else {
		show_time();
	}
});
//显示发布确认框
$(document).on('click', '#put_btn #nol_post', function() {
	$('#will_post').removeClass('plug_hide');
});
//隐藏发布确认框
$(document).on('click', '#will_post .tmall_put_cancel', function() {
	$('#will_post').addClass('plug_hide');
});
//获取当前时间
$(document).on('click', '#set_time', function() {
	var select_time = $('#time_select').val();
	var time = new Date();
	var time_year = time.getFullYear(); //年
	var time_month = time.getMonth() + 1 < 10 ? "0" + (time.getMonth() + 1) : time.getMonth() + 1; //月 月份是从0开始算的
	var time_day = time.getDate() < 10 ? "0" + time.getDate() : time.getDate(); //那一天
	var time_hours = time.getHours() < 10 ? "0" + time.getHours() : time.getHours(); //小时
	var time_min = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes(); //分
	var time_second = time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds(); //秒
	switch(select_time) {
		case 'select_null':
			var str = time_year + "/" + time_month + "/" + time_day + " " + time_hours + ":" + time_min + ":" + time_second;
			break;
		case 'a_min':
			//给一个判断，判断到每个小时的最后一分钟之后的时间不要出现不符合规范的时间值，如13:60:10
			if(time_min == '59') {
				var str = time_year + "/" + time_month + "/" + time_day + " " + (time_hours + 1) + ":" + "0" + ":" + time_second;
			} else {
				var str = time_year + "/" + time_month + "/" + time_day + " " + time_hours + ":" + (time_min + 1) + ":" + time_second;
			}
			break;
		case 'a_day':
			var str = time_year + "/" + time_month + "/" + time_day + " " + "23:59:59";
			break;
	}

	$('#time').val(str);
});

//设置定时发布
$(document).on('click', '#time_post', function() {
	var time = $('#time').val();
	if(time) {
		localStorage.setItem('time', time);
		show_time();
	}
});
//清除定时
$(document).on('click', '#clear_time', function() {
	localStorage.removeItem('time');
});
//插件直接发布 暂时隐藏
$(document).on('click', '#will_post .fire', function() {
	take_post();
});
//
$(document).on('click', '.message_close', function() {
	$('#page .message_box').addClass('plug_hide');
});
//

function show_time() {
	var time = localStorage.getItem('time');
	var time_start = new Date().getTime(); //设定当前时间
	var time_end = new Date(time).getTime(); //设定目标时间
	// 计算时间差 
	var time_distance = time_end - time_start;

	// 天
	var int_day = Math.floor(time_distance / 86400000)
	time_distance -= int_day * 86400000;
	// 时
	var int_hour = Math.floor(time_distance / 3600000)
	time_distance -= int_hour * 3600000;

	// 分
	var int_minute = Math.floor(time_distance / 60000)
	time_distance -= int_minute * 60000;
	// 秒 
	var int_second = Math.floor(time_distance / 1000);
	//判断值
	time_distance = int_day * 86400000 + int_hour * 3600000 + int_minute * 60000 + int_second * 1000;
	//统计秒数
	var time_second = int_hour * 3600 + int_minute * 60 + int_second;

	if(time_distance < 0) {
		$('#page #message').text('时间不对或者已删除定时。');
		$('#page .message_box').removeClass('plug_hide');
		return;
	} else {
		$('#page .message_box').addClass('plug_hide');
	}

	// 时分秒为单数时、前面加零
	if(int_day < 10) {
		int_day = "0" + int_day;
	}
	if(int_hour < 10) {
		int_hour = "0" + int_hour;
	}
	if(int_minute < 10) {
		int_minute = "0" + int_minute;
	}
	if(int_second < 10) {
		int_second = "0" + int_second;
	}
	// 显示时间 
	$("#time_d").text(int_day);
	$("#time_h").text(int_hour);
	$("#time_m").text(int_minute);
	$("#time_s").text(int_second);

	// 设置定时器
	if(Math.floor(time_distance / 1000) > 1) {

	} else if(!localStorage.getItem('time')) {
		return;
	} else {
		take_post();
		return;
	}
	setTimeout("show_time()", 1000);

}

function take_post() {
	//		var sid = $($('#J_TSwitchToOldContent').val()).find('[name="sid"]').attr('value');
	var sid = '382213577';
	//	var tbToken = $($('#J_TSwitchToOldContent').val()).find('[name="_tb_token_"]').attr('value');
	var tbToken = 'e66bde3734ed3';
	var r = {};

	$.ajax({
		type: 'POST',
		url: '/releaseSite.htm',
		data: {
			sid: sid,
			_tb_token_: tbToken
		},
		success: function(result) {
			if(result.indexOf('发布成功') > -1) { //发布成功
				r.message = '发布成功';
				r.isSuccess = true;
				r.errorCode = 0;
				$('#page #message').text(r.message);
				$('#page .message_box').removeClass('plug_hide');
				console.log(r.message);

			} else if(result.indexOf('操作过于频繁') > -1) { // 操作失败,操作过于频繁，请过10秒后再试
				r.message = '操作过于频繁';
				r.isSuccess = false;
				r.errorCode = 3;
				$('#page #message').text(r.message);
				$('#page .message_box').removeClass('plug_hide'); //弹出提示框
				console.log(r.message);
				setTimeout("take_post()", 10000);
				return;
			} else {
				r.message = '返回信息不明';
				r.isSuccess = false;
				r.errorCode = 4;
				console.log('(Important)返回信息不明：', result);
				$('#page #message').text(r.message);
				$('#page .message_box').removeClass('plug_hide');
				console.log(r.message);
			}
		},
		error: function(result) {
			console.log("Error:" + result);
			r.message = '好像网络出错了';
			r.isSuccess = false;
			r.errorCode = 5;
			$('#page #message').text(r.message);
			console.log(r.message);
		}
	});
	$('#will_post').addClass('plug_hide');
}

//Tmall_put_post();

//遍历页面的自定义版块的uir， 通过数组来存储数据，标志是top的位移量
function getModuleUri(width, top) {
	var modules990 = {};
	var modules950 = {};

	var modules790 = {};
	var modules750 = {};

	var modules190 = {};
	var w = parseInt(width) + 2; //这里加2的原因是因为页面上准确的数据是少2的 比如990是988
	var $J_TModule = $('#J_PageToDesign').contents().find('.J_TModule');

	$J_TModule.each(function(i, e) {
		switch($(this).width()) {
			case 990:
				modules990[$(this).offset().top + 'px'] = $(this).attr('data-uri');
				break;
			case 950:
				modules950[$(this).offset().top + 'px'] = $(this).attr('data-uri');
				break;
			case 790:
				modules790[$(this).offset().top + 'px'] = $(this).attr('data-uri');
				break;
			case 750:
				modules750[$(this).offset().top + 'px'] = $(this).attr('data-uri');
				break;
			case 190:
				modules190[$(this).offset().top + 'px'] = $(this).attr('data-uri');
				break;
		}
	});

	switch(w) {
		case 990:
			return modules990[top];
			break;
		case 950:
			return modules950[top];
			break;
		case 790:
			return modules790[top];
			break;
		case 750:
			return modules750[top];
			break;
		case 190:
			return modules190[top];
			break;
	}
}
//跨域函数
function httpRequest(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4) {
			callback(xhr.responseText);
		}
	}
	xhr.send();
}