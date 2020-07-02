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
      // this.element.addEventListener('mousedown', onElementMousedown);
      this.element.addEventListener('keydown', onElementKeydown);
    },

    // снятие обработчиков с главной метки
    removeHandle: function () {
      // this.element.removeEventListener('mousedown', onElementMousedown);
      this.element.removeEventListener('keydown', onElementKeydown);
    },

  };

  // function onElementMousedown(evt) {
  //   window.util.isLeftMouseButtonClick(evt, goActiveState);
  // }

  function onElementKeydown(evt) {
    window.util.isEnterEvent(evt, goActiveState);
  }

  function goActiveState() {

    window.data.readOffers(onDataRead);

    function onDataRead() {
      // перевод элементов в активное состояние
      window.state.setActiveState();

      // заполнение поля адреса в активном состоянии
      window.form.setAddress(mainPin.element, 'active');

      // отрисовка похожих объявлений-меток на карте
      window.map.showPins();

      // снятие обработчиков с главной метки
      mainPin.removeHandle();

      // запоминаем положение главной метки
      if (!mainPin.location) {
        mainPin.location = getLocation(mainPin.element);
      }
    }

  }

  function goInActiveState() {
    // главная метка
    mainPin.setLocationDefault();

    // ТЗ: сначала НЕ активное состояние
    window.state.setInactiveState();

    // ТЗ: Поле адреса должно быть заполнено всегда, в том числе сразу после открытия страницы (в неактивном состоянии).
    window.form.setAddress(mainPin.element, 'inactive');

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
