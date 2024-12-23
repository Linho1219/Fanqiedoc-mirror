+function($){

/**
 * 定义基础内部全局变量
 */
var
    /**
     * ThinkTree 对象
     */
    ThinkTree,

    /**
     * 默认配置项，创建Tree时传入的配置项会和该配置合并
     * @type {Object}
     */
    Defaults = {
        "style"     : "default", //显示风格
        "closed"    : true, //默认是否折叠
        "showline"  : true, //是否显示连接线
        "opreation" : '' //可选值为 checkbox,radio，其他值均不创建操作按钮
    };

/**
 * 添加item图标
 * @param  {string} names 图标名称
 */
function tree_add_icon(names){
    for(i in names){
        this.prepend("<i class=\"tree-icon-" + names[i] + "\"></i>");    
    }
}

/**
 * 构造器，用于创建一个新的ThinkTree对象
 * @param {Object} element 需要创建树的元素
 * @param {Object} options 配置项
 * @param {Object} data    tree数据，可选
 */
ThinkTree = function(element, options, data){
    var options, $tree, self = this, $ele = element;

    /* 合并配置项 */
    options = $.extend({}, Defaults, options || {});

    /* 添加默认样式 */
    $ele.addClass("thinktree thinktree-" + options.style);

    if(data){ //通过JSON数据创建tree
        $ele.empty();

        //TODO: 下一步完成
    } else { //通过已有的结构创建tree
        $tree = $ele.children("ul:first");
        if(!$tree.length) return;

        options.showline && $tree.addClass("thinktree-showline");
        $tree.addClass("thinktree-root").find("li").each(function(){
            var $this = $(this), $child = $this.children();

            /* 折叠元素 */
            options.closed && self.collapse($this);

            /* 添加itme图标 */
            tree_add_icon.call($child.filter("div"), ["item", "switch"]);
        });
    }

    /* 禁止在ie中选中文字 */
    $tree[0].onselectstart = function() {return false};

    /* 绑定展开收起事件 */
    $tree.on("click", "i.tree-icon-switch", function(){
        self.toggle($(this).closest("li"));
    });
    $tree.on("click", "i.tree-icon-item,span", function(){
        self.toggle($(this).closest("li"));
    });
    $tree.on("click", "a", function(){
        self.toggle($(this).closest("li"));
    });

    /* 绑定选择事件 */
    $tree.on("click", "span,a", function(){
        self.active($(this).closest("li"));
    });

    this.tree = $tree;
};

/**
 * 外部调用Api
 * @type {Object}
 */
ThinkTree.prototype = {
    /**
     * 获取所有item
     * @param  {String} expr 用于过滤item的表达式
     * @return {Object}      item对象
     */
    "item" : function(expr){
        var $item;

        switch($.type(expr)){
            case "string": //筛选
                $item = this.tree.find("li").filter(expr);
                break;
            case "undefined": //获取所有item
                $item = this.tree.find("li");
                break;
            default:
                if($.isFunction(expr.is) && expr.is("li")){
                    $item = expr;
                } else {
                    $item = $();
                }
        }

        return $item;
    },

    /**
     * 折叠指定节点
     * @param  {Object} item 节点对象
     * @return {Object}      ThinkTree对象
     */
    "collapse" : function(item){
        this.item(item).has("ul").addClass("closed");
        return this;
    },

    /**
     * 展开指定节点
     * @param  {Object} item 节点对象
     * @return {Object}      ThinkTree对象
     */
    "expand" : function(item){
        this.item(item).has("ul").removeClass("closed");
        return this;
    },

    /**
     * 当节点展开着则收起，当节点收起则展开
     * @param  {Object} item 节点对象
     * @return {Object}      ThinkTree对象
     */
    "toggle" : function(item){
        this.item(item).has("ul").toggleClass("closed");
        return this;
    },

    /**
     * 选定指定的节点
     * @param  {Object} item 节点对象
     * @return {Object}      ThinkTree对象
     */
    "active" : function(item){
        var $item = this.item(item).eq(0), $self;
        //tuweifu 如果是外链，不被选中
		if($item.attr('data-link')=="true"){}else{
			/* 清除当前选定 */
			this.tree.find("li.active").removeClass("active");

			/* 选定节点 */
			$item.addClass('active');

			/* 展开当前节点树 */
			$self = $item.parent();
			while($self.is(":hidden")){
				$self = $self.parent();
				this.expand($self);
			}
		}
        return this;
    }
};

$.fn.thinktree = function(options, data){
    return this.each(function(){ 
        var $self = $(this);
        $self.data("ThinkTree", new ThinkTree($self, options, data));
    });
}

}(jQuery);
