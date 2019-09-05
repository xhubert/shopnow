/**
 * Customer Addresses Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Customer Addresses
 * template.
 *
 * @namespace customerAddresses
 */
import $ from 'jquery';

const $newAddressForm = $('#AddressNewFormWrapper');

if ($newAddressForm.length) {
  // Initialize observers on address selectors, defined in shopify_common.js
  if (Shopify) {
    new Shopify.CountryProvinceSelector(
      'AddressCountryNew',
      'AddressProvinceNew',
      {
        hideElement: 'AddressProvinceContainerNew',
      },
    );
  }

  // Initialize each edit form's country/province selector
  $('.address-country-option').each(function() {
    const formId = $(this).data('form-id');
    const countrySelector = `AddressCountry_${formId}`;
    const provinceSelector = `AddressProvince_${formId}`;
    const containerSelector = `AddressProvinceContainer_${formId}`;

    new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
      hideElement: containerSelector,
    });
  });

  $('.address-delete').on('click', (evt) => {
    const $el = $(evt.currentTarget);
    const formId = $el.data('form-id');
    const confirmMessage = $el.data('confirm-message');
    const confirmTitle = $el.data('confirm-title');
    $.fancyConfirm({
      title: confirmTitle,
      message: confirmMessage,
      okButton: 'Ok, Agree!',
      noButton: 'Disagree',
      callback: (value) => {
        if (value) {
          Shopify.postLink(`/account/addresses/${formId}`, {
            parameters: {_method: 'delete'},
          });
        }
      },
    });
  });
}
