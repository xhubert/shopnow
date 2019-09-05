import $ from 'jquery';

const stickyHeaderParas = {
  previousScrollPosition: 0,
  offsetTop: 550,
  offsetReset: 200,
  stickyClass: 'js-sticky-header',
  openTransitionClass: 'js-sticky-header--open',
};

let scrollTimeout;

function stickyHeader() {
  const currentScrollTop = $(window).scrollTop();
  if (currentScrollTop < 0) { return; }
  // scroll down && we're below the header
  if (currentScrollTop > stickyHeaderParas.previousScrollPosition) {
    $('body').addClass(stickyHeaderParas.stickyClass);

    if (currentScrollTop > stickyHeaderParas.offsetTop) {
      scrollTimeout = window.setTimeout(() => {
        $('body').addClass(
          stickyHeaderParas.openTransitionClass,
        );
      }, 50);
    }
    stickyHeaderParas.previousScrollPosition = currentScrollTop;
  }

  // scroll Up
  if (currentScrollTop < stickyHeaderParas.previousScrollPosition) {
    window.clearTimeout(scrollTimeout);
    // show the regular ol' site header at the top of the page
    if (currentScrollTop < stickyHeaderParas.offsetReset) {
      $('body')
        .removeClass(stickyHeaderParas.stickyClass)
        .removeClass(stickyHeaderParas.openTransitionClass);
      stickyHeaderParas.previousScrollPosition = currentScrollTop;
    }
  }
}

/* eslint-disable no-undef */
module.exports = {
  stickyHeader,
};

