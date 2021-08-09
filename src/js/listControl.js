(function(root){
    function listControl(data,wrap){
        var list = document.createElement('div'),
            dl = document.createElement('dl'),
            dt = document.createElement('dt'),
            close = document.createElement('div'),
            musicList = [];
        list.className = 'list';
        dt.innerHTML = '播放列表';
        close.className = 'close';
        close.innerHTML = '关闭';

        dl.appendChild(dt);
        data.forEach(function(item,index){
            var dd = document.createElement('dd');
            dd.innerHTML = item.name;
            dd.addEventListener('touchend',function(){
                changeSelector(index);
            })
            dl.appendChild(dd)
            musicList.push(dd)
        })
        list.appendChild(dl);
        list.appendChild(close);
        wrap.appendChild(list);
        changeSelector(0); //默认第一首歌

        var disY = list.offsetHeight;
        list.style.transform = 'translateY('+disY+'px)';

        //关闭按钮
        close.addEventListener('touchend',slideDown);

        //列表滑动显示
        function slideUp(){
            list.style.transition = '.2s';
            list.style.transform = 'translate(0)';
        }
        //列表滑动隐藏
        function slideDown(){
            list.style.transition = '.2s';
            list.style.transform = 'translateY('+disY+'px)';
        }

        //切换选中元素
        function changeSelector(index){
            for(var i = 0;i < musicList.length; i++){
                musicList[i].className = '';
            }
            musicList[index].className = 'active';
        }
        return {
            dom: list,
            musicList: musicList,
            slideUp: slideUp,
            slideDown: slideDown,
            changeSelector: changeSelector
        }
    }
    root.listControl = listControl;
})(window.player || (window.player = {}))