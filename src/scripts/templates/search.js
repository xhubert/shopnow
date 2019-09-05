import $ from 'jquery';

function mark(keywords, $els) {
  // Remove previous marked elements and mark
  // the new keyword inside the context
  const options = {
    className: 'mark-words',
  };
  $els.unmark({
    done: () => {
      $els.mark(keywords, options);
    },
  });
}

$(document).ready(() => {
  const $q = $('.search-result');
  if ($q.length === 0) {
    return;
  }

  const kw = $q.data('key-words');

  const $results = $('[data-search-result-item]');

  mark(kw, $results);

});

