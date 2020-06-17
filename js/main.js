'use strict';
// главный модуль

(function () {
  // состояние интерактивных элементов: карты и формы
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

  // адрес
  var address = {

    elementAddress: document.querySelector('#address'),

    // вычисление координат в виде {x,y} в зависимости от расположения маркера и состояния
    getCoord: function (marker, markerState) {
      var width = 0;
      var height = 0;

      switch (markerState) {
        case 'main-active':
          height = window.cfg.mark.MAIN_ACTIVE_HEIGHT;
          width = window.cfg.mark.MAIN_ACTIVE_WIDTH;
          break;
        case 'main-inactive':
          height = window.cfg.mark.MAIN_INACTIVE_HEIGHT;
          width = window.cfg.mark.MAIN_INACTIVE_WIDTH;
          break;
        default:
          width = window.cfg.mark.WIDTH;
          height = window.cfg.mark.HEIGHT;
          break;
      }

      var x = Math.round(parseInt(marker.style.left, 10) + width / 2);
      var y = Math.round(parseInt(marker.style.top, 10) + height);

      return {
        x: x,
        y: y
      };

    },

    // заполнение поля адреса
    setAddress: function (marker, markerState) {
      var coord = this.getCoord(marker, markerState);
      this.elementAddress.value = coord.x + ',' + coord.y;
    },

  };

  // главная метка
  var mainPin = {

    // ссылка на главную метку
    element: document.querySelector('.map__pin--main'),

    // установка обработчиков на главную метку
    installHandle: function () {
      this.element.addEventListener('mousedown', onMousedownMapPinMain);
      this.element.addEventListener('keydown', onKeydownMapPinMain);
    },

    // снятие обработчиков с главной метки
    removeHandle: function () {
      this.element.removeEventListener('mousedown', onMousedownMapPinMain);
      this.element.removeEventListener('keydown', onKeydownMapPinMain);
    },

  };

  function onMousedownMapPinMain(evt) {
    window.util.isLeftMouseButtonClick(evt, goActiveState);
  }

  function onKeydownMapPinMain(evt) {
    window.util.isEnterEvent(evt, goActiveState);
  }

  function goActiveState() {
    // перевод элементов в активное состояние
    state.setActiveState();
    // заполнение поля адреса в активном состоянии
    address.setAddress(mainPin.element, 'main-active');
    // отрисовка похожих объявлений-меток на карте
    window.map.showPins();
    // установка обработчиков на метки
    installHandlersOnMapPins();
    // снятие обработчиков с главного маркера
    mainPin.removeHandle();
  }

  // установка обработчиков на метки
  function installHandlersOnMapPins() {
    var mapPins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    var className = 'map__pin--active';

    for (var i = 0; i < mapPins.length; i++) {
      mapPins[i].addEventListener('click', onClickMapPin);
    }

    function onClickMapPin(evt) {

      var parrent = evt.target.closest('button');
      var offerId = Number(parrent.dataset.offerId);
      var offer = window.data.getOfferById(offerId);

      window.card.close();

      window.card.open(offer, parrent, deselectAllPins);

      parrent.classList.add(className);

    }

    function deselectAllPins() {
      for (var j = 0; j < mapPins.length; j++) {
        mapPins[j].classList.remove(className);
      }
    }

  }

  // ТЗ: сначала НЕ активное состояние
  state.setInactiveState();

  // установка обработчиков на главный маркер
  mainPin.installHandle();

  // ТЗ: Поле адреса должно быть заполнено всегда, в том числе сразу после открытия страницы (в неактивном состоянии).
  address.setAddress(mainPin.element, 'main-inactive');

})();
