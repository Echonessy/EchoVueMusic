<template>
  <div class="Disk">
    <div class="DisCirBox">
      <div class="DisCir StartTurn" :style="{'animation':DisCirCss,'animation-play-state':DisAnSta}"></div>
    </div>
    <div :class="{'DisNeedle StartTremble':ThisPlaying,'DisNeedle':!ThisPlaying}"
       :style="{'animation':DisNeedleCss, 'animation-play-state':DisNeedleAnSta}"
    ></div>
  </div>
</template>

<script>
  export default {
    props: {
      Status: Boolean
    },
    data () {
      return {
        DisNeedleCss: '',
        DisNeedleAnSta: '',
        DisAnSta: '',
        DisCirCss: '',
        ThisPlaying: false
      }
    },
    watch: {
      Status: 'Init'
    },
    methods: {
      Init () {
        if (this.Status) {
          this.StartDisk()
        } else {
          this.EndDisk()
        }
      },
      StartDisk () {
        var Time = null
        if (Time) { clearTimeout(Time) }
        var that = this
        this.DisNeedleCss = 'Roll 1s linear 1 forwards'
        Time = setTimeout(function () {
          that.DisAnSta = 'running'
          that.ThisPlaying = true
          that.DisNeedleCss = 'Tremble 2s linear infinite'
        }, 1100)
      },
      EndDisk () {
        this.DisAnSta = 'paused'
        this.ThisPlaying = false
        this.DisNeedleCss = 'EndRoll 1s linear 1 forwards'
      }
    }
  }
</script>

<style>
  @keyframes Turn{ from{-webkit-transform:rotate(0deg)} to{-webkit-transform:rotate(360deg)}}
  @keyframes Roll {0%{transform:rotate(0deg)}100%{transform:rotate(22deg)}}
  @keyframes EndRoll {0%{transform:rotate(22deg)}100%{transform:rotate(0deg)}}
  @keyframes Tremble{ 0%{transform:rotate(22deg)} 25%{transform:rotate(23deg)} 50%{transform:rotate(22deg)} 75%{transform:rotate(21deg)} 100%{transform:rotate(22deg)} }
  .Disk{width:500px;height: 400px;overflow: hidden;margin: 0 auto; position: relative;}
  .DisCir,.DisCirBox{width: 300px;height: 300px;border-radius: 100%;position: absolute;left: 0;right: 0;bottom: 0;top: 0;margin: auto;}
  .DisCir{background: url("/static/images/1.png")0 0 no-repeat;background-size: 100%;z-index: 1;}
  .DisNeedle{transform:rotate(0deg); position: absolute;height: 400px;top:0; right: 0;  ;transform-origin:57px 40px; z-index: 4;width: 80px;background: url("/static/images/0.png")0 0 no-repeat;background-size: 100%;}
  .StartTurn{  animation:Turn 2s linear infinite; animation-play-state:paused }
  .StartTremble { animation:Tremble 2s linear infinite;  }
</style>
