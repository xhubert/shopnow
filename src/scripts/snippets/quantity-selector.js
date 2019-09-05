import $ from 'jquery';

const selectors = {
  wrapper: '[data-quantity-selector].quantity-selector--snippet',
  inputCls: '.quantity-input',
  buttonCls: 'button.js-change-quantity',
  dataCurrentId: 'current-id',
  dataQuantityId: 'quantity-id',
  limitCnt: '#limit-cnt-',
  onlyLeft: '[data-only-left]',
};

function setDisabled(id) {
  const $container = $(`${selectors.wrapper}#quantity-selector-${id}`);
  if ($container.length === 0) {
    return;
  }
  $container.addClass('disabled');
  $container.find(selectors.buttonCls).prop('disabled', true);
  $container.find(selectors.inputCls).prop('disabled', true);
  $container.find(selectors.onlyLeft).addClass('hide');
}

function setEnabled(id) {
  const $container = $(`${selectors.wrapper}#quantity-selector-${id}`);
  if ($container.length === 0) {
    return;
  }
  const $plusBtn = $('button.product-plus.js-change-quantity', $container);
  const $minusBtn = $('button.product-minus.js-change-quantity', $container);
  const $quantityInput = $(`input[type=number]${selectors.inputCls}`, $container);
  const cntShowLeft = $container.find(selectors.onlyLeft).data('cnt-show-left');

  const currentId = $container.data(selectors.dataCurrentId);
  const limitCnt = parseInt($(`${selectors.limitCnt}${currentId}`, $container).val(), 10) || 0;

  $quantityInput.val(1);

  $container.removeClass('disabled');
  $container.find(selectors.inputCls).prop('disabled', false);

  $plusBtn.prop('disabled', false);
  $minusBtn.prop('disabled', true);
  $container.find(`${selectors.onlyLeft}>span`).html(limitCnt);
  if (limitCnt <= cntShowLeft) {
    $container.find(selectors.onlyLeft).removeClass('hide');
  } else {
    $container.find(selectors.onlyLeft).addClass('hide');
  }
}

function initQuantitySelector() {
  const $containers = $(selectors.wrapper);
  if ($containers.length === 0) {
    return;
  }

  $containers.each((i, container) => {
    const $quantityInput = $(`input[type=number]${selectors.inputCls}`, $(container));
    const $plusBtn = $('button.product-plus.js-change-quantity', $(container));
    const $minusBtn = $('button.product-minus.js-change-quantity', $(container));

    $(selectors.buttonCls, $(container)).on('click', (evt) => {
      evt.stopPropagation();
      const $this = $(evt.currentTarget);

      const currentId = $(container).data(selectors.dataCurrentId);
      const limitCnt = parseInt($(`${selectors.limitCnt}${currentId}`, $(container)).val(), 10) || 0;
      const func = $this.data('func');
      // const quantityInputId = $(container).data(selectors.dataQuantityId);
      const currentQuantity = parseInt($quantityInput.val(), 10) || 1;
      let tQuantity;

      switch (func) {
        case 'plus':
          tQuantity = currentQuantity + 1;
          if (tQuantity <= limitCnt) {
            $quantityInput.val(tQuantity);
            if (tQuantity === limitCnt) {
              $this.prop('disabled', true);
            }
          }
          if (tQuantity > 1) {
            $minusBtn.prop('disabled', false);
          }
          break;
        case 'minus':
          tQuantity = currentQuantity - 1;
          if (tQuantity >= 1) {
            $quantityInput.val(tQuantity);
            if (tQuantity === 1) {
              $this.prop('disabled', true);
            }
          }
          if (tQuantity < limitCnt) {
            $plusBtn.prop('disabled', false);
          }
          break;
        default:
          break;
      }
    });

    $quantityInput.on('change', (event) => {
      event.stopPropagation();
      const $this = $(event.currentTarget);

      const inputValue = parseInt($this.val(), 10) || 0;
      const currentId = $(container).data(selectors.dataCurrentId);
      const limitCnt = parseInt($(`${selectors.limitCnt}${currentId}`, $(container)).val(), 10) || 0;

      if (inputValue > 1 && inputValue < limitCnt) {
        $minusBtn.prop('disabled', false);
        $plusBtn.prop('disabled', false);
        return;
      }

      if (inputValue <= 0) {
        $this.val('1');
        $minusBtn.prop('disabled', true);
        $plusBtn.prop('disabled', false);
        return;
      }
      if (inputValue > limitCnt) {
        $this.val(limitCnt);
        $minusBtn.prop('disabled', false);
        $plusBtn.prop('disabled', true);
      }
    });
  });
}

/* eslint-disable no-undef */
module.exports = {
  initQuantitySelector,
  setDisabled,
  setEnabled,
};

