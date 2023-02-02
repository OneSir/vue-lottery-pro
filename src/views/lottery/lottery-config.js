import { cardList, colCount, rowCount } from './lottery-config-users.js';
import cookies from 'vue-cookies'
const lotteryConfig = {
  prizeList: [
    {
      count: 1, // 总数量
      countRemain: 1,
      everyTimeGet: 1,
      name: "一等奖",
      detail: "Apple Watch Series 8 ",
      img: "https://img13.360buyimg.com/n1/s450x450_jfs/t1/179395/8/27849/27934/6319113dE6612e51b/2c618a0f860a7082.jpg",
      id: '一等奖',
      cardListWin: [],
      round: 0
    },
    {
      count: 3,
      countRemain: 3,
      everyTimeGet: 3,
      name: "二等奖",
      detail: "小米 Redmi 投影仪",
      img: "https://img11.360buyimg.com/n1/s450x450_jfs/t1/66364/4/22641/90563/635a2377Ef330f0b7/7a8e76b3161ee420.jpg",
      id: '二等奖',
      cardListWin: [],
      round: 0
    },
    {
      count: 5,
      countRemain: 5,
      everyTimeGet: 5,
      name: "三等奖",
      detail: "探险者帐篷+天幕",
      img: "https://img12.360buyimg.com/n1/jfs/t1/12020/30/19902/274302/6358ca2bEb36d81ef/4cb0665f677a546a.jpg",
      id: '三等奖',
      cardListWin: [],
      round: 0
    },
    {
      count: 5,
      countRemain: 5,
      everyTimeGet: 5,
      name: "四等奖·拍立得",
      detail: "富士拍立得mini7+",
      img: "https://img12.360buyimg.com/n1/s450x450_jfs/t1/164189/22/17956/56575/60763a79E2c8e9fb8/b77adb68cfcc3dd6.jpg",
      id: '四等奖拍立得',
      cardListWin: [],
      round: 0
    },
    {
      count: 5,
      countRemain: 5,
      everyTimeGet: 5,
      name: "四等奖·摩摩哒",
      detail: "摩摩哒眼部按摩仪",
      img: "https://img14.360buyimg.com/n1/jfs/t1/140276/18/28457/274339/62f61ea2E63ada7a7/fc374772286bfa7c.jpg",
      id: '四等奖摩摩哒',
      cardListWin: [],
      round: 0
    },
    {
      count: 20,
      countRemain: 20,
      everyTimeGet: 10,
      name: "五等奖",
      detail: "小熊养生壶YSH-E15G1",
      img: "https://img30.360buyimg.com/sku/jfs/t1/117171/36/30883/35878/635785bdE47c97f22/f4a6274679088b50.jpg.avif",
      id: '五等奖',
      cardListWin: [],
      round: 0
    },
    {
      count: 30,
      countRemain: 30,
      everyTimeGet: 15,
      name: "六等奖",
      detail: "小米体脂称2",
      img: "https://img10.360buyimg.com/n1/s450x450_jfs/t1/213379/39/22282/11641/634d14a9Ee920aa2a/0d90d8f950575e5d.jpg",
      id: '六等奖',
      cardListWin: [],
      round: 0
    }
  ], // 奖品列表
  headerTitle: '测试中心 · 年终抽奖',
  currentPrize: null, // 当前抽奖的奖品
  colCount, rowCount, // table模式下行列数
  cardList, // 所有卡片的数据
  cardListWinAll: [], // 已经中奖的卡片
  cardListRemainAll: cardList, // 剩余未中奖的卡片
};
if (cookies.get('header_title')) {
  lotteryConfig.headerTitle = cookies.get('header_title')
}
// 如果缓存有奖项配置则直接读取缓存数据
if (cookies.get('prize_list')) {
  lotteryConfig.prizeList = cookies.get('prize_list')
}
lotteryConfig.getCurrentPrize = (prizeId = lotteryConfig.currentPrize) => {
  return lotteryConfig.prizeList.find(_ => {
    return _.id === prizeId;
  });
};
lotteryConfig.getUserById = (id) => {
  return cardList.find(_ => _.id === id);
}

let isInit = false;
const localStorageKey = '___lottery___';
lotteryConfig.setLocalStorage = () => {
  const _lotteryConfig = lotteryConfig;
  _lotteryConfig.headerTitle = lotteryConfig.headerTitle;
  _lotteryConfig.currentPrize = lotteryConfig.currentPrize;
  _lotteryConfig.prizeList = lotteryConfig.prizeList;
  _lotteryConfig.cardListWinAll = lotteryConfig.cardListWinAll;
  _lotteryConfig.cardListRemainAll = lotteryConfig.cardListRemainAll;
  localStorage.setItem(localStorageKey, JSON.stringify(_lotteryConfig));
}
lotteryConfig.getLocalStorage = () => {
  if (isInit !== false) {
    return void 0;
  }
  isInit = true;
  const _lotteryConfigString = localStorage.getItem(localStorageKey);
  if (!_lotteryConfigString) {
    return void 0;
  }
  let _lotteryConfig = null;
  try {
    // TODO 数据有效性判断
    _lotteryConfig = JSON.parse(_lotteryConfigString)
  } catch (e) {
    console.log(e);
  }
  lotteryConfig.headerTitle = _lotteryConfig.headerTitle && _lotteryConfig.headerTitle;
  lotteryConfig.currentPrize = _lotteryConfig.currentPrize && _lotteryConfig.currentPrize;
  lotteryConfig.prizeList = _lotteryConfig.prizeList && _lotteryConfig.prizeList;
  lotteryConfig.cardListWinAll = _lotteryConfig.cardListWinAll && _lotteryConfig.cardListWinAll;
  lotteryConfig.cardListRemainAll = _lotteryConfig.cardListRemainAll && _lotteryConfig.cardListRemainAll;
}
lotteryConfig.clearLocalStorage = () => {
  localStorage.removeItem(localStorageKey)
}
// 初始化奖项配置缓存
cookies.set('prize_list', JSON.stringify(lotteryConfig.prizeList))
cookies.set('header_title', lotteryConfig.headerTitle)
console.log('lotteryConfig', lotteryConfig);
export default lotteryConfig;
