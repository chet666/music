(function(root){
    function Progress(){
        this.lastPercent = 0;
        this.durTime = 0;
        this.frameId = null;
        this.startTime = 0;
        this.init();
    }
    Progress.prototype = {
        init:function(){
            this.getDom();
        },
        getDom:function(){
            this.curTime = document.querySelector('.curTime');
            this.circle = document.querySelector('.circle');
            this.frontBg = document.querySelector('.frontBg');
            this.backBg = document.querySelector('.backBg');
            this.totalTime = document.querySelector('.totalTime');
        },
        renderAllTime:function(time){
            this.durTime = time;
            time = this.formatTime(time);
            this.totalTime.innerHTML = time;
        },
        formatTime:function(time){
            time = Math.round(time);
            var m = Math.floor(time / 60);
            var s = time % 60;
            m = m<10?'0'+m:m;
            s = s<10?'0'+s:s;
            return m+':'+s;
        },
        //移动进度条
        move:function(per){
            cancelAnimationFrame(this.frameId);
            var This = this;
            this.lastPercent = per===undefined?this.lastPercent:per;
            this.startTime = new Date().getTime();
            function frame(){
                var curTime = new Date().getTime();
                //走的百分比
                var per = This.lastPercent + (curTime - This.startTime) / (This.durTime * 1000);
                if(per<=1){
                    //当前歌曲没有播放完
                    This.updata(per);
                }else{
                    //歌曲已经播放了100%，关掉定时器
                    cancelAnimationFrame(This.frameId);
                }
                This.frameId = requestAnimationFrame(frame);
            }
            frame();
        },
        //更新进度条（时间、走的百分比）
        updata:function(per){
            //左侧时间
            var time = this.formatTime(per * this.durTime)
            this.curTime.innerHTML = time;
            //前背景的位置
            this.frontBg.style.width = per * 100 + '%';
            //原点位置
            var l = per * this.circle.parentNode.offsetWidth;
            this.circle.style.transform = 'translateX('+l+'px)';
        },
        //停止进度条
        stop:function(){
            cancelAnimationFrame(this.frameId);
            var stopTime = new Date().getTime();
            this.lastPercent += (stopTime - this.startTime) / (this.durTime * 1000);
        }
    }
    function instanceProgress(){
        return new Progress();
    }

    function Drag(obj){
        this.obj = obj;
        this.startPointX = 0;//拖拽时按下的坐标位置
        this.startLeft = 0;//按下时已经走的距离
        this.percent = 0;//拖拽百分比
    }
    Drag.prototype = {
        init:function(){
            var This = this;
            this.obj.style.transform = 'translateX(0)';
            this.obj.addEventListener('touchstart',function(ev){
                //触发当前事件的手指列表
                This.startPointX = ev.changedTouches[0].pageX;
                This.startLeft = parseFloat(this.style.transform.split('(')[1]);
                This.start && This.start();//对外暴露拖拽开始的方法
            })
            this.obj.addEventListener('touchmove',function(ev){
                //触发当前事件的手指列表
                This.distPointX = ev.changedTouches[0].pageX - This.startPointX;
                var l = This.startLeft + This.distPointX;
                if(l<0){
                    l=0;
                }else if(l>this.offsetParent.offsetWidth){
                    l = this.offsetParent.offsetWidth;
                }
                this.style.transform = 'translateX('+l+'px)';
                This.percent = l/this.offsetParent.offsetWidth;
                This.move && This.move(This.percent);
                ev.preventDefault()
            })
            this.obj.addEventListener('touchend',function(ev){
                This.end && This.end(This.percent);
            })
        }
    }
    function instanceDrag(obj){
        return new Drag(obj);
    }
    root.progress = {
        pro: instanceProgress,
        drag: instanceDrag
    }
})(window.player || (window.player = {}))