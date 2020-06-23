'use strict';
// карточка объявления

window.card = (function () {

  // вспомогательные функции
  var func = {
    // возвращает название жилья по его типу
    getNameHousing: function (type) {
      return window.cfg.types[type]['name'] ? window.cfg.types[type]['name'] : '';
    },

    /**
     * Склонение слова (оригинал: https://inter-net.pro/javascript/sklonenie-okonchanij)
     * @param {number} number - число
     * @param {array} txt - варианты склонений слова
     * @return {string}
     * declensionWord(1, ['гостя', 'гостей', '???']); // -> гостя
     * declensionWord(20, ['комната', 'комнаты', 'комнат']); // -> комнат)
     */
    declensionWord: function (number, txt) {
      var cases = [2, 0, 1, 1, 1, 2];
      return txt[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    },

    // строит фразу типа: "2 комнаты для 1 гостя"
    buildPhrase: function (rooms, guests) {
      return rooms + ' ' + this.declensionWord(rooms, ['комната', 'комнаты', 'комнат']) + ' для ' +
            guests + ' ' + this.declensionWord(guests, ['гостя', 'гостей', 'гостей']);
    },

  };

  var card = {
    // ссылка на шаблон карточки
    cardTemplate: document.querySelector('#card').content.querySelector('.popup'),

    // ссылка на кнопку закрытия карточки
    cardClose: undefined,

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

    // отображение фотографий Предложения в карточке
    renderPhotosToElement: function (element, offer) {
      if (offer.offer.photos.length) {
        for (var i = 0; i < offer.offer.photos.length; i++) {
          var img = element.cloneNode(true);
          img.src = offer.offer.photos[i];
          element.after(img);
        }
      }
      element.remove();
    },

    // подготовка карточки для отображения
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

      // обработчик на кнопку закрытия карточки
      this.cardClose = element.querySelector('.popup__close');
      this.cardClose.addEventListener('click', this.onClickCardClose.bind(this));
      this.cardClose.addEventListener('keydown', this.onKeydownCardClose.bind(this));
      element.addEventListener('keydown', this.onKeydownCard.bind(this));

      return element;
    },

    // карточка добавляется в DocumentFragment
    createFragmentCard: function (offer) {
      var fragment = document.createDocumentFragment();

      fragment.appendChild(this.prepareCard(offer, this.cardTemplate));

      return fragment;
    },

    // функция обратного вызова, применяется при закрытии карточки
    // поле заполняется извне этого объекта в момент создания карточки
    cbOnCloseCard: undefined,

    // обработчик на кнопку закрытия по клику мышкой
    onClickCardClose: function () {
      this.close();
    },

    // обработчик на кнопку закрытия по нажатию клавиши Enter
    onKeydownCardClose: function (evt) {
      window.util.isEnterEvent(evt, this.close.bind(this));
    },

    // обработчик нажания клавиши Escape при фокусе на карточке
    onKeydownCard: function (evt) {
      window.util.isEscEvent(evt, this.close.bind(this));
    },

    // закрытие карточки
    close: function () {

      if (this.cardClose) {
        this.cardClose.closest('.popup').remove();
        this.cardClose.removeEventListener('click', this.onClickCardClose);
      }

      if (this.cbOnCloseCard && typeof this.cbOnCloseCard === 'function') {
        this.cbOnCloseCard();
      }
    },

    // открытие карточки (добавление в DOM c данными offer перед элементом where.)
    open: function (offer, where, cbOnCloseCard) {
      where.before(this.createFragmentCard(offer));
      this.cbOnCloseCard = cbOnCloseCard;
    },

  };

  return {
    open: card.open.bind(card),
    close: card.close.bind(card),
  };

})();
