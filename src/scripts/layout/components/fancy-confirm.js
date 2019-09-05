import $ from 'jquery';

$.fancyConfirm = (opts) => {
  const newOpts = $.extend(true, {
    title: 'Are you sure?',
    message: '',
    okButton: 'OK',
    noButton: 'Cancel',
    callback: $.noop,
  }, opts || {});

  $.fancybox.open({
    type: 'html',
    src: `<div class="fancy-content confirm-modal">
    <div class="h3" style="margin-bottom: 15px;">${newOpts.title}</div>
    <p>${newOpts.message}</p>
    <div class="text-right">
    <button class="btn btn-accent text-uppercase" data-value="0" data-fancybox-close>${newOpts.noButton}</button>
    <button data-value="1" data-fancybox-close class="btn btn-primary text-uppercase">${newOpts.okButton}</button>
    </div></div>`,
    opts: {
      animationEffect: 'zoom-in-out',
      modal: false,
      afterClose: (instance, current, evt) => {
        const button = evt ? evt.target || evt.currentTarget : null;
        const value = button ? $(button).data('value') : 0;
        opts.callback(value);
      },
    },
  });
};
