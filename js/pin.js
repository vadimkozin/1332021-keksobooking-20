'use strict';
// создание метки на карте

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

    // getLocation__: function (offer) {
    //   var address = this.trimSpaces(offer.offer.address).split(','); // '100, 200' -> ['100','200'];
    //   var left = Math.round((Number(address[0]) - window.cfg.mark.WIDTH / 2)) + 'px';
    //   var top = Math.round((Number(address[1]) - window.cfg.mark.HEIGHT)) + 'px';

    //   return 'left:' + left + ';top:' + top + ';'; // "left: 100px; top:20px;"
    // },
  };

  // ТЗ: Итоговую разметку метки .map__pin можно взять из шаблона #pin
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  return {

    // создание метки одного Предложения для отображения на карте
    // метку связываем с данными из offer через атрибут dataset

    createPin: function (offer) {
      var element = pinTemplate.cloneNode(true);
      element.setAttribute('data-offer-id', offer.id);
      var img = element.querySelector('img');

      img.src = offer.author.avatar;
      img.alt = offer.offer.title;
      element.style = func.getLocation(offer);

      return element;
    },

  };

})();
