<template>
  <div class="player">
    <div class="bg">
      <img style="width:100%;height:100%;" :src="currentMusicItem.cover" />
      <div class="img-mask"></div>
    </div>
    <Header>
      <div class="title">{{currentMusicItem.title}}</div>
      <div class="artist">{{currentMusicItem.artist}}</div>
    </Header>
    <div class="middle">
      <div :class="this.isPlay?`cover`:`cover stop`">
        <img :src="currentMusicItem.cover" />
      </div>
    </div>
    <Footer>
       <ul class="footer-wrapper">
         <li>
           <span :class="this.repeat=='cycle'?`icon repeat-cycle`:(this.repeat=='once'?`icon repeat-once`:`icon repeat-random`)" @click="changeRepeat"></span>
         </li>
         <li>
           <span class="icon prev" @click="playPrev()"></span>
         </li>
         <li>
           <span :class="this.isPlay?`icon pause bigger`:`icon play bigger`" @click="play()"></span>
         </li>
         <li>
           <span class="icon next" @click="playNext"></span>
         </li>
         <li>
           <span class="list" @click="changeListShow"></span>
         </li>
       </ul>
    </Footer>
    
    <div class="middle-bottom">
      <div class="time">{{Atime}}</div>
      <progress-bar :progress="progress" @progressChange="progressChangeHandler" />
      <div class="duration">{{Aduration}}</div>
    </div>

    <List :listShow="listShow" @closeList="changeListShow" />
    <div v-show="listShow" @click="changeListShow" class="list-mask"></div>
  </div>
</template>

<script>
import progressBar from '@/components/progress';
import List from '@/views/List';
import { MUSIC_LIST } from '@/assets/musiclist';
import { mapState} from 'vuex'
export default {
  data(){
    return {
      musiclist : MUSIC_LIST,
	  currentMusicItem: MUSIC_LIST[0],
	  isPlay:true,
	  progress: 0,
	  volume: 0,
	  time:0,
	  duration:0,
	  listShow:false,
	  newIndex:{
	    type:Number
	  },
	  newRepeat:''
    }
  },
  components:{
    progressBar,
    List
  },
  mounted(){
    $('#player').jPlayer({
			supplied : 'mp3',
			wmode : 'window'
		});
	this.playMusic(this.currentMusicItem);
	$('#player').bind($.jPlayer.event.timeupdate, (e)=>{
		/*总时间*/
		this.duration=e.jPlayer.status.duration;
		// current=e.jPlayer.status.currentTime;
		// currentWidth=e.jPlayer.status.currentPercentAbsolute;
			this.volume = e.jPlayer.options.volume * 100;
			this.time =e.jPlayer.status.currentTime;
			this.progress= e.jPlayer.status.currentPercentAbsolute/100;
	});
	$('#player').bind($.jPlayer.event.ended,(e)=>{
		this.playNext()   
	});
  },
  methods:{
    playMusic(musicItem){
    	$('#player').jPlayer('setMedia',{
    		mp3 : musicItem.file
    	}).jPlayer('play');
    	this.currentMusicItem = musicItem;
    },
    play(){
      this.isPlay ? $('#player').jPlayer('pause') : $('#player').jPlayer('play');
	  this.isPlay=!this.isPlay
    },
    playNext(){
        let index = this.nowIndex;
        let length=this.musiclist.length;
        if(this.repeat == 'cycle'){
          this.newIndex=(index+1)%length;
        }else if(this.repeat == 'once'){
          this.newIndex=index;
        }else{
          this.newIndex=Math.floor(Math.random()*length)
        }
		this.playMusic(this.musiclist[this.newIndex])
		this.$store.commit('updateIndex',this.newIndex)
	},
	playPrev(){
        let index = this.nowIndex;
        let length=this.musiclist.length;
		if(this.repeat == 'cycle'){
		  this.newIndex=(index-1+length)%length;
		}else if(this.repeat == 'once'){
		  this.newIndex=index;
		}else{
		  this.newIndex=Math.floor(Math.random()*length)
		}
		this.playMusic(this.musiclist[this.newIndex])
		this.$store.commit('updateIndex',this.newIndex)
	},
	progressChangeHandler(progress) {
		$('#player').jPlayer(this.isPlay?'play':'pause', (this.duration)*progress);
	},
	changeRepeat(){
	  this.newRepeat = (this.repeat=='cycle'?'once':(this.repeat=='once'?'random':'cycle'))
	  this.$store.commit('updateRepeat',this.newRepeat)
	},
	changeListShow(){
	  this.listShow=!this.listShow
	}
  },
	computed: {
	    ...mapState(['repeat','nowIndex']),
	    Atime() {
           return (this.time/60).toFixed(2) + 's';
	    },
	    Aduration() {
           return (this.duration/60).toFixed(2) + 's';
	    }
	},
	watch:{
      nowIndex(newVal) {
           // 拖动的时候不要 watch
        this.playMusic(this.musiclist[newVal])
      }
      
    }
}
</script>

