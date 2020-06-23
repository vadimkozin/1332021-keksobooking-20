'use strict';
// вывод сообщений на экран

window.message = (function () {

  // ссылки на шаблоны сообщений
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var mainElement = document.querySelector('main');

  function showSuccess() {
    prepareElement(successTemplate.cloneNode(true));
  }

  function showError(message) {
    var element = errorTemplate.cloneNode(true);
    element.querySelector('.error__message').textContent = message;
    element.querySelector('.error__button').addEventListener('click', onErrorButtonClick);
    prepareElement(element);
  }

  function prepareElement(element) {
    element.setAttribute('tabindex', '0');
    element.addEventListener('click', onMessageClick);
    element.addEventListener('keydown', onMessageKeydown);
    mainElement.insertAdjacentElement('afterbegin', element);
  }

  function onMessageClick(evt) {
    var classParent = evt.target.className.split('__')[0]; // success__message || error__message
    evt.target.closest('.' + classParent).remove(); // classParent: success || error
  }

  function onMessageKeydown(evt) {
    window.util.isEscEvent(evt, function () {
      evt.target.remove();
    });
  }

  function onErrorButtonClick(evt) {
    evt.target.closest('.error').remove();
  }

  return {
    showSuccess: showSuccess,
    showError: showError,
  };

})();
