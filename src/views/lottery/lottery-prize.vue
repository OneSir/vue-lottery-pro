<template>
  <div class="prize-wrap" :style="'height:' + prizePageHeight + 'px'">
    <vue-scroll :ops='ops' :style="'width:100%;maxHeight:' + pageHeight + 'px;'">
      <ul class="prize-list">
        <li class="prize-item"
          v-for="(item, index) in prizeList" :key="index"
          style="color: #F9BF45;background-color: #AB3B3A;"
          :class="{shine: index === currentPrizeIndex, done: index === donePrizeIndex}"
          @click="selectPrize($event, item, index)">
          <div class="prize-item-left" v-if="isShowDetail || item.isShowTime">
            <img :src='item.img' @click="changeShowPrizeItem(item)">
          </div>
          <div class="prize-item-right">
            <div class="prize-item-title" :style="!isShowDetail && !item.isShowTime ? 'font-size:40px;text-align:center;width:100%;' : ''">
              {{ item.name }}
            </div>
            <div class="prize-item-name" v-if="isShowDetail || item.isShowTime">{{ item.detail }}</div>
            <div class="prize-item-count" style="display: none;">{{ item.count }}名</div>
            <div class="prize-item-count-wrap" v-if="isShowDetail || item.isShowTime">
              <div class="prize-item-count-text">{{ item.countRemain }}/{{ item.count }}</div>
              <div class="progress">
                <div
                  :style="{width: item.countRemain / item.count * 100 + '%'}"
                  class="progress-bar progress-bar-danger progress-bar-striped active"
                ></div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </vue-scroll>
    <lotteryAction ref="lotteryAction"/>
    <div>
      <div class="global-mask" v-show="isShowDialog"></div>
      <div class="global-dialog" v-show="isShowDialog">
        <span class="close-btn" @click="isShowDialog = false">✖</span>
        <div class="title">{{ prizeDetail.name }}</div>
        <div class="content">
          <div class="form">
            <div class="item">
              <span class="text">{{ '奖品：' + prizeDetail.detail }}</span>
            </div>
            <div class="item">
              <span class="text">{{ '数量：' + prizeDetail.count }} </span>
            </div>
            <div class="item">
              <img :src='prizeDetail.img' style="width: 360px;margin:0 auto">
            </div>
            <div class="item">
              <div class="text" style="margin: 0 auto">示意图，请以实物为准</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import lotteryAction from './lottery-action.vue';
import lotteryConfigImport from './lottery-config.js';
import { transform } from './3d-animate.js';
const lotteryConfig: any = lotteryConfigImport;
import STATUS from './3d-status.js';

