'use strict';

// константы
var cfg = {
  MARK: {
    width: 50, // ширина обычных маркеров на карте
    height: 70, // высота
    mainActiveWidth: 65, // ширина главного маркера в активном состоянии
    mainActiveHeight: 87, // высота
    mainInactiveWidth: 65, // ширина главного маркера в НЕ активном состоянии
    mainInactiveHeight: 65 // высота ..
  },

  OFFERS_MAX: 8,
  TITLES: ['Каменный дом 250м', 'Дом из бруса', 'Аппартаменты ждут вас', 'Скамейка', 'Остров', 'Дом + баня', 'Срочно сдаю жильё!', 'Экономичный вариант', 'Шалаш!', 'Коттедж на двоих'],
  ADDRESS: {
    fromX: 10, // координата начала по X
    toX: 1200, // координата конца по X
    fromY: 130, // координата начала по Y
    toY: 630, // координата конца по Y
    size: 20 // количество пар координат: ['10, 200', '20, 210', ..]
  },
  PRICES: [100, 200, 300, 500, 800, 1000, 1500, 2000, 3000, 5000],
  TYPES__: {flat: 'Квартира', bungalo: 'Бунгало', house: 'Дом', palace: 'Дворец'},
  TYPES: {
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

// возвращает массив url
// createArrayUrl('http://image{{}}.jpg', '{{}}', 1, 10)
// вернёт массив: ['http://image1.jpg', 'http://image2.jpg', .. 'http://image10.jpg']
function createArrayUrl(urlTemplate, template, valueFrom, valueTo) {
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

    var count = this.getNumberFromRange(1, array.length);

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
    var left = Math.round((Number(address[0]) - cfg.MARK.width / 2)) + 'px';
    var top = Math.round((Number(address[1]) - cfg.MARK.height)) + 'px';

    return 'left:' + left + ';top:' + top + ';'; // "left: 100px; top:20px;"
  },

  getElementSize: function (element) {
    return {
      width: element.offsetWidth,
      height: element.offsetHeight
    };
  },

  // возвращает название жилья по его типу
  getNameHousing: function (type) {
    return cfg.TYPES[type]['name'] ? cfg.TYPES[type]['name'] : '';
  },

  // https://inter-net.pro/javascript/sklonenie-okonchanij
  // declensionWord(1, ['гостя', 'гостей', '???']); // -> гостя
  // declensionWord(2, ['комната', 'комнаты', 'комнат']); // -> комнаты)
  declensionWord: function (number, txt) {
    var cases = [2, 0, 1, 1, 1, 2];
    return txt[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
  },

  // строит фразу типа: "2 комнаты для 1 гостя"
  buildPhrase: function (rooms, guests) {
    return rooms + ' ' + this.declensionWord(rooms, ['комната', 'комнаты', 'комнат']) + ' для ' +
          guests + ' ' + this.declensionWord(guests, ['гостя', 'гостей', 'гостей']);
  },

  parseInt: function (value, base) {
    base = base || 10;
    var parsed = parseInt(value, base);

    return (isNaN(parsed)) ? 0 : parsed;
  }

};

// функции по созданию и отображению Предложений жилья на карте
var housing = {
  // Предложения:
  offers_: [],

  get offers() {
    if (!this.offers_.length) {
      this.offers_ = this.createOffers(cfg.OFFERS_MAX);
    }
    return this.offers_;
  },

  // ТЗ: Итоговую разметку метки .map__pin можно взять из шаблона #pin
  pinTemplate: document.querySelector('#pin').content.querySelector('.map__pin'),

  // размеры площади для показа меток
  mapSize: func.getElementSize(document.querySelector('.map__pins')),

  // массив 'Предложений'
  createOffers: function (max) {
    var array = [];

    for (var i = 0; i < max; i++) {
      array.push(this.createOffer());
    }

    return array;
  },

  // создание одного 'Предложения' жилья
  createOffer: function () {
    var obj = {};

    obj.author = {};
    obj.author.avatar = func.getAvatar(cfg.OFFERS_MAX);

    obj.offer = {};
    obj.offer.title = random.getItemFromArray(cfg.TITLES);
    obj.offer.address = random.getItemFromArray(random.createArrayPairs(cfg.ADDRESS));
    obj.offer.price = random.getItemFromArray(cfg.PRICES);
    obj.offer.type = random.getItemFromArray(Object.keys(cfg.TYPES));
    obj.offer.rooms = random.getItemFromArray(cfg.ROOMS);
    obj.offer.guests = random.getItemFromArray(cfg.GUESTS);
    obj.offer.checkin = random.getItemFromArray(cfg.CHECKIN);
    obj.offer.checkout = random.getItemFromArray(cfg.CHECKOUT);
    obj.offer.features = random.getArrayFromArray(cfg.FEATURES);
    obj.offer.description = random.getItemFromArray(cfg.DESCRIPTIONS);
    obj.offer.photos = random.getArrayFromArray(cfg.PHOTOS);

    obj.location = {};
    obj.location.x = random.getNumberFromRange(0, this.mapSize.width); // ТЗ: случайное число, координата x метки на карте. Значение ограничено размерами блока, в котором перетаскивается метка.
    obj.location.y = random.getNumberFromRange(130, 630); // ТЗ: случайное число, координата y метки на карте от 130 до 630

    return obj;
  },

  // добавление 'Предложений' в DocumentFragment
  createFragmentOffers: function (offers) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < offers.length; i++) {
      fragment.appendChild(this.renderOffer(offers[i]));
    }

    return fragment;
  },

  // подготовка одного Предложения для публикации
  renderOffer: function (offer) {
    var element = this.pinTemplate.cloneNode(true);
    var img = element.querySelector('img');

    img.src = offer.author.avatar;
    img.alt = offer.offer.title;
    element.style = func.getLocation(offer);

    return element;
  },

  // отображение Предложений на карте
  showOffers: function () {

    // ТЗ: Отрисуйте сгенерированные DOM-элементы в блок .map__pins. Для вставки элементов используйте DocumentFragment.
    var mapPins = document.querySelector('.map__pins');

    // вставляем маркеры с Предложениями жилья на карту
    mapPins.appendChild(this.createFragmentOffers(this.offers));

  },

};


