<template>
  <div class="Echo">
    <v-disk :Status="PlayStatus"></v-disk>
    <div class="CanvasBox"><v-canvas></v-canvas></div>
    <div class="ConAudio"><v-player :Tosrc="ThisSrc" @ListenChild="RecieveChild"></v-player></div>
  </div>
</template>
<script>
  import disk from '../components/basic/disk'
  import Player from '../components/basic/player'
  import TCanvas from '../components/basic/canvas'
  export default{
    data () {
      return {
        PlayStatus: false,
        ThisSrc: '/static/song/test.mp3'
      }
    },
    components: {
      'v-disk': disk,
      'v-player': Player,
      'v-canvas': TCanvas
    },
    methods: {
      RecieveChild (Bool) {
        this.PlayStatus = Bool
      }
    }
  }
</script>

<style>
  .Echo{position: fixed;overflow-y: auto; width: 100%;height: 100%;min-width: 1000px;background: url("/static/images/bg.jpg")0 0  no-repeat;background-size:cover;  }
  .ConAudio{border-radius:0 0 10px 10px;  height: 60px;  width: 800px;  margin: auto;  overflow: hidden;  background: black;  background: rgba(0,0,0,0.8);}
  .CanvasBox{float: left;width: 100%;text-align: center;}
</style>
