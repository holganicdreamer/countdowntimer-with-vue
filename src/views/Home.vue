<template>
  <div class="home">
    <div class="playerTile" v-for="(item, index) in items" :key="index+10">
      <span v-bind:style="{color:item.backgroundColor}">★</span>&nbsp;&nbsp;{{ item.minutes }} : {{ ( '00' + item.seconds ).slice( -2 ) }}
    </div>
    <div @click="start" v-show="timerStatus == 0" class="buttonTile">
      START
    </div>
    <div @click="pause" v-show="timerStatus == 1" class="buttonTile">
      PAUSE
    </div>
    <div v-show="timerStatus == 2" @click="restart" class="buttonTile">
      RESTART
    </div>
    <div v-for="(item, index) in items" :key="index">
      <div  @click="clickTimer(item)" v-show="index == indexShown" v-bind:style="{color:foreColors[index]}">
      <circular-count-down-timer
        @update="updated"
        @finish="finished"
        :initial-value="item.totalSeconds"
        :stroke-width="10"
        :seconds-stroke-color="'white'"
        :minutes-stroke-color="'white'"
        :hours-stroke-color="'white'"
        :underneath-stroke-color="'lightgrey'"
        :seconds-fill-color="item.backgroundColor"
        :minutes-fill-color="item.backgroundColor"
        :size="150"
        :padding="4"
        :hour-label="''"
        :minute-label="''"
        :second-label="''"
        :show-second="true"
        :show-minute="true"
        :show-hour="false"
        :show-negatives="false"
        :paused=item.paused
        :notify-every="'second'" />
    </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'home',
  data: function() {
    return {
      indexShown: -1,
      max: 4,
      timerStatus: 0, // 0:pausing 1:running 2:finished
      items: [
      ],
      foreColors: [
        "white",
        "white",
        "white",
        "black",
        "white",
        "white",
        "black",
        "white",
        "white",
        "black",
      ],
      backgroundColors: [
        "red",
        "blue",
        "green",
        "yellow",
        "magenta",
        "orange",
        "cyan",
        "deepskyblue",
        "violet",
        "plum",
      ],
    }
  },
  methods: {
    start() {
      this.timerStatus = 1;
      this.indexShown = this.indexShown == -1 ? 0 : this.indexShown;
      this.items[this.indexShown].paused = false;
    },
    pause() {
      this.timerStatus = 0;
      this.items[this.indexShown].paused = true;
    },
    clickTimer(item) {
      if(this.timerStatus == 0 || this.timerStatus == 2) {
        return;
      }
      item.paused = true;
      this.indexShown = this.indexShown == (this.max - 1) ? 0 : this.indexShown + 1;
      this.items[this.indexShown].paused = false;
    },
    updated(status) {
      this.items[this.indexShown].minutes = status.minutes;
      this.items[this.indexShown].seconds = status.seconds;
    },
    finished() {
      this.timerStatus = 2;
    },
    restart() {
      this.$router.go({path: this.$router.currentRoute.path, force: true});
    },
  },
  mounted () {
    var minutes = null;
    var seconds = null;
    var totalSeconds = null;
    if(!isNaN(this.$route.params.max) && this.$route.params.max <= 10) {
      this.max = this.$route.params.max;
    }
    var elms1 = null;
    if(this.$route.params.playerTotalSeconds) {
      elms1 = this.$route.params.playerTotalSeconds.split(',');
    }
    for(var i = 0; i < this.max; i++) {
      minutes = 1;
      seconds = 0;
      totalSeconds = 60;
      if(!isNaN(this.$route.params.totalSeconds) && this.$route.params.totalSeconds <= (59*60+59)) {
        minutes = Math.floor(this.$route.params.totalSeconds / 60);
        seconds = this.$route.params.totalSeconds - minutes * 60;
        totalSeconds = Number(this.$route.params.totalSeconds);
      }
      if(elms1) {
        elms1.forEach(elm1 => {
          var elms2 = elm1.split('=');
          if(elms2[0] == (i + 1)) {
            if(!isNaN(elms2[1]) && elms2[1] <= (59*60+59)) {
              minutes = Math.floor(elms2[1] / 60);
              seconds = elms2[1] - minutes * 60;
              totalSeconds = Number(elms2[1]);
            }
          }
        });
      }
      
      this.items.push({ backgroundColor: this.backgroundColors[i], paused: true, minutes: minutes, seconds: seconds, totalSeconds: totalSeconds, });
    }
  },
}
</script>

<style>
.home {
  font-family: 'HelveticaNeue-CondensedBlack','arial black';
}
.buttonTile {
  line-height: 100px;
  font-size: 2rem;
}
</style>