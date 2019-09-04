/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
 * @namespace product
 */
import $ from 'jquery';
import Variants from '@shopify/theme-variants';
import {formatMoney} from '@shopify/theme-currency';
import {register} from '@shopify/theme-sections';
import Swiper from 'swiper';

import {setDisabled, setEnabled} from '../snippets/quantity-selector';

const selectors = {
  addToCart: '[data-add-to-cart]',
  addToCartText: '[data-add-to-cart-text]',
  comparePrice: '[data-compare-price]',
  comparePriceText: '[data-compare-text]',
  originalSelectorId: '[data-product-select]',
  priceWrapper: '[data-price-wrapper]',
  productImageWrapper: '[data-product-image-wrapper]',
  productFeaturedImage: '[data-product-featured-image]',
  productJson: '[data-product-json]',
  productPrice: '[data-product-price]',
  productThumbs: '[data-product-single-thumbnail]',
  singleOptionSelector: '[data-single-option-selector]',
  addToCartQuantity: '[data-quantity-selector]',
  productOptBrief: '#ProductOptBrief-',
  productSku: '.product-sku',
};

const cssClasses = {
  activeThumbnail: 'swiper-slide-active', /* active-thumbnail */
};

let productGalleryTop;
let productGalleryThumbs;
let isMustTrackInventory = true;

/**
 * Product section constructor. Runs on page load as well as Theme Editor
 * `section:load` events.
 * @param {string} container - selector for the section container DOM element
 */

