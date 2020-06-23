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
    showPins: function () {

      // ТЗ: Отрисуйте сгенерированные DOM-элементы в блок .map__pins. Для вставки элементов используйте DocumentFragment.
      var mapPins = document.querySelector('.map__pins');

      // вставляем маркеры с Предложениями жилья на карту
      mapPins.appendChild(this.createPins(window.data.getOffers()));

      // возвращаем созданные метки
      return document.querySelectorAll('.map__pin:not(.map__pin--main)');
    },

  };


  return {
    showPins: map.showPins.bind(map),
  };

})();
