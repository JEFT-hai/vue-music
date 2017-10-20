<template>
<transition name="listShow">
  <div v-show="this.listShow" class="music-list">
      <div class="list-repeat" @click="changeRepeat">
         <i :class="this.repeat=='cycle'?`icon small repeat-cycle`:(this.repeat=='once'?`icon small repeat-once`:`icon small repeat-random`)">
         </i>
         <span class="repeatText">{{repeatText}}({{musiclist.length}})</span>
      </div>
      <div class="musicList" ref="musicList">
        <ul ref="ul">
          <li v-for="(item,index) in musiclist" :class="{active:(index==nowIndex),border:(index!=0)}" @click="changeIndex(index)">
             <span class="list-m-title">{{item.title}} - </span>
             <span class="list-m-artist">{{item.artist}}</span>
          </li>
        </ul>
      </div>
      <div class="list-bottom border" @click="closeList">关闭</div>
  </div>

</transition>
</template>

<script>
import { MUSIC_LIST } from '@/assets/musiclist';
import { mapState} from 'vuex';
import BScroll from 'better-scroll';
export default {
  props:{
    listShow:''
  },
  data() {
    return {
      musiclist : MUSIC_LIST,
      newRepeat:''
    }
  },
  computed:{
    ...mapState(['repeat','nowIndex']),
    repeatText(){
      return (this.repeat=='cycle'?'循环播放':(this.repeat=='once'?'单曲循环':'随机播放'))
    },

  },
  methods:{
    changeIndex(index){
      this.$store.commit('updateIndex',index);
      this.$emit('Play')
    },
    closeList(){
      this.$emit('closeList');
    },
    changeRepeat(){
	  this.newRepeat = (this.repeat=='cycle'?'once':(this.repeat=='once'?'random':'cycle'))
	  this.$store.commit('updateRepeat',this.newRepeat)
	},
	_initScroll(){
	      if(!this.musicList){
	        this.musicList = new BScroll(this.$refs.musicList, {
	         click:true
	        })
	      }else{
	        this.musicList.refresh(); // 增减 刷新
	      }
	}
  },
  watch:{
    listShow(){
      this.$nextTick(()=>{
        this._initScroll();
      })
    }
  }
}
</script>

<style lang="less">
.listShow-enter,.listShow-leave-active{
	transform:translateY(100%);
}
.listShow-enter-active,.listShow-leave-active{
	transition:all 0.35s linear;
}
.music-list{
    position:absolute;
    width:100%;
	height:65%;
	background:#fefefe;
	opacity:0.95;
	bottom:0;
	z-index:99;
	overflow:hidden;
	.list-repeat,{
	  width:100%;
	  line-height:40px;
	  height:40px;
	  padding-left:2%;
	  border-bottom:1px solid #ccc;
	  background:#666;
	  opacity:1;
	  z-index:100;
	  color:#fff;
	  .small{
	  	transform:scale(0.7);
	  	vertical-align:middle;
	  }
	  .repeatText{
	    vertical-align:middle;
	  }
	}
	.musicList{
	  width:100%;
	  position:absolute;
      top:41px;
      bottom:51px;
	  overflow:hidden;
	  ul{
	    width:100%;
	    min-height: 350px;
	    li{
	      line-height:40px;
	      height:40px;
	      width:100%;
	      padding-left:8px;
	      .list-m-artist{
	        font-size:13px;
	        color:#555;
	      }
	    }
	    li.active{
	      color:red;
	      .list-m-artist{
	        color:red;
	      }
	    }
	  }
	}
	.list-bottom{
	  position:absolute;
	  line-height:50px;
	  height:50px;
	  width:100%;
	  text-align:center;
	  bottom:0;
	  background:#fff;
	  opacity:1;
	}
}

.border{
	position:relative;
}
.border:after{
	display:block;
	position:absolute;
	left:2%;
	top:0;
	width:98%;
	border-top:1px solid #ccc;
	content:'';
}
@media (-webkit-min-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5){
    .border:after{
      -webkit-transform: scaleY(.7);
        transform: scaleY(.7);
    }    
}

@media (-webkit-min-device-pixel-ratio: 2),(min-device-pixel-ratio: 2){
    .border:after{
      -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
    }    
}

</style>
