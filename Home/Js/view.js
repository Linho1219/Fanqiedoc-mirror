$(document).ready(function(){
	//关键词高亮
	var key = parent.$("#key").val();
	if(key!=''){
		var reg=new RegExp(key,'g');
		content.innerHTML = content.innerHTML.replace(reg,"<span class='keyword'>"+key+"</span>");
		var newtitle = parent.$(".title span").html().replace(reg,"<i class='keyword'>"+key+"</i>");
		parent.$(".title span").html(newtitle);
	}
	//图例初始化
	$("h6").each(function(i){
		var imgTitle = $(this).find("img").attr('title');
		if(!imgTitle){imgTitle="图例";}
		$(this).append("<span onclick='lookImg(this)';>"+imgTitle+"</span>");
		//$(this).prevAll('h3').first().append('<a href="javascript:void(0);" title="查看图例" class="showImg" onclick="lookImg(this)";><img src="/../Home/Css/img.gif" width="16" height="14" /></a>');
	});
	//缩放图片
	$("h5").each(function(i){
		var imgObj = $(this).find("img");
		var width = imgObj.attr('width');
		if(width>($(window).width()-20)){
				imgObj.attr('width',"96%");
				imgObj.attr('height','');
		}
		
	});
	
});

//查看图例
function lookImg(obj){
	//imgObj = $(obj).parent().nextAll("h6").first().find("img");
	imgObj = $(obj).prev();
	parent.showImg(imgObj.attr("src"),imgObj.attr("width"),imgObj.attr("height"));
}