'use strict';
// главный модуль

window.main = (function () {

  function getLocation(element) {
    return {
      left: element.style.left,
      top: element.style.top,
    };
  }

  // главная метка
  var mainPin = {

    // ссылка на главную метку
    element: document.querySelector('.map__pin--main'),

    // местоположение главной метки по умолчанию
    location: null,

    setLocationDefault: function () {
      if (this.location) {
        this.element.style.left = this.location.left;
        this.element.style.top = this.location.top;
      }
    },

    // установка обработчиков на главную метку
    installHandle: function () {
      // this.element.addEventListener('mousedown', onMousedownMapPinMain);
      this.element.addEventListener('keydown', onKeydownMapPinMain);
    },

    // снятие обработчиков с главной метки
    removeHandle: function () {
      // this.element.removeEventListener('mousedown', onMousedownMapPinMain);
      this.element.removeEventListener('keydown', onKeydownMapPinMain);
    },

  };

  // function onMousedownMapPinMain(evt) {
  //   window.util.isLeftMouseButtonClick(evt, goActiveState);
  // }

  function onKeydownMapPinMain(evt) {
    window.util.isEnterEvent(evt, goActiveState);
  }

  var pins = (function () {
    var mapPins = [];
    var className = 'map__pin--active';

    function installHandlersOnMapPins(pinElements) {
      mapPins = pinElements;
      for (var i = 0; i < mapPins.length; i++) {
        mapPins[i].addEventListener('click', onClickMapPin);
      }
    }

    function removeHandlersOnMapPins() {
      for (var i = 0; i < mapPins.length; i++) {
        mapPins[i].removeEventListener('click', onClickMapPin);
        mapPins[i].remove();
      }
    }

    function onClickMapPin(evt) {

      var parent = evt.target.closest('button');
      var offerId = Number(parent.dataset.offerId);
      var offer = window.data.getOfferById(offerId);

      window.card.close();

      window.card.open(offer, parent, deselectAllPins);

      parent.classList.add(className);

    }

    function deselectAllPins() {
      for (var j = 0; j < mapPins.length; j++) {
        mapPins[j].classList.remove(className);
      }
    }

    return {
      installHandlersOnMapPins: installHandlersOnMapPins,
      removeHandlersOnMapPins: removeHandlersOnMapPins,
    };

  })();

  function goActiveState() {
    // перевод элементов в активное состояние
    window.state.setActiveState();
    // заполнение поля адреса в активном состоянии
    window.form.setAddress(mainPin.element, 'active');
    // отрисовка похожих объявлений-меток на карте
    var mapPins = window.map.showPins();
    // установка обработчиков на метки
    pins.installHandlersOnMapPins(mapPins);
    // снятие обработчиков с главной метки
    mainPin.removeHandle();
    // запоминаем положение главной метки
    if (!mainPin.location) {
      mainPin.location = getLocation(mainPin.element);
    }
  }

  function goInActiveState() {
    // главная метка
    mainPin.setLocationDefault();

    // ТЗ: сначала НЕ активное состояние
    window.state.setInactiveState();

    // ТЗ: Поле адреса должно быть заполнено всегда, в том числе сразу после открытия страницы (в неактивном состоянии).
    window.form.setAddress(mainPin.element, 'inactive');

    // снятие обработчиков с меток
    pins.removeHandlersOnMapPins();

    // установка обработчиков на главную метку
    mainPin.installHandle();

    // закрытие карточки, если открыта
    window.card.close();
  }

  // Подготовка главной метки к перетаскиванию
  var options = {
    size: window.util.getElementSize(document.querySelector('.map__pins')), // размер {width, hieght} поля перемещения метки
    objHeight: window.cfg.mark.MAIN_ACTIVE_HEIGHT, // высота передвигаемого объекта
    objWidth: window.cfg.mark.MAIN_ACTIVE_WIDTH, // ширина передвигаемого объекта
  };

  var onMainPinMove = function () {
    window.form.setAddress(mainPin.element, 'active');
  };

  function start() {
    goInActiveState();
    window.move.init(mainPin.element, mainPin.element, options, goActiveState, onMainPinMove);
  }

  start();

  return {
    start: start,
  };

})();
