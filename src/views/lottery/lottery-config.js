import { cardList, colCount, rowCount } from './lottery-config-users.js';
import cookies from 'vue-cookies'
const lotteryConfig = {
  prizeList: [
    {
      count: 39,
      countRemain: 39,
      everyTimeGet: 39,
      name: "其樂龍龍奖",
      detail: "徽章",
      img: "https://img12.360buyimg.com/n1/jfs/t1/207587/4/8802/149674/618a351bE3335573a/99ddd3a8e4e6677b.jpg",
      id: '其樂龍龍奖',
      cardListWin: [],
      round: 0,
      isShowTime: false
    },
    {
      count: 1, // 总数量
      countRemain: 1,
      everyTimeGet: 1,
      name: "特等奖",
      detail: "IPhone15 256G",
      img: "https://img10.360buyimg.com/n1/s450x450_jfs/t1/184747/18/38948/24193/650d0e64F5f53a5b9/0a217fa8bf650791.jpg",
      id: '特等奖',
      cardListWin: [],
      round: 0,
      isShowTime: false
    },
    {
      count: 1,
      countRemain: 1,
      everyTimeGet: 1,
      name: "一等奖·甲",
      detail: "Apple watch S9",
      img: "https://img11.360buyimg.com/n1/s450x450_jfs/t1/106800/30/44433/27003/6500da41F3fe2d6fb/742378431a00d556.jpg",
      id: '一等奖Apple',
      cardListWin: [],
      round: 0,
      isShowTime: false
    },
    {
      count: 1,
      countRemain: 1,
      everyTimeGet: 1,
      name: "一等奖·乙",
      detail: "PS5（国行光驱版）",
      img: "https://img12.360buyimg.com/n1/s450x450_jfs/t1/174652/8/41352/28323/6555804fFd0105429/acec4cef520d6f76.jpg",
      id: '一等奖PS5',
      cardListWin: [],
      round: 0,
      isShowTime: false
    },
    {
      count: 1,
      countRemain: 1,
      everyTimeGet: 1,
      name: "二等奖·甲",
      detail: "大疆 便携摄像机Pocket2",
      img: "https://img14.360buyimg.com/n1/s450x450_jfs/t1/216966/30/4233/38702/618e44c0E2b08adde/299e5f17017c8cab.jpg",
      id: '二等奖大疆',
      cardListWin: [],
      round: 0,
      isShowTime: false
    },
    {
      count: 2,
      countRemain: 2,
      everyTimeGet: 2,
      name: "二等奖·乙",
      detail: "Apple AirPods Pro 二代",
      img: "https://img10.360buyimg.com/n1/s450x450_jfs/t1/149336/11/39737/12573/6500d2faF6f26d5a8/a73dfbf07ef7a223.jpg",
      id: '二等奖AirPods',
      cardListWin: [],
      round: 0,
      isShowTime: false
    },
    {
      count: 3,
      countRemain: 3,
      everyTimeGet: 3,
      name: "三等奖·甲",
      detail: "机械键盘",
      img: "https://img10.360buyimg.com/n1/s450x450_jfs/t1/127916/3/37937/98683/64c14c8eFec9bb8b6/61dd79c934bbc1a7.jpg",
      id: '三等奖机械键盘',
      cardListWin: [],
      round: 0,
      isShowTime: false
    },
    {
      count: 2,
      countRemain: 2,
      everyTimeGet: 2,
      name: "三等奖·乙",
      detail: "JBL PULSE4 四代",
      img: "https://img12.360buyimg.com/n1/s350x467_jfs/t1/198809/6/24859/117936/62c655d4Eaa0125e6/9ecf88f741d43985.jpg!cc_350x467",
      id: '三等奖JBL',
      cardListWin: [],
      round: 0,
      isShowTime: false
    },
    {
      count: 8,
      countRemain: 8,
      everyTimeGet: 8,
      name: "龍運當頭奖",
      detail: "华为摄像头500万超清",
      img: "https://img.yzcdn.cn/upload_files/2020/07/06/Fv9wUKbFNjsD4MUgmBUSzF7VIMDO.png",
      id: '龍運當頭奖',
      cardListWin: [],
      round: 0,
      isShowTime: false
    },
    {
      count: 20,
      countRemain: 20,
      everyTimeGet: 10,
      name: "萬事興龍奖",
      detail: "定制礼盒1",
      img: "/img/wsxl.jpg",
      id: '萬事興龍奖',
      cardListWin: [],
      round: 0,
      isShowTime: false
    },
    {
      count: 20,
      countRemain: 20,
      everyTimeGet: 10,
      name: "好運龍龍奖",
      detail: "定制礼盒2",
      img: "/img/hyll.jpg",
      id: '好運龍龍奖',
      cardListWin: [],
      round: 0,
      isShowTime: false
    },
    {
      count: 25,
      countRemain: 25,
      everyTimeGet: 15,
      name: "欣欣向龍奖",
      detail: "抱枕/雨伞",
      img: "/img/ysbz.jpg",
      id: '欣欣向龍奖',
      cardListWin: [],
      round: 0,
      isShowTime: false
    }
  ], // 奖品列表
  headerTitle: 'XX中心 · 年会抽奖',
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
