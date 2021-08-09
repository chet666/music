(function($,player){
    function MusicPlayer(dom){
        this.wrap = dom;
        this.dataList = [] //存储请求到的数据
        // this.now = 1;
        this.indexObj = null;
        this.rotateTimer = null;
        this.curIndex = 0;//当前播放歌曲的索引
        this.list = null;//列表切歌对象
        this.progress = player.progress.pro();
    }
    MusicPlayer.prototype = {
        init:function(){
            this.getDom();//获取元素
            this.getData('../mock/data.json');//请求数据
        },
        getDom:function(){
            this.record = document.querySelector('.songImg img'); //旋转图片
            this.controlBtns = document.querySelectorAll('.control li') //底部导航里的按钮
        },
        getData:function(url){
            This = this;
            $.ajax({
                url: url,
                method: 'get',
                success: function(data){
                    This.dataList = data; //存储请求过来的数据
                    This.listPlay(); //列表切歌
                    This.indexObj = new player.controlIndex(data.length); //给索引值对象赋值
                    This.loadMusic(This.indexObj.index); //加载音乐
                    This.musicControl() //添加音乐操作功能
                    This.dragProgress()//添加拖拽进度条
                },
                error:function(){
                    console.log('数据请求失败')
                }
            })
        },
        //加载音乐
        loadMusic:function(index){
            var This = this;
            //渲染图片、歌曲信息...
            player.render(this.dataList[index]);
            player.music.load(this.dataList[index].audioSrc);
            //渲染音乐总时间
            this.progress.renderAllTime(this.dataList[index].duration)
            //播放音乐(只有音乐的状态为play的时候才能播放)
            if(player.music.status == 'play'){
                player.music.play();
                this.controlBtns[2].className = 'pauce';
                this.imgRotate(0); //切歌时旋转唱片
                this.progress.move(0)
            }
            //改变列表里歌曲的选中状态
            this.list.changeSelector(index);
            this.curIndex = index;//存储当前歌曲对应的索引
            player.music.end(function(){
                This.loadMusic(This.indexObj.next());
            })
        },
        //控制音乐
        musicControl:function(){
            var This = this;
            //上一首
            this.controlBtns[1].addEventListener('touchend',function(){
                player.music.status = 'play';
                This.loadMusic(This.indexObj.prev());

            })
            //播放/暂停
            this.controlBtns[2].addEventListener('touchend',function(){
                if(player.music.status == 'play'){
                    player.music.pause();
                    player.music.status = 'pause';
                    this.className = '';
                    This.imgStop();
                    This.progress.stop();
                }else{
                    player.music.play();
                    player.music.status = 'play';
                    this.className = 'pauce';
                    var deg = This.record.dataset.rotate || 0;
                    This.imgRotate(deg);
                    This.progress.move();
                }
            })
            //下一首
            this.controlBtns[3].addEventListener('touchend',function(){
                player.music.status = 'play';
                This.loadMusic(This.indexObj.next());
            })
        },
        //旋转唱片
        imgRotate:function(deg){
            var This = this;
            clearInterval(this.rotateTimer);
            this.rotateTimer = setInterval(function(){
                deg = +deg + 0.2;
                This.record.style.transform = 'rotate('+deg+'deg)';
                This.record.dataset.rotate = deg; //把旋转的角度存到标签身上，为了暂停后继续播放能取到
            },1000/60)
        },
        imgStop:function(){
            clearInterval(this.rotateTimer);
        },
        //列表切歌
        listPlay:function(){
            this.list = player.listControl(this.dataList,this.wrap);
            var This = this;
            //列表按钮点击事件
            this.controlBtns[4].addEventListener('touchend',function(){
                This.list.slideUp();
            })
            //歌曲列表添加事件
            this.list.musicList.forEach(function(item,index){
                item.addEventListener('touchend',function(){
                    //当前歌曲点击无效
                    if(This.curIndex == index){
                        return;
                    }
                    player.music.status = 'play';
                    This.indexObj.index = index;
                    This.loadMusic(index);
                    This.list.slideDown();
                })
            })
        },
        dragProgress:function(){
            var This = this;
            var circle = player.progress.drag(document.querySelector('.circle'));
            circle.init();
            circle.start = function(){
                This.progress.stop();
            }
            circle.move = function(per){
                This.progress.updata(per);
            }
            circle.end = function(per){
                var cutTime = per * This.dataList[This.indexObj.index].duration;
                player.music.playTo(cutTime);
                player.music.play();
                This.progress.move(per);
                This.controlBtns[2].className = 'pauce';
                var deg = This.record.dataset.rotate || 0;
                This.imgRotate(deg);
            }
        }
    }
    var musicPlayer = new MusicPlayer(document.getElementById('wrap'));
    musicPlayer.init();
})(window.Zepto,window.player)