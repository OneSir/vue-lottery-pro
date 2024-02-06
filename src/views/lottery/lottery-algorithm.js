import lotteryConfig from './lottery-config.js';
import cookies from 'vue-cookies'

const random = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

const getRandomCard = function(currentPrize) {
  let cardListRemainAllCopy = JSON.parse(JSON.stringify(lotteryConfig.cardListRemainAll));
  const selectCount = currentPrize.countRemain < currentPrize.everyTimeGet ? currentPrize.countRemain : currentPrize.everyTimeGet;

  // 随机抽取数据
  const selectCardList = [];
  // 正式抽奖逻辑
  const prize = cookies.get('all_can_prize_list') ? cookies.get('all_can_prize_list') : ['龍運當頭奖', '萬事興龍奖', '好運龍龍奖', '欣欣向龍奖', '其樂龍龍奖']
  const hightPrize = ['特等奖', '一等奖Apple', '一等奖PS5', '二等奖大疆', '二等奖AirPods']
  if (!cookies.get('all_can_prize_list')) cookies.set('all_can_prize_list', JSON.stringify(prize))
  if (!prize.some(item => item === lotteryConfig.currentPrize)) {
    const arr = [];
    if (hightPrize.some(item => item === lotteryConfig.currentPrize)) {
      cardListRemainAllCopy.forEach(element => {
        if (element.allLottery) arr.push(element)
      });
    } else {
      cardListRemainAllCopy.forEach(element => {
        if (element.allLottery || element.special) arr.push(element)
      });
    }
    cardListRemainAllCopy = arr;
  }
  for (let i = 0; i < selectCount; i++) {
    const curSelectIndex = random(0, cardListRemainAllCopy.length - 1);
    const card = cardListRemainAllCopy.splice(curSelectIndex, 1)[0];
    selectCardList.push(card);
  }
  console.log('getRandomCard', JSON.parse(JSON.stringify(lotteryConfig)));

  // 分别统计出获奖和未获奖的名单
  lotteryConfig.cardListWinAll = [...lotteryConfig.cardListWinAll, ...selectCardList];
  lotteryConfig.cardListRemainAll = lotteryConfig.cardList.filter((item) => {
    const winItem = lotteryConfig.cardListWinAll.find(_ => _.id === item.id);
    return !winItem;
  });

  // 将当前奖项中奖人员统计
  currentPrize.cardListWin = [...currentPrize.cardListWin, ...selectCardList];
  currentPrize.countRemain = currentPrize.countRemain - selectCardList.length;
  currentPrize.round += 1;

  lotteryConfig.setLocalStorage();
  return selectCardList;
}

export { getRandomCard }
