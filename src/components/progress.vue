<template>
  <div class="progressBar" ref="progressBar" @click.stop="progressClick">
      <div class="components-progress">
        <div class="progress" ref="progress"></div>
        <div class="point" ref="progressPoint"
           @touchstart.prevent="pointTouchstart"
           @touchmove.prevent="pointTouchmove"
           @touchend.prevent="pointTouchend"
        ></div>
      </div>
  </div>
</template>

<script>

export default {
  props:{
    progress:{
      type:Number,
      default:0
    }
  },
  data() {
    return{
      newProgress:{
        type:Number,
        default:0
      },
      touch:{}
    }
  },
  methods:{
    progressClick(e) {
      let progressBar = this.$refs.progressBar;
      let progress = this.$refs.progress;
      let progressPoint = this.$refs.progressPoint;
      this.newProgress = (e.clientX - progressBar.getBoundingClientRect().left)/progressBar.clientWidth;
      this.changeProgress(this.newProgress);
      this.emitProgress()
    },
    pointTouchstart (e) {
      this.touch.init = true
      // 开始滑动的位置
      this.touch.startX = e.touches[0].pageX
      // 当前偏移
      this.touch.left = this.$refs.progress.clientWidth
    },
    // 拖动小球改变播放进度，小球滑动过程中
    pointTouchmove (e) {
      var progressBar = this.$refs.progressBar;
      var progress = this.$refs.progress;
      var progressPoint = this.$refs.progressPoint;
      if (!this.touch.init) return
      // 滑动的差值
      var deltaX = e.touches[0].pageX - this.touch.startX
      // 进度条的差值，大于0，小于总长度
      var newWidth = Math.min(progressBar.clientWidth,Math.max(0,this.touch.left + deltaX));
      this.newProgress = newWidth/progressBar.clientWidth;
      this.changeProgress(this.newProgress);
      this.emitProgress()
      
    },
    // 拖动小球改变播放进度，小球滑动结束
    pointTouchend () {
      this.touch.init = false
    },
    changeProgress(newVal){
      var progressBar = this.$refs.progressBar;
      var progress = this.$refs.progress;
      var progressPoint = this.$refs.progressPoint;
      progress.style.width = (newVal*100)+ '%';
      progressPoint.style.left = (newVal*100)+ '%'; 
    },
    emitProgress(){
      this.$emit('progressChange',this.newProgress);
    }    
  },
  mounted(){
      
   },
    watch:{
      progress(newVal) {
           // 拖动的时候不要 watch
        if (newVal >= 0 && !this.touch.init) {
          this.changeProgress(newVal);
        }
      }
      
    }
}
</script>

<style lang="less">
.progressBar{
    height:30px;
  .components-progress{
    position:absolute;
    background:#eee;
    width:100%;
	height:3px;
	top:20px;
	.progress{
	    width:0;
	    position:absolute;
		height: 3px;
		border-radius:2px;
		background:#ffcd32;
	}
	.point{
	    width:8px;
	    height:8px;
	    position:absolute;
	    top:-4px;
	    border-radius:50%;
        border:3px solid #ccc;
        background:#ffcd32;
        margin-left:-5px;
	}}
}


</style>