import { getCookie } from './utils.js';

const saveChatBeforeQuit = () => {
  localStorage.avalonMessages = frames[2].frames[1].document.querySelector('#chat-channels').children[1].innerHTML;
};

export const reloadPage = () => {
  if ( getCookie('ext-carnage-auto-reload-page') === 'false' ) return;

  needToReloadWindow = false;

  saveChatBeforeQuit();

  const currentURL = window.location.href;

  window.open(currentURL, '_blank');
  window.close()
};