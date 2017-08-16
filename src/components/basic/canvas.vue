<template>
  <div class="LrcCon">
    <canvas id='canvas' width="800" height="350"></canvas>
    <div class="LrcMain">
      <v-lrc></v-lrc>
    </div>
  </div>
</template>

<script>
  import lrc from '../../components/basic/lrc'
  export default {
    components: {
      'v-lrc': lrc
    },
    mounted () {
      this.Init()
    },
    methods: {
      Init () {
        this.InitWin()
        this.StartCanvas()
      },
      InitWin () {
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
      },
      StartCanvas () {
        var audio = document.getElementById('Com_Audio');
        var AudioCon = new AudioContext();
        var analyser = AudioCon.createAnalyser(); // 创建获取频谱能量值的analyser节点。
        var audioSrc = AudioCon.createMediaElementSource(audio);
        audioSrc.connect(analyser);
        analyser.connect(AudioCon.destination);
        var canvas = document.getElementById('canvas')
        var cwidth = canvas.width // 画布大小
        var cheight = canvas.height - 1 // 画布高度减去冒头
        var meterWidth = 6 // 能量条的宽度
        var capHeight = 2 // 冒头高度
        var meterNum = canvas.width * 2 / (5 + 2) // 计算当前画布上能画多少条
        var capYPositionArray = []; // 将上一画面各帽头的位置保存到这个数组
        var ctx = canvas.getContext('2d')
        // 线性渐变
        var gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(1, '#007fd1');
        gradient.addColorStop(0.6, '#E900FF');
        gradient.addColorStop(0, '#c600ff');
        function renderFrame () {
          var array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          var step = Math.round(array.length / meterNum);
          ctx.clearRect(0, 0, cwidth, cheight);
          for (var i = 0; i < meterNum; i++) {
            var value = array[i * step];
            if (capYPositionArray.length < Math.round(meterNum)) {
              capYPositionArray.push(value);
            };
            if (value < capYPositionArray[i]) {
              ctx.fillRect(i * 8, cheight - (--capYPositionArray[i]), meterWidth, capHeight);
            } else {
              ctx.fillRect(i * 8, cheight - value, meterWidth, capHeight);
              capYPositionArray[i] = value;
            };
            ctx.fillStyle = gradient;
            ctx.fillRect(i * 8, cheight - value + capHeight, meterWidth, cheight);
          }
          requestAnimationFrame(renderFrame);
        }
        renderFrame();
      }
    }
  }
</script>

<style>
.LrcCon{position: relative;width: 800px;height: 350px;overflow: hidden;margin: 0 auto;}
  .LrcMain{position: absolute;top: 0;left: 0;width: 800px;height: 340px;overflow: hidden;}


</style>
