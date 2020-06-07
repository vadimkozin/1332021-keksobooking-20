'use strict';

// константы
var cfg = {
  PIN_WIDTH: 50,
  PIN_HEIGHT: 70,
  OFFERS_MAX: 8,
  TITLES: ['Каменный дом 250м', 'Дом из бруса', 'Аппартаменты ждут вас', 'Скамейка', 'Остров', 'Дом + баня', 'Срочно сдаю жильё!', 'Экономичный вариант', 'Шалаш!', 'Коттедж на двоих'],
  ADDRESS: {
    fromX: 10, // координата начала по X
    toX: 1200, // координата конца по X
    fromY: 200, // координата начала по Y
    toY: 600, // координата конца по Y
    size: 20 // количество пар координат: ['10, 200', '20, 210', ..]
  },
  PRICES: [100, 200, 300, 500, 800, 1000, 1500, 2000, 3000, 5000],
  TYPES: ['palace', 'flat', 'house', 'bungalo'],
  ROOMS: [1, 2, 3, 100],
  GUESTS: [1, 2, 3, 4, 5, 6, 100],
  CHECKIN: ['12:00', '13:00', '14:00'],
  CHECKOUT: ['12:00', '13:00', '14:00'],
  FEATURES: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
  DESCRIPTIONS: ['Уютный дом', 'Красивое место', 'Отличная квартира', 'И всего мира мало', 'Остров в придачу', 'Дом и баня на участке', 'Скоростная трасса', 'Хорошие соседи', 'Участок на границе леса', 'Земляника вокруг'],
  PHOTOS: createArrayUrl('http://o0.github.io/assets/images/tokyo/hotel{{}}.jpg', '{{}}', 1, 20),
};

// возвращает массив url
// createArrayUrl('http://image{{}}.jpg', '{{}}', 1, 10)
// вернёт массив: ['http://image1.jpg', 'http://image2.jpg', .. 'http://image10.jpg']
function createArrayUrl (urlTemplate, template, valueFrom, valueTo) {
  var array = [];
  var url = urlTemplate.split(template);

  for (var i = Number(valueFrom); i <= Number(valueTo); i++) {
    var item = url[0] + String(i) + url[1];
    array.push(item);
  }

  return array;
}

// функции для разных случайных вещей
var random = {

  getIndex: function (array) {
    return Math.floor(Math.random() * array.length); // range: 0.. array.length
  },

  getItemFromArray: function (array) {
    return array[this.getIndex(array)];
  },

  getArrayFromArray: function (array) {

    var result = [];
    var count = this.getIndex(array);
    count = (count === 0) ? 1 : count;

    for (var i = 0; i < count; i++) {
      var index = this.getIndex(array);
      if (result.indexOf(array[index]) === -1) {
        result.push(array[index]);
      }
    }

    return result;
  },

  getNumberFromRange: function (from, to) {
    var range = Number(to) - Number(from) + 1;
    return from + Math.floor(Math.random() * range);
  },

  // создаёт массив пар
  // address.{fromX:100, toX:1000, fromY:50, toY:500, size:5} => ['100,50', '500,60', '900,100', '700,400', '655, 499']
  createArrayPairs: function (address) {
    var array = [];

    for (var i = 0; i < address.size; i++) {
      var x = this.getNumberFromRange(address.fromX, address.toX);
      var y = this.getNumberFromRange(address.fromY, address.toY);
      var item = String(x + ',' + y);
      array.push(item);
    }

    return array;
  }
};

// функции общего плана
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

  trimSpaces: function (str) {
    return str.replace(/\s/g, '');
  },

  getLocation: function (offer) {
    var address = this.trimSpaces(offer.offer.address).split(','); // '100, 200' -> ['100','200'];
    var left = Math.round((Number(address[0]) - cfg.PIN_WIDTH / 2)) + 'px';
    var top = Math.round((Number(address[1]) - cfg.PIN_HEIGHT)) + 'px';

    return 'left:' + left + ';top:' + top + ';'; // "left: 100px; top:20px;"
  },

  getElementSize: function (element) {
    return {
      width: element.offsetWidth,
      height: element.offsetHeight
    };
  }
};

function qs(selector) {
  return document.querySelector(selector);
}

// узнаём размеры площади для показа меток
var mapSize = func.getElementSize(qs('.map__pins'));

// создаём одно 'Предложение/Объявление'
function createOffer() {
  var obj = {};

  obj.author = {};
  obj.author.avatar = func.getAvatar(cfg.OFFERS_MAX);

  obj.offer = {};
  obj.offer.title = random.getItemFromArray(cfg.TITLES);
  obj.offer.address = random.getItemFromArray(random.createArrayPairs(cfg.ADDRESS));
  obj.offer.price = random.getItemFromArray(cfg.PRICES);
  obj.offer.type = random.getItemFromArray(cfg.TYPES);
  obj.offer.rooms = random.getItemFromArray(cfg.ROOMS);
  obj.offer.guests = random.getItemFromArray(cfg.GUESTS);
  obj.offer.checkin = random.getItemFromArray(cfg.CHECKIN);
  obj.offer.checkout = random.getItemFromArray(cfg.CHECKOUT);
  obj.offer.features = random.getArrayFromArray(cfg.FEATURES);
  obj.offer.description = random.getItemFromArray(cfg.DESCRIPTIONS);
  obj.offer.photos = random.getArrayFromArray(cfg.PHOTOS);

  obj.location = {};
  obj.location.x = random.getNumberFromRange(0, mapSize.width); // ТЗ: случайное число, координата x метки на карте. Значение ограничено размерами блока, в котором перетаскивается метка.
  obj.location.y = random.getNumberFromRange(130, 630); // ТЗ: случайное число, координата y метки на карте от 130 до 630

  return obj;
}

// создаём массив 'Предложений'
function createOffers(max) {
  var array = [];

  for (var i = 0; i < max; i++) {
    array.push(createOffer());
  }

  return array;
}

// все Предложения добавляются в DocumentFragment
function createFragmentOffers(offers) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < offers.length; i++) {
    fragment.appendChild(renderOffer(offers[i]));
  }

  return fragment;
}

// подготовка одного Предложения для публикации
function renderOffer(offer) {
  var offerElement = pinTemplate.cloneNode(true);
  var img = offerElement.querySelector('img');

  img.src = offer.author.avatar;
  img.alt = offer.offer.title;
  offerElement.style = func.getLocation(offer);

  return offerElement;
}

// массив Предложений
var offers = createOffers(cfg.OFFERS_MAX);

// ТЗ: У блока .map уберите класс .map--faded.
qs('.map').classList.remove('map--faded');

// ТЗ: Итоговую разметку метки .map__pin можно взять из шаблона #pin
var pinTemplate = qs('#pin').content.querySelector('.map__pin');

// ТЗ: Отрисуйте сгенерированные DOM-элементы в блок .map__pins. Для вставки элементов используйте DocumentFragment.
var mapPins = qs('.map__pins');

// вставляем маркеры с Предложениями жилья на карту
mapPins.appendChild(createFragmentOffers(offers));

