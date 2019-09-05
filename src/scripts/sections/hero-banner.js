import $ from 'jquery';
import {register} from '@shopify/theme-sections';
import Swiper from 'swiper';

const selectors = {
  el: '.swiper-container',
  pagination: '.swiper-pagination',
  nextEl: '.swiper-button-next',
  prevEl: '.swiper-button-prev',
  slideImg: '.slide__image',
};

const sliders = [];

export default register('hero-banner', {
  onLoad() {
    this.$container = $(this.container);
    if (this.$container.length === 0) {
      return;
    }
    const sectionId = this.$container.attr('data-section-id');
    this.$banner = $(`#HeroBanner-${sectionId}`);
    if (this.$banner.length === 0) {
      return;
    }
    this.settings = {
      loop: this.$banner.data('loop'),
      speed: this.$banner.data('speed'),
      parallax: true,
      effect: 'fade',
      autoplay: {
        delay: 5000,
      },
      pagination: {
        el: selectors.pagination,
        clickable: true,
      },
      navigation: {
        nextEl: selectors.nextEl,
        prevEl: selectors.prevEl,
      },
    };
    const aSwiper = new Swiper(this.$banner, this.settings);
    $(`#HeroBanner-${sectionId}`)
      .find(selectors.slideImg)
      .addClass('lazyload');
    aSwiper.init();
    sliders.push(aSwiper);
  },
  onUnload() {
    sliders.forEach((slider) => {
      slider.destroy();
    });
  },
});
