<template>
  <div class="Book_Main">
    <div class="Book_LrcBox">
      <div class="Book_Lrc" id="Book_Lrc" :style="{'top':ThisTop +'px'}">
        <p v-for="(data,index) in ThisIsLyric" :class="{'FC58':data.Class==true}" v-html="data.Content"></p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        ThisBookData: '',
        ThisIsLyric: '',
        ThisTop: 0
      }
    },
    mounted () {
      this.GetBook()
    },
    methods: {
      GetBook () {
        this.$http.get('static/songlrc.json?' + Math.random(), {'emulateJSON': true}).then((response) => {
          this.ThisBookData = response.body.Lrc
          this.LrcAnalysis(this.ThisBookData)
          this.GetMusic(this.ThisBookData)
          this.LrcTimeUpData()
          this.LrcEnd()
        })
      },
      GetMusic (data) {
        this.ThisSrc = data.voicePath
      },
      LrcTimeUpData () {
        let Audio = document.getElementById('Com_Audio')
        let that = this
        Audio.addEventListener('timeupdate', function (e) {
          let AuCruTime = Audio.currentTime
          that.ResetClass()
          for (let i = 0; i < that.ThisIsLyric.length; i++) {
            if (AuCruTime > (that.ThisIsLyric[i].Time - 0.5)) {
              if (i > 0) {
                that.ThisIsLyric[i - 1].Class = false
              }
              that.ThisIsLyric[i].Class = true
              let ThisLine = document.getElementById('Book_Lrc').getElementsByTagName('p')[i].offsetTop
              if (i > 6) {
                that.ThisTop = 100 - ThisLine
              }
            }
          }
        })
      },
      LrcEnd () {
        let Audio = document.getElementById('Com_Audio')
        let that = this
        Audio.addEventListener('ended', function () {
          that.ThisTop = 0
        })
      },
      LrcAnalysis (data) {
        let str = data;
        str = str.replace(/\[ar:]/g, ' ')
        str = str.replace(/\[al:]/g, ' ')
        str = str.replace(/\[ti:]/g, ' ')
        str = str.replace(/\[by:]/g, ' ')
        str = str.replace(/\[offset:0]/g, ' ')
        str = str.replace(/&lt;/g, '<')
        str = str.replace(/&gt;/g, '>')
        str = str.replace(/&quot;/g, '"')
        str = str.replace(/&amp;nbsp;/g, '')
        str = str.replace(/<p>/g, '')
        str = str.replace(/<\/p>/g, '')
        str = str.replace(/&amp;#39;/g, '´')
        str = str.replace(/&rsquo;/g, "'")
        str = str.replace(/\[/g, '</br>[') // 改变后台数据，增加字符串标识换行
        this.ResetParseLyric(str)// 解析歌词
      },
      ResetParseLyric (str) {
        let NewArr = []
        let ParseLrc = this.ParseLyric(str)
        for (let i = 0; i < ParseLrc.length; i++) {
          let Obj = {}
          Obj.Time = ParseLrc[i][0]
          Obj.Content = ParseLrc[i][1]
          Obj.Class = false
          NewArr.push(Obj)
        }
        this.ThisIsLyric = NewArr
      },
      ResetClass () {
        for (let i = 0; i < this.ThisIsLyric.length; i++) {
          this.ThisIsLyric[i].Class = false
        }
      },
      // 解析歌词
      ParseLyric (text) {
        // 将歌词分成一行一行的
        let lines = text.split('</br>')
        // 将时间轴和歌词内容分隔开
        let pattern = /\[\d{2}:\d{2}.\d{2}\]/g
        // 保存最终结果的数组
        let result = []
        // 去掉不含时间的行
        if (pattern.test(lines[0])) {
          lines = lines.slice(1)
        }
        // 上面用'\n'生成生成数组时，结果中最后一个为空元素，这里将去掉
        lines[lines.length - 1].length === 0 && lines.pop();
        // 在页面上显示所有内容
        for (var i = 0; i < lines.length; i++) {
          var value = lines[i].replace(pattern, '')
          var t = lines[i].slice(1, -1).split(':')
          result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value])
        }
        // 最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
        result.sort(function (a, b) {
          return a[0] - b[0];
        })
        return result
      },
      isEmptyObject (obj) {
        if (obj) {
          return true
        } else if (obj === '') {
          return false
        } else {
          return false
        }
      }
    }
  }
</script>

<style>
  .FC58{  color: #08EAC5!important;  ;}
  .Book_Main{float: left;box-sizing: border-box; width: 100%; height: 340px; overflow: hidden;  margin-top: 40px;}
  .Book_LrcBox{float: left;width: 100%;height: 340px; margin-bottom: 20px;overflow: hidden;position: relative;}
  .Book_Lrc{float: left;width: 100%;box-sizing: border-box; padding: 0 40px 0 20px;position: absolute;top: 0;left: 0;}
  .Book_Lrc p {width: 100%;  font-size: 15px;  line-height: 30px;  color: white;float: left;}
</style>
