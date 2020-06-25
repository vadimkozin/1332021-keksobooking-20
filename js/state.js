'use strict';
// состояние интерактивных элементов: карты и формы

window.state = (function () {
  var state = {
    map: document.querySelector('.map'),
    adForm: document.querySelector('.ad-form'),
    adFormFieldsets: document.querySelectorAll('.ad-form fieldset'),
    filterForm: document.querySelector('.map__filters'),
    filterFormSelect: document.querySelectorAll('.map__filters select'),
    filterFormFieldsets: document.querySelectorAll('.map__filters fieldset'),

    setDisabled: function (elements) {
      for (var i = 0; i < elements.length; i++) {
        elements[i].setAttribute('disabled', '');
      }
    },

    setEnabled: function (elements) {
      for (var i = 0; i < elements.length; i++) {
        elements[i].removeAttribute('disabled');
      }
    },

    // установка НЕ активного состояния
    setInactiveState: function () {
      // ТЗ: Блок с картой .map содержит класс map--faded
      this.map.classList.add('map--faded');

      // ТЗ: Форма заполнения информации об объявлении .ad-form содержит класс .ad-form--disabled
      this.adForm.classList.add('ad-form--disabled');

      // ТЗ: Все <input> и <select> формы .ad-form заблокированы с помощью атрибута disabled, добавленного на них или на их родительские блоки fieldset
      this.setDisabled(this.adFormFieldsets);

      // ТЗ: Форма с фильтрами .map__filters заблокирована так же, как и форма .ad-form
      this.setDisabled(this.filterFormSelect);
      this.setDisabled(this.filterFormFieldsets);
    },

    // установка активного состояния
    setActiveState: function () {
      // У блока с картой .map убираем класс map--faded
      this.map.classList.remove('map--faded');

      // У формы заполнения информации об объявлении .ad-form убираем класс .ad-form--disabled
      this.adForm.classList.remove('ad-form--disabled');

      // Разблокируем <fieldset> формы .ad-form
      this.setEnabled(this.adFormFieldsets);

      // Разблокируем форму с фильтрами .map__filters
      this.setEnabled(this.filterFormSelect);
      this.setEnabled(this.filterFormFieldsets);
    },

  };

  return {
    setInactiveState: state.setInactiveState.bind(state),
    setActiveState: state.setActiveState.bind(state),
  };

})();
