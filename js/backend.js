'use strict';
window.backend = (function () {
  var StatusCode = {
    OK: 200,
    SERVER_ERROR: 500,
  };
  var TIMEOUT_IN_MS = 10 * 1000; // 10s
  var ERR_CONNECT = 'Произошла ошибка соединения';
  var ERR_TIMEOUT = 'Запрос не успел выполниться за ' + TIMEOUT_IN_MS + 'мс';
  var URL_SAVE = 'https://javascript.pages.academy/keksobooking';


  function load(url, onLoad, onError) {

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onLoad(xhr.response);
      } else {
        onError(createMessage(xhr));
      }
    });
    xhr.addEventListener('error', function () {
      onError(ERR_CONNECT);
    });
    xhr.addEventListener('timeout', function () {
      onError(ERR_TIMEOUT);
    });

    xhr.timeout = TIMEOUT_IN_MS;

    xhr.open('GET', url);
    xhr.send();
  }

  function save(data, onLoad, onError) {

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status >= StatusCode.SERVER_ERROR) {
        onError(createMessage(xhr));
      } else {
        onLoad(xhr.response);
      }
    });
    xhr.addEventListener('error', function () {
      onError(ERR_CONNECT);
    });
    xhr.addEventListener('timeout', function () {
      onError(ERR_TIMEOUT);
    });

    xhr.open('POST', URL_SAVE);
    xhr.send(data);

  }

  function createMessage(xhr) {
    return xhr.statusText + ' (' + xhr.status + ')\r\n' + xhr.responseURL;
  }

  return {
    load: load,
    save: save,
  };

})();
