'use strict';
// Данные

window.data = (function () {

  var data = {

    // размер площадки {width, height} для показа меток
    mapSize: window.util.getElementSize(document.querySelector('.map__pins')),

    // Предложения:
    offers_: [],

    getOffers: function () {
      return this.offers_;
    },

    // 'частный' метод, вызывается при загрузке кода
    loadOffers_: function () {
      this.createOffers(window.cfg.OFFERS_MAX);
    },

    // возвращает Предложение по его id
    getOfferById: function (id) {

      for (var i = 0; i < this.offers_.length; i++) {
        if (this.offers_[i].id === id) {
          return this.offers_[i];
        }
      }

      return this.offers_[0];
    },

    // создание массива 'Предложений'
    createOffers: function (max) {
      var that = this;
      var url = window.cfg.URL_DATA;

      window.backend.load(url, onLoad, onError);

      function onLoad(response) {
        // нам нужно max значений из полученных данных
        var indexes = window.random.getSetValues(max, response.length);

        for (var i = 0; i < max; i++) {
          that.offers_[i] = response[indexes[i]];
          that.offers_[i]['id'] = i; // дополняем каждое Предложение уникальным id
        }
      }
      function onError(message) {
        window.util.showMessage(message, false);
      }

    },

  };

  data.loadOffers_();

  return {
    getOffers: data.getOffers.bind(data),
    getOfferById: data.getOfferById.bind(data),
  };

})();
