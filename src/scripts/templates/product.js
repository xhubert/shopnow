/**
 * If need load a certain section:
 * `import '../sections/section.js';`
 * then do somthing in the file in which you can use import.
 */
import {load} from '@shopify/theme-sections';

import productHeaderSection from '../sections/product-header';
import {initQuantitySelector} from '../snippets/quantity-selector';
import initRadioBtnGroup from '../snippets/radio-btn-group';

document.addEventListener('DOMContentLoaded', () => {
  load(productHeaderSection);
  initQuantitySelector();
  initRadioBtnGroup();
});
