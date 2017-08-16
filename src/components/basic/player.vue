<template>
  <div :class="{'TeCom_Player':ThisItem==0,'StuCom_Player':ThisItem==1}">
    <audio :src="Tosrc"  id="Com_Audio" v-show="false"></audio>
    <p :class="{'Com_Pause':!ThisPlay,'Com_Play':ThisPlay}" @click="PlayPause"></p>
    <div class="Com_Bar" id="Com_Bar"
         @click="Updatebar($event,false)"
         @touchstart="Updatebar($event,true)"
         @touchmove="Updatebar($event,true)">
          <p class="Com_BarLoad" :style="{width:ThisBarLoad}"></p>
    </div>
    <div class="Com_Current">{{ThisCurrent}}</div>
    <div class="Com_Cut">/</div>
    <div class="Com_Duration">{{ThisDuration}}</div>
    <div class="Com_Volume">
      <div :class="{'Com_NoMal':!ThisMute,'Com_Mute':ThisMute}" @click="VoiceControl" title="Volume"></div>
      <div class="Com_Adjust" id="Com_Adjust"
           @click="UpdateVoice($event,false)"
           @touchstart="UpdateVoice($event,true)"
           @touchmove="UpdateVoice($event,true)"
      ><p :style="{width:ThisBarVoice }"></p></div>
    </div>
  </div>
</template>

<script>
  export default {
    // 用于接收来自父组件的数据
    props: {
      Tosrc: String
    },
    watch: {
      Tosrc: 'PlayerReset'
    },
    data () {
      return {
        ThisPlay: false,
        ThisMute: false,
        ThisDuration: '…',
        ThisCurrent: '00:00',
        ThisBarLoad: 0,
        ThisVoice: 1,
        ThisBarVoice: '100%',
        NotApp: true,
        ThisItem: ''
      }
    },
    mounted () {
      this.Init()
    },
    methods: {
      Init () {
        this.GetItem()
        this.InitPlayer()
        this.IsNotEmpty()
        this.InitFire()
      },
      GetItem () {
        this.ThisItem = parseInt(localStorage.getItem('Item'))
      },
      PlayerReset () {
        this.ThisPlay = false
        this.ThisMute = false
        this.ThisDuration = '…'
        this.ThisCurrent = '00:00'
        this.ThisBarLoad = 0
        this.ThisVoice = 1
        this.ThisBarVoice = '100%'
        this.Init()
      },
      InitPlayer () {
        this.BeforePlay() // 播放之前初始化总时间
        this.PlayIng() // 监听播放器播放过程
        this.PlayEnd() // 监听播放器播放完毕
      },
      InitFire () {
        this.NotApp = true
      },
      // 播放之前初始化总时间
      BeforePlay () {
        let that = this
        let thisAudio = document.getElementById('Com_Audio')
        thisAudio.addEventListener('loadeddata', function () {
          // 首先初始化音频的总时间
          that.ThisDuration = that.TimeReset(this.duration)
          this.volume = that.ThisVoice
        })
      },
      // 监听播放器播放过程
      PlayIng () {
        let that = this
        let thisAudio = document.getElementById('Com_Audio')
        // 监听播放
        thisAudio.addEventListener('timeupdate', function () {
          // 当前播放时间
          that.ThisCurrent = (that.TimeReset(this.currentTime))
          // 当前时间进度条改变
          that.ThisBarLoad = (this.currentTime / this.duration) * 100 + '%'
        })
      },
      // 监听播放器播放完毕
      PlayEnd () {
        let that = this
        let thisAudio = document.getElementById('Com_Audio')
        // 监听播放
        thisAudio.addEventListener('ended', function () {
          that.ThisPlay = false
          that.$emit('ListenChild', this.ThisPlay)
          that.ThisCurrent = '00:00'
          that.ThisBarLoad = 0
        })
      },
      // 播放暂停
      PlayPause () {
        let ThisAudio = document.getElementById('Com_Audio')
        this.ThisPlay = !this.ThisPlay
        var Time = null
        if (Time) { clearTimeout(Time) }
        if (this.ThisPlay) {
          Time = setTimeout(function () {
            ThisAudio.play()
          }, 1100)
        } else {
          ThisAudio.pause()
        }
        this.$emit('ListenChild', this.ThisPlay)
      },
      // 改变进度
      Updatebar (e, support) {
        let ThisAudio = document.getElementById('Com_Audio')
        let BarBox = document.getElementById('Com_Bar')
        let TheRealEvent = support ? e.targetTouches[0] : e
        let ThisClickTime = Math.round((ThisAudio.duration * (TheRealEvent.pageX - (BarBox.offsetLeft))) / (BarBox.clientWidth))
        // 改变当前播放时间
        ThisAudio.currentTime = ThisClickTime
        // 改变当前时间
        this.ThisCurrent = this.TimeReset(ThisClickTime)
        // 当前时间进度条改变
        this.ThisBarLoad = (ThisClickTime / this.ThisDuration) * 100 + '%'
        if (ThisClickTime >= ThisAudio.duration) {
          this.ThisPlay = false
          this.$emit('ListenChild', this.ThisPlay)
        }
      },
      // 音量控制
      VoiceControl () {
        this.ThisMute = !this.ThisMute
        let ThisAudio = document.getElementById('Com_Audio')
        if (this.ThisMute) {
          ThisAudio.volume = 0
          this.ThisBarVoice = 0
        } else {
          ThisAudio.volume = this.ThisVoice
          this.ThisBarVoice = this.ThisVoice * 100 + '%'
        }
      },
      // 改变音量
      UpdateVoice (e, support) {
        let ThisAudio = document.getElementById('Com_Audio')
        let VolumeBarBox = document.getElementById('Com_Adjust')
        let TheRealEvent = support ? e.targetTouches[0] : e
        let clickvolume = Math.round(((TheRealEvent.pageX - (VolumeBarBox.offsetLeft))) / (VolumeBarBox.clientWidth) * 100) / 100
        this.ThisVoice = clickvolume >= 0 ? clickvolume : 0
        this.ThisBarVoice = clickvolume * 100 + '%'
        ThisAudio.volume = this.ThisVoice
        if (clickvolume <= 0) {
          this.ThisMute = true
        } else {
          this.ThisMute = false
        }
      },
      // 是否含有
      IsNotEmpty () {
        if (!this.Tosrc) {
          this.Tosrc = '/static/slice.mp3'
        }
      },
      // 转换时间格式
      TimeReset (value) {
        var theTime = parseInt(value)// 秒
        var theTime1 = 0// 分
        var theTime2 = 0// 小时
        var Result// 最终时间
        var Sec, Min, Hour
        // 判断对象是否为空
        function isEmptyObject (e) {
          if (e) {
            return true
          } else {
            return false
          }
        }
        if (!isEmptyObject(value)) {
          Result = '00:00'
        } else {
          if (theTime > 60) {
            theTime1 = parseInt(theTime / 60)
            theTime = parseInt(theTime % 60)
            if (theTime1 > 60) {
              theTime2 = parseInt(theTime1 / 60)
              theTime1 = parseInt(theTime1 % 60)
            }
          }
          if (parseInt(theTime) <= 9) {
            Sec = '0' + parseInt(theTime)
          } else {
            Sec = parseInt(theTime)
          }
          if (parseInt(theTime1) <= 9) {
            Min = '0' + parseInt(theTime1)
          } else {
            Min = parseInt(theTime1)
          }
          if (parseInt(theTime2) <= 9) {
            Hour = '0' + parseInt(theTime2)
          } else {
            Hour = parseInt(theTime2)
          }
          if (Hour === '00' || Hour === 0) {
            Result = Min + ':' + Sec;
          } else {
            Result = Hour + ':' + Min + ':' + Sec;
          }
        }
        return Result;
      }
    }
  }
