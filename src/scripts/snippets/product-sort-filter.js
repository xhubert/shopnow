import $ from 'jquery';

const selectors = {
  wrapper: '[data-product-sort-filter].product-sort-filter--snippet',
  itemCls: '.sort-by-key',
  defaultSort: '#DefaultSortBy',
};

const constants = {
  SORT_BY: 'sort_by',
};

// function _resizeSelect($selection) {
//   const arrowWidth = 16;
//   const text = $selection.find('option:selected').text();
//   const $test = $('<span>').html(text);

//   // add to body, get width, and get out
//   $test.appendTo('body');
//   const width = $test.width();
//   $test.remove();
//   $selection.width(width + arrowWidth);
// }

function _onFilterChange(evt, $container) {
  const $this = $(evt.currentTarget);
  const sort = $this.data('value');
  const defaultSort = $(selectors.defaultSort, $container).val();

  const query = (sort !== defaultSort) ? `${constants.SORT_BY}=${sort}` : '';

  if (query.length) {
    window.location.search = query;
  } else {
    // clean up our url if the sort value is blank for default
    window.location.href = window.location.href.replace(
      window.location.search,
      '',
    );
  }
}

function initSortFilter() {
  const $containers = $(selectors.wrapper);
  if ($containers.length === 0) {
    return;
  }

  $containers.each((i, container) => {
    const $sortItems = $(selectors.itemCls, $(container));
    $sortItems.on('click', (evt) => {
      _onFilterChange(evt, $(container));
    });
  });
}

/* eslint-disable no-undef */
module.exports = {
  initSortFilter,
};

