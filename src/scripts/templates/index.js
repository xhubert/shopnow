import {load} from '@shopify/theme-sections';

import heroBannerSection from '../sections/hero-banner';

document.addEventListener('DOMContentLoaded', () => {
  load([
    heroBannerSection,
  ]);
});
