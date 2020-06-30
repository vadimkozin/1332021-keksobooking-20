'use strict';
// отбор Предложений через форму-фильтр

window.filter = (function () {
  var type = document.querySelector('#housing-type');

  type.addEventListener('change', onTypeChange);

  function onTypeChange(evt) {

    window.card.close();

    var items = window.map.showPins({type: evt.target.value});

    window.pin.installHandlersOnMapPins(items);

  }

})();
