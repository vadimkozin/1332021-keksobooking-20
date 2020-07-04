'use strict';
// Предложения жилья на карте

window.map = (function () {

  var map = {

    // создание меток с 'Предложениями' жилья
    createPins: function (offers) {
      var fragment = document.createDocumentFragment();

      for (var i = 0; i < offers.length; i++) {
        fragment.appendChild(window.pin.createPin(offers[i]));
      }

      return fragment;
    },

    // отображение Предложений-меток на карте
    showPins: function (options) {

      // ТЗ: Отрисуйте сгенерированные DOM-элементы в блок .map__pins
      var mapPinsElement = document.querySelector('.map__pins');

      // селектор для выборки всех меток кроме главной
      var pinSelector = '.map__pin:not(.map__pin--main)';

      // удаляем существующие метки (если есть)
      window.pin.removePins();

      // добавляем метки с Предложениями жилья на карту c учётом критериев
      mapPinsElement.appendChild(this.createPins(window.data.getOffersByCrit(options)));

      // созданные метки
      var pinElements = document.querySelectorAll(pinSelector);

      // установка обработчиков на метки
      window.pin.installHandlersOnMapPins(pinElements);

      // возвращаем созданные метки
      return pinElements;

    },

  };


  return {
    showPins: map.showPins.bind(map),
  };

})();