<style lang="less">
@keyframes rotate
{
from {transform: rotate(0);}
to {transform: rotate(360deg);}
}
.player{
	position:fixed;
	width:100%;
	height:100%;
	.bg{
	    position:absolute;
	    z-index:-1;
	    top:0;
	    left:0;
	    bottom:0;
	    right:0;
		width:100%;
		height:100%;
		background:#000;
		filter:blur(20px);
		.img-mask{
		    position:absolute;
		    top:0;
		    left:0;
		    bottom:0;
		    right:0;
			width:100%;
			height:100%;
			background:#000;
			opacity:0.35;
		}
	}
	Header{
	  .title,.artist{
	      width: 70%;
	      margin: 0 auto;
	      line-height: 40px;
	      text-align: center;
	      -ms-text-overflow: ellipsis;
	      text-overflow: ellipsis;
	      overflow: hidden;
	      white-space: nowrap;
	      font-size: 18px;
	      color: #fff;
	  }
	  .title{
	  	font-size: 20px;
	  }
	  .artist{
	  	font-size: 16px;
	  }
	}
	.middle{
	   .cover{
	       position:absolute;
	   	width: 80%;
	       margin: 0 auto ;
	       top:120px;
	       left:10%;
	       background:#ccc;
	       border: 10px solid hsla(0,0%,100%,.1);
	       box-sizing:border-box;
	       border-radius: 50%;
	       overflow:hidden;
	       animation:rotate 20s infinite linear;
	   }
	}
	.list-mask{
		position:fixed;
		width:100%;
		height:100%;
		top:0;
		left:0;
		background:#333;
		opacity:0.1;

	}
}




.stop{
	animation-play-state: paused;
}
.cover img{
	width:100%;

}

.middle-bottom{
	width:60%;
    position:absolute;
    bottom:120px;
    left:20%;
    .time{
      position:absolute;
      left: -50px;
      color:#fff;
      top:10px;
      font-size:14px;
    }
    .duration{
      position:absolute;
      right: -50px;
      color:#fff;
      top:10px;
      font-size:14px;
    }
}

Footer{
    position:absolute;
	width:90%;
    height:52px;
    bottom: 30px;
    left:10%;
}
.footer-wrapper{
	display:flex;
	width:100%;
	height:100%;
}
.footer-wrapper li{
	flex:1;
}
.icon{
    display:inline-block;
    width:32px;
    height:32px;
    margin:0 auto;
	background: url(../img/icons.png) no-repeat;
	background-size: 32px auto;
}
.icon.prev {
    background-position: 0 0;
}
.icon.next {
    background-position: 0 -32px;
}

.icon.bigger {
    position:relative;
    width:40px;
    height:40px;
    top:-4px;
    background-size: 40px auto;
}
.icon.play {
    background-position: 0 -120px;
}
.icon.pause {
    background-position: 0 -80px;
    margin-left:-3px;

}
.icon.repeat-once {
    background-position: 0 -128px;
}
.icon.repeat-cycle {
    background-position: 0 -160px;
}
.icon.repeat-random {
    background-position: 0 -192px;
}
.list{
	display:inline-block;
    width:32px;
    height:32px;
    margin:0 auto;
	background: url(../assets/image/logo.png) no-repeat;
	background-size: 32px auto;
}

</style>
