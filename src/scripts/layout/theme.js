import '../../styles/theme.scss';
import '../../styles/theme.scss.liquid';

import $ from 'jquery';
import MobileDetect from 'mobile-detect';
import {focusHash, bindInPageLinks} from '@shopify/theme-a11y';
import {throttle} from 'throttle-debounce';

import {initDropdown, touchOutTohideDropdown} from '../snippets/dropdown';
import {checkCookies} from '../snippets/cookies-banner';
import {stickyHeader} from './components/sticky-header';
import {openSidebarNav} from './components/sidebar-nav';
import './components/fancy-confirm';
import {initJarallax} from './components/jarallax';

// Apply a specific class to the html element for browser support of cookies.
function cookiesEnabled() {
  let cookieEnabled = window.navigator.cookieEnabled;

  if (!cookieEnabled) {
    document.cookie = 'testcookie';
    cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
  }
  return cookieEnabled;
}

// Common a11y fixes
focusHash();
bindInPageLinks();

const isEnabledCookies = cookiesEnabled();
if (isEnabledCookies) {
  document.documentElement.className = document.documentElement.className.replace(
    'supports-no-cookies',
    'supports-cookies',
  );
}

const md = new MobileDetect(window.navigator.userAgent);
if (md.mobile() !== null) {
  document.documentElement.classList.add('is_mobile');
} else if (md.tablet() !== null) {
  document.documentElement.classList.add('is_tablet');
} else {
  document.documentElement.classList.add('is_desktop');
}

$(document).ready(() => {
  stickyHeader();
  $(window).on('scroll', throttle(100, stickyHeader));

  // Add the event of sidebar-nav toggler.
  $('#SidebarNavToggler').on('click', throttle(100, openSidebarNav));

  // Init the button of search in header navbar.
  $('#NavSearchToggler').bind('click', (event) => {
    event.stopPropagation();
    const $this = $(event.currentTarget);
    if ($('#NavBar').length === 0 || $('#NavSearchInput').length === 0) {
      return;
    }
    const targetId = $this.attr('aria-controls');
    if (!targetId || targetId === 'undefined') {
      return;
    }
    if ($(`#${targetId}`).length === 0 || !$(`#${targetId}`).is('form')) {
      return;
    }
    const $btnIcon = $this.find('.iconfont');
    if ($btnIcon.length === 0) {
      return;
    }
    const expanded = $this.attr('aria-expanded');
    if (expanded === 'false') {
      $('#NavBar > ul > li')
        .removeClass('animated zoomIn')
        .addClass('animated zoomOut');
      $(`#${targetId}`)
        .removeClass('animated fadeOutRightSmall hide')
        .addClass('animated fadeInRightSmall')
        .addClass('show');
      $btnIcon
        .removeClass('animated zoomIn')
        .addClass('animated zoomOut')
        .delay(200)
        .queue((next) => {
          $btnIcon
            .removeClass('icon-search zoomOut')
            .addClass('icon-close-line')
            .addClass('zoomIn');
          next();
        });
      $('#NavSearchInput').focus();
      $this.attr('aria-expanded', 'true');
    } else {
      $btnIcon
        .removeClass('animated zoomIn')
        .addClass('animated zoomOut')
        .delay(200)
        .queue((next) => {
          $btnIcon
            .removeClass('icon-close-line zoomOut')
            .addClass('icon-search')
            .addClass('zoomIn');
          next();
        });
      $(`#${targetId}`)
        .removeClass('animated fadeInRightSmall show')
        .addClass('animated fadeOutRightSmall')
        .delay(200)
        .queue((next) => {
          $(`#${targetId}`).addClass('hide');
          next();
        });
      $('#NavSearchInput').blur();
      $('#NavBar > ul > li').removeClass('animated zoomOut')
        .addClass('animated zoomIn');
      $this.attr('aria-expanded', 'false');
    }
  });

  const $hoverActions = $('a.hover-action');
  if ($hoverActions.length > 0) {
    if ($('html').hasClass('no-touch')) {
      $hoverActions.each((i, element) => {
        const $hoverActionItems = $('.hover-action-item', $(element));
        const aniInName = $(element).data('hoverin-action');
        const aniOutName = $(element).data('hoverout-action');
        $(element).mouseenter(() => {
          $hoverActionItems
            .removeClass(aniOutName)
            .addClass(aniInName)
            .delay(150)
            .queue((next) => {
              $hoverActionItems
                .css({display: 'block'});
              next();
            });
        }).mouseleave(() => {
          $hoverActionItems
            .removeClass(aniInName)
            .addClass(aniOutName)
            .delay(300)
            .queue((next) => {
              $hoverActionItems
                .css({display: 'none'});
              next();
            });
        });
      });
    }
  }

  initJarallax();
  initDropdown();
  if ($('html').hasClass('touch')) {
    touchOutTohideDropdown();
  }
  $('a.contact-btn').removeClass('hide');
});

$(window).on('load', () => {
  if (isEnabledCookies) {
    checkCookies(isEnabledCookies);
  }
});
