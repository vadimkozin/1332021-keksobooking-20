'use strict';
// фильтрация Предложений

window.filter = (function () {
  var typeElement = document.querySelector('#housing-type');
  var priceElement = document.querySelector('#housing-price');
  var roomsElement = document.querySelector('#housing-rooms');
  var guestsElement = document.querySelector('#housing-guests');
  var featuresElement = document.querySelector('#housing-features');
  var formElement = document.querySelector('.map__filters');


  var featuresSet = {
    wifi: document.querySelector('#filter-wifi'),
    dishwasher: document.querySelector('#filter-dishwasher'),
    parking: document.querySelector('#filter-parking'),
    washer: document.querySelector('#filter-washer'),
    elevator: document.querySelector('#filter-elevator'),
    conditioner: document.querySelector('#filter-conditioner'),
  };

  var features = {
    wifi: false,
    dishwasher: false,
    parking: false,
    washer: false,
    elevator: false,
  };

  var filter = {
    type: 'any',
    price: 'any',
    rooms: 'any',
    guests: 'any',
    features: '',
  };

  typeElement.addEventListener('change', window.debounce(onTypeChange, typeElement));
  priceElement.addEventListener('change', window.debounce(onPriceChange, priceElement));
  roomsElement.addEventListener('change', window.debounce(onRoomsChange, roomsElement));
  guestsElement.addEventListener('change', window.debounce(onGuestsChange, guestsElement));
  featuresElement.addEventListener('change', window.debounce(onFeaturesChange, featuresElement));
  formElement.addEventListener('reset', window.debounce(onFormReset, formElement));

  function onTypeChange(evt) {
    filter.type = evt.target.value;
    updateMapPins();
  }
  function onPriceChange(evt) {
    filter.price = evt.target.value;
    updateMapPins();
  }
  function onRoomsChange(evt) {
    filter.rooms = evt.target.value;
    updateMapPins();
  }
  function onGuestsChange(evt) {
    filter.guests = evt.target.value;
    updateMapPins();
  }
  function onFeaturesChange(evt) {
    var key = evt.target.value;
    features[key] = (featuresSet[key].checked);
    filter.features = getFeatures(features);
    updateMapPins();
  }
  function onFormReset() {
    formElement.reset();
  }

  // возвращает список характеристик в виде строки: 'wifi,parking,elevator'
  function getFeatures(obj) {
    var result = [];
    for (var key in obj) {
      if (obj[key]) {
        result.push(key);
      }
    }
    return result.join(',');
  }

  // обновление меток на карте
  function updateMapPins() {
    window.card.close();
    window.map.showPins(filter);
  }

  // фильтр меток карты
  var mapFilter = {
    array: [],

    init: function (offers) {
      this.array = offers;
      return this;
    },

    getResult: function () {
      return this.array;
    },

    byFeatures: function (key, value) {
      if (value) {
        this.array = this.array.filter(function (it) {
          // it.offer[key] = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"]
          // value = 'wifi,parking'
          return window.util.isArrayContainsArray(it.offer[key], window.util.trimSpace(value).split(','));
        });
      }
      return this;
    },

    byKey: function (key, value) {
      if (value !== 'any') {
        this.array = this.array.filter(function (it) {
          return it.offer[key] === value;
        });
      }
      return this;
    },

    byPrice: function (key, value) {
      if (value !== 'any') {
        this.array = this.array.filter(function (it) {
          switch (value) {
            case 'middle':
              return (it.offer[key] >= 10000 && it.offer[key] <= 50000);
            case 'low':
              return (it.offer[key] < 10000);
            case 'high':
              return (it.offer[key] > 50000);
            default:
              return false;
          }
        });
      }
      return this;
    },

    byNumber: function (key, value) {
      if (value !== 'any') {
        value = parseInt(value, 10);
        this.array = this.array.filter(function (it) {
          return (it.offer[key] === value);
        });
      }
      return this;
    },
  };

  return {
    mapFilter: mapFilter,
    reset: onFormReset,
  };

})();
