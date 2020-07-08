'use strict';
// состояние интерактивных элементов: карты и формы

window.state = (function () {
  var state = {
    mapElement: document.querySelector('.map'),
    adFormElement: document.querySelector('.ad-form'),
    adFormFieldsetElements: document.querySelectorAll('.ad-form fieldset'),
    filterFormSelectElements: document.querySelectorAll('.map__filters select'),
    filterFormFieldsetElements: document.querySelectorAll('.map__filters fieldset'),

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
      this.mapElement.classList.add('map--faded');

      // ТЗ: Форма заполнения информации об объявлении .ad-form содержит класс .ad-form--disabled
      this.adFormElement.classList.add('ad-form--disabled');

      // ТЗ: Все <input> и <select> формы .ad-form заблокированы с помощью атрибута disabled, добавленного на них или на их родительские блоки fieldset
      this.setDisabled(this.adFormFieldsetElements);

      // ТЗ: Форма с фильтрами .map__filters заблокирована так же, как и форма .ad-form
      this.setDisabled(this.filterFormSelectElements);
      this.setDisabled(this.filterFormFieldsetElements);
    },

    // установка активного состояния
    setActiveState: function () {
      // У блока с картой .map убираем класс map--faded
      this.mapElement.classList.remove('map--faded');

      // У формы заполнения информации об объявлении .ad-form убираем класс .ad-form--disabled
      this.adFormElement.classList.remove('ad-form--disabled');

      // Разблокируем <fieldset> формы .ad-form
      this.setEnabled(this.adFormFieldsetElements);

      // Разблокируем форму с фильтрами .map__filters
      this.setEnabled(this.filterFormSelectElements);
      this.setEnabled(this.filterFormFieldsetElements);
    },

  };

  return {
    setInactiveState: state.setInactiveState.bind(state),
    setActiveState: state.setActiveState.bind(state),
  };

})();
