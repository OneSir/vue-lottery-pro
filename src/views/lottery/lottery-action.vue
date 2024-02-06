<template>
<div>
  <div class="lottery-action">
    <div id="menu">
      <div style="margin-bottom: 10px;">
        <button id="table" v-show="showBtn">TABLE</button>
        <button id="sphere" v-show="showBtn">SPHERE</button>
        <button id="helix" v-show="showBtn">HELIX</button>
        <button id="grid" v-show="showBtn">GRID</button>
      </div>
      <div style="display:flex;margin-left:30px;">
        <button id="lotteryStart" v-if="!isStart" @click="lotteryStart" style="background-color:#005CAF;color:#fff;font-size:22px;font-weight:600;">开始抽奖</button>
        <button id="lotteryStop" v-else @click="lotteryStop" style="background-color:#005CAF;color:#fff;font-size:22px;font-weight:600;">停止抽奖</button>
        <div class="slider-container" style="margin-top: 6px;">
          <input type="range" :min="countRemain > 1 ? 1 : 0" :max="countRemain" v-model="everyTimeGet" class="slider" id="mySlider" style="margin-left:12px;" @change="changeEveryTimeGet">
          <span class="slider-tooltip"></span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import { setSphereDist } from './3d-calc-distance.js';
import { transform, transformStatus } from './3d-animate.js';
import lotteryConfig from './lottery-config.js';
import { cardFlyAnimation, rotateBall, rotateBallStop } from './3d-action.js';
import { getRandomCard } from './lottery-algorithm.js';
import STATUS from './3d-status.js';

@Component({
  components: {}
})
export default class Prize extends Vue {
  isStart = false;
  showBtn = false;
  everyTimeGet = 0;
  countRemain = 1;
  updateEveryTimeGet () {
    var slider = document.getElementById("mySlider");
    var tooltip = document.querySelector(".slider-tooltip");
    const currentPrize = lotteryConfig.getCurrentPrize();
    this.everyTimeGet = currentPrize.everyTimeGet;
    this.countRemain = currentPrize.countRemain;
    tooltip.innerHTML = '单次抽奖个数:' + (this.everyTimeGet > this.countRemain ? this.countRemain : this.everyTimeGet);
    slider.oninput = function() {
      tooltip.innerHTML = '单次抽奖个数:' + this.value;
    }
    // slider.onmousemove = function() {
    //   tooltip.style.bottom = 40 + "px";
    //   tooltip.style.width = 150 + "px";
    // }
    slider.onmouseenter = function() {
      tooltip.style.visibility = "visible";
    }
    slider.onmouseleave = function() {
      tooltip.style.visibility = "hidden";
    }
  }
  changeEveryTimeGet () {
    const prize = lotteryConfig.getCurrentPrize();
    const prizeList = lotteryConfig.prizeList;
    prize.everyTimeGet = Number(this.everyTimeGet);
    const index = prizeList.findIndex(item => item.id === prize.id)
    prizeList[index] = prize
    lotteryConfig.everyTimeGet = prize.everyTimeGet,
    lotteryConfig.setLocalStorage(); 
  }
  async lotteryStart() {
    if (STATUS.getStatus() !== STATUS.WAIT_LOTTERY) {
      alert('正在抽奖或初始化，请等待一下');
      return void 0;
    }
    const currentPrize = lotteryConfig.getCurrentPrize();
    if (!currentPrize) {
      alert('请选择奖项');
      STATUS.setStatusWait();
      return void 0;
    }
    if (currentPrize.countRemain <= 0) {
      alert(lotteryConfig.getCurrentPrize().name + '已经抽取完毕，请选择其他奖项');
      STATUS.setStatusWait();
      return void 0;
    }
    // 先回到table状态再抽奖
    STATUS.setStatusRun();
    this.isStart = true;
    transformStatus !== 'table' && await transform( 'table', 500 );
    await transform( 'sphere', 300 );
    rotateBall();
  }
  async lotteryStop() {
    const currentPrize = lotteryConfig.getCurrentPrize();
    if (!currentPrize) {
      alert('请选择奖项');
      STATUS.setStatusWait();
      return void 0;
    }
    rotateBallStop();
    const cardSelect = getRandomCard(currentPrize); // 当前的奖项
    const cardSelectIndex = cardSelect.map(_ => _.index);
    console.log(cardSelect, cardSelectIndex)
    await setSphereDist(2, 500);
    await cardFlyAnimation(cardSelectIndex);
    STATUS.setStatusWait();
    this.isStart = false
    this.updateEveryTimeGet()
  }
  mounted () {
    this.$bus.$on('lottery-3d-init', () => {
      STATUS.setStatusWait();
      this.updateEveryTimeGet();
    });
  }
}
</script>

<style lang="scss" scoped>
.lottery-action {
  flex: none;
  height: 30px;
  display: flex;
  margin-top: 30px;
  justify-content: center;
  align-items: center;
}
#menu {
  position: relative;
}
.slider {
  width: 150px;
  margin-top: 5px;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background-color: #4CAF50;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background-color: #4CAF50;
  cursor: pointer;
}

.slider-tooltip {
  position: absolute;
  visibility: hidden;
  background-color: #333;
  color: #fff;
  padding: 5px;
  border-radius: 5px;
  font-size: 14px;
  z-index: 99;
  width: 150px;
  bottom: 35px;
  left: 150px;
}

.slider-container:hover .slider-tooltip {
  visibility: visible;
}
</style>
