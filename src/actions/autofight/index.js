import { getCookie } from '../../utils.js';
import { reloadPage } from '../../helpers.js';

let isFightJustStarted = false;
let needToWaitInFight = false;
let beginningDelay = false;

let callDragonsInFight = false; // TODO
let needToUseMana = false; // TODO

const manaUses = {
  current: 0,
  max: 1,
};

export const autofight = (needToReloadWindow) => {
  const autofight_on = getCookie('ext-carnage-autofight') == 'true';
  if (!autofight_on) return;
  if (!frames[1] || !frames[1].document) return;

  let locationStr = frames[1].document.location.href;

  if (locationStr.includes('https://avalon.endlesswar.ru/fbattle.php')) {
    if (needToWaitInFight || beginningDelay) {
      console.log('Waiting...');
      return;
    }

    if (isFightJustStarted) {
      isFightJustStarted = false;

      callDragonsInFight = +getCookie('ext-carnage-autofight-animals');
      if (callDragonsInFight && callDragonsInFight > 0) {
        callDragonsForFight(callDragonsInFight);
      }

      const isSetBeginningDelay = +getCookie('ext-carnage-autofight-delay');
      if (isSetBeginningDelay && isSetBeginningDelay > 0) {
        beginningDelay = true;
        setTimeout(() => {
          beginningDelay = false;
        }, isSetBeginningDelay*1000);
      }

      return;
    }

    needToUseMana = +getCookie('ext-carnage-autofight-mana');
    if (needToUseMana && needToUseMana > 0) {
      manaUses.max = needToUseMana;
      if (useMana()) return;
    }

    console.log('Hit an oppenent');

    if (frames[1].document.forms['bform']) {
        frames[1].document.forms['bform'].submit();
        return;
    } else if (frames[1].document.querySelector('#buttonRefresh')) {
        if (needToReloadWindow) {
          reloadPage();
        }

        frames[1].document.querySelector('#buttonRefresh').click();
        return;
    }

    exitTheFight();
  } else {
    // console.log('not in a fight');
    isFightJustStarted = true;

    if (needToReloadWindow) {
      reloadPage();
    }
  }
};

const exitTheFight = () => {
  if (frames[1].document.querySelector('.xbbutton')) {
    frames[1].document.querySelector('.xbbutton').click();

    isFightJustStarted = true;
    manaUses.current = 0;
  }
};

const callDragonsForFight = (numOfCalls) => {
  needToWaitInFight = true;
  const delay = 3000;

  for(let i =0; i < numOfCalls; i++) {
    setTimeout(() => {
      console.log('Call dragon num: ', i+1);

      frames[1].location.href = 'https://avalon.endlesswar.ru/fbattle.php?cmd=ability.summon_pet';;
    }, (i+1)*delay);
  }

  setTimeout(() => {
    needToWaitInFight = false;
  }, (numOfCalls+1)*delay);
};

const useMana = () => {
  if (manaUses.current >= manaUses.max) return false;
  const manaGap = 100;

  if (currentMana() + manaGap < maxMana()) {
    console.log('using mana')

    clickOnRuna('https://img.endlesswar.ru/i/rune/37.gif');

    manaUses.current += 1;

    needToWaitInFight = true;

    setTimeout(() => {
      needToWaitInFight = false;
    }, 3000);

    return true;
  } else {
    return false;
  };
};

const clickOnRuna = (src) => {
  runesNodes = [...frames[1].document.querySelectorAll('li[data-slot-name="rune"]')];

  runesNodes.find(node => {
    const imgNode = node.querySelector('img');

    if (imgNode) {
      if (imgNode.src === src) {
        let str = '' + imgNode.getAttribute('onclick');

        let link = str.match(/window.location=(.*);}/)[1].trim();

        link = link.slice(1, -1);

        frames[1].document.location.href = `https://avalon.endlesswar.ru/${link}`;

        // https://avalon.endlesswar.ru/fbattle.php?use=9219308
        return true;
      }
    }
  });
};
