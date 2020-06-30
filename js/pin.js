'use strict';
// метки на карте

window.pin = (function () {

  var func = {
    trimSpaces: function (str) {
      return str.replace(/\s/g, '');
    },

    getLocation: function (offer) {

      var left = Math.round((Number(offer.location.x) - window.cfg.mark.WIDTH / 2)) + 'px';
      var top = Math.round((Number(offer.location.y) - window.cfg.mark.HEIGHT)) + 'px';

      return 'left:' + left + ';top:' + top + ';'; // "left: 100px; top:20px;"
    },

  };

  // ТЗ: Итоговую разметку метки .map__pin можно взять из шаблона #pin
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  // создание метки одного Предложения для отображения на карте
  // метку связываем с данными из offer через атрибут dataset
  function createPin(offer) {
    var element = pinTemplate.cloneNode(true);
    element.setAttribute('data-offer-id', offer.id);
    var img = element.querySelector('img');

    img.src = offer.author.avatar;
    img.alt = offer.offer.title;
    element.style = func.getLocation(offer);

    return element;
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

  return {
    createPin: createPin,
    installHandlersOnMapPins: pins.installHandlersOnMapPins.bind(pins),
    removeHandlersOnMapPins: pins.removeHandlersOnMapPins.bind(pins),
  };

})();
