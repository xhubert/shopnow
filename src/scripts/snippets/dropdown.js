import $ from 'jquery';

const selectors = {
  dropdownCls: '.dropdown-menu',
  togglerCls: '.dropdown-toggler',
  contentCls: '.dropdown-content__wrapper',
  dataRemoveTriangleH: 'remove-triangle-h',
  dropdownContentArrow: '.dropdown-content-arrow',
};

const triangleH = 10;

function showDropdownContent($el) {
  if ($el.length === 0) {
    return;
  }
  // const $this = $(event.currentTarget);
  const $drowdownContent = $el.find(selectors.contentCls);
  if ($drowdownContent.length === 0) {
    return;
  }
  let togglerH = $el.height();
  if ($el.data(selectors.dataRemoveTriangleH)) {
    togglerH -= triangleH;
  } else {
    togglerH -= 2;
  }
  const menuW = $el.outerWidth();
  const menuPositionLeft = $el.offset().left;
  let dropdownContentW = $drowdownContent.outerWidth();
  if ($(window).width() <= dropdownContentW) {
    dropdownContentW = $(window).width() - (($(window).width() - menuPositionLeft - $el.outerWidth()) * 2);
    $drowdownContent.css({
      width: dropdownContentW,
    });
  }
  const $dropdownContentArrow = $(selectors.dropdownContentArrow, $drowdownContent);
  $drowdownContent.css({top: togglerH});
  if ((menuPositionLeft + $el.outerWidth() - 15) >= dropdownContentW) {
    $drowdownContent.css({
      right: parseInt($el.css('marginRight'), 10) / 2,
      left: 'auto',
    });
    $dropdownContentArrow.css({
      left: 'auto',
      right: (menuW / 2) - 10,
    });
  } else {
    $drowdownContent.css({
      left: 0,
      right: 0,
    });
    $dropdownContentArrow.css({
      left: $el.offset().left,
      right: 'auto',
    });
  }
  $drowdownContent
    .stop()
    .removeClass('fadeOutDownSmall')
    .addClass('fadeInUpSmall show');
  $el.attr('aria-expanded', true);
}

function hideDropdownContent($el) {
  if ($el.length === 0) {
    return;
  }

  const $drowdownContent = $el.find(selectors.contentCls);
  $drowdownContent
    .stop()
    .removeClass('fadeInUpSmall')
    .addClass('fadeOutDownSmall')
    .delay(300)
    .queue((next) => {
      $drowdownContent.removeClass('show');
      next();
    });
  $el.attr('aria-expanded', false);
}
function hideDropdownContents() {
  const $shownDropdownContents = $(selectors.contentCls).filter('.show');
  if ($shownDropdownContents.length === 0) {
    return;
  }
  $shownDropdownContents
    .stop()
    .removeClass('fadeInUpSmall')
    .addClass('fadeOutDownSmall')
    .delay(300)
    .queue((next) => {
      $shownDropdownContents.removeClass('show');
      next();
    });
  $(selectors.dropdownCls).attr('aria-expanded', false);
}

// Init the button of dropdown toggler.
function initDropdown() {
  const $dropDowns = $(selectors.dropdownCls);
  if ($('html').hasClass('no-touch')) {
    $dropDowns.hover(
      (event) => {
        const $el = $(event.currentTarget);
        showDropdownContent($el);
      },
      (event) => {
        const $el = $(event.currentTarget);
        hideDropdownContent($el);
      },
    );
  }
  if ($('html').hasClass('touch')) {
    $dropDowns.find(selectors.togglerCls).on('click touchstart', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const $this = $(event.currentTarget);
      const $dropdown = $this.parent(selectors.dropdownCls);
      const isDropdown = $dropdown.attr('aria-expanded');
      if (isDropdown === 'true') {
        hideDropdownContent($dropdown);
      } else {
        hideDropdownContents();
        // setti
        showDropdownContent($dropdown);
      }
    });
  }
}

// Close the dropdown menu if the user clicks outside of it
function touchOutTohideDropdown() {
  $(window).on('click touchstart', (event) => {
    if (event.target.matches(selectors.togglerCls)) {
      return;
    }
    hideDropdownContents();
  });
  $(window).on('touchmove', () => {
    hideDropdownContents();
  });
}

/* eslint-disable no-undef */
module.exports = {
  initDropdown,
  touchOutTohideDropdown,
};
