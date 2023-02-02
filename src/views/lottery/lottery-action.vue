<template>
  <div class="lottery-action">
    <div id="menu">
      <div style="margin-bottom: 10px;">
        <button id="table" v-show="showBtn">TABLE</button>
        <button id="sphere" v-show="showBtn">SPHERE</button>
        <button id="helix" v-show="showBtn">HELIX</button>
        <button id="grid" v-show="showBtn">GRID</button>
      </div>
      <div style="margin-bottom: 10px;">
        <button id="lotteryStart" v-if="!isStart" @click="lotteryStart">开始抽奖</button>
        <button id="lotteryStop" v-else @click="lotteryStop">停止抽奖</button>
        <button id="tableShow" @click="tableShow" style="margin-left:10px;">展示全部</button>
        <button id="winShow" @click="showAllWinUserPanel = true" style="margin-left:10px;">展示中奖</button>
      </div>
      <div>
        <button id="reset" @click="resetPrizeData" style="margin-right:10px;">重置奖项</button>
        <button id="add" @click="changeShowDialog">即兴加奖</button>
        <button id="reset" @click="resetData" style="margin-left:10px;">重置数据</button>
      </div>
    </div>
    <div class="show-all-win-user" v-if="showAllWinUserPanel">
      <span class="close-btn" @click="showAllWinUserPanel = false">✖</span>
      <div class="prize-win-item" v-for="(item, index) in prizeList" :key="index">
        <div style="display:flex;">
          <div class="prize-name">{{ item.name }}</div>
          <button @click="resetPrizeItem(item)">无效重抽</button>
        </div>
        <div class="prize-win-user">
          <!-- 每十个换行 -->
          <div class="prize-win-user-name-wrap" v-for="(arr, arrIndex) in getRenderArr(item.cardListWin)" :key="arrIndex">
            <span class="prize-win-user-name" v-for="(user, userIndex) in arr" :key="userIndex">
              {{ user.name }}
            </span>
            <br />
          </div>
        </div>
      </div>
    </div>
    <div>
      <div class="global-mask" v-show="isShowDialog"></div>
      <div class="global-dialog" v-show="isShowDialog">
        <div class="title">即兴加奖</div>
        <div class="content">
          <div class="form">
            <div class="item">
              <span class="text">奖项名称：</span>
              <input v-model="prize.name" placeholder="设置奖项的名称，最长7个字符" maxlength="7">
            </div>
            <div class="item">
              <span class="text">奖品名称：</span>
              <input v-model="prize.detail" placeholder="设置奖品的名称，最长10个字符" maxlength="10">
            </div>
            <div class="item">
              <span class="text">奖项总数：</span>
              <input v-model="prize.count" placeholder="设置奖项总数量" type="number">
            </div>
            <div class="item">
              <span class="text">每次限抽：</span>
              <input v-model="prize.everyTimeGet" placeholder="设置每次抽奖的数量" type="number">
            </div>
            <div class="item">
              <span class="text">配图URL：</span>
              <input v-model="prize.img" placeholder="请输入配图URL">
            </div>
          </div>
        </div>
        <div class="btn">
          <button class="left" @click="changeShowDialog">退出加奖</button>
          <button class="right" @click="add">增加奖项</button>
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
  showAllWinUserPanel = false;
  isShowDialog = false;
  resetPrize = false;
  prize =
  {
    count: undefined,
    countRemain: undefined,
    everyTimeGet: undefined,
    name: "",
    detail: "",
    img: "",
    id: '',
    cardListWin: [],
    round: 0
  }
  prizeList = lotteryConfig.prizeList;
  getUserById = lotteryConfig.getUserById;
  getRenderArr(arr) {
    const arrRes = [];
    const n = 15;
    const len = arr.length;
    const lineNum = len % n === 0 ? len / n : Math.floor( (len / n) + 1 );
    for (let i = 0; i < lineNum; i++) {
      const temp = arr.slice(i*n, i*n+n);
      arrRes.push(JSON.parse(JSON.stringify(temp)));
    }
    return arrRes;
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
    transformStatus !== 'table' && await transform( 'table', 500 );
    await transform( 'sphere', 300 );
    rotateBall();
    this.isStart = true;
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
  }

  async tableShow() {
    if (STATUS.getStatus() !== STATUS.RUNNING_LOTTERY) {
      STATUS.setStatusRun();
      await transform( 'table', 1000 ); // sphere
      STATUS.setStatusWait();
    } else {
      alert('抽奖正在运行中，请等待后再操作！')
    }
  }
  resetData () {
    if (confirm('是否要重置所有抽奖数据，此操作不可恢复！')) {
      lotteryConfig.clearLocalStorage();
      location.reload();
    }
  }

  resetPrizeData () {
    if (confirm('是否要重置所有奖项，此操作不可恢复！')) {
      this.$cookies.set('prize_list', JSON.stringify([]));
      this.prizeList = [];
      location.reload();
    }
  }

  resetPrizeItem (prize) {
    const cardListWinAll = lotteryConfig.cardListWinAll;
    const priceList = Array.from(document.getElementsByClassName('prize'));
    prize.cardListWin.forEach(item => {
      priceList.forEach(price => {
        if (price.dataset.cardId === item.id) {
          price.classList.remove('prize');
        }
      })
      const index = cardListWinAll.findIndex(win=> win.id === item.id)
      if (index > -1) {
        cardListWinAll.splice(index, 1)
      }
    })
    const localStorageKey = '___lottery___';
    const _lotteryConfig = lotteryConfig;
    lotteryConfig.setLocalStorage = () => {
      _lotteryConfig.headerTitle = lotteryConfig.headerTitle;
      _lotteryConfig.currentPrize = lotteryConfig.currentPrize;
      _lotteryConfig.prizeList = lotteryConfig.prizeList;
      _lotteryConfig.cardListWinAll = cardListWinAll;
      _lotteryConfig.cardListRemainAll = lotteryConfig.cardListRemainAll.concat(prize.cardListWin);
    }
    window.localStorage.setItem(localStorageKey, JSON.stringify(_lotteryConfig));
    prize.cardListWin = []
    prize.countRemain = prize.count
  }

  add () {
    if (!this.prize.count || !this.prize.everyTimeGet || !this.prize.name || !this.prize.detail) {
      alert('除了配图URL，其他不能为空')
      return
    } else if (Number(this.prize.count) < Number(this.prize.everyTimeGet)) {
      alert('每次抽奖数量不能大于奖项总数量')
      return
    }
    this.prize.count = Number(this.prize.count)
    this.prize.everyTimeGet = Number(this.prize.everyTimeGet)
    this.prize.countRemain = this.prize.count
    this.prize.id = Date.parse(new Date())
    this.prizeList.push(this.prize)
    this.$cookies.set('prize_list', JSON.stringify(this.prizeList))
    this.isShowDialog = false
  }

  changeShowDialog () {
    this.isShowDialog = !this.isShowDialog
    this.prize = {
      count: undefined,
      countRemain: undefined,
      everyTimeGet: undefined,
      name: "",
      detail: "",
      img: "",
      id: '',
      cardListWin: [],
      round: 0
    }
  }

  mounted () {
    this.$bus.$on('lottery-3d-init', () => {
      STATUS.setStatusWait();
    });
  }
}
</script>

