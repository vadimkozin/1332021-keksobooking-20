'use strict';
// константы

window.cfg = (function () {
  return {
    valid: {
      TITLE_LENGTH_MIN: 30,
      TITLE_LENGTH_MAX: 100,
    },
    mark: {
      WIDTH: 50, // ширина обычных маркеров на карте
      HEIGHT: 70, // высота
      MAIN_ACTIVE_WIDTH: 65, // ширина главного маркера в активном состоянии
      MAIN_ACTIVE_HEIGHT: 87, // высота
      MAIN_INACTIVE_WIDTH: 65, // ширина главного маркера в НЕ активном состоянии
      MAIN_INACTIVE_HEIGHT: 65 // высота ..
    },
    OFFERS_MAX: 8,
    TITLES: ['Каменный дом 250м', 'Дом из бруса', 'Аппартаменты ждут вас', 'Скамейка', 'Остров', 'Дом + баня', 'Срочно сдаю жильё!', 'Экономичный вариант', 'Шалаш!', 'Коттедж на двоих'],
    address: {
      FROM_X: 10, // координата начала по X
      TO_X: 1200, // координата конца по X
      FROM_Y: 130, // координата начала по Y
      TO_Y: 630, // координата конца по Y
      SIZE: 20 // количество пар координат: ['10, 200', '20, 210', ..]
    },
    PRICES: [100, 200, 300, 500, 800, 1000, 1500, 2000, 3000, 5000],
    types: {
      flat: {name: 'Квартира', minPrice: 1000},
      bungalo: {name: 'Бунгало', minPrice: 0},
      house: {name: 'Дом', minPrice: 5000},
      palace: {name: 'Дворец', minPrice: 10000},
    },
    ROOMS: [1, 2, 3, 100],
    GUESTS: [1, 2, 3, 4, 5, 6, 100],
    CHECKIN: ['12:00', '13:00', '14:00'],
    CHECKOUT: ['12:00', '13:00', '14:00'],
    FEATURES: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
    DESCRIPTIONS: ['Уютный дом', 'Красивое место', 'Отличная квартира', 'И всего мира мало', 'Остров в придачу', 'Дом и баня на участке', 'Скоростная трасса', 'Хорошие соседи', 'Участок на границе леса', 'Земляника вокруг'],
    PHOTOS: createArrayUrl('http://o0.github.io/assets/images/tokyo/hotel{{}}.jpg', '{{}}', 1, 3),
  };

  /**
   * Возвращает массив url
   * @param {string} urlTemplate - строка url с шаблоном,  напр.: 'http://image{{}}.jpg', '{{}}', 1, 10)
   * @param {string} template - сам шаблон, напр. {{}}
   * @param {number} valueFrom - номер от, напр. 1
   * @param {number} valueTo - номер по, напр. 10
   * @return {array} например: ['http://image1.jpg', 'http://image2.jpg', .. 'http://image10.jpg']
   */
  function createArrayUrl(urlTemplate, template, valueFrom, valueTo) {
    var array = [];
    var url = urlTemplate.split(template);

    for (var i = Number(valueFrom); i <= Number(valueTo); i++) {
      var item = url[0] + String(i) + url[1];
      array.push(item);
    }

    return array;
  }

})();