// ---------------------------------------------------
// # 9. Личный проект: больше деталей (часть 2)
// ТЗ: добавим функционал заполнения и отображения карточки первого объявления из массива с данными

var card = {
  // ссылка на шаблон карточки
  cardTemplate: document.querySelector('#card').content.querySelector('.popup'),

  // возвращает список характеристик (ul) объекта размещения
  getListFeatures: function (features) {

    var fragment = new DocumentFragment();
    var className = 'popup__feature';

    for (var i = 0; i < features.length; i++) {
      var li = document.createElement('li');
      li.classList.add(className);
      li.classList.add(className + '--' + features[i]); // 'popup__feature--wifi'
      fragment.append(li);
    }

    var ul = document.createElement('ul');
    ul.classList.add('popup__features');
    ul.append(fragment);

    return ul;
  },

  // отображение фотографий одного Предложения в карточке
  renderPhotosToElement: function (element, offer) {
    if (offer.offer.photos.length) {
      for (var i = 0; i < offer.offer.photos.length; i++) {
        var img = element.cloneNode(true);
        img.src = offer.offer.photos[i];
        element.after(img);
      }
      element.remove();
    }
  },

  // подготовка одной карточки для отображения
  prepareCard: function (offer, template) {

    var element = template.cloneNode(true);

    // ТЗ: Выведите заголовок объявления offer.title в заголовок .popup__title.
    element.querySelector('.popup__title').textContent = offer.offer.title;

    // ТЗ: Выведите адрес offer.address в блок .popup__text--address.
    element.querySelector('.popup__text--address').textContent = offer.offer.address;

    // ТЗ: Выведите цену offer.price в блок .popup__text--price строкой вида {{offer.price}}₽/ночь. Например, 5200₽/ночь.
    element.querySelector('.popup__text--price').textContent = offer.offer.price + '₽/ночь';

    // ТЗ: В блок .popup__type выведите тип жилья offer.type: Квартира для flat, Бунгало для bungalo, Дом для house, Дворец для palace.
    element.querySelector('.popup__type').textContent = func.getNameHousing(offer.offer.type);

    // ТЗ: Выведите количество гостей и комнат offer.rooms и offer.guests
    //     в блок .popup__text--capacity строкой вида {{offer.rooms}} комнаты для {{offer.guests}} гостей.
    //     Например, 2 комнаты для 3 гостей.
    element.querySelector('.popup__text--capacity').textContent = func.buildPhrase(offer.offer.rooms, offer.offer.guests);

    // ТЗ: Время заезда и выезда offer.checkin и offer.checkout в блок .popup__text--time
    //     строкой вида Заезд после {{offer.checkin}}, выезд до {{offer.checkout}}.
    //     Например, заезд после 14:00, выезд до 12:00.
    element.querySelector('.popup__text--time').textContent = 'Заезд после ' + offer.offer.checkin + ', выезд до ' + offer.offer.checkout;

    // ТЗ: В список .popup__features выведите все доступные удобства в объявлении.
    element.querySelector('.popup__features').replaceWith(this.getListFeatures(offer.offer.features));

    // ТЗ: В блок .popup__description выведите описание объекта недвижимости offer.description.
    element.querySelector('.popup__description').textContent = offer.offer.description;

    // ТЗ: В блок .popup__photos выведите все фотографии из списка offer.photos.
    //     Каждая из строк массива photos должна записываться как src соответствующего изображения.
    this.renderPhotosToElement(element.querySelector('.popup__photos img'), offer);

    // ТЗ: Замените src у аватарки пользователя — изображения, которое записано в .popup__avatar — на значения поля author.avatar отрисовываемого объекта.
    element.querySelector('.popup__avatar').src = offer.author.avatar;

    return element;
  },

  // карточка добавляется в DocumentFragment
  createFragmentCard: function (offer) {
    var fragment = document.createDocumentFragment();

    fragment.appendChild(this.prepareCard(offer, this.cardTemplate));

    return fragment;
  },

  // добавляет карточку offer перед элементом where.
  renderCard: function (offer, where) {
    where.before(this.createFragmentCard(offer));
  },

  // (временно) пустой метод, чтобы eslint не ругался пока card не используется
  tmp: function () {
    return null;
  }
};


