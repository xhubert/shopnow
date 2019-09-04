import $ from 'jquery';

const selectors = {
  sectionId: '#SidebarNav', /* Section's container. */
  contentMaskId: '#ContentMask',
  offsetContent: '.offcanvas-content',
};

const $html = $('html');
// Define the function of closing sidebar-nav.
let timer;
function closeSidebarNav(targetId) {
  if (!targetId || targetId === 'undefined') {
    return;
  }
  const $target = $(`#${targetId}`);
  if ($target.length === 0) {
    return;
  }
  $html.removeClass('offcanvas');
  $(selectors.contentMaskId)
    .removeClass('show')
    .unbind('click')
    .unbind('tap');
  $(selectors.offsetContent).removeClass('offcanvas');
  timer = window.setTimeout(() => {
    $target.removeClass('opened');
  }, 350);
}

function openSidebarNav(event) {
  event.stopPropagation();
  const $this = $(event.currentTarget);
  const targetId = $this.attr('aria-controls');
  if (!targetId || targetId === 'undefined') {
    return;
  }
  const $target = $(`#${targetId}`);
  if ($target.length === 0) {
    return;
  }
  if ($(selectors.contentMaskId).length === 0) {
    return;
  }
  if ($target.hasClass('opened')) {
    closeSidebarNav(targetId);
  } else {
    window.clearTimeout(timer);
    $target.addClass('opened');
    $html.addClass('offcanvas');
    $(selectors.offsetContent).addClass('offcanvas');
    $(selectors.contentMaskId)
      .addClass('show')
      .bind('click', () => {
        closeSidebarNav(targetId);
      })
      .bind('tap', () => {
        closeSidebarNav(targetId);
      });
  }
}

/* eslint-disable no-undef */
module.exports = {
  openSidebarNav,
};