@Component({
  components: { lotteryAction }
})
export default class Prize extends Vue {
  data() {
    return {
      prizePageHeight: window.innerHeight - 55,
      pageHeight: window.innerHeight,
      ops: {
        vueScroll: {
          mode: 'native',
          sizeStrategy: 'percent',
          wheelScrollDuration: 1,
          detectResize: true,
          locking: true
        },
        scrollPanel: {
          initialScrollY: false,
          initialScrollX: false,
          scrollingX: false,
          scrollingY: true,
          speed: 300,
          easing: undefined,
          verticalNativeBarPos: 'right',
          maxHeight: window.innerHeight - 80
        },
        rail: {
          background: '#01a99a',
          opacity: 0,
          size: '3px',
          specifyBorderRadius: false,
          gutterOfEnds: null,
          gutterOfSide: '2px',
          keepShow: false
        },
        bar: {
          showDelay: 1000,
          onlyShowBarOnScroll: false,
          keepShow: false,
          background: '#c1c1c1',
          opacity: 1,
          hoverStyle: false,
          specifyBorderRadius: false,
          minSize: false,
          size: '6px',
          disable: false
        }
      }
    }
  }
  $bus: any;
  ops: {
    vueScroll: {
      mode: 'native',
      sizeStrategy: 'percent',
      wheelScrollDuration: 1,
      detectResize: true,
      locking: true
    },
    scrollPanel: {
      initialScrollY: false,
      initialScrollX: false,
      scrollingX: false,
      scrollingY: true,
      speed: 300,
      easing: undefined,
      verticalNativeBarPos: 'right',
      maxHeight: Number
    },
    rail: {
      background: '#01a99a',
      opacity: 0,
      size: '3px',
      specifyBorderRadius: false,
      gutterOfEnds: null,
      gutterOfSide: '2px',
      keepShow: false
    },
    bar: {
      showDelay: 1000,
      onlyShowBarOnScroll: false,
      keepShow: false,
      background: '#c1c1c1',
      opacity: 1,
      hoverStyle: false,
      specifyBorderRadius: false,
      minSize: false,
      size: '6px',
      disable: false
    }
  };
  isShowDialog = false;
  prizeDetail = { name: '', detail: '', count: '', img: '' };
  prizePageHeight: Number;
  pageHeight: Number;
  showBtn = false;
  isShowDetail = false;
  prizeList = lotteryConfig.prizeList;
  currentPrizeIndex = null;
  donePrizeIndex = null;
  changeShowDialog () {
    this.prizeDetail = lotteryConfig.getCurrentPrize();
    this.isShowDialog = !this.isShowDialog
  }
  async selectPrize(event, prize, index) {
    if (event.target.localName === 'img') return false
    if (STATUS.isRun()) {
      alert('正在抽奖中/正在切换奖项中/已经是当前奖项状态，不能切换奖项！');
      return void 0;
    }
    STATUS.setStatusRun();
    this.currentPrizeIndex = index;
    lotteryConfig.currentPrize = prize.id;
    this.$refs.lotteryAction['updateEveryTimeGet']()
    prize.isShowTime = true
    if (prize.isShowTime) this.changeShowDialog()
    await transform('table', 1000); // TODO重复点击处理
    STATUS.setStatusWait();
  }
  changeShowPrizeItem (prize) {
    if (prize.count !== prize.countRemain) return false
    const prizeList = lotteryConfig.prizeList;
    prize.isShowTime = false
    const index = prizeList.findIndex(item => item.id === prize.id)
    prizeList[index] = prize
    lotteryConfig.prizeList = prizeList,
    lotteryConfig.setLocalStorage(); 
  }
  listenResize () {
    this.prizePageHeight = window.innerHeight - 55
    this.pageHeight = window.innerHeight
    this.ops.scrollPanel.maxHeight = window.innerHeight - 80
  }
  created () {
    window.addEventListener('resize', this.listenResize)
  }
  beforeDestroy () {
    window.removeEventListener('resize', this.listenResize)
  }
  mounted() {
    if (!this.prizeList.length) return;
    const currentPrize = lotteryConfig.getCurrentPrize()
    if (!currentPrize) {
      this.currentPrizeIndex = this.prizeList.length - 1;
      lotteryConfig.currentPrize = this.prizeList[this.prizeList.length - 1]['id'];
    } else {
      const index = lotteryConfig.prizeList.findIndex(_ => _.id === currentPrize.id);
      this.currentPrizeIndex = index;
    }
  }
}
</script>

<style lang="scss" scoped>
@import './lottery-prize.scss';
.global-mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 998;
  width: 100%;
  height: 100%;
  background: rgba($color: #000000, $alpha: 0.3);
}
.close-btn {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 999;
  font-size: 30px;
  cursor: pointer;
  display: block;
  color: #333;
}
.global-dialog {
  position: fixed;
  left: calc(50% - 265px);
  top: 80px;
  z-index: 1000;
  width: 550px;
  background: #FFFFFF;
  border-radius: 15px;
  overflow: hidden;
  padding: 12px;
  .title {
    font-size: 36px;
    font-weight: 500;
    text-align: center;
    line-height: 100px;
    padding-bottom: 10px;
  }
  .content {
    .text {
      font-size: 32px;
      text-align: center;
    }
    .form {
      padding: 0 40px;
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        line-height: 40px;
      }
    }
  }
  .btn {
    display: flex;
    float: right;
    margin-right:12px;
    &> button {
      flex: 1;
      text-align: center;
      font-size: 20px;
      &.left {
        margin-right:16px;
      }
      &.right {
        color: #FFFFFF;
        background: rgba(0, 92, 175,1);
      }
    }
  }
}
</style>
