'use strict';
// форма объявления

window.form = (function () {
  var roomElement = document.querySelector('#room_number');
  var guestElement = document.querySelector('#capacity');
  var typeElement = document.querySelector('#type');
  var priceElement = document.querySelector('#price');
  var titleElement = document.querySelector('#title');
  var timeinElement = document.querySelector('#timein');
  var timeoutElement = document.querySelector('#timeout');
  var formElement = document.querySelector('.ad-form');

  formElement.addEventListener('invalid', onFormInvalid, true);
  formElement.addEventListener('input', onFormInput, false);
  formElement.addEventListener('submit', onFormSubmit, false);
  formElement.addEventListener('reset', onFormReset, false);
  roomElement.addEventListener('change', onRoomChange, false);
  guestElement.addEventListener('change', onGuestChange, false);
  typeElement.addEventListener('change', onTypeChange, false);
  timeinElement.addEventListener('change', onTimeinChange, false);
  timeoutElement.addEventListener('change', onTimeoutChange, false);

  // при загрузке синхронизируем "Тип жилья" и "Цена за ночь"
  synchronizeTypeWithPrice(typeElement.value, true);

  function synchronizeTypeWithPrice(type, loading) {
    loading = loading || false;
    var minPrice = window.cfg.types[type]['minPrice'];

    priceElement.setAttribute('min', minPrice);
    priceElement.setAttribute('placeholder', minPrice);

    var ok = (priceElement.value >= minPrice) || loading;
    if (ok) {
      unselectItems(priceElement);
    } else {
      selectedItems(priceElement);
    }
  }

  function onTypeChange(evt) {
    var type = evt.target.value;
    synchronizeTypeWithPrice(type);
  }

  function selectedItems(item) {
    var value = '2px solid red';

    if (Array.isArray(item)) {
      item.forEach(function (it) {
        it.style.outline = value;
      });
    } else {
      item.style.outline = value;
    }
  }

  function unselectItems(item) {
    var value = 'none';

    if (Array.isArray(item)) {
      item.forEach(function (it) {
        it.style.outline = value;
      });
    } else {
      item.style.outline = value;
    }
  }

  function onFormInvalid(evt) {
    var element = evt.target;
    selectedItems(element);

    if (evt.target.name === 'title') {
      onInvalidTitle(evt);
    }
  }

  function onFormInput(evt) {
    var element = evt.target;

    if (element.validity.valid) {
      unselectItems(element);
    } else {
      selectedItems(element);
    }

    if (evt.target.name === 'title') {
      onInputTitle(evt);
    }
  }

  function onFormSubmit(evt) {
    evt.preventDefault();

    onRoomGuestChange();

    var valid = formElement.checkValidity();
    if (valid) {
      window.backend.save(new FormData(formElement), onFormSaved, onFormError);
    }

    function onFormSaved() {
      formElement.reset();
      window.filter.reset();
      window.pin.removePins();
      window.main.start();
      window.message.showSuccess();
    }
    function onFormError(message) {
      window.message.showError(message);
    }
  }

  function onFormReset() {
    formElement.reset();
    window.filter.reset();
    window.pin.removePins();
    window.reader.reset();

    setTimeout(function () {
      unselectItems([titleElement, roomElement, priceElement]);
      synchronizeTypeWithPrice(typeElement.value, true);
      window.main.start();
    }, 0);
  }

  function onRoomChange() {
    onRoomGuestChange();
  }

  function onGuestChange() {
    onRoomGuestChange();
  }

  function onRoomGuestChange() {
    var rooms = roomElement.value;
    var guests = guestElement.value;
    var alarm = {
      1: '1 комната - "для 1 гостя"',
      2: '2 комнаты - "для 2 гостей" или "для 1 гостя"',
      3: '3 комнаты - "для 3 гостей", "для 2 гостей" или "для 1 гостя"',
      100: '100 комнат - "не для гостей"',
    };

    function setAlarmStyle(roomsCount) {
      roomElement.setCustomValidity(alarm[roomsCount]);
      selectedItems(roomElement);
    }

    function setOrdinaryStyle() {
      roomElement.setCustomValidity('');
      unselectItems(roomElement);
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

  function onInvalidTitle() {

    if (titleElement.validity.valueMissing) {
      titleElement.setCustomValidity('Обязательное поле!');
    } else {
      titleElement.setCustomValidity('');
    }
  }

  function onInputTitle() {
    var valueLength = titleElement.value.length;

    if (valueLength < window.cfg.valid.TITLE_LENGTH_MIN) {
      titleElement.setCustomValidity('Ещё ' + (window.cfg.valid.TITLE_LENGTH_MIN - valueLength) + ' симв.');
    } else if (valueLength > window.cfg.valid.TITLE_LENGTH_MAX) {
      titleElement.setCustomValidity('Удалите лишние ' + (valueLength - window.cfg.valid.TITLE_LENGTH_MAX) + ' симв.');
    } else {
      titleElement.setCustomValidity('');
    }
  }

  function onTimeinChange(evt) {
    onTimeinTimeoutChange(evt);
  }

  function onTimeoutChange(evt) {
    onTimeinTimeoutChange(evt);
  }

  function onTimeinTimeoutChange(evt) {

    var name = evt.target.name;

    if (name === 'timein') {
      timeoutElement.value = timeinElement.value;
    } else if (name === 'timeout') {
      timeinElement.value = timeoutElement.value;
    }

  }

  // поле адреса в форме
  var address = {

    element: document.querySelector('#address'),

    // вычисление координат в виде {x,y} в зависимости от расположения маркера и состояния
    getCoord: function (marker, markerState) {
      var width = 0;
      var height = 0;

      switch (markerState) {
        case 'active':
          height = window.cfg.mark.MAIN_ACTIVE_HEIGHT;
          width = window.cfg.mark.MAIN_ACTIVE_WIDTH;
          break;
        case 'inactive':
          height = window.cfg.mark.MAIN_INACTIVE_HEIGHT;
          width = window.cfg.mark.MAIN_INACTIVE_WIDTH;
          break;
        default:
          width = window.cfg.mark.WIDTH;
          height = window.cfg.mark.HEIGHT;
          break;
      }

      var x = Math.round(parseInt(marker.style.left, 10) + width / 2);
      var y = Math.round(parseInt(marker.style.top, 10) + height);

      return {
        x: x,
        y: y
      };

    },

    // заполнение поля адреса
    setAddress: function (marker, markerState) {
      var coord = this.getCoord(marker, markerState);
      this.element.value = coord.x + ',' + coord.y;
    },

  };

  // для отладки - быстрое заполнение значений формы
  function init() {
    titleElement.value = '1234567890- 1234567890- 1234567890-';
    guestElement.value = '1';
    priceElement.value = '1001';
  }
  init();

  return {
    setAddress: address.setAddress.bind(address),
  };

})();
