(function(root){
    function Index(len){
        this.index = 0;
        this.len = len;
    }
    Index.prototype = {
        //上一首
        prev:function(){
            return this.get(-1);
        },
        //下一首
        next:function(){
            return this.get(1);
        },
        //用来获取索引,参数为+1或-1
        get:function(val){
            this.index = (this.index + this.len + val) % this.len;
            return this.index;
        }
    }
    root.controlIndex = Index; //把构造函数暴露出去，因为实例对象需要传参，所以实例对象不能暴露出去。
})(window.player || (window.player = {}))