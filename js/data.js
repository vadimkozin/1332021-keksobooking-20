'use strict';
// Данные

window.data = (function () {

  var data = {

    // размер площадки {width, height} для показа меток
    mapSize: window.util.getElementSize(document.querySelector('.map__pins')),

    // Предложения:
    offers_: [],

    // получить Предложения
    getOffers: function () {
      return this.offers_;
    },

    // 'частный' метод, вызывается при загрузке кода
    loadOffers_: function () {
      this.readOffers();
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

    // чтение всех 'Предложений'
    readOffers: function () {
      var that = this;
      var url = window.cfg.url.DATA;

      window.backend.load(url, onLoad, onError);

      function onLoad(response) {
        response.forEach(function (it, index) {
          that.offers_[index] = it;
          that.offers_[index]['id'] = index; // дополняем каждое Предложение уникальным id
        });
      }

      function onError(message) {
        window.util.showMessage(message, false);
      }
    },

    // получить Предложения по критерию
    getOffersByCrit: function (options) {
      options = options || {};
      options.type = options.type || 'any'; // any, palace, flat, house, bungalo
      options.max = options.max || window.cfg.OFFERS_MAX;

      // 1 критерий - тип жилья
      // 2 критерий - не более чем options.max
      var array = (options.type === 'any')
        ? window.random.getPartArray(this.offers_, options.max)
        : this.offers_.filter(function (offer) {
          return offer.offer.type === options.type;
        }).slice(0, options.max);

      return array;
    }
  };

  data.loadOffers_();

  return {
    getOffers: data.getOffers.bind(data),
    getOfferById: data.getOfferById.bind(data),
    getOffersByCrit: data.getOffersByCrit.bind(data),
  };

})();
