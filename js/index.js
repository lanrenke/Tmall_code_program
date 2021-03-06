/*(c) Copyright 2016 CK. All Rights Reserved. */
$(document).ready(function() {
	var table_width = $('.control_table').width();
	var table_heigth = $('.control_table').height();
	if(table_width > 699) {
		$('#txtContent').css({
			'height': '88%',
			'max-height': '88%'
		});
	} else {
		$('#txtContent').css({
			'height': '78%',
			'max-height': '78%'
		});
	}
	$('.input_data').css('height', table_heigth);
	$('#clear_data').click(function() {
		$('.input_data').find('input').val(' ');
		$('#txtContent').text(' ');
		$('.message').text(' ');
		$('.cpmb-ppt-shouye').text(' ');
	});
	//注入css方便查看产品
	$(document.body).append('<link rel="stylesheet" type="text/css" href="http://lomenck.com/Workprogram/css_box/dp_all.css" />');
});

//添加数据
function add_data() {
	var model = $('#model').val(),
		title = $('#title').val(),
		price = $('#price').val(),
		act_price = $('#act_price').val(),
		imghref = $('#imghref').val(),
		id = $('#id').val(),
		encoding = $('#encoding').val();
	localStorage.setItem('model', model);
	localStorage.setItem('title', title);
	localStorage.setItem('price', price);
	localStorage.setItem('act_price', act_price);
	localStorage.setItem('imghref', imghref);
	localStorage.setItem('id', id);
	localStorage.setItem('encoding', encoding);
	cleardata();
}
//处理数据
function take_code() {
	var title_class = $('#title_class').val();
	var price_title = $('#price_title').val();
	var str = '';
	str += "<li>"
	str += "<div class='cp-test-" + title_class + "'>"
	str += "<p class='type' style='display:none'> " + localStorage.getItem('model') + "</p>"
	str += "<a target='_blank' class='href-img-" + title_class + "'><img src='" + localStorage.getItem('imghref') + "' /></a>"
	str += "<div class='head-title-" + title_class + "'>"
	str += "<a target='_blank'>"
	str += "<p class='title-text-" + title_class + "'>" + localStorage.getItem('title') + "</p>"
	str += "<span class='price-ppt-" + title_class + "'>日销￥" + localStorage.getItem('price') + "</span>"
	str += "<p class='act-price-" + title_class + "'>" + price_title + "<b>￥</b><em>" + localStorage.getItem('act_price') + "</em></p>"
	str += "</a>"
	str += "</div>"
	str += "<div class='left-logo'>"
	str += "<a class='top-logo-" + title_class + "' target='_blank' href=''><img src='' />"
	str += "</a>"
	str += "<p class='cp_encoding'>" + localStorage.getItem('encoding') + "</p>"
	str += "</div>"
	str += "<div class='right-logo'>"
	str += "<a target='_blank' href='https://detail.tmall.com/item.htm?id=" + localStorage.getItem('id') + "' class='kuang' ></a>"
	str += "<a class='tip-ppt-" + title_class + "' target='_blank'></a>"
	str += "</div>"
	str += "</div>"
	str += "</li>"
	put_code(str);

}
//把生成的代码放到隐藏容器
function put_code(e) {
	$(".cpmb-ppt-shouye").append(e);
	post_code();
}
//清空输入框
function cleardata() {
	$('.input_data').find('input').val('');
}

//输入数据
$(document).on('click', '#make_btn', function() {
	takerow_data();
});
//生成代码
function post_code() {
	var data = $(".cpmb-ppt-shouye").html();
	if(data != "") {
		$(".message").text(data); //转换成文本模式，之前还是字符串型
	} else {

	}
}
//导出excel功能
$(document).on('click', '#tabletoexcel', function() {
	var code = $(".message").val();
	$(".table_code").append(code);
	table_make();
});
function getRandom(n) {  
    return Math.floor(Math.random() * n + 1)  
} 
//调用插件
$(document).on('click', '#take_excel', function() {
	var time = new Date();
	var time_year = time.getFullYear(); //年
	var time_month = time.getMonth() + 1; //月 月份是从0开始算的
	var time_day = time.getDate(); //那一天
	var time_hours = time.getHours(); //小时
	var time_min = time.getMinutes(); //分
	var time_second = time.getSeconds(); //秒
	var name = "页面导出数据"+time_year + "." + time_month + "." + time_day + "." + time_hours + "." + time_min + "." + time_second+"."+getRandom(1000);
	$("#table_cell").table2excel({
		exclude: ".noExl",
		name: "Excel Document Name",
		filename: name,
		exclude_img: true,
		exclude_links: true,
		exclude_inputs: true
	});
});
//读取数据 生成table到页面
function table_make() {
	var li_lenght = $(".table_code li").length - 1;
	var reg_price = /-?[1-9]\d*/;
	var str = '<table id="table_cell" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td>型号</td><td>标题</td><td>日销价</td><td>活动价</td><td>图片链接</td><td>链接</td><td>编码</td></tr>';
	for(var i = 0; i <= li_lenght; i++) {
		var li_child = $(".table_code li:eq(" + i + ")");
		var message_type, message_picture, message_title, message_nol_price, message_act_price, message_href, message_encoding;
		message_type = li_child.find('[class="type"]').text();
		message_picture = li_child.find('img:eq(0)').attr('src');
		message_title = li_child.find('div:eq(0)').find('p:eq(1)').text();
		message_nol_price = li_child.find('div:eq(0)').find('span').text();
		message_nol_price = message_nol_price.match(reg_price);
		message_act_price = li_child.find('div:eq(0)').find('p:eq(2)').find('em').text();
		message_href = li_child.find('a:eq(3)').attr('href');
		message_href = message_href.replace(/(.*?)(id|ID)=(.*?)(\&|$)(.*$)?/, function($1, $2, $3, $4, $5, $6) {
			return $4;
		});
		message_encoding = li_child.find('[class="cp_encoding"]').text();
		str += '<tr><td>' + message_type + '</td><td>' + message_title + '</td><td>' + message_nol_price + '</td><td>' + message_act_price + '</td><td>' + message_picture + '</td><td>' + message_href + '</td><td>' + message_encoding + '</td></tr>'
	}
	str += '</tbody></table>'
	$(".table_cell").append(str);
}
//核心处理代码，把table表的数据输入到localstorage
function takerow_data() {
	var data = new Array();
	var y = $('#txtContent table tr').length - 1;
	for(var i = 0; i <= y; i++) {
		$('#txtContent table tr:eq(' + i + ')').find('td').each(function(x) {
			var a = $('#txtContent table tr:eq(' + i + ') td').length - 1;
			data[x] = $(this).text();
			if(x == 'a')
				return false;
		});
		var btn_num = $('.input_data input').length - 1;
		//判断有多个input 来对应放数据
		for(var j = 0; j <= btn_num; j++) {
			$('.input_data input:eq(' + j + ')').val(data[j]);
		}
		add_data();
		take_code();
		data.splice(0, data.length);
	}
}