'use strict';
// Данные

window.data = (function () {
  // вспомогательные функции
  var func = {

    count: 1,

    getAvatar: function (max) {
      if (this.count > max) {
        this.count = 1;
      }
      return 'img/avatars/user' + this.addZeros(this.count++) + '.png';
    },

    addZeros: function (n, needLength) {
      needLength = needLength || 2;
      n = String(n);
      while (n.length < needLength) {
        n = '0' + n;
      }
      return n;
    },
  };

  var data = {

    // размер площадки {width, height} для показа меток
    mapSize: window.util.getElementSize(document.querySelector('.map__pins')),

    // Предложения:
    offers_: [],

    getOffers: function () {
      return this.offers_;
    },

    loadOffers_: function () {
      this.offers_ = this.createOffers(window.cfg.OFFERS_MAX);
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
      var array = [];

      for (var i = 0; i < max; i++) {
        array.push(this.createOffer());
      }

      return array;
    },

    // уникальный идентификатор 'Предложения'
    id: 0,

    // создание одного 'Предложения' жилья
    createOffer: function () {
      var obj = {};

      obj.id = this.id++;

      obj.author = {};
      obj.author.avatar = func.getAvatar(window.cfg.OFFERS_MAX);

      obj.offer = {};
      obj.offer.title = window.random.getItemFromArray(window.cfg.TITLES);
      obj.offer.address = window.random.getItemFromArray(window.random.createArrayPairs(window.cfg.address));
      obj.offer.price = window.random.getItemFromArray(window.cfg.PRICES);
      obj.offer.type = window.random.getItemFromArray(Object.keys(window.cfg.types));
      obj.offer.rooms = window.random.getItemFromArray(window.cfg.ROOMS);
      obj.offer.guests = window.random.getItemFromArray(window.cfg.GUESTS);
      obj.offer.checkin = window.random.getItemFromArray(window.cfg.CHECKIN);
      obj.offer.checkout = window.random.getItemFromArray(window.cfg.CHECKOUT);
      obj.offer.features = window.random.getArrayFromArray(window.cfg.FEATURES);
      obj.offer.description = window.random.getItemFromArray(window.cfg.DESCRIPTIONS);
      obj.offer.photos = window.random.getArrayFromArray(window.cfg.PHOTOS);

      obj.location = {};
      obj.location.x = window.random.getNumberFromRange(0, this.mapSize.width); // ТЗ: случайное число, координата x метки на карте. Значение ограничено размерами блока, в котором перетаскивается метка.
      obj.location.y = window.random.getNumberFromRange(130, 630); // ТЗ: случайное число, координата y метки на карте от 130 до 630

      return obj;
    },

  };

  data.loadOffers_();

  return {
    getOffers: data.getOffers.bind(data),
    getOfferById: data.getOfferById.bind(data),
  };

})();