// ---------------------------------------------------
// # 4. Обработка событий
//  11. Личный проект: доверяй, но проверяй (часть 1)

// управление состоянием интерактивных элементов: карты и форм
var state = {
  map: document.querySelector('.map'),
  adForm: document.querySelector('.ad-form'),
  adFormFieldsets: document.querySelectorAll('.ad-form fieldset'),
  filterForm: document.querySelector('.map__filters'),
  filterFormSelect: document.querySelectorAll('.map__filters select'),
  filterFormFieldsets: document.querySelectorAll('.map__filters fieldset'),

  setDisabled: function (elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].setAttribute('disabled', '');
    }
  },

  setEnabled: function (elements) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].removeAttribute('disabled');
    }
  },

  // установка НЕ активного состояния
  setInactiveState: function () {
    // ТЗ: Блок с картой .map содержит класс map--faded
    this.map.classList.add('map--faded');

    // ТЗ: Форма заполнения информации об объявлении .ad-form содержит класс .ad-form--disabled
    this.adForm.classList.add('ad-form--disabled');

    // ТЗ: Все <input> и <select> формы .ad-form заблокированы с помощью атрибута disabled, добавленного на них или на их родительские блоки fieldset
    this.setDisabled(this.adFormFieldsets);

    // ТЗ: Форма с фильтрами .map__filters заблокирована так же, как и форма .ad-form
    this.setDisabled(this.filterFormSelect);
    this.setDisabled(this.filterFormFieldsets);
  },

  // установка активного состояния
  setActiveState: function () {
    // Блок с картой .map НЕ содержит класс map--faded
    this.map.classList.remove('map--faded');

    // Форма заполнения информации об объявлении .ad-form НЕ содержит класс .ad-form--disabled
    this.adForm.classList.remove('ad-form--disabled');

    // Все <input> и <select> формы .ad-form рааблокированы с помощью атрибута disabled, добавленного на них или на их родительские блоки fieldset
    this.setEnabled(this.adFormFieldsets);

    // Форма с фильтрами .map__filters разблокирована так же, как и форма .ad-form
    this.setEnabled(this.filterFormSelect);
    this.setEnabled(this.filterFormFieldsets);
  },

};

// мышка
var mouse = {

  buttons: {LEFT: 0, MIDDLE: 1, RIGHT: 2, UNDEFINED: 99},

  getPressButton: function (evt) {
    if (typeof evt === 'object') {
      var btnCode = evt.button;

      switch (btnCode) {
        case 0:
          return this.buttons.LEFT;
        case 1:
          return this.buttons.MIDDLE;
        case 2:
          return this.buttons.RIGHT;
      }
    }
    return this.buttons.UNDEFINED;
  }
};

// адрес
var address = {

  elementAddress: document.querySelector('#address'),

  // вычисление координат в виде {x,y} в зависимости от расположения маркера и состояния
  getCoord: function (marker, markerState) {
    var width = 0;
    var height = 0;

    switch (markerState) {
      case 'main-active':
        height = cfg.MARK.mainActiveHeight;
        width = cfg.MARK.mainActiveWidth;
        break;
      case 'main-inactive':
        height = cfg.MARK.mainInactiveHeight;
        width = cfg.MARK.mainInactiveWidth;
        break;
      default:
        width = cfg.MARK.width;
        height = cfg.MARK.height;
        break;
    }

    var x = Math.round(func.parseInt(marker.style.left) + width / 2);
    var y = Math.round(func.parseInt(marker.style.top) + height);

    return {
      x: x,
      y: y
    };

  },

  // заполнение поля адреса
  setAddress: function (marker, markerState) {
    var coord = this.getCoord(marker, markerState);
    this.elementAddress.value = coord.x + ',' + coord.y;
  },

};