export default register('product-header', {
  onLoad() {
    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    this.$container = $(this.container);
    this.namespace = `.${this.id}`;

    if (this.$container.length === 0) {
      return;
    }
    if (!$(selectors.productJson, this.$container).html()) {
      return;
    }

    this.productSingleObject = JSON.parse(
      $(selectors.productJson, this.$container).html(),
    );

    const options = {
      $container: this.$container,
      enableHistoryState: this.$container.data('enable-history-state') || false,
      singleOptionSelector: selectors.singleOptionSelector,
      originalSelectorId: selectors.originalSelectorId,
      product: this.productSingleObject,
    };

    isMustTrackInventory = this.$container.data('must-track-inventory') || true;

    this.settings = {};
    this.variants = new Variants(options);
    this.$featuredImage = $(selectors.productFeaturedImage, this.$container);

    this.$container.on(
      `variantChange${this.namespace}`,
      this._updateAddToCartState.bind(this),
      this._updateProductSku.bind(this),
    );
    this.$container.on(
      `variantPriceChange${this.namespace}`,
      this._updateProductPrices.bind(this),
    );

    if (this.$featuredImage.length > 0) {
      this.$container.on(
        `variantImageChange${this.namespace}`,
        this._updateImages.bind(this),
      );
    }
    this._initSlides();

    const isDisabled = $(selectors.addToCart, this.$container).prop('disabled');
    if (isDisabled) {
      setDisabled(this.productSingleObject.id);
    } else {
      setEnabled(this.productSingleObject.id);
    }
    this._updateProductOptBrief(this.productSingleObject);
  },

  _initSlides() {
    productGalleryTop = new Swiper('.product-header-gallery-top', {
      spaceBetween: 10,
      pagination: {
        el: '.swiper-pagination',
        type: 'fraction',
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
    productGalleryThumbs = new Swiper('.product-header-gallery-thumbs', {
      spaceBetween: 10,
      centeredSlides: true,
      slidesPerView: 'auto',
      touchRatio: 0.2,
      slideToClickedSlide: true,
    });
    productGalleryTop.controller.control = productGalleryThumbs;
    productGalleryThumbs.controller.control = productGalleryTop;
  },

  _setActiveThumbnail(imageId) {
    let newImageId = imageId;

    // If "imageId" is not defined in the function parameter, find it by the current product image
    if (typeof newImageId === 'undefined') {
      newImageId = $(
        `${selectors.productThumbs}.${cssClasses.activeThumbnail}`,
      ).data('thumbnail-id');
    }
    productGalleryThumbs.slides.each((i, slide) => {
      if ($(slide).data('thumbnail-id') === newImageId) {
        productGalleryThumbs.slideTo(i);
      }
    });
  },

  _switchImage(imageId) {
    const $newImage = $(
      `${selectors.productImageWrapper}[data-image-id='${imageId}']`,
      this.$container,
    );
    const $otherImages = $(
      `${selectors.productImageWrapper}:not([data-image-id='${imageId}'])`,
      this.$container,
    );
    $newImage.removeClass(cssClasses.hide);
    $otherImages.addClass(cssClasses.hide);
  },

  /**
   * Updates the DOM state of the add to cart button
   *
   * @param {boolean} enabled - Decides whether cart is enabled or disabled
   * @param {string} text - Updates the text notification content of the cart
   */
  _updateAddToCartState(evt) {
    const variant = evt.variant;

    if (variant) {
      $(selectors.priceWrapper, this.$container).removeClass(cssClasses.hide);
    } else {
      $(selectors.addToCart, this.$container).prop('disabled', true);
      $(selectors.addToCartText, this.$container).html(
        theme.strings.unavailable,
      );
      $(selectors.priceWrapper, this.$container).addClass(cssClasses.hide);
      return;
    }

    const isAvailable = this._isAvailable(variant);

    if (isAvailable) {
      $(selectors.addToCart, this.$container).prop('disabled', false);
      $(selectors.addToCartText, this.$container).html(theme.strings.addToCart);
    } else {
      $(selectors.addToCart, this.$container).prop('disabled', true);
      $(selectors.addToCartText, this.$container).html(theme.strings.soldOut);
    }
    this._switchProductInventory(evt, isAvailable);
  },

  _updateImages(evt) {
    const variant = evt.variant;
    const imageId = variant.featured_image.id;

    this._switchImage(imageId);
    this._setActiveThumbnail(imageId);
  },

  /**
   * Updates the DOM with specified prices
   *
   * @param {string} productPrice - The current price of the product
   * @param {string} comparePrice - The original price of the product
   */
  _updateProductPrices(evt) {
    const variant = evt.variant;
    const $priceWrapper = $(selectors.priceWrapper, this.$container);
    const $comparePrice = $(selectors.comparePrice, this.$container);
    const $compareEls = $comparePrice.add(
      selectors.comparePriceText,
      this.$container,
    );

    $priceWrapper
      .removeClass('animated flipInX')
      .delay(200)
      .queue((next) => {
        $priceWrapper.addClass('animated flipInX');
        $(selectors.productPrice, this.$container).html(
          formatMoney(variant.price, theme.moneyFormat),
        );

        if (variant.compare_at_price > variant.price) {
          $comparePrice.html(
            formatMoney(variant.compare_at_price, theme.moneyFormat),
          );
          $compareEls.removeClass(cssClasses.hide);
        } else {
          $comparePrice.html('');
          $compareEls.addClass(cssClasses.hide);
        }
        next();
      });
  },

  _switchProductInventory(evt, isAvailable) {
    const $quantitySelector = $(selectors.addToCartQuantity, this.$container);
    if ($quantitySelector.length === 0) {
      return;
    }

    const quantitySelectors = {
      inventoryOnlyLeft: '[data-only-left]',
      dataCurrentId: 'current-id',
      limitCntInput: 'input#limit-cnt-',
    };

    const currentProductId = $quantitySelector.data(quantitySelectors.dataCurrentId);
    const variant = evt.variant;
    const quantityInputId = $quantitySelector.data('quantity-id');

    const $addToCartQuantity = $(`#${quantityInputId}`, $quantitySelector);
    const $limitCnt = $(`${quantitySelectors.limitCntInput}${currentProductId}`, $quantitySelector);

    $addToCartQuantity.val('1');

    if (!isAvailable) {
      $limitCnt.val(0);
      setDisabled(currentProductId);
      return;
    }

    $limitCnt.val(variant.inventory_quantity);
    setEnabled(currentProductId);
  },

  _isAvailable(variant) {
    if (!variant) {
      return false;
    }
    if (isMustTrackInventory) {
      if (variant.inventory_management !== 'shopify') {
        return false;
      }
    }
    return variant.available;
  },

  _updateProductOptBrief(product) {
    const $elDesc = $(product.description);
    if ($elDesc.length === 0) {
      return;
    }
    const $brief = $(`${selectors.productOptBrief}${product.id}`);
    if ($brief.length === 0) {
      return;
    }

    if ($elDesc[0].className === 'product-brief-hidden') {
      $brief.append($elDesc[0]);
    }
  },

  _updateProductSku(evt) {
    const $productSku = $(selectors.productSku, this.$container);
    if ($productSku.length === 0) {
      return;
    }
    const variant = evt.variant;
    $productSku
      .removeClass('animated flipInX')
      .delay(200)
      .queue((next) => {
        $productSku.addClass('animated flipInX');
        const skus = variant.sku.split('G1029-');
        $productSku.html(skus[1]);
        next();
      });
  },

  /**
   * Event callback for Theme Editor `section:unload` event
   */
  onUnload() {
    this.$container.off(this.namespace);
    $.fancybox.destroy();
    productGalleryTop.destroy();
    productGalleryThumbs.destroy();
  },
});
