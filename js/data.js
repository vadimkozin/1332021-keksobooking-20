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

    // возвращает Предложение по его id
    getOfferById: function (id) {
      return this.offers_.find(function (it) {
        return it.id === id;
      });
    },

    // чтение всех 'Предложений'
    readOffers: function (callback) {
      var that = this;
      var url = window.cfg.url.DATA;

      window.backend.load(url, onLoad, onError);

      function onLoad(response) {
        response.forEach(function (it, index) {
          that.offers_[index] = it;
          that.offers_[index]['id'] = index; // дополняем каждое Предложение уникальным id
        });
        if (typeof callback === 'function') {
          callback();
        }
      }

      function onError(message) {
        window.util.showMessage(message, false);
      }
    },

    /**
     * получить Предложения по критерию
     * @param {Object} options - опции фильтра : {type, price, rooms, guests, features}
     * @return {Array} - массив предложений
     */
    //
    getOffersByCrit: function (options) {
      var opts = (options === undefined) ? {} : Object.assign({}, options);
      opts.max = opts.max || window.cfg.OFFERS_MAX;
      opts.type = opts.type || 'any';
      opts.price = opts.price || 'any';
      opts.rooms = opts.rooms || 'any';
      opts.guests = opts.guests || 'any';
      opts.features = opts.features || '';

      return window.filter.mapFilter
        .init(data.getOffers().slice())
        .byKey('type', opts.type)
        .byPrice('price', opts.price)
        .byNumber('rooms', opts.rooms)
        .byNumber('guests', opts.guests)
        .byFeatures('features', opts.features)
        .getResult()
        .slice(0, opts.max);
    },

  };

  return {
    readOffers: data.readOffers.bind(data),
    getOffers: data.getOffers.bind(data),
    getOfferById: data.getOfferById.bind(data),
    getOffersByCrit: data.getOffersByCrit.bind(data),
  };

})();