// ТЗ: сначала НЕ активное сосояние
state.setInactiveState();

// ТЗ: Поле адреса должно быть заполнено всегда, в том числе сразу после открытия страницы (в неактивном состоянии).
var mapPinMain = document.querySelector('.map__pin--main');
address.setAddress(mapPinMain, 'main-inactive');

// перевод страницы Кексобукинга в активный режим при нажатии левой клавиши мыши на главный маркер
mapPinMain.addEventListener('mousedown', function (evt) {
  if (mouse.getPressButton(evt) === mouse.buttons.LEFT) {
    activeState();
  }
});

// нажатие на Enter тоже переводит в активный режим
mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.key === 'Enter') {
    activeState();
  }
});

// Активное состояние
function activeState() {
  // перевод элементов в активное состояние
  state.setActiveState();
  // заполнение поля адреса в активном состоянии
  address.setAddress(mapPinMain, 'main-active');
  // отрисовка похожих объявлений на карте
  housing.showOffers();

  // ..  показываем карточку с 1-м предложением
  // var mapFilter = document.querySelector('.map .map__filters-container');
  // card.renderCard(housing.offers[0], mapFilter);
  card.tmp(); // временно чтобы eslint не ругался
}

// валидация выбора кол-ва гостей и количества комнат
var roomNumber = document.querySelector('#room_number');
var guestsNumber = document.querySelector('#capacity');
var typeHousing = document.querySelector('#type');
var price = document.querySelector('#price');
var adForm = document.querySelector('.ad-form');
var adFormSubmit = adForm.querySelector('button.ad-form__submit');
// var adFormReset = adForm.querySelector('button.ad-form__reset');

adForm.addEventListener('invalid', onInvalidAdForm, true);
adForm.addEventListener('input', onInputAdForm, false);
roomNumber.addEventListener('change', onChangeRoomsGuests, false);
guestsNumber.addEventListener('change', onChangeRoomsGuests, false);
adFormSubmit.addEventListener('click', onSubmitAdForm, false);
typeHousing.addEventListener('change', onChangeTypeHousing, false);

// при загрузке синхронизируем "Тип жилья" и "Цена за ночь"
synchronizeTypeWithPrice(typeHousing.value, true);

function synchronizeTypeWithPrice(type, loading) {
  loading = loading || false;
  var minPrice = cfg.TYPES[type]['minPrice'];

  price.setAttribute('min', minPrice);
  price.setAttribute('placeholder', minPrice);

  var ok = (price.value >= minPrice) || loading;
  if (ok) {
    unselectItem(price);
  } else {
    selectedItem(price);
  }
}

function onChangeTypeHousing(evt) {
  var type = evt.target.value;
  synchronizeTypeWithPrice(type);
}

function selectedItem(element) {
  element.style.boxShadow = '0 0 3pt 2pt red';
}

function unselectItem(element) {
  element.style.boxShadow = 'none';
}

function onInvalidAdForm(evt) {
  var element = evt.target;
  selectedItem(element);
}

function onInputAdForm(evt) {
  var element = evt.target;
  if (element.validity.valid) {
    unselectItem(element);
  } else {
    selectedItem(element);
  }
}

function onSubmitAdForm(evt) {
  evt.preventDefault();

  onChangeRoomsGuests();

  var valid = adForm.checkValidity();
  if (valid) {
    adForm.submit();
  }
}

function onChangeRoomsGuests() {

  var rooms = roomNumber.value;
  var guests = guestsNumber.value;
  var alarm = {
    1: '1 комната - "для 1 гостя"',
    2: '2 комнаты - "для 2 гостей" или "для 1 гостя"',
    3: '3 комнаты - "для 3 гостей", "для 2 гостей" или "для 1 гостя"',
    100: '100 комнат - "не для гостей"',
  };

  function setAlarmStyle(roomsCount) {
    roomNumber.setCustomValidity(alarm[roomsCount]);
    selectedItem(roomNumber);
  }

  function setOrdinaryStyle() {
    roomNumber.setCustomValidity('');
    unselectItem(roomNumber);
  }

  function setStyle(roomsCount, isAlarm) {
    if (isAlarm) {
      setAlarmStyle(roomsCount);
    } else {
      setOrdinaryStyle();
    }
  }

  rooms = Number(rooms);
  guests = Number(guests);

  switch (rooms) {
    case 1:
      setStyle(rooms, (guests !== 1));
      break;
    case 2:
      setStyle(rooms, (!(guests >= 1 && guests <= 2)));
      break;
    case 3:
      setStyle(rooms, (!(guests >= 1 && guests <= 3)));
      break;
    case 100:
      setStyle(rooms, (guests !== 0));
      break;
    default:
      setOrdinaryStyle();
      break;
  }
}

