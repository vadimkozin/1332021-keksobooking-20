'use strict';
// форма объявления

window.form = (function () {
  var roomNumber = document.querySelector('#room_number');
  var guestsNumber = document.querySelector('#capacity');
  var typeHousing = document.querySelector('#type');
  var price = document.querySelector('#price');
  var title = document.querySelector('#title');
  var timein = document.querySelector('#timein');
  var timeout = document.querySelector('#timeout');
  var addressField = document.querySelector('#address');
  var adForm = document.querySelector('.ad-form');
  var adFormSubmit = adForm.querySelector('button.ad-form__submit');
  var adFormReset = adForm.querySelector('button.ad-form__reset');

  adForm.addEventListener('invalid', onInvalidAdForm, true);
  adForm.addEventListener('input', onInputAdForm, false);
  roomNumber.addEventListener('change', onChangeRoomsGuests, false);
  guestsNumber.addEventListener('change', onChangeRoomsGuests, false);
  adFormSubmit.addEventListener('click', onSubmitAdForm, false);
  adFormReset.addEventListener('click', onResetAdForm, false);

  typeHousing.addEventListener('change', onChangeTypeHousing, false);

  timein.addEventListener('change', onChangeTimeInOut, false);
  timeout.addEventListener('change', onChangeTimeInOut, false);

  // при загрузке синхронизируем "Тип жилья" и "Цена за ночь"
  synchronizeTypeWithPrice(typeHousing.value, true);

  function synchronizeTypeWithPrice(type, loading) {
    loading = loading || false;
    var minPrice = window.cfg.types[type]['minPrice'];

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
    element.style.outline = '2px solid red';
  }

  function unselectItem(element) {
    element.style.outline = 'none';
  }

  function onInvalidAdForm(evt) {
    var element = evt.target;
    selectedItem(element);

    if (evt.target.name === 'title') {
      onInvalidTitle(evt);
    }
  }

  function onInputAdForm(evt) {
    var element = evt.target;

    if (element.validity.valid) {
      unselectItem(element);
    } else {
      selectedItem(element);
    }

    if (evt.target.name === 'title') {
      onInputTitle(evt);
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

  function onResetAdForm() {
    var savedAddress = addressField.value;

    adForm.reset();

    setTimeout(function () {
      addressField.value = savedAddress;
    }, 100);

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

  function onInvalidTitle() {

    if (title.validity.valueMissing) {
      title.setCustomValidity('Обязательное поле!');
    } else {
      title.setCustomValidity('');
    }
  }

  function onInputTitle() {
    var valueLength = title.value.length;

    if (valueLength < window.cfg.valid.TITLE_LENGTH_MIN) {
      title.setCustomValidity('Ещё ' + (window.cfg.valid.TITLE_LENGTH_MIN - valueLength) + ' симв.');
    } else if (valueLength > window.cfg.valid.TITLE_LENGTH_MAX) {
      title.setCustomValidity('Удалите лишние ' + (valueLength - window.cfg.valid.TITLE_LENGTH_MAX) + ' симв.');
    } else {
      title.setCustomValidity('');
    }
  }

  function onChangeTimeInOut(evt) {

    var name = evt.target.name;

    if (name === 'timein') {
      timeout.value = timein.value;
    } else if (name === 'timeout') {
      timein.value = timeout.value;
    }

  }

})();
