const selectors = {
  wrapper: '.jarallax',
};

function initJarallax() {
  const $jarallax = $(selectors.wrapper);
  if ($jarallax.length === 0) {
    return;
  }
  $jarallax.jarallax({
    speed: 0.3,
    disableParallax: () => {
      return (/iPad|iPhone|iPod|Android/.test(window.navigator.userAgent));
    },
    disableVideo: /iPad|iPhone|iPod|Android/,
  });
}
/* eslint-disable no-undef */
module.exports = {
  initJarallax,
};

// export default register('image-with-overlay', {
//   onLoad() {
//     this.$container = $(this.container);
//     const sectionId = this.$container.attr('data-section-id');
//     this.$section = $(`#ImageWithOverlay-${sectionId}`);
//     $(`#ImageWithOverlay-${sectionId} ${selectors.wrapper}`).jarallax({
//       speed: 0.3,
//       disableParallax: () => {
//         return (/iPad|iPhone|iPod|Android/.test(window.navigator.userAgent) || this.$section.data('noParallax'));
//       },
//       disableVideo: /iPad|iPhone|iPod|Android/,
//     });
//   },
// });