<style lang="scss" scoped>
.lottery-action {
  flex: none;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}
#menu {
  position: relative;
}
.show-all-win-user {
  position: fixed;
  width: calc(100vw - 60px);
  height: calc(100vh - 50px - 60px);
  left: 30px;
  top: calc(50px + 30px);
  background-color: rgba(0, 0, 0, 1);
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  border: 1px solid rgba(25,144,255, 0.314);
  color: #fff;
  .close-btn {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 30px;
    cursor: pointer;
    display: block;
    color: rgba(255, 255, 255, .7);
  }
  .prize-win-item {
    //flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 50px;
    .prize-name {
      font-size: 20px;
      margin-right: 12px;
    }
    .prize-win-user {
      margin-top: 16px;
      .prize-win-user-name {
        font-size: 16px;
        //margin-right: 10px;
        width: 80px;
        display: inline-block;
        text-align: center;
      }
    }
  }
}
.global-mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 998;
  width: 100%;
  height: 100%;
  background: rgba($color: #000000, $alpha: 0.3);
}
.global-dialog {
  position: fixed;
  left: calc(50% - 315px);
  top: 100px;
  z-index: 999;
  width: 800px;
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
        input {
          width: 520px;
          height: 40px;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          padding: 0 20px;
        }
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
        background: rgba(25,144,255,1);
      }
    }
  }
}
</style>
