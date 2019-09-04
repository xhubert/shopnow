import $ from 'jquery';

const selectors = {
  containerCls: '.radio-btn-group--snippet',
  radioName: 'selector-name',
  dataActiveCls: 'data-actived-class',
};

const initRadioBtnGroup = () => {
  const $groups = $(`${selectors.containerCls}[data-${selectors.radioName}]`);
  if ($groups.length === 0) {
    return;
  }

  $groups.each((i, group) => {
    const radioName = $(group).data(selectors.radioName);
    const activedClass = $(group).attr(selectors.dataActiveCls) || 'active';
    $(`input[type=radio][name=${radioName}]`).change((event) => {
      const $this = $(event.currentTarget);
      $('>label', $(group)).removeClass(activedClass);
      $this.parent('label').toggleClass(activedClass);
    });
  });
};

/* eslint-disable no-undef */
export default initRadioBtnGroup;