</script>

<style>
  .TeCom_Player,.StuCom_Player{  height: 60px;  width: 800px;  margin: auto;  overflow: hidden;  background: black;  background: rgba(0,0,0,0.8);}
  .Com_Pause{float: left;  width: 30px;  height: 30px;  margin: 15px 10px 0 40px;  overflow: hidden;  cursor: pointer;background: url("/static/player1.3/new_play0.png")0 0 no-repeat;background-size: 100%;}
  .Com_Play{float: left;  width: 30px;  height: 30px;  margin: 15px 10px 0 40px;  overflow: hidden;  cursor: pointer;background: url("/static/player1.3/new_play1.png")0 0 no-repeat;background-size: 100%;}
  .Com_Bar{height: 5px;width: 345px;margin: 28px 0 0 0;position: relative;left: 0; overflow: hidden;border-radius: 3px;  float:left;background-color:#F6F6F6;box-sizing: border-box; cursor: pointer;}
  .Com_BarLoad{height: 100%;position: absolute; left: 0; top: 0; z-index: 2;border-radius: 3px;width: 30%;}
  .Com_BarLoad {background: linear-gradient( to right, #007fd1, #c600ff );}
  .Com_Current{float: left;color: #fff;font-size: 12px;line-height: 60px;margin-left: 20px; }
  .Com_Cut{float: left;color: #fff;font-size: 12px;line-height: 60px;margin: 0 3px;}
  .Com_Duration{float: left;color: #fff;font-size: 12px;line-height: 60px;}
  .Com_Volume{float: right;height: 60px;margin-right: 40px;display: block;}
  .Com_NoMal{float: left;margin-right: 7px;overflow: hidden;margin-top: 22px; cursor: pointer; width: 30px;height: 22px;background: url("/static/player1.3/new_voice0.png") 0 0 no-repeat;}
  .Com_Mute{float: left;margin-right: 7px;overflow: hidden;margin-top: 22px; cursor: pointer; width: 30px;height: 22px;background: url("/static/player1.3/new_voice1.png") 0 0 no-repeat;}
  .Com_Adjust{cursor: pointer; width: 145px;overflow: hidden;background: white; border-radius: 3px; float: left;height: 5px;line-height: 5px;position: relative;margin-top: 29px;}
  .Com_Adjust > p{height: 5px;overflow: hidden;border-radius: 3px;box-sizing: border-box;;cursor: pointer;position: relative; }
  .Com_Adjust > p {background: linear-gradient( to right, #007fd1, #c600ff );}
</style>
