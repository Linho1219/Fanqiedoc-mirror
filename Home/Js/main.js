var keyLen = 0;
$(document).ready(function(){
	//目录树初始化
	var tree = $("nav").thinktree();
	//自适应尺寸
	setTimeout(function(){setSize();},300);
	window.onresize = setSize;
	$(".text").focus(function(e) {
        if($(this).val()=='镜像站上搜索不可用'){ $(this).val(''); $(this).css('color','#333'); }
    });
	$(".text").blur(function(e) {
        if($(this).val()==''){ $(this).val('镜像站上搜索不可用'); $(this).css('color','#ccc'); }
    });
	$(".text").keyup(function(e){
		var keyVal = $(this).val().replace(/(^\s+)|(\s+$)/g, ""); //替换输入法的空格前后
		//$(".title").html(keyVal.charCodeAt(0).toString(16));
		if(keyLen!=keyVal.length){
			if(keyVal==''){
				clearSearch(true);
			}else{
				exeSearch(keyVal);
			}
		}
		keyLen = keyVal.length;
	});
	//初始化导航链接
	$("a[target='main']").each(function(i){
		var obj = $(this);
		obj.attr('data-url',obj.attr('href'));
		obj.attr('href','#'+obj.parent().parent().attr('data-id'));
		obj.removeAttr('target');
		obj.click(function(e) {
            $("#Miframe").attr('src',obj.attr('data-url'));
        });
	});
	//根据URL默认打开单页
	var urlID = window.location.hash.substr(1);
	if(urlID!=''){
		var obj = $("li[data-id='"+urlID+"']");
	}else{
		//默认打开第一个
		var obj = $("li[data-id]").first();
	}
	//展开上级节点
	if(obj.attr('data-upcate')=='true'){
		obj.find('a').parent().parent().parent().parent().find('a').click();
	}
	//模拟点击
	obj.find('a').click();
	
});

//自适应尺寸
function setSize(){
	var height = $(window).height();
	var width = $(window).width();
	$(".side").height(height);
	$("nav").height(height-68);
	$(".main").width(width-275);
	$("#Miframe").height(height-70);
	//示例图片遮罩层
	$("#showImgMask").width(width);
	$("#showImgMask").height(height);
}
	
//清除搜索相关样式等
function clearSearch(openFirst){
	//移除所有样式
	$("nav").removeClass("thinktree-search").find("li.searched").removeClass("searched");
	//收起所有节点
	$(".cate").each(function(i){
		//收起节点
		if($(this).parent().parent().attr("class").indexOf('closed')<0){
			$(this).click();
		}
	});
	//默认打开第一个
	if(openFirst){
		var obj = $("li[data-id]").first();
		if(obj.attr('data-upcate')=='true'){
			obj.find('a').parent().parent().parent().parent().find('a').click();
		}
		obj.find('a').click();
	}
}

function exeSearch(keyVal){
	$.get(searchUrl,{"key":keyVal},function(data){
		if(data==''){
			clearSearch(true);
			$("nav").addClass("thinktree-search");
			return false;
		}
		//移除所有样式
		clearSearch();
		//设置搜索样式
		$("nav").addClass("thinktree-search");
		var tempArr = data.split(',');
		for(var i=0; i<tempArr.length;i++){
			//根据ID获取节点，并设置相应的属性
			var aLiObj = $("li[data-id='"+tempArr[i]+"']");
			aLiObj.addClass("searched");
			//处理上级节点-
			if(aLiObj.attr('data-upcate')=='true'){
				var cateAObj = aLiObj.find('a').parent().parent().parent().parent().find('.cate');
				var cateLiObj = aLiObj.find('a').parent().parent().parent().parent();
				cateLiObj.addClass("searched");
				//未展开节点则展开
				if(cateAObj.parent().parent().attr("class").indexOf('closed')>-1){
					cateAObj.click();
				}
			}
		}
		//默认打开第一个节点
		var aLiObj = $("li[data-id='"+tempArr[0]+"']");
		aLiObj.find('a').click();
	});
}

//自动搜索
function autoSearch(wd){
	$("#key").val(wd);
	$("#key").css('color','#333');
	exeSearch(wd);
}


//查看示例图片
function showImg(src,width,height){
	$("#showImg").html('<img src="'+src+'" width="'+width+'" height="'+height+'" />');
	imgTop = ($("#showImgMask").height()-height)/2;
	imgLeft = ($("#showImgMask").width()-width)/2;
	$("#showImg img").css({'margin-top':imgTop,'margin-left':imgLeft});
	$("#showImgMask").show();
	$("#showImg").show();
}

//隐藏示例图片
function hideImg(){
	$("#showImgMask").hide();
	$("#showImg").hide();	
}