import $ from 'jquery';

const selectors = {
  containerId: '#CookiesBannerContainer',
  messageId: '#CookiesMessage',
  acceptBtnId: '#AcceptCookiesBtn',
};

function closeCookiesWindow() {
  window.localStorage.cookiesAccepted = true;
  const $cookiesMessage = $(selectors.messageId);
  if ($cookiesMessage.length === 0) {
    return;
  }
  $cookiesMessage
    .removeClass('fadeInUp')
    .addClass('fadeOutDown')
    .delay(300)
    .queue((next) => {
      $cookiesMessage.removeClass('cookies-message-open');
      next();
    });
}

function initBtnEvent() {
  const $btn = $(selectors.acceptBtnId);
  if ($btn.length === 0) {
    return;
  }
  $btn.on('click', closeCookiesWindow);
}

// Init the button of dropdown toggler.
function checkCookies() {
  if (window.localStorage.cookiesAccepted) {
    return;
  }
  initBtnEvent();
  if (!window.localStorage.cookiesAccepted) {
    const $cookiesMessage = $(selectors.messageId);
    if ($cookiesMessage.length === 0) {
      return;
    }
    $cookiesMessage
      .addClass('fadeInUp')
      .delay(300)
      .queue((next) => {
        $cookiesMessage.addClass('cookies-message-open');
        next();
      });
  }
}

/* eslint-disable no-undef */
module.exports = {
  checkCookies,
};
