console.log('CRNG content');
const myNickName = 'SICKO MODE';
// const avatar_url = 'http://img.carnage.ru/i/obraz/0_IND0012M.jpg';
let autofightCreateWait = false;

// #################### HELPERS

const getCookie = (name) => {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
};

function setCookie(name, value, options = {}) {

  options = {
    path: '/',
    // при необходимости добавьте другие значения по умолчанию
    ...options
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

function deleteCookie(name) {
  setCookie(name, "", {
    'max-age': -1
  })
}

const getIdentificator = () => {
  let cookieName = 'identifND';

  if (sessionStorage[cookieName]) {
    return +sessionStorage[cookieName];
  }

  if (!frames[1].document.querySelector('input[name="nd"]')) {
    frames[1].document.location.href = `https://avalon.endlesswar.ru/inventory.php?${Math.random()}`
    console.log('Нужно зайти в инвентарь!');
    return false;
  }

  let identificator = frames[1].document.querySelector('input[name="nd"]').value;

  sessionStorage[cookieName] = `${identificator}`

  return identificator
};

const currentHp = () => {
  return +frames[0].document.querySelector('#dvhp').innerText;
};

const maxHp = () => {
  return +frames[0].document.querySelector('#dvmaxhp').innerText;
};

const currentMana = () => {
  return +frames[0].document.querySelector('#dvmana').innerText;
};

const maxMana = () => {
  return +frames[0].document.querySelector('#dvmaxmana').innerText;
};



// #################### MAIN functions

const main_interval = setInterval(() => {
  autofight();

  autoCreateFight();
}, 1500);

let needToReloadWindow = false;
setTimeout(() => {
  needToReloadWindow = true;
}, 60000 * 10) // 10 minutes


setTimeout(() => {
  if (localStorage.avalonMessages && frames[2] && localStorage.avalonMessages) {
    const chatContainer = frames[2].frames[1].document.querySelector('#chat-channels').children[1];
    chatContainer.innerHTML = `${localStorage.avalonMessages}${chatContainer.innerHTML}`;
  }
}, 5000);


// AUTOFIGHT ####################

let isFightJustStarted = false;
let needToWaitInFight = false;
let beginningDelay = false;

let callDragonsInFight = false; // TODO
let needToUseMana = false; // TODO

const manaUses = {
  current: 0,
  max: 1,
};

const autofight = () => {
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

// AUTOFIGHT END ####################

const spinDemiurgsWheel = async () => {
  let identificator = getIdentificator();

  if (!identificator) return;

  console.log('Крутим колесо');

  let rand = Math.random();

  let response = await fetch(`https://avalon.endlesswar.ru/wheel.php?cmd=wheel.turn&nd=${identificator}&${rand}`, {
    method: "GET",
    referrer: "https://avalon.endlesswar.ru/lotery.php",
  });

  let responseInnerData = '';

  if (response.ok) { // если HTTP-статус в диапазоне 200-299
    responseInnerData = await response.text()
  } else {
    alert("Ошибка HTTP: " + response.status);
  }

  let tempDom = document.createElement('p');
  tempDom.innerHTML = responseInnerData;

  console.log('Result: ', tempDom.children[0].children[0].getAttribute('text'))
};

const shadowFight = () => {
  console.log('Fighting with Shadow!');
  frames[1].document.location.href = `https://avalon.endlesswar.ru/zayavka.php?level=duel&duel_shadow=1`;
};

const haotFightCreate = () => {
  let identificator = getIdentificator();

  if (!identificator) return false;

  console.log('Creating haot fight');
  // frames[1].document.location.href = `https://avalon.endlesswar.ru/zayavka.php?nd=${identificator}&cmd=haot.create&gradesmembers=3&startime2=3&timeout=3&cmt=&open=1`
  // frames[1].document.location.href = `https://avalon.endlesswar.ru/zayavka.php?nd=${identificator}&cmd=haot.create&gradesmembers=3&startime2=3&timeout=3&blood=1&cmt=&open=1`

  frames[1].document.location.href = `https://avalon.endlesswar.ru/map.php?cmd=hell`;

  return true;
};

const autoCreateFight = () => {
  if (autofightCreateWait) return;

  const autocreate_with_bot = getCookie('ext-carnage-auto-create-haot-fight') == 'true';
  if (!autocreate_with_bot) return;
  if (!frames[1] || !frames[1].document) return;

  let locationStr = frames[1].document.location.href;
  if (locationStr.includes('https://avalon.endlesswar.ru/fbattle.php')) return

  if ( maxHp() != +getCookie('ext-carnage-mymaxhp') ) return;

  // if (
  //     ( currentHp() + 150 <= maxHp() ) ||
  //     ( currentMana() + 150 <= maxMana() )
  //   ) {

  if (
      ( currentHp() < maxHp() ) ||
      ( currentMana() < maxMana() ) ||
      +frames[0].document.querySelector('#dvmonster').getAttribute('data-dvmonster') < 5
    ) {

    // if (
    //     (
    //       ( currentHp() <= (maxHp() / 1.6) ) ||
    //       ( currentMana() <= (maxMana() / 1.6) )
    //     ) && getCookie('ext-carnage-auto-regeneration-in-hospital') === 'true'
    //   ) {
    //   console.log('Need to USE hospital');

    //   hospitalCure();

    //   autofightCreateWait = true;

    //   setTimeout(() => {
    //     autofightCreateWait = false;
    //   }, 1000 * 5); // 5 sec

    //   return;
    // }

    console.log('Regeneration...');
    return;
  }

  if ( !haotFightCreate() ) return

  console.log('Создаем заявку на бой');
  autofightCreateWait = true;

  setTimeout(() => {
    autofightCreateWait = false;
  }, 60000 * 3); // 3 mins

};

const hospitalCure = () => {
  let identificator = getIdentificator();
  if (!identificator) return;

  console.log('Hospital Cure');
  frames[1].document.location.href = `https://avalon.endlesswar.ru/hospital.php?cmd=hospital.show&set=recovery&nd=${identificator}&${Math.random()}`
};




const reloadPage = () => {
  if ( getCookie('ext-carnage-auto-reload-page') === 'false' ) return;

  needToReloadWindow = false;

  saveChatBeforeQuit();

  const currentURL = window.location.href;

  window.open(currentURL, '_blank');
  window.close()
};

const clearChat = () => {
  frames[2].frames[1].document.querySelector('#chat-channels').children[1].innerHTML = ``;
  localStorage.avalonMessages = '';
};

const saveChatBeforeQuit = () => {
  localStorage.avalonMessages = frames[2].frames[1].document.querySelector('#chat-channels').children[1].innerHTML;
};

// #################### COOKIE button setters | must be placed in the bottom

const cookieButtons = [
  {cookieName: 'ext-carnage-spin-wheel', func: spinDemiurgsWheel},
  {cookieName: 'ext-carnage-shadow-fight', func: shadowFight},
  {cookieName: 'ext-carnage-haot-fight-create', func: haotFightCreate},
  {cookieName: 'ext-carnage-hospital-cure', func: hospitalCure},
  {cookieName: 'ext-carnage-clear-chat', func: clearChat},
];

cookieButtons.forEach(el => {
  deleteCookie(el.cookieName);
});

const checkCookie = function() {
    var lastCookie = document.cookie; // 'static' memory between function calls

    return function() {
        var currentCookie = document.cookie;

        if (currentCookie != lastCookie) {
            // something useful like parse cookie, run a callback fn, etc.
            lastCookie = currentCookie; // store latest cookie

            cookieButtons.forEach((el) => {
              if (getCookie(el.cookieName) == 'true') {
                el.func();
                deleteCookie(el.cookieName);
              }
            });
        }
    };
}();

window.setInterval(checkCookie, 100); // run every 100 ms
