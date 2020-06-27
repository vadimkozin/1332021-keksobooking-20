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
      var mapPins = document.querySelector('.map__pins');

      // селектор для выборки всех меток кроме главной
      var pinSelector = '.map__pin:not(.map__pin--main)';

      // удаляем существующие метки (если есть)
      document.querySelectorAll(pinSelector).forEach(function (it) {
        it.remove();
      });

      // вставляем метки с Предложениями жилья на карту
      // mapPins.appendChild(this.createPins(window.data.getOffers()));
      mapPins.appendChild(this.createPins(window.data.getOffersByCrit(options)));

      // возвращаем созданные метки
      return document.querySelectorAll(pinSelector);

    },

  };


  return {
    showPins: map.showPins.bind(map),
  };

})();
